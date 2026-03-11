const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, addPart, updateOrder } = require('../controllers/serviceOrder.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.post('/', authorize('Admin', 'Manager'), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', authorize('Admin', 'Manager'), updateOrder);
router.patch('/:id/status', authorize('Admin', 'Manager', 'Technician'), updateOrderStatus);
router.post('/:id/parts', authorize('Admin', 'Manager', 'Technician'), addPart);

module.exports = router;
