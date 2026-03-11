const productService = require('../services/product.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { productSchema } = require('../validators/product.validator');

const createProduct = asyncHandler(async (req, res) => {
    let productData = req.body;
    if (req.file) {
        productData.image = req.file.path;
    }
    const validatedData = productSchema.parse(productData);
    const result = await productService.createProduct(validatedData);
    apiResponse(res, 201, "Product created successfully", result);
});

const getProducts = asyncHandler(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    apiResponse(res, 200, "Products retrieved successfully", result);
});

const getProduct = asyncHandler(async (req, res) => {
    const result = await productService.getProductById(req.params.id);
    apiResponse(res, 200, "Product details retrieved", result);
});

const updateProduct = asyncHandler(async (req, res) => {
    let updateData = req.body;
    if (req.file) {
        updateData.image = req.file.path;
    }
    const validatedData = productSchema.parse(updateData);
    const result = await productService.updateProduct(req.params.id, validatedData);
    apiResponse(res, 200, "Product updated successfully", result);
});

const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    apiResponse(res, 200, "Product deleted successfully");
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};
