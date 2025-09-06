// auth-client.js - simplified client for demos
const API = '/.netlify/functions';

function ageYes(){ localStorage.setItem('puy18','1'); document.getElementById('ageGate')?.remove(); }
function ageNo(){ location.href='https://www.google.com'; }
document.addEventListener('DOMContentLoaded',()=>{ if(localStorage.getItem('puy18')==='1'){ document.getElementById('ageGate')?.remove(); } });

async function apiPost(path, body){ return fetch(API+path, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)}).then(r=>r.json()); }

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault(); const f=new FormData(e.target);
  const body={ name:f.get('name'), email:f.get('email'), password:f.get('password'), phone:f.get('phone'), city:f.get('city'), slug:f.get('slug') };
  const res = await apiPost('/register', body);
  if(res.token){ localStorage.setItem('puy_token', res.token); location.href='profile.html'; } else alert(res.error||'Error');
});
// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault(); const f=new FormData(e.target);
  const res = await apiPost('/login', { email:f.get('email'), password:f.get('password') });
  if(res.token){ localStorage.setItem('puy_token', res.token); location.href='profile.html'; } else alert(res.error||'Error');
});

window.AUTH = { getToken: ()=> localStorage.getItem('puy_token'), logout: ()=> { localStorage.removeItem('puy_token'); location.href='index.html'; } };
