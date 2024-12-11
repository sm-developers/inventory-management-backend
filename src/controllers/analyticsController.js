const { Parser } = require('json2csv');
const SalesModel = require('../models/Sales');
const InventoryModel = require('../models/Inventory');
const { sendEmail } = require('../utils/emailService');

class AnalyticsController {
    static async getSalesSummary(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const allSales = (await SalesModel.getAllSales()).Items;

            // Filter sales by date range
            const filteredSales = allSales.filter((sale) => {
                const saleDate = new Date(sale.saleDate);
                return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
            });

            // Calculate total sales
            const totalSales = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);

            // Group by itemId and calculate totals
            const itemSales = filteredSales.reduce((acc, sale) => {
                acc[sale.itemId] = (acc[sale.itemId] || 0) + sale.quantity;
                return acc;
            }, {});

            res.status(200).json({ totalSales, itemSales });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching sales summary', error: err.message });
        }
    }

    static async getLowStockItems(req, res) {
        try {
            const allItems = (await InventoryModel.getAllItems()).Items;

            // Find items with low stock (e.g., less than 5 units)
            const lowStockItems = allItems.filter((item) => item.quantity < 5);

            res.status(200).json({ lowStockItems });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching low-stock items', error: err.message });
        }
    }

    static async getInventoryValue(req, res) {
        try {
            const allItems = (await InventoryModel.getAllItems()).Items;

            // Calculate total inventory value
            const totalValue = allItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

            res.status(200).json({ totalValue });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching inventory value', error: err.message });
        }
    }

    static async exportSalesReport(req, res) {
        try {
            const allSales = (await SalesModel.getAllSales()).Items;

            const fields = ['saleId', 'itemId', 'quantity', 'userId', 'customerName', 'customerMobile', 'saleDate'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(allSales);

            res.header('Content-Type', 'text/csv');
            res.attachment('sales-report.csv');
            res.status(200).send(csv);
        } catch (err) {
            res.status(500).json({ message: 'Error exporting sales report', error: err.message });
        }
    }

    static async exportInventoryReport(req, res) {
        try {
            const allItems = (await InventoryModel.getAllItems()).Items;

            const fields = ['itemId', 'name', 'quantity', 'price'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(allItems);

            res.header('Content-Type', 'text/csv');
            res.attachment('inventory-report.csv');
            res.status(200).send(csv);
        } catch (err) {
            res.status(500).json({ message: 'Error exporting inventory report', error: err.message });
        }
    }

    static async notifyLowStock(req, res) {
        try {
            const allItems = (await InventoryModel.getAllItems()).Items;

            const lowStockItems = allItems.filter((item) => item.quantity < 5);
            if (lowStockItems.length === 0) {
                return res.status(200).json({ message: 'No low-stock items' });
            }

            const emailText = lowStockItems
                .map((item) => `Item: ${item.name} (ID: ${item.itemId}) has low stock: ${item.quantity}`)
                .join('\n');

            await sendEmail('manager@example.com', 'Low Stock Alert', emailText);

            res.status(200).json({ message: 'Low-stock notification sent successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error sending low-stock notifications', error: err.message });
        }
    }

}

module.exports = AnalyticsController;
