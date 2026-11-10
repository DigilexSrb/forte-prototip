"""
Pravi proizvod.html od zajedničkog okvira iz index.html (topbar, header,
meni, korpa, pretraga, futer) + sadržaja iz tools/pdp-main.html.
Pokrenuti posle svake izmene headera/futera u index.html:

    python tools/build-pages.py

(Na stagingu ovo zamenjuju šabloni platforme.)
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
index = (ROOT / 'index.html').read_text(encoding='utf-8')
main = (ROOT / 'tools' / 'pdp-main.html').read_text(encoding='utf-8')

head, rest = index.split('<main>', 1)
_, tail = rest.split('</main>', 1)

# linkovi koji na početnoj vode na sidra moraju da vode na index.html
fix = lambda s: re.sub(r'(?<!use )href="#(?!")', 'href="index.html#', s)
head, tail = fix(head), fix(tail)

head = head.replace('<body>', '<body class="page-product">')
head = re.sub(r'\s*<link rel="preload" as="image"[^>]*>', '', head)
head = re.sub(r'<title>.*?</title>', '<title>Proizvod | FORTE</title>', head)
tail = tail.replace('<script src="assets/js/main.js"></script>',
                    '<script src="assets/js/main.js"></script>\n<script src="assets/js/product.js"></script>')

out = head + '<!-- GENERISANO: tools/build-pages.py — ne menjati ručno okvir stranice -->\n' + main + tail
(ROOT / 'proizvod.html').write_text(out, encoding='utf-8')
print('proizvod.html napravljen')
