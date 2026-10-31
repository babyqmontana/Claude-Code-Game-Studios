"""Make dist/index.html: one self-contained file (three.js, loaders, every model and texture inlined).
The published artifact is this file, so nothing depends on CDNs or on relative asset requests."""
import base64, json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf-8')
V = root / 'vendor'
for url, f in [('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three.min.js'),
               ('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js', 'GLTFLoader.js'),
               ('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/SkeletonUtils.js', 'SkeletonUtils.js')]:
    tag = f'<script src="{url}"></script>'
    assert html.count(tag) == 1, tag
    html = html.replace(tag, '<script>' + (V / f).read_text(encoding='utf-8') + '\n</script>')
# fonts: replace the Google Fonts links with inlined @font-face rules
import re as _re
F = V / 'fonts'
css = (F / 'fonts.local.css').read_text(encoding='utf-8')
css = _re.sub(r'FILE:([\w.-]+)', lambda m: 'data:font/woff2;base64,' + base64.b64encode((F / m.group(1)).read_bytes()).decode(), css)
for tag in _re.findall(r'<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>', html):
    html = html.replace(tag, '')
html = html.replace('<style>', '<style>' + css + '\n', 1)
assets = {}
for p in sorted((root / 'assets').rglob('*')):
    if not p.is_file(): continue
    rel = p.relative_to(root).as_posix()
    if p.suffix == '.json':
        assets[rel] = p.read_text(encoding='utf-8')
    else:
        mime = {'.jpg': 'image/jpeg', '.png': 'image/png'}[p.suffix]
        assets[rel] = f'data:{mime};base64,' + base64.b64encode(p.read_bytes()).decode()
blob = json.dumps(assets, separators=(',', ':')).replace('</', '<\\/')
inject = '<script>window.B99_ASSETS=' + blob + ';</script>\n'
first = html.index('<script>')
html = html[:first] + inject + html[first:]
out = root / 'dist' / 'index.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')
print(out, len(html) // 1024, 'KB,', len(assets), 'assets')
