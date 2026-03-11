const db = require('../models/index');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

class AuthService {
    async register(userData) {
        const { email, password } = userData;
        
        // Check if user exists
        const userExists = await db.users.findOne({ where: { email } });
        if (userExists) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await db.users.create({
            ...userData,
            password: hashedPassword
        });

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        };
    }

    async login(email, password) {
        const user = await db.users.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        };
    }
}

module.exports = new AuthService();
