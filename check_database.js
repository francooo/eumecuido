const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkDatabase() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Checking database structure...\n');
    
    // Check users table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table columns:');
    tableInfo.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
    });
    
    // Check if there are any users
    const users = await pool.query('SELECT id, name, email FROM users LIMIT 5');
    console.log(`\nFound ${users.rowCount} user(s)`);
    if (users.rows.length > 0) {
      console.log('Sample users:');
      users.rows.forEach(user => {
        console.log(`  ${user.id}. ${user.name} <${user.email}>`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
