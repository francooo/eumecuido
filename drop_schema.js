const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function drop() {
  await sql`DROP SCHEMA IF EXISTS public CASCADE`;
  await sql`CREATE SCHEMA public`;
  await sql`GRANT ALL ON SCHEMA public TO neondb_owner`;
  await sql`GRANT ALL ON SCHEMA public TO public`;
  console.log("Schema dropped");
}
drop();
