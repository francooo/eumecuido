const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function fixSchema() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔧 Adicionando colunas e tabelas faltantes...\n');
    
    // 1. Adicionar currentWeightKg e weightLastLoggedAt em family_members
    console.log('1. Adicionando colunas em family_members...');
    await pool.query(`
      ALTER TABLE "family_members" 
      ADD COLUMN IF NOT EXISTS "current_weight_kg" NUMERIC(5,2),
      ADD COLUMN IF NOT EXISTS "weight_last_logged_at" TIMESTAMP;
    `);
    console.log('✅ Colunas adicionadas em family_members!');
    
    // 2. Recriar tabela app_events
    console.log('\n2. Criando tabela app_events...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "app_events" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER,
        "event_type" TEXT NOT NULL,
        "event_data" TEXT,
        "device_timezone" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela app_events criada!');
    
    // 3. Criar novas tabelas (scheduled_doses, weight_records, dose_records)
    console.log('\n3. Criando tabela scheduled_doses...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "scheduled_doses" (
        "id" SERIAL PRIMARY KEY,
        "member_id" INTEGER REFERENCES "family_members"("id"),
        "medication_id" INTEGER,
        "name" TEXT NOT NULL,
        "dosage" NUMERIC(10,2) NOT NULL,
        "unit" TEXT NOT NULL,
        "scheduled_time" TIMESTAMP NOT NULL,
        "status" TEXT DEFAULT 'pending' NOT NULL,
        "notes" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela scheduled_doses criada!');
    
    console.log('\n4. Criando tabela weight_records...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "weight_records" (
        "id" SERIAL PRIMARY KEY,
        "member_id" INTEGER REFERENCES "family_members"("id"),
        "weight_kg" NUMERIC(5,2) NOT NULL,
        "recorded_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "recorded_by" INTEGER
      );
    `);
    console.log('✅ Tabela weight_records criada!');
    
    console.log('\n5. Criando tabela dose_records...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "dose_records" (
        "id" SERIAL PRIMARY KEY,
        "member_id" INTEGER REFERENCES "family_members"("id"),
        "scheduled_dose_id" INTEGER,
        "medication_id" INTEGER,
        "medication_name_applied" TEXT NOT NULL,
        "applied_dosage" NUMERIC(10,2) NOT NULL,
        "applied_unit" TEXT NOT NULL,
        "applied_at" TIMESTAMP NOT NULL,
        "time_option" TEXT NOT NULL,
        "recorded_by" INTEGER,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela dose_records criada!');
    
    console.log('\n✅ Schema atualizado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

fixSchema();
