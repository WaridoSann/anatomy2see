import { Component, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ArrowRight } from 'lucide-react';
import { BackSide, CatmullRomCurve3, Color, DynamicDrawUsage, FogExp2, Group, InstancedMesh, LatheGeometry, Mesh, Object3D, PointLight, TubeGeometry, Vector2, Vector3 } from 'three';
import styles from './BodyJourney.module.css';

export interface BodyJourneyProps { onComplete: () => void; onSkip: () => void }

const DURATION = 10_400;
const path = new CatmullRomCurve3([
  new Vector3(0, 0, 0), new Vector3(1.4, 0.6, -12),
  new Vector3(-1.8, -0.6, -27), new Vector3(1.2, 0.4, -43),
  new Vector3(-0.8, 1, -59), new Vector3(1.8, 0, -78),
]);
const captions = [
  { at: 0, title: 'Il y a tout un monde en vous.', detail: 'Pour le découvrir, changeons d’échelle.' },
  { at: 0.29, title: 'Un voyage au fil du sang.', detail: 'Les globules rouges transportent l’oxygène dans le corps.' },
  { at: 0.61, title: 'Chaque structure a son rôle.', detail: 'Muscles, organes, os et nerfs travaillent ensemble.' },
  { at: 0.79, title: 'Un geste. Tout un corps en action.', detail: 'À vous de découvrir les structures qui le rendent possible.' },
];

function makeCellGeometry() {
  // A closed profile with a thinner centre and thicker rim: an illustrative
  // biconcave disc rather than a sphere. Dimensions are artistic, not a scale model.
  const points = [
    [0, 0.045], [0.12, 0.05], [0.25, 0.095], [0.38, 0.155],
    [0.47, 0.13], [0.52, 0.065], [0.53, 0],
    [0.52, -0.065], [0.47, -0.13], [0.38, -0.155],
    [0.25, -0.095], [0.12, -0.05], [0, -0.045],
  ].map(([x, y]) => new Vector2(x, y));
  const geometry = new LatheGeometry(points, 36);
  geometry.computeVertexNormals();
  return geometry;
}

function Vessel({ progress }: { progress: React.RefObject<number> }) {
  const cells = useRef<InstancedMesh>(null);
  const hero = useRef<Group>(null);
  const leadingLight = useRef<PointLight>(null);
  const softLight = useRef<PointLight>(null);
  const wall = useRef<Mesh>(null);
  const cellGeometry = useMemo(makeCellGeometry, []);
  const tubeGeometry = useMemo(() => {
    const geometry = new TubeGeometry(path, 220, 3.25, 48, false);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const section = Math.floor(i / 49) / 220;
      const angle = (i % 49) / 48 * Math.PI * 2;
      const centre = path.getPointAt(section);
      const point = new Vector3().fromBufferAttribute(positions, i);
      const irregularity = 1 + Math.sin(section * 92) * 0.025 + Math.sin(angle * 7 + section * 37) * 0.016;
      point.sub(centre).multiplyScalar(irregularity).add(centre);
      positions.setXYZ(i, point.x, point.y, point.z);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  const cellData = useMemo(() => Array.from({ length: 86 }, (_, index) => {
    const seed = ((index * 16807 + 47) % 2147483647) / 2147483647;
    const angle = index * 2.399963;
    return { offset: (index + 1) / 88, angle, radius: 0.75 + ((index * 37) % 100) / 100 * 1.6, size: 0.48 + (index % 7) * 0.067, wobble: seed * Math.PI * 2 };
  }), []);
  const frame = useMemo(() => ({ object: new Object3D(), target: new Vector3(), normal: new Vector3(), binormal: new Vector3(), up: new Vector3(0, 1, 0) }), []);
  useEffect(() => {
    cells.current?.instanceMatrix.setUsage(DynamicDrawUsage);
    return () => { cellGeometry.dispose(); tubeGeometry.dispose(); };
  }, [cellGeometry, tubeGeometry]);
  useFrame(({ camera, clock, scene }) => {
    const value = progress.current;
    const t = 0.045 + Math.min(value, 0.94) * 0.77;
    const point = path.getPointAt(t);
    const tangent = path.getTangentAt(t);
    frame.normal.crossVectors(tangent, frame.up).normalize();
    frame.binormal.crossVectors(frame.normal, tangent).normalize();
    camera.position.copy(point).addScaledVector(frame.binormal, 0.16 + Math.sin(value * 4) * 0.09);
    frame.target.copy(path.getPointAt(Math.min(t + 0.065, 0.99)));
    camera.lookAt(frame.target);
    leadingLight.current?.position.copy(path.getPointAt(Math.min(t + 0.055, 0.99))).addScaledVector(frame.binormal, 1.2);
    softLight.current?.position.copy(point).addScaledVector(frame.normal, -1);
    if (!scene.fog) scene.fog = new FogExp2('#3e1016', 0.075);
    cellData.forEach((cell, index) => {
      const flow = (cell.offset + clock.elapsedTime * 0.007) % 0.985;
      const centre = path.getPointAt(flow);
      const direction = path.getTangentAt(flow);
      frame.normal.crossVectors(direction, frame.up).normalize();
      frame.binormal.crossVectors(frame.normal, direction).normalize();
      frame.object.position.copy(centre)
        .addScaledVector(frame.normal, Math.cos(cell.angle + clock.elapsedTime * 0.07) * cell.radius)
        .addScaledVector(frame.binormal, Math.sin(cell.angle + clock.elapsedTime * 0.07) * cell.radius);
      frame.object.rotation.set(cell.angle + clock.elapsedTime * 0.19, cell.wobble + clock.elapsedTime * 0.13, index * 0.63);
      frame.object.scale.setScalar(cell.size);
      frame.object.updateMatrix();
      cells.current?.setMatrixAt(index, frame.object.matrix);
    });
    if (cells.current) cells.current.instanceMatrix.needsUpdate = true;
    if (hero.current) {
      const heroT = Math.min(t + 0.038, 0.99);
      const centre = path.getPointAt(heroT);
      const direction = path.getTangentAt(heroT);
      frame.normal.crossVectors(direction, frame.up).normalize();
      frame.binormal.crossVectors(frame.normal, direction).normalize();
      hero.current.position.copy(centre).addScaledVector(frame.normal, -0.75).addScaledVector(frame.binormal, -0.5);
      hero.current.rotation.set(0.65 + Math.sin(value * 8) * 0.2, clock.elapsedTime * 0.18, 0.3);
    }
    if (wall.current) {
      const material = wall.current.material;
      if (!Array.isArray(material) && 'emissiveIntensity' in material) material.emissiveIntensity = 0.22 + Math.sin(value * 45) * 0.025;
    }
  });
  return <>
    <color attach="background" args={['#48131b']} />
    <ambientLight intensity={0.7} color="#d06d68" />
    <pointLight ref={leadingLight} intensity={75} distance={23} decay={2} color="#ffc1a2" />
    <pointLight ref={softLight} intensity={28} distance={12} decay={2} color="#f26955" />
    <mesh ref={wall} geometry={tubeGeometry}>
      <meshStandardMaterial color="#9c353b" side={BackSide} roughness={0.72} metalness={0.04} emissive={new Color('#5e151d')} emissiveIntensity={0.22} />
    </mesh>
    <instancedMesh ref={cells} args={[cellGeometry, undefined, cellData.length]} frustumCulled={false}>
      <meshStandardMaterial color="#bf2937" roughness={0.4} metalness={0.06} />
    </instancedMesh>
    <group ref={hero}><mesh geometry={cellGeometry} scale={1.15}><meshPhysicalMaterial color="#d74242" roughness={0.38} clearcoat={0.16} metalness={0.03} /></mesh></group>
  </>;
}

class JourneyBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StillJourney /> : this.props.children; }
}

function StillJourney() {
  return <div className={styles.still} aria-hidden="true"><span /><span /><span /><span /><span /></div>;
}

export default function BodyJourney({ onComplete, onSkip }: BodyJourneyProps) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [reducedMotion] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const completeRef = useRef(onComplete);
  const skipRef = useRef(onSkip);
  useEffect(() => { completeRef.current = onComplete; skipRef.current = onSkip; }, [onComplete, onSkip]);
  useEffect(() => {
    let request = 0;
    let finished = false;
    let lastDisplay = 0;
    const start = performance.now();
    const duration = reducedMotion ? 1800 : DURATION;
    const tick = (time: number) => {
      const value = Math.min(1, (time - start) / duration);
      progressRef.current = value;
      if (time - lastDisplay > 40 || value === 1) { setProgress(value); lastDisplay = time; }
      if (value < 1) request = requestAnimationFrame(tick);
      else if (!finished) { finished = true; completeRef.current(); }
    };
    request = requestAnimationFrame(tick);
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') skipRef.current(); };
    window.addEventListener('keydown', escape);
    return () => { finished = true; cancelAnimationFrame(request); window.removeEventListener('keydown', escape); };
  }, [reducedMotion]);
  const caption = reducedMotion ? captions[0] : [...captions].reverse().find(item => progress >= item.at) ?? captions[0];
  const exitOpacity = Math.max(0, (progress - 0.94) / 0.06);
  return <section className={`${styles.journey} ${progress>0.8?styles.hasArrived:''}`} aria-label="Voyage d’introduction dans le corps humain">
    {reducedMotion ? <StillJourney /> : <JourneyBoundary><Canvas dpr={[1, 1.5]} camera={{ fov: 66, near: 0.04, far: 95 }} gl={{ antialias: true, powerPreference: 'high-performance' }} fallback={<StillJourney />}><Vessel progress={progressRef} /></Canvas></JourneyBoundary>}
    <div className={styles.vignette} />
    <div className={styles.arrival} style={{opacity:Math.max(0,Math.min(1,(progress-0.71)/0.1))}} aria-hidden="true"><svg viewBox="0 0 500 440" fill="none"><g stroke="#c8b78b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M171 153c-45-5-61-35-52-76 7-36 53-52 80-30 13 10 21 29 21 45l18 19-18 8-3 28-30 7v37l-16 9-18-13v-31"/><path d="M151 180c-33 4-52 28-54 58l-10 162m100-211c31 4 53 24 56 56l12 153M96 244l67 79 63-66m-120 8 54 87 88-63 22-99m-19 64 16-64 32-14m-27 16 18-4"/><path d="m268 100 37-4-2 62-28 3-7-61m6 22 27-3m-9-24-2-20"/><path d="M140 242h64m-60 16h52m-48 17h43m-44 19h43" stroke="#dfd3b6"/></g><path d="m274 124 26-3-1 34-19 2Z" fill="#f0d77b" fillOpacity=".5"/><circle cx="344" cy="65" r="5" fill="#efd46a"/><circle cx="82" cy="173" r="3" fill="#efd46a"/></svg><span>Une gorgée d’eau.<br/>Des muscles, des organes, un mouvement.</span></div>
    <div className={styles.top}><a className={styles.brand} href={import.meta.env.BASE_URL}>anatomy<span>2</span>see</a><button className={styles.skip} onClick={onSkip}>Passer le voyage <ArrowRight size={17} /></button></div>
    <div className={styles.caption} key={caption.title}><p>Voyage illustré dans le corps</p><h1>{caption.title}</h1><span>{caption.detail}</span></div>
    <div className={styles.bottom}><span>Changement d’échelle</span><div role="progressbar" aria-label="Progression du voyage" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><i style={{ transform: `scaleX(${progress})` }} /></div><small>{reducedMotion ? 'Animation réduite' : 'Une introduction artistique · pas une simulation médicale'}</small></div>
    <div className={styles.exit} style={{ opacity: exitOpacity }} />
  </section>;
}
