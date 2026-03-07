const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function dropNewTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🗑️  Deletando novas tabelas...');
    await pool.query(`DROP TABLE IF EXISTS "app_events" CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS "dose_records" CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS "weight_records" CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS "scheduled_doses" CASCADE;`);
    console.log('✅ Tabelas deletadas!');
    
    console.log('\n✅ Agora rode: npx drizzle-kit push');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

dropNewTables();
