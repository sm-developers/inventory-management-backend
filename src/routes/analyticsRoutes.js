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

/**
 * @swagger
 * /api/analytics/export-sales:
 *   get:
 *     summary: Export sales report as CSV
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Successfully exported sales report
 *       500:
 *         description: Error exporting sales report
 */
router.get('/export-sales', authenticate, authorize('admin'), AnalyticsController.exportSalesReport);

/**
 * @swagger
 * /api/analytics/export-inventory:
 *   get:
 *     summary: Export inventory report as CSV
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Successfully exported inventory report
 *       500:
 *         description: Error exporting inventory report
 */
router.get('/export-inventory', authenticate, authorize('admin', 'inventoryManager'), AnalyticsController.exportInventoryReport);

/**
 * @swagger
 * /api/analytics/notify-low-stock:
 *   get:
 *     summary: Notify inventory managers about low-stock items
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       500:
 *         description: Error sending notification
 */
router.get('/notify-low-stock', authenticate, authorize('admin', 'inventoryManager'), AnalyticsController.notifyLowStock);

module.exports = router;
