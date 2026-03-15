const BaseRepository = require('./BaseRepository');
const Product = require('../models/Product');

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }

    async findBySku(sku) {
        return await this.model.findOne({ where: { sku } });
    }
}

module.exports = new ProductRepository();
