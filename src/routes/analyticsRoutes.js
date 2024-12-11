const express = require('express');
const AnalyticsController = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Analytics Endpoints
router.get('/sales-summary', authenticate, authorize('admin'), AnalyticsController.getSalesSummary);
router.get('/low-stock', authenticate, authorize('admin', 'inventoryManager'), AnalyticsController.getLowStockItems);
router.get('/inventory-value', authenticate, authorize('admin'), AnalyticsController.getInventoryValue);

module.exports = router;
