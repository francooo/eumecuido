const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function recreateAppEvents() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🗑️  Deletando tabela app_events...');
    await pool.query(`DROP TABLE IF EXISTS "app_events" CASCADE;`);
    console.log('✅ Tabela deletada!');
    
    console.log('\n📝 Recriando tabela app_events...');
    await pool.query(`
      CREATE TABLE "app_events" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER,
        "event_type" TEXT NOT NULL,
        "event_data" TEXT,
        "device_timezone" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela recriada!');
    
    console.log('\n✅ Operação concluída! Agora rode npx drizzle-kit push');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

recreateAppEvents();
