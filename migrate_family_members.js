const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function fixFamilyMembersData() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Verificando estrutura atual dos membros da família...');
    
    // Verificar estrutura atual
    const structureCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'family_members' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Estrutura atual:');
    structureCheck.rows.forEach(row => {
      console.log(`   ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Verificar dados existentes
    const existingData = await pool.query(`
      SELECT id, "family_id", "created_by_user_id", name 
      FROM family_members 
      LIMIT 10;
    `);
    
    if (existingData.rows.length > 0) {
      console.log(`\n📊 Encontrados ${existingData.rows.length} registros:`);
      existingData.rows.forEach(row => {
        console.log(`   ID ${row.id}: familyId=${row.family_id}, userId=${row.created_by_user_id}, name="${row.name}"`);
      });
      
      // ATUALIZAR: Garantir que family_id seja igual ao created_by_user_id para isolamento
      console.log('\n🔄 Atualizando registros para isolamento por usuário...');
      const updateResult = await pool.query(`
        UPDATE family_members 
        SET "family_id" = "created_by_user_id"
        WHERE "family_id" IS DISTINCT FROM "created_by_user_id";
      `);
      
      console.log(`✅ ${updateResult.rowCount} registros atualizados!`);
      
      // Verificar após atualização
      const afterUpdate = await pool.query(`
        SELECT id, "family_id", "created_by_user_id", name 
        FROM family_members 
        ORDER BY id 
        LIMIT 10;
      `);
      
      console.log('\n📊 Após atualização:');
      afterUpdate.rows.forEach(row => {
        console.log(`   ID ${row.id}: familyId=${row.family_id}, userId=${row.created_by_user_id}, name="${row.name}"`);
      });
    } else {
      console.log('ℹ️  Nenhum registro encontrado na tabela family_members.');
    }
    
    // Criar índice para performance
    console.log('\n🚀 Criando índice para otimizar queries por usuário...');
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_family_members_user_id 
        ON family_members("createdByUserId");
      `);
      console.log('✅ Índice criado com sucesso!');
    } catch (indexError) {
      console.log('⚠️  Índice pode já existir:', indexError.message);
    }
    
    // Criar índice composto para queries de listagem
    console.log('\n🚀 Criando índice composto para listagem...');
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_family_members_user_active 
        ON family_members("createdByUserId", "isActive");
      `);
      console.log('✅ Índice composto criado com sucesso!');
    } catch (indexError) {
      console.log('⚠️  Índice pode já existir:', indexError.message);
    }
    
    console.log('\n✅ Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

fixFamilyMembersData();
