
const DEMO = [
  {id:1, slug:'luna', nombre:'Luna', telefono:'+59892123456', ciudad:'Montevideo', categoria:'mujer', desc:'Morena, discreción total. Atendiendo en Centro.', foto:'assets/img/placeholder.png', destacado:true, wa:'https://wa.me/59892123456'},
  {id:2, slug:'valentina', nombre:'Valentina', telefono:'+59893987321', ciudad:'Punta del Este', categoria:'mujer', desc:'Alta, fitness, hotel y domicilio.', foto:'assets/img/placeholder.png', destacado:false, wa:'https://wa.me/59893987321'},
  {id:3, slug:'aurora', nombre:'Aurora', telefono:'+59894555222', ciudad:'Canelones', categoria:'trans', desc:'Trans glamour. Lugar privado, trato vip.', foto:'assets/img/placeholder.png', destacado:true, wa:'https://wa.me/59894555222'},
  {id:4, slug:'isis', nombre:'Isis', telefono:'+59896333000', ciudad:'Montevideo', categoria:'trans', desc:'Travesti activa, fotos reales.', foto:'assets/img/placeholder.png', destacado:false, wa:'https://wa.me/59896333000'}
];

const UI = {
  qs(s){return document.querySelector(s)},
  qsa(s){return [...document.querySelectorAll(s)]},
  state:{filter:'all'},

  card(item){
    return `
    <article class="card pad listing">
      <img src="${item.foto}" alt="${item.nombre}">
      <div class="meta">
        <strong><a href="profiles/${item.slug}.html">${item.nombre}</a></strong>
        ${item.destacado?'<span class="tag">Destacada</span>':''}
        <div class="small">${item.ciudad} · ${item.categoria==='trans'?'Trans/Travesti':'Mujer'}</div>
        <div class="small">${item.desc}</div>
        <div style="margin-top:.5rem"><a class="btn btn-primary" href="${item.wa}" target="_blank">WhatsApp</a> <a class="btn" href="tel:${item.telefono.replace(/\s|\+/g,'')}">Llamar</a></div>
      </div>
    </article>`;
  },

  render(list, mountId='listado'){ const mount=this.qs('#'+mountId); if(!mount) return; mount.innerHTML=list.map(this.card).join('') || '<div class="card pad">Sin resultados.</div>'; },

  applyFilters(){ 
    const q=(this.qs('#q')||{value:''}).value.trim().toLowerCase();
    const ciudad=(this.qs('#ciudad')||{value:''}).value;
    const catFilter=this.state.filter; // 'all' | 'mujer' | 'trans'
    let res = DEMO.filter(x=>{ 
      let ok=true;
      if(q) ok=(x.nombre.toLowerCase().includes(q) || x.desc.toLowerCase().includes(q) || x.telefono.includes(q));
      if(ok && ciudad) ok = x.ciudad === ciudad;
      if(ok && catFilter !== 'all') ok = x.categoria === catFilter;
      return ok;
    });
    this.render(res);
  },

  setFilter(f){
    this.state.filter = f;
    this.qsa('.switch button').forEach(b=> b.classList.toggle('active', b.dataset.val===f));
    this.applyFilters();
  }
};

document.addEventListener('DOMContentLoaded',()=>{
  UI.render(DEMO);
  document.getElementById('buscarBtn')?.addEventListener('click',()=>UI.applyFilters());
  // setup switch buttons
  document.getElementById('filterAll')?.addEventListener('click',()=>UI.setFilter('all'));
  document.getElementById('filterMujer')?.addEventListener('click',()=>UI.setFilter('mujer'));
  document.getElementById('filterTrans')?.addEventListener('click',()=>UI.setFilter('trans'));
});
