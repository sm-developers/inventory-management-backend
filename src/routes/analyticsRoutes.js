const express = require('express');
const AnalyticsController = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/analytics/sales-summary:
 *   get:
 *     summary: Get sales summary for a date range
 *     tags:
 *       - Analytics
 *     parameters:
 *       - name: startDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - name: endDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved sales summary
 *       500:
 *         description: Error fetching sales summary
 */
router.get('/sales-summary', authenticate, authorize('admin'), AnalyticsController.getSalesSummary);

/**
 * @swagger
 * /api/analytics/low-stock:
 *   get:
 *     summary: Get low-stock items
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Successfully retrieved low-stock items
 *       500:
 *         description: Error fetching low-stock items
 */
router.get('/low-stock', authenticate, authorize('admin', 'inventoryManager'), AnalyticsController.getLowStockItems);

/**
 * @swagger
 * /api/analytics/inventory-value:
 *   get:
 *     summary: Get total inventory value
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Successfully retrieved inventory value
 *       500:
 *         description: Error fetching inventory value
 */
router.get('/inventory-value', authenticate, authorize('admin'), AnalyticsController.getInventoryValue);

module.exports = router;
