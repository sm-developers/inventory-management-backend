const dynamoDB = require('../utils/dynamodb');

class InventoryModel {
    static async createItem(item) {
        const params = {
            TableName: 'Inventory',
            Item: item,
        };
        return dynamoDB.put(params).promise();
    }

    static async getItemById(itemId) {
        const params = {
            TableName: 'Inventory',
            Key: { itemId },
        };
        return dynamoDB.get(params).promise();
    }

    static async updateItem(itemId, updates) {
        const updateExpression = Object.keys(updates)
            .map((key) => `#${key} = :${key}`)
            .join(', ');

        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        Object.entries(updates).forEach(([key, value]) => {
            expressionAttributeNames[`#${key}`] = key;
            expressionAttributeValues[`:${key}`] = value;
        });

        const params = {
            TableName: 'Inventory',
            Key: { itemId },
            UpdateExpression: `SET ${updateExpression}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW',
        };
        return dynamoDB.update(params).promise();
    }

    static async deleteItem(itemId) {
        const params = {
            TableName: 'Inventory',
            Key: { itemId },
        };
        return dynamoDB.delete(params).promise();
    }

    static async getAllItems() {
        const params = {
            TableName: 'Inventory',
        };
        return dynamoDB.scan(params).promise();
    }
}

module.exports = InventoryModel;
