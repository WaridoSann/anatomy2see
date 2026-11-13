# BodyParts3D segmentation and web geometry pipeline. Source meshes CC BY 4.0.
import bpy,json,sys,math,os
from pathlib import Path
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
if not args:raise SystemExit('Usage: blender -b --python tools/build-segmented-models.py -- /path/to/OBJ')
ROOT=Path(__file__).resolve().parents[1];CACHE=Path(args[0]).resolve();OUT=ROOT/'public/models'
center=Vector((0.023406982421875,-109.03314971923828,782.8699340820312));scale=.00105462085236557
for kind,path,target in [('muscles','public/models/muscles-manifest.json',1600),('skeletal','public/models/skeletal-manifest.json',1300),('nervous','public/models/nervous-manifest.json',1800)]:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 data=json.load(open(ROOT/path));triangles=0
 for n,entry in enumerate(data['structures']):
  verts=[];faces=[]
  for id in entry['sourceIds']:
   offset=len(verts)
   for line in (CACHE/(id+'.obj')).read_text().splitlines():
    if line.startswith('v '):
     vals=line.split()[1:4];v=(Vector(tuple(map(float,vals)))-center)*scale;verts.append(tuple(v))
    elif line.startswith('f '):
     ids=[int(x.split('/')[0])-1+offset for x in line.split()[1:]]
     for k in range(1,len(ids)-1):faces.append((ids[0],ids[k],ids[k+1]))
  mesh=bpy.data.meshes.new(entry['id']);mesh.from_pydata(verts,[],faces);mesh.update()
  obj=bpy.data.objects.new(entry['id'],mesh);bpy.context.collection.objects.link(obj)
  bpy.context.view_layer.objects.active=obj;obj.select_set(True)
  original=len(mesh.polygons);maxfaces=target
  if kind=='nervous' and any(x in entry.get('originalName','') for x in ['cerebellum','white matter']):maxfaces=5000
  if original>maxfaces:
   mod=obj.modifiers.new('Web geometry','DECIMATE');mod.ratio=maxfaces/original;bpy.ops.object.modifier_apply(modifier=mod.name)
  for p in obj.data.polygons:p.use_smooth=True
  if kind=='muscles':
   c=(.50+.035*(n%5),.13+.015*(n%4),.09+.012*(n%3),1)
  elif kind=='skeletal':c=(.78,.72,.59,1)
  else:c=(.74,.51,.16,1)
  mat=bpy.data.materials.new(entry['id']+'-mat');mat.diffuse_color=c;mat.use_nodes=True
  bs=mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=c;bs.inputs['Roughness'].default_value=.57
  obj.data.materials.append(mat);obj.select_set(False)
  obj['structure_id']=entry['id'];obj['source']='BodyParts3D © DBCLS, CC BY 4.0'
  entry['sourceTriangles']=original;entry['triangles']=len(obj.data.polygons);triangles+=entry['triangles']
  if n%50==0:print(kind,n,'/',len(data['structures']),flush=True)
 bpy.ops.export_scene.gltf(filepath=str(OUT/(kind+'.glb')),export_format='GLB',export_yup=True,export_apply=True,export_extras=True,export_cameras=False,export_lights=False)
 data['compression']='uncompressed';data['triangles']=triangles;data['bytes']=(OUT/(kind+'.glb')).stat().st_size
 (OUT/(kind+'-manifest.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2))
 print('EXPORTED',kind,len(data['structures']),triangles,data['bytes'],flush=True)
