//import * as THREE from 'https://threejs.org/build/three.module.js';

//Если использовать релиз THREE.REVISION = "120dev" то будут предупреждения 
//three.module.js:21440 THREE.WebGLRenderer: EXT_frag_depth extension not supported.
//three.module.js:21440 THREE.WebGLRenderer: EXT_shader_texture_lod extension not supported.
//если рисовать линию new THREE.Line(...)
/*
//import { THREE } from '../../commonNodeJS/master/three.js';
*/
//import * as THREE from 'https://threejs.org/build/three.module.js';
//import * as THREE from '../../three.js/dev/build/three.module.min.js';
import * as THREE from '../../three.js/dev/build/three.module.js';
//import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';

import { WEBGL } from '../../three.js/dev/examples/jsm/WebGL.js';
//import { WEBGL } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/WebGL.js';

import { OrbitControls } from '../../three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

/*Uncaught SyntaxError: The requested module '../../../../three.js/dev/examples/jsm/geometries/ConvexGeometry.js' does not provide an export named 'ConvexBufferGeometry'
import { ConvexBufferGeometry } from '../../three.js/dev/examples/jsm/geometries/ConvexGeometry.js';
//import { ConvexBufferGeometry } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/geometries/ConvexGeometry.js';
*/

import StereoEffect from '../../commonNodeJS/master/StereoEffect/StereoEffect.js';
//import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';

//import { SpriteText } from '../../SpriteText/master/SpriteText.js';//https://github.com/anhr/SpriteText
import { SpriteText } from '../../commonNodeJS/master/SpriteText/SpriteText.js';
//import { SpriteText } from 'https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/SpriteText.js';
SpriteText.setTHREE( THREE );

import { SpriteTextGui } from '../../commonNodeJS/master/SpriteText/SpriteTextGui.js';
//import { SpriteTextGui } from 'https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/SpriteTextGui.js';

//import { AxesHelper, AxesHelperOptions } from '../../AxesHelper/master/AxesHelper.js';
import { AxesHelper } from '../../commonNodeJS/master/AxesHelper/AxesHelper.js';
//import { AxesHelper, AxesHelperOptions } from 'https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/AxesHelper.js';

import { AxesHelperGui } from '../../commonNodeJS/master/AxesHelper/AxesHelperGui.js';
//import { AxesHelperGui } from 'https://raw.githack.com/anhr/AxesHelper/master/AxesHelperGui.js';

export {

	THREE,
	WEBGL,
	OrbitControls,
	//ConvexBufferGeometry,Uncaught SyntaxError: The requested module '../../../../three.js/dev/examples/jsm/geometries/ConvexGeometry.js' does not provide an export named 'ConvexBufferGeometry'
	StereoEffect,// spatialMultiplexsIndexs,
	SpriteText, SpriteTextGui,
	AxesHelper,
	AxesHelperGui,
//	AxesHelperOptions,

}
