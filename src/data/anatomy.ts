/**
 * Original French educational summaries, based on the linked OpenStax chapters.
 * This catalog describes anatomy; asset availability is resolved by the model
 * manifest, never inferred from the presence of an entry here.
 */
export type SystemId =
  | 'skeletal'
  | 'muscular'
  | 'nervous'
  | 'cardiovascular'
  | 'respiratory'
  | 'digestive'
  | 'urinary';

export interface AnatomyStructure {
  id: string;
  name: string;
  latin: string;
  system: SystemId;
  location: string;
  function: string;
  description: string;
  relations: string[];
  facts: string[];
  source: { label: string; url: string };
  color: string;
  meshKeywords: string[];
}

export interface AnatomySystem {
  id: SystemId;
  name: string;
  color: string;
  description: string;
}

export const systems: AnatomySystem[] = [
  { id: 'skeletal', name: 'Squelettique', color: '#e5d5b2', description: 'Soutien, protection et mouvement.' },
  { id: 'muscular', name: 'Musculaire', color: '#d47a72', description: 'Les muscles produisent force et mouvement.' },
  { id: 'nervous', name: 'Nerveux', color: '#d4aeeb', description: 'Perception, intégration et commande.' },
  { id: 'cardiovascular', name: 'Cardiovasculaire', color: '#f16c79', description: 'Le cœur et les vaisseaux assurent la circulation du sang.' },
  { id: 'respiratory', name: 'Respiratoire', color: '#71cbd1', description: 'Ventilation et échanges gazeux.' },
  { id: 'digestive', name: 'Digestif', color: '#dfb073', description: 'Digestion et absorption des nutriments.' },
  { id: 'urinary', name: 'Urinaire', color: '#bd97d2', description: 'Filtration du sang et équilibre du milieu intérieur.' },
];

const openStax = (chapter: string, label: string): AnatomyStructure['source'] => ({
  label: `OpenStax · Anatomy and Physiology 2e · ${label}`,
  url: `https://openstax.org/books/anatomy-and-physiology-2e/pages/${chapter}`,
});

export const anatomy: AnatomyStructure[] = [
  {
    id: 'heart',
    name: 'Cœur',
    latin: 'Cor',
    system: 'cardiovascular',
    location: 'Dans le médiastin, entre les poumons, derrière le sternum et au-dessus du diaphragme.',
    function: 'Propulser le sang vers les poumons et vers les tissus du corps.',
    description: 'Le cœur est un organe musculaire creux organisé en quatre cavités : deux oreillettes et deux ventricules. Le cœur droit dirige le sang vers les poumons ; le cœur gauche l’envoie dans la circulation générale. Les valves contribuent à maintenir un écoulement dans un seul sens.',
    relations: ['Poumons et vaisseaux pulmonaires', 'Aorte et veines caves', 'Diaphragme et péricarde'],
    facts: ['Le myocarde constitue la couche musculaire de la paroi cardiaque.', 'Les artères coronaires alimentent le muscle cardiaque.', 'Le ventricule gauche possède une paroi plus épaisse que le ventricule droit.'],
    source: openStax('19-1-heart-anatomy', '19.1 · Anatomie du cœur'),
    color: '#ef6a76',
    meshKeywords: ['heart', 'cardiac', 'cor', 'ventricle', 'atrium', 'myocardium'],
  },
  {
    id: 'lungs',
    name: 'Poumons',
    latin: 'Pulmones',
    system: 'respiratory',
    location: 'Dans la cavité thoracique, de part et d’autre du médiastin, au-dessus du diaphragme.',
    function: 'Permettre les échanges d’oxygène et de dioxyde de carbone entre l’air et le sang.',
    description: 'Les poumons contiennent un arbre de conduits qui se ramifient jusqu’aux alvéoles. C’est à travers la fine barrière entre alvéoles et capillaires que les gaz diffusent. Le poumon droit comporte trois lobes et le gauche deux, avec une échancrure qui laisse de la place au cœur.',
    relations: ['Trachée et bronches', 'Cœur et vaisseaux pulmonaires', 'Plèvre et diaphragme'],
    facts: ['Chaque poumon est entouré d’une membrane appelée plèvre.', 'Le diaphragme participe à la ventilation en modifiant le volume thoracique.', 'Les alvéoles sont entourées de capillaires sanguins.'],
    source: openStax('22-1-organs-and-structures-of-the-respiratory-system', '22.1 · Organes respiratoires'),
    color: '#78c4d1',
    meshKeywords: ['lung', 'pulmon', 'pulmonary lobe', 'lobus superior', 'lobus inferior'],
  },
  {
    id: 'brain',
    name: 'Encéphale',
    latin: 'Encephalon',
    system: 'nervous',
    location: 'Dans la cavité crânienne, en continuité avec la moelle épinière.',
    function: 'Intégrer les informations et coordonner les fonctions sensorielles, motrices, cognitives et autonomes.',
    description: 'L’encéphale comprend notamment les hémisphères cérébraux, le diencéphale, le tronc cérébral et le cervelet. Ces régions coopèrent dans des réseaux ; leurs fonctions ne se résument pas à une simple correspondance entre une région et une tâche unique. Les méninges et le liquide cérébrospinal contribuent à sa protection.',
    relations: ['Crâne et méninges', 'Moelle épinière', 'Nerfs crâniens'],
    facts: ['Le cervelet contribue à la coordination des mouvements et à l’équilibre.', 'Le tronc cérébral relie les régions supérieures à la moelle épinière.', 'La substance grise et la substance blanche ont des organisations différentes.'],
    source: openStax('13-2-the-central-nervous-system', '13.2 · Système nerveux central'),
    color: '#c0a2dc',
    meshKeywords: ['brain', 'encephal', 'cerebr', 'cerebell', 'brainstem', 'diencephal'],
  },
  {
    id: 'liver',
    name: 'Foie',
    latin: 'Hepar',
    system: 'digestive',
    location: 'Dans la partie supérieure droite de l’abdomen, sous le diaphragme ; il s’étend vers la gauche.',
    function: 'Participer au métabolisme des nutriments, transformer de nombreuses substances et produire la bile.',
    description: 'Le foie reçoit du sang provenant de l’artère hépatique et de la veine porte. Ses cellules, les hépatocytes, interviennent dans de nombreuses transformations métaboliques. La bile qu’il produit rejoint les voies biliaires et contribue à la digestion des lipides dans l’intestin grêle.',
    relations: ['Diaphragme', 'Vésicule biliaire et voies biliaires', 'Estomac, duodénum et veine porte'],
    facts: ['La veine porte apporte au foie du sang provenant notamment du tube digestif.', 'La bile est produite par le foie ; la vésicule biliaire la stocke et la concentre.', 'Le foie contribue au stockage du glycogène.'],
    source: openStax('23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder', '23.6 · Foie et organes annexes'),
    color: '#c88076',
    meshKeywords: ['liver', 'hepar', 'hepatic lobe'],
  },
  {
    id: 'stomach',
    name: 'Estomac',
    latin: 'Gaster',
    system: 'digestive',
    location: 'Dans la partie supérieure gauche de l’abdomen, entre l’œsophage et le duodénum.',
    function: 'Stocker et brasser les aliments, puis amorcer notamment la digestion des protéines.',
    description: 'L’estomac est une poche musculaire dont les contractions mélangent les aliments aux sécrétions gastriques pour former le chyme. Sa muqueuse sécrète notamment de l’acide, des précurseurs enzymatiques et du mucus protecteur. Le pylore régule le passage du contenu vers le duodénum.',
    relations: ['Œsophage', 'Duodénum', 'Foie, rate et pancréas'],
    facts: ['La paroi de l’estomac possède trois couches de muscle lisse.', 'Le mucus et les bicarbonates contribuent à protéger sa muqueuse.', 'Le facteur intrinsèque gastrique est nécessaire à l’absorption de la vitamine B12 dans l’intestin.'],
    source: openStax('23-4-the-stomach', '23.4 · Estomac'),
    color: '#dfa5a0',
    meshKeywords: ['stomach', 'gaster', 'ventriculus', 'gastric'],
  },
  {
    id: 'kidneys',
    name: 'Reins',
    latin: 'Renes',
    system: 'urinary',
    location: 'Contre la paroi postérieure de l’abdomen, de part et d’autre de la colonne vertébrale, en arrière du péritoine.',
    function: 'Former l’urine et contribuer à réguler l’eau, les électrolytes et l’équilibre acido-basique.',
    description: 'Chaque rein comprend un cortex externe et une médulla interne. Les néphrons assurent la filtration du plasma, puis la réabsorption et la sécrétion de substances. L’urine gagne les cavités collectrices, le pelvis rénal puis l’uretère. Les reins participent également à des fonctions hormonales.',
    relations: ['Artères et veines rénales', 'Uretères', 'Glandes surrénales et paroi abdominale postérieure'],
    facts: ['Les reins sont des organes rétropéritonéaux.', 'Le rein droit est habituellement situé un peu plus bas que le gauche.', 'Le hile rénal est la zone de passage des vaisseaux et des voies excrétrices.'],
    source: openStax('25-3-gross-anatomy-of-the-kidney', '25.3 · Anatomie du rein'),
    color: '#ba91bc',
    meshKeywords: ['kidney', 'renal', 'ren dexter', 'ren sinister'],
  },
  {
    id: 'intestines',
    name: 'Intestins',
    latin: 'Intestinum tenue et intestinum crassum',
    system: 'digestive',
    location: 'Dans les cavités abdominale et pelvienne, entre l’estomac et l’anus.',
    function: 'Poursuivre la digestion, absorber les nutriments et l’eau, puis acheminer les résidus.',
    description: 'L’intestin grêle comprend le duodénum, le jéjunum et l’iléon. Ses plis et ses villosités augmentent la surface d’absorption. Le gros intestin comprend notamment le cæcum, le côlon et le rectum ; il absorbe de l’eau et des électrolytes et participe à la formation des selles.',
    relations: ['Estomac et duodénum', 'Foie, voies biliaires et pancréas', 'Mésentère et vascularisation digestive'],
    facts: ['L’essentiel de l’absorption des nutriments a lieu dans l’intestin grêle.', 'Le gros intestin héberge une importante communauté microbienne.', 'Le péristaltisme contribue à faire progresser le contenu intestinal.'],
    source: openStax('23-5-the-small-and-large-intestines', '23.5 · Intestin grêle et gros intestin'),
    color: '#d6a48c',
    meshKeywords: ['intestin', 'colon', 'duodenum', 'jejunum', 'ileum', 'cecum', 'caecum', 'rectum'],
  },
  {
    id: 'skull',
    name: 'Crâne',
    latin: 'Cranium',
    system: 'skeletal',
    location: 'À l’extrémité supérieure du squelette axial, au-dessus de la colonne cervicale.',
    function: 'Protéger l’encéphale et former l’armature de la face.',
    description: 'Le crâne associe les os de la boîte crânienne et ceux de la face. La plupart sont unis par des sutures. Ses cavités abritent l’encéphale et des organes sensoriels, tandis que ses ouvertures permettent le passage de nerfs et de vaisseaux. La mandibule participe à la mastication.',
    relations: ['Encéphale et méninges', 'Première vertèbre cervicale', 'Orbites, cavités nasales et mandibule'],
    facts: ['L’os occipital s’articule avec l’atlas.', 'Le foramen magnum permet la continuité entre encéphale et moelle épinière.', 'Les sutures sont des articulations fibreuses.'],
    source: openStax('7-2-the-skull', '7.2 · Crâne'),
    color: '#e3d5b8',
    meshKeywords: ['skull', 'crani', 'frontal bone', 'parietal', 'temporal bone', 'occipital', 'mandible', 'maxilla', 'zygomatic', 'sphenoid', 'ethmoid'],
  },
  {
    id: 'spine',
    name: 'Colonne vertébrale',
    latin: 'Columna vertebralis',
    system: 'skeletal',
    location: 'Sur l’axe postérieur du tronc, de la base du crâne au bassin.',
    function: 'Soutenir la tête et le tronc, protéger la moelle épinière et permettre la mobilité du dos.',
    description: 'La colonne vertébrale comprend des régions cervicale, thoracique, lombaire, sacrée et coccygienne. Les vertèbres délimitent le canal vertébral. Entre de nombreux corps vertébraux, les disques intervertébraux répartissent les contraintes et accompagnent les mouvements.',
    relations: ['Crâne', 'Moelle épinière et nerfs spinaux', 'Côtes et bassin'],
    facts: ['La région cervicale comporte sept vertèbres.', 'Les vertèbres thoraciques s’articulent avec les côtes.', 'Les courbures physiologiques participent à l’équilibre et à la répartition des contraintes.'],
    source: openStax('7-3-the-vertebral-column', '7.3 · Colonne vertébrale'),
    color: '#dfd0ae',
    meshKeywords: ['vertebr', 'spine', 'sacrum', 'coccyx', 'atlas', 'axis'],
  },
  {
    id: 'skeleton',
    name: 'Squelette',
    latin: 'Systema skeletale',
    system: 'skeletal',
    location: 'Dans l’ensemble du corps : squelette axial et squelette appendiculaire.',
    function: 'Soutenir le corps, protéger les organes et offrir des leviers aux muscles.',
    description: 'Le système squelettique associe les os et les structures qui les unissent. Le squelette axial comprend notamment le crâne, la colonne et la cage thoracique ; le squelette appendiculaire comprend les membres et leurs ceintures. Le tissu osseux est vivant et se renouvelle.',
    relations: ['Muscles et tendons', 'Articulations et ligaments', 'Moelle osseuse et vascularisation'],
    facts: ['Les os constituent une réserve de minéraux, notamment de calcium et de phosphate.', 'La moelle osseuse rouge participe à la production des cellules sanguines.', 'Les ostéoblastes et les ostéoclastes interviennent dans le remodelage osseux.'],
    source: openStax('6-1-the-functions-of-the-skeletal-system', '6.1 · Fonctions du squelette'),
    color: '#e5d5b2',
    meshKeywords: ['bone', 'skeleton', 'rib', 'sternum', 'clavicle', 'scapula', 'humerus', 'radius', 'ulna', 'pelvis', 'hip', 'femur', 'patella', 'tibia', 'fibula', 'carpal', 'tarsal', 'phalan'],
  },
  {
    id: 'muscles',
    name: 'Muscles squelettiques',
    latin: 'Musculi skeletales',
    system: 'muscular',
    location: 'Dans l’ensemble du corps, généralement reliés aux os par des tendons.',
    function: 'Produire les mouvements, stabiliser les articulations et contribuer au maintien de la posture.',
    description: 'Les muscles squelettiques transmettent leur force au squelette. Un mouvement résulte de l’action coordonnée de muscles agonistes, antagonistes et synergistes. Leurs points d’attache et leur organisation déterminent leur action mécanique.',
    relations: ['Os et articulations', 'Tendons et fascias', 'Nerfs moteurs et vaisseaux sanguins'],
    facts: ['Un muscle produit une traction lorsqu’il se contracte.', 'Les muscles stabilisateurs peuvent maintenir une partie du corps pendant qu’une autre bouge.', 'La contraction musculaire contribue à la production de chaleur.'],
    source: openStax('11-1-interactions-of-skeletal-muscles-their-fascicle-arrangement-and-their-lever-systems', '11.1 · Action des muscles squelettiques'),
    color: '#d47a72',
    meshKeywords: ['muscle', 'musculus', 'biceps', 'triceps', 'deltoid', 'pectoralis', 'rectus', 'quadriceps', 'gastrocnemius'],
  },
];

export function getStructure(id: string): AnatomyStructure | undefined {
  return anatomy.find((structure) => structure.id === id);
}

export function getSystem(id: SystemId): AnatomySystem {
  return systems.find((system) => system.id === id)!;
}
