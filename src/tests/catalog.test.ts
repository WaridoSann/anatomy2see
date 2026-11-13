import { readFile } from 'node:fs/promises';
import { describe,it,expect } from 'vitest';
import { Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { adaptManifest, type AnatomyManifest, organStructures } from '../data/catalog';
import { boundsForStructure,framingBoxDistance } from '../scene/model';
import type { LayerId } from '../types/atlas';
const cases:[string,LayerId,number][]=[['muscles','muscles',398],['skeletal','bones',238],['nervous','nerves',80]];
describe('catalogues et modèles anatomiques segmentés',()=>{
 for(const [file,layer,count] of cases)it(`décode et associe toutes les structures du modèle ${file}`,async()=>{
  const manifest=JSON.parse(await readFile(new URL(`../../public/models/${file}-manifest.json`,import.meta.url),'utf8')) as AnatomyManifest;
  const catalog=adaptManifest(manifest,layer);expect(catalog).toHaveLength(count);expect(new Set(catalog.map(x=>x.id)).size).toBe(count);
  const bytes=await readFile(new URL(`../../public/models/${file}.glb`,import.meta.url));
  const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(Uint8Array.from(bytes).buffer,'');
  const meshes=new Map<string,Mesh>();gltf.scene.traverse(o=>{if(o instanceof Mesh)meshes.set(o.name,o);});
  expect(meshes.size).toBe(count);
  for(const entry of catalog){
   expect(entry.name.trim().length).toBeGreaterThan(2);expect(entry.sourceIds!.length).toBeGreaterThan(0);
   for(const name of entry.meshNames)expect(meshes.has(name),name).toBe(true);
   const bounds=boundsForStructure(gltf.scene,entry.id)!;expect(bounds).not.toBeNull();expect(bounds.radius).toBeGreaterThan(0);
   for(const n of [...bounds.bounds.min.toArray(),...bounds.bounds.max.toArray()])expect(Number.isFinite(n)).toBe(true);
  }
  const body=boundsForStructure(gltf.scene)!;const size=body.bounds.getSize(new Vector3());expect(size.y).toBeGreaterThan(layer==='nerves'?.15:.5);expect(size.y).toBeLessThan(1.95);
  expect(framingBoxDistance(size,36,390/700)).toBeLessThan(5);
  gltf.scene.traverse(o=>{if(o instanceof Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});
 },20000);
 it('ne confond pas un chef musculaire avec un muscle entier et conserve la provenance',async()=>{
  const m=JSON.parse(await readFile(new URL('../../public/models/muscles-manifest.json',import.meta.url),'utf8'));
  const sourceIds=m.structures.flatMap((x:{sourceIds:string[]})=>x.sourceIds);
  expect(sourceIds).toHaveLength(425);expect(new Set(sourceIds).size).toBe(425);
  expect(m.structures.some((x:{englishName:string})=>x.englishName.includes('long head of left biceps brachii'))).toBe(true);
  expect(organStructures.map(x=>x.id)).toEqual(expect.arrayContaining(['heart','lungs','brain','kidneys']));
 });
});
