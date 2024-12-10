const dynamoDB = require('../utils/dynamodb');

class UserModel {
    static async createUser(user) {
        const params = {
            TableName: 'Users',
            Item: user,
        };
        return dynamoDB.put(params).promise();
    }

    static async getUserById(userId) {
        const params = {
            TableName: 'Users',
            Key: { userId },
        };
        return dynamoDB.get(params).promise();
    }
}

module.exports = UserModel;
