/**
 * myThreejs
 *
 * I use myThreejs in my projects for displaying of my 3D objects in the canvas.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * @license 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import {

    create, points, setArrayFuncs, limitAngles, getWorldPosition

} from './index.js';

//import { myPoints } from './myPoints/myPoints.js';
import MyPoints from '../../commonNodeJS/master/myPoints/myPoints.js';

import getShaderMaterialPoints from '../../commonNodeJS/master/getShaderMaterialPoints/getShaderMaterialPoints.js';
/*
//import * as THREE from 'https://threejs.org/build/three.module.js';
import * as THREE from '../../three.js/dev/build/three.module.js';
//export var three = {THREE: THREE};
import { WEBGL } from '../../three.js/dev/examples/jsm/WebGL.js';
*/
//import { THREE, WEBGL, ConvexBufferGeometry } from '../../nodejs/three.js';
import { THREE, WEBGL, ConvexBufferGeometry } from './three.js';
//var MYTHREEJS =
var myThreejs =
{

	create: create,
    points: points,
	setArrayFuncs: setArrayFuncs,
	limitAngles: limitAngles,
    getWorldPosition: getWorldPosition,
    /**
    * get THREE.Points with THREE.ShaderMaterial material
    * */
    getShaderMaterialPoints: getShaderMaterialPoints,
//    getShaderMaterialPoints: myPoints.getShaderMaterialPoints,
	/**
	 * Pushes to clouds array all point from geometry
	 */
//    pushArrayCloud: myPoints.pushArrayCloud,
    pushArrayCloud: MyPoints.pushArrayCloud,
/*    
    THREE: threejs.THREE,
    WEBGL: threejs.WEBGL,
*/    

}
//export default MYTHREEJS;
export { myThreejs, THREE, WEBGL, ConvexBufferGeometry }
