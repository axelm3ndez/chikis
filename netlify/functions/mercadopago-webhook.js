
const { Client } = require('pg');
exports.handler = async function(event){
  try{
    const body = JSON.parse(event.body || '{}');
    const client = new Client({ connectionString: process.env.DATABASE_URL, ssl:{ rejectUnauthorized:false } });
    await client.connect();
    if(body.id){
      await client.query("UPDATE payments SET status='paid' WHERE preference_id=$1", [body.id]);
      await client.query("UPDATE users SET destacado_until = NOW() + INTERVAL '7 days' WHERE id = (SELECT user_id FROM payments WHERE preference_id=$1 LIMIT 1)", [body.id]);
    }
    await client.end();
    return { statusCode:200, body: JSON.stringify({ ok:true }) };
  }catch(err){ console.error(err); return { statusCode:500, body: JSON.stringify({ error: err.message }) }; }
}
