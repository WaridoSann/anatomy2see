import { useEffect, useMemo, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { Color, DoubleSide, Group, Mesh, MeshStandardMaterial } from 'three';
import type { AtlasStructure, LayerId } from '../types/atlas';
import { useExplorer } from '../state/explorer';
import { modelPaths } from '../data/catalog';
export default function AnatomyModel({onModel,layer}:{onModel:(model:Group)=>void;layer:LayerId}) {
 const [gltf,contextGltf]=useGLTF([`${import.meta.env.BASE_URL}models/${modelPaths[layer]}`,`${import.meta.env.BASE_URL}models/anatomy.glb`]);
 const catalog=useExplorer(s=>s.catalog);
 const entries=useMemo(()=>catalog.filter(e=>e.layer===layer),[catalog,layer]);
 const model=useMemo(()=>{
  const root=new Group();root.name='anatomical-model';
  const lookup=new Map<string,AtlasStructure>();entries.forEach(e=>e.meshNames.forEach(n=>lookup.set(n,e)));
  const main=gltf.scene.clone(true);
  main.traverse(object=>{if(object instanceof Mesh){const entry=lookup.get(object.name);object.userData.structureId=entry?.id;object.visible=!!entry;if(!entry)return;object.material=new MeshStandardMaterial({color:entry.color,roughness:layer==='bones'?0.68:0.47,metalness:0,side:DoubleSide});}});
  root.add(main);
  if(layer!=='bones'){
   const context=contextGltf.scene.clone(true);context.name='body-context';
   context.traverse(o=>{if(o instanceof Mesh){if(!['skeleton','skull','spine'].includes(o.name)){o.visible=false;return;}o.name=`context-${o.name}`;o.userData.context=true;o.material=new MeshStandardMaterial({color:'#a99e87',transparent:true,opacity:layer==='organs'?0.14:0.18,roughness:0.8,depthWrite:false});o.raycast=()=>{};}});
   root.add(context);
  }
  return root;
 },[gltf.scene,contextGltf.scene,entries,layer]);
 const selectedId=useExplorer(s=>s.selectedId);const isolated=useExplorer(s=>s.isolated);const transparent=useExplorer(s=>s.transparent);
 const [hovered,setHovered]=useState<{entry:AtlasStructure;point:[number,number,number]}|null>(null);
 useEffect(()=>{
  const ids=new Set<string>();model.traverse(o=>{if(o instanceof Mesh&&o.userData.structureId)ids.add(o.userData.structureId);});
  if(ids.size)useExplorer.getState().setLoaded([...ids],layer);onModel(model);
  return()=>{document.body.style.cursor='';model.traverse(o=>{if(o instanceof Mesh&&(o.userData.structureId||o.userData.context))(o.material as MeshStandardMaterial).dispose();});};
 },[model,onModel,layer]);
 useEffect(()=>{
  model.traverse(object=>{
   if(!(object instanceof Mesh))return;
   const id=object.userData.structureId as string|undefined;
   if(object.userData.context){object.visible=!isolated;return;}
   if(!id){object.visible=false;return;}
   object.visible=!isolated||id===selectedId;
   const material=object.material as MeshStandardMaterial;
   const selected=id===selectedId;const over=id===hovered?.entry.id;
   const faded=(transparent||selectedId!==null)&&!selected;
   material.transparent=faded;material.opacity=faded?0.13:1;material.depthWrite=!faded;
   material.emissive=new Color(selected?'#593018':over?'#9a6a1b':'#000000');material.emissiveIntensity=selected?0.17:over?0.25:0;
  });
 },[model,selectedId,isolated,transparent,hovered]);
 const pick=(e:ThreeEvent<MouseEvent>)=>{if(e.delta>4||!e.object.userData.structureId)return;e.stopPropagation();useExplorer.getState().select(e.object.userData.structureId);setHovered(null);};
 const hover=(e:ThreeEvent<PointerEvent>)=>{const entry=entries.find(x=>x.id===e.object.userData.structureId);if(!entry)return;e.stopPropagation();setHovered({entry,point:[e.point.x,e.point.y+0.045,e.point.z]});document.body.style.cursor='pointer';};
 return <group onClick={pick} onDoubleClick={e=>{pick(e);if(e.delta<4&&e.object.userData.structureId)useExplorer.getState().isolate();}} onPointerOver={hover} onPointerOut={()=>{setHovered(null);document.body.style.cursor='';}}>
  <primitive object={model}/>
  {hovered&&<Html position={hovered.point} center zIndexRange={[20,10]} style={{pointerEvents:'none'}}><div className="structure-tooltip"><span>{hovered.entry.name}</span><small>Cliquer pour découvrir</small></div></Html>}
 </group>;
}
