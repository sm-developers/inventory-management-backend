const SalesModel = require('../../src/models/Sales');

(async () => {
    try {
        // Create a test sale
        const sale = {
            saleId: 'sale1',
            itemId: 'item1',
            quantity: 2,
            salesPerson: 'John Doe',
            customerName: 'Jane Smith',
        };
        await SalesModel.createSale(sale);
        console.log('Sale created successfully');

        // Fetch all sales
        const allSales = await SalesModel.getAllSales();
        console.log('All Sales:', allSales);
    } catch (error) {
        console.error('Error testing Sales model:', error);
    }
})();
