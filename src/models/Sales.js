const dynamoDB = require('../utils/dynamodb');

class SalesModel {
    static async createSale(sale) {
        const params = {
            TableName: 'Sales',
            Item: sale,
        };
        return dynamoDB.put(params).promise();
    }

    static async getSaleById(saleId) {
        const params = {
            TableName: 'Sales',
            Key: { saleId },
        };
        return dynamoDB.get(params).promise();
    }

    static async getAllSales() {
        const params = {
            TableName: 'Sales',
        };
        return dynamoDB.scan(params).promise();
    }
}

module.exports = SalesModel;
