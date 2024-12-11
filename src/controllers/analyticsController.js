const SalesModel = require('../models/Sales');
const InventoryModel = require('../models/Inventory');

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
}

module.exports = AnalyticsController;
