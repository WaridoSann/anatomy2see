import { Box3, Mesh, Object3D, Vector3 } from 'three';
export const meshToStructure:Record<string,string> = {'lung-left':'lungs','lung-right':'lungs','kidney-left':'kidneys','kidney-right':'kidneys'};
export const structureForMesh=(name:string)=>meshToStructure[name]??name;
export function boundsForStructure(root:Object3D,id?:string) {
 const bounds=new Box3();
 root.updateMatrixWorld(true);
 root.traverse(object=>{if(object instanceof Mesh && object.name!=='skin' && (!id || structureForMesh(object.name)===id))bounds.union(new Box3().setFromObject(object));});
 if(bounds.isEmpty())return null;
 const center=bounds.getCenter(new Vector3());
 const radius=Math.max(bounds.getSize(new Vector3()).length()/2,0.025);
 return {bounds,center,radius};
}
export function framingDistance(radius:number,fov:number,aspect:number) {
 const vertical=fov*Math.PI/360;
 const horizontal=Math.atan(Math.tan(vertical)*aspect);
 return radius/Math.sin(Math.min(vertical,horizontal))*1.22;
}
/** Fit the projected box, preserving a useful scale for tall anatomy on phones. */
export function framingBoxDistance(size:Vector3,fov:number,aspect:number,side=false) {
 const tangent=Math.tan(fov*Math.PI/360);
 const width=side?size.z:size.x;
 const depth=side?size.x:size.z;
 return Math.max(size.y/(2*tangent),width/(2*tangent*aspect))*1.16+depth/2;
}
