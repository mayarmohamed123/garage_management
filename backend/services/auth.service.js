const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

class AuthService {
    async register(userData) {
        const { email, password } = userData;
        
        // Check if user exists
        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await userRepository.create({
            ...userData,
            password: hashedPassword
        });

        console.log(`[Auth] User registered: ${user.email} (${user.role})`);

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
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn(`[Auth] Failed login attempt for email: ${email}`);
            throw new Error('Invalid credentials');
        }

        console.log(`[Auth] User logged in: ${user.email} (${user.role})`);

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
