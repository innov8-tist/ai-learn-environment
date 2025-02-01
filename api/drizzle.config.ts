import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/database/schema',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DB_LOCAL_URL!,
    }
});
