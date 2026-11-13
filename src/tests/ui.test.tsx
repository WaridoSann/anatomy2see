// @vitest-environment jsdom
import { afterEach,describe,it,expect } from 'vitest';
import { useState } from 'react';
import { cleanup,render,screen,within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AtlasUI from '../components/AtlasUI';
import { adaptManifest,organStructures } from '../data/catalog';
import type { AtlasPage,LayerId } from '../types/atlas';
import { readFileSync } from 'node:fs';
const muscles=adaptManifest(JSON.parse(readFileSync('public/models/muscles-manifest.json','utf8')),'muscles');
const structures=[...muscles,...organStructures];
function Harness({initialPage='home'}:{initialPage?:AtlasPage}){
 const [page,setPage]=useState<AtlasPage>(initialPage),[layer,setLayer]=useState<LayerId>('muscles'),[query,setQuery]=useState(''),[selectedId,setSelected]=useState<string|null>(null),[isolated,setIsolated]=useState(false);
 if(page==='journey')return <div>Voyage d’introduction</div>;
 return <AtlasUI page={page} layer={layer} structures={structures} selected={structures.find(x=>x.id===selectedId)??null} illustrations={[]} counts={{muscles:398,organs:7,bones:238,nerves:80}} loaded error={null} isolated={isolated} transparent={false} quality="high" query={query} onNavigate={setPage} onStart={()=>setPage('journey')} onLayer={l=>{setLayer(l);setPage('explorer');}} onSelect={id=>{setSelected(id);setLayer(structures.find(x=>x.id===id)!.layer);setPage('explorer');}} onReset={()=>setSelected(null)} onIsolate={()=>setIsolated(!isolated)} onTransparent={()=>{}} onQuality={()=>{}} onQuery={setQuery} onZoom={()=>{}} onView={()=>{}} onBack={()=>setSelected(null)}/>;
}
afterEach(cleanup);
describe('interface progressive',()=>{
 it('présente l’accueil et déclenche le voyage seulement avec Commencer',async()=>{const u=userEvent.setup();render(<Harness/>);expect(screen.getByRole('heading',{level:1}).textContent).toContain('extraordinaire');expect(screen.queryByLabelText('Commandes du modèle')).toBeNull();await u.click(screen.getByRole('button',{name:/Commencer l’exploration/}));expect(screen.getByText('Voyage d’introduction')).toBeTruthy();});
 it('ouvre un seul chapitre et garde la liste des structures repliée',async()=>{const u=userEvent.setup();render(<Harness initialPage="chapters"/>);await u.click(screen.getByTestId('chapter-muscles'));expect(screen.getByTestId('layer-muscles').getAttribute('aria-pressed')).toBe('true');expect(screen.queryByRole('dialog',{name:'Structures anatomiques'})).toBeNull();expect(screen.queryByLabelText('Fiche anatomique')).toBeNull();});
 it('la recherche conserve le focus sur chaque lettre et ouvre une fiche',async()=>{const u=userEvent.setup();render(<Harness initialPage="explorer"/>);await u.click(screen.getByTestId('open-structures'));const input=screen.getByRole('searchbox',{name:'Rechercher une structure'});await u.type(input,'biceps');expect(document.activeElement).toBe(input);expect((input as HTMLInputElement).value).toBe('biceps');const list=screen.getByLabelText('Liste des structures');const choices=within(list).getAllByRole('button');expect(choices.length).toBeGreaterThan(1);await u.click(choices[0]);expect(screen.getByLabelText('Fiche anatomique')).toBeTruthy();expect(screen.queryByRole('dialog',{name:'Structures anatomiques'})).toBeNull();await u.click(screen.getByTestId('isolate-selection'));expect(screen.getByRole('button',{name:'Revoir les autres structures'})).toBeTruthy();await u.click(screen.getByRole('button',{name:'Fermer la fiche'}));expect(screen.queryByLabelText('Fiche anatomique')).toBeNull();});
 it('trouve le cœur avec une recherche sans ligature depuis les fiches',async()=>{const u=userEvent.setup();render(<Harness initialPage="library"/>);await u.click(screen.getByRole('button',{name:/Les organes/}));await u.type(screen.getByRole('searchbox',{name:'Rechercher une structure'}),'coeur');expect(screen.getByTestId('library-heart')).toBeTruthy();expect(screen.queryByTestId('library-lungs')).toBeNull();await u.click(screen.getByTestId('library-heart'));expect(within(screen.getByLabelText('Fiche anatomique')).getByRole('heading',{name:'Cœur'})).toBeTruthy();});
});
