/* =========================================================
   FORTE — stranica proizvoda (proizvod.html?id=<id>)
   Sve se iscrtava iz kataloga (products.js). Svaka boja je
   zaseban proizvod; "ostale boje" su linkovi ka tim proizvodima.
   ========================================================= */
(() => {
  'use strict';

  const F = window.FORTE;
  const { PRODUCTS, byId, SIZES, GENDERS, TYPES, CATEGORIES, siblings, title, url, catUrl, img, rsd, discount, colorsWord, newest, query } = F;
  const { $, $$, icon, addToCart, syncWish, priceHTML, renderRail, observeReveal } = F.ui;

  const id = new URLSearchParams(location.search).get('id');
  const p = byId[id] || newest(PRODUCTS)[0];
  const g = F.group(p);
  const genderCat = CATEGORIES.find(c => c.rule.gender === g.gender);

  /* ---------- SEO / naslov ---------- */
  document.title = `${title(p)} | FORTE`;
  $('meta[name="description"]').setAttribute('content', `${title(p)} — ${g.desc}`.slice(0, 158));

  /* ---------- putanja ---------- */
  $('[data-crumbs]').innerHTML = `
    <a href="index.html">Početna</a><span>/</span>
    <a href="${catUrl(genderCat.slug)}">${genderCat.name}</a><span>/</span>
    <a href="${catUrl(genderCat.slug, '&tip=' + g.type)}">${TYPES[g.type]}</a><span>/</span>
    <span>${g.name}</span>`;

  /* ---------- osnovni podaci ---------- */
  $('[data-pdp-cat]').textContent = `${GENDERS[g.gender]} · ${TYPES[g.type]}`;
  $('[data-pdp-title]').textContent = g.name;
  $('[data-pdp-color]').textContent = p.color;
  $('[data-pdp-sku]').textContent = p.sku;
  $('[data-pdp-price]').innerHTML = priceHTML(p) + (p.was ? ` <span class="pill">−${discount(p)}%</span>` : '') + ' <small>PDV uključen</small>';
  $('[data-pdp-desc]').textContent = g.desc;
  $('[data-pdp-details]').innerHTML = g.details.map(d => `<li>${d}</li>`).join('');
  $('[data-pdp-care]').textContent = g.care;
  $$('[data-pdp-wish]').forEach(b => { b.dataset.wish = p.id; });

  const tag = $('[data-pdp-tag]');
  if (p.was || p.badge) {
    tag.hidden = false;
    tag.textContent = p.was ? `−${discount(p)}%` : p.badge;
    tag.className = 'tag' + (p.was ? ' tag--sale' : p.badge === 'Bestseler' ? ' tag--dark' : '');
  }

  /* ---------- ostale boje (zasebni proizvodi) ---------- */
  const sib = siblings(p);
  if (sib.length > 1) {
    $('[data-pdp-colors-count]').textContent = colorsWord(sib.length);
    $('[data-pdp-swatches]').innerHTML = sib.map(s =>
      `<a href="${url(s)}" class="swatch${s.id === p.id ? ' is-active' : ''}" title="${s.color}" aria-label="${title(s)}"${s.id === p.id ? ' aria-current="page"' : ''}>
        <img src="${img(s.imgs[0], true)}" alt="">
      </a>`).join('');
  } else {
    $('[data-pdp-colors-wrap]').hidden = true;
  }

  /* ---------- galerija ---------- */
  const track = $('[data-pdp-track]');
  const dots = $('[data-pdp-dots]');
  const count = $('[data-pdp-count]');
  track.innerHTML = p.imgs.map((n, i) =>
    `<figure data-lb-open="${i}"><img src="${img(n)}" alt="${title(p)} — slika ${i + 1}"${i > 1 ? ' loading="lazy"' : ''}${i === 0 ? ' fetchpriority="high"' : ''}></figure>`).join('');
  dots.innerHTML = p.imgs.length > 1 ? p.imgs.map(() => '<i></i>').join('') : '';
  const setDot = i => {
    $$('i', dots).forEach((d, k) => d.classList.toggle('is-on', k === i));
    count.textContent = `${i + 1} / ${p.imgs.length}`;
  };
  setDot(0);
  track.addEventListener('scroll', () => setDot(Math.round(track.scrollLeft / track.clientWidth)), { passive: true });

  /* ---------- lightbox (uvećanje) ---------- */
  const lb = $('[data-lightbox]'), lbTrack = $('[data-lb-track]'), lbCount = $('[data-lb-count]');
  lbTrack.innerHTML = p.imgs.map((n, i) => `<figure><img src="${img(n)}" alt="${title(p)} — slika ${i + 1}" loading="lazy"></figure>`).join('');
  const lbIdx = () => Math.round(lbTrack.scrollLeft / lbTrack.clientWidth);
  const lbGo = i => lbTrack.scrollTo({ left: Math.max(0, Math.min(p.imgs.length - 1, i)) * lbTrack.clientWidth, behavior: 'smooth' });
  const lbSync = () => { lbCount.textContent = `${lbIdx() + 1} / ${p.imgs.length}`; };
  lbTrack.addEventListener('scroll', lbSync, { passive: true });
  const lbOpen = i => {
    lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    lbTrack.scrollTo({ left: i * lbTrack.clientWidth, behavior: 'instant' });
    lbSync();
  };
  const lbClose = () => {
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  };
  track.addEventListener('click', e => { const f = e.target.closest('[data-lb-open]'); if (f) lbOpen(+f.dataset.lbOpen); });
  $('[data-lb-close]').addEventListener('click', lbClose);
  $$('[data-lb]').forEach(b => b.addEventListener('click', () => lbGo(lbIdx() + +b.dataset.lb)));
  addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowRight') lbGo(lbIdx() + 1);
    if (e.key === 'ArrowLeft') lbGo(lbIdx() - 1);
  });

  /* ---------- veličine ---------- */
  const sizesEl = $('[data-sizes]');
  let size = null;
  sizesEl.innerHTML = SIZES.map(s => {
    const out = p.out.includes(s);
    return `<button role="radio" aria-checked="false" data-size="${s}"${out ? ' class="is-out" aria-disabled="true"' : ''}>${s}${out ? '<span>nema</span>' : p.low === s ? '<span>još 2</span>' : ''}</button>`;
  }).join('');
  sizesEl.addEventListener('click', e => {
    const b = e.target.closest('[data-size]'); if (!b || b.classList.contains('is-out')) return;
    $$('button', sizesEl).forEach(x => x.setAttribute('aria-checked', x === b));
    size = b.dataset.size;
    $('[data-size-name]').textContent = size;
    $('[data-size-error]').hidden = true;
    sizesEl.classList.remove('is-error');
    $('[data-sticky-size]').textContent = `Veličina ${size}`;
  });

  const tryAdd = () => {
    if (!size) {
      $('[data-size-error]').hidden = false;
      sizesEl.classList.add('is-error');
      sizesEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      sizesEl.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300, delay: 250 });
      return;
    }
    addToCart(p.id, size);
  };
  const addBtn = $('[data-add]');
  addBtn.addEventListener('click', tryAdd);

  /* ---------- lepljivo dugme na telefonu ---------- */
  const sticky = $('[data-sticky-buy]');
  sticky.querySelector('img').src = img(p.imgs[0], true);
  $('[data-sticky-name]').textContent = g.name;
  $('[data-sticky-price]').textContent = `${rsd(p.price)} · ${p.color}`;
  $('[data-sticky-add]').addEventListener('click', tryAdd);
  const footer = $('.footer');
  let addVisible = true, footerVisible = false;
  const syncSticky = () => {
    const on = !addVisible && !footerVisible;
    sticky.classList.toggle('is-on', on);
    document.body.classList.toggle('has-sticky', on);
  };
  new IntersectionObserver(([en]) => { addVisible = en.isIntersecting || en.boundingClientRect.top > 0; syncSticky(); }).observe(addBtn);
  new IntersectionObserver(([en]) => { footerVisible = en.isIntersecting; syncSticky(); }).observe(footer);

  /* ---------- preporuke ---------- */
  const others = PRODUCTS.filter(x => x.group !== p.group);
  const sameKind = newest(others.filter(x => F.group(x).gender === g.gender && F.group(x).type === g.type));
  const rest = newest(others.filter(x => F.group(x).gender === g.gender && !sameKind.includes(x)));
  // jedan proizvod po modelu, da preporuke ne budu iste jakne u 5 boja
  const seen = new Set();
  const related = [...sameKind, ...rest].filter(x => !seen.has(x.group) && seen.add(x.group)).slice(0, 10);
  renderRail(related.map(F.ui.cardHTML).join(''));

  syncWish();
  observeReveal();
})();
