import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://postgres.fboclyzbdayspdjfgrkx:Thanthuong2004@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT id, "userId", date FROM health ORDER BY date DESC, id ASC;');
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);