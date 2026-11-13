import { anatomy } from './anatomy';
import { regions, type AtlasIllustration, type AtlasStructure, type LayerId, type RegionId } from '../types/atlas';
export const modelPaths:Record<LayerId,string>={muscles:'muscles.glb',organs:'anatomy.glb',bones:'skeletal.glb',nerves:'nervous.glb'};
export interface ManifestEntry {id:string;name:string;englishName?:string;originalName?:string;latin?:string;system?:string;region:RegionId;meshNames:string[];sourceIds:string[];function?:string;description?:string}
export interface AnatomyManifest {structures:ManifestEntry[];source:string;license:string;limitations?:string}
const regionSentences:Record<RegionId,string>={head:'La tête abrite les organes des sens et de nombreuses petites structures spécialisées.',neck:'Le cou relie la tête au tronc et associe mobilité, maintien et passage de structures vitales.',torso:'Le tronc réunit le thorax, l’abdomen, le dos et le bassin.',arm:'Les membres supérieurs associent l’épaule, le bras, l’avant-bras et la main.',leg:'Les membres inférieurs assurent notamment l’appui et le déplacement du corps.'};
const muscleFunctions:[RegExp,string][]=[
 [/biceps brachii/,'Le biceps brachial participe à la flexion du coude et à la supination de l’avant-bras.'],
 [/triceps brachii/,'Le triceps brachial est le principal extenseur du coude.'],
 [/deltoid/,'Le deltoïde mobilise le bras à l’épaule. Ses différents faisceaux participent à l’élévation et à l’orientation du bras.'],
 [/pectoralis major/,'Le grand pectoral participe notamment à l’adduction et à la rotation médiale du bras.'],
 [/trapezius/,'Le trapèze participe au positionnement et aux mouvements de la scapula, en coordination avec les autres muscles de l’épaule.'],
 [/gluteus maximus/,'Le grand fessier participe à l’extension de la hanche, notamment lors du redressement du corps.'],
 [/gluteus medius|gluteus minimus/,'Les moyen et petit fessiers participent à l’abduction de la hanche et à la stabilisation du bassin.'],
 [/vastus|rectus femoris/,'Ce muscle appartient au quadriceps, qui étend le genou. Le droit fémoral participe aussi à la flexion de la hanche.'],
 [/biceps femoris|semitendinosus|semimembranosus/,'Ce muscle fait partie des ischio-jambiers, qui participent notamment à la flexion du genou.'],
 [/gastrocnemius|soleus/,'Ce muscle du mollet participe à la flexion plantaire de la cheville, utilisée pour se mettre sur la pointe des pieds.'],
 [/tibialis anterior/,'Le tibial antérieur participe à la flexion dorsale et à l’inversion du pied.'],
 [/diaphragm/,'Le diaphragme est le principal muscle de l’inspiration. Sa contraction augmente le volume de la cavité thoracique.'],
 [/intercostal/,'Les muscles intercostaux participent aux mouvements et à la stabilisation de la cage thoracique pendant la respiration.'],
 [/sternocleidomastoid/,'Le sterno-cléido-mastoïdien participe à la flexion du cou et à la rotation de la tête.'],
 [/external oblique/,'L’oblique externe participe aux mouvements du tronc et à la compression de la paroi abdominale.'],
 [/supinator/,'Le supinateur participe à la supination de l’avant-bras, qui oriente la paume vers l’avant en position anatomique.'],
 [/pronator/,'Les pronateurs participent à la pronation de l’avant-bras, qui oriente la paume vers l’arrière en position anatomique.'],
 [/flexor/,'Ce muscle appartient à un groupe de fléchisseurs. Son action précise dépend des articulations qu’il franchit et de ses insertions.'],
 [/extensor/,'Ce muscle appartient à un groupe d’extenseurs. Son action précise dépend des articulations qu’il franchit et de ses insertions.'],
];
function neuralFunction(n:string){
 if(/ventricle|aqueduct|central canal/.test(n))return 'Cette cavité ou ce conduit appartient aux voies de circulation du liquide cérébrospinal. Il s’agit d’un espace anatomique, et non d’un nerf.';
 if(/spinal cord/.test(n))return 'La moelle épinière relaie des informations entre l’encéphale et le corps et intervient dans les circuits réflexes.';
 if(/cerebellum/.test(n))return 'Le cervelet contribue à la coordination des mouvements et à l’équilibre.';
 if(/nerve/.test(n))return 'Les nerfs transmettent des signaux entre les structures qu’ils relient. Les branches représentées ici appartiennent principalement à la région de l’orbite.';
 return 'Cette structure appartient à l’encéphale. Les régions cérébrales coopèrent au sein de réseaux pour intégrer les informations et coordonner les fonctions du corps.';
}
export function adaptManifest(manifest:AnatomyManifest,layer:LayerId):AtlasStructure[]{
 return manifest.structures.map(e=>{
  const englishName=e.englishName??e.originalName??e.name;
  const region=Object.hasOwn(regions,e.region)?e.region:'torso';
  const muscleFunction=muscleFunctions.find(([pattern])=>pattern.test(englishName))?.[1]??'Un muscle squelettique produit une force en se contractant. Son action dépend de ses attaches et du travail coordonné des muscles voisins.';
  const fn=layer==='muscles'?muscleFunction:layer==='nerves'?neuralFunction(englishName):/cartilage|disk/.test(englishName)?'Les cartilages et les disques participent au soutien et à la mobilité du squelette, avec des rôles qui dépendent de leur localisation.':'Le tissu osseux assure le soutien du corps, protège des organes et sert de point d’ancrage aux muscles.';
  const muscleChapters:Record<RegionId,string>={head:'11-3-axial-muscles-of-the-head-neck-and-back',neck:'11-3-axial-muscles-of-the-head-neck-and-back',torso:'11-4-axial-muscles-of-the-abdominal-wall-and-thorax',arm:'11-5-muscles-of-the-pectoral-girdle-and-upper-limbs',leg:'11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs'};
  const chapter=layer==='muscles'?muscleChapters[region]:layer==='bones'?(region==='arm'||region==='leg'?'8-introduction':'7-introduction'):/nerve/.test(englishName)?'13-4-the-peripheral-nervous-system':'13-2-the-central-nervous-system';
  return {id:e.id,name:e.name,englishName,latin:e.latin===englishName?'':e.latin??'',layer,system:layer==='muscles'?'muscular':layer==='bones'?'skeletal':'nervous',region,location:`Région : ${regions[region].toLocaleLowerCase('fr')}. ${/left/.test(englishName)?'Structure située du côté gauche du sujet.':/right/.test(englishName)?'Structure située du côté droit du sujet.':''}`,function:e.function??fn,description:e.description??`${e.name} est une structure identifiée dans la nomenclature anatomique du modèle. ${regionSentences[region]}`,relations:[],facts:layer==='muscles'?['Certains éléments correspondent à un chef ou à un faisceau d’un muscle, et d’autres à un ensemble de petits muscles.','Les muscles profonds sont plus faciles à observer avec la commande d’isolation.']:[],source:{label:'OpenStax · Anatomy and Physiology 2e',url:`https://openstax.org/books/anatomy-and-physiology-2e/pages/${chapter}`},color:layer==='muscles'?'#b65e4c':layer==='bones'?'#d0bea1':'#c59a38',meshNames:e.meshNames,sourceIds:e.sourceIds,searchTerms:layer==='muscles'?(/vastus|rectus femoris|biceps femoris|semitendinosus|semimembranosus|sartorius|gracilis|adductor/.test(englishName)&&region==='leg'?['cuisse',...(/vastus|rectus femoris/.test(englishName)?['quadriceps']: /biceps femoris|semitendinosus|semimembranosus/.test(englishName)?['ischio-jambiers']:[])]:/gastrocnemius|soleus/.test(englishName)?['mollet','jambe','triceps sural']:region==='arm'?['bras','épaule','avant-bras','main']:[]):[],imageKey:layer==='muscles'&&/longissimus|iliocostalis|rhomboid|trapezius|spinalis|splenius|serratus posterior/.test(englishName)?'muscles-back':layer==='muscles'&&/deltoid|supraspinatus|infraspinatus|subscapularis|teres major|teres minor/.test(englishName)?'muscles-shoulder':layer==='muscles'&&/carpi|digitorum|pollicis|hand|pronator|supinator|palmaris|extensor indicis/.test(englishName)&&region==='arm'?'muscles-forearm':layer==='muscles'&&/tibialis|fibularis|gastrocnemius|soleus|plantaris|hallucis|foot/.test(englishName)?'muscles-lower-leg':`${layer}-${region}`};
 });
}
export const organStructures:AtlasStructure[]=anatomy.filter(e=>['heart','lungs','brain','liver','stomach','kidneys','intestines'].includes(e.id)).map(e=>({...e,layer:'organs',region:e.id==='brain'?'head':'torso',meshNames:e.id==='lungs'?['lung-left','lung-right']:e.id==='kidneys'?['kidney-left','kidney-right']:[e.id],imageKey:e.id}));
export async function loadCatalog():Promise<AtlasStructure[]>{
 const paths:[LayerId,string][]=[['muscles','muscles-manifest.json'],['bones','skeletal-manifest.json'],['nerves','nervous-manifest.json']];
 const values=await Promise.all(paths.map(async([layer,file])=>{const r=await fetch(`${import.meta.env.BASE_URL}models/${file}`);if(!r.ok)throw Error(`L’inventaire ${layer} est indisponible (${r.status}).`);return adaptManifest(await r.json(),layer);}));
 return [...values.flat(),...organStructures];
}
export async function loadIllustrations():Promise<AtlasIllustration[]>{
 const r=await fetch(`${import.meta.env.BASE_URL}illustrations.json`);if(!r.ok)return[];
 const data=await r.json() as AtlasIllustration[];
 return data.map(i=>({...i,src:`${import.meta.env.BASE_URL}${i.src}`}));
}
