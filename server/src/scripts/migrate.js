import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigration() {
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  const sql = await fs.promises.readFile(schemaPath, 'utf8');

  // Connect without database initially so CREATE DATABASE IF NOT EXISTS works cleanly
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('Executing database schema from schema.sql...');
    await connection.query(sql);
    console.log('✓ Database tables created / verified successfully.');
  } catch (err) {
    console.error('Migration error:', err.message);
    throw err;
  } finally {
    await connection.end();
  }
}

// If run directly from command line (e.g., node src/scripts/migrate.js)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigration()
    .then(() => {
      console.log('Migration finished.');
      process.exit(0);
    })
    .catch(() => process.exit(1));
}
