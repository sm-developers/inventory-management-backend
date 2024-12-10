const redisClient = require('../utils/redisClient');
const SalesModel = require('../models/Sales');
const InventoryModel = require('../models/Inventory');

class SalesController {
    static async createSale(req, res) {
        try {
            const { itemId, quantity, salesPerson, customerName } = req.body;

            // Fetch the item from the inventory
            const item = (await InventoryModel.getItemById(itemId)).Item;
            if (!item) return res.status(404).json({ message: 'Item not found in inventory' });

            // Check if there is enough quantity
            if (item.quantity < quantity) {
                return res.status(400).json({ message: 'Insufficient stock for the item' });
            }

            // Deduct quantity from inventory
            const updatedQuantity = item.quantity - quantity;
            await InventoryModel.updateItem(itemId, { quantity: updatedQuantity });

            // Get next saleId from Redis
            const saleId = await redisClient.incr('saleIdCounter');

            // Record the sale
            const sale = { saleId: `sale${saleId}`, itemId, quantity, salesPerson, customerName };
            await SalesModel.createSale(sale);

            res.status(201).json({ message: 'Sale recorded successfully', saleId: sale.saleId });
        } catch (err) {
            res.status(500).json({ message: 'Error recording sale', error: err.message });
        }
    }

    static async getAllSales(req, res) {
        try {
            const sales = (await SalesModel.getAllSales()).Items;
            res.status(200).json(sales);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching sales', error: err.message });
        }
    }
}

module.exports = SalesController;
