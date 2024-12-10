const express = require('express');
const InventoryController = require('../controllers/inventoryController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Routes for inventory operations
router.post('/', authenticate, authorize('admin', 'inventoryManager'), InventoryController.createItem);
router.get('/:itemId', authenticate, authorize('admin', 'inventoryManager'), InventoryController.getItem);
router.put('/:itemId', authenticate, authorize('admin', 'inventoryManager'), InventoryController.updateItem);
router.delete('/:itemId', authenticate, authorize('admin', 'inventoryManager'), InventoryController.deleteItem);

module.exports = router;
