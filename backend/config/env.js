require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || "your_super_secret_jwt_key_12345",
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'garage_management',
    UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads/'
};
