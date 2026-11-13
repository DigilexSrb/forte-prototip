/* =========================================================
   FORTE — stranica kategorije / pretrage / liste želja
   kategorija.html?kat=zene|muskarci|prsluci|outlet|novo|sve
                  ?q=crna+jakna          (rezultati pretrage)
                  ?lista=omiljeno        (lista želja)
   Filteri (u URL-u, više vrednosti odvojeno zarezom):
     &tip=jakna,prsluk &pol=z &boja=crna,bez &vel=M,L
     &cena=do-9000 &akcija=1 &sort=cena-rastuce
   Sve se računa iz kataloga (products.js) — brojevi uz filtere
   su uvek tačni za trenutni izbor.
   ========================================================= */
(() => {
  'use strict';

  const F = window.FORTE;
  const { PRODUCTS, CATEGORIES, TYPES, GENDERS, SIZES, catBySlug, query, search, newest, colorsOf, slugify,
    url, catUrl, img, rsd, discount, colorsWord, siblings } = F;
  const { $, $$, icon, store, wish, syncWish, cardHTML, countWord, observeReveal, close } = F.ui;
  const g = F.group;

  const PAGE = 24;
  const PRICES = [
    { slug: 'do-9000', name: 'Do 9.000 RSD', test: p => p.price < 9000 },
    { slug: '9000-12500', name: '9.000 – 12.500 RSD', test: p => p.price >= 9000 && p.price <= 12500 },
    { slug: 'preko-12500', name: 'Preko 12.500 RSD', test: p => p.price > 12500 }
  ];
  const SORTS = {
    novo: (a, b) => b.added.localeCompare(a.added),
    'cena-rastuce': (a, b) => a.price - b.price,
    'cena-opadajuce': (a, b) => b.price - a.price,
    popust: (a, b) => discount(b) - discount(a) || a.price - b.price,
    naziv: (a, b) => g(a).name.localeCompare(g(b).name, 'sr') || a.color.localeCompare(b.color, 'sr')
  };
  const ABOUT = {
    zene: ['Ženske zimske jakne i prsluci', [
      'FORTE ženska kolekcija spaja toplinu i stav: kratke štepane jakne sa oversized kragnom, duge puf prsluke za slojevito oblačenje i klasične zimske jakne za svaki dan.',
      'Svaka boja je poseban proizvod sa sopstvenim fotografijama i zalihama, tako da tačno vidiš šta naručuješ. Ako nisi sigurna oko veličine, pogledaj tabelu veličina ili nas kontaktiraj.']],
    muskarci: ['Muške zimske jakne, mantili i prsluci', [
      'Muška FORTE kolekcija je napravljena za grad: čiste linije, topla postava i praktični džepovi. Izaberi jaknu, mantil ili lagani prsluk sa kapuljačom.',
      'Dostava na teritoriji Srbije stiže za 1–3 radna dana, a veličinu možeš da zameniš u roku od 14 dana.']],
    prsluci: ['Prsluci — lagani sloj koji greje', [
      'Prsluk je najpraktičniji komad prelaznog perioda: greje telo, ne opterećuje ruke i lako se kombinuje preko majice, džempera ili haljine.',
      'Dugi puf prsluk dolazi u pet boja — svaka je zaseban model sa svojim fotografijama.']],
    outlet: ['Outlet — sniženi modeli', [
      'U outletu su modeli iz prethodnih kolekcija po sniženim cenama. Količine su ograničene, a popust je već uračunat u prikazanu cenu.']]
  };

  /* ---------- režim stranice ---------- */
  const sp = new URLSearchParams(location.search);
  const q = (sp.get('q') || '').trim();
  const mode = sp.get('lista') === 'omiljeno' ? 'wish' : q ? 'search' : 'cat';
  const cat = mode === 'cat' ? (catBySlug[sp.get('kat')] || catBySlug.sve) : null;

  const baseList = () => mode === 'wish' ? PRODUCTS.filter(p => wish.has(p.id))
    : mode === 'search' ? search(q) : query({ kat: cat.slug });

  /* ---------- stanje filtera ---------- */
  const set = k => new Set((sp.get(k) || '').split(',').filter(Boolean));
  const state = {
    tip: set('tip'), pol: set('pol'), boja: set('boja'), vel: set('vel'), cena: set('cena'),
    akcija: sp.get('akcija') === '1',
    sort: SORTS[sp.get('sort')] ? sp.get('sort') : 'novo'
  };
  const tests = {
    tip: (p, s) => s.has(g(p).type),
    pol: (p, s) => s.has(g(p).gender),
    boja: (p, s) => s.has(slugify(p.color)),
    vel: (p, s) => [...s].some(v => !p.out.includes(v)),
    cena: (p, s) => PRICES.some(r => s.has(r.slug) && r.test(p)),
    akcija: p => !!p.was
  };
  const isOn = k => k === 'akcija' ? state.akcija : state[k].size > 0;
  const apply = (list, except) => list.filter(p =>
    Object.keys(tests).every(k => k === except || !isOn(k) || tests[k](p, state[k])));
  const activeCount = () => Object.keys(tests).reduce((n, k) => n + (k === 'akcija' ? +state.akcija : state[k].size), 0);

  const syncURL = () => {
    const u = new URLSearchParams();
    if (mode === 'wish') u.set('lista', 'omiljeno');
    else if (mode === 'search') u.set('q', q);
    else u.set('kat', cat.slug);
    ['tip', 'pol', 'boja', 'vel', 'cena'].forEach(k => state[k].size && u.set(k, [...state[k]].join(',')));
    if (state.akcija) u.set('akcija', '1');
    if (state.sort !== 'novo') u.set('sort', state.sort);
    history.replaceState(null, '', `${location.pathname}?${u.toString().replace(/%2C/g, ',')}`);
  };

  /* ---------- zaglavlje ---------- */
  const H = {
    eyebrow: $('[data-plp-eyebrow]'), title: $('[data-plp-title]'), lead: $('[data-plp-lead]'),
    crumbs: $('[data-crumbs]'), sub: $('[data-plp-sub]')
  };
  const emTitle = t => t.includes(' ') ? t.replace(/(\S+)$/, '<em>$1</em>') : t;
  const renderHead = () => {
    const base = baseList();
    let crumb, h1, lead, docTitle;
    if (mode === 'wish') {
      crumb = 'Lista želja'; h1 = 'Lista <em>želja</em>'; docTitle = 'Lista želja';
      lead = base.length ? 'Sačuvani modeli. Lista se čuva u ovom pregledaču.' : '';
    } else if (mode === 'search') {
      crumb = 'Pretraga'; h1 = `Rezultati za <em>„${esc(q)}“</em>`; docTitle = `Pretraga: ${q}`;
      lead = base.length ? '' : 'Pokušaj sa drugom reči, npr. „prsluk“, „crna“ ili šifrom modela.';
    } else {
      crumb = cat.name; h1 = emTitle(cat.title); docTitle = cat.title; lead = cat.lead || '';
    }
    const one = state.tip.size === 1 && [...state.tip][0];
    H.crumbs.innerHTML = `<a href="index.html">Početna</a><span>/</span>` + (one && mode === 'cat'
      ? `<a href="${catUrl(cat.slug)}">${crumb}</a><span>/</span><span>${TYPES[one]}</span>`
      : `<span>${crumb}</span>`);
    H.title.innerHTML = h1;
    H.lead.textContent = lead;
    H.lead.hidden = !lead;
    document.title = `${docTitle} | FORTE`;
    const md = $('meta[name="description"]');
    if (md) md.setAttribute('content', (lead || docTitle).slice(0, 158));

    // podkategorije: tipovi (Žene/Muškarci) ili pol (ostalo)
    const facet = mode === 'cat' && cat.rule.gender ? 'tip' : 'pol';
    const opts = facet === 'tip'
      ? Object.keys(TYPES).map(t => ({ v: t, name: TYPES[t], n: base.filter(p => g(p).type === t).length }))
      : Object.keys(GENDERS).map(x => ({ v: x, name: GENDERS[x], n: base.filter(p => g(p).gender === x).length }));
    const shown = opts.filter(o => o.n);
    const others = mode === 'cat' ? [...CATEGORIES, catBySlug.novo].filter(c => c.slug !== cat.slug) : CATEGORIES;
    H.sub.innerHTML = (shown.length > 1
      ? `<button data-sub="" aria-pressed="${!state[facet].size}">Sve <small>${base.length}</small></button>` +
        shown.map(o => `<button data-sub="${o.v}" data-facet="${facet}" aria-pressed="${state[facet].size === 1 && state[facet].has(o.v)}">${o.name} <small>${o.n}</small></button>`).join('') +
        '<i aria-hidden="true"></i>'
      : '') +
      others.map(c => `<a href="${catUrl(c.slug)}"${c.slug === 'outlet' ? ' class="is-sale"' : ''}>${c.name}</a>`).join('');
    H.sub.dataset.facet = facet;
  };
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  H.sub.addEventListener('click', e => {
    const b = e.target.closest('[data-sub]');
    if (!b) return;
    const facet = H.sub.dataset.facet;
    state[facet].clear();
    if (b.dataset.sub) state[facet].add(b.dataset.sub);
    update();
  });

  /* ---------- filteri (panel) ---------- */
  const fBody = $('[data-filters]');
  const openGroups = store.get('forte-fopen', { tip: 1, pol: 1, boja: 1, vel: 1, cena: 0, akcija: 1 });
  const group = (key, label, inner, n) => `<details class="fgroup" data-fg="${key}"${openGroups[key] ? ' open' : ''}>
      <summary>${label}${n ? ` <b>${n}</b>` : ''} ${icon('plus')}</summary>
      <div class="fgroup__body">${inner}</div>
    </details>`;
  const checkRow = (key, v, name, n, extra = '') => {
    const on = key === 'akcija' ? state.akcija : state[key].has(v);
    return `<label class="fcheck${!n && !on ? ' is-empty' : ''}">
      <input type="checkbox" data-f="${key}" value="${v}"${on ? ' checked' : ''}${!n && !on ? ' disabled' : ''}>
      <span class="fcheck__box">${icon('check')}</span>${extra}<span class="fcheck__name">${name}</span><small>${n}</small>
    </label>`;
  };
  const renderFilters = () => {
    const base = baseList();
    const pool = k => apply(base, k);
    const parts = [];

    const pt = pool('tip');
    const types = Object.keys(TYPES).filter(t => base.some(p => g(p).type === t));
    if (types.length > 1) parts.push(group('tip', 'Vrsta', types.map(t =>
      checkRow('tip', t, TYPES[t], pt.filter(p => g(p).type === t).length)).join(''), state.tip.size));

    const genders = Object.keys(GENDERS).filter(x => base.some(p => g(p).gender === x));
    if (genders.length > 1) {
      const pp = pool('pol');
      parts.push(group('pol', 'Za koga', genders.map(x =>
        checkRow('pol', x, GENDERS[x], pp.filter(p => g(p).gender === x).length)).join(''), state.pol.size));
    }

    const pb = pool('boja');
    const colors = colorsOf(base);
    if (colors.length > 1) parts.push(group('boja', 'Boja', `<div class="fcolors">${colors.map(c => {
      const n = pb.filter(p => slugify(p.color) === c.slug).length, on = state.boja.has(c.slug);
      return `<button class="fcolor${on ? ' is-on' : ''}" data-f="boja" value="${c.slug}" aria-pressed="${on}"${!n && !on ? ' disabled' : ''}>
        <i style="--c:${c.hex}"></i><span>${c.name}</span><small>${n}</small></button>`;
    }).join('')}</div>`, state.boja.size));

    const pv = pool('vel');
    parts.push(group('vel', 'Veličina', `<div class="fsizes">${SIZES.map(s => {
      const n = pv.filter(p => !p.out.includes(s)).length, on = state.vel.has(s);
      return `<button data-f="vel" value="${s}" aria-pressed="${on}"${!n && !on ? ' disabled' : ''}>${s}</button>`;
    }).join('')}</div><p class="fnote">Prikazuju se modeli dostupni u izabranoj veličini.</p>`, state.vel.size));

    const pc = pool('cena');
    const ranges = PRICES.filter(r => base.some(r.test));
    if (ranges.length > 1) parts.push(group('cena', 'Cena', ranges.map(r =>
      checkRow('cena', r.slug, r.name, pc.filter(r.test).length)).join(''), state.cena.size));

    if (!(mode === 'cat' && cat.rule.sale) && base.some(p => p.was)) {
      const pa = pool('akcija');
      parts.push(group('akcija', 'Ponuda', checkRow('akcija', '1', 'Samo sniženo', pa.filter(p => p.was).length), +state.akcija));
    }
    fBody.innerHTML = parts.join('') || '<p class="fnote">Nema filtera za ovaj izbor.</p>';
  };
  fBody.addEventListener('click', e => {
    const b = e.target.closest('button[data-f]');
    if (!b) return;
    const s = state[b.dataset.f];
    s.has(b.value) ? s.delete(b.value) : s.add(b.value);
    update();
  });
  fBody.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    if (i.dataset.f === 'akcija') state.akcija = i.checked;
    else i.checked ? state[i.dataset.f].add(i.value) : state[i.dataset.f].delete(i.value);
    update();
  });
  fBody.addEventListener('toggle', e => {
    const d = e.target.closest('[data-fg]');
    if (d) { openGroups[d.dataset.fg] = d.open ? 1 : 0; store.set('forte-fopen', openGroups); }
  }, true);
  const clearAll = () => { ['tip', 'pol', 'boja', 'vel', 'cena'].forEach(k => state[k].clear()); state.akcija = false; update(); };
  $('[data-filters-clear]').addEventListener('click', clearAll);

  /* ---------- aktivni filteri (čipovi) ---------- */
  const activeEl = $('[data-plp-active]');
  const renderActive = () => {
    const chips = [];
    const colorName = Object.fromEntries(colorsOf(PRODUCTS).map(c => [c.slug, c.name]));
    state.tip.forEach(v => chips.push(['tip', v, TYPES[v]]));
    state.pol.forEach(v => chips.push(['pol', v, GENDERS[v]]));
    state.boja.forEach(v => chips.push(['boja', v, colorName[v] || v]));
    state.vel.forEach(v => chips.push(['vel', v, 'Vel. ' + v]));
    state.cena.forEach(v => chips.push(['cena', v, PRICES.find(r => r.slug === v)?.name || v]));
    if (state.akcija) chips.push(['akcija', '1', 'Sniženo']);
    activeEl.innerHTML = chips.map(([k, v, n]) =>
      `<button data-rm-f="${k}" value="${v}" aria-label="Ukloni filter ${n}">${n} ${icon('close')}</button>`).join('') +
      (chips.length > 1 ? '<button class="plp-active__clear" data-rm-all>Obriši sve</button>' : '');
    activeEl.hidden = !chips.length;
  };
  activeEl.addEventListener('click', e => {
    if (e.target.closest('[data-rm-all]')) return clearAll();
    const b = e.target.closest('[data-rm-f]');
    if (!b) return;
    if (b.dataset.rmF === 'akcija') state.akcija = false; else state[b.dataset.rmF].delete(b.value);
    update();
  });

  /* ---------- sortiranje ---------- */
  const sortEl = $('[data-plp-sort]');
  sortEl.value = state.sort;
  sortEl.addEventListener('change', () => { state.sort = sortEl.value; update(); });

  /* ---------- gustina mreže (1/2 na telefonu, 3/4 na računaru) ---------- */
  const grid = $('[data-plp-grid]');
  const viewEl = $('[data-plp-view]');
  const mqs = [matchMedia('(max-width:767px)'), matchMedia('(max-width:1279px)')];
  const viewOpts = () => mqs[0].matches ? ['m', [1, 2]] : mqs[1].matches ? ['t', [2, 3]] : ['d', [3, 4]];
  const renderView = () => {
    const [k, opts] = viewOpts();
    const cur = store.get('forte-cols-' + k, opts[1]);
    grid.style.setProperty('--cols', opts.includes(cur) ? cur : opts[1]);
    grid.dataset.cols = opts.includes(cur) ? cur : opts[1];
    // ikonice: manja/veća gustina (1|2 na telefonu, 2|3 kolone šematski na većim ekranima)
    const icons = k === 'm' ? ['grid1', 'grid2'] : ['grid2', 'grid3'];
    viewEl.innerHTML = opts.map((n, i) => `<button data-cols="${n}" aria-pressed="${n == grid.dataset.cols}" aria-label="${n} ${n === 1 ? 'kolona' : 'kolone'}">${icon(icons[i])}</button>`).join('');
  };
  viewEl.addEventListener('click', e => {
    const b = e.target.closest('[data-cols]');
    if (!b) return;
    store.set('forte-cols-' + viewOpts()[0], +b.dataset.cols);
    renderView();
  });
  mqs.forEach(m => m.addEventListener('change', renderView));

  /* ---------- mreža ---------- */
  const more = $('[data-plp-more]');
  let list = [], shown = 0;

  const featureHTML = () => {
    // istaknuti model u mreži (samo bez filtera, na kategorijama)
    if (mode !== 'cat' || activeCount() || state.sort !== 'novo' || list.length < 12) return '';
    const top = list[0], sib = siblings(top);
    const minPrice = Math.min(...sib.map(p => p.price));
    return `<a class="plp-feature" href="${url(top)}" data-reveal>
      <img src="${img(top.imgs[1] || top.imgs[0])}" alt="${g(top).name}" loading="lazy">
      <span class="plp-feature__text">
        <small>Model sezone</small>
        <strong>${g(top).name}</strong>
        <span>${colorsWord(sib.length)} · od ${rsd(minPrice)}</span>
        <span class="plp-feature__dots">${sib.map(s => `<i style="--c:${s.hex}"></i>`).join('')}</span>
        <em class="link-arrow link-arrow--light">Pogledaj model ${icon('arrow')}</em>
      </span>
    </a>`;
  };
  const FEATURE_AT = 6;
  const cardsHTML = (from, to) => list.slice(from, to).map((p, i) =>
    (from + i === FEATURE_AT ? featureHTML() : '') + cardHTML(p, i % PAGE)).join('');

  const emptyHTML = () => {
    if (mode === 'wish' && !baseList().length) return `<div class="plp-empty">
        ${icon('heart')}<h2>Tvoja lista želja je prazna</h2>
        <p>Klikni na srce na bilo kom proizvodu i sačuvaj ga za kasnije.</p>
        <a href="${catUrl('novo')}" class="btn btn--dark">Pogledaj novo</a></div>`;
    if (mode === 'search' && !baseList().length) return `<div class="plp-empty">
        ${icon('search')}<h2>Nema rezultata za „${esc(q)}“</h2>
        <p>Proveri pravopis ili pogledaj kategorije:</p>
        <div class="chips">${[...CATEGORIES, catBySlug.novo].map(c => `<a href="${catUrl(c.slug)}">${c.name}</a>`).join('')}</div></div>`;
    return `<div class="plp-empty">
        ${icon('filter')}<h2>Nijedan model ne odgovara izboru</h2>
        <p>Probaj da ukloniš neki od filtera.</p>
        <button class="btn btn--dark" data-empty-clear>Obriši filtere</button></div>`;
  };
  grid.addEventListener('click', e => { if (e.target.closest('[data-empty-clear]')) clearAll(); });

  const renderMore = () => {
    more.hidden = !list.length || list.length <= PAGE;
    $('[data-plp-progress-text]').textContent = `Prikazano ${shown} od ${countWord(list.length)}`;
    $('[data-plp-progress]').style.width = (shown / Math.max(1, list.length) * 100) + '%';
    $('[data-plp-load]').hidden = shown >= list.length;
  };
  const renderGrid = () => {
    list = apply(baseList()).sort(SORTS[state.sort]);
    shown = Math.min(PAGE, list.length);
    grid.innerHTML = list.length ? cardsHTML(0, shown) : emptyHTML();
    grid.classList.toggle('is-empty', !list.length);
    renderMore();
    syncWish();
    observeReveal(grid);
  };
  $('[data-plp-load]').addEventListener('click', () => {
    const from = shown;
    shown = Math.min(shown + PAGE, list.length);
    grid.insertAdjacentHTML('beforeend', cardsHTML(from, shown));
    renderMore();
    syncWish();
    observeReveal(grid);
  });

  /* ---------- sve zajedno ---------- */
  const countEl = $('[data-plp-count]'), fCount = $('[data-filter-count]'), applyBtn = $('[data-filters-apply]');
  const update = ({ scroll = true } = {}) => {
    renderHead();
    renderFilters();
    renderActive();
    renderGrid();
    const n = activeCount();
    fCount.hidden = !n; fCount.textContent = n;
    countEl.textContent = countWord(list.length);
    $('[data-plp-eyebrow]').textContent = mode === 'cat' && cat.slug === 'outlet' ? `${countWord(list.length)} na sniženju` : countWord(list.length);
    applyBtn.textContent = list.length ? `Prikaži ${countWord(list.length)}` : 'Nema rezultata';
    $('[data-plp-bar]').hidden = !baseList().length; // prazna lista želja / pretraga bez rezultata
    syncURL();
    // posle promene filtera vrati pogled na vrh mreže (ako je korisnik ispod)
    const bar = $('[data-plp-bar]');
    if (scroll && bar.getBoundingClientRect().top < 0 && !$('#filters').classList.contains('is-open'))
      bar.scrollIntoView({ behavior: 'instant' });
  };

  // pretraga na samoj stranici
  const ps = $('[data-plp-search]');
  if (mode === 'search') { ps.hidden = false; ps.q.value = q; }

  // lista želja: osveži kad se nešto skloni
  if (mode === 'wish') {
    let key = [...wish].sort().join();
    document.addEventListener('forte:wish', () => {
      const k = [...wish].sort().join();
      if (k !== key) { key = k; update({ scroll: false }); }
    });
  }

  // "Prikaži" u panelu filtera samo zatvara panel
  applyBtn.addEventListener('click', () => close());

  // traka postaje "lepljiva" — senka kad se zalepi
  const bar = $('[data-plp-bar]');
  const sentinel = document.createElement('div');
  bar.before(sentinel);
  new IntersectionObserver(([en]) => bar.classList.toggle('is-stuck', !en.isIntersecting),
    { rootMargin: '-80px 0px 0px 0px' }).observe(sentinel);

  // opis kategorije (SEO tekst ispod mreže)
  const about = mode === 'cat' && ABOUT[cat.slug];
  if (about) {
    $('[data-plp-about]').hidden = false;
    $('[data-plp-about-title]').textContent = about[0];
    $('[data-plp-about-text]').innerHTML = about[1].map(t => `<p>${t}</p>`).join('');
  }

  renderView();
  update({ scroll: false });
})();
