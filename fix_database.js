const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function fixDatabase() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔧 Corrigindo problemas no banco de dados...');
    
    // 1. Remover restrição NOT NULL de app_events.user_id se existir
    console.log('\n1. Ajustando tabela app_events...');
    await pool.query(`
      ALTER TABLE "app_events" ALTER COLUMN "user_id" DROP NOT NULL;
    `);
    console.log('✅ app_events.user_id agora permite NULL');
    
    // 2. Preencher user_id nulo em app_events com null explícito (já deve estar assim)
    console.log('\n2. Verificando dados nulos...');
    const nullCheck = await pool.query(`
      SELECT COUNT(*) FROM "app_events" WHERE "user_id" IS NULL;
    `);
    console.log(`   Registros com user_id NULL: ${nullCheck.rows[0].count}`);
    
    console.log('\n✅ Banco de dados pronto para migração!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await pool.end();
  }
}

fixDatabase();
