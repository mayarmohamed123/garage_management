const BaseRepository = require('./BaseRepository');
const ServicePart = require('../models/ServicePart');

class ServicePartRepository extends BaseRepository {
    constructor() {
        super(ServicePart);
    }
}

module.exports = new ServicePartRepository();
