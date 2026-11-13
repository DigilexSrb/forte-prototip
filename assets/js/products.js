/* =========================================================
   FORTE — katalog (prototip). Sve stranice se iscrtavaju iz ovih
   podataka; na stagingu ovo zamenjuje API (WooCommerce ili drugi).

   PRAVILO: svaka boja je ZASEBAN proizvod (svoj id, šifra, cena,
   slike, zalihe). Boje istog modela povezuje polje `group`.

   NAPOMENA: cene i opisi starih modela (šifre FF-…) su privremeni —
   stari sajt nema cene. Slike: assets/img/<ime>.jpg i <ime>-sm.jpg
   ========================================================= */
window.FORTE = (() => {
  'use strict';

  /* ---------- MODELI ---------- */
  const GROUPS = {
    "kratka-stepana-jakna": {"name": "Kratka štepana jakna", "gender": "z", "type": "jakna", "desc": "Kratka štepana jakna sa naglašenom oversized kragnom i baloner rukavima. Rebrasti struk i manžetne zadržavaju toplotu, a crop kroj se savršeno slaže uz farmerke visokog struka.", "details": ["Kratak (crop) kroj iznad struka", "Oversized kragna sa reverom", "Dijamant štepovanje", "Rebrasti struk i manžetne", "Kopčanje na metalna dugmad", "Široki baloner rukavi"], "care": "Spoljni sloj: poliester. Punjenje: lagana sintetička vata. Pranje na 30 °C, ne sušiti u mašini, peglati na niskoj temperaturi."},
    "dugi-puf-prsluk": {"name": "Dugi puf prsluk", "gender": "z", "type": "prsluk", "desc": "Dugi prošiveni prsluk sa visokom kragnom, kopčanjem na rajsferšlus i drikere i dubokim džepovima na preklop. Nosi se preko majice, džempera ili kao poslednji sloj preko haljine.", "details": ["Dužina do kolena, ravan kroj", "Visoka kragna koja štiti od vetra", "Dvostruko kopčanje: rajsferšlus + drikeri", "Dva duboka džepa na preklop", "Bočni prorezi za lakše kretanje"], "care": "Spoljni sloj: vodoodbojni poliester sa satenskim sjajem. Punjenje: lagana sintetička vata. Pranje na 30 °C, ne sušiti u mašini."},
    "muska-jakna-f10": {"name": "Muška jakna F10", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muska-jakna-f7": {"name": "Muška jakna F7", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-f6": {"name": "Ženska jakna F6", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-f5": {"name": "Ženska jakna F5", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-f4": {"name": "Ženska jakna F4", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-f3": {"name": "Ženska jakna F3", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-f2": {"name": "Ženska jakna F2", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-f1": {"name": "Ženska jakna F1", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muska-jakna-e9": {"name": "Muška jakna E9", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muska-jakna-e8": {"name": "Muška jakna E8", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-e4": {"name": "Ženska jakna E4", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muska-jakna-e3": {"name": "Muška jakna E3", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muski-prsluk": {"name": "Muški prsluk", "gender": "m", "type": "prsluk", "desc": "Muški prsluk sa kapuljačom — lagan sloj koji greje telo, a ostavlja ruke slobodnim.", "details": ["Lagano punjenje", "Kapuljača", "Kopčanje na rajsferšlus", "Bočni džepovi"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muski-mantil": {"name": "Muški mantil", "gender": "m", "type": "mantil", "desc": "Muški mantil produženog kroja — elegantan gornji sloj za posao i grad.", "details": ["Produženi kroj", "Kopčanje na rajsferšlus", "Bočni džepovi", "Topla postava"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muska-jakna-f": {"name": "Muška jakna F", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-d8": {"name": "Ženska jakna D8", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-d7": {"name": "Ženska jakna D7", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-d2": {"name": "Ženska jakna D2", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-d14": {"name": "Ženska jakna D14", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-d12": {"name": "Ženska jakna D12", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-d11": {"name": "Ženska jakna D11", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muska-jakna-d10": {"name": "Muška jakna D10", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muska-jakna-d3": {"name": "Muška jakna D3", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-b12": {"name": "Ženska jakna B12", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "zenska-jakna-a9": {"name": "Ženska jakna A9", "gender": "z", "type": "jakna", "desc": "Topla ženska zimska jakna iz Forte kolekcije — ugodan kroj, kvalitetno punjenje i detalji koji prave razliku u svakodnevnom nošenju.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Bočni džepovi", "Kroj koji prati liniju tela"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."},
    "muska-jakna-a7": {"name": "Muška jakna A7", "gender": "m", "type": "jakna", "desc": "Muška zimska jakna iz Forte kolekcije — čiste linije, praktični džepovi i toplota za hladne dane u gradu.", "details": ["Topla postava i punjenje", "Kopčanje na rajsferšlus", "Praktični džepovi", "Udoban, ravan kroj"], "care": "Pranje na 30 °C, ne sušiti u mašini. Tačan sastav materijala biće naveden uz svaki model."}
  };

  /* ---------- PROIZVODI (1 boja = 1 proizvod) ---------- */
  const PRODUCTS = [
    {"id": "kratka-stepana-jakna-siva-print", "group": "kratka-stepana-jakna", "sku": "FT-J02-SV", "color": "Siva print", "hex": "#a9a7ab", "price": 7490, "imgs": ["jgrey-2", "jgrey-1", "jgrey-3", "jgrey-4", "jgrey-5", "jgrey-6", "jgrey-7"], "added": "2026-11-03", "badge": "Novo"},
    {"id": "dugi-puf-prsluk-maslinasta", "group": "dugi-puf-prsluk", "sku": "FT-P01-OL", "color": "Maslinasta", "hex": "#3c4136", "price": 8990, "imgs": ["olive-3", "olive-2", "olive-1", "olive-4", "olive-5"], "added": "2026-11-03", "badge": "Novo"},
    {"id": "kratka-stepana-jakna-bez", "group": "kratka-stepana-jakna", "sku": "FT-J02-BZ", "color": "Bež", "hex": "#d9c2a3", "price": 7490, "imgs": ["jbeige-2", "jbeige-1", "jbeige-3", "jbeige-4", "jbeige-detail"], "added": "2026-11-03", "badge": "Novo", "out": ["S"]},
    {"id": "dugi-puf-prsluk-puder-roze", "group": "dugi-puf-prsluk", "sku": "FT-P01-PR", "color": "Puder roze", "hex": "#b48f8c", "price": 8990, "imgs": ["mauve-2", "mauve-1", "mauve-3", "mauve-4"], "added": "2026-11-03", "badge": "Bestseler"},
    {"id": "kratka-stepana-jakna-crna", "group": "kratka-stepana-jakna", "sku": "FT-J02-CR", "color": "Crna", "hex": "#1c1c1f", "price": 7490, "imgs": ["jblack-2", "jblack-1", "jblack-3", "jblack-4"], "added": "2026-11-03", "badge": "Bestseler", "low": "XL"},
    {"id": "dugi-puf-prsluk-crna", "group": "dugi-puf-prsluk", "sku": "FT-P01-CR", "color": "Crna", "hex": "#1c1c1f", "price": 8990, "imgs": ["black-2", "black-3", "black-1", "black-4"], "added": "2026-11-03", "low": "XXL"},
    {"id": "kratka-stepana-jakna-puder-roze", "group": "kratka-stepana-jakna", "sku": "FT-J02-PR", "color": "Puder roze", "hex": "#c49a92", "price": 7490, "imgs": ["jmauve-3", "jmauve-1", "jmauve-2"], "added": "2026-11-03", "out": ["XXL"]},
    {"id": "dugi-puf-prsluk-taupe", "group": "dugi-puf-prsluk", "sku": "FT-P01-TP", "color": "Taupe", "hex": "#8e8781", "price": 7190, "imgs": ["taupe-3", "taupe-2", "taupe-1", "taupe-4"], "added": "2026-11-03", "was": 8990, "out": ["S"]},
    {"id": "dugi-puf-prsluk-svetlo-roze", "group": "dugi-puf-prsluk", "sku": "FT-P01-SR", "color": "Svetlo roze", "hex": "#f3c8cf", "price": 8990, "imgs": ["pink-5", "pink-1", "pink-2", "pink-4", "pink-3"], "added": "2026-11-03", "badge": "Novo"},
    {"id": "muska-jakna-f10-crna", "group": "muska-jakna-f10", "sku": "FF-2736", "color": "Crna", "hex": "#1c1c1f", "price": 12990, "imgs": ["ff/ff2736-1", "ff/ff2736-2", "ff/ff2736-3"], "added": "2021-09-01"},
    {"id": "muska-jakna-f7-tamno-plava", "group": "muska-jakna-f7", "sku": "FF-2732", "color": "Tamno plava", "hex": "#1f2a44", "price": 12990, "imgs": ["ff/ff2732-1", "ff/ff2732-2", "ff/ff2732-3", "ff/ff2732-4"], "added": "2021-09-01"},
    {"id": "zenska-jakna-f6-narandzasta", "group": "zenska-jakna-f6", "sku": "FF-2727", "color": "Narandžasta", "hex": "#d9783f", "price": 13990, "imgs": ["ff/ff2727-1", "ff/ff2727-2", "ff/ff2727-3", "ff/ff2727-4"], "added": "2021-09-01"},
    {"id": "zenska-jakna-f5-siva", "group": "zenska-jakna-f5", "sku": "FF-2722", "color": "Siva", "hex": "#b9bcc2", "price": 13990, "imgs": ["ff/ff2722-1", "ff/ff2722-2", "ff/ff2722-3", "ff/ff2722-4", "ff/ff2722-5"], "added": "2021-09-01"},
    {"id": "zenska-jakna-f5-crvena", "group": "zenska-jakna-f5", "sku": "FF-2721", "color": "Crvena", "hex": "#c8202f", "price": 13990, "imgs": ["ff/ff2721-1", "ff/ff2721-2", "ff/ff2721-3"], "added": "2021-09-01"},
    {"id": "zenska-jakna-f4-svetlo-roze", "group": "zenska-jakna-f4", "sku": "FF-2709", "color": "Svetlo roze", "hex": "#f1cfd3", "price": 13990, "imgs": ["ff/ff2709-1", "ff/ff2709-2", "ff/ff2709-3"], "added": "2021-09-01"},
    {"id": "zenska-jakna-f3-krem", "group": "zenska-jakna-f3", "sku": "FF-2708", "color": "Krem", "hex": "#e9e3d6", "price": 13990, "imgs": ["ff/ff2708-1", "ff/ff2708-2"], "added": "2021-09-01"},
    {"id": "zenska-jakna-f2-crvena", "group": "zenska-jakna-f2", "sku": "FF-2705", "color": "Crvena", "hex": "#c8202f", "price": 13990, "imgs": ["ff/ff2705-1", "ff/ff2705-2", "ff/ff2705-3", "ff/ff2705-4"], "added": "2021-09-01"},
    {"id": "zenska-jakna-f1-terakota", "group": "zenska-jakna-f1", "sku": "FF-2700", "color": "Terakota", "hex": "#c0703f", "price": 13990, "imgs": ["ff/ff2700-1", "ff/ff2700-2", "ff/ff2700-3", "ff/ff2700-4"], "added": "2021-09-01"},
    {"id": "muska-jakna-e9-maslinasta", "group": "muska-jakna-e9", "sku": "FF-2695", "color": "Maslinasta", "hex": "#5b5a45", "price": 12990, "imgs": ["ff/ff2695-1", "ff/ff2695-2", "ff/ff2695-3"], "added": "2021-09-01"},
    {"id": "muska-jakna-e8-grafit", "group": "muska-jakna-e8", "sku": "FF-2691", "color": "Grafit", "hex": "#3d3d40", "price": 12990, "imgs": ["ff/ff2691-1", "ff/ff2691-2", "ff/ff2691-3", "ff/ff2691-4", "ff/ff2691-5"], "added": "2021-09-01"},
    {"id": "zenska-jakna-e4-crvena", "group": "zenska-jakna-e4", "sku": "FF-2684", "color": "Crvena", "hex": "#c8202f", "price": 11990, "imgs": ["ff/ff2684-1", "ff/ff2684-2"], "added": "2021-09-01"},
    {"id": "zenska-jakna-e4-zelena", "group": "zenska-jakna-e4", "sku": "FF-2683", "color": "Zelena", "hex": "#13865a", "price": 11990, "imgs": ["ff/ff2683-1", "ff/ff2683-2", "ff/ff2683-3"], "added": "2021-09-01"},
    {"id": "zenska-jakna-e4-zuta", "group": "zenska-jakna-e4", "sku": "FF-2682", "color": "Žuta", "hex": "#e3b93b", "price": 11990, "imgs": ["ff/ff2682-1", "ff/ff2682-2", "ff/ff2682-3"], "added": "2021-09-01"},
    {"id": "muska-jakna-e3-ljubicasta", "group": "muska-jakna-e3", "sku": "FF-2673", "color": "Ljubičasta", "hex": "#6d4b63", "price": 12990, "imgs": ["ff/ff2673-1", "ff/ff2673-2"], "added": "2021-09-01"},
    {"id": "muski-prsluk-sarena", "group": "muski-prsluk", "sku": "FF-1396", "color": "Šarena", "hex": "#7a2a33", "price": 6990, "imgs": ["ff/ff1396-1", "ff/ff1396-2", "ff/ff1396-3", "ff/ff1396-4"], "added": "2020-10-01"},
    {"id": "muski-prsluk-braon", "group": "muski-prsluk", "sku": "FF-1393", "color": "Braon", "hex": "#6b5a48", "price": 6990, "imgs": ["ff/ff1393-1"], "added": "2020-10-01"},
    {"id": "muski-prsluk-svetlo-plava", "group": "muski-prsluk", "sku": "FF-1387", "color": "Svetlo plava", "hex": "#2f7fd8", "price": 6990, "imgs": ["ff/ff1387-1", "ff/ff1387-2", "ff/ff1387-3"], "added": "2020-10-01"},
    {"id": "muski-prsluk-zuta", "group": "muski-prsluk", "sku": "FF-1383", "color": "Žuta", "hex": "#e3b93b", "price": 6990, "imgs": ["ff/ff1383-1", "ff/ff1383-2"], "added": "2020-10-01"},
    {"id": "muski-prsluk-tamno-plava", "group": "muski-prsluk", "sku": "FF-1379", "color": "Tamno plava", "hex": "#1f2a44", "price": 6990, "imgs": ["ff/ff1379-1", "ff/ff1379-2"], "added": "2020-10-01"},
    {"id": "muski-mantil-tamno-plava", "group": "muski-mantil", "sku": "FF-1375", "color": "Tamno plava", "hex": "#1f2a44", "price": 14990, "imgs": ["ff/ff1375-1", "ff/ff1375-2"], "added": "2020-10-01"},
    {"id": "muska-jakna-f-tamno-plava", "group": "muska-jakna-f", "sku": "FF-1371", "color": "Tamno plava", "hex": "#1f2a44", "price": 12990, "imgs": ["ff/ff1371-1", "ff/ff1371-2"], "added": "2021-09-01"},
    {"id": "zenska-jakna-d8-tamno-braon", "group": "zenska-jakna-d8", "sku": "FF-1367", "color": "Tamno braon", "hex": "#5a4636", "price": 11990, "imgs": ["ff/ff1367-1", "ff/ff1367-2"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d8-braon", "group": "zenska-jakna-d8", "sku": "FF-1363", "color": "Braon", "hex": "#6b5a48", "price": 11990, "imgs": ["ff/ff1363-1", "ff/ff1363-2"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d7-crna", "group": "zenska-jakna-d7", "sku": "FF-1359", "color": "Crna", "hex": "#1c1c1f", "price": 8390, "imgs": ["ff/ff1359-1", "ff/ff1359-2"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d7-crvena", "group": "zenska-jakna-d7", "sku": "FF-1355", "color": "Crvena", "hex": "#c8202f", "price": 8390, "imgs": ["ff/ff1355-1", "ff/ff1355-2"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d7-zelena", "group": "zenska-jakna-d7", "sku": "FF-1351", "color": "Zelena", "hex": "#13865a", "price": 8390, "imgs": ["ff/ff1351-1", "ff/ff1351-2"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d7-zuta", "group": "zenska-jakna-d7", "sku": "FF-1346", "color": "Žuta", "hex": "#e3b93b", "price": 8390, "imgs": ["ff/ff1346-1", "ff/ff1346-2"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d2-bez", "group": "zenska-jakna-d2", "sku": "FF-1339", "color": "Bež", "hex": "#cfc6bd", "price": 11990, "imgs": ["ff/ff1339-1", "ff/ff1339-2", "ff/ff1339-3", "ff/ff1339-4", "ff/ff1339-5"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d2-crvena", "group": "zenska-jakna-d2", "sku": "FF-1334", "color": "Crvena", "hex": "#c8202f", "price": 11990, "imgs": ["ff/ff1334-1", "ff/ff1334-2", "ff/ff1334-3"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d2-zelena", "group": "zenska-jakna-d2", "sku": "FF-1327", "color": "Zelena", "hex": "#13865a", "price": 11990, "imgs": ["ff/ff1327-1", "ff/ff1327-2", "ff/ff1327-3", "ff/ff1327-4", "ff/ff1327-5"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d2-zuta", "group": "zenska-jakna-d2", "sku": "FF-1322", "color": "Žuta", "hex": "#e3b93b", "price": 11990, "imgs": ["ff/ff1322-1", "ff/ff1322-2", "ff/ff1322-3"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d14-crvena", "group": "zenska-jakna-d14", "sku": "FF-1318", "color": "Crvena", "hex": "#c8202f", "price": 11990, "imgs": ["ff/ff1318-1", "ff/ff1318-2"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d14-crna", "group": "zenska-jakna-d14", "sku": "FF-1310", "color": "Crna", "hex": "#1c1c1f", "price": 11990, "imgs": ["ff/ff1310-1", "ff/ff1310-2", "ff/ff1310-3", "ff/ff1310-4", "ff/ff1310-5", "ff/ff1310-6"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d14-pink", "group": "zenska-jakna-d14", "sku": "FF-1303", "color": "Pink", "hex": "#e8a9b8", "price": 11990, "imgs": ["ff/ff1303-1", "ff/ff1303-2", "ff/ff1303-3", "ff/ff1303-4", "ff/ff1303-5"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d12-pink", "group": "zenska-jakna-d12", "sku": "FF-1299", "color": "Pink", "hex": "#e8a9b8", "price": 8390, "imgs": ["ff/ff1299-1", "ff/ff1299-2"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d12-braon", "group": "zenska-jakna-d12", "sku": "FF-1294", "color": "Braon", "hex": "#6b5a48", "price": 8390, "imgs": ["ff/ff1294-1", "ff/ff1294-2"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d12-zuta", "group": "zenska-jakna-d12", "sku": "FF-1289", "color": "Žuta", "hex": "#e3b93b", "price": 8390, "imgs": ["ff/ff1289-1", "ff/ff1289-2"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d12-crvena", "group": "zenska-jakna-d12", "sku": "FF-1285", "color": "Crvena", "hex": "#c8202f", "price": 8390, "imgs": ["ff/ff1285-1", "ff/ff1285-2"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d12-zelena", "group": "zenska-jakna-d12", "sku": "FF-1280", "color": "Zelena", "hex": "#13865a", "price": 8390, "imgs": ["ff/ff1280-1", "ff/ff1280-2", "ff/ff1280-3"], "added": "2020-10-01", "was": 11990},
    {"id": "zenska-jakna-d11-pink-plava", "group": "zenska-jakna-d11", "sku": "FF-1276", "color": "Pink plava", "hex": "#d84d6e", "price": 11990, "imgs": ["ff/ff1276-1", "ff/ff1276-2"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d11-zelena", "group": "zenska-jakna-d11", "sku": "FF-1270", "color": "Zelena", "hex": "#13865a", "price": 11990, "imgs": ["ff/ff1270-1", "ff/ff1270-2"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d11-tamno-plava", "group": "zenska-jakna-d11", "sku": "FF-1257", "color": "Tamno plava", "hex": "#1f2a44", "price": 11990, "imgs": ["ff/ff1257-1", "ff/ff1257-2"], "added": "2020-10-01"},
    {"id": "zenska-jakna-d11-crvena", "group": "zenska-jakna-d11", "sku": "FF-1252", "color": "Crvena", "hex": "#c8202f", "price": 11990, "imgs": ["ff/ff1252-1", "ff/ff1252-2"], "added": "2020-10-01"},
    {"id": "muska-jakna-d10-svetlo-braon", "group": "muska-jakna-d10", "sku": "FF-1246", "color": "Svetlo braon", "hex": "#8c7a5e", "price": 12990, "imgs": ["ff/ff1246-1", "ff/ff1246-2"], "added": "2020-10-01"},
    {"id": "muska-jakna-d3-tamno-plava", "group": "muska-jakna-d3", "sku": "FF-1242", "color": "Tamno plava", "hex": "#1f2a44", "price": 12990, "imgs": ["ff/ff1242-1", "ff/ff1242-2"], "added": "2020-10-01"},
    {"id": "zenska-jakna-b12-pink", "group": "zenska-jakna-b12", "sku": "FF-1232", "color": "Pink", "hex": "#e8a9b8", "price": 11990, "imgs": ["ff/ff1232-1", "ff/ff1232-2", "ff/ff1232-3"], "added": "2020-10-01"},
    {"id": "zenska-jakna-b12-bela", "group": "zenska-jakna-b12", "sku": "FF-1228", "color": "Bela", "hex": "#f4f4f4", "price": 11990, "imgs": ["ff/ff1228-1", "ff/ff1228-2"], "added": "2020-10-01"},
    {"id": "zenska-jakna-a9-crna", "group": "zenska-jakna-a9", "sku": "FF-1193", "color": "Crna", "hex": "#1c1c1f", "price": 11990, "imgs": ["ff/ff1193-1", "ff/ff1193-2", "ff/ff1193-3", "ff/ff1193-4", "ff/ff1193-5"], "added": "2020-10-01"},
    {"id": "muska-jakna-a7-crna", "group": "muska-jakna-a7", "sku": "FF-1186", "color": "Crna", "hex": "#1c1c1f", "price": 12990, "imgs": ["ff/ff1186-1", "ff/ff1186-2", "ff/ff1186-3"], "added": "2020-10-01"},
    {"id": "muska-jakna-a7-plava", "group": "muska-jakna-a7", "sku": "FF-1170", "color": "Plava", "hex": "#2d4f86", "price": 12990, "imgs": ["ff/ff1170-1", "ff/ff1170-2", "ff/ff1170-3"], "added": "2020-10-01"}
  ].map(p => ({ out: [], ...p }));

  /* ---------- KATEGORIJE (pravila, ne ručne liste) ---------- */
  const TYPES = { jakna: 'Jakne', prsluk: 'Prsluci', mantil: 'Mantili' };
  const GENDERS = { z: 'Žene', m: 'Muškarci' };
  const CATEGORIES = [
    { slug: 'zene', name: 'Žene', title: 'Ženske jakne i prsluci', rule: { gender: 'z' }, cover: 'jbeige-2',
      lead: 'Štepane jakne, puferi i dugi prsluci za grad i hladne dane. Svaka boja je poseban model — izaberi svoju.' },
    { slug: 'muskarci', name: 'Muškarci', title: 'Muške jakne i prsluci', rule: { gender: 'm' }, cover: 'ff/ff2732-1',
      lead: 'Zimske jakne, mantili i prsluci čistih linija — topli, praktični i napravljeni da traju.' },
    { slug: 'prsluci', name: 'Prsluci', title: 'Prsluci', rule: { type: 'prsluk' }, cover: 'pink-5',
      lead: 'Lagani sloj koji greje telo, a ostavlja ruke slobodnim. Dugi puf prsluci i klasični modeli za nju i za njega.' },
    { slug: 'outlet', name: 'Outlet', title: 'Outlet', rule: { sale: true }, cover: 'ff/ff1280-1',
      lead: 'Odabrani modeli po sniženim cenama, dok traju zalihe.' }
  ];
  /* stranice kataloga koje nisu u tabovima početne */
  const EXTRA = [
    { slug: 'novo', name: 'Novo', title: 'Novo u ponudi', rule: { fresh: true }, cover: 'jgrey-3',
      lead: 'Najnoviji modeli sezone Jesen/Zima 2026 — stižu u ograničenim količinama.' },
    { slug: 'sve', name: 'Sve', title: 'Cela kolekcija', rule: {}, cover: 'jblack-1',
      lead: 'Sve jakne, prsluci i mantili na jednom mestu.' }
  ];
  const FRESH_FROM = '2026-01-01';

  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const catBySlug = Object.fromEntries([...CATEGORIES, ...EXTRA].map(c => [c.slug, c]));
  const g = p => GROUPS[p.group];

  /* filter: { kat, gender, type, boja, sale, fresh } -> lista proizvoda */
  const query = (f = {}) => {
    const rule = { ...(f.kat && catBySlug[f.kat] ? catBySlug[f.kat].rule : {}), ...f };
    return PRODUCTS.filter(p =>
      (!rule.gender || g(p).gender === rule.gender) &&
      (!rule.type || g(p).type === rule.type) &&
      (!rule.sale || !!p.was) &&
      (!rule.fresh || p.added >= FRESH_FROM) &&
      (!rule.boja || slugify(p.color) === rule.boja));
  };

  /* pretraga: sve reči moraju da se nađu (bez obzira na kvačice) */
  const norm = s => s.toLowerCase().normalize('NFKD').replace(/đ/g, 'dj').replace(/[̀-ͯ]/g, '');
  const search = q => {
    const words = norm(q || '').split(/\s+/).filter(Boolean)
      .map(w => w.replace(/(i|e|a)$/, '').slice(0, 6) || w); // grubo: "jakne"→"jakn", "crni"→"crn"
    if (!words.length) return [];
    return PRODUCTS.filter(p => {
      const hay = norm([g(p).name, p.color, TYPES[g(p).type], GENDERS[g(p).gender], p.sku, p.was ? 'outlet akcija snizenje' : ''].join(' '));
      return words.every(w => hay.includes(w));
    });
  };

  /* tabela veličina (okvirne mere u cm — zameniti merama proizvođača) */
  const SIZE_GUIDE = {
    z: { head: ['Veličina', 'EU', 'Grudi', 'Struk', 'Kukovi'],
      rows: [['S', '36', '84–88', '66–70', '92–96'], ['M', '38', '88–92', '70–74', '96–100'], ['L', '40', '92–96', '74–78', '100–104'],
        ['XL', '42', '96–102', '78–84', '104–110'], ['XXL', '44', '102–108', '84–90', '110–116']] },
    m: { head: ['Veličina', 'EU', 'Grudi', 'Struk', 'Dužina rukava'],
      rows: [['S', '46', '88–94', '76–82', '62'], ['M', '48', '94–100', '82–88', '63'], ['L', '50', '100–106', '88–94', '64'],
        ['XL', '52', '106–112', '94–100', '65'], ['XXL', '54', '112–118', '100–106', '66']] }
  };
  const newest = list => [...list].sort((a, b) => b.added.localeCompare(a.added));
  const slugify = s => s.toLowerCase().normalize('NFKD').replace(/đ/g, 'dj').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  /* boje u listi: [{name, hex, slug, count}] sortirano po broju */
  const colorsOf = list => {
    const m = new Map();
    list.forEach(p => {
      const k = slugify(p.color);
      m.set(k, { name: p.color, hex: p.hex, slug: k, count: (m.get(k)?.count || 0) + 1 });
    });
    return [...m.values()].sort((a, b) => b.count - a.count);
  };
  /* tipovi u listi: [{type, name, count}] */
  const typesOf = list => Object.keys(TYPES)
    .map(t => ({ type: t, name: TYPES[t], count: list.filter(p => g(p).type === t).length }))
    .filter(t => t.count);

  const IMG = 'assets/img/';
  return {
    GROUPS, PRODUCTS, CATEGORIES, EXTRA, TYPES, GENDERS, byId, catBySlug, SIZE_GUIDE,
    SIZES: ['S', 'M', 'L', 'XL', 'XXL'],
    FREE_SHIP: 10000,
    SHIP_PRICE: 490,          // privremeno — cena dostave ispod praga
    PROMO: { FORTE10: 10 },   // kod sa newslettera (−10%)
    query, search, norm, newest, colorsOf, typesOf, slugify, group: g,
    siblings: p => PRODUCTS.filter(x => x.group === p.group),
    title: p => `${g(p).name} – ${p.color}`,
    url: p => `proizvod.html?id=${p.id}`,
    catUrl: (kat, extra = '') => `kategorija.html?kat=${kat}${extra}`,
    searchUrl: q => `kategorija.html?q=${encodeURIComponent(q)}`,
    wishUrl: 'kategorija.html?lista=omiljeno',
    infoUrl: s => `info.html?strana=${s}`,
    img: (name, sm) => `${IMG}${name}${sm ? '-sm' : ''}.jpg`,
    rsd: n => n.toLocaleString('de-DE') + ' RSD',
    discount: p => p.was ? Math.round((1 - p.price / p.was) * 100) : 0,
    colorsWord: n => `${n} ${n % 10 > 1 && n % 10 < 5 && (n % 100 < 12 || n % 100 > 14) ? 'boje' : 'boja'}`
  };
})();
