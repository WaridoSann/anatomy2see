import { create } from 'zustand';
import { anatomy } from '../data/anatomy';
import type { SystemId } from '../data/anatomy';
export type Quality = 'low' | 'medium' | 'high' | 'ultra';
export type View = 'front' | 'back' | 'side';
interface ExplorerState {
 selectedId:string|null; activeSystems:SystemId[]; hiddenIds:string[]; isolated:boolean; transparent:boolean;
 query:string; quality:Quality; labels:boolean; loaded:boolean; error:string|null; availableIds:string[];
 cameraRequest:{type:'reset'|'focus'|'zoom'|'view';id?:string;value?:number;view?:View;sequence:number};
 select:(id:string)=>void; toggleSystem:(id:SystemId)=>void; reset:()=>void; isolate:()=>void; hide:()=>void;
 setTransparent:()=>void; setQuery:(query:string)=>void; setQuality:(quality:Quality)=>void; toggleLabels:()=>void;
 zoom:(value:number)=>void; view:(view:View)=>void; setLoaded:(ids:string[])=>void; setError:(error:string)=>void;
}
const initialSystems:SystemId[]=['skeletal','nervous','cardiovascular','respiratory','digestive','urinary'];
export const useExplorer=create<ExplorerState>((set)=>({
 selectedId:null,activeSystems:initialSystems,hiddenIds:[],isolated:false,transparent:false,query:'',quality:'high',labels:false,loaded:false,error:null,availableIds:[],
 cameraRequest:{type:'reset',sequence:0},
 select:(id)=>set(s=>({selectedId:id,isolated:false,hiddenIds:s.hiddenIds.filter(x=>x!==id),cameraRequest:{type:'focus',id,sequence:s.cameraRequest.sequence+1}})),
 toggleSystem:(id)=>set(s=>({activeSystems:s.activeSystems.includes(id)?s.activeSystems.filter(x=>x!==id):[...s.activeSystems,id],selectedId:s.activeSystems.includes(id)&&anatomy.find(x=>x.id===s.selectedId)?.system===id?null:s.selectedId,isolated:false})),
 reset:()=>set(s=>({selectedId:null,isolated:false,hiddenIds:[],activeSystems:initialSystems,transparent:false,cameraRequest:{type:'reset',sequence:s.cameraRequest.sequence+1}})),
 isolate:()=>set(s=>({isolated:!s.isolated,cameraRequest:{type:'focus',id:s.selectedId??undefined,sequence:s.cameraRequest.sequence+1}})),
 hide:()=>set(s=>({hiddenIds:s.selectedId?[...s.hiddenIds,s.selectedId]:s.hiddenIds,selectedId:null,isolated:false,cameraRequest:{type:'reset',sequence:s.cameraRequest.sequence+1}})),
 setTransparent:()=>set(s=>({transparent:!s.transparent})),setQuery:query=>set({query}),setQuality:quality=>set({quality}),toggleLabels:()=>set(s=>({labels:!s.labels})),
 zoom:value=>set(s=>({cameraRequest:{type:'zoom',value,sequence:s.cameraRequest.sequence+1}})),
 view:view=>set(s=>({cameraRequest:{type:'view',view,sequence:s.cameraRequest.sequence+1}})),
 setLoaded:availableIds=>set({loaded:true,error:null,availableIds}),setError:error=>set({error,loaded:false})
}));
