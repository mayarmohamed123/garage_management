const productRepository = require('../repositories/ProductRepository');
const { Op } = require('sequelize');

class ProductService {
    async createProduct(productData) {
        return await productRepository.create(productData);
    }

    async getAllProducts(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { sku: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await productRepository.findAndCountAll({
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
        const product = await productRepository.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async updateProduct(id, updateData) {
        const result = await productRepository.update(id, updateData);
        if (!result) throw new Error('Product not found');
        return result;
    }

    async deleteProduct(id) {
        const result = await productRepository.delete(id);
        if (!result) throw new Error('Product not found');
        return true;
    }
}

module.exports = new ProductService();
