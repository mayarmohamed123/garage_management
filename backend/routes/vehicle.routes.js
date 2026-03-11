const express = require('express');
const router = express.Router();
const { registerVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicle.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.post('/', authorize('Admin', 'Manager'), registerVehicle);
router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.put('/:id', authorize('Admin', 'Manager'), updateVehicle);
router.delete('/:id', authorize('Admin'), deleteVehicle);

module.exports = router;
