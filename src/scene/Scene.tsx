import { Component, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import type { Group } from 'three';
import { useExplorer } from '../state/explorer';
import AnatomyModel from './AnatomyModel';
import CameraRig from './CameraRig';
class SceneBoundary extends Component<{children:ReactNode},{error:boolean}> {
 state={error:false};
 static getDerivedStateFromError(){return {error:true};}
 componentDidCatch(error:Error){useExplorer.getState().setError(`Le modèle 3D n’a pas pu être chargé. ${error.message}`);}
 render(){return this.state.error?null:this.props.children;}
}
function World(){
 const [model,setModel]=useState<Group|null>(null);
 const receive=useCallback((g:Group)=>setModel(g),[]);
 const quality=useExplorer(s=>s.quality);
 return <>
  <ambientLight intensity={0.7}/><hemisphereLight args={['#b8d9e6','#263340',1.3]}/>
  <directionalLight position={[2,3,4]} intensity={3.2} color="#e1e7e6"/>
  <directionalLight position={[-3,1,-2]} intensity={3} color="#5eccc9"/>
  <spotLight position={[2,0,-3]} intensity={13} angle={0.7} penumbra={1} color="#97bfff"/>
  <Suspense fallback={null}><AnatomyModel onModel={receive}/></Suspense>
  <CameraRig model={model}/>
  <ContactShadows position={[0,-0.915,0]} opacity={0.28} scale={3} blur={2.8} far={2} resolution={quality==='low'?128:256} color="#37a3a8" frames={1}/>
  {quality==='ultra'&&<EffectComposer multisampling={0}><Bloom intensity={0.15} luminanceThreshold={1.3} mipmapBlur/></EffectComposer>}
 </>;
}
export default function Scene(){
 const quality=useExplorer(s=>s.quality);
 const [supported]=useState(()=>{try{const canvas=document.createElement('canvas');const context=canvas.getContext('webgl2');if(!context)return false;context.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}});
 useEffect(()=>{if(!supported)useExplorer.getState().setError('WebGL 2 est indisponible sur cet appareil. Les fiches restent accessibles dans la liste.');},[supported]);
 const ratio={low:1,medium:1.25,high:1.75,ultra:2}[quality];
 if(!supported)return <div className="webgl-fallback">Explorez les fiches anatomiques depuis la liste des structures.</div>;
 return <div className="scene-root" role="region" aria-label="Modèle anatomique 3D interactif — glissez pour tourner, molette pour zoomer">
  <SceneBoundary><Canvas dpr={[1,ratio]} camera={{position:[0,0,3.4],fov:36,near:0.005,far:30}} gl={{antialias:quality!=='low',alpha:true,powerPreference:'high-performance'}} fallback={<div className="webgl-fallback">La 3D nécessite WebGL. Les fiches anatomiques restent consultables dans la liste.</div>} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();useExplorer.getState().setError('Le contexte graphique a été interrompu. Rechargez la page pour rétablir la 3D.');});}}><World/></Canvas></SceneBoundary>
 </div>;
}
