const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function fixAppEvents() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Removendo restrição NOT NULL da coluna user_id...');
    
    // Remover a restrição NOT NULL
    await pool.query(`
      ALTER TABLE "app_events" ALTER COLUMN "user_id" DROP NOT NULL;
    `);
    
    console.log('✓ Restrição removida com sucesso!');
    
    // Verificar estrutura
    const result = await pool.query(`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'app_events' AND column_name = 'user_id';
    `);
    
    console.log('Estrutura atual:', result.rows[0]);
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

fixAppEvents();
