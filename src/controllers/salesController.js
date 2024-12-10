const SalesModel = require('../models/Sales');

class SalesController {
    static async createSale(req, res) {
        try {
            const { saleId, itemId, quantity, salesPerson, customerName } = req.body;

            const sale = { saleId, itemId, quantity, salesPerson, customerName };
            await SalesModel.createSale(sale);

            res.status(201).json({ message: 'Sale recorded successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error recording sale', error: err.message });
        }
    }

    static async getAllSales(req, res) {
        try {
            const sales = (await SalesModel.getAllSales()).Items;
            res.status(200).json(sales);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching sales', error: err.message });
        }
    }
}

module.exports = SalesController;
