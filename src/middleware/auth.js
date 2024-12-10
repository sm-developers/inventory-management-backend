const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token received:', token); // Debug log for token

    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded); // Debug log for decoded token
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message); // Debug log for errors
        res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};


// Middleware to check roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
