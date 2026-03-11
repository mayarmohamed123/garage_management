const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.post('/', authorize('Admin', 'Manager'), createCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', authorize('Admin', 'Manager'), updateCustomer);
router.delete('/:id', authorize('Admin'), deleteCustomer);

module.exports = router;
