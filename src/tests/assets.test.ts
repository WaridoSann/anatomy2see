import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { anatomy } from '../data/anatomy';
import { boundsForStructure, framingDistance, structureForMesh } from '../scene/model';

describe('modèle anatomique livré', () => {
  it('charge le GLB réel et associe les dix groupes disponibles à des fiches', async () => {
    const bytes = await readFile(new URL('../../public/models/anatomy.glb', import.meta.url));
    const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(Uint8Array.from(bytes).buffer, '');
    const manifest = JSON.parse(await readFile(new URL('../../public/models/manifest.json', import.meta.url), 'utf8')) as {
      structures: Array<{ id: string; meshes: string[] }>;
    };
    const meshNames: string[] = [];
    const available = new Set<string>();
    gltf.scene.traverse(object => {
      if (!(object instanceof Mesh)) return;
      meshNames.push(object.name);
      if (object.name !== 'skin') available.add(structureForMesh(object.name));
    });

    expect(available).toEqual(new Set(['skeleton', 'skull', 'spine', 'heart', 'lungs', 'brain', 'liver', 'stomach', 'kidneys', 'intestines']));
    expect(new Set(meshNames)).toEqual(new Set(manifest.structures.flatMap(entry => entry.meshes)));
    for (const id of available) {
      expect(anatomy.find(entry => entry.id === id), `Fiche scientifique absente : ${id}`).toBeDefined();
      const result = boundsForStructure(gltf.scene, id)!;
      expect(result, `Géométrie absente : ${id}`).not.toBeNull();
      expect(result.radius).toBeGreaterThan(0);
      expect(result.radius).toBeLessThan(1.5);
      for (const coordinate of [...result.bounds.min.toArray(), ...result.bounds.max.toArray()]) {
        expect(Number.isFinite(coordinate)).toBe(true);
      }
      expect(framingDistance(result.radius, 36, 9 / 16)).toBeGreaterThan(result.radius);
    }

    const full = boundsForStructure(gltf.scene)!;
    const dimensions = full.bounds.getSize(new Vector3());
    expect(dimensions.y).toBeCloseTo(1.8, 2);
    expect(full.center.y).toBeCloseTo(0, 2);
    expect(dimensions.y).toBeGreaterThan(dimensions.x);
    expect(dimensions.y).toBeGreaterThan(dimensions.z);
    gltf.scene.traverse(object => {
      if (object instanceof Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => material.dispose());
      }
    });
  });
});
