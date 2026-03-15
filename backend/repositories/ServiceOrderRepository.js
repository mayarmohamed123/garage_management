const BaseRepository = require('./BaseRepository');
const ServiceOrder = require('../models/ServiceOrder');

class ServiceOrderRepository extends BaseRepository {
    constructor() {
        super(ServiceOrder);
    }

    async findByOrderNumber(orderNumber) {
        return await this.model.findOne({ where: { orderNumber } });
    }
}

module.exports = new ServiceOrderRepository();
