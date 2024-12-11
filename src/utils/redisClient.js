const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redisClient.connect();
})();

async function blacklistToken(token, expiryInSeconds) {
    try {
        await redisClient.set(`blacklist:${token}`, 'true', { EX: expiryInSeconds });
    } catch (err) {
        console.error('Error blacklisting token:', err.message);
    }
}

async function isTokenBlacklisted(token) {
    try {
        const result = await redisClient.get(`blacklist:${token}`);
        return !!result; // Returns true if the token is blacklisted
    } catch (err) {
        console.error('Error checking token blacklist:', err.message);
        return false;
    }
}

module.exports = { redisClient, blacklistToken, isTokenBlacklisted };
