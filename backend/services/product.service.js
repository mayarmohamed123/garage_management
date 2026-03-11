const db = require('../models/index');

class ProductService {
    async createProduct(productData) {
        return await db.products.create(productData);
    }

    async getAllProducts(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            const { Op } = require('sequelize');
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { sku: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await db.products.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return {
            totalItems: count,
            products: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async getProductById(id) {
        const product = await db.products.findByPk(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async updateProduct(id, updateData) {
        const product = await db.products.findByPk(id);
        if (!product) throw new Error('Product not found');
        return await product.update(updateData);
    }

    async deleteProduct(id) {
        const product = await db.products.findByPk(id);
        if (!product) throw new Error('Product not found');
        await product.destroy();
        return true;
    }
}

module.exports = new ProductService();
