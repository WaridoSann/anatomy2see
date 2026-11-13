# BodyParts3D to anatomy2see asset pipeline. Requires Blender 4.3+.
# Source geometry: BodyParts3D © DBCLS, CC BY 4.0; see ASSETS.md.
# Run from repository root:
# blender -b -t 4 --python tools/convert-bodyparts.py -- /path/to/isa_BP3D_4.0_obj_99 public/models
import bpy,csv,json,os,math,sys
from pathlib import Path
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
if not args: raise SystemExit('Usage: blender -b --python tools/convert-bodyparts.py -- /path/to/OBJ/directory [output-directory]')
root=Path(args[0]).resolve();out=Path(args[1]).resolve() if len(args)>1 else Path(__file__).resolve().parents[1]/'public/models'
out.mkdir(parents=True,exist_ok=True)
groups=json.load(open(Path(__file__).resolve().parents[1]/'public/models/source-parts.json'))
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
# Source geometry in millimetres (Z superior, -Y anterior), transformed into Y-up glTF.
objects=[];stats=[]
colors={'skeleton':(.63,.70,.72,1),'skull':(.72,.77,.75,1),'spine':(.65,.72,.72,1),'heart':(.58,.055,.09,1),'lung-left':(.22,.43,.50,1),'lung-right':(.22,.43,.50,1),'brain':(.56,.36,.40,1),'liver':(.34,.08,.12,1),'stomach':(.62,.23,.25,1),'kidney-left':(.47,.10,.16,1),'kidney-right':(.47,.10,.16,1),'intestines':(.50,.27,.24,1),'skin':(.18,.36,.42,.13)}
targets={'skeleton':75000,'skull':40000,'spine':35000,'heart':30000,'lung-left':20000,'lung-right':20000,'brain':40000,'liver':15000,'stomach':10000,'kidney-left':6000,'kidney-right':6000,'intestines':30000,'skin':25000}
for name,ids in groups.items():
 verts=[];faces=[]
 for id in ids:
  p=root/(id+'.obj')
  if not p.exists():raise Exception('Missing '+str(p))
  offset=len(verts)
  for l in p.read_text().splitlines():
   if l.startswith('v '):
    _,x,y,z=l.split();verts.append((float(x),float(y),float(z)))
   elif l.startswith('f '):
    f=[int(v.split('/')[0])-1+offset for v in l.split()[1:]]
    for i in range(1,len(f)-1):faces.append((f[0],f[i],f[i+1]))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
 obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj)
 bpy.context.view_layer.objects.active=obj;obj.select_set(True)
 original=len(mesh.polygons)
 if original>targets[name]:
  m=obj.modifiers.new('Web optimization (collapse)','DECIMATE');m.ratio=targets[name]/original;bpy.ops.object.modifier_apply(modifier=m.name)
 for poly in obj.data.polygons:poly.use_smooth=True
 mat=bpy.data.materials.new(name+'-material');mat.diffuse_color=colors[name];mat.use_nodes=True
 bs=mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=colors[name];bs.inputs['Roughness'].default_value=.57;bs.inputs['Metallic'].default_value=.06
 if name=='skin':
  bs.inputs['Alpha'].default_value=.13;mat.surface_render_method='DITHERED'
 obj.data.materials.append(mat);obj.select_set(False);objects.append(obj)
 stats.append({'id':name,'sourceParts':len(ids),'sourceTriangles':original,'triangles':len(obj.data.polygons)})
 print('DONE',name,original,'=>',len(obj.data.polygons),flush=True)
# One body coordinate transform, then bake it. Blender exports Y-up by converting local Z-up.
# Blender scene intentionally remains Z-up, anterior -Y; exporter outputs Y-up, anterior +Z.
skel=[o for o in objects if o.name in ('skeleton','skull','spine')]
minz=min(v.co.z for o in skel for v in o.data.vertices);maxz=max(v.co.z for o in skel for v in o.data.vertices)
minx=min(v.co.x for o in skel for v in o.data.vertices);maxx=max(v.co.x for o in skel for v in o.data.vertices)
miny=min(v.co.y for o in skel for v in o.data.vertices);maxy=max(v.co.y for o in skel for v in o.data.vertices)
center=Vector(((minx+maxx)/2,(miny+maxy)/2,(minz+maxz)/2));scale=1.8/(maxz-minz)
for obj in objects:
 for v in obj.data.vertices:v.co=(v.co-center)*scale
 obj.data.update()
 obj['source']='BodyParts3D © The Database Center for Life Science, CC BY 4.0';obj['structure_id']=obj.name
bpy.ops.export_scene.gltf(filepath=str(out/'anatomy.glb'),export_format='GLB',export_apply=True,export_yup=True,export_cameras=False,export_lights=False,export_extras=True,export_materials='EXPORT')
manifest={'source':'BodyParts3D v4.0 (2013), Database Center for Life Science','license':'CC-BY-4.0','licenseURL':'https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html','coordinates':{'height':1.8,'center':[0,0,0],'up':'+Y','front':'+Z'},'structures':[dict(s,meshes=[s['id']]) for s in stats]}
json.dump(manifest,open(out/'manifest.json','w'),indent=2)
print('EXPORTED',str(out/'anatomy.glb'),(out/'anatomy.glb').stat().st_size,flush=True)
