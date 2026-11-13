"""
Pravi podstranice od zajedničkog okvira iz index.html (topbar, header,
meni, korpa, pretraga, futer) + sadržaja iz tools/*-main.html.
Pokrenuti posle svake izmene headera/futera u index.html:

    python tools/build-pages.py

(Na stagingu ovo zamenjuju šabloni platforme.)
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
index = (ROOT / 'index.html').read_text(encoding='utf-8')

# (izlaz, sadržaj, klasa za <body>, naslov, skripta)
PAGES = [
    ('proizvod.html', 'pdp-main.html', 'page-product', 'Proizvod', 'product.js'),
    ('kategorija.html', 'cat-main.html', 'page-cat', 'Kategorija', 'category.js'),
    ('porucivanje.html', 'checkout-main.html', 'page-checkout', 'Poručivanje', 'checkout.js'),
    ('info.html', 'info-main.html', 'page-info', 'Informacije', 'info.js'),
]

head0, rest = index.split('<main>', 1)
_, tail0 = rest.split('</main>', 1)

# linkovi koji na početnoj vode na sidra moraju da vode na index.html
fix = lambda s: re.sub(r'(?<!use )href="#(?!")', 'href="index.html#', s)
head0, tail0 = fix(head0), fix(tail0)
head0 = re.sub(r'\s*<link rel="preload" as="image"[^>]*>', '', head0)

for out, main_file, body_class, title, script in PAGES:
    main = (ROOT / 'tools' / main_file).read_text(encoding='utf-8')
    head = head0.replace('<body>', f'<body class="{body_class}">')
    head = re.sub(r'<title>.*?</title>', f'<title>{title} | FORTE</title>', head)
    tail = tail0.replace('<script src="assets/js/main.js"></script>',
                         f'<script src="assets/js/main.js"></script>\n<script src="assets/js/{script}"></script>')
    html = head + '<!-- GENERISANO: tools/build-pages.py — ne menjati ručno okvir stranice -->\n' + main + tail
    (ROOT / out).write_text(html, encoding='utf-8')
    print(out, 'napravljen')
