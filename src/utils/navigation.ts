import type { AtlasPage, LayerId } from '../types/atlas';
const pages:AtlasPage[]=['home','journey','chapters','explorer','library','about'];
const layers:LayerId[]=['muscles','organs','bones','nerves'];
export function parseRoute(hash:string):{page:AtlasPage;layer:LayerId}{
 const [page,layer]=hash.replace(/^#\/?/,'').split('/');
 return {page:pages.includes(page as AtlasPage)?page as AtlasPage:'home',layer:layers.includes(layer as LayerId)?layer as LayerId:'muscles'};
}
export function routeHash(page:AtlasPage,layer:LayerId){return page==='explorer'?`#/${page}/${layer}`:`#/${page}`;}
