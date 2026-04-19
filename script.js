// ══════════════════════════════════════════════
//  REFS
// ══════════════════════════════════════════════
const $ = id => document.getElementById(id);
const titleEl    = $('title');
const priceEl    = $('price');
const taxesEl    = $('taxes');
const adsEl      = $('ads');
const discountEl = $('discount');   // now a PERCENTAGE (0-100)
const totalDisp  = $('totalDisplay');
const totalValEl = $('totalValue');
const countEl    = $('count');
const categoryEl = $('category');
const submitBtn  = $('submit');

let mood      = 'create';
let editIndex = null;

// ══════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════
let datapro = [];
try { const s = localStorage.getItem('cruds_v4'); if (s) datapro = JSON.parse(s); } catch (_) {}

// Migrate old data that stored discount as flat value
datapro = datapro.map(p => {
  if (p._discountIsPercent) return p;
  return { ...p, _discountIsPercent: true };
});

let undoStack = null;

function saveData() { localStorage.setItem('cruds_v4', JSON.stringify(datapro)); }

// ══════════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════════
if (localStorage.getItem('cruds_theme') === 'light') document.body.classList.add('light');
$('themeToggle').onclick = () => {
  document.body.classList.toggle('light');
  localStorage.setItem('cruds_theme', document.body.classList.contains('light') ? 'light' : 'dark');
};

// ══════════════════════════════════════════════
//  TOTAL — discount is now a percentage of base price
//  total = (price + taxes + ads) * (1 - discount/100)
// ══════════════════════════════════════════════
function gettotal() {
  const p = +priceEl.value   || 0;
  const t = +taxesEl.value   || 0;
  const a = +adsEl.value     || 0;
  const d = +discountEl.value|| 0;  // percent 0-100

  if (priceEl.value !== '') {
    const subtotal   = p + t + a;
    const discountAmt = subtotal * (d / 100);
    const result     = subtotal - discountAmt;
    totalValEl.textContent = '$' + fmt(result);
    totalDisp.className    = 'total-display has-value';
  } else {
    totalValEl.textContent = '—';
    totalDisp.className    = 'total-display';
  }
}

function updateCharCount() {
  const len = titleEl.value.length, max = 60;
  const el  = $('titleCount');
  el.textContent = `${len} / ${max}`;
  el.className   = 'char-count' + (len >= max ? ' full' : len >= max * .85 ? ' near' : '');
}

// ══════════════════════════════════════════════
//  SUBMIT
// ══════════════════════════════════════════════
submitBtn.onclick = handleSubmit;
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') handleSubmit();
  if (e.key === 'Escape' && mood === 'update') exitEditMode();
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undoLast(); }
});

function calcTotal(p, t, a, d) {
  return (p + t + a) * (1 - d / 100);
}

function handleSubmit() {
  const qty     = parseInt(countEl.value) || 1;
  const p       = +priceEl.value   || 0;
  const t       = +taxesEl.value   || 0;
  const a       = +adsEl.value     || 0;
  const d       = +discountEl.value|| 0;

  const raw = {
    title:    titleEl.value.trim(),
    price:    p,
    taxes:    t,
    ads:      a,
    discount: d,              // stored as percent
    total:    calcTotal(p,t,a,d),
    category: categoryEl.value.trim(),
    createdAt: new Date().toISOString(),
    _discountIsPercent: true,
  };

  if (!raw.title)    { flashError(titleEl,    'Product title is required');  return; }
  if (!raw.price)    { flashError(priceEl,    'Base price is required');      return; }
  if (!raw.category) { flashError(categoryEl, 'Category is required');        return; }
  if (d < 0 || d > 100) { flashError(discountEl, 'Discount must be 0–100%'); return; }
  if (qty < 1 || qty > 99) { flashError(countEl, 'Quantity must be 1–99');   return; }

  const item = { ...raw, title: raw.title.toLowerCase(), category: raw.category.toLowerCase() };

  if (mood === 'create') {
    for (let i = 0; i < qty; i++) datapro.push({ ...item });
    toast(`${qty > 1 ? qty + ' products' : '"' + capitalize(item.title) + '"'} added`, 'success');
  } else {
    item.createdAt = datapro[editIndex].createdAt;
    datapro[editIndex] = item;
    toast(`"${capitalize(item.title)}" updated`, 'info');
    exitEditMode();
  }

  saveData(); clearInputs(); showData(); activePillCat = null; renderPills();
}

function flashError(el, msg) {
  el.classList.add('error');
  el.focus();
  setTimeout(() => el.classList.remove('error'), 2000);
  toast(msg, 'error');
}

function clearInputs() {
  [titleEl, priceEl, taxesEl, adsEl, discountEl, countEl, categoryEl].forEach(el => el.value = '');
  totalValEl.textContent = '—'; totalDisp.className = 'total-display';
  $('titleCount').textContent = '0 / 60'; $('titleCount').className = 'char-count';
}

// ══════════════════════════════════════════════
//  DISPLAY
// ══════════════════════════════════════════════
let sortCol = null, sortDir = 1;
let searchTerm = '', searchMood = 'title';
let activePillCat = null;
const PAGE_SIZE = 10;
let currentPage = 1;

function getFiltered() {
  const minP = parseFloat($('minPrice')?.value) || -Infinity;
  const maxP = parseFloat($('maxPrice')?.value) ||  Infinity;
  let list = [...datapro];
  if (activePillCat)  list = list.filter(p => p.category === activePillCat);
  if (searchTerm)     list = list.filter(p => (searchMood === 'title' ? p.title : p.category).includes(searchTerm));
  if (isFinite(minP)) list = list.filter(p => +p.price >= minP);
  if (isFinite(maxP)) list = list.filter(p => +p.price <= maxP);
  if (sortCol && sortCol !== 'index') {
    list.sort((a,b) => {
      const av = isNaN(+a[sortCol]) ? a[sortCol] : +a[sortCol];
      const bv = isNaN(+b[sortCol]) ? b[sortCol] : +b[sortCol];
      return av < bv ? -sortDir : av > bv ? sortDir : 0;
    });
  }
  return list;
}

function showData() {
  const all   = getFiltered();
  const pages = Math.ceil(all.length / PAGE_SIZE) || 1;
  if (currentPage > pages) currentPage = pages;
  const list  = all.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const tbody = $('tbody'), empty = $('emptyState');

  updateStats(); renderPills();
  $('deleteAllBtn').style.display = datapro.length > 0 ? '' : 'none';

  if (all.length === 0) { tbody.innerHTML = ''; empty.classList.add('visible'); renderPagination(0,0); return; }
  empty.classList.remove('visible');

  tbody.innerHTML = list.map((item, i) => {
    const ri = datapro.indexOf(item);
    const discountDisplay = item.discount ? fmtPct(item.discount) : '—';
    return `<tr data-idx="${ri}" onclick="openDetail(${ri})" title="Click to view details">
      <td>${(currentPage-1)*PAGE_SIZE+i+1}</td>
      <td>${hl(esc(capitalize(item.title)))}</td>
      <td>$${fmt(item.price)}</td>
      <td class="${item.taxes ? '' : 'muted-val'}">${item.taxes ? '$'+fmt(item.taxes) : '—'}</td>
      <td class="${item.ads   ? '' : 'muted-val'}">${item.ads   ? '$'+fmt(item.ads)   : '—'}</td>
      <td class="discount-cell">${discountDisplay}</td>
      <td class="total-cell">$${fmt(item.total)}</td>
      <td><span class="cat-badge">${hl(esc(item.category))}</span></td>
      <td onclick="event.stopPropagation()">
        <div class="row-actions">
          <button class="btn-update ripple" onclick="updateData(${ri})" title="Edit">
            <svg class="icon"><use href="#ic-edit"/></svg>
          </button>
          <button class="btn-dup ripple" onclick="duplicateData(${ri})" title="Duplicate">
            <svg class="icon"><use href="#ic-copy"/></svg>
          </button>
          <button class="btn-delete ripple" onclick="confirmDelete(${ri})" title="Delete">
            <svg class="icon"><use href="#ic-trash"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');

  renderPagination(currentPage, pages);
}

function renderPagination(page, pages) {
  const el = $('pagination');
  if (pages <= 1) { el.innerHTML = ''; return; }
  let html = `<button class="page-btn ripple" onclick="goPage(${page-1})" ${page<=1?'disabled':''}>‹</button>`;
  for (let i=1; i<=pages; i++) {
    if (i===1||i===pages||Math.abs(i-page)<=1)
      html += `<button class="page-btn ripple ${i===page?'active':''}" onclick="goPage(${i})">${i}</button>`;
    else if (Math.abs(i-page)===2)
      html += `<span class="page-info">…</span>`;
  }
  html += `<button class="page-btn ripple" onclick="goPage(${page+1})" ${page>=pages?'disabled':''}>›</button>`;
  html += `<span class="page-info">${page}/${pages} · ${getFiltered().length} items</span>`;
  el.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(getFiltered().length / PAGE_SIZE) || 1;
  if (p<1||p>pages) return;
  currentPage = p; showData();
}

// ══════════════════════════════════════════════
//  STATS
// ══════════════════════════════════════════════
function updateStats() {
  const count  = datapro.length;
  const cats   = new Set(datapro.map(p => p.category)).size;
  const totVal = datapro.reduce((s,p) => s + (+p.total||0), 0);
  const avgPrc = count ? datapro.reduce((s,p) => s+(+p.price||0),0)/count : 0;
  const maxPrc = count ? Math.max(...datapro.map(p=>+p.price||0)) : 0;

  animateCount($('statProductsNum'), count);
  animateCount($('statCatNum'), cats);
  $('statValueNum').textContent = '$' + fmt(totVal);
  $('statAvgNum').textContent   = '$' + fmt(avgPrc);
  $('statMaxNum').textContent   = '$' + fmt(maxPrc);
}

const cT = new WeakMap();
function animateCount(el, target) {
  const start=parseInt(el.textContent.replace(/\D/g,''))||0, diff=target-start, dur=400, ts0=performance.now();
  if(cT.has(el)) cancelAnimationFrame(cT.get(el));
  function step(ts) {
    const p=Math.min((ts-ts0)/dur,1);
    el.textContent=Math.round(start+diff*(1-Math.pow(1-p,3)));
    if(p<1) cT.set(el,requestAnimationFrame(step));
  }
  cT.set(el,requestAnimationFrame(step));
}

// ══════════════════════════════════════════════
//  PILLS
// ══════════════════════════════════════════════
function renderPills() {
  const c = $('categoryPills');
  const cats = [...new Set(datapro.map(p=>p.category))].sort();
  if (!cats.length) { c.innerHTML=''; return; }
  c.innerHTML = cats.map((cat,i) =>
    `<span class="pill ${activePillCat===cat?'active':''}" style="animation-delay:${i*.04}s" onclick="filterPill('${esc(cat)}')">${esc(capitalize(cat))}</span>`
  ).join('');
}
function filterPill(cat) { activePillCat = activePillCat===cat?null:cat; currentPage=1; renderPills(); showData(); }

// ══════════════════════════════════════════════
//  SORT
// ══════════════════════════════════════════════
function sortBy(col) {
  sortDir = sortCol===col ? -sortDir : 1; sortCol=col;
  document.querySelectorAll('th.sortable').forEach(th => {
    th.classList.remove('sort-asc','sort-desc');
    if(th.dataset.col===col) th.classList.add(sortDir===1?'sort-asc':'sort-desc');
  });
  showData();
}

// ══════════════════════════════════════════════
//  DELETE (bug-fixed: capture idx before closeModal)
// ══════════════════════════════════════════════
let pendingDeleteIdx = null;
function confirmDelete(i) {
  pendingDeleteIdx = i;
  $('modalTitle').textContent   = 'Delete Product';
  $('modalMsg').textContent     = `Delete "${capitalize(datapro[i].title)}"? Ctrl+Z to undo.`;
  $('modalConfirm').innerHTML   = `<svg class="icon"><use href="#ic-trash"/></svg> Delete`;
  $('modalConfirm').style.cssText = '';
  $('modalOverlay').classList.add('visible');
}
function confirmDeleteAll() {
  pendingDeleteIdx = -1;
  $('modalTitle').textContent   = 'Delete All Products';
  $('modalMsg').textContent     = `Permanently delete all ${datapro.length} products? Ctrl+Z to undo.`;
  $('modalConfirm').innerHTML   = `<svg class="icon"><use href="#ic-trash"/></svg> Delete All (${datapro.length})`;
  $('modalOverlay').classList.add('visible');
}
$('modalCancel').onclick  = closeModal;
$('modalOverlay').onclick = e => { if(e.target===$('modalOverlay')) closeModal(); };
$('modalConfirm').onclick = () => {
  const idx = pendingDeleteIdx;   // capture BEFORE closeModal nullifies it
  closeModal();
  if (idx === -1) {
    undoStack = { type:'all', data:[...datapro] };
    datapro   = [];
    saveData(); showData(); activePillCat=null;
    toast('All products deleted — Ctrl+Z to undo', 'error');
  } else {
    undoStack = { type:'single', idx, item:{...datapro[idx]} };
    const row = document.querySelector(`tr[data-idx="${idx}"]`);
    if (row) { row.classList.add('row-exit'); setTimeout(()=>doDelete(idx), 280); }
    else        doDelete(idx);
    toast('Product deleted — Ctrl+Z to undo', 'error');
  }
};
function doDelete(i) { datapro.splice(i,1); saveData(); showData(); activePillCat=null; }
function closeModal() { $('modalOverlay').classList.remove('visible'); pendingDeleteIdx=null; }

function undoLast() {
  if (!undoStack) { toast('Nothing to undo','info'); return; }
  if (undoStack.type==='all')    { datapro=undoStack.data; toast('Undo: all products restored','success'); }
  if (undoStack.type==='single') { datapro.splice(undoStack.idx,0,undoStack.item); toast(`Undo: "${capitalize(undoStack.item.title)}" restored`,'success'); }
  if (undoStack.type==='dup')    { datapro.splice(undoStack.idx,1); toast('Undo: duplicate removed','success'); }
  undoStack=null; saveData(); showData(); renderPills();
}

// ══════════════════════════════════════════════
//  DUPLICATE
// ══════════════════════════════════════════════
function duplicateData(i) {
  const copy = {...datapro[i], createdAt: new Date().toISOString()};
  datapro.splice(i+1,0,copy);
  undoStack = {type:'dup',idx:i+1};
  saveData(); showData(); renderPills();
  toast(`"${capitalize(copy.title)}" duplicated — Ctrl+Z to undo`,'success');
}

// ══════════════════════════════════════════════
//  UPDATE / EDIT
// ══════════════════════════════════════════════
function updateData(i) {
  const item = datapro[i];
  titleEl.value    = capitalize(item.title);
  priceEl.value    = item.price;
  taxesEl.value    = item.taxes;
  adsEl.value      = item.ads;
  discountEl.value = item.discount;   // already stored as percent
  categoryEl.value = capitalize(item.category);
  gettotal(); updateCharCount();
  $('countWrapper').style.display = 'none';
  $('cancelEdit').style.display   = 'flex';
  $('panelLabel').textContent     = 'Editing Product';
  submitBtn.querySelector('use').setAttribute('href','#ic-save');
  $('submitLabel').textContent    = 'Save Changes';
  mood='update'; editIndex=i;
  window.scrollTo({top:0,behavior:'smooth'});
}
function exitEditMode() {
  mood='create'; editIndex=null;
  submitBtn.querySelector('use').setAttribute('href','#ic-plus');
  $('submitLabel').textContent    = 'Create Product';
  $('panelLabel').textContent     = 'New Product';
  $('countWrapper').style.display = '';
  $('cancelEdit').style.display   = 'none';
  clearInputs();
}

// ══════════════════════════════════════════════
//  DETAIL MODAL
// ══════════════════════════════════════════════
function openDetail(i) {
  const item = datapro[i];
  $('detailCat').textContent  = capitalize(item.category);
  $('detailName').textContent = capitalize(item.title);
  const discAmt = ((+item.price + (+item.taxes||0) + (+item.ads||0)) * ((+item.discount||0)/100));
  $('detailGrid').innerHTML = [
    ['Base Price',  '$'+fmt(item.price),           false],
    ['Tax Amount',  item.taxes ? '$'+fmt(item.taxes) : '—', false],
    ['Ads Cost',    item.ads   ? '$'+fmt(item.ads)   : '—', false],
    ['Discount',    item.discount ? fmtPct(item.discount) + ' (−$'+fmt(discAmt)+')' : '—', false],
    ['Total',       '$'+fmt(item.total),           true],
    ['Added',       item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—', false],
  ].map(([lbl,val,accent]) => `
    <div class="detail-item">
      <div class="detail-item-label">${lbl}</div>
      <div class="detail-item-val ${accent?'accent':''}">${val}</div>
    </div>`).join('');
  $('detailEditBtn').onclick = () => { closeDetail(); updateData(i); };
  $('detailOverlay').classList.add('visible');
}
function closeDetail() { $('detailOverlay').classList.remove('visible'); }
$('detailOverlay').onclick = e => { if(e.target===$('detailOverlay')) closeDetail(); };

// ══════════════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════════════
function getSearchMood(id) {
  searchMood = id==='searchTitle'?'title':'category';
  document.querySelectorAll('.btn-mode').forEach(b=>b.classList.remove('active'));
  $(id).classList.add('active');
  $('search').placeholder = searchMood==='title'?'Search by title…':'Search by category…';
  $('search').value=''; searchTerm='';
  $('searchClear').style.display='none';
  $('search').focus(); currentPage=1; showData();
}
function searchData(v) { searchTerm=v.trim().toLowerCase(); $('searchClear').style.display=searchTerm?'':'none'; currentPage=1; showData(); }
function clearSearch() { $('search').value=''; searchTerm=''; $('searchClear').style.display='none'; $('search').focus(); showData(); }

// ══════════════════════════════════════════════
//  PRICE FILTER
// ══════════════════════════════════════════════
function clearPriceFilter() { $('minPrice').value=''; $('maxPrice').value=''; currentPage=1; showData(); }

// ══════════════════════════════════════════════
//  EXPORT / IMPORT
// ══════════════════════════════════════════════
function exportCSV() {
  if (!datapro.length) { toast('No products to export','info'); return; }
  const h = ['#','Title','Price ($)','Taxes ($)','Ads ($)','Discount (%)','Total ($)','Category','Added'];
  const r = datapro.map((p,i) => [i+1,p.title,p.price,p.taxes,p.ads,p.discount,p.total,p.category,
    p.createdAt?new Date(p.createdAt).toLocaleDateString():'']
    .map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  download([h.join(','),...r].join('\r\n'),`products_${dateStr()}.csv`,'text/csv;charset=utf-8;');
  toast('CSV exported','success');
}
function exportJSON() {
  if (!datapro.length) { toast('No products to export','info'); return; }
  download(JSON.stringify(datapro,null,2),`products_${dateStr()}.json`,'application/json');
  toast('JSON exported','success');
}
function triggerImport() { $('importFile').click(); }
function importJSON(e) {
  const file=e.target.files[0]; if (!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try {
      const parsed=JSON.parse(ev.target.result);
      if (!Array.isArray(parsed)) throw new Error();
      // Ensure imported items have _discountIsPercent flag
      const imported = parsed.map(p => ({...p, _discountIsPercent:true}));
      datapro.push(...imported); saveData(); showData(); renderPills();
      toast(`${imported.length} products imported`,'success');
    } catch { toast('Invalid JSON file','error'); }
    e.target.value='';
  };
  reader.readAsText(file);
}
function download(content,name,mime) {
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type:mime}));
  a.download=name; a.click(); URL.revokeObjectURL(a.href);
}

// ══════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════
const TOAST_ICONS = {success:'#ic-check',error:'#ic-x',info:'#ic-info'};
function toast(msg,type='info') {
  const el=document.createElement('div');
  el.className=`toast toast-${type}`;
  el.innerHTML=`<svg class="icon"><use href="${TOAST_ICONS[type]}"/></svg><span>${msg}</span><div class="toast-bar"></div>`;
  $('toastContainer').appendChild(el);
  setTimeout(()=>{el.classList.add('toast-out');setTimeout(()=>el.remove(),300);},3000);
}

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════
function fmt(n)       { return (+n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtPct(n)    { return (+n).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2})+'%'; }
function esc(s)       { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function capitalize(s){ return s?s.charAt(0).toUpperCase()+s.slice(1):s; }
function dateStr()    { return new Date().toISOString().slice(0,10); }
function hl(text) {
  if (!searchTerm) return text;
  const re=new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(re,'<span class="highlight">$1</span>');
}

// ══════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════
showData();
