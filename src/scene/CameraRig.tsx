import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PerspectiveCamera, Vector3 } from 'three';
import type { Group } from 'three';
import gsap from 'gsap';
import { useExplorer } from '../state/explorer';
import { boundsForStructure, framingBoxDistance } from './model';
export default function CameraRig({model}:{model:Group|null}) {
 const controls=useRef<OrbitControlsImpl>(null);
 const {camera,size}=useThree();
 const request=useExplorer(s=>s.cameraRequest);
 const tween=useRef<gsap.core.Tween|null>(null);
 useEffect(()=>{
  const orbit=controls.current;
  if(!orbit||!model||!(camera instanceof PerspectiveCamera))return;
  tween.current?.kill();
  let target=orbit.target.clone();let position=camera.position.clone();
  const all=boundsForStructure(model);if(!all)return;
  if(request.type==='zoom') {
   position.sub(target).multiplyScalar(request.value!>0?0.8:1.25).add(target);
   const delta=position.clone().sub(target);delta.setLength(Math.min(8,Math.max(0.08,delta.length())));position.copy(target).add(delta);
  } else {
   const box=request.type==='focus'&&request.id?boundsForStructure(model,request.id):all;
   if(!box)return;
   target=box.center;
   const distance=framingBoxDistance(box.bounds.getSize(new Vector3()),camera.fov,size.width/size.height,request.type==='view'&&request.view==='side');
   const direction=request.type==='view'&&request.view==='back'?new Vector3(0,0,-1):request.type==='view'&&request.view==='side'?new Vector3(1,0,0):new Vector3(0,0,1);
   position=target.clone().add(direction.multiplyScalar(distance));
  }
  orbit.minDistance=request.type==='focus'?0.06:0.4;orbit.maxDistance=8;
  const state={px:camera.position.x,py:camera.position.y,pz:camera.position.z,tx:orbit.target.x,ty:orbit.target.y,tz:orbit.target.z};
  tween.current=gsap.to(state,{px:position.x,py:position.y,pz:position.z,tx:target.x,ty:target.y,tz:target.z,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:1.15,ease:'power3.inOut',onUpdate:()=>{camera.position.set(state.px,state.py,state.pz);orbit.target.set(state.tx,state.ty,state.tz);orbit.update();}});
  return ()=>{tween.current?.kill();};
 },[camera,model,request,size.width,size.height]);
 return <OrbitControls ref={controls} makeDefault enablePan enableDamping dampingFactor={0.08} minDistance={0.08} maxDistance={8} rotateSpeed={0.65} zoomSpeed={0.75} onStart={()=>tween.current?.kill()}/>;
}
