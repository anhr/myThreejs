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
    create, points, setArrayFuncs, limitAngles, getShaderMaterialPoints, getWorldPosition//, addParticle
} from './index.js';
import { myPoints } from './myPoints/myPoints.js';

var MYTHREEJS = {

	create: create,
    points: points,
//    myPoints: myPoints.create,
    getShaderMaterialPoints: myPoints.getShaderMaterialPoints,
	setArrayFuncs: setArrayFuncs,
	limitAngles: limitAngles,
    getWorldPosition: getWorldPosition,
//    addParticle: addParticle,

}
export default MYTHREEJS;
