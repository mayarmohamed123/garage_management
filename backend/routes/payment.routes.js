const express = require('express');
const router = express.Router({ mergeParams: true });
const { recordPayment, getPayments } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.post('/', authorize('Admin', 'Manager', 'Accountant'), recordPayment);
router.get('/', authorize('Admin', 'Manager', 'Accountant'), getPayments);

module.exports = router;
