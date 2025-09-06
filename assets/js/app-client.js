// app-client.js - demo listing
document.addEventListener('DOMContentLoaded', ()=>{
  const demo = [{slug:'luna',nombre:'Luna',ciudad:'Montevideo',categoria:'Mujer'},{slug:'aurora',nombre:'Aurora',ciudad:'Canelones',categoria:'Trans'}];
  const mount = document.getElementById('listado');
  if(!mount) return;
  mount.innerHTML = demo.map(d=>`<div class="card" style="margin-bottom:.6rem"><h4><a href="profiles/${d.slug}.html">${d.nombre}</a></h4><div class="small">${d.ciudad} · ${d.categoria}</div></div>`).join('');
});
