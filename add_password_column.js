const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function addPasswordColumn() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Adding password column to users table...');
    await pool.query(`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" text NOT NULL DEFAULT '';
    `);
    console.log('✓ Password column added successfully!');
  } catch (error) {
    console.error('Error adding password column:', error.message);
  } finally {
    await pool.end();
  }
}

addPasswordColumn();
