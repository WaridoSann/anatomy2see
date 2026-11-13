import { create } from 'zustand';
import type { AtlasStructure, LayerId } from '../types/atlas';
export type Quality = 'low' | 'medium' | 'high' | 'ultra';
export type View = 'front' | 'back' | 'side';
interface ExplorerState {
 layer:LayerId; catalog:AtlasStructure[]; selectedId:string|null; isolated:boolean; transparent:boolean;
 query:string; quality:Quality; loaded:boolean; error:string|null; availableIds:string[];
 cameraRequest:{type:'reset'|'focus'|'zoom'|'view';id?:string;value?:number;view?:View;sequence:number};
 setCatalog:(catalog:AtlasStructure[])=>void; setLayer:(layer:LayerId)=>void; select:(id:string)=>void;
 reset:()=>void; isolate:()=>void; setTransparent:()=>void; setQuery:(query:string)=>void; setQuality:(quality:Quality)=>void;
 zoom:(value:number)=>void; view:(view:View)=>void; setLoaded:(ids:string[],layer:LayerId)=>void; setError:(error:string,layer?:LayerId)=>void;
}
export const useExplorer=create<ExplorerState>((set)=>({
 layer:'muscles',catalog:[],selectedId:null,isolated:false,transparent:false,query:'',quality:typeof window!=='undefined'&&window.innerWidth<650?'medium':'high',loaded:false,error:null,availableIds:[],
 cameraRequest:{type:'reset',sequence:0},
 setCatalog:catalog=>set({catalog}),
 setLayer:layer=>set(s=>({layer,selectedId:null,isolated:false,transparent:false,loaded:false,error:null,availableIds:[],query:'',cameraRequest:{type:'reset',sequence:s.cameraRequest.sequence+1}})),
 select:id=>set(s=>{const entry=s.catalog.find(x=>x.id===id);if(!entry)return {};return {selectedId:id,layer:entry.layer,isolated:false,...(entry.layer!==s.layer?{loaded:false,error:null,availableIds:[]}:{}),cameraRequest:{type:'focus',id,sequence:s.cameraRequest.sequence+1}};}),
 reset:()=>set(s=>({selectedId:null,isolated:false,transparent:false,cameraRequest:{type:'reset',sequence:s.cameraRequest.sequence+1}})),
 isolate:()=>set(s=>s.selectedId?{isolated:!s.isolated,cameraRequest:{type:'focus',id:s.selectedId,sequence:s.cameraRequest.sequence+1}}:{}),
 setTransparent:()=>set(s=>({transparent:!s.transparent})),setQuery:query=>set({query}),setQuality:quality=>set({quality}),
 zoom:value=>set(s=>({cameraRequest:{type:'zoom',value,sequence:s.cameraRequest.sequence+1}})),
 view:view=>set(s=>({cameraRequest:{type:'view',view,sequence:s.cameraRequest.sequence+1}})),
 setLoaded:(availableIds,layer)=>set(s=>s.layer===layer?{loaded:true,error:null,availableIds}:{}),
 setError:(error,layer)=>set(s=>!layer||s.layer===layer?{error,loaded:false}:{})
}));
