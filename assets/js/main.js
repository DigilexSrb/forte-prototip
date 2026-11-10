/* =========================================================
   FORTE — zajednički JS (sve stranice) + početna.
   Zavisi od assets/js/products.js (window.FORTE).
   ========================================================= */
(() => {
  'use strict';

  const F = window.FORTE;
  const { GROUPS, PRODUCTS, CATEGORIES, catBySlug, TYPES, byId, SIZES, FREE_SHIP, query, newest, colorsOf, typesOf,
    siblings, title, url, catUrl, img, rsd, discount, colorsWord } = F;
  const countWord = n => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'proizvod' : 'proizvoda'}`;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = id => `<svg><use href="#i-${id}"/></svg>`;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* privatni režim */ } }
  };
  const priceHTML = p => p.was
    ? `<span class="is-sale-price">${rsd(p.price)}</span><s>${rsd(p.was)}</s>`
    : `<span>${rsd(p.price)}</span>`;

  /* =========================================================
     TOP BAR ticker
     ========================================================= */
  const ticker = $('[data-ticker]');
  if (ticker) {
    const items = $$('p', ticker);
    let i = 0;
    setInterval(() => {
      const cur = items[i];
      cur.classList.remove('is-active'); cur.classList.add('is-leaving');
      setTimeout(() => cur.classList.remove('is-leaving'), 600);
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    }, 4200);
  }

  /* =========================================================
     HEADER: providan preko hero-a (samo početna), pun na skrol,
     skriva se na skrol dole
     ========================================================= */
  const header = $('[data-header]');
  const alwaysSolid = !$('.hero');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-solid', alwaysSolid || y > 30);
    const hide = y > 500 && y > lastY + 4 && !document.body.classList.contains('is-locked');
    if (hide) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 500) header.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $$('.has-mega').forEach(li => {
    li.addEventListener('mouseenter', () => header.classList.add('is-open'));
    li.addEventListener('mouseleave', () => header.classList.remove('is-open'));
    li.addEventListener('focusin', () => header.classList.add('is-open'));
    li.addEventListener('focusout', () => header.classList.remove('is-open'));
  });

  /* =========================================================
     DRAWERS (meni, korpa) + pretraga
     ========================================================= */
  const scrim = $('[data-scrim]');
  let openEl = null;
  const open = id => {
    close();
    openEl = document.getElementById(id);
    if (!openEl) return;
    openEl.classList.add('is-open');
    openEl.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-on');
    document.body.classList.add('is-locked');
    header.classList.remove('is-hidden');
    if (id === 'search') setTimeout(() => $('[data-search-input]').focus(), 300);
  };
  const close = () => {
    if (!openEl) return;
    openEl.classList.remove('is-open');
    openEl.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    openEl = null;
  };
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest('[data-close]') || e.target === scrim) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* ---------- toast ---------- */
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (html, rich) => {
    toastEl.innerHTML = rich ? html : `<span>${html}</span>`;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 3200);
  };

  /* =========================================================
     LISTA ŽELJA
     ========================================================= */
  const wish = new Set(store.get('forte-wish', []));
  const wishCount = $('[data-wish-count]');
  const syncWish = () => {
    if (wishCount) { wishCount.hidden = !wish.size; wishCount.textContent = wish.size; }
    $$('[data-wish]').forEach(b => {
      const on = wish.has(b.dataset.wish);
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on);
    });
    store.set('forte-wish', [...wish]);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-wish]');
    if (!b) return;
    e.preventDefault();
    const id = b.dataset.wish;
    wish.has(id) ? wish.delete(id) : wish.add(id);
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    syncWish();
    toast(wish.has(id) ? 'Dodato u listu želja' : 'Uklonjeno iz liste želja');
  });

  /* =========================================================
     KORPA
     ========================================================= */
  let cart = store.get('forte-cart', []).filter(l => byId[l.id]);
  const cartItemsEl = $('[data-cart-items]');

  const renderCart = () => {
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const total = cart.reduce((s, l) => s + l.qty * byId[l.id].price, 0);
    const badge = $('[data-cart-count]');
    badge.hidden = !count; badge.textContent = count;
    $('[data-cart-count-text]').textContent = `(${count})`;
    $('[data-cart-subtotal]').textContent = rsd(total);

    const left = FREE_SHIP - total;
    $('.ship-meter').classList.toggle('is-free', left <= 0);
    $('[data-ship-text]').innerHTML = left > 0
      ? `Dodaj još <strong>${rsd(left)}</strong> za besplatnu dostavu`
      : '<strong>Ostvarila si besplatnu dostavu!</strong>';
    $('[data-ship-bar]').style.width = Math.min(100, total / FREE_SHIP * 100) + '%';

    $('[data-cart-foot]').hidden = !cart.length;
    cartItemsEl.innerHTML = cart.length ? cart.map((l, i) => {
      const p = byId[l.id];
      return `<div class="ci">
        <a href="${url(p)}"><img src="${img(p.imgs[0], true)}" alt=""></a>
        <div>
          <div class="ci__top"><a href="${url(p)}">${GROUPS[p.group].name}</a><span>${rsd(p.price * l.qty)}</span></div>
          <p class="ci__meta">${p.color} · Veličina ${l.size} · ${p.sku}</p>
          <div class="ci__row">
            <div class="qty">
              <button aria-label="Smanji" data-qty="${i}" data-d="-1">${icon('minus')}</button>
              <span>${l.qty}</span>
              <button aria-label="Povećaj" data-qty="${i}" data-d="1">${icon('plus')}</button>
            </div>
            <button class="ci__rm" data-rm="${i}">Ukloni</button>
          </div>
        </div>
      </div>`;
    }).join('') : `<div class="cart-empty">${icon('bag')}<p>Tvoja korpa je prazna.</p><a href="index.html#novo" class="btn btn--dark" data-close>Pogledaj novo</a></div>`;
    store.set('forte-cart', cart);
  };
  const addToCart = (id, size) => {
    const line = cart.find(l => l.id === id && l.size === size);
    line ? line.qty++ : cart.push({ id, size, qty: 1 });
    renderCart();
    const p = byId[id];
    toast(`<img src="${img(p.imgs[0], true)}" alt=""><span>${GROUPS[p.group].name} (${p.color}, ${size}) je u korpi</span><button data-open="cart">Korpa</button>`, true);
    $('[data-open="cart"]').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'ease-out' });
  };
  cartItemsEl.addEventListener('click', e => {
    const q = e.target.closest('[data-qty]');
    const r = e.target.closest('[data-rm]');
    if (q) {
      const l = cart[+q.dataset.qty];
      l.qty += +q.dataset.d;
      if (l.qty < 1) cart.splice(+q.dataset.qty, 1);
      renderCart();
    } else if (r) { cart.splice(+r.dataset.rm, 1); renderCart(); }
  });

  /* =========================================================
     KARTICA PROIZVODA (koristi se na svim stranicama)
     ========================================================= */
  const cardHTML = (p, i = 0) => {
    const sib = siblings(p);
    const badge = p.was ? `<span class="tag tag--sale">−${discount(p)}%</span>`
      : p.badge ? `<span class="tag${p.badge === 'Bestseler' ? ' tag--dark' : ''}">${p.badge}</span>` : '';
    return `<article class="card" style="animation-delay:${i * 60}ms">
      <div class="card__media">
        <a href="${url(p)}" aria-label="${title(p)}">
          <img src="${img(p.imgs[0], true)}" alt="${title(p)}" loading="lazy">
          <img class="alt" src="${img(p.imgs[1], true)}" alt="" loading="lazy">
        </a>
        ${badge}
        <button class="wish" data-wish="${p.id}" aria-label="Lista želja">${icon('heart')}</button>
        <div class="qa">
          <p>Brzo dodaj</p>
          <div>${SIZES.map(s => `<button data-quick="${p.id}" data-size="${s}"${p.out.includes(s) ? ' class="is-out" disabled' : ''}>${s}</button>`).join('')}</div>
        </div>
        <button class="qa-toggle" aria-label="Brzo dodaj u korpu">${icon('plus')}</button>
      </div>
      <div class="card__body">
        <div class="card__top">
          <div>
            <h3 class="card__name"><a href="${url(p)}">${GROUPS[p.group].name}</a></h3>
            <p class="card__color">${p.color}</p>
          </div>
          <p class="card__price">${priceHTML(p)}</p>
        </div>
        <div class="card__siblings">
          ${sib.map(s => `<a href="${url(s)}" style="--c:${s.hex}" class="${s.id === p.id ? 'is-self' : ''}" title="${s.color}" aria-label="${title(s)}"></a>`).join('')}
          <span>${colorsWord(sib.length)}</span>
        </div>
      </div>
    </article>`;
  };

  // brzo dodavanje + "+" dugme na touch uređajima (radi u svakom railu)
  document.addEventListener('click', e => {
    const q = e.target.closest('[data-quick]');
    if (q) { addToCart(q.dataset.quick, q.dataset.size); q.closest('.card')?.classList.remove('qa-open'); return; }
    const t = e.target.closest('.qa-toggle');
    if (t) {
      const card = t.closest('.card');
      $$('.card.qa-open').forEach(c => c !== card && c.classList.remove('qa-open'));
      card.classList.toggle('qa-open');
    }
  });

  /* ---------- rail (horizontalni niz kartica) ---------- */
  const track = $('[data-rail-track]');
  const bar = $('[data-rail-bar]');
  const prev = $('[data-rail="-1"]'), next = $('[data-rail="1"]');
  const updateRail = () => {
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const ratio = track.clientWidth / track.scrollWidth;
    if (bar) {
      bar.style.width = (ratio * 100) + '%';
      bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * (1 / ratio - 1) * 100 : 0}%)`;
    }
    if (prev) { prev.disabled = track.scrollLeft < 4; next.disabled = track.scrollLeft > max - 4; }
  };
  const renderRail = list => {
    if (!track) return;
    track.innerHTML = list;
    track.scrollLeft = 0;
    syncWish();
    updateRail();
  };
  if (track) {
    track.addEventListener('scroll', updateRail, { passive: true });
    addEventListener('resize', updateRail);
    $$('[data-rail]').forEach(b => b.addEventListener('click', () =>
      track.scrollBy({ left: +b.dataset.rail * track.clientWidth * .75 })));
  }

  /* =========================================================
     POČETNA — Novo u ponudi (filteri iz kataloga, stanje u URL-u)
     ?kat=zene|muskarci|prsluci|outlet  &tip=jakna|prsluk|mantil  &boja=crna
     ========================================================= */
  const tabs = $('[data-tabs]');
  const RAIL_LIMIT = 12;
  const promoHTML = () => `<article class="card card--promo">
      <div class="card__media">
        <img src="${img('jblack-4', true)}" alt="" loading="lazy">
        <div class="promo__text">
          <p class="eyebrow eyebrow--light">Uskoro</p>
          <h3>Zimske jakne stižu.</h3>
          <p>Prijavi se i saznaj prva kada nova kolekcija bude dostupna.</p>
          <a href="#nl-email" class="btn btn--light">Obavesti me</a>
        </div>
      </div>
    </article>`;
  const moreHTML = n => `<article class="card card--more">
      <button class="card__media" data-rail-all>
        <span><strong>+${n}</strong>Prikaži sve</span>
      </button>
    </article>`;
  let state = { kat: 'all', tip: null, boja: null };
  const setFilter = (next, { all = false, push = false } = {}) => {
    if (!tabs) return;
    state = { kat: 'all', tip: null, boja: null, ...next };
    if (!catBySlug[state.kat]) state.kat = 'all';
    $$('button', tabs).forEach(b => b.setAttribute('aria-selected', b.dataset.filter === state.kat));
    const f = state.kat === 'all' ? {} : { kat: state.kat };
    if (state.tip && TYPES[state.tip]) f.type = state.tip;
    if (state.boja) f.boja = state.boja;
    const list = newest(query(f));
    const shown = all ? list : list.slice(0, RAIL_LIMIT);

    // naslov sekcije prati filter
    const cat = catBySlug[state.kat];
    const color = state.boja && list[0] ? ' · ' + list[0].color : '';
    $('[data-rail-eyebrow]').textContent = cat ? `${countWord(list.length)}${color}` : 'Upravo stiglo';
    $('[data-rail-title]').innerHTML = cat
      ? (state.tip ? `${cat.name}: <em>${TYPES[state.tip].toLowerCase()}</em>` : cat.title.replace(/(\S+)$/, '<em>$1</em>'))
      : 'Novo u <em>ponudi</em>';

    renderRail((shown.map(cardHTML).join('')
      + (list.length > shown.length ? moreHTML(list.length - shown.length) : '')
      + (state.kat === 'all' && !all ? promoHTML() : '')) ||
      '<p class="rail__empty">Trenutno nema proizvoda za ovaj izbor.</p>');

    if (push) {
      const qs = new URLSearchParams();
      if (state.kat !== 'all') qs.set('kat', state.kat);
      if (state.tip) qs.set('tip', state.tip);
      if (state.boja) qs.set('boja', state.boja);
      history.replaceState(null, '', `${location.pathname}${qs.toString() ? '?' + qs : ''}#novo`);
    }
  };
  const fromParams = sp => ({ kat: sp.get('kat') || 'all', tip: sp.get('tip'), boja: sp.get('boja') });

  if (tabs) {
    tabs.innerHTML = [{ slug: 'all', name: 'Sve' }, ...CATEGORIES].map(c =>
      `<button role="tab" aria-selected="false" data-filter="${c.slug}">${c.name}</button>`).join('');
    tabs.addEventListener('click', e => {
      const b = e.target.closest('[data-filter]'); if (b) setFilter({ kat: b.dataset.filter }, { push: true });
    });
    track.addEventListener('click', e => {
      if (e.target.closest('[data-rail-all]')) setFilter(state, { all: true });
    });
    // linkovi ka kategorijama (meni, pločice, futer) na početnoj se rešavaju bez ponovnog učitavanja
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="index.html?kat="]');
      if (!a) return;
      e.preventDefault();
      setFilter(fromParams(new URL(a.href).searchParams), { push: true });
      $('#novo').scrollIntoView({ behavior: 'smooth' });
    });
    setFilter(fromParams(new URLSearchParams(location.search)));
  }

  /* =========================================================
     MENI — iz kataloga (desktop mega meni + mobilni meni)
     ========================================================= */
  const navData = slug => {
    const list = query({ kat: slug });
    return { list, types: typesOf(list), colors: colorsOf(list).slice(0, 7), top: newest(list)[0] };
  };
  $$('[data-mega]').forEach(box => {
    const slug = box.dataset.mega, { list, types, colors, top } = navData(slug);
    box.innerHTML = `<div class="mega__inner container">
      <div class="mega__col">
        <h4>Kategorije</h4>
        <a href="${catUrl(slug)}">Sve <small>${list.length}</small></a>
        ${types.map(t => `<a href="${catUrl(slug, '&tip=' + t.type)}">${t.name} <small>${t.count}</small></a>`).join('')}
      </div>
      <div class="mega__col">
        <h4>Po boji</h4>
        ${colors.map(c => `<a href="${catUrl(slug, '&boja=' + c.slug)}" class="mega__swatch"><i style="--c:${c.hex}"></i>${c.name}</a>`).join('')}
      </div>
      <div class="mega__col">
        <h4>Istaknuto</h4>
        <a href="${catUrl(slug)}">Novo u ponudi</a>
        <a href="${catUrl('outlet')}" class="is-sale">Outlet</a>
      </div>
      ${top ? `<a class="mega__feature" href="${url(top)}">
        <img src="${img(top.imgs[0], true)}" alt="${title(top)}" loading="lazy">
        <span><small>Istaknuto</small>${F.group(top).name} ${icon('arrow')}</span>
      </a>` : ''}
    </div>`;
  });
  const mNav = $('[data-m-nav]');
  if (mNav) {
    const sub = slug => {
      const { list, types } = navData(slug);
      return `<details>
        <summary>${catBySlug[slug].name} ${icon('plus')}</summary>
        <div>
          <a href="${catUrl(slug)}" data-close>Sve <small>${list.length}</small></a>
          ${types.map(t => `<a href="${catUrl(slug, '&tip=' + t.type)}" data-close>${t.name} <small>${t.count}</small></a>`).join('')}
        </div>
      </details>`;
    };
    mNav.innerHTML = `<a href="index.html#novo" data-close>Novo ${icon('arrow')}</a>
      ${sub('zene')}${sub('muskarci')}
      <a href="${catUrl('prsluci')}" data-close>Prsluci ${icon('arrow')}</a>
      <a href="${catUrl('outlet')}" class="is-sale" data-close>Outlet ${icon('arrow')}</a>`;
  }

  /* =========================================================
     POČETNA — pločice kategorija
     ========================================================= */
  $$('[data-cat-tiles]').forEach(box => {
    box.innerHTML = box.dataset.catTiles.split(',').map(slug => {
      const c = catBySlug[slug]; if (!c) return '';
      const list = newest(query({ kat: slug }));
      const alt = list.find(p => p.imgs[0] !== c.cover);
      return `<a href="${catUrl(slug)}" class="cut" data-reveal>
        <div class="cut__media">
          <img src="${img(c.cover)}" alt="${c.title}" loading="lazy">
          ${alt ? `<img src="${img(alt.imgs[0])}" alt="" loading="lazy" class="cut__alt">` : ''}
        </div>
        <div class="cut__body">
          <div>
            <small>${countWord(list.length)}</small>
            <h3>${c.title}</h3>
            <span class="dots">${colorsOf(list).slice(0, 6).map(x => `<i style="--c:${x.hex}" title="${x.name}"></i>`).join('')}</span>
          </div>
          <span class="cut__cta">Kupi ${icon('arrow')}</span>
        </div>
      </a>`;
    }).join('');
  });
  $$('[data-stat="products"]').forEach(el => { el.textContent = PRODUCTS.length; });

  /* =========================================================
     POČETNA — Istaknuti model (svaka boja = zaseban proizvod)
     ========================================================= */
  $$('[data-spotlight]').forEach(box => {
    box.innerHTML = PRODUCTS.filter(p => p.group === box.dataset.spotlight).map(p => `
      <a href="${url(p)}" class="mini">
        <span class="mini__img"><img src="${img(p.imgs[0], true)}" alt="${title(p)}" loading="lazy"></span>
        <span class="mini__name"><i style="--c:${p.hex}"></i>${p.color}</span>
        <span class="mini__price">${rsd(p.price)}</span>
      </a>`).join('');
  });

  /* =========================================================
     PRETRAGA — predlozi
     ========================================================= */
  const sp = $('[data-search-products]');
  const renderSearch = q => {
    q = (q || '').trim().toLowerCase();
    const list = (q ? PRODUCTS.filter(p => (title(p) + ' ' + F.group(p).type + ' ' + p.sku).toLowerCase().includes(q)) : newest(PRODUCTS)).slice(0, 4);
    sp.innerHTML = list.length ? list.map(p =>
      `<a href="${url(p)}"><img src="${img(p.imgs[0], true)}" alt="" loading="lazy">${GROUPS[p.group].name}<small>${p.color} · ${rsd(p.price)}</small></a>`).join('')
      : '<p style="color:var(--muted)">Nema rezultata.</p>';
  };
  $('[data-search-input]').addEventListener('input', e => renderSearch(e.target.value));

  /* =========================================================
     VIDEO
     ========================================================= */
  const video = $('[data-video]'), vt = $('[data-video-toggle]');
  if (video) {
    vt.addEventListener('click', () => { video.paused ? video.play() : video.pause(); });
    video.addEventListener('play', () => { vt.innerHTML = icon('pause'); vt.setAttribute('aria-label', 'Pauziraj video'); });
    video.addEventListener('pause', () => { vt.innerHTML = icon('play'); vt.setAttribute('aria-label', 'Pusti video'); });
    // pusti samo kad je vidljiv (štedi bateriju na telefonu)
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) video.play().catch(() => {}); else video.pause();
    }, { threshold: .25 }).observe(video);
  }

  /* =========================================================
     NEWSLETTER
     ========================================================= */
  const nl = $('[data-newsletter]');
  if (nl) nl.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('[data-nl-msg]');
    const email = $('input[type=email]', nl).value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    const agreed = $('input[type=checkbox]', nl).checked;
    msg.className = 'nl-form__msg ' + (ok && agreed ? 'is-ok' : 'is-err');
    msg.textContent = !ok ? 'Unesi ispravnu e-mail adresu.' : !agreed ? 'Potrebna je tvoja saglasnost.' : 'Hvala! Kod za −10% stiže na tvoj e-mail.';
    if (ok && agreed) nl.reset();
  });

  /* =========================================================
     REVEAL na skrol
     ========================================================= */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  const observeReveal = (root = document) => $$('[data-reveal]:not(.is-in)', root).forEach(el => io.observe(el));

  /* ---------- futer: na telefonu kolone su zatvorene (harmonika) ---------- */
  if (matchMedia('(max-width:767px)').matches) $$('.footer__col').forEach(d => d.removeAttribute('open'));

  /* ---------- init ---------- */
  renderSearch('');
  renderCart();
  syncWish();
  observeReveal();

  // API za druge skripte (npr. stranica proizvoda)
  F.ui = { $, $$, icon, toast, addToCart, syncWish, cardHTML, renderRail, priceHTML, observeReveal };
})();
