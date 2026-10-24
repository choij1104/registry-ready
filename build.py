"""Assembles index.html from src/ and the item bank in items/*.json."""
import json, pathlib, sys
R = pathlib.Path(__file__).parent
s = R / 'src'
parts = ['SC', 'PA1', 'PA2', 'SA', 'TT', 'OP']
bank = []
for p in parts:
    f = R / 'items' / f'{p}.json'
    if f.exists():
        bank += json.loads(f.read_text())
    else:
        print(f'warning: {f.name} missing', file=sys.stderr)
keep = ['id', 'd', 'topic', 'concept', 'b', 'type', 'stem', 'opts', 'ans', 'cols', 'rows', 'key', 'why', 'wrong', 'src']
bank = [{k: it[k] for k in keep if k in it} for it in bank]
bank_js = (s / 'domains.js').read_text() + '\nconst BANK = ' + json.dumps(bank, ensure_ascii=False, separators=(',', ':')) + ';\n'
t = (s / 'template.html').read_text()
t = t.replace('/*__BANK__*/', bank_js)
t = t.replace('/*__ENGINE__*/', (s / 'engine.js').read_text())
t = t.replace('/*__SKILLS__*/', (s / 'skills.js').read_text() + (s / 'cards.js').read_text() + (s / 'audio.js').read_text())
t = t.replace('/*__UI__*/', (s / 'ui.js').read_text())
(R / 'index.html').write_text(t)
print(len(bank), 'items;', len(t), 'chars')
