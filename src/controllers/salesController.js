const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const SalesModel = require('../models/Sales');
const InventoryModel = require('../models/Inventory');
const redisClient = require('../utils/redisClient');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const dynamoDB = new AWS.DynamoDB.DocumentClient({region: process.env.DYNAMODB_REGION});

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

            // Get the current time in IST
            const istTimeZone = 'Asia/Kolkata';
            const now = new Date();
            const istTime = new Intl.DateTimeFormat('en-IN', {
                timeZone: istTimeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(now);

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
                                saleDate: istTime,
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
