const express = require('express');
const SalesController = require('../controllers/salesController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Record a new sale
 *     tags:
 *       - Sales
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               customerName:
 *                 type: string
 *               customerMobile:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sale recorded successfully
 *       400:
 *         description: Insufficient stock
 *       500:
 *         description: Error recording sale
 */
router.post('/', authenticate, authorize('admin', 'sales'), SalesController.createSale);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales records
 *     tags:
 *       - Sales
 *     responses:
 *       200:
 *         description: Successfully retrieved sales records
 *       500:
 *         description: Error fetching sales
 */
router.get('/', authenticate, authorize('admin', 'sales'), SalesController.getAllSales);

module.exports = router;
