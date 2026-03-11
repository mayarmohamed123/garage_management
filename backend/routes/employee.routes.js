const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee, updateEmployee, deleteEmployee, updateRole, toggleStatus } = require('../controllers/employee.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);
router.use(authorize('Admin', 'Manager'));

router.get('/', getEmployees);
router.post('/', authorize('Admin'), createEmployee);
router.put('/:id', authorize('Admin'), updateEmployee);
router.delete('/:id', authorize('Admin'), deleteEmployee);
router.patch('/:id/role', authorize('Admin'), updateRole);
router.patch('/:id/status', authorize('Admin'), toggleStatus);

module.exports = router;
