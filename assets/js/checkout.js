/* =========================================================
   FORTE — poručivanje (porucivanje.html)
   Korpa iz localStorage (main.js), forma sa proverom polja,
   kod za popust, obračun dostave, potvrda porudžbine.
   Prototip: porudžbina se ne šalje nigde.
   ========================================================= */
(() => {
  'use strict';

  const F = window.FORTE;
  const { byId, FREE_SHIP, SHIP_PRICE, PROMO, url, img, rsd, title } = F;
  const { $, $$, icon, store, cart, countWord } = F.ui;
  const g = F.group;

  const grid = $('[data-co-grid]'), empty = $('[data-co-empty]'), done = $('[data-co-done]');
  const sumBox = $('[data-co-sum]');
  let promo = store.get('forte-promo', null);
  if (promo && !PROMO[promo]) promo = null;

  /* ---------- obračun ---------- */
  const calc = () => {
    const lines = cart.lines();
    const sub = lines.reduce((s, l) => s + l.qty * byId[l.id].price, 0);
    const disc = promo ? Math.round(sub * PROMO[promo] / 100) : 0;
    const ship = sub - disc >= FREE_SHIP || !lines.length ? 0 : SHIP_PRICE;
    return { lines, count: lines.reduce((s, l) => s + l.qty, 0), sub, disc, ship, total: sub - disc + ship };
  };

  const lineHTML = (l, i, editable) => {
    const p = byId[l.id];
    return `<div class="co-line">
      <a href="${url(p)}" class="co-line__img"><img src="${img(p.imgs[0], true)}" alt="${title(p)}">${editable ? '' : `<b>${l.qty}</b>`}</a>
      <div class="co-line__info">
        <a href="${url(p)}"><strong>${g(p).name}</strong></a>
        <span>${p.color} · ${l.size}</span>
        ${editable ? `<div class="co-line__row">
          <div class="qty qty--sm">
            <button type="button" aria-label="Smanji" data-co-qty="${i}" data-d="-1">${icon('minus')}</button>
            <span>${l.qty}</span>
            <button type="button" aria-label="Povećaj" data-co-qty="${i}" data-d="1">${icon('plus')}</button>
          </div>
          <button type="button" class="ci__rm" data-co-rm="${i}">Ukloni</button>
        </div>` : ''}
      </div>
      <span class="co-line__price">${rsd(p.price * l.qty)}${p.was ? `<s>${rsd(p.was * l.qty)}</s>` : ''}</span>
    </div>`;
  };
  const totalsHTML = c => `
    <div><dt>Međuzbir</dt><dd>${rsd(c.sub)}</dd></div>
    ${c.disc ? `<div><dt>Popust ${promo}</dt><dd>−${rsd(c.disc)}</dd></div>` : ''}
    <div><dt>Dostava</dt><dd>${c.ship ? rsd(c.ship) : 'Besplatno'}</dd></div>
    <div class="co-totals__sum"><dt>Ukupno</dt><dd>${rsd(c.total)}</dd></div>`;

  const render = () => {
    if (!done.hidden) return;
    const c = calc();
    empty.hidden = !!c.lines.length;
    grid.hidden = !c.lines.length;
    $('[data-co-head]').hidden = !c.lines.length;
    if (!c.lines.length) return;

    $('[data-co-lines]').innerHTML = c.lines.map((l, i) => lineHTML(l, i, true)).join('');
    $('[data-co-count]').textContent = `(${c.count})`;
    $('[data-co-sub]').textContent = rsd(c.sub);
    $('[data-co-disc-row]').hidden = !c.disc;
    $('[data-co-disc]').textContent = '−' + rsd(c.disc);
    $('[data-co-disc-code]').textContent = promo || '';
    $('[data-co-ship]').textContent = c.ship ? rsd(c.ship) : 'Besplatno';
    $('[data-co-ship-opt]').textContent = c.ship ? rsd(c.ship) : 'Besplatno';
    $('[data-co-total]').textContent = rsd(c.total);
    $('[data-co-total-top]').textContent = rsd(c.total);
    $('[data-co-submit] span').textContent = `Poruči · ${rsd(c.total)}`;

    const left = FREE_SHIP - (c.sub - c.disc);
    $('.co-meter').classList.toggle('is-free', left <= 0);
    $('[data-co-ship-text]').innerHTML = left > 0
      ? `Još <strong>${rsd(left)}</strong> do besplatne dostave`
      : '<strong>Dostava je besplatna</strong>';
    $('[data-co-ship-bar]').style.width = Math.min(100, (c.sub - c.disc) / FREE_SHIP * 100) + '%';
  };

  $('[data-co-lines]').addEventListener('click', e => {
    const q = e.target.closest('[data-co-qty]'), r = e.target.closest('[data-co-rm]');
    if (q) { const i = +q.dataset.coQty; cart.setQty(i, cart.lines()[i].qty + +q.dataset.d); }
    else if (r) cart.remove(+r.dataset.coRm);
  });
  document.addEventListener('forte:cart', render);

  /* ---------- pregled: na telefonu sklopljen, na računaru uvek otvoren ---------- */
  const mqDesk = matchMedia('(min-width:1024px)');
  const syncSum = () => { sumBox.open = mqDesk.matches; };
  mqDesk.addEventListener('change', syncSum);
  syncSum();
  sumBox.addEventListener('toggle', () => {
    $('[data-co-toggle-text]').textContent = sumBox.open ? 'Sakrij porudžbinu' : 'Prikaži porudžbinu';
  });
  $('.co-sum__toggle').addEventListener('click', e => { if (mqDesk.matches) e.preventDefault(); });

  /* ---------- kod za popust ---------- */
  const promoForm = $('[data-co-promo]'), promoMsg = $('[data-co-promo-msg]');
  promoForm.addEventListener('submit', e => {
    e.preventDefault();
    const code = promoForm.querySelector('input').value.trim().toUpperCase();
    if (!code) return;
    if (PROMO[code]) {
      promo = code; store.set('forte-promo', promo);
      promoMsg.className = 'co-promo__msg is-ok'; promoMsg.textContent = `Kod ${code} je primenjen (−${PROMO[code]}%).`;
      promoForm.reset();
    } else {
      promoMsg.className = 'co-promo__msg is-err'; promoMsg.textContent = 'Kod nije ispravan ili je istekao.';
    }
    render();
  });
  $('[data-co-promo-rm]').addEventListener('click', () => {
    promo = null; store.set('forte-promo', null); promoMsg.textContent = ''; render();
  });

  /* ---------- izbor plaćanja (stil) ---------- */
  $$('.radio input').forEach(r => r.addEventListener('change', () =>
    $$(`input[name="${r.name}"]`).forEach(x => x.closest('.radio').classList.toggle('is-on', x.checked))));

  /* ---------- provera polja ---------- */
  const form = $('[data-co-form]');
  const RULES = {
    email: [v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), 'Unesi ispravnu e-mail adresu.'],
    tel: [v => v.replace(/[\s/-]/g, '').replace(/^\+381/, '0').match(/^0\d{8,9}$/), 'Unesi broj telefona, npr. 064 123 4567.'],
    ime: [v => v.length > 1, 'Unesi ime.'],
    prezime: [v => v.length > 1, 'Unesi prezime.'],
    adresa: [v => v.length > 3 && /\d/.test(v), 'Unesi ulicu i broj.'],
    ptt: [v => /^\d{5}$/.test(v), 'Poštanski broj ima 5 cifara.'],
    grad: [v => v.length > 1, 'Unesi grad.']
  };
  const check = input => {
    const rule = RULES[input.name];
    if (!rule) return true;
    const ok = !!rule[0](input.value.trim());
    const field = input.closest('.field');
    field.classList.toggle('is-err', !ok);
    let msg = field.querySelector('.field__err');
    if (!ok && !msg) { msg = document.createElement('p'); msg.className = 'field__err'; field.append(msg); }
    if (msg) msg.textContent = ok ? '' : rule[1];
    input.setAttribute('aria-invalid', !ok);
    return ok;
  };
  form.addEventListener('blur', e => { if (e.target.name in RULES && e.target.value) check(e.target); }, true);
  form.addEventListener('input', e => { if (e.target.closest('.field.is-err')) check(e.target); });
  $('[name="ptt"]', form).addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = Object.keys(RULES).map(n => form.elements[n]).filter(i => !check(i));
    const terms = form.elements.uslovi.checked;
    $('[data-co-terms-err]').hidden = terms;
    if (bad.length) { bad[0].focus(); bad[0].scrollIntoView({ block: 'center' }); return; }
    if (!terms) { form.elements.uslovi.focus(); return; }

    const btn = $('[data-co-submit]');
    btn.disabled = true; btn.classList.add('is-loading');
    $('[data-co-submit] span').textContent = form.elements.placanje.value === 'kartica' ? 'Povezivanje sa bankom…' : 'Šaljemo porudžbinu…';
    setTimeout(() => finish(new FormData(form)), 900);
  });

  /* ---------- potvrda ---------- */
  const finish = data => {
    const c = calc();
    const no = 'FT-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 9000) + 1000);
    const card = data.get('placanje') === 'kartica';
    $('[data-done-no]').textContent = no;
    $('[data-done-name]').textContent = data.get('ime') + '!';
    $('[data-done-lead]').textContent = `Porudžbina je primljena. Potvrdu smo poslali na ${data.get('email')}, a kurir će te pozvati pre isporuke (1–3 radna dana).`;
    $('[data-done-lines]').innerHTML = c.lines.map((l, i) => lineHTML(l, i, false)).join('');
    $('[data-done-totals]').innerHTML = totalsHTML(c);
    $('[data-done-meta]').innerHTML = `
      <div><small>Dostava na adresu</small><p>${esc(data.get('ime'))} ${esc(data.get('prezime'))}<br>${esc(data.get('adresa'))}<br>${esc(data.get('ptt'))} ${esc(data.get('grad'))}<br>${esc(data.get('tel'))}</p></div>
      <div><small>Plaćanje</small><p>${card ? 'Platnom karticom — plaćeno' : `Pouzećem — ${rsd(c.total)} plaćaš kuriru`}</p></div>`;
    done.hidden = false;
    grid.hidden = true;
    $('.co-steps [data-step="2"]').className = 'is-done';
    $('.co-steps [data-step="3"]').className = 'is-active';
    promo = null; store.set('forte-promo', null);
    cart.clear();
    scrollTo({ top: 0, behavior: 'instant' });
    done.focus({ preventScroll: true });
  };
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // u pregledu korpe na ovoj stranici dugme "Završi kupovinu" samo zatvara fioku
  $$('#cart a[href="porucivanje.html"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); F.ui.close(); }));

  render();
})();
