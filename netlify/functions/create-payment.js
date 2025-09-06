
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const MP_TOKEN = process.env.MP_ACCESS_TOKEN;

function parseAuth(event){ const h = event.headers && (event.headers.authorization || event.headers.Authorization); if(!h) return null; const parts = h.split(' '); if(parts.length!==2) return null; return parts[1]; }

exports.handler = async function(event){
  if(event.httpMethod!=='POST') return { statusCode:405, body:'Method not allowed' };
  const token = parseAuth(event);
  if(!token) return { statusCode:401, body: JSON.stringify({ error:'No autorizado' }) };
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const body = JSON.parse(event.body);
    const amount = body.amount || 3000;
    const description = body.description || 'Membresía destacado';
    const preference = {
      items: [{ title: description, quantity: 1, currency_id: 'UYU', unit_price: Number(amount)/100 }],
      back_urls: { success: process.env.MP_BACK_URL_SUCCESS || 'https://example.com/success', failure: process.env.MP_BACK_URL_FAILURE || 'https://example.com/fail' },
      payer: { email: body.payer_email || 'guest@example.com' }
    };
    const resp = await fetch('https://api.mercadopago.com/checkout/preferences', { method:'POST', headers:{ Authorization: 'Bearer '+MP_TOKEN, 'Content-Type':'application/json' }, body: JSON.stringify(preference) });
    const jp = await resp.json();
    const client = new Client({ connectionString, ssl:{ rejectUnauthorized:false } });
    await client.connect();
    await client.query('INSERT INTO payments(user_id, preference_id, amount, status, created_at) VALUES($1,$2,$3,$4,NOW())', [data.id, jp.id, amount, 'created']);
    await client.end();
    return { statusCode:200, body: JSON.stringify({ init_point: jp.init_point, preference: jp }) };
  }catch(err){ console.error(err); return { statusCode:500, body: JSON.stringify({ error: err.message }) }; }
}
