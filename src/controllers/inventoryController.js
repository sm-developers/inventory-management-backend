const InventoryModel = require('../models/Inventory');
const redisClient = require('../utils/redisClient');

class InventoryController {
    static async createItem(req, res) {
        try {
            const { itemId, name, quantity, price } = req.body;

            const item = { itemId, name, quantity, price };
            await InventoryModel.createItem(item);

            // Remove item from cache if it exists
            await redisClient.del(`inventory:${itemId}`);

            res.status(201).json({ message: 'Item created successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error creating item', error: err.message });
        }
    }

    static async getItem(req, res) {
        try {
            const { itemId } = req.params;

            // Check Redis cache first
            const cachedItem = await redisClient.get(`inventory:${itemId}`);
            if (cachedItem) {
                return res.status(200).json(JSON.parse(cachedItem));
            }

            // Fetch item from DynamoDB if not cached
            const item = (await InventoryModel.getItemById(itemId)).Item;
            if (!item) return res.status(404).json({ message: 'Item not found' });

            // Cache the item in Redis
            await redisClient.set(`inventory:${itemId}`, JSON.stringify(item), {
                EX: 3600, // Cache for 1 hour
            });

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

            // Update cache
            const updatedItem = (await InventoryModel.getItemById(itemId)).Item;
            await redisClient.set(`inventory:${itemId}`, JSON.stringify(updatedItem), {
                EX: 3600,
            });

            res.status(200).json({ message: 'Item updated successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error updating item', error: err.message });
        }
    }

    static async deleteItem(req, res) {
        try {
            const { itemId } = req.params;

            await InventoryModel.deleteItem(itemId);

            // Remove from cache
            await redisClient.del(`inventory:${itemId}`);

            res.status(200).json({ message: 'Item deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting item', error: err.message });
        }
    }
}

module.exports = InventoryController;
