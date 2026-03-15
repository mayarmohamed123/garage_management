require('dotenv').config();

module.exports = {
    PORT: process.env.PORT ,
    JWT_SECRET: process.env.JWT_SECRET ,
    DB_HOST: process.env.DB_HOST ,
    DB_USER: process.env.DB_USER ,
    DB_PASSWORD: process.env.DB_PASSWORD ,
    DB_NAME: process.env.DB_NAME ,
    UPLOAD_PATH: process.env.UPLOAD_PATH 
};
