import { lazy, Suspense, useEffect, useState } from 'react';
import AtlasUI from './components/AtlasUI';
import { loadCatalog, loadIllustrations, organStructures } from './data/catalog';
import type { AtlasIllustration, AtlasPage, LayerId } from './types/atlas';
import { useExplorer } from './state/explorer';
import { parseRoute, routeHash } from './utils/navigation';
const Scene=lazy(()=>import('./scene/Scene'));
const BodyJourney=lazy(()=>import('./components/BodyJourney'));
export default function App(){
 const initial=parseRoute(window.location.hash);
 const [page,setPage]=useState<AtlasPage>(initial.page);
 const [illustrations,setIllustrations]=useState<AtlasIllustration[]>([]);
 const [catalogError,setCatalogError]=useState<string|null>(null);
 const s=useExplorer();
 useEffect(()=>{let active=true;useExplorer.getState().setLayer(initial.layer);useExplorer.getState().setCatalog(organStructures);loadCatalog().then(c=>{if(active)useExplorer.getState().setCatalog(c);}).catch(e=>{if(active)setCatalogError(e.message);});loadIllustrations().then(v=>{if(active)setIllustrations(v);}).catch(()=>{});return()=>{active=false;};},[]);
 useEffect(()=>{const changed=()=>{const r=parseRoute(window.location.hash);setPage(r.page);if(r.page==='explorer'&&useExplorer.getState().layer!==r.layer)useExplorer.getState().setLayer(r.layer);};window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);},[]);
 const navigate=(p:AtlasPage,layer=s.layer)=>{setPage(p);const hash=routeHash(p,layer);if(window.location.hash!==hash)window.location.hash=hash;window.scrollTo({top:0,behavior:'instant'});};
 const chooseLayer=(layer:LayerId)=>{if(layer!==s.layer||page!=='explorer')s.setLayer(layer);navigate('explorer',layer);};
 const select=(id:string)=>{const item=s.catalog.find(x=>x.id===id);if(!item)return;s.select(id);navigate('explorer',item.layer);};
 const counts={muscles:0,organs:0,bones:0,nerves:0};s.catalog.forEach(e=>counts[e.layer]++);
 const selected=s.catalog.find(e=>e.id===s.selectedId)??null;
 const complete=()=>{useExplorer.getState().setLayer('bones');setPage('explorer');window.history.replaceState(null,'',routeHash('explorer','bones'));window.scrollTo({top:0,behavior:'instant'});};
 const start=()=>{void import('./scene/Scene').then(m=>m.preloadLayer('bones')).catch(()=>{});navigate('journey');};
 return <div className={`atlas-app page-${page}${selected&&page==='explorer'?' has-selection':''}`}>
  {page==='journey'?<Suspense fallback={<div className="route-loading">Votre voyage se prépare…</div>}><BodyJourney onComplete={complete} onSkip={complete}/></Suspense>:<>
   {page==='explorer'&&<Suspense fallback={<div className="anatomy-stage route-loading">La salle se prépare…</div>}><Scene/></Suspense>}
   <AtlasUI page={page} layer={s.layer} structures={s.catalog} selected={selected} illustrations={illustrations} counts={counts} loaded={s.loaded} error={catalogError??s.error} isolated={s.isolated} transparent={s.transparent} quality={s.quality} query={s.query} onNavigate={navigate} onStart={start} onLayer={chooseLayer} onSelect={select} onReset={s.reset} onIsolate={s.isolate} onTransparent={s.setTransparent} onQuality={s.setQuality} onQuery={s.setQuery} onZoom={s.zoom} onView={s.view} onBack={s.reset}/>
   {catalogError&&page!=='explorer'&&<div className="catalog-error" role="alert">{catalogError} <button onClick={()=>window.location.reload()}>Réessayer</button></div>}
  </>}
 </div>;
}
