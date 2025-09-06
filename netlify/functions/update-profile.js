
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const connectionString = process.env.DATABASE_URL;

function parseAuth(event){ const h = event.headers && (event.headers.authorization || event.headers.Authorization); if(!h) return null; const parts = h.split(' '); if(parts.length!==2) return null; return parts[1]; }

exports.handler = async function(event){
  if(event.httpMethod!=='POST') return { statusCode:405, body:'Method not allowed' };
  const token = parseAuth(event);
  if(!token) return { statusCode:401, body: JSON.stringify({ error:'No autorizado' }) };
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const body = JSON.parse(event.body);
    const { name, phone, city, description } = body;
    const client = new Client({ connectionString, ssl:{ rejectUnauthorized:false } });
    await client.connect();
    await client.query('UPDATE users SET name=$1, phone=$2, city=$3, description=$4 WHERE id=$5', [name, phone, city, description, data.id]);
    const res = await client.query('SELECT id,email,name,slug,phone,city,description,destacado_until FROM users WHERE id=$1', [data.id]);
    await client.end();
    return { statusCode:200, body: JSON.stringify({ ok:true, profile: res.rows[0] }) };
  }catch(err){ console.error(err); return { statusCode:500, body: JSON.stringify({ error: err.message }) }; }
}
