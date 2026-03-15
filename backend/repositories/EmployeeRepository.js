const BaseRepository = require('./BaseRepository');
const Employee = require('../models/Employee');

class EmployeeRepository extends BaseRepository {
    constructor() {
        super(Employee);
    }

    async findByUserId(userId) {
        return await this.model.findOne({ where: { userId } });
    }
}

module.exports = new EmployeeRepository();
