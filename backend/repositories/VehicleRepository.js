const BaseRepository = require('./BaseRepository');
const Vehicle = require('../models/Vehicle');

class VehicleRepository extends BaseRepository {
    constructor() {
        super(Vehicle);
    }

    async findByPlateNumber(plateNumber) {
        return await this.model.findOne({ where: { plateNumber } });
    }
}

module.exports = new VehicleRepository();
