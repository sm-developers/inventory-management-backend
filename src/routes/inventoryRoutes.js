const express = require('express');
const InventoryController = require('../controllers/inventoryController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Protected routes
router.post('/', authenticate, authorize('admin', 'inventoryManager'), InventoryController.createItem);
router.get('/:itemId', authenticate, authorize('admin', 'inventoryManager'), InventoryController.getItem);

module.exports = router;
