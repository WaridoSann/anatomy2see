import { Component, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import { modelPaths } from '../data/catalog';
import type { Group } from 'three';
import type { LayerId } from '../types/atlas';
import { useExplorer } from '../state/explorer';
import ClassroomBackdrop from '../components/ClassroomBackdrop';
import AnatomyModel from './AnatomyModel';
import CameraRig from './CameraRig';
class SceneBoundary extends Component<{children:ReactNode;layer:LayerId},{error:boolean}> {
 state={error:false};
 static getDerivedStateFromError(){return {error:true};}
 componentDidCatch(error:Error){useExplorer.getState().setError(`Le modèle n’a pas pu être chargé. Vérifiez votre connexion et réessayez. (${error.message})`,this.props.layer);}
 render(){return this.state.error?null:this.props.children;}
}
function World({layer}:{layer:LayerId}){
 const [model,setModel]=useState<Group|null>(null);
 const receive=useCallback((g:Group)=>setModel(g),[]);
 const quality=useExplorer(s=>s.quality);
 return <>
  <ambientLight intensity={0.75}/><hemisphereLight args={['#fff8e8','#a9a599',1.1]}/>
  <directionalLight position={[-3,3,4]} intensity={2.3} color="#fff5dc"/>
  <directionalLight position={[3,1,-2]} intensity={1.2} color="#ffffff"/>
  <Suspense fallback={null}><AnatomyModel onModel={receive} layer={layer}/></Suspense>
  <CameraRig model={model}/>
  {quality!=='low'&&<ContactShadows key={model?.uuid??'loading'} position={[0,-0.917,0]} opacity={0.24} scale={3.5} blur={2.7} far={2} resolution={quality==='ultra'?512:256} color="#796e53" frames={2}/>}
 </>;
}
export default function Scene(){
 const layer=useExplorer(s=>s.layer);const quality=useExplorer(s=>s.quality);
 const [supported]=useState(()=>{try{const canvas=document.createElement('canvas');const context=canvas.getContext('webgl2');if(!context)return false;context.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}});
 useEffect(()=>{if(!supported)useExplorer.getState().setError('WebGL 2 est indisponible sur cet appareil. Vous pouvez consulter les fiches et leurs illustrations.',layer);},[supported,layer]);
 const ratio={low:1,medium:1.25,high:1.5,ultra:2}[quality];
 return <div className="anatomy-stage" role="region" aria-label="Modèle anatomique 3D interactif — glissez pour tourner, molette pour zoomer">
  <ClassroomBackdrop/>
  {supported&&<SceneBoundary key={layer} layer={layer}><Canvas dpr={[1,ratio]} camera={{position:[0,0,3.4],fov:36,near:0.002,far:30}} gl={{antialias:quality!=='low',alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();useExplorer.getState().setError('Le rendu graphique a été interrompu. Rechargez la page pour retrouver la 3D.');});}}><World key={layer} layer={layer}/></Canvas></SceneBoundary>}
 </div>;
}

export function preloadLayer(layer:LayerId){useGLTF.preload([`${import.meta.env.BASE_URL}models/${modelPaths[layer]}`,`${import.meta.env.BASE_URL}models/anatomy.glb`]);}
