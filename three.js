import { THREE } from '../../commonNodeJS/master/three.js';//https://github.com/anhr/commonNodeJS
//import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';
//import * as THREE from '../../three.js/dev/build/three.module.js';//https://github.com/anhr/three.js

import { WEBGL } from '../../three.js/dev/examples/jsm/WebGL.js';//https://github.com/anhr/three.js
//import { WEBGL } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/WebGL.js';

import { OrbitControls } from '../../three.js/dev/examples/jsm/controls/OrbitControls.js';//https://github.com/anhr/three.js
//import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';

import { ConvexBufferGeometry } from '../../three.js/dev/examples/jsm/geometries/ConvexGeometry.js';//https://github.com/anhr/three.js
//import { ConvexBufferGeometry } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/geometries/ConvexGeometry.js';

import { StereoEffect, spatialMultiplexsIndexs } from '../../commonNodeJS/master/StereoEffect/StereoEffect.js';//https://github.com/anhr/commonNodeJS
//import { StereoEffect, spatialMultiplexsIndexs } from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect.js';

import { SpriteText } from '../../SpriteText/master/SpriteText.js';//https://github.com/anhr/SpriteText
//import { SpriteText } from 'https://raw.githack.com/anhr/SpriteText/master/SpriteText.js';
SpriteText.setTHREE( THREE );

import { SpriteTextGui } from '../../SpriteText/master/SpriteTextGui.js';//https://github.com/anhr/SpriteText
//import { SpriteTextGui } from 'https://raw.githack.com/anhr/SpriteText/master/SpriteTextGui.js';

//import { AxesHelper, AxesHelperOptions } from '../../AxesHelper/master/AxesHelper.js';//https://github.com/anhr/AxesHelper
import { AxesHelper } from '../../AxesHelper/master/AxesHelper.js';//https://github.com/anhr/AxesHelper
//import { AxesHelper, AxesHelperOptions } from 'https://raw.githack.com/anhr/AxesHelper/master/AxesHelper.js';

import { AxesHelperGui } from '../../AxesHelper/master/AxesHelperGui.js';//https://github.com/anhr/AxesHelper
//import { AxesHelperGui } from 'https://raw.githack.com/anhr/AxesHelper/master/AxesHelperGui.js';

export {

	THREE,
	WEBGL,
	OrbitControls,
	ConvexBufferGeometry,
	StereoEffect, spatialMultiplexsIndexs,
	SpriteText, SpriteTextGui,
	AxesHelper,
	AxesHelperGui,
//	AxesHelperOptions,

}
