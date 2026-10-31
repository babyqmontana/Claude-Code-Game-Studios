"""Inline src/v6/*.js into index.html between the @@V6 markers (sorted by file name)."""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf-8')
parts = []
for f in sorted((root / 'src' / 'v6').glob('*.js')):
    parts.append('/* --- ' + f.name + ' --- */\n' + f.read_text(encoding='utf-8').rstrip() + '\n')
body = '/*@@V6-BEGIN*/\n' + ''.join(parts) + '/*@@V6-END*/'
new, n = re.subn(r'/\*@@V6-BEGIN\*/.*?/\*@@V6-END\*/', lambda m: body, html, flags=re.S)
assert n == 1, 'markers not found'
(root / 'index.html').write_text(new, encoding='utf-8')
print('inlined', len(parts), 'modules,', len(new), 'bytes')
