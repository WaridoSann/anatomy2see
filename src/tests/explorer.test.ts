import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { useExplorer } from '../state/explorer';
import { adaptManifest, organStructures } from '../data/catalog';
import { parseRoute, routeHash } from '../utils/navigation';
const manifest=JSON.parse(readFileSync(new URL('../../public/models/muscles-manifest.json',import.meta.url),'utf8'));
const muscles=adaptManifest(manifest,'muscles');
const muscle=muscles[0];
beforeEach(()=>{useExplorer.setState(useExplorer.getInitialState(),true);useExplorer.getState().setCatalog([...muscles,...organStructures]);});
const state=()=>useExplorer.getState();
describe('parcours progressif et sélection',()=>{
 it('sélectionne un vrai élément musculaire et demande son cadrage',()=>{state().select(muscle.id);expect(state().selectedId).toBe(muscle.id);expect(state().layer).toBe('muscles');expect(state().cameraRequest).toMatchObject({type:'focus',id:muscle.id});});
 it('ignore un identifiant absent du modèle',()=>{state().select('invented-muscle');expect(state().selectedId).toBeNull();});
 it('isole puis revient au corps en conservant le chapitre musculaire',()=>{state().select(muscle.id);state().isolate();expect(state().isolated).toBe(true);state().setTransparent();state().reset();expect(state()).toMatchObject({layer:'muscles',selectedId:null,isolated:false,transparent:false});});
 it('ouvre la bonne couche depuis une fiche d’organe',()=>{state().setLoaded([muscle.id],'muscles');state().select('heart');expect(state()).toMatchObject({layer:'organs',selectedId:'heart',loaded:false,isolated:false});});
 it('un changement de chapitre ferme la fiche et réinitialise le cadrage et la recherche',()=>{state().select(muscle.id);state().isolate();state().setQuery('biceps');state().setLayer('bones');expect(state()).toMatchObject({layer:'bones',selectedId:null,isolated:false,query:'',loaded:false,availableIds:[]});expect(state().cameraRequest.type).toBe('reset');});
 it('ignore le résultat tardif du modèle d’une couche quittée',()=>{state().setLayer('bones');state().setLoaded([muscle.id],'muscles');expect(state().loaded).toBe(false);expect(state().availableIds).toEqual([]);state().setError('ancienne erreur','muscles');expect(state().error).toBeNull();});
 it('conserve la dernière sélection et interrompt l’isolation précédente',()=>{state().select(muscle.id);state().isolate();state().select('lungs');state().select('heart');expect(state()).toMatchObject({selectedId:'heart',isolated:false,layer:'organs'});expect(state().cameraRequest).toMatchObject({type:'focus',id:'heart'});});
 it('numérote les requêtes de caméra et résout une erreur après rechargement',()=>{const n=state().cameraRequest.sequence;state().select(muscle.id);state().zoom(1);state().view('back');state().reset();expect(state().cameraRequest.sequence).toBe(n+4);state().setError('échec');state().setLoaded([muscle.id],'muscles');expect(state()).toMatchObject({loaded:true,error:null});});
 it('ne lance pas une isolation sans structure sélectionnée',()=>{state().isolate();expect(state().isolated).toBe(false);});
});
describe('pages et compatibilité GitHub Pages',()=>{
 it('encode les vues en fragments et conserve le chapitre dans une URL directe',()=>{expect(routeHash('explorer','muscles')).toBe('#/explorer/muscles');expect(parseRoute('#/explorer/nerves')).toEqual({page:'explorer',layer:'nerves'});expect(parseRoute('#/library')).toEqual({page:'library',layer:'muscles'});expect(parseRoute('#/unknown/script')).toEqual({page:'home',layer:'muscles'});});
});
