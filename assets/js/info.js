/* =========================================================
   FORTE — informativne stranice (info.html?strana=<slug>)

   Tekstovi su usklađeni sa propisima koji važe od 2.8.2026:
   - Zakon o zaštiti potrošača („Sl. glasnik RS”, br. 35/2026) — ZZP
   - Zakon o trgovini (52/2019, 35/2026)
   - Zakon o elektronskoj trgovini (41/2009, 95/2013, 52/2019)
   - Pravilnik o obrascu za odustanak (21/2022)
   - Pravilnik o označavanju tekstilnih proizvoda (1/2014, 86/2019)
   - Zakon o zaštiti podataka o ličnosti (87/2018)
   - Zakon o elektronskim komunikacijama (35/2023), čl. 160 — kolačići
   Podaci u [zagradama] (F.SELLER) su privremeni — dostavlja FORTE.
   Pre objave tekstove treba da pregleda pravnik.
   ========================================================= */
(() => {
  'use strict';

  const F = window.FORTE;
  const { FREE_SHIP, SHIP_PRICE, SELLER: S, rsd, catUrl, infoUrl } = F;
  const { $, $$, icon, sizeGuideHTML, toast } = F.ui;

  const draft = t => `<p class="info-draft">${t}</p>`;
  const law = t => `<p class="info-law">${t}</p>`;
  const updated = `<p class="info-updated">Poslednja izmena: ${S.updated}</p>`;
  const faq = items => `<div class="accordion">${items.map(([q, a], i) => `<details${i ? '' : ' open'}>
      <summary>${q} ${icon('plus')}</summary><p>${a}</p></details>`).join('')}</div>`;
  const table = rows => `<table class="info-table"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>`;
  const mail = m => `<a href="mailto:${m}">${m}</a>`;
  const ODS_URL = 'https://vansudsko.mtt.gov.rs/adrbodies';

  /* ---------- obrasci (odustanak / reklamacija) ---------- */
  const field = (id, label, cls = '', attrs = 'required', tag = 'input') => `
    <div class="field ${cls}"><label for="${id}">${label}</label>${tag === 'textarea'
      ? `<textarea id="${id}" name="${id}" rows="4" ${attrs}></textarea>`
      : `<input id="${id}" name="${id}" ${attrs}>`}</div>`;

  const formHTML = kind => `
    <form class="info-form legal-form" data-legal-form="${kind}" novalidate>
      <div class="fields">
        ${field('f-ime', 'Ime i prezime', 'field--half', 'autocomplete="name" required')}
        ${field('f-email', 'E-mail', 'field--half', 'type="email" autocomplete="email" required')}
        ${field('f-tel', 'Telefon', 'field--half', 'type="tel" inputmode="tel" autocomplete="tel" required')}
        ${field('f-porudzbina', 'Broj porudžbine', 'field--half', 'placeholder="FT-…" required')}
        ${kind === 'odustanak' ? `
          ${field('f-ugovor', 'Datum porudžbine', 'field--half', 'type="date" required')}
          ${field('f-prijem', 'Datum prijema robe', 'field--half', 'type="date" required')}
          ${field('f-proizvod', 'Proizvodi od kojih odustaješ (naziv, boja, veličina)', '', 'required', 'textarea')}
          ${field('f-adresa', 'Tvoja adresa', '', 'autocomplete="street-address" required')}
          ${field('f-racun', 'Broj tekućeg računa za povraćaj <em>(samo ako si plaćao/la pouzećem)</em>', '', 'inputmode="numeric" placeholder="xxx-xxxxxxxxxxxxx-xx"')}
          ${field('f-razlog', 'Razlog odustanka <em>(nije obavezno)</em>', '', '', 'textarea')}`
        : `
          ${field('f-prijem', 'Datum prijema robe', 'field--half', 'type="date" required')}
          ${field('f-proizvod', 'Proizvod (naziv, boja, veličina)', 'field--half', 'required')}
          ${field('f-opis', 'Opis nesaobraznosti — šta nije u redu i kada si primetio/la', '', 'required', 'textarea')}
          <div class="field"><label for="f-zahtev">Šta tražiš</label>
            <select id="f-zahtev" name="f-zahtev" required>
              <option value="">— izaberi —</option>
              <option>Popravku</option><option>Zamenu za isti proizvod</option>
              <option>Umanjenje cene</option><option>Raskid ugovora i povraćaj novca</option>
            </select></div>
          <div class="field"><label for="f-foto">Fotografije <em>(opciono — ubrzavaju rešavanje)</em></label>
            <input id="f-foto" name="f-foto" type="file" accept="image/*,.pdf" multiple></div>
          ${field('f-racun', 'Broj tekućeg računa <em>(samo ako tražiš povraćaj novca, a plaćao/la si pouzećem)</em>', '', 'inputmode="numeric" placeholder="xxx-xxxxxxxxxxxxx-xx"')}`}
      </div>
      <p class="legal-form__note">Podatke koristimo samo za rešavanje ovog zahteva i vođenje evidencije koju propisuje zakon. <a href="${infoUrl('privatnost')}">Politika privatnosti</a></p>
      <button class="btn btn--dark" type="submit">${kind === 'odustanak' ? 'Pošalji izjavu o odustanku' : 'Pošalji reklamaciju'}</button>
      <p class="nl-form__msg" data-legal-msg></p>
    </form>
    <div class="legal-done" data-legal-done hidden tabindex="-1"></div>`;

  /* zvanični obrazac (Pravilnik, „Sl. glasnik RS”, br. 21/2022) — za štampu */
  const obrazacHTML = () => `
    <h1>Izjava o odustanku od ugovora zaključenog na daljinu ili izvan poslovnih prostorija</h1>
    <p><b>Popunjava trgovac:</b></p>
    <p>Naziv: ${S.name}<br>Adresa: ${S.address}<br>Broj telefona: ${S.phone}<br>Elektronska pošta: ${S.claims}</p>
    <p><b>Popunjava potrošač:</b></p>
    <p>Ovim obaveštavam da odustajem od ugovora o prodaji sledeće robe/usluge (*):</p><div class="ln"></div><div class="ln"></div>
    <p>Datum zaključenja ugovora:</p><div class="ln"></div>
    <p>Datum prijema robe:</p><div class="ln"></div>
    <p>Razlozi za odustanak (nije obavezno popunjavati):</p><div class="ln"></div><div class="ln"></div>
    <p>Ime i prezime potrošača:</p><div class="ln"></div>
    <p>Adresa potrošača:</p><div class="ln"></div>
    <p>Potpis potrošača (ukoliko se dostavlja poštom ili faksom):</p><div class="ln"></div>
    <p>Datum (popunjavanja obrasca):</p><div class="ln"></div>
    <p><small>(*) Precrtati nepotrebno.</small></p>`;

  const printObrazac = () => {
    const w = open('', '_blank');
    if (!w) { toast('Dozvoli iskačuće prozore da bi odštampao obrazac'); return; }
    w.document.write(`<!doctype html><html lang="sr"><head><meta charset="utf-8"><title>Obrazac za odustanak — FORTE</title>
      <style>body{font:14px/1.5 Arial,sans-serif;max-width:640px;margin:32px auto;padding:0 16px;color:#111}h1{font-size:18px}.ln{border-bottom:1px solid #999;height:26px;margin-bottom:6px}</style>
      </head><body>${obrazacHTML()}<script>print()<\/script></body></html>`);
    w.document.close();
  };

  /* ---------- STRANICE ---------- */
  const PAGES = {
    dostava: {
      group: 'Pomoć', title: 'Dostava',
      lead: 'Porudžbine šaljemo kurirskom službom na teritoriji Republike Srbije.',
      html: () => `
        <div class="info-cards">
          <div><strong>1–3 radna dana</strong><span>uobičajen rok isporuke od potvrde porudžbine</span></div>
          <div><strong>${rsd(SHIP_PRICE)}</strong><span>cena dostave za porudžbine do ${rsd(FREE_SHIP)}</span></div>
          <div><strong>Besplatno</strong><span>za porudžbine preko ${rsd(FREE_SHIP)}</span></div>
        </div>
        <h2>Kako teče isporuka</h2>
        <ol class="info-steps">
          <li><strong>Potvrda</strong> Odmah po poručivanju stiže ti e-mail sa brojem porudžbine, uslovima kupovine i obrascem za odustanak.</li>
          <li><strong>Slanje</strong> Paket predajemo kurirskoj službi (${S.courier}) i šaljemo ti broj pošiljke za praćenje.</li>
          <li><strong>Isporuka</strong> Kurir te zove pre dolaska. Ako plaćaš pouzećem, iznos plaćaš kuriru.</li>
        </ol>
        <h2>Gde i u kom roku</h2>
        <ul class="dash-list">
          <li>Isporučujemo samo na adrese u Republici Srbiji.</li>
          <li>Uobičajen rok je 1–3 radna dana. Porudžbine primljene vikendom i praznikom šaljemo prvog narednog radnog dana.</li>
          <li>Ako iz bilo kog razloga ne možemo da isporučimo u roku, javljamo ti se odmah. Ako se drugačije ne dogovorimo, robu isporučujemo najkasnije u roku od 30 dana od zaključenja ugovora, a ako to ne možemo — vraćamo ti novac.</li>
          <li>Kurir pokušava isporuku dva puta. Ako paket ne preuzmeš, vraća se nama i javljamo ti se oko ponovnog slanja.</li>
        </ul>
        <h2>Ko snosi rizik</h2>
        <p>Dok paket ne preuzmeš ti ili osoba koju si odredio/la, rizik od oštećenja ili gubitka snosimo mi — i dok je pošiljka kod kurira. Paket ostavljen ispred vrata ne smatra se isporučenim.</p>
        <p>Preporučujemo da paket pregledaš pred kurirom. Ako je ambalaža vidno oštećena, možeš da odbiješ prijem i da nam se javiš. Ako pregled propustiš, ne gubiš nijedno pravo — samo nam je teže da dokažemo štetu kurirskoj službi.</p>
        ${law('Zakon o zaštiti potrošača („Sl. glasnik RS”, br. 35/2026), čl. 33, 48 i 52.')}
        ${draft(`Cena dostave (${rsd(SHIP_PRICE)}), prag za besplatnu dostavu i kurirska služba su privremeni — potvrđuje FORTE.`)}`
    },

    placanje: {
      group: 'Pomoć', title: 'Načini plaćanja',
      lead: 'Sve cene su izražene u dinarima (RSD) i uključuju PDV. Troškovi dostave prikazani su posebno, pre potvrde porudžbine.',
      html: () => `
        <div class="info-cards info-cards--2">
          <div>${icon('truck')}<strong>Pouzećem</strong><span>Plaćaš gotovinom kuriru prilikom preuzimanja paketa.</span></div>
          <div>${icon('card')}<strong>Platnom karticom</strong><span>Visa, Mastercard i DinaCard. Plaćanje se obavlja na zaštićenoj stranici banke.</span></div>
        </div>
        <h2>Plaćanje karticom</h2>
        <p>Prihvatamo kartice Visa, Mastercard i DinaCard. Kartica se zadužuje u dinarima. Ako je tvoja kartica vezana za drugu valutu, iznos se preračunava po kursu kartičarske organizacije, pa je moguća mala razlika u odnosu na iznos na sajtu.</p>
        <h2>Sigurnost plaćanja</h2>
        <p>Podatke o kartici unosiš isključivo na stranici banke (${S.bank}) i oni nikada nisu dostupni nama. Komunikacija je zaštićena TLS enkripcijom, a plaćanje potvrđuješ kroz 3-D Secure proveru svoje banke.</p>
        <h2>Povraćaj novca</h2>
        <p>Novac vraćamo istim sredstvom kojim si platio/la: na karticu kojom je plaćeno. Za porudžbine plaćene pouzećem novac uplaćujemo na tekući račun koji nam navedeš. Povraćaj je za tebe uvek bez troškova.</p>
        ${draft('Banka i tačne izjave o plaćanju karticom (logotipi, 3-D Secure, konverzija) zavise od ugovora sa bankom — tekst se usklađuje kada FORTE izabere banku.')}`
    },

    povrat: {
      group: 'Pomoć', title: 'Povrat i zamena',
      lead: 'Od kupovine možeš da odustaneš u roku od 14 dana od prijema paketa, bez navođenja razloga.',
      html: () => `
        <div class="info-cards">
          <div><strong>14 dana</strong><span>za odustanak, od dana kada primiš paket</span></div>
          <div><strong>Pun iznos</strong><span>vraćamo cenu proizvoda i prvobitnu dostavu</span></div>
          <div><strong>14 dana</strong><span>najkasnije vraćamo novac, od prijema izjave</span></div>
        </div>
        <p>Kupovina na sajtu je ugovor zaključen na daljinu. Kao potrošač imaš pravo da odustaneš od njega bez navođenja razloga i bez troškova, osim direktnog troška vraćanja paketa.</p>

        <h2>Kako da odustaneš</h2>
        <ol class="info-steps">
          <li><strong>Pošalji izjavu</strong> Popuni obrazac ispod. Odmah dobijaš broj izjave i potvrdu prijema na e-mail.</li>
          <li><strong>Vrati paket</strong> Pošalji proizvod najkasnije 14 dana od slanja izjave na adresu: ${S.address}.</li>
          <li><strong>Dobij novac</strong> Novac vraćamo najkasnije 14 dana od prijema izjave, istim sredstvom kojim si platio/la.</li>
        </ol>
        <p>Rok od 14 dana teče od dana kada paket preuzmeš ti ili osoba koju odrediš (a koja nije kurir). Ako su proizvodi iz jedne porudžbine stigli odvojeno, rok teče od prijema poslednjeg. Izjava poslata poslednjeg dana roka je na vreme.</p>
        <p>Pored ovog obrasca važi i svaka druga jasna izjava — na primer e-mail na ${mail(S.claims)} ili pismo na adresu ${S.address}. Možeš da koristiš i <button type="button" class="link-btn" data-print-obrazac>zvanični obrazac za odustanak</button> (za štampu), ali to nije obavezno.</p>

        <h2>Izjava o odustanku</h2>
        ${formHTML('odustanak')}

        <h2>Šta ti vraćamo</h2>
        <ul class="dash-list">
          <li><strong>Sve što si platio/la</strong> — cenu proizvoda i troškove prvobitne dostave, najkasnije 14 dana od prijema izjave.</li>
          <li>Novac vraćamo istim sredstvom plaćanja: na karticu, odnosno na tekući račun ako si plaćao/la pouzećem. Za tebe bez ikakvih troškova.</li>
          <li>Povraćaj možemo da zadržimo dok ne primimo paket ili dokaz da si ga poslao/la — šta god bude ranije.</li>
          <li>Direktan trošak slanja paketa nazad snosiš ti, po cenovniku kurirske službe. Ako smo poslali pogrešan ili neispravan proizvod, taj trošak je naš.</li>
        </ul>

        <h2>Probanje jakne i etikete</h2>
        <p>Jaknu smeš da raspakuješ i probaš kao što bi to uradio/la u kabini — da proveriš veličinu, kroj i boju. Originalna ambalaža nije uslov za povrat.</p>
        <p>Odgovaraš samo za umanjenu vrednost proizvoda ako je korišćen više od toga — na primer ako je nošen napolju, opran, oštećen ili ima mirise. U tom slučaju od povraćaja odbijamo srazmeran iznos i obrazlažemo ti zašto. Zato te molimo da ne skidaš etikete dok ne odlučiš da jaknu zadržiš.</p>

        <h2>Zamena veličine ili boje</h2>
        <p>Zakonsko pravo kod odustanka je povraćaj novca. Zamenu za drugu veličinu ili boju nudimo kao dodatnu pogodnost, u istom roku od 14 dana:</p>
        <ul class="dash-list">
          <li>javi nam se na ${mail(S.email)} ili ${S.phone} i navedi broj porudžbine i željenu veličinu ili boju;</li>
          <li>proizvod treba da bude nenošen i sa originalnim etiketama;</li>
          <li>novu veličinu šaljemo čim stigne vraćeni proizvod, ako je na stanju — ako nije, vraćamo ti novac.</li>
        </ul>
        <p>Ako ti zamena ne odgovara, uvek možeš da odustaneš od kupovine i dobiješ novac nazad.</p>

        <h2>Kada odustanak nije moguć</h2>
        <p>Zakon izuzima robu izrađenu po tvojoj specifikaciji ili jasno personalizovanu (npr. jaknu sa vezenim inicijalima po porudžbini) i zapečaćenu robu koja se zbog zaštite zdravlja ili higijene ne može vratiti ako je pečat skinut. Ovi izuzeci se ne odnose na standardne jakne i prsluke iz naše ponude.</p>

        <h2>Ako proizvod ima nedostatak</h2>
        <p>Odustanak i reklamacija nisu isto. Ako je proizvod oštećen ili neispravan, podnesi <a href="${infoUrl('reklamacije')}">reklamaciju</a> — tada sve troškove snosimo mi.</p>
        ${law('Zakon o zaštiti potrošača („Sl. glasnik RS”, br. 35/2026), čl. 27–38; Pravilnik o obliku i sadržini obrasca za odustanak („Sl. glasnik RS”, br. 21/2022).')}
        ${draft('Uslove za zamenu veličine (ko plaća slanje kod zamene) određuje FORTE.')}
        ${updated}`
    },

    reklamacije: {
      group: 'Pomoć', title: 'Reklamacije',
      lead: 'Odgovaramo za nesaobraznost proizvoda koja se pojavi u roku od dve godine od isporuke.',
      html: () => `
        <div class="info-cards">
          <div><strong>2 godine</strong><span>odgovaramo za nesaobraznost, od dana isporuke</span></div>
          <div><strong>8 dana</strong><span>najkasnije odgovaramo na reklamaciju</span></div>
          <div><strong>15 dana</strong><span>najkasnije je rešavamo, od prijema</span></div>
        </div>
        <p>Proizvod nije saobrazan ugovoru ako nema svojstva koja smo naveli ili koja se od takvog proizvoda opravdano očekuju. Kod jakni i prsluka to su, na primer: popucali šavovi, neispravan rajsferšlus ili drikeri, izlazak punjenja kroz tkaninu, promena boje ili skupljanje iako je održavan po uputstvu sa deklaracije.</p>
        <p>Nesaobraznost nije oštećenje nastalo nepravilnim održavanjem, suprotno uputstvu sa deklaracije, niti mehaničko oštećenje nastalo posle isporuke.</p>

        <h2>Kako da podneseš reklamaciju</h2>
        <p>Popuni obrazac ispod. Odmah dobijaš broj reklamacije i potvrdu prijema na e-mail — od tog trenutka teku rokovi.</p>
        <p>Reklamaciju možeš da podneseš i e-mailom na ${mail(S.claims)}, telefonom na ${S.phone} (${S.hours}), poštom na ${S.address} ili lično u našoj prodavnici. Uz reklamaciju je dovoljan dokaz o kupovini — broj porudžbine, račun ili izvod. Originalna ambalaža nije uslov.</p>

        <h2>Prijava reklamacije</h2>
        ${formHTML('reklamacija')}

        <h2>Rokovi</h2>
        <ul class="dash-list">
          <li>Nesaobraznost treba da nam prijaviš u roku od <strong>2 meseca</strong> od dana kada si je primetio/la, a najkasnije u roku od 2 godine od isporuke.</li>
          <li>Ako se nesaobraznost pojavi u roku od <strong>godinu dana</strong> od isporuke, pretpostavlja se da je postojala u trenutku isporuke — ti ne moraš ništa da dokazuješ.</li>
          <li>Na reklamaciju odgovaramo najkasnije u roku od <strong>8 dana</strong> od prijema, a rešavamo je najkasnije u roku od <strong>15 dana</strong>. Rok možemo da produžimo samo jednom i samo uz tvoju saglasnost.</li>
          <li>Ako reklamaciju odbijemo, obrazlažemo odluku i obaveštavamo te o mogućnosti vansudskog rešavanja spora.</li>
        </ul>

        <h2>Šta možeš da tražiš</h2>
        <ul class="dash-list">
          <li>Ako se nesaobraznost pojavi u prvih <strong>30 dana</strong> od isporuke, biraš odmah: zamenu, umanjenje cene ili raskid ugovora i povraćaj novca.</li>
          <li>Posle toga biraš popravku ili zamenu. Ako to nije moguće ili ne bude urađeno u roku, možeš da tražiš umanjenje cene ili raskid ugovora.</li>
          <li>Sve troškove rešavanja reklamacije — preuzimanje, slanje, popravku i ponovnu dostavu — snosimo mi.</li>
          <li>Kod raskida ugovora vraćamo ti ceo plaćeni iznos bez odlaganja, čim primimo proizvod.</li>
        </ul>
        <p>Svaku reklamaciju upisujemo u evidenciju primljenih reklamacija, koju čuvamo najmanje dve godine.</p>
        ${law('Zakon o zaštiti potrošača („Sl. glasnik RS”, br. 35/2026), čl. 55–63 i 173.')}
        ${draft('Kontakt za reklamacije, adresa i lice zaduženo za reklamacije su privremeni — dostavlja FORTE.')}
        ${updated}`
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
        <p>Ako si između dve veličine, za štepane jakne i puf prsluke preporučujemo veću — ostaje mesta za džemper. Ako veličina ipak ne odgovara, imaš 14 dana za <a href="${infoUrl('povrat')}">povrat ili zamenu</a>.</p>
        ${draft('Okvirne mere — tačne mere po modelu dostavlja FORTE.')}`
    },

    pitanja: {
      group: 'Pomoć', title: 'Česta pitanja',
      lead: 'Odgovori na pitanja koja nam najčešće postavljate.',
      html: () => faq([
        ['Koliko traje dostava?', `Isporuka obično traje 1–3 radna dana. Dostava je besplatna za porudžbine preko ${rsd(FREE_SHIP)}.`],
        ['Mogu li da vratim jaknu ako mi ne odgovara?', `Da. Imaš 14 dana od prijema da odustaneš od kupovine bez navođenja razloga. Vraćamo ti ceo iznos, uključujući prvobitnu dostavu. <a href="${infoUrl('povrat')}">Kako se vraća</a>`],
        ['Mogu li da zamenim veličinu?', 'Da, u roku od 14 dana od prijema, ako je proizvod nenošen i sa etiketama. Ako željena veličina nije na stanju, vraćamo ti novac.'],
        ['Smem li da probam jaknu?', 'Naravno — kao u kabini. Probanje ne utiče na pravo na povrat. Molimo te samo da ne skidaš etikete i ne nosiš jaknu napolju dok ne odlučiš da je zadržiš.'],
        ['Šta ako jakna ima nedostatak?', `Podnesi <a href="${infoUrl('reklamacije')}">reklamaciju</a>. Odgovaramo za nesaobraznost dve godine od isporuke i snosimo sve troškove rešavanja.`],
        ['Zašto je svaka boja poseban proizvod?', 'Svaka boja ima svoje fotografije, šifru i zalihe, tako da tačno vidiš šta naručuješ i da li je tvoja veličina dostupna.'],
        ['Kako da izaberem veličinu?', `Pogledaj <a href="${infoUrl('velicine')}">tabelu veličina</a>. Ako si između dve veličine, uzmi veću.`],
        ['Gde piše sastav materijala?', 'Na stranici svakog proizvoda, u delu „Sastav i održavanje”, nalaze se sirovinski sastav, uputstvo za održavanje i zemlja porekla — isto što piše na ušivenoj etiketi.'],
        ['Mogu li da platim karticom?', 'Da — Visa, Mastercard i DinaCard. Možeš da platiš i pouzećem.']
      ])
    },

    kontakt: {
      group: 'Pomoć', title: 'Kontakt',
      lead: `Tu smo ${S.hours}.`,
      html: () => `
        <div class="info-cards">
          <a href="tel:${S.tel}">${icon('user')}<strong>${S.phone}</strong><span>Poziv ili Viber</span></a>
          <a href="mailto:${S.email}">${icon('bag')}<strong>${S.email}</strong><span>Odgovaramo u roku od 24h radnim danima</span></a>
          <a href="${infoUrl('reklamacije')}">${icon('return')}<strong>Reklamacije</strong><span>${S.claims}</span></a>
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
        <h2>Podaci o trgovcu</h2>
        ${table([['Poslovno ime', S.name], ['Adresa', S.address], ['Matični broj', S.mb], ['PIB', S.pib]])}
        ${draft('Kontakt podaci su privremeni.')}`
    },

    'o-nama': {
      group: 'Forte', title: 'O nama',
      lead: 'Toplina sa stavom.',
      html: () => `
        <figure class="info-figure"><img src="assets/img/jgrey-3.jpg" alt="FORTE kratka štepana jakna"></figure>
        <p>FORTE pravi jakne i prsluke za svakodnevni život u gradu — tople, udobne i sa detaljima koji se primećuju. Svaki model dolazi u više boja, a svaka boja je poseban proizvod, sa svojim fotografijama i zalihama.</p>
        <p>Verujemo da zimska jakna ne mora da bira između toplote i stila. Zato pažljivo biramo materijale, krojeve i punjenje, i testiramo ih kroz cele zime.</p>
        <p><a class="link-arrow" href="${catUrl('novo')}">Pogledaj novu kolekciju ${icon('arrow')}</a></p>
        ${draft('Radna verzija teksta — konačnu verziju dostavlja FORTE.')}`
    },

    prodavnice: {
      group: 'Forte', title: 'Prodavnice',
      lead: 'Dođi da probaš jaknu uživo.',
      html: () => draft('Adrese i radno vreme prodavnica dostavlja FORTE.')
    },

    uslovi: {
      group: 'Forte', title: 'Uslovi kupovine',
      lead: 'Opšti uslovi prodaje u FORTE internet prodavnici — prava i obaveze prodavca i kupca.',
      html: () => `
        <p>Ovim uslovima uređuje se prodaja robe preko internet prodavnice FORTE. Poslujemo u skladu sa propisima Republike Srbije, posebno sa Zakonom o zaštiti potrošača, Zakonom o trgovini, Zakonom o elektronskoj trgovini i Zakonom o zaštiti podataka o ličnosti. Uslovi su na srpskom jeziku i možeš da ih <button type="button" class="link-btn" data-print-page>sačuvaš ili odštampaš</button>.</p>

        <h2 id="trgovac">1. Podaci o trgovcu</h2>
        ${table([
          ['Poslovno ime', S.name], ['Sedište', S.address], ['Matični broj', S.mb], ['PIB', S.pib],
          ['Delatnost', S.activity], ['Telefon', `<a href="tel:${S.tel}">${S.phone}</a>`],
          ['E-mail', `${mail(S.email)} · reklamacije i odustanak: ${mail(S.claims)}`]
        ])}

        <h2>2. Zaključenje ugovora</h2>
        <p>Kupovina na sajtu je ugovor na daljinu zaključen elektronskim putem. Poručivanje teče u sledećim koracima:</p>
        <ol>
          <li>izabereš proizvod, boju i veličinu i dodaš ga u korpu;</li>
          <li>u korpi proveriš proizvode i količine i ispraviš ih po potrebi;</li>
          <li>na stranici za poručivanje uneseš kontakt i adresu i izabereš način plaćanja — pre slanja možeš da ispraviš svaki podatak;</li>
          <li>porudžbinu šalješ klikom na dugme „Poruči uz obavezu plaćanja”.</li>
        </ol>
        <p>Ugovor je zaključen kada primiš e-mail potvrdu porudžbine. Potvrda sadrži podatke o proizvodima, cenu, ove uslove i obrazac za odustanak, i služi kao isprava o ugovoru koju možeš da sačuvaš.</p>

        <h2>3. Cene</h2>
        <ul class="dash-list">
          <li>Cene su izražene u dinarima, sa uračunatim PDV-om, i važe u trenutku poručivanja.</li>
          <li>Troškovi dostave nisu uključeni u cenu proizvoda; prikazuju se u korpi i na stranici za poručivanje, pre potvrde porudžbine.</li>
          <li>Kod sniženih proizvoda precrtana cena je najniža cena tog proizvoda u poslednjih 30 dana pre sniženja.</li>
          <li>Cene ne prilagođavamo pojedinačnom kupcu niti ih određujemo automatizovanim odlučivanjem — svi posetioci u istom trenutku vide istu cenu.</li>
        </ul>

        <h2>4. Podaci o proizvodu</h2>
        <p>Na stranici svakog proizvoda nalaze se njegova osnovna obeležja, cena, dostupne veličine i deklaracija: sirovinski sastav, uputstvo za održavanje, šifra modela, proizvođač i zemlja porekla. Boje na fotografijama mogu malo da odstupaju u zavisnosti od ekrana.</p>

        <h2>5. Plaćanje i dostava</h2>
        <p>Plaćanje je moguće pouzećem ili platnom karticom (Visa, Mastercard, DinaCard). Dostavljamo samo na teritoriji Republike Srbije. Detaljno: <a href="${infoUrl('placanje')}">Načini plaćanja</a> i <a href="${infoUrl('dostava')}">Dostava</a>.</p>

        <h2>6. Pravo na odustanak</h2>
        <p>Imaš pravo da odustaneš od ugovora u roku od 14 dana od prijema robe, bez navođenja razloga. Vraćamo ti sve što si platio/la, uključujući troškove prvobitne dostave, najkasnije u roku od 14 dana od prijema izjave. Direktne troškove vraćanja robe snosiš ti. Postupak, obrazac i izuzeci: <a href="${infoUrl('povrat')}">Povrat i zamena</a>.</p>

        <h2>7. Saobraznost i reklamacije</h2>
        <p>Odgovaramo za nesaobraznost robe koja se pojavi u roku od dve godine od isporuke. Reklamaciju možeš da podneseš preko obrasca na sajtu, e-mailom, telefonom, poštom ili lično. Na reklamaciju odgovaramo u roku od 8 dana, a rešavamo je u roku od 15 dana. Postupak i tvoja prava: <a href="${infoUrl('reklamacije')}">Reklamacije</a>.</p>

        <h2 id="ods">8. Vansudsko rešavanje potrošačkih sporova</h2>
        <p>Potrošački spor može da se reši i vansudskim putem. <strong>Kao trgovac smo po zakonu obavezni da učestvujemo u postupku vansudskog rešavanja potrošačkih sporova.</strong> Spisak tela za vansudsko rešavanje objavljuje ministarstvo nadležno za zaštitu potrošača: <a href="${ODS_URL}" target="_blank" rel="noopener">vansudsko.mtt.gov.rs</a>.</p>
        <p>Postupak možeš da pokreneš ako si nam prethodno podneo/la reklamaciju ili prigovor, najkasnije godinu dana od njihovog podnošenja. Postupak je za stranke besplatan i traje najduže 90 dana.</p>

        <h2>9. Redosled proizvoda</h2>
        <p>Na stranicama kategorija proizvodi su podrazumevano poređani od najnovijih, a u pretrazi po poklapanju sa unetim pojmom. Redosled ne zavisi od plaćenog pozicioniranja ni od tvog profila, a možeš da ga promeniš izborom sortiranja (cena, popust, naziv).</p>

        <h2>10. Zaštita podataka</h2>
        <p>Podatke koristimo za realizaciju porudžbine i vođenje evidencija koje propisuje zakon. Detaljno: <a href="${infoUrl('privatnost')}">Politika privatnosti</a> i <a href="${infoUrl('kolacici')}">Kolačići</a>.</p>

        <h2>11. Greške i izmene uslova</h2>
        <p>Ako u ceni ili opisu proizvoda nastane očigledna greška, obaveštavamo te i nudimo da porudžbinu otkažeš bez troškova ili da je realizuješ po ispravnim uslovima. Izmene ovih uslova ne važe za već zaključene ugovore.</p>
        ${draft('Podaci o trgovcu u [zagradama] su privremeni. Pre objave uslove treba da pregleda pravnik FORTE-a.')}
        ${updated}`
    },

    privatnost: {
      group: 'Forte', title: 'Politika privatnosti',
      lead: 'Koje podatke prikupljamo, zašto, koliko ih čuvamo i koja su tvoja prava.',
      html: () => `
        <h2>Rukovalac podacima</h2>
        <p>${S.name}, ${S.address}, MB ${S.mb}. Za sva pitanja o podacima piši nam na ${mail(S.email)}.</p>

        <h2>Koje podatke obrađujemo i zašto</h2>
        <table class="info-table info-table--grid">
          <thead><tr><th>Svrha</th><th>Podaci</th><th>Pravni osnov</th><th>Rok čuvanja</th></tr></thead>
          <tbody>
            <tr><td>Porudžbina i isporuka</td><td>ime i prezime, adresa, telefon, e-mail, proizvodi</td><td>izvršenje ugovora</td><td>do isteka rokova za reklamaciju (2 godine), osim podataka iz računa</td></tr>
            <tr><td>Računi i knjigovodstvo</td><td>podaci sa računa</td><td>zakonska obaveza</td><td>koliko propisuju poreski i računovodstveni propisi</td></tr>
            <tr><td>Odustanak i reklamacije</td><td>podaci iz izjave ili reklamacije, broj računa za povraćaj</td><td>zakonska obaveza</td><td>najmanje 2 godine (evidencija reklamacija)</td></tr>
            <tr><td>Newsletter</td><td>e-mail</td><td>tvoj pristanak</td><td>dok ne povučeš pristanak</td></tr>
            <tr><td>Kontakt forma</td><td>ime, e-mail, poruka</td><td>legitimni interes — da odgovorimo</td><td>do 12 meseci od poslednje poruke</td></tr>
          </tbody>
        </table>
        <p>Podaci o platnoj kartici unose se na stranici banke i nisu nam dostupni. Ne donosimo odluke isključivo automatizovanom obradom i ne pravimo profile kupaca.</p>
        <p>Podaci potrebni za porudžbinu su ugovorna obaveza — bez njih ne možemo da isporučimo robu. Newsletter je dobrovoljan.</p>

        <h2>Kome prosleđujemo podatke</h2>
        <ul class="dash-list">
          <li>kurirskoj službi (${S.courier}) — ime, adresa, telefon i iznos za naplatu;</li>
          <li>banci (${S.bank}) — za plaćanje karticom i povraćaj novca;</li>
          <li>knjigovodstvu i pružaocima IT usluga (hosting, e-mail) — samo u meri potrebnoj za njihov posao i uz ugovor o obradi podataka.</li>
        </ul>
        <p>Podatke ne prodajemo. <span class="decl__todo">[Ako se koriste servisi van Srbije (npr. Google, Meta, Mailchimp), ovde se navodi iznošenje podataka i osnov.]</span></p>

        <h2>Tvoja prava</h2>
        <p>Imaš pravo na pristup svojim podacima, ispravku, brisanje, ograničenje obrade, prenosivost i prigovor na obradu. Pristanak za newsletter možeš da povučeš u svakom trenutku — linkom u svakoj poruci ili e-mailom — jednako lako kao što si ga dao/la. Zahtev pošalji na ${mail(S.email)}; odgovaramo u roku od 30 dana.</p>
        <p>Ako smatraš da podatke obrađujemo suprotno zakonu, možeš da podneseš pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti (<a href="https://www.poverenik.rs" target="_blank" rel="noopener">poverenik.rs</a>).</p>
        ${law('Zakon o zaštiti podataka o ličnosti („Sl. glasnik RS”, br. 87/2018), čl. 12, 15, 23 i 26–38.')}
        ${draft('Rokovi čuvanja, primaoci i lice za zaštitu podataka (ako je određeno) se potvrđuju sa FORTE-om.')}
        ${updated}`
    },

    kolacici: {
      group: 'Forte', title: 'Kolačići',
      lead: 'Šta sajt čuva u tvom pregledaču i zašto.',
      html: () => `
        <p>Sajt trenutno ne koristi kolačiće za analitiku ni oglašavanje. U memoriji tvog pregledača (localStorage) čuva samo ono što je potrebno da funkcije koje koristiš rade:</p>
        <table class="info-table info-table--grid">
          <thead><tr><th>Naziv</th><th>Svrha</th><th>Vrsta</th></tr></thead>
          <tbody>
            <tr><td>forte-cart</td><td>sadržaj korpe</td><td>neophodan</td></tr>
            <tr><td>forte-wish</td><td>lista želja</td><td>neophodan</td></tr>
            <tr><td>forte-promo</td><td>uneti promo kod</td><td>neophodan</td></tr>
            <tr><td>forte-cols-*, forte-fopen</td><td>izabrani prikaz liste i otvoreni filteri</td><td>funkcionalan</td></tr>
          </tbody>
        </table>
        <p>Ovi podaci ostaju na tvom uređaju, ne šalju se nama i ne služe za praćenje. Možeš da ih obrišeš u podešavanjima pregledača, ali će se tada isprazniti korpa i lista želja.</p>
        <h2>Analitika i oglašavanje</h2>
        <p>Ako uvedemo alate za analitiku ili oglašavanje (npr. Google Analytics ili Meta Pixel), koristićemo ih samo uz tvoj prethodni pristanak, koji ćeš moći da daš, odbiješ ili povučeš u svakom trenutku.</p>
        ${law('Zakon o elektronskim komunikacijama („Sl. glasnik RS”, br. 35/2023), čl. 160.')}
        ${updated}`
    }
  };

  /* ---------- iscrtavanje ---------- */
  const slug = new URLSearchParams(location.search).get('strana');
  const page = PAGES[slug] ? slug : 'dostava';
  const P = PAGES[page];

  document.title = `${P.title} | FORTE`;
  $('meta[name="description"]')?.setAttribute('content', P.lead);
  $('[data-crumbs]').innerHTML = `<a href="index.html">Početna</a><span>/</span><span>${P.group}</span><span>/</span><span>${P.title}</span>`;

  const groups = [...new Set(Object.values(PAGES).map(x => x.group))];
  $('[data-info-nav]').innerHTML = groups.map(gr => `<div><h4>${gr}</h4>${Object.entries(PAGES)
    .filter(([, x]) => x.group === gr)
    .map(([s, x]) => `<a href="${infoUrl(s)}"${s === page ? ' aria-current="page"' : ''}>${x.title}</a>`).join('')}</div>`).join('');

  $('[data-info-body]').innerHTML = `<p class="eyebrow">${P.group}</p><h1 class="plp-title">${P.title}</h1>
    <p class="plp-lead">${P.lead}</p><div class="info__content">${P.html()}</div>`;

  // tabele sa zaglavljem: na telefonu se slažu u kartice, pa svaka ćelija nosi naziv kolone
  $$('.info-table--grid').forEach(t => {
    const heads = $$('thead th', t).map(th => th.textContent);
    $$('tbody tr', t).forEach(tr => [...tr.children].forEach((td, i) => { td.dataset.label = heads[i]; }));
  });

  // aktivna stavka vidljiva u horizontalnom meniju na telefonu
  $('[data-info-nav] [aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }));
  else scrollTo(0, 0);

  $('[data-print-obrazac]')?.addEventListener('click', printObrazac);
  $('[data-print-page]')?.addEventListener('click', () => print());

  /* ---------- kontakt forma ---------- */
  const cf = $('[data-contact]');
  if (cf) cf.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('[data-contact-msg]');
    const ok = cf.ime.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cf.email.value.trim()) && cf.poruka.value.trim().length > 4;
    msg.className = 'nl-form__msg ' + (ok ? 'is-ok' : 'is-err');
    msg.textContent = ok ? 'Hvala! Odgovorićemo ti u roku od 24h.' : 'Popuni ime, ispravan e-mail i poruku.';
    if (ok) cf.reset();
  });

  /* ---------- izjava o odustanku / reklamacija ----------
     Prototip: proverava polja i prikazuje potvrdu sa brojem. Na stagingu
     zahtev se upisuje u evidenciju i potvrda se šalje e-mailom (trajni nosač). */
  const lf = $('[data-legal-form]');
  if (lf) {
    const kind = lf.dataset.legalForm;
    const RULES = {
      'f-ime': v => v.trim().split(/\s+/).length >= 2 || 'Unesi ime i prezime',
      'f-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Unesi ispravan e-mail',
      'f-tel': v => /^0\d{8,9}$/.test(v.replace(/[\s\-/()]/g, '').replace(/^\+381/, '0')) || 'Unesi broj telefona, npr. 064 123 4567',
      'f-porudzbina': v => v.trim().length >= 4 || 'Unesi broj porudžbine',
      'f-ugovor': v => !!v || 'Izaberi datum',
      'f-prijem': v => !!v || 'Izaberi datum',
      'f-proizvod': v => v.trim().length >= 3 || 'Navedi proizvod',
      'f-adresa': v => /\d/.test(v) && v.trim().length > 4 || 'Unesi ulicu i broj',
      'f-opis': v => v.trim().length >= 10 || 'Opiši ukratko šta nije u redu',
      'f-zahtev': v => !!v || 'Izaberi šta tražiš'
    };
    const check = el => {
      const rule = RULES[el.name];
      const res = rule ? rule(el.value) : true;
      const box = el.closest('.field');
      box.classList.toggle('is-err', res !== true);
      box.querySelector('.field__err')?.remove();
      if (res !== true) box.insertAdjacentHTML('beforeend', `<p class="field__err">${res}</p>`);
      return res === true;
    };
    lf.addEventListener('focusout', e => { if (e.target.name && e.target.closest('.is-err')) check(e.target); });
    lf.addEventListener('submit', e => {
      e.preventDefault();
      const bad = [...lf.elements].filter(el => RULES[el.name] && !check(el));
      if (bad.length) { bad[0].focus(); return; }
      const d = new Date(), pad = n => String(n).padStart(2, '0');
      const no = `${kind === 'odustanak' ? 'OD' : 'RK'}-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
      const when = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}. u ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const email = lf.elements['f-email'].value.trim();
      const done = $('[data-legal-done]');
      done.innerHTML = kind === 'odustanak'
        ? `<span class="legal-done__icon">${icon('check')}</span><h3>Izjava o odustanku je primljena</h3>
           <p>Broj izjave: <strong>${no}</strong> · primljena ${when}</p>
           <p>Potvrdu prijema poslali smo na <strong>${email.replace(/</g, '&lt;')}</strong>. Proizvod pošalji najkasnije 14 dana od danas na adresu ${S.address}. Novac vraćamo najkasnije 14 dana od prijema izjave.</p>`
        : `<span class="legal-done__icon">${icon('check')}</span><h3>Reklamacija je primljena</h3>
           <p>Broj reklamacije: <strong>${no}</strong> · primljena ${when}</p>
           <p>Potvrdu prijema poslali smo na <strong>${email.replace(/</g, '&lt;')}</strong>. Odgovorićemo ti najkasnije u roku od 8 dana, a reklamaciju rešiti najkasnije u roku od 15 dana.</p>`;
      done.insertAdjacentHTML('beforeend', '<p class="legal-done__proto">Prototip — zahtev se ne šalje.</p>');
      lf.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }
})();
