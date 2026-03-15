const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.model.findOne({ where: { email } });
    }

    async findByUsername(username) {
        return await this.model.findOne({ where: { username } });
    }
}

module.exports = new UserRepository();
