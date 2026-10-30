"""Download CC0 assets from Poly Haven, shrink them for a PS2-era look, write to ../assets.

Textures: 1k diffuse -> 256px JPEG (fabrics also get a grayscale copy for tinting).
Models: 1k glTF -> decimated GLB with a 256px base-colour texture.
"""
import io, json, os, sys, tempfile, urllib.request
import numpy as np, trimesh, fast_simplification
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'assets')
os.makedirs(os.path.join(OUT, 'tex'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'models'), exist_ok=True)

TEXTURES = {  # id -> (output name, size, grayscale copy)
    'asphalt_02': ('asphalt', 256, False), 'concrete_pavers': ('pavers', 256, False),
    'grey_plaster_02': ('plaster', 256, True), 'beige_wall_001': ('beige', 256, True),
    'damaged_plaster': ('damaged', 256, True), 'concrete_tile_facade': ('panels', 256, True),
    'brick_wall_02': ('brick', 256, False), 'painted_metal_shutter': ('shutter', 256, True),
    'dirty_concrete': ('dirtyconc', 256, True), 'concrete_block_wall': ('blockwall', 256, False),
    'denim_fabric': ('denim', 128, True), 'cotton_jersey': ('jersey', 128, True),
    'sparse_grass': ('grass', 256, False), 'old_wooden_floor_01': ('floor', 256, False),
    'dark_wooden_planks': ('wood', 256, False), 'corrugated_iron': ('corrug', 256, True),
    'clay_roof_tiles': ('roof', 256, False), 'quatrefoil_jacquard_fabric': ('bedspread', 256, False),
    'rusty_metal': ('rust', 256, False), 'beige_wall_002': ('wall2', 256, True),
}
MODELS = {  # id -> (output name, target triangles)
    'boombox': ('boombox', 1200), 'Television_01': ('tv', 1500), 'ceiling_fan': ('fan', 1400),
    'baseball_bat': ('bat', 500), 'service_pistol': ('pistol', 1100), 'metal_trash_can': ('trashcan', 500),
    'exterior_aircon_unit': ('aircon', 450), 'old_tyre': ('tyre', 350), 'cardboard_box_01': ('box', 250),
    'trashbag': ('trashbag', 350), 'spray_paint_bottles': ('spray', 600), 'utility_box_01': ('utilbox', 450),
    'cassette_player': ('cassette', 600), 'gaming_console': ('console', 700), 'throw_pillows_01': ('pillows', 500),
    'wooden_crate_01': ('crate', 300), 'modular_fire_escape': ('fireescape', 2200), 'concrete_road_barrier': ('barrier', 400),
    'street_rat': ('rat', 300),
}

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'beton99-asset-fetch'})
    return urllib.request.urlopen(req, timeout=120).read()

def fetch_texture(pid, name, size, gray):
    info = json.loads(get(f'https://api.polyhaven.com/files/{pid}'))
    url = info['Diffuse']['1k']['jpg']['url']
    img = Image.open(io.BytesIO(get(url))).convert('RGB').resize((size, size), Image.LANCZOS)
    img.save(os.path.join(OUT, 'tex', name + '.jpg'), quality=82)
    if gray:
        img.convert('L').convert('RGB').save(os.path.join(OUT, 'tex', name + '_g.jpg'), quality=82)

def decimate(mesh, target):
    pts, faces = np.asarray(mesh.vertices, np.float32), np.asarray(mesh.faces, np.int32)
    uv = getattr(mesh.visual, 'uv', None)
    if len(faces) <= target:
        return pts, faces, uv
    red = 1 - target / len(faces)
    _, _, coll = fast_simplification.simplify(pts, faces, target_reduction=red, return_collapses=True)
    p2, f2, mapping = fast_simplification.replay_simplification(pts, faces, coll)
    uv2 = None
    if uv is not None:
        uv2 = np.zeros((len(p2), 2), np.float32)
        uv2[mapping] = uv
    return p2, f2, uv2

def fetch_model(pid, name, target):
    info = json.loads(get(f'https://api.polyhaven.com/files/{pid}'))
    g = info['gltf']['1k']['gltf']
    with tempfile.TemporaryDirectory() as td:
        main = os.path.join(td, os.path.basename(g['url']))
        open(main, 'wb').write(get(g['url']))
        for rel, f in g.get('include', {}).items():
            if 'nor_' in rel or 'rough' in rel or 'arm' in rel or 'metal' in rel or '_ao' in rel or 'disp' in rel:
                continue
            path = os.path.join(td, rel)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            open(path, 'wb').write(get(f['url']))
        scene = trimesh.load(main, force='scene', skip_materials=False)
    parts = []
    for node in scene.graph.nodes_geometry:
        T, gname = scene.graph[node]
        m = scene.geometry[gname].copy()
        m.apply_transform(T)
        parts.append(m)
    total = sum(len(m.faces) for m in parts)
    out = trimesh.Scene()
    for i, m in enumerate(parts):
        tgt = max(12, int(target * len(m.faces) / total))
        p, f, uv = decimate(m, tgt)
        img = None
        mat = getattr(m.visual, 'material', None)
        if mat is not None:
            img = getattr(mat, 'baseColorTexture', None) or getattr(mat, 'image', None)
        if img is not None and uv is not None:
            img = img.convert('RGB').resize((256, 256), Image.LANCZOS)
            vis = trimesh.visual.TextureVisuals(uv=uv, material=trimesh.visual.material.SimpleMaterial(image=img))
        else:
            col = getattr(mat, 'baseColorFactor', None) if mat is not None else None
            vis = trimesh.visual.ColorVisuals(face_colors=np.tile((np.array(col[:3]) * 255 if col is not None else [150, 150, 150]).tolist() + [255], (len(f), 1)))
        out.add_geometry(trimesh.Trimesh(p, f, visual=vis, process=False), geom_name=f'{name}_{i}')
    data = out.export(file_type='glb')
    return total, sum(len(g.faces) for g in out.geometry.values()), write_json_gltf(data, name)

def write_json_gltf(glb_bytes, name):
    """Artifact hosting serves .json but not .glb, so models ship as glTF JSON with embedded data URIs."""
    from pygltflib import GLTF2, BufferFormat, ImageFormat
    g = GLTF2.load_from_bytes(glb_bytes)
    g.convert_images(ImageFormat.DATAURI)
    g.convert_buffers(BufferFormat.DATAURI)
    path = os.path.join(OUT, 'models', name + '.json')
    g.save_json(path)
    return os.path.getsize(path)

if __name__ == '__main__':
    which = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if which in ('all', 'tex'):
        for pid, (name, size, gray) in TEXTURES.items():
            try: fetch_texture(pid, name, size, gray); print('tex', name)
            except Exception as e: print('FAIL tex', pid, e)
    if which in ('all', 'models'):
        for pid, (name, tgt) in MODELS.items():
            try: print('model', name, fetch_model(pid, name, tgt))
            except Exception as e: print('FAIL model', pid, repr(e)[:200])
