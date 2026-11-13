import type { SystemId } from '../data/anatomy';
export type LayerId = 'muscles' | 'organs' | 'bones' | 'nerves';
export type AtlasPage = 'home' | 'journey' | 'chapters' | 'explorer' | 'library' | 'about';
export type RegionId = 'head' | 'neck' | 'torso' | 'arm' | 'leg';
export interface AtlasStructure {
 id:string; name:string; englishName?:string; latin:string; layer:LayerId; system:SystemId; region:RegionId;
 location:string; function:string; description:string; relations:string[]; facts:string[];
 source:{label:string;url:string}; color:string; meshNames:string[]; imageKey?:string; sourceIds?:string[]; searchTerms?:string[];
}
export interface AtlasIllustration { key:string; title:string; src:string; caption:string; credit:string; license:string; sourceUrl:string }
export interface LayerDefinition { id:LayerId; title:string; subtitle:string; description:string; color:string; number:string }
export const atlasLayers:LayerDefinition[] = [
 {id:'muscles',title:'Les muscles',subtitle:'Le corps en mouvement',description:'Des muscles du visage à ceux des pieds, explorez les structures qui nous mettent en mouvement.',color:'#cf6c55',number:'01'},
 {id:'organs',title:'Les organes',subtitle:'Les fonctions du vivant',description:'Cœur, poumons, foie… Approchez les organes et découvrez leur rôle dans votre corps.',color:'#bf6a6f',number:'02'},
 {id:'bones',title:'Le squelette',subtitle:'Une architecture intérieure',description:'Découvrez les os, leurs formes et la structure qui soutient le corps.',color:'#ac9160',number:'03'},
 {id:'nerves',title:'Le système nerveux',subtitle:'Recevoir, transmettre, coordonner',description:'Observez l’encéphale et les nerfs crâniens disponibles dans ce modèle.',color:'#c29b39',number:'04'}
];
export const regions:Record<RegionId,string> = {head:'Tête',neck:'Cou',torso:'Tronc',arm:'Membres supérieurs',leg:'Membres inférieurs'};
