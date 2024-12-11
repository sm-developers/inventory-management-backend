const express = require('express');
const InventoryController = require('../controllers/inventoryController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Add a new inventory item
 *     tags:
 *       - Inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item created successfully
 *       500:
 *         description: Error creating item
 */
router.post('/', authenticate, authorize('admin', 'inventoryManager'), InventoryController.createItem);

/**
 * @swagger
 * /api/inventory/{itemId}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags:
 *       - Inventory
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Item not found
 *       500:
 *         description: Error fetching item
 */
router.get('/:itemId', authenticate, authorize('admin', 'inventoryManager'), InventoryController.getItem);

/**
 * @swagger
 * /api/inventory/{itemId}:
 *   put:
 *     summary: Update an inventory item
 *     tags:
 *       - Inventory
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully updated item
 *       500:
 *         description: Error updating item
 */
router.put('/:itemId', authenticate, authorize('admin', 'inventoryManager'), InventoryController.updateItem);

/**
 * @swagger
 * /api/inventory/{itemId}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags:
 *       - Inventory
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item to delete
 *     responses:
 *       200:
 *         description: Successfully deleted item
 *       500:
 *         description: Error deleting item
 */
router.delete('/:itemId', authenticate, authorize('admin', 'inventoryManager'), InventoryController.deleteItem);

module.exports = router;
