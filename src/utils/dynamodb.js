const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: process.env.DYNAMODB_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = dynamoDB;
