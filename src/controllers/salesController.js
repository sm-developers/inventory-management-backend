const SalesModel = require('../models/Sales');
const InventoryModel = require('../models/Inventory');
const redisClient = require('../utils/redisClient');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

class SalesController {
    static async createSale(req, res) {
        try {
            const { itemId, quantity, customerName, customerMobile } = req.body;

            // Get userId from the authenticated user
            const userId = req.user.userId;

            // Fetch the item from the inventory
            const item = (await InventoryModel.getItemById(itemId)).Item;
            if (!item) return res.status(404).json({ message: 'Item not found in inventory' });

            // Check if there is enough quantity
            if (item.quantity < quantity) {
                return res.status(400).json({ message: 'Insufficient stock for the item' });
            }

            // Generate saleId using Redis
            const saleId = await redisClient.incr('saleIdCounter');

            // Prepare transaction
            const params = {
                TransactItems: [
                    {
                        Update: {
                            TableName: 'Inventory',
                            Key: { itemId },
                            UpdateExpression: 'SET quantity = quantity - :quantity',
                            ConditionExpression: 'quantity >= :quantity',
                            ExpressionAttributeValues: {
                                ':quantity': quantity,
                            },
                        },
                    },
                    {
                        Put: {
                            TableName: 'Sales',
                            Item: {
                                saleId: `sale${saleId}`,
                                itemId,
                                quantity,
                                userId,
                                customerName,
                                customerMobile,
                                saleDate: new Date().toISOString(),
                            },
                        },
                    },
                ],
            };

            // Execute transaction
            await dynamoDB.transactWrite(params).promise();

            // Invalidate cache for updated item
            await redisClient.del(`inventory:${itemId}`);

            res.status(201).json({
                message: 'Sale recorded successfully',
                saleId: `sale${saleId}`,
            });
        } catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                return res.status(400).json({ message: 'Insufficient stock for the item' });
            }
            res.status(500).json({ message: 'Error recording sale', error: err.message });
        }
    }
}

module.exports = SalesController;
