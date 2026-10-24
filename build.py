import pathlib
s=pathlib.Path('src')
t=(s/'template.html').read_text()
for k,f in [('BANK','bank.js'),('ENGINE','engine.js'),('SKILLS','skills.js'),('UI','ui.js')]:
    t=t.replace(f'/*__{k}__*/',(s/f).read_text())
pathlib.Path('index.html').write_text(t)
print(len(t))
