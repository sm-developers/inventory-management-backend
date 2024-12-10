const InventoryModel = require('../../src/models/Inventory');

(async () => {
    try {
        // Create a test item
        const item = {
            itemId: 'item1',
            name: 'Laptop',
            quantity: 10,
            price: 1000,
        };
        await InventoryModel.createItem(item);
        console.log('Item created successfully');

        // Update the test item
        await InventoryModel.updateItem('item1', { quantity: 20 });
        console.log('Item updated successfully');

        // Fetch the test item
        const fetchedItem = await InventoryModel.getItemById('item1');
        console.log('Fetched Item:', fetchedItem);

        // Delete the test item
        await InventoryModel.deleteItem('item1');
        console.log('Item deleted successfully');
    } catch (error) {
        console.error('Error testing Inventory model:', error);
    }
})();
