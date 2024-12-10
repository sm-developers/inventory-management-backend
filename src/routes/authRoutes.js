const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();

// User registration
router.post('/register', AuthController.register);

// User login
router.post('/login', AuthController.login);

module.exports = router;
