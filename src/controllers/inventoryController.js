const InventoryModel = require('../models/Inventory');

class InventoryController {
    static async createItem(req, res) {
        try {
            const { itemId, name, quantity, price } = req.body;

            const item = { itemId, name, quantity, price };
            await InventoryModel.createItem(item);

            res.status(201).json({ message: 'Item created successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error creating item', error: err.message });
        }
    }

    static async getItem(req, res) {
        try {
            const { itemId } = req.params;

            const item = (await InventoryModel.getItemById(itemId)).Item;
            if (!item) return res.status(404).json({ message: 'Item not found' });

            res.status(200).json(item);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching item', error: err.message });
        }
    }

    static async updateItem(req, res) {
        try {
            const { itemId } = req.params;
            const updates = req.body;

            await InventoryModel.updateItem(itemId, updates);

            res.status(200).json({ message: 'Item updated successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error updating item', error: err.message });
        }
    }

    static async deleteItem(req, res) {
        try {
            const { itemId } = req.params;

            await InventoryModel.deleteItem(itemId);

            res.status(200).json({ message: 'Item deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting item', error: err.message });
        }
    }
}

module.exports = InventoryController;
