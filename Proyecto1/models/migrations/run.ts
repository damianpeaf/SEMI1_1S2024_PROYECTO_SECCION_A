import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import * as tables from '../tables';

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_NAME,
    DB_PORT,
} = process.env;

(async () => {
    const client = new Client({
        connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    });

    await client.connect();
    const db = drizzle(client, { schema: tables });

    await migrate(db, { migrationsFolder: __dirname });

    await client.end();
})();