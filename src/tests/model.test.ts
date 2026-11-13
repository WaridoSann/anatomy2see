import { describe, expect, it } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { boundsForStructure, framingBoxDistance, framingDistance, structureForMesh } from '../scene/model';

function cube(name: string, x: number, y = 0, z = 0) {
  const mesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
  mesh.name = name;
  mesh.position.set(x, y, z);
  return mesh;
}

describe('cadrage basé sur la géométrie', () => {
  it('regroupe les deux poumons et calcule leurs limites dans le repère mondial', () => {
    const body = new Group();
    body.position.set(0, 2, 0);
    body.add(cube('lung-left', -1), cube('lung-right', 1), cube('heart', 5));
    const result = boundsForStructure(body, 'lungs')!;
    expect(result.center.toArray()).toEqual([0, 2, 0]);
    expect(result.bounds.min.toArray()).toEqual([-1.5, 1.5, -0.5]);
    expect(result.bounds.max.toArray()).toEqual([1.5, 2.5, 0.5]);
    expect(result.radius).toBeCloseTo(Math.sqrt(11) / 2);
  });

  it('exclut la peau du cadrage général et refuse une structure absente', () => {
    const body = new Group();
    body.add(cube('heart', 0), cube('skin', 100));
    expect(boundsForStructure(body)!.bounds.max.x).toBe(0.5);
    expect(boundsForStructure(body, 'brain')).toBeNull();
    expect(boundsForStructure(new Group())).toBeNull();
  });

  it('préserve une distance minimale pour une géométrie ponctuelle', () => {
    const body = new Group();
    const point = cube('heart', 0);
    point.scale.set(0, 0, 0);
    body.add(point);
    expect(boundsForStructure(body, 'heart')!.radius).toBe(0.025);
  });

  it('recule davantage sur un écran étroit et proportionnellement à la taille', () => {
    const landscape = framingDistance(1, 36, 16 / 9);
    const portrait = framingDistance(1, 36, 9 / 16);
    expect(portrait).toBeGreaterThan(landscape);
    expect(framingDistance(2, 36, 16 / 9)).toBeCloseTo(landscape * 2);
    expect(landscape).toBeGreaterThan(1 / Math.sin(18 * Math.PI / 180));
  });

  it('cadre un corps étroit en portrait sans le recul excessif de la sphère', () => {
    const size = new Vector3(0.5, 1.8, 0.3);
    const portrait = framingBoxDistance(size, 36, 9 / 16);
    const landscape = framingBoxDistance(size, 36, 16 / 9);
    const sphere = framingDistance(size.length() / 2, 36, 9 / 16);
    expect(portrait).toBeCloseTo(landscape);
    expect(portrait).toBeLessThan(sphere * 0.7);
    expect(portrait).toBeGreaterThan(1.8 / (2 * Math.tan(18 * Math.PI / 180)));
  });

  it('permute largeur et profondeur pour le cadrage latéral', () => {
    const size = new Vector3(2, 1, 0.3);
    const tangent = Math.tan(18 * Math.PI / 180);
    const front = framingBoxDistance(size, 36, 1);
    const side = framingBoxDistance(size, 36, 1, true);
    expect(front).toBeCloseTo(2 / (2 * tangent) * 1.16 + 0.3 / 2);
    expect(side).toBeCloseTo(1 / (2 * tangent) * 1.16 + 2 / 2);
    expect(side).toBeLessThan(front);
  });

  it('associe les meshes bilatéraux à leur fiche commune', () => {
    expect(structureForMesh('lung-left')).toBe('lungs');
    expect(structureForMesh('lung-right')).toBe('lungs');
    expect(structureForMesh('kidney-left')).toBe('kidneys');
    expect(structureForMesh('kidney-right')).toBe('kidneys');
    expect(structureForMesh('heart')).toBe('heart');
  });
});
