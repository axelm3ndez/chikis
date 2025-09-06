
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectionString = process.env.DATABASE_URL;

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const body = JSON.parse(event.body);
  const { email, password, name, phone, city, slug } = body;
  if(!email || !password) return { statusCode:400, body: JSON.stringify({error:'Email y contraseña requeridos'}) };
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try{
    await client.connect();
    const hash = await bcrypt.hash(password, 10);
    const res = await client.query('INSERT INTO users(email,password_hash,name,phone,city,slug) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,email,name,slug', [email, hash, name, phone, city, slug]);
    await client.end();
    const user = res.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return { statusCode: 200, body: JSON.stringify({ token }) };
  }catch(err){
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
