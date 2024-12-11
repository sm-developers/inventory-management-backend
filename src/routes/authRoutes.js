const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// User registration
router.post('/register', authenticate, authorize('admin'), AuthController.register);

// User login
router.post('/login', AuthController.login);

module.exports = router;
