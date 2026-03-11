const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.use(protect);

router.post('/', authorize('Admin', 'Manager'), upload.single('image'), createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', authorize('Admin', 'Manager'), upload.single('image'), updateProduct);
router.delete('/:id', authorize('Admin'), deleteProduct);

module.exports = router;
