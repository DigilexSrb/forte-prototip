/* =========================================================
   FORTE — informativne stranice (info.html?strana=<slug>)
   Tekstovi su radne verzije za prototip — konačne tekstove
   (uslovi, privatnost, prodavnice, kontakt) dostavlja FORTE.
   ========================================================= */
(() => {
  'use strict';

  const F = window.FORTE;
  const { FREE_SHIP, SHIP_PRICE, rsd, catUrl, infoUrl } = F;
  const { $, icon, sizeGuideHTML } = F.ui;

  const draft = 'Radna verzija teksta — konačnu verziju dostavlja FORTE.';
  const faq = items => `<div class="accordion">${items.map(([q, a], i) => `<details${i ? '' : ' open'}>
      <summary>${q} ${icon('plus')}</summary><p>${a}</p></details>`).join('')}</div>`;

  const PAGES = {
    dostava: {
      group: 'Pomoć', title: 'Dostava',
      lead: 'Porudžbine šaljemo kurirskom službom na teritoriji cele Srbije.',
      html: () => `
        <div class="info-cards">
          <div><strong>1–3 radna dana</strong><span>rok isporuke od potvrde porudžbine</span></div>
          <div><strong>${rsd(SHIP_PRICE)}</strong><span>cena dostave za porudžbine do ${rsd(FREE_SHIP)}</span></div>
          <div><strong>Besplatno</strong><span>za porudžbine preko ${rsd(FREE_SHIP)}</span></div>
        </div>
        <h2>Kako teče isporuka</h2>
        <ol class="info-steps">
          <li><strong>Potvrda</strong> Nakon poručivanja stiže ti e-mail sa brojem porudžbine.</li>
          <li><strong>Slanje</strong> Paket predajemo kurirskoj službi i šaljemo ti broj pošiljke za praćenje.</li>
          <li><strong>Isporuka</strong> Kurir te zove pre dolaska. Ako plaćaš pouzećem, iznos plaćaš kuriru.</li>
        </ol>
        <h2>Napomene</h2>
        <ul class="dash-list">
          <li>Porudžbine primljene vikendom i praznikom šaljemo prvog narednog radnog dana.</li>
          <li>Ako nisi kod kuće, kurir pokušava isporuku još jednom narednog radnog dana.</li>
          <li>Pre nego što potpišeš prijem, proveri da paket nije oštećen.</li>
        </ul>`
    },
    placanje: {
      group: 'Pomoć', title: 'Načini plaćanja',
      lead: 'Sve cene su izražene u dinarima (RSD) i uključuju PDV.',
      html: () => `
        <div class="info-cards info-cards--2">
          <div>${icon('truck')}<strong>Pouzećem</strong><span>Plaćaš gotovinom kuriru prilikom preuzimanja paketa.</span></div>
          <div>${icon('card')}<strong>Platnom karticom</strong><span>Visa, Mastercard i DinaCard. Plaćanje se obavlja na zaštićenoj stranici banke.</span></div>
        </div>
        <h2>Sigurnost plaćanja karticom</h2>
        <p>Podaci o kartici se unose isključivo na stranici banke i nikada nisu dostupni prodavcu. Komunikacija je zaštićena SSL enkripcijom, a plaćanje potvrđuješ kroz 3-D Secure proveru svoje banke.</p>
        <h2>Povraćaj novca</h2>
        <p>Ako vratiš proizvod plaćen karticom, novac vraćamo na istu karticu. Za porudžbine plaćene pouzećem novac uplaćujemo na tvoj tekući račun.</p>`
    },
    povrat: {
      group: 'Pomoć', title: 'Zamena i povrat',
      lead: 'Imaš 14 dana od prijema paketa da zameniš veličinu ili vratiš proizvod.',
      html: () => `
        <ol class="info-steps">
          <li><strong>Javi nam se</strong> Pošalji e-mail ili pozovi i navedi broj porudžbine i šta želiš da zameniš ili vratiš.</li>
          <li><strong>Spakuj</strong> Proizvod mora biti nenošen, neopran i sa originalnim etiketama.</li>
          <li><strong>Pošalji</strong> Paket predaj kuriru. Kod zamene ti šaljemo novu veličinu čim stigne vraćeni proizvod.</li>
        </ol>
        <h2>Važno</h2>
        <ul class="dash-list">
          <li>Rok za odustanak od kupovine je 14 dana od dana prijema, u skladu sa Zakonom o zaštiti potrošača.</li>
          <li>Novac vraćamo najkasnije 14 dana od prijema izjave o odustanku.</li>
          <li>Troškove vraćanja proizvoda snosi kupac, osim ako je proizvod oštećen ili pogrešno poslat.</li>
        </ul>
        <p class="info-draft">${draft}</p>`
    },
    velicine: {
      group: 'Pomoć', title: 'Tabela veličina',
      lead: 'Mere su u centimetrima i odnose se na telo, ne na jaknu.',
      html: () => `
        <h2>Žene</h2>${sizeGuideHTML('z')}
        <h2>Muškarci</h2>${sizeGuideHTML('m')}
        <h2>Kako da se izmeriš</h2>
        <ul class="dash-list">
          <li><strong>Grudi:</strong> merna traka oko najširog dela grudi, ispod pazuha.</li>
          <li><strong>Struk:</strong> oko najužeg dela struka.</li>
          <li><strong>Kukovi:</strong> oko najširog dela kukova.</li>
        </ul>
        <p>Ako si između dve veličine, za štepane jakne i puf prsluke preporučujemo veću — ostaje mesta za džemper.</p>
        <p class="info-draft">Okvirne mere — tačne mere po modelu dostavlja FORTE.</p>`
    },
    pitanja: {
      group: 'Pomoć', title: 'Česta pitanja',
      lead: 'Odgovori na pitanja koja nam najčešće postavljate.',
      html: () => faq([
        ['Koliko traje dostava?', `Isporuka traje 1–3 radna dana. Dostava je besplatna za porudžbine preko ${rsd(FREE_SHIP)}.`],
        ['Mogu li da zamenim veličinu?', 'Da, u roku od 14 dana od prijema. Proizvod treba da bude nenošen i sa etiketama.'],
        ['Zašto je svaka boja poseban proizvod?', 'Svaka boja ima svoje fotografije, šifru i zalihe, tako da tačno vidiš šta naručuješ i da li je tvoja veličina dostupna.'],
        ['Kako da izaberem veličinu?', `Pogledaj <a href="${infoUrl('velicine')}">tabelu veličina</a>. Ako si između dve veličine, uzmi veću.`],
        ['Kako da održavam puf jaknu?', 'Peri na 30 °C na programu za osetljivo, ne koristi omekšivač i ne suši u mašini. Pre nošenja protresi jaknu da se punjenje rasporedi.'],
        ['Mogu li da platim karticom?', 'Da — Visa, Mastercard i DinaCard. Možeš da platiš i pouzećem.']
      ])
    },
    kontakt: {
      group: 'Pomoć', title: 'Kontakt',
      lead: 'Tu smo radnim danima od 9 do 17 časova.',
      html: () => `
        <div class="info-cards">
          <a href="tel:+381600000000">${icon('user')}<strong>+381 60 000 0000</strong><span>Poziv ili Viber</span></a>
          <a href="mailto:info@vasdomen.rs">${icon('bag')}<strong>info@vasdomen.rs</strong><span>Odgovaramo u roku od 24h</span></a>
          <a href="#" aria-label="Instagram">${icon('ig')}<strong>Instagram</strong><span>Piši nam u poruke</span></a>
        </div>
        <h2>Pošalji poruku</h2>
        <form class="info-form" data-contact novalidate>
          <div class="fields">
            <div class="field field--half"><label for="c-ime">Ime</label><input id="c-ime" name="ime" autocomplete="name" required></div>
            <div class="field field--half"><label for="c-email">E-mail</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
            <div class="field"><label for="c-poruka">Poruka</label><textarea id="c-poruka" name="poruka" rows="5" required></textarea></div>
          </div>
          <button class="btn btn--dark" type="submit">Pošalji poruku</button>
          <p class="nl-form__msg" data-contact-msg></p>
        </form>
        <p class="info-draft">Kontakt podaci su privremeni.</p>`
    },
    'o-nama': {
      group: 'Forte', title: 'O nama',
      lead: 'Toplina sa stavom.',
      html: () => `
        <figure class="info-figure"><img src="assets/img/jgrey-3.jpg" alt="FORTE kratka štepana jakna"></figure>
        <p>FORTE pravi jakne i prsluke za svakodnevni život u gradu — tople, udobne i sa detaljima koji se primećuju. Svaki model dolazi u više boja, a svaka boja je poseban proizvod, sa svojim fotografijama i zalihama.</p>
        <p>Verujemo da zimska jakna ne mora da bira između toplote i stila. Zato pažljivo biramo materijale, krojeve i punjenje, i testiramo ih kroz cele zime.</p>
        <p><a class="link-arrow" href="${catUrl('novo')}">Pogledaj novu kolekciju ${icon('arrow')}</a></p>
        <p class="info-draft">${draft}</p>`
    },
    prodavnice: {
      group: 'Forte', title: 'Prodavnice',
      lead: 'Dođi da probaš jaknu uživo.',
      html: () => `<p class="info-draft">Adrese i radno vreme prodavnica dostavlja FORTE.</p>`
    },
    uslovi: {
      group: 'Forte', title: 'Uslovi korišćenja',
      lead: 'Opšti uslovi kupovine u FORTE online prodavnici.',
      html: () => `<p>Korišćenjem sajta i poručivanjem prihvataš uslove kupovine. Cene su izražene u dinarima sa uračunatim PDV-om. Ugovor o kupovini je zaključen kada primiš e-mail potvrdu porudžbine.</p>
        <p class="info-draft">${draft}</p>`
    },
    privatnost: {
      group: 'Forte', title: 'Politika privatnosti',
      lead: 'Kako čuvamo i koristimo tvoje podatke.',
      html: () => `<p>Lične podatke (ime, adresu, telefon i e-mail) koristimo isključivo za obradu porudžbine i, uz tvoju saglasnost, za slanje obaveštenja. Podatke ne prodajemo i ne ustupamo trećim licima, osim kurirskoj službi radi isporuke.</p>
        <p class="info-draft">${draft}</p>`
    },
    kolacici: {
      group: 'Forte', title: 'Kolačići',
      lead: 'Sajt koristi kolačiće i lokalnu memoriju pregledača.',
      html: () => `<p>Korpa i lista želja se čuvaju u memoriji tvog pregledača, kako bi ostale sačuvane kada se vratiš. Analitičke kolačiće koristimo samo uz tvoju saglasnost.</p>
        <p class="info-draft">${draft}</p>`
    }
  };

  const slug = new URLSearchParams(location.search).get('strana');
  const page = PAGES[slug] ? slug : 'dostava';
  const P = PAGES[page];

  document.title = `${P.title} | FORTE`;
  $('meta[name="description"]')?.setAttribute('content', P.lead);
  $('[data-crumbs]').innerHTML = `<a href="index.html">Početna</a><span>/</span><span>${P.group === 'Pomoć' ? 'Pomoć' : 'Forte'}</span><span>/</span><span>${P.title}</span>`;

  const groups = [...new Set(Object.values(PAGES).map(x => x.group))];
  $('[data-info-nav]').innerHTML = groups.map(gr => `<div><h4>${gr}</h4>${Object.entries(PAGES)
    .filter(([, x]) => x.group === gr)
    .map(([s, x]) => `<a href="${infoUrl(s)}"${s === page ? ' aria-current="page"' : ''}>${x.title}</a>`).join('')}</div>`).join('');

  $('[data-info-body]').innerHTML = `<p class="eyebrow">${P.group}</p><h1 class="plp-title">${P.title}</h1>
    <p class="plp-lead">${P.lead}</p><div class="info__content">${P.html()}</div>`;

  // aktivna stavka vidljiva u horizontalnom meniju na telefonu
  $('[data-info-nav] [aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
  scrollTo(0, 0);

  const cf = $('[data-contact]');
  if (cf) cf.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('[data-contact-msg]');
    const ok = cf.ime.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cf.email.value.trim()) && cf.poruka.value.trim().length > 4;
    msg.className = 'nl-form__msg ' + (ok ? 'is-ok' : 'is-err');
    msg.textContent = ok ? 'Hvala! Odgovorićemo ti u roku od 24h.' : 'Popuni ime, ispravan e-mail i poruku.';
    if (ok) cf.reset();
  });
})();
