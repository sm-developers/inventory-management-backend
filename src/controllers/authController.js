const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/Users');
const { blacklistToken } = require('../utils/redisClient');
const dotenv = require('dotenv');
dotenv.config();

class AuthController {
    static async register(req, res) {
        try {
            const { userId, name, password, role } = req.body;

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = {
                userId,
                name,
                password: hashedPassword,
                role,
            };
            await UserModel.createUser(user);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error registering user', error: err.message });
        }
    }

    static async login(req, res) {
        try {
            const { userId, password } = req.body;

            // Fetch user
            const user = (await UserModel.getUserById(userId)).Item;
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Validate password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return res.status(401).json({ message: 'Invalid password' });

            // Generate JWT
            const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login successful', token });
        } catch (err) {
            console.error('Error in login:', err.message);
            res.status(500).json({ message: 'Error logging in', error: err.message });
        }
    }

    static async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(400).json({ message: 'No token provided' });

            // Decode the token to find expiry
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            const expiryInSeconds = decoded.exp - Math.floor(Date.now() / 1000);
            if (expiryInSeconds > 0) {
                await blacklistToken(token, expiryInSeconds);
            }

            res.status(200).json({ message: 'Logout successful' });
        } catch (err) {
            res.status(500).json({ message: 'Error logging out', error: err.message });
        }
    }
}

module.exports = AuthController;
