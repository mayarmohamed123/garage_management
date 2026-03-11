const express = require('express');
const router = express.Router();
const { generateInvoice, getInvoices, getInvoice, updateInvoiceStatus } = require('../controllers/invoice.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.post('/', authorize('Admin', 'Manager', 'Accountant'), generateInvoice);
router.get('/', authorize('Admin', 'Manager', 'Accountant'), getInvoices);
router.get('/:id', authorize('Admin', 'Manager', 'Accountant'), getInvoice);
router.patch('/:id/status', authorize('Admin', 'Accountant'), updateInvoiceStatus);

module.exports = router;
