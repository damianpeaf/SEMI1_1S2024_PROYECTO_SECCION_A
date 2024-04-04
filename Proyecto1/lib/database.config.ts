import { defineConfig } from 'drizzle-kit';

const {
    DB_USER,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT
} = process.env;

export default defineConfig({
    schema: 'models/tables/',
    out: 'models/migrations/',
    driver: 'pg',
    dbCredentials: {
        connectionString: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    },
    verbose: true,
    strict: true
})