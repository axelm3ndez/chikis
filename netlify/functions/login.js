
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectionString = process.env.DATABASE_URL;

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const { email, password } = JSON.parse(event.body);
  const client = new Client({ connectionString, ssl:{ rejectUnauthorized:false } });
  try{
    await client.connect();
    const res = await client.query('SELECT id,email,password_hash FROM users WHERE email=$1', [email]);
    await client.end();
    if(res.rowCount===0) return { statusCode:400, body: JSON.stringify({ error:'Usuario no encontrado' }) };
    const user = res.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return { statusCode:401, body: JSON.stringify({ error:'Contraseña incorrecta' }) };
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return { statusCode:200, body: JSON.stringify({ token }) };
  }catch(err){ console.error(err); return { statusCode:500, body: JSON.stringify({ error: err.message }) }; }
}
