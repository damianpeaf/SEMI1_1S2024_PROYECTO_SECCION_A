export default {
    PORT: process.env.PORT || 3001,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    FRONTEND_URL: process.env.FRONTEND_URL || '',
    JWT_SECRET: process.env.ACCESS_TOKEN_SECRET,

    // Database
    DB_HOST: process.env.DB_HOST || '',
    DB_PORT: process.env.DB_PORT || '',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || '',
}