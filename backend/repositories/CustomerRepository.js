const BaseRepository = require('./BaseRepository');
const Customer = require('../models/Customer');

class CustomerRepository extends BaseRepository {
    constructor() {
        super(Customer);
    }

    async findByPhone(phone) {
        return await this.model.findOne({ where: { phone } });
    }
}

module.exports = new CustomerRepository();
