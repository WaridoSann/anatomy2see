import { useEffect, useMemo, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { Color, DoubleSide, Group, Mesh, MeshPhysicalMaterial } from 'three';
import { anatomy } from '../data/anatomy';
import { useExplorer } from '../state/explorer';
import { boundsForStructure, structureForMesh } from './model';
export default function AnatomyModel({onModel}:{onModel:(model:Group)=>void}) {
 const gltf=useGLTF(`${import.meta.env.BASE_URL}models/anatomy.glb`);
 const model=useMemo(()=>{
  const root=gltf.scene.clone(true);
  root.traverse(object=>{if(object instanceof Mesh){const id=structureForMesh(object.name);const entry=anatomy.find(x=>x.id===id);object.material=new MeshPhysicalMaterial({color:entry?.color??'#d5cbb6',roughness:0.48,metalness:0.03,clearcoat:0.18,side:DoubleSide});}});
  return root;
 },[gltf.scene]);
 const selectedId=useExplorer(s=>s.selectedId);const isolated=useExplorer(s=>s.isolated);
 const activeSystems=useExplorer(s=>s.activeSystems);const hiddenIds=useExplorer(s=>s.hiddenIds);
 const transparent=useExplorer(s=>s.transparent);const labels=useExplorer(s=>s.labels);
 const [hovered,setHovered]=useState<string|null>(null);
 const select=useExplorer(s=>s.select);
 useEffect(()=>{
  const ids=new Set<string>();model.traverse(o=>{if(o instanceof Mesh && anatomy.some(x=>x.id===structureForMesh(o.name)))ids.add(structureForMesh(o.name));});
  useExplorer.getState().setLoaded([...ids]);onModel(model);
  return()=>{model.traverse(o=>{if(o instanceof Mesh)(o.material as MeshPhysicalMaterial).dispose();});};
 },[model,onModel]);
 useEffect(()=>{
  model.traverse(object=>{
   if(!(object instanceof Mesh))return;
   const id=structureForMesh(object.name);const entry=anatomy.find(x=>x.id===id);
   object.visible=!!entry && activeSystems.includes(entry.system) && !hiddenIds.includes(id) && (!isolated||id===selectedId);
   if(id==='skin')object.visible=false;
   const material=object.material as MeshPhysicalMaterial;
   const selected=id===selectedId;const hover=id===hovered;
   const faded=(transparent||selectedId!==null)&&!selected;
   material.transparent=faded;material.opacity=faded?0.19:1;material.depthWrite=!faded;
   material.emissive=new Color(selected?'#5c211a':hover?'#264f52':'#000000');material.emissiveIntensity=selected?0.36:hover?0.3:0;
  });
 },[model,selectedId,isolated,activeSystems,hiddenIds,transparent,hovered]);
 const pick=(e:ThreeEvent<MouseEvent>)=>{if(e.delta>4)return;e.stopPropagation();const id=structureForMesh(e.object.name);if(anatomy.some(x=>x.id===id))select(id);};
 const labelEntries=useMemo(()=>anatomy.map(entry=>({entry,bounds:boundsForStructure(model,entry.id)})).filter(x=>x.bounds),[model]);
 return <group onClick={pick} onDoubleClick={e=>{pick(e);useExplorer.getState().isolate();}} onPointerOver={e=>{e.stopPropagation();setHovered(structureForMesh(e.object.name));document.body.style.cursor='pointer';}} onPointerOut={()=>{setHovered(null);document.body.style.cursor='auto';}}>
  <primitive object={model}/>
  {labels&&labelEntries.filter(x=>activeSystems.includes(x.entry.system)&&!hiddenIds.includes(x.entry.id)&&(!isolated||x.entry.id===selectedId)).map(({entry,bounds})=><Html key={entry.id} position={bounds!.center.toArray()} center zIndexRange={[5,0]}><button className="anatomy-label" onClick={e=>{e.stopPropagation();select(entry.id);}}>{entry.name}</button></Html>)}
 </group>;
}
