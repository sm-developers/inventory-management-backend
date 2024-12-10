const express = require('express');
const SalesController = require('../controllers/salesController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Routes for sales operations
router.post('/', authenticate, authorize('admin', 'sales'), SalesController.createSale);
router.get('/', authenticate, authorize('admin', 'sales'), SalesController.getAllSales);

module.exports = router;
