import { useEffect, useState } from 'react';
import Scene from './scene/Scene';
import { structureForMesh } from './scene/model';
import ExplorerUI from './components/ExplorerUI';
import { anatomy } from './data/anatomy';
import { useExplorer } from './state/explorer';
export default function App(){
 const s=useExplorer();
 const [manifestIds,setManifestIds]=useState<string[]>([]);
 useEffect(()=>{fetch(`${import.meta.env.BASE_URL}models/manifest.json`).then(r=>{if(!r.ok)throw Error('manifest');return r.json();}).then(data=>setManifestIds([...new Set<string>(data.structures.map((x:{id:string})=>structureForMesh(x.id)))].filter(id=>anatomy.some(x=>x.id===id)))).catch(()=>{});},[]);
 const select=(id:string)=>{const entry=anatomy.find(x=>x.id===id);if(entry&&!s.activeSystems.includes(entry.system))s.toggleSystem(entry.system);s.select(id);};
 return <main className="app-shell"><Scene/><ExplorerUI structures={anatomy} availableIds={s.availableIds.length?s.availableIds:manifestIds} selectedId={s.selectedId} activeSystems={s.activeSystems} hiddenIds={s.hiddenIds} isolated={s.isolated} transparent={s.transparent} query={s.query} quality={s.quality} labels={s.labels} loaded={s.loaded} error={s.error} onSelect={select} onToggleSystem={s.toggleSystem} onReset={s.reset} onIsolate={s.isolate} onHide={s.hide} onTransparent={s.setTransparent} onQuery={s.setQuery} onQuality={s.setQuality} onLabels={s.toggleLabels} onZoom={s.zoom} onView={s.view}/></main>;
}
