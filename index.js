/**
 * @module myThreejs
 * @see myPoints
 * 
 * I use myThreejs in my projects for displaying of my 3D objects in the canvas.
 * 
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

//Please download https://github.com/anhr/loadScriptNodeJS into ../loadScriptNodeJS folder
import loadScript from '../../loadScriptNodeJS/master/loadScript.js';

//Please download https://github.com/anhr/loadFileNodeJS into ../loadFileNodeJS folder
import loadFile from '../../loadFileNodeJS/master/loadFile.js';

//https://threejs.org/docs/#manual/en/introduction/Import-via-modules
/*
import {

	Vector2,
	Vector3,
	Vector4,
	PerspectiveCamera,
	Scene,
	Color,
	Fog,
	WebGLRenderer,
	PointLight,
	Group,
	AxesHelper,
	Raycaster,
	SpriteText,
	AxesHelperOptions,
	Euler,

	//light
	BufferGeometry,
	Points,
	PointsMaterial,

} from '../../three.js/dev/build/three.module.js';//'http://localhost/threejs/three.js/build/three.module.js';
*/
import * as THREE from '../../three.js/dev/build/three.module.js';

//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';
import cookie from '../../cookieNodeJS/master/cookie.js';

//import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
import { getLanguageCode } from '../../commonNodeJS/master/lang.js';

//import menuPlay from 'https://raw.githack.com/anhr/menuPlay/master/menuPlay.js';
import menuPlay from '../../menuPlay/master/menuPlay.js';

import { FrustumPoints, cFrustumPointsF } from './frustumPoints/frustumPoints.js';
import Player from './player.js';

//import OrbitControlsGui from '../cookieNodeJS/OrbitControlsGui.js';
//import OrbitControlsGui from 'http://localhost/threejs/commonNodeJS/master/OrbitControlsGui.js';
//import OrbitControlsGui from 'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControlsGui.js';
import OrbitControlsGui from '../../commonNodeJS/master/OrbitControlsGui.js';

import AxesHelperGui from '../../commonNodeJS/master/AxesHelperGui.js';
import clearThree from '../../commonNodeJS/master/clearThree.js';
import ColorPicker from '../../colorpicker/master/colorpicker.js';
import PositionController from '../../commonNodeJS/master/PositionController.js';
import controllerPlay from '../../controllerPlay/master/controllerPlay.js';
import ScaleController from '../../commonNodeJS/master/ScaleController.js';
//import { StereoEffect, spatialMultiplexsIndexs } from '/anhr/three.js/dev/examples/jsm/effects/StereoEffect.js';
import { StereoEffect, spatialMultiplexsIndexs } from '../../three.js/dev/examples/jsm/effects/StereoEffect.js';
import { OrbitControls } from '../../three.js/dev/examples/jsm/controls/OrbitControls.js';
import { myPoints } from './myPoints/myPoints.js';

//https://github.com/mrdoob/stats.js/
//import Stats from '../../three.js/dev/examples/jsm/libs/stats.module.js';

var debug = {

	opacity: 1 //непрозрачность frustumPoints

};
/*
var debug = true,
	url = 'localhost/threejs',//'192.168.1.2'//ATTENTION!!! localhost is not available for debugging of the mobile devices
	min = '';//min.
*/
var palette = new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
palette.toColor = function ( value, min, max ) {

	if ( value instanceof THREE.Color )
		return value;
	var c = this.hsv2rgb( value, min, max );
	if ( c === undefined )
		c = { r: 255, g: 255, b: 255 }
	return new THREE.Color( "rgb(" + c.r + ", " + c.g + ", " + c.b + ")" );

}
function arrayContainersF(){

	var array = [];
	this.push = function ( elContainer ) {

		array.push( elContainer );

	};
	this.display = function ( elContainer, fullScreen ) {

		array.forEach( function ( itemElContainer ) {

			itemElContainer.style.display = ( itemElContainer === elContainer ) || ! fullScreen ? 'block' : 'none';

		} );

	}

};
var arrayContainers = new arrayContainersF();

/*
 * if you asynhronous creates two or more myThreejs same time, then you will receive the error message:
 * 
 * Uncaught ReferenceError: WEBGL is not defined
 * 
 * For resolving of the issue I have remembers myThreejs parameters in the arrayCreates
 * and creates next myThreejs only after creating of previous myThreejs.
 */
var arrayCreates = [];

/**
 * @callback createXDobjects
 * @param {Group} group group of my 3d or 4d objects. https://threejs.org/docs/index.html#api/en/objects/Group
 */

/**
 * Creates new canvas with my 3D objects
 * @param {createXDobjects} createXDobjects callback creates my 3D objects.
 * @param {object} [options] followed options is available:
 * @param {HTMLElement|string} [options.elContainer] If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui.
 * If a string, then is id of the HTMLElement.
 * Default is document.getElementById( "containerDSE" ) or a div element, child of body.
 * @param {object} [options.orbitControls] use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
 * @param {boolean} [options.orbitControls.gui] true - displays the orbit controls gui. Default is false.
 * @param {boolean} [options.axesHelper] true - displays the AxesHelper. Default the axes is not visible.
 * @param {boolean} [options.axesHelperGui] true - displays the AxesHelper gui. Default is false.
 * @param {boolean} [options.stereoEffect] true - use stereoEffect https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js. Default is false.
 * @param {boolean} [options.dat] true - use dat-gui JavaScript Controller Library. https://github.com/dataarts/dat.gui Default is false.
 * @param {boolean} [options.menuPlay] true - use my dropdown menu for canvas in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D objects in my projects.
 * See nodejs\menuPlay\index.js Default is false.
 * @param {array} [options.arrayCloud] Array of points with cloud.
 * If you define the array of points with cloud, then you can define a points with cloud.
 * For example you can define
 * arrayCloud: options.arrayCloud
 * on the params of the getShaderMaterialPoints( params, onReady ) function.
 * Or
 * arrayCloud: options.arrayCloud
 * on the pointsOptions of the myThreejs.points function.
 * Default is undefined
 * @param {object} [options.player] 3D objects animation.
 * @param {number} [options.player.min] Animation start time. Default is 0.
 * @param {number} [options.player.max] Animation end time. Default is 1.
 * @param {object} [options.canvas] canvas properties
 * @param {number} [options.canvas.width] width of the canvas
 * @param {number} [options.canvas.height] height of the canvas
 * @param {object} [options.axesHelper.scales] axes scales. See three.js\src\helpers\AxesHelper.js
 * @param {number} [options.a] Can be use as 'a' parameter of the Function. See arrayFuncs for details. Default is 1.
 * @param {number} [options.b] Can be use as 'b' parameter of the Function. See arrayFuncs for details. Default is 0.
 *
 * @param {object} [options.point] point settings. Applies to points with ShaderMaterial.
 * See https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial for details.
 * The size of the point seems constant and does not depend on the distance to the camera.
 * @param {number} [options.point.size] The apparent angular size of a point in radians. Default is 0.02.
 * @param {object} [options.stats] Use JavaScript Performance Monitor. https://github.com/mrdoob/stats.js/ . Dafault is not defined.
 * 
 * @param {object} [options.scales] axes scales. Default is {}
 * @param {boolean} [options.scales.display] true - displays the label and scale of the axes. Default is false.
 * @param {number} [options.scales.precision] Formats a scale marks into a specified length. Default is 4
 *
 * @param {object} [options.scales.x] X axis options.
 * @param {number} [options.scales.x.zoomMultiplier] zoom multiplier. Default is 1.1
 * @param {number} [options.scales.x.offset] position offset. Default is 0.1
 * @param {string} [options.scales.x.name] axis name. Default is "X".
 * @param {number} [options.scales.x.min] Minimum range of the x axis. Default is -1.
 * @param {number} [options.scales.x.max] Maximum range of the x axis. Default is 1.
 * @param {number} [options.scales.x.marks] Number of x scale marks. Default is 5.
 *
 * @param {object} [options.scales.y] Y axis options.
 * @param {number} [options.scales.y.zoomMultiplier] zoom multiplier. Default is 1.1
 * @param {number} [options.scales.y.offset] position offset. Default is 0.1
 * @param {string} [options.scales.y.name] axis name. Default is "Y".
 * @param {number} [options.scales.y.min] Minimum range of the y axis. Default is -1.
 * @param {number} [options.scales.y.max] Maximum range of the y axis. Default is 1.
 * @param {number} [options.scales.y.marks] Number of y scale marks. Default is 5.
 *
 * @param {object} [options.scales.z] Z axis options.
 * @param {number} [options.scales.z.zoomMultiplier] zoom multiplier. Default is 1.1
 * @param {number} [options.scales.z.offset] position offset. Default is 0.1
 * @param {string} [options.scales.z.name] axis name. Default is "Z".
 * @param {number} [options.scales.z.min] Minimum range of the z axis. Default is -1.
 * @param {number} [options.scales.z.max] Maximum range of the z axis. Default is 1.
 * @param {number} [options.scales.z.marks] Number of z scale marks. Default is 5.
 *
 * @param {object} [options.scales.w] w axis options.
 * @param {number} [options.scales.w.zoomMultiplier] zoom multiplier. Default is 1.1
 * @param {number} [options.scales.w.offset] position offset. Default is 0.1
 * @param {string} [options.scales.w.name] axis name. Default is "W".
 * @param {number} [options.scales.w.min] Minimum range of the w axis. Default is -1.
 * @param {number} [options.scales.w.max] Maximum range of the w axis. Default is 1.
 *
 * @param {object} [options.scales.t] Animation time. Default is {}
 * @param {number} [options.scales.t.zoomMultiplier] zoom multiplier. Default is 2
 * @param {number} [options.scales.t.offset] position offset. Default is 1
 * @param {string} [options.scales.t.name] Time name. Default is "T".
 * @param {number} [options.scales.t.min] Animation start time. Default is 0.
 * @param {number} [options.scales.t.max] Animation stop time. Default is 1.
 * @param {number} [options.scales.t.marks] Number of scenes of 3D objects animation. Default is 2.
 * @param {boolean} [options.scales.t.repeat] true - Infinite repeat of animation.. Default is false.
 *
 * @todo If you want to use raycaster (working out what objects in the 3d space the mouse is over) https://threejs.org/docs/index.html#api/en/core/Raycaster,
 * please add following object into your 3D Object userdata:
 * your3dObject.userData.raycaster = {

		onIntersection: function ( raycaster, intersection, scene, INTERSECTED ) {

			//Mouse is over of your 3D object event
			//TO DO something
			//For example you can use
			options.addSpriteTextIntersection( intersection, scene );
			//for displaying of the position of your 3D object
			//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

		},
		onIntersectionOut: function ( scene, INTERSECTED ) {

			//Mouse is out of your 3D object event
			//TO DO something
			//For example you can use
			options.removeSpriteTextIntersection( scene );
			//for hide of the position of your 3D object that was displayed in onIntersection
			//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

		},
		onMouseDown: function ( raycaster, intersection, scene ) {

			//User has clicked over your 3D object
			//TO DO something
			//For example:
			var position = raycaster.stereo.getPosition( intersection );
			alert( 'You are clicked the "' + intersection.object.type + '" type object.'
				+ ( intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.' )
				+ ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )' );

		},

	}
 * Example: https://raw.githack.com/anhr/myThreejs/master/Examples/html/
 */
export function create( createXDobjects, options ) {

	var myThreejs = this;

	arrayCreates.push( {

		createXDobjects: createXDobjects,
		options: options,

	} );
	if ( arrayCreates.length > 1 )
		return;

	options = options || {};

	options.a = options.a || 1;
	options.b = options.b || 0;

	options.scale = 1;

	options.point = options.point || {};
	options.point.size = options.point.size || 5.0;

	options.scales = options.scales || {};
	function getAxis( axix, name, min, max ) {

		axix = axix || {};
		axix.name = axix.name || name;
		axix.min = axix.min !== undefined ? axix.min : min === undefined ? - 1 : min;
		axix.max = axix.max !== undefined ? axix.max : max === undefined ?   1 : max;
		return axix;

	}
	options.scales.x = getAxis( options.scales.x, 'X' );
	options.scales.y = getAxis( options.scales.y, 'Y' );
	options.scales.z = getAxis( options.scales.z, 'Z' );
	if ( options.scales.w === undefined )
		options.scales.w = { name: 'W', min: -1, max: 1 };
	options.scales.w = getAxis( options.scales.w, 'W', options.scales.w.min, options.scales.w.max );

	function setColorAttribute( attributes, i, color ) {

		if ( typeof color === "string" )
			color = new THREE.Color( color );
		var colorAttribute = attributes.color || attributes.ca;
		if ( colorAttribute === undefined )
			return;
		colorAttribute.setX( i, color.r );
		colorAttribute.setY( i, color.g );
		colorAttribute.setZ( i, color.b );
		colorAttribute.needsUpdate = true;

	}
	function traceLine() {

		//Thanks to https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
		var MAX_POINTS = options.player.marks,
			line;//, drawCount = 0;
		this.addPoint = function ( point, index, color ) {

			if ( line === undefined ) {


				// geometry
				var geometry = new THREE.BufferGeometry();

				// attributes
				var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				var colors = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
				geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

				// draw range
				geometry.setDrawRange( index, index );

				line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } ) );
				line.visible = true;
				scene.add( line );

			}

			//point position
			point = new THREE.Vector3().copy( point );
			point.toArray( line.geometry.attributes.position.array, index * line.geometry.attributes.position.itemSize );
			line.geometry.attributes.position.needsUpdate = true;

			//point color
			if ( color === undefined )
				color = new THREE.Color( 1, 1, 1 );//White
			setColorAttribute( line.geometry.attributes, index, color );

			//set draw range
			var start = line.geometry.drawRange.start, count = index + 1 - start;
			if ( start > index ) {

				var stop = start + line.geometry.drawRange.count;
				start = index;
				count = stop - start;

			}
			line.geometry.setDrawRange( start, count );

		}
		this.visible = function ( visible ) { line.visible = visible; }
		this.isVisible = function () { return line.visible; }
		this.remove = function () {

			if( line === undefined )
				return;
			line.geometry.dispose();
			line.material.dispose();
			scene.remove( line );

		}

	}

	function getCanvasName() {
		return typeof options.elContainer === "object" ?
			options.elContainer.id :
			typeof options.elContainer === "string" ?
				options.elContainer :
				'';
	}

	var camera, group, scene, canvas;

	function onloadScripts() {

		var elContainer = options.elContainer === undefined ? document.getElementById( "containerDSE" ) :
			typeof options.elContainer === "string" ? document.getElementById( options.elContainer ) : options.elContainer;
		if ( elContainer === null ) {

			if( typeof options.elContainer === "string" )
				console.warn( 'The ' + options.elContainer + ' element was not detected.' );
			elContainer = document.createElement( 'div' );
			document.querySelector( 'body' ).appendChild( elContainer );

		}
		arrayContainers.push( elContainer );
		elContainer.innerHTML = loadFile.sync( '/anhr/myThreejs/master/canvasContainer.html' );
		elContainer = elContainer.querySelector( '.container' );

		var defaultCameraPosition = new THREE.Vector3( 0.4, 0.4, 2 ),

		//ось z смотрит точно на камеру
		//camera.rotation = 0
		//Камера не повернута
		//camera.position.x = 0;
		//camera.position.y = 0;
		//camera.position.z = 2;
//		var defaultCameraPosition = new THREE.Vector3( 0, 0, 2 ),

		//ось x смотрит точно на камеру
		//camera.rotation.x = 0
		//camera.rotation.y = 1.5707963267948966 = PI / 2 = 90 degrees
		//camera.rotation.z = 0
		//Поворот камеры по оси y на 90 градусов
		//camera.position.x = 2;
		//camera.position.y = 0;
		//camera.position.z = 0;
//		var defaultCameraPosition = new THREE.Vector3( 2, 0, 0 ),
																	
//		var defaultCameraPosition = new THREE.Vector3( 0, 0.4, 2 ),
			renderer,

			cursor,//default

			controls, stereoEffect, player, frustumPoints,

			mouseenter = false,//true - мышка находится над gui или canvasMenu
			//В этом случае не надо обрабатывать событие elContainer 'mousedown'
			//по которому выбирается точка на canvas.
			//В противном случае если пользователь щелкнет на gui, то он может случайно выбрать точку на canvas.
			//Тогда открывается папка Meshs и все органы управления сдвигаются вниз. Это неудобно.
			//И вообще нехорошо когда выбирается точка когда пользователь не хочет это делать.

			canvasMenu, raycaster = new THREE.Raycaster(), INTERSECTED = [], scale = options.scale, axesHelper, colorsHelper = 0x80, fOptions,
			gui, rendererSizeDefault, cameraPosition,// fullScreen,

			//point size
			pointSize, defaultPoint = {},// defaultSize,

			stats,

			//uses only if stereo effects does not exists
			mouse = new THREE.Vector2(), intersects,

			//https://www.khronos.org/webgl/wiki/HandlingContextLost
			requestId,// gl, tex;

			cFrustumPoints;

		canvas = elContainer.querySelector( 'canvas' );
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		const gl = canvas.getContext( 'webgl' );

		//raycaster

		elContainer.addEventListener( 'mousemove', onDocumentMouseMove, false );
		elContainer.addEventListener( 'mousedown', onDocumentMouseDown, { capture: true } );

		function isFullScreen() {

			return canvasMenu.isFullScreen();

		}
		function onIntersection( intersects, mouse ) {

			intersects.forEach( function ( intersection ) {

				if ( intersection.object.userData.raycaster !== undefined ) {

					intersection.object.userData.raycaster.onIntersection( raycaster, intersection, scene, mouse );
					INTERSECTED.push( intersection.object );

				}

			} );

		}
		function onIntersectionOut( intersects ) {


			if ( INTERSECTED.length === 0 )
				return;
			INTERSECTED.forEach( function ( intersection ) {

				intersection.userData.raycaster.onIntersectionOut( scene, intersection );

			} );
			while ( INTERSECTED.length > 0 )
				INTERSECTED.pop();

		}

		//https://www.khronos.org/webgl/wiki/HandlingContextLost


		if ( typeof WebGLDebugUtils !== 'undefined' )
			canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas( canvas );

		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		canvas.addEventListener( "webglcontextlost", function ( event ) {

			event.preventDefault();
			if ( requestId !== undefined )
				window.cancelAnimationFrame( requestId );
			else console.error( 'myThreejs.create.onloadScripts: requestId = ' + requestId );
			clearThree( scene );
			raycaster = undefined;
			rendererSizeDefault.onFullScreenToggle( true );
			alert( lang.webglcontextlost );

		}, false );
		canvas.addEventListener( "webglcontextrestored", function () {

			console.warn( 'webglcontextrestored' );
			init();
			animate();

		}, false );

		//

		init();
		animate();

		function init() {

			// CAMERA

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( defaultCameraPosition );
			options.point.sizePointsMaterial = 100;//size of points with material is not ShaderMaterial is options.point.size / options.point.sizePointsMaterial

			// SCENE

			scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x000000 );
			scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

			//

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: canvas,

			} );
			renderer.setPixelRatio( window.devicePixelRatio );
			options.renderer = renderer;

			//resize
			renderer.setSizeOld = renderer.setSize;
			renderer.setSize = function ( width, height, updateStyle ) {

				renderer.setSizeOld( width, height, updateStyle );

				timeoutControls = setTimeout( function () {

					elContainer.style.height = canvas.style.height;
					elContainer.style.width = canvas.style.width;
					elContainer.style.left = canvas.style.left;
					elContainer.style.top = canvas.style.top;
					elContainer.style.position = canvas.style.position;

					if ( canvasMenu !== undefined )
						canvasMenu.setSize( width, height );

				}, 0 );

			};
			renderer.setSize( ( options.canvas !== undefined ) && ( options.canvas.width !== undefined ) ? options.canvas.width : canvas.clientWidth,
				( options.canvas !== undefined ) && ( options.canvas.height !== undefined ) ? options.canvas.height : canvas.clientHeight );

			//StereoEffect. https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
			if ( options.stereoEffect ) {

				var cookieName = getCanvasName();
				stereoEffect = new StereoEffect( renderer, {

					spatialMultiplex: spatialMultiplexsIndexs.Mono, //.SbS,
					far: camera.far,
					camera: camera,
					stereoAspect: 1,
					cookie: cookie,
					cookieName: cookieName === '' ? '' : '_' + cookieName,
					elParent: canvas.parentElement,

				} );
				stereoEffect.options.spatialMultiplex = spatialMultiplexsIndexs.Mono;

			}

			//Light

			//A light that gets emitted from a single point in all directions.
			function pointLight() {

				var strLight = 'mathBoxLight',
					light,// = scene.getObjectByName( strLight ),
					position = new THREE.Vector3( 0.5 * options.scale, 0.5 * options.scale, 0.5 * options.scale ), controllers = {},
					axesEnum = THREE.AxesHelperOptions.axesEnum, multiplier = 2 * options.scale;

				function isLight() {

					return light !== undefined;

				}
				this.add = function ( positionCur ) {

					position = positionCur || position;
					if ( !isLight() ) {

						light = new THREE.PointLight( 0xffffff, 1 );
						light.position.copy( position );
						light.name = strLight;
						scene.add( light );

					}// else console.error( 'duplicate ' + strLight );
					return light;

				};
				this.remove = function () {

					if ( light == undefined )
						return;
					scene.remove( light );
					//delete light;//Parsing error: Deleting local variable in strict mode
					light = undefined;

				};
				this.controls = function ( group, folder, scales, folderName ) {

					if ( folder === undefined )
						return;

					var fLight = folder.addFolder( folderName || lang.light ),
						lightSource;

					//displayLight
					dat.controllerNameAndTitle( fLight.add( { display: false }, 'display' ).onChange( function ( value ) {

						if ( value ) {

							function getPoints( pointVerticesSrc, color ) {

								var geometry = Array.isArray( pointVerticesSrc ) ?
									new THREE.BufferGeometry().setFromPoints( pointVerticesSrc ) : pointVerticesSrc;
								var threshold = 0.05 * options.scale;
								return new THREE.Points( geometry,
									new THREE.PointsMaterial( {

										color: color === undefined ? 0xffffff : color,
										//map: texture,
										size: threshold,
										alphaTest: 0.5

									} ) );

							}
							lightSource = getPoints( [light.position] );
							group.add( lightSource );

						} else {

							group.remove( lightSource );
							//delete lightSource;//Parsing error: Deleting local variable in strict mode
							lightSource = undefined;

						}

					} ), lang.displayLight, lang.displayLightTitle );

					//move light
					function guiLightAxis( axesId ) {

						var axesName = axesEnum.getName( axesId );
						controllers[axesId] =
							fLight.add( light.position, axesName, scales[axesName].min * multiplier, scales[axesName].max * multiplier )
								.onChange( function ( value ) {

									if ( lightSource === undefined )
										return;

									lightSource.geometry.attributes.position.array[axesId] = value;
									lightSource.geometry.attributes.position.needsUpdate = true;

								} );
						dat.controllerNameAndTitle( controllers[axesId], options.scales[axesName].name );

					}
					guiLightAxis( axesEnum.x );
					guiLightAxis( axesEnum.y );
					guiLightAxis( axesEnum.z );

					var restore = {

						restore: function () {

							controllers[axesEnum.x].setValue( position.x );
							controllers[axesEnum.y].setValue( position.y );
							controllers[axesEnum.z].setValue( position.z );

						}
					};
					dat.controllerNameAndTitle( fLight.add( restore, 'restore' ), lang.defaultButton, lang.restoreLightTitle );

				};
				this.windowRange = function ( scales ) {

					function setLimits( axisId ) {

						var axisName = axesEnum.getName( axisId );
						controllers[axisId].max( scales[axisName].max * multiplier );
						controllers[axisId].min( scales[axisName].min * multiplier );

					}
					setLimits( axesEnum.x );
					setLimits( axesEnum.y );
					setLimits( axesEnum.z );
				}
				return this;

			};
			var pointLight1 = new pointLight();
			pointLight1.add( new THREE.Vector3( 2 * options.scale, 2 * options.scale, 2 * options.scale ) );
			var pointLight2 = new pointLight();
			pointLight2.add( new THREE.Vector3( -2 * options.scale, -2 * options.scale, -2 * options.scale ) );

			//item.material.size is NaN if item.material is ShaderMaterial
			//Влияет только на точки без ShaderMaterial
			raycaster.params.Points.threshold = 0.01;
			if ( raycaster.setStereoEffect !== undefined )
				raycaster.setStereoEffect( {

					renderer: renderer,
					camera: camera,
					stereoEffect: stereoEffect,
					onIntersection: onIntersection,
					onIntersectionOut: onIntersectionOut,
					onMouseDown: function ( intersects ) {

						var intersection = intersects[0];
						if (
							( intersection.object.userData.raycaster !== undefined )
							&& ( intersection.object.userData.raycaster.onMouseDown !== undefined ) ) {

							intersection.object.userData.raycaster.onMouseDown( raycaster, intersection, scene );

						}
						if ( ( intersection.object.userData.isInfo !== undefined ) && !intersection.object.userData.isInfo() )
							return;//No display information about frustum point
						options.guiSelectPoint.select( intersection );
						if ( ( intersection.object.type === "Points" ) && ( axesHelper !== undefined ) )
							axesHelper.exposePosition( getPosition( intersection ) );

					}

				} );
			options.addParticle = function ( item ) {

				if ( raycaster.stereo !== undefined )
					raycaster.stereo.addParticle( item );

			}
			options.removeParticle = function ( item ) {

				if ( raycaster.stereo !== undefined )
					raycaster.stereo.removeParticle( item );

			}

			//

			group = new THREE.Group();
			scene.add( group );
			function guiSelectPointF() {

				var f3DObjects, fPoint, cRestoreDefaultLocalPosition, fPointWorld, fPoints, cMeshs, fMesh,// mesh,
					intersection, _this = this,
					cScaleX, cScaleY, cScaleZ, cPosition = new THREE.Vector3(), cRotations = new THREE.Vector3(),
					cPoints, selectedPointIndex = -1,
					controllerX, controllerY, controllerZ, controllerW, cTrace, cTraceAll, controllerColor, controllerOpacity,
					controllerWorld = new THREE.Vector3(),
					boSetMesh = false;//Для предотвращения лишних вызовов exposePosition если выбрать точку и передвинуть камеру с помошью OrbitControls,
				if ( options.arrayCloud )//Array of points with cloud
					cFrustumPoints = new cFrustumPointsF( _this );
				//сейчас exposePosition вызывается только один раз из this.setMesh
				function dislayEl( controller, displayController ) {

					if ( controller === undefined )
						return;
					if ( typeof displayController == "boolean" )
						displayController = displayController ? 'block' : 'none';
					var el = controller.domElement;
					while ( el.tagName.toUpperCase() !== "LI" ) el = el.parentElement;
					el.style.display = displayController;

				}

				function visibleTraceLine( intersection, value ) {

					if ( intersection.object.userData.arrayFuncs === undefined )
						return;
					var index = intersection.index || 0,
						point = intersection.object.userData.arrayFuncs[index],
						line = point === undefined ? undefined : point.line;
					if ( line !== undefined )
						line.visible( value );
					if ( !value )
						return;
					if ( point.line !== undefined )
						return;
					point.line = new traceLine();

					//color
					var color = intersection.object.geometry.attributes.color;
					if ( color === undefined )
						color = new THREE.Color( 0xffffff );//white
					else {
						var vector = new THREE.Vector3().fromArray( color.array, index * color.itemSize )
						color = new THREE.Color( vector.x, vector.y, vector.z );
					}

					point.line.addPoint(

						getObjectPosition( getMesh(), index ),
						player.getSelectSceneIndex(),
						color

					);

				}
				function exposePosition( selectedPointIndex ) {

					if ( selectedPointIndex === undefined )
						selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();//Эта строка слишком медленно выполняется если число точек frustumPoints велико
					//Поэтому selectedPointIndex беру из intersection.index индекс точки, над которй щелнул мышью
					if ( selectedPointIndex === -1 )
						return;

					var position = getObjectPosition( cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh, selectedPointIndex );

					if ( ( axesHelper !== undefined ) )

						// && ( ( mesh.userData.isInfo === undefined ) || ( mesh.userData.isInfo() ) ) )
						//если делать эту проверку, то будут неправильно отображаться пунктирные линии для frustumPoints точки
						//когда в настройках frustumPoints не стоит галочка info
						//когда в gui пользователь выбрал точку frustumPoints из списка '3D objects'(этот пункт будет недоступен когда я уберу frustumPoints из списка '3D objects' когда в настройках frustumPoints не стоит галочка info)
						//и когда пользователь передвигает камеру с помощью orbitControls

						axesHelper.exposePosition( position );

					controllerWorld.x.setValue( position.x );
					controllerWorld.y.setValue( position.y );
					controllerWorld.z.setValue( position.z );

				}
				function setValue( controller, v ) {

					var input = controller.domElement.querySelector( 'input' ),
						readOnly = input.readOnly;
					input.readOnly = false;
					controller.object[controller.property] = v;
					if ( controller.__onChange )
						controller.__onChange.call( controller, v );
					controller.initialValue = v;
					controller.updateDisplay();
					input.readOnly = readOnly;
					return controller;

				}
				function setPosition( intersectionSelected ) {

					var positionLocal = getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
					setValue( controllerX, positionLocal.x );
					setValue( controllerY, positionLocal.y );
					setValue( controllerZ, positionLocal.z );

					var position = getObjectPosition( intersectionSelected.object, intersectionSelected.index );
					setValue( controllerWorld.x, position.x );
					setValue( controllerWorld.y, position.y );
					setValue( controllerWorld.z, position.z );

					var displayControllerW, displayControllerColor, displayControllerOpacity, none = 'none', block = 'block';
if( typeof intersection.object.userData.arrayFuncs === "function" )
	console.error( 'arrayFuncs === "function" under constraction' );
					var func = intersectionSelected.object.userData.arrayFuncs[intersectionSelected.index],
						opasity,
						color = func === undefined ?
							undefined :
							Array.isArray( func.w ) || ( typeof func.w === "function" ) ?
								execFunc( func, 'w', group.userData.t, options.a, options.b ) :
								func.w;

					if ( color === undefined ) {

						if ( intersectionSelected.object.geometry.attributes.ca === undefined )
							console.error( 'Under constraction. цвет frustumPoints не известен потому что он вычисляется в шейдере D:\My documents\MyProjects\webgl\three.js\GitHub\myThreejs\master\frustumPoints\vertex.c' )
						else {

							var vColor = new THREE.Vector4().fromArray(
								intersectionSelected.object.geometry.attributes.ca.array,
								intersectionSelected.index * intersectionSelected.object.geometry.attributes.ca.itemSize );
							color = new THREE.Color( vColor.x, vColor.y, vColor.z );
							opasity = vColor.w;

						}

					}

					if ( color instanceof THREE.Color ) {

						displayControllerW = none;
						displayControllerColor = block;
						displayControllerOpacity = block;

						//color
						if ( intersectionSelected.object.userData.arrayFuncs === undefined ) {

							displayControllerColor = none;
							displayControllerOpacity = none;

						} else {

							var strColor = '#' + color.getHexString();
							//Сначала надо установить initialValue потому что для FrustumPoints я устанвил readOnly для controllerColor.
							//В этом случае я не могу отобразить цвет следующей точки FrustumPoints потому что в режиме readOnly
							//при изменении цвета восстанвливается старый цвет из initialValue.
							controllerColor.initialValue = strColor;
							controllerColor.setValue( strColor );
							controllerColor.userData = { intersection: intersectionSelected, };
							if ( opasity !== undefined ) {

								setValue( controllerOpacity, opasity );

							} else displayControllerOpacity = none;
							controllerOpacity.userData = { intersection: intersectionSelected, };

						}

					} else {

						if ( controllerW === undefined )
							displayControllerW = none;
						else {

							if ( color === undefined )
								displayControllerW = none;
							else {

								setValue( controllerW, color );
								displayControllerW = block;

							}

						}
						displayControllerColor = none;
						displayControllerOpacity = none;

					}
					dislayEl( controllerW, displayControllerW );
					dislayEl( controllerColor, displayControllerColor );
					dislayEl( controllerOpacity, displayControllerOpacity );

					var boReadOnly = intersectionSelected.object.userData.boFrustumPoints === true ? true : false;
					controllerX.domElement.querySelector( 'input' ).readOnly = boReadOnly;
					controllerY.domElement.querySelector( 'input' ).readOnly = boReadOnly;
					controllerZ.domElement.querySelector( 'input' ).readOnly = boReadOnly;
					controllerW.domElement.querySelector( 'input' ).readOnly = boReadOnly;
					controllerColor.domElement.querySelector( 'input' ).readOnly = boReadOnly;
					controllerOpacity.domElement.querySelector( 'input' ).readOnly = boReadOnly;
					
				}
				this.setMesh = function () {

					boSetMesh = true;
					setScaleControllers();
					setPositionControllers();
					setRotationControllers();
					exposePosition();
					boSetMesh = false;

				}
				this.setPosition = function ( position, intersectionSelected ) {

					for ( var i = 0; i < cMeshs.__select.length; i++ ) {

						var option = cMeshs.__select[i];
						//						if ( option.selected && ( parseInt( option.getAttribute( 'value' ) ) === intersectionSelected.object.userData.index - 1 ) )
						if ( option.selected && Object.is( option.mesh, intersectionSelected.object ) ) {

							setPosition( intersectionSelected );

						}

					}

				}
				this.getMeshIndex = function ( mesh ) {

					if ( mesh === undefined )
						return mesh;
					var index;// = intersectionSelected.object.userData.index;
					for ( index = 0; index < cMeshs.__select.options.length; index++ ) {

						var option = cMeshs.__select.options[index];
						if ( Object.is( option.mesh, mesh ) )
							return index;

					}
					console.error( 'Invalid mesh "' + mesh.name + '" index' );

				}
				this.setIndexMesh = function ( index, mesh ) {

					if ( index === undefined )
						return;
					cMeshs.__select.options[index].mesh = mesh;
					this.selectPoint( -1 );

				}
				this.selectPoint = function ( index ) {

					cPoints.__onChange( index );
					cPoints.__select[index + 1].selected = true;

				}
				/**
				 * removes a mesh from the select point GUI
				 * @param {THREE.Mesh} mesh mesh for removing.
				 */
				this.removeMesh = function ( mesh ) {

					var index = this.getMeshIndex( mesh ),
						selectedIndex = cMeshs.__select.selectedIndex;
					cMeshs.__select.remove( index );
					if ( selectedIndex === index ) {

						cPoints.__onChange( -1 );
						_this.removePoints();

					}

				}
				/**
				 * adds new mesh into select point GUI
				 * @param {THREE.Mesh} mesh new mesh.
				 */
				this.addMesh = function ( mesh ) {

					if ( !options.dat )
						return;
					if ( mesh.userData.boFrustumPoints ) {

						for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

							var option = cMeshs.__select.options[i];
							if ( ( option.mesh !== undefined ) && option.mesh.userData.boFrustumPoints )
								return;//duplicate FrustumPoints. Сюда попадает когда пользователь меняет количество слоев или Y точек в FrustumPoints. 

						}

					}
					var opt = document.createElement( 'option' );
					opt.innerHTML = cMeshs.__select.length + ' ' + ( mesh.name === '' ? mesh.constructor.name : mesh.name );
					opt.mesh = mesh;
					cMeshs.__select.appendChild( opt );

				}
				this.select = function ( intersectionSelected ) {

					if ( !options.dat )
						return;
					var position = getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
					if ( f3DObjects === undefined ) {

						console.error( 'Не знаю как сюда попасть' );

					}

					//f3DObjects.close();//если тут не закрывать папку, то ингода прорпадает скроллинг окна dat.GUI
					//for testing:
					//Open https://raw.githack.com/anhr/myThreejs/master/Examples/html/
					//Set browser window height about 500 pixels.
					//Click Full Screen button.
					//Open Controls
					//Click a point.The "Meshs" folder opens and you can see the scrolling of the dat.gui window.

					//select mesh
					var index = this.getMeshIndex( intersectionSelected.object );
					if ( cMeshs.__select[index].selected === false ) {

						cMeshs.__select[index].selected = true;
						cMeshs.__onChange( index - 1 );

					}

					this.selectPoint2 = function ( selectedMesh ) {

						if ( ( options.guiSelectPoint.renderPhase !== undefined ) && ( options.guiSelectPoint.renderPhase !== options.guiSelectPoint.renderPhaseEnum.ready ) )
							return;
						if ( ( intersectionSelected.index === undefined ) || isNaN( intersectionSelected.index ) )
							return;

						//сделал эту проверку потому что не могу придумать как удалить intersectionSelected.index когда пользователь врусную сменил mesh
						if ( ( selectedMesh !== undefined ) && !Object.is( intersectionSelected.object, selectedMesh ) )
							return;//Сначала пользователь выбрал точку с помошщью мыши
						//Потом сменил Meshs/Select

						if ( !intersectionSelected.object.userData.boFrustumPoints ) {

							//fPoints.open();много времени на открытие когда много точек
							cPoints.__select[intersectionSelected.index + 1].selected = true;

						} else {//FrustumPoints
						
							cFrustumPoints.pointIndexes( intersectionSelected.object.userData.pointIndexes( intersectionSelected.index ) );
							
						}
						var block = 'block';
						fPoint.domElement.style.display = block;
						fPointWorld.domElement.style.display = block;
						intersection = intersectionSelected;
						setPosition( intersectionSelected );

						var mesh = getMesh();
						var line = ( mesh.userData.arrayFuncs === undefined ) || (typeof intersection.object.userData.arrayFuncs === "function" ) ?
							undefined :
							mesh.userData.arrayFuncs[intersectionSelected.index].line;//You can not trace points if you do not defined the mesh.userData.arrayFuncs
						cTrace.setValue( line === undefined ? false : line.isVisible() )

						cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display =
							intersection.object.userData.arrayFuncs === undefined ? 'none' : block;

					}
					this.selectPoint2();

				}
				this.isSelectedMesh = function ( meshCur ) { return getMesh() === meshCur }
				this.getSelectedPointIndex = function () {

					if ( ( cFrustumPoints !== undefined ) &&
						cFrustumPoints.isDisplay() &&//FrustumPoints folder id not visible
						frustumPoints.isDisplay()//The cDisplay checkbox of the frustumPoints' is checked
					) {

						var selectedIndex = cFrustumPoints.getSelectedIndex();
						return selectedIndex === null ? - 1 : selectedIndex;

					}
					if ( cPoints === undefined ) {

						if ( selectedPointIndex === undefined )
							console.error( 'myThreejs.create.onloadScripts.init.guiSelectPoint.getSelectedPointIndex:  selectedPointIndex = ' + selectedPointIndex );
						return selectedPointIndex;//options.dat !== true and gui === undefined. Do not use dat.gui

					}
					var index = cPoints.__select.selectedOptions[0].index;
					return index - 1;

				}
				function getMesh() {

					var selectedIndex = cMeshs.__select.options.selectedIndex;
					if ( selectedIndex !== -1 )
						return cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
					return undefined;

				}
				function isNotSetControllers() {

					return ( getMesh() === undefined )
						|| ( gui === undefined )
						//					|| !mesh.userData.boFrustumPoints//не помню зачем это поставил
						;
				}
				function setScaleControllers() {

					if ( isNotSetControllers() )
						return;
					var mesh = getMesh();
					cScaleX.setValue( mesh.scale.x );
					cScaleY.setValue( mesh.scale.y );
					cScaleZ.setValue( mesh.scale.z );

				}
				function setPositionControllers() {

					if ( isNotSetControllers() )
						return;
					var mesh = getMesh();
					cPosition.x.setValue( mesh.position.x );
					cPosition.y.setValue( mesh.position.y );
					cPosition.z.setValue( mesh.position.z );

				}
				function setRotationControllers() {

					if ( isNotSetControllers() )
						return;
					var mesh = getMesh();
					cRotations.x.setValue( mesh.rotation.x );
					cRotations.y.setValue( mesh.rotation.y );
					cRotations.z.setValue( mesh.rotation.z );

				}
				this.add = function ( folder ) {

					f3DObjects = folder.addFolder( lang.meshs );

					cMeshs = f3DObjects.add( { Meshs: lang.notSelected }, 'Meshs', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

						value = parseInt( value );
						var mesh = getMesh();
						var display;
						if ( mesh === undefined ) {

							display = 'none';
							mesh = undefined;
							if ( axesHelper !== undefined )
								axesHelper.exposePosition( getObjectPosition( getMesh(), value ) );

						} else {

							display = 'block';
							var displayPoints = 'none', displayFrustumPoints = 'block';

							cPoints.__onChange( -1 );
							_this.removePoints();

							if ( mesh.userData.controllers !== undefined ) {

								//FrustumPoints
								mesh.userData.controllers();// cFrustumPoints );

							} else {

								displayPoints = 'block';
								displayFrustumPoints = 'none';

								//заполеение списка точек может занять много времени. Например когда пользователь выбрал frustumPoint.
								//Что бы веб страница не замирала на это время я разбиваю долгий процесс на фазы
								//которые могут меняться во время вызова options.guiSelectPoint.render(); из myThreejs render()
								//Во время фазы renderPhaseEnum.start курсор мыши меняется на 'progress'
								options.guiSelectPoint.renderPhaseEnum = { start: 0, progress: 1, ready: 3 };
								options.guiSelectPoint.renderPhase = options.guiSelectPoint.renderPhaseEnum.start;

								var iPosition;

								options.guiSelectPoint.render = function () {

									switch ( options.guiSelectPoint.renderPhase ) {

										case options.guiSelectPoint.renderPhaseEnum.start:

											cursor = renderer.domElement.style.cursor;
											renderer.domElement.style.cursor = 'progress';
											renderer.cursor = renderer.domElement.style.cursor;//эта строка нужна что бы новый курсор оставался при движении мыши
											options.guiSelectPoint.renderPhase = options.guiSelectPoint.renderPhaseEnum.progress;
											iPosition = 0;
											break;

										case options.guiSelectPoint.renderPhaseEnum.progress:

											var i = iPosition + 10000;
											//console.warn( 'iPosition = ' + iPosition );
											//Если после каждого входа на эту линию добавлять только один option
											//то время запонения cPoints будет очень большим.
											//Если добавлять все option сразу, то курсор не всегда будет меняться на 'progress'.
											//В этом случае, что бы курсор поменялся на 'progress',
											//надо будет быстро подвинуть курсор мыши сразу после щелчка на точке.
											while ( iPosition < i ) {

												if ( iPosition < mesh.geometry.attributes.position.count ) {

													var opt = document.createElement( 'option' ),
														name = mesh.userData.arrayFuncs === undefined ?
															undefined :
															mesh.userData.pointName === undefined ?
																typeof mesh.userData.arrayFuncs === "function" ?
																	undefined :
																	mesh.userData.arrayFuncs[iPosition].name :
																mesh.userData.pointName( iPosition );
													opt.innerHTML = iPosition + ( name === undefined ? '' : ' ' + name );
													opt.setAttribute( 'value', iPosition );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
													cPoints.__select.appendChild( opt );
													iPosition++;

												} else {

													renderer.domElement.style.cursor = cursor;
													renderer.cursor = undefined;
													options.guiSelectPoint.renderPhase = options.guiSelectPoint.renderPhaseEnum.ready;
													options.guiSelectPoint.render = undefined;

													if ( options.guiSelectPoint.selectPoint2 !== undefined )
														options.guiSelectPoint.selectPoint2( mesh );
													break;

												}

											}
/*											
console.warn( 'addPoints start. cursor: ' + renderer.domElement.style.cursor );
											for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {
										
												var opt = document.createElement( 'option' ),
													name = mesh.userData.arrayFuncs === undefined ? undefined : mesh.userData.arrayFuncs[i].name;
												opt.innerHTML = i + ( name === undefined ? '' : ' ' + name );
												opt.setAttribute( 'value', i );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
												cPoints.__select.appendChild( opt );
										
											}
										
console.warn( 'addPoints end. cursor: ' + renderer.domElement.style.cursor );
											renderer.domElement.style.cursor = cursor;
											renderer.cursor = undefined;
											options.guiSelectPoint.renderPhase = options.guiSelectPoint.renderPhaseEnum.ready;
											options.guiSelectPoint.render = undefined;
										
											options.guiSelectPoint.selectPoint2( mesh );
*/
											break;

										default: console.error( 'Invalid renderPhase = ' + options.guiSelectPoint.renderPhase );

									}

								}

							}
							cPoints.domElement.parentElement.parentElement.style.display = displayPoints;
							cTraceAll.domElement.parentElement.parentElement.style.display = displayPoints;
							if ( cFrustumPoints !== undefined )
								cFrustumPoints.display( displayFrustumPoints );

							setScaleControllers();
							setPositionControllers();
							setRotationControllers();

						}
						fMesh.domElement.style.display = display;

						if ( ( mesh !== undefined ) && ( mesh.userData.traceAll !== undefined ) )
							cTraceAll.setValue( mesh.userData.traceAll );

					} );
					dat.controllerNameAndTitle( cMeshs, lang.select );

					fMesh = f3DObjects.addFolder( lang.mesh );
					fMesh.domElement.style.display = 'none';
					fMesh.open();

					//Scale

					var fScale = fMesh.addFolder( lang.scale );
					fScale.add( new ScaleController( function ( customController, action ) {

						var zoom = customController.controller.getValue();
						mesh.scale.x = action( mesh.scale.x, zoom );
						mesh.scale.y = action( mesh.scale.y, zoom );
						mesh.scale.z = action( mesh.scale.z, zoom );
						mesh.needsUpdate = true;

						setScaleControllers();
						exposePosition();

					},
						{

							settings: { zoomMultiplier: 1.1, },
							getLanguageCode: getLanguageCode,

						} ) );
					var scale = new THREE.Vector3();
					function setScale( axesName, value ) {

						mesh.scale[axesName] = value;
						mesh.needsUpdate = true;
						exposePosition();

					}
					cScaleX = dat.controllerZeroStep( fScale, scale, 'x', function ( value ) { setScale( 'x', value ); } );
					dat.controllerNameAndTitle( cScaleX, options.scales.x.name );
					cScaleY = dat.controllerZeroStep( fScale, scale, 'y', function ( value ) { setScale( 'y', value ); } );
					dat.controllerNameAndTitle( cScaleY, options.scales.y.name );
					cScaleZ = dat.controllerZeroStep( fScale, scale, 'z', function ( value ) { setScale( 'z', value ); } );
					dat.controllerNameAndTitle( cScaleZ, options.scales.z.name );

					//Default scale button
					dat.controllerNameAndTitle( fScale.add( {

						defaultF: function ( value ) {

							mesh.scale.copy( mesh.userData.default.scale );
							mesh.needsUpdate = true;

							setScaleControllers();
							exposePosition();

						},

					}, 'defaultF' ), lang.defaultButton, lang.defaultScaleTitle );

					//Position

					var fPosition = fMesh.addFolder( lang.position );

					function addAxisControllers( name ) {

						var axesName = options.scales[name].name,
							f = fPosition.addFolder( axesName );
						f.add( new PositionController( function ( shift ) {

							mesh.position[name] += shift;
							mesh.needsUpdate = true;

							setPositionControllers();
							exposePosition();

						}, { getLanguageCode: getLanguageCode, } ) );

						function setPosition( value ) {

							mesh.position[name] = value;
							mesh.needsUpdate = true;
							exposePosition();

						}
						var position = new THREE.Vector3();

						cPosition[name] = dat.controllerZeroStep( f, position, name, function ( value ) { setPosition( value ); } );
						dat.controllerNameAndTitle( cPosition[name], axesName );

					}
					addAxisControllers( 'x' );
					addAxisControllers( 'y' );
					addAxisControllers( 'z' );

					//Restore default position.
					dat.controllerNameAndTitle( fPosition.add( {

						defaultF: function ( value ) {

							mesh.position.copy( mesh.userData.default.position );
							mesh.needsUpdate = true;

							setPositionControllers();
							exposePosition();

						},

					}, 'defaultF' ), lang.defaultButton, lang.defaultPositionTitle );

					//rotation

					var fRotation = fMesh.addFolder( lang.rotation );
					function addRotationControllers( name ) {

						cRotations[name] = fRotation.add( new THREE.Vector3(), name, 0, Math.PI * 2, 1 / 360 ).
							onChange( function ( value ) {

								var mesh = getMesh();
								if ( !mesh.userData.boFrustumPoints ) {

									mesh.rotation[name] = value;
									mesh.needsUpdate = true;

								}

								if ( !boSetMesh )
									exposePosition();

							} );
						dat.controllerNameAndTitle( cRotations.x, options.scales.x.name );

					}
					addRotationControllers( 'x' );
					addRotationControllers( 'y' );
					addRotationControllers( 'z' );

					//Default rotation button
					dat.controllerNameAndTitle( fRotation.add( {

						defaultF: function ( value ) {

							mesh.rotation.copy( mesh.userData.default.rotation );
							mesh.needsUpdate = true;

							setRotationControllers();
							exposePosition();

						},

					}, 'defaultF' ), lang.defaultButton, lang.defaultRotationTitle );

					//Points

					fPoints = fMesh.addFolder( lang.points );

					cPoints = fPoints.add( { Points: lang.notSelected }, 'Points', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

						value = parseInt( value );
						var display, position;
						if ( value === -1 ) {

							display = 'none';

						} else {

							display = 'block';
							_this.select( { object: getMesh(), index: value } );

						}
						if ( axesHelper !== undefined )
							axesHelper.exposePosition( getObjectPosition( getMesh(), value ) );
						fPoint.domElement.style.display = display;
						fPointWorld.domElement.style.display = display;

					} );
					cPoints.__select[0].selected = true;
					dat.controllerNameAndTitle( cPoints, lang.select );
					if ( cFrustumPoints !== undefined )
						cFrustumPoints.create( fPoints, getLanguageCode() );
					myThreejs.cFrustumPoints = cFrustumPoints;

					//Points attribute position
					fPoint = fPoints.addFolder( lang.point );
					dat.folderNameAndTitle( fPoint, lang.point, lang.pointTitle );
					fPoint.domElement.style.display = 'none';
					//					fPoint.open();

					//Points world position
					fPointWorld = fPoints.addFolder( lang.pointWorld );
					dat.folderNameAndTitle( fPointWorld, lang.pointWorld, lang.pointWorldTitle );
					fPointWorld.domElement.style.display = 'none';
					fPointWorld.open();

					//displays the trace of the movement of all points of the mesh
					cTraceAll = fPoints.add( { trace: false }, 'trace' ).onChange( function ( value ) {

						var mesh = getMesh();
						mesh.userData.traceAll = value;
						for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ )
							visibleTraceLine( { object: mesh, index: i }, value );
						cTrace.setValue( value );

					} );
					dat.controllerNameAndTitle( cTraceAll, lang.trace, lang.traceAllTitle );
					dislayEl( cTraceAll, options.player === undefined ? false : true );

					//Restore default settings of all 3d objects button.
					dat.controllerNameAndTitle( f3DObjects.add( {

						defaultF: function ( value ) {

							group.children.forEach( function ( mesh ) {

								mesh.scale.copy( mesh.userData.default.scale );
								mesh.position.copy( mesh.userData.default.position );
								mesh.rotation.copy( mesh.userData.default.rotation );
								mesh.needsUpdate = true;

							} );
							setScaleControllers();
							setPositionControllers();
							setRotationControllers();
							exposePosition();

						},

					}, 'defaultF' ), lang.defaultButton, lang.default3DObjectTitle );

				}
				this.removePoints = function () {

					//thanks to https://stackoverflow.com/a/48780352/5175935
					cPoints.domElement.querySelectorAll( 'select option' ).forEach( option => option.remove() );
					var opt = document.createElement( 'option' );
					opt.innerHTML = lang.notSelected;
					opt.setAttribute( 'value', -1 );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
					cPoints.__select.appendChild( opt );

				}
				this.addControllers = function () {

					for ( var i = 0; i < group.children.length; i++ ) {

						var mesh = group.children[i];
						if ( mesh instanceof THREE.Group )
							continue;
						this.addMesh( mesh );

					}

					function isReadOnlyController( controller ) {

						if ( controller.domElement.querySelector( 'input' ).readOnly ) {

							if ( controller.getValue() !== controller.initialValue ) {

								if ( controller.boSetValue === undefined ) {

									controller.boSetValue = true;
									setValue( controller, controller.initialValue );
									controller.boSetValue = undefined;
									controller.initialValue = controller.getValue();//Эта строка нужна в случае когда новое зачения невозможно установиь точно таким же, как initialValue
													//Иначе перепонится стек

								}

							}
							return true;

						}
						return false;

					}

					//Point's attribute position axes controllers

					function axesGui( axesId, onChange ) {

						var axesName, scale, controller;
						if ( axesId > axesEnum.z ) {

							//W axis
							if ( options.scales.w === undefined )
								return;
							scale = options.scales.w;
							controller = fPoint.add( {

								value: scale.min,

							}, 'value',
								scale.min,
								scale.max,
								( scale.max - scale.min ) / 100 ).
								onChange( function ( value ) {

									var color = palette.toColor( value, controller.__min, controller.__max ),
										attributes = intersection.object.geometry.attributes,
										i = intersection.index;
									setColorAttribute( attributes, i, color );

								} );
							controller.domElement.querySelector( '.slider-fg' ).style.height = '40%';
							var elSlider = controller.domElement.querySelector( '.slider' );
							ColorPicker.create( elSlider, {

								palette: palette,
								style: {

									//border: '2px solid #303030',
									//width: '65%',
									//height: elSlider.offsetHeight / 2,//'50%',

								},
								onError: function ( message ) { alert( 'Colorpicker error: ' + message ); }

							} );
						} else {

							axesName = axesEnum.getName( axesId );

							scale = axesHelper === undefined ? options.scales[axesName] : //если я буду использовать эту строку то экстремумы шкал буду устанавливатся по умолчанию а не текущие
								axesHelper.options.scales[axesName];
							controller = fPoint.add( {

								value: scale.min,

							}, 'value',
								scale.min,
								scale.max,
								( scale.max - scale.min ) / 100 ).
								onChange( function ( value ) {

									if ( isReadOnlyController( controller ) )
										return;
									var points = intersection.object;
									points.geometry.attributes.position.array
									[axesId + intersection.index * points.geometry.attributes.position.itemSize] = value;
									points.geometry.attributes.position.needsUpdate = true;

									exposePosition( intersection.index );

								} );

						}
						dat.controllerNameAndTitle( controller, scale.name );
						return controller;

					}
					var axesEnum = THREE.AxesHelperOptions.axesEnum;
					controllerX = axesGui( axesEnum.x );
					controllerY = axesGui( axesEnum.y );
					controllerZ = axesGui( axesEnum.z );
					controllerW = axesGui( axesEnum.w );
					controllerColor = fPoint.addColor( {

						color: '#FFFFFF',

					}, 'color' ).
						onChange( function ( value ) {

							if ( isReadOnlyController( controllerColor ) )
								return;
							if ( controllerColor.userData === undefined )
								return;
							var intersection = controllerColor.userData.intersection;
							setColorAttribute( intersection.object.geometry.attributes, intersection.index, value );

						} );
					dat.controllerNameAndTitle( controllerColor, lang.color );
					controllerOpacity = fPoint.add( {

						opasity: 1,

					}, 'opasity', 0, 1, 0.01 ).
						onChange( function ( opasity ) {

							if ( isReadOnlyController( controllerOpacity ) )
								return;
							var intersection = controllerColor.userData.intersection;
							var points = intersection.object;
							if ( points.geometry.attributes.ca === undefined )
								return;//no opasity
							points.geometry.attributes.ca.array
							[3 + intersection.index * points.geometry.attributes.ca.itemSize] = opasity;
							points.geometry.attributes.ca.needsUpdate = true;

						} );
					dat.controllerNameAndTitle( controllerOpacity, lang.opacity, lang.opacityTitle );

					//displays the trace of the point movement
					cTrace = fPoint.add( { trace: false }, 'trace' ).onChange( function ( value ) {

						visibleTraceLine( intersection, value );

					} );
					dat.controllerNameAndTitle( cTrace, lang.trace, lang.traceTitle );
					dislayEl( cTrace, options.player === undefined ? false : true );

					//Point's world position axes controllers

					function axesWorldGui( axesId, onChange ) {

						var axesName = axesEnum.getName( axesId ),
							scale = axesHelper === undefined ? options.scales[axesName] : axesHelper.options.scales[axesName],
							controller = dat.controllerZeroStep( fPointWorld, { value: scale.min, }, 'value' );
						controller.domElement.querySelector( 'input' ).readOnly = true;
						dat.controllerNameAndTitle( controller, scale.name );
						return controller;

					}
					controllerWorld.x = axesWorldGui( axesEnum.x );
					controllerWorld.y = axesWorldGui( axesEnum.y );
					controllerWorld.z = axesWorldGui( axesEnum.z );

					//Restore default local position.
					cRestoreDefaultLocalPosition = fPoint.add( {

						defaultF: function () {

							var positionDefault = intersection.object.userData.arrayFuncs[intersection.index];
							controllerX.setValue( typeof positionDefault.x === "function" ?
								positionDefault.x( group.userData.t, options.a, options.b ) : positionDefault.x );
							controllerY.setValue( typeof positionDefault.y === "function" ?
								positionDefault.y( group.userData.t, options.a, options.b ) : positionDefault.y );
							controllerZ.setValue( typeof positionDefault.z === "function" ?
								positionDefault.z( group.userData.t, options.a, options.b ) :
								positionDefault.z === undefined ? 0 ://default Z axis of 2D point is 0
									positionDefault.z );

							if ( positionDefault.w !== undefined ) {

								if ( positionDefault.w.r !== undefined )
									controllerColor.setValue( '#' +
										new THREE.Color( positionDefault.w.r, positionDefault.w.g, positionDefault.w.b ).getHexString() );
								else if ( typeof positionDefault.w === "function" )
									setValue( controllerW, positionDefault.w( group.userData.t ) );
								else console.error( 'Restore default local position: Invalid W axis.' );

							} else {

								controllerColor.setValue( controllerColor.initialValue );
								controllerOpacity.setValue( controllerOpacity.initialValue );

							}


						},

					}, 'defaultF' );
					dat.controllerNameAndTitle( cRestoreDefaultLocalPosition, lang.defaultButton, lang.defaultLocalPositionTitle );

				}
				this.windowRange = function ( options ) {

					pointLight1.windowRange( options.scales );
					pointLight2.windowRange( options.scales );

					controllerX.min( options.scales.x.min );
					controllerX.max( options.scales.x.max );
					controllerX.updateDisplay();

					controllerY.min( options.scales.y.min );
					controllerY.max( options.scales.y.max );
					controllerY.updateDisplay();

					controllerZ.min( options.scales.z.min );
					controllerZ.max( options.scales.z.max );
					controllerZ.updateDisplay();

					if ( controllerW !== undefined ) {

						controllerW.min( options.scales.w.min );
						controllerW.max( options.scales.w.max );
						controllerW.updateDisplay();

					}

				}

			}
			options.guiSelectPoint = new guiSelectPointF();

			//dat-gui JavaScript Controller Library
			//https://github.com/dataarts/dat.gui
			if ( ( options.dat !== undefined ) ) {

				if ( gui !== undefined ) {

					for ( var i = gui.__controllers.length - 1; i >= 0; i-- )
						gui.remove( gui.__controllers[i] );
					var folders = Object.keys( gui.__folders );
					for ( var i = folders.length - 1; i >= 0; i-- )
						gui.removeFolder( gui.__folders[folders[i]] );

				} else {

					gui = new dat.GUI( {

						//autoPlace: false,//Убрать скроллинг когда окно gui не влазит в окно браузера
						//closed: true,//Icorrect "Open Controls" button name

					} );
					gui.domElement.addEventListener( 'mouseenter', function ( event ) { mouseenter = true; } );
					gui.domElement.addEventListener( 'mouseleave', function ( event ) { mouseenter = false; } );

				}

				//for debugging
				if ( typeof WebGLDebugUtils !== "undefined" )
					gui.add( {

						loseContext: function ( value ) {

							canvas.loseContext();
							//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
							//gl.getExtension( 'WEBGL_lose_context' ).loseContext();

						},

					}, 'loseContext' );

				//Close gui window
				if ( gui.__closeButton.click !== undefined )//for compatibility with Safari 5.1.7 for Windows
					gui.__closeButton.click();

				//Thanks to https://stackoverflow.com/questions/41404643/place-dat-gui-strictly-inside-three-js-scene-without-iframe
				elContainer.querySelector( '#my-gui-container' ).appendChild( gui.domElement );

				options.guiSelectPoint.add( gui );

			}

			//PlayController https://github.com/anhr/controllerPlay. My custom controller in my version of dat.gui https://github.com/anhr/dat.gui for playing of 3D objects in my projects.

			if ( options.player !== undefined ) {

				player = new Player( {

					settings: options.player,
					cookie: cookie,
					cookieName: '_' + getCanvasName(),
					onChangeScaleT: function ( scale ) {

						if ( canvasMenu !== undefined )
							canvasMenu.onChangeScale( scale );
						group.children.forEach( function ( mesh ) {

							if ( ( mesh.userData.arrayFuncs === undefined ) || ( typeof mesh.userData.arrayFuncs === "function" ) )
								return;
							mesh.userData.arrayFuncs.forEach( function ( vector ) {

								if ( vector.line === undefined )
									return;
								vector.line.remove();
								vector.line = new traceLine();

							} );

						} );

					},

				}, function ( index ) {

					var t = ( ( options.player.max - options.player.min ) / ( options.player.marks - 1 ) ) * index + options.player.min;
					//					group.userData.index = index;
					selectPlayScene( t, index, true );
					if ( canvasMenu !== undefined )
						canvasMenu.setIndex( index, options.player.name + ': ' + t );
					if ( frustumPoints !== undefined )
						frustumPoints.updateCloudPoints();

				} );
				if ( gui !== undefined ) {

					var playController = controllerPlay.create( player );
					gui.add( playController );

				}

			}
			if ( gui !== undefined ) {

				fOptions = gui.addFolder( lang.settings );
				if ( player !== undefined )
					player.gui( fOptions, getLanguageCode );

			}
			if ( stereoEffect !== undefined ) {

				stereoEffect.gui( fOptions, {

					getLanguageCode: getLanguageCode,
					gui: gui,
					stereoEffect: stereoEffect,
					onChangeMode: function ( mode ) {

						var fullScreen = true;
						switch ( mode ) {

							case spatialMultiplexsIndexs.Mono:
								fullScreen = false;
								break;
							case spatialMultiplexsIndexs.SbS:
							case spatialMultiplexsIndexs.TaB:
								break;
							default: console.error( 'myThreejs: Invalid spatialMultiplexIndex = ' + mode );
								return;

						}
						//rendererSizeDefault.onFullScreenToggle( !fullScreen );

						canvasMenu.setSpatialMultiplexs( mode, { renderer: renderer, camera: camera } );
						if ( frustumPoints !== undefined )
							frustumPoints.setSpatialMultiplexs( mode );

					},

				} );

			}

			if ( options.menuPlay ) {

				if ( ( canvasMenu === undefined ) ) {

					canvasMenu = new menuPlay.create( elContainer, {

						stereoEffect: stereoEffect === undefined ? stereoEffect :
							{ stereoEffect: stereoEffect, spatialMultiplexsIndexs: spatialMultiplexsIndexs },
						player: player,
						onFullScreenToggle: function ( fullScreen ) {

							return rendererSizeDefault.onFullScreenToggle( fullScreen );

						},
						onFullScreen: function ( fullScreen, elContainer ) {

							rendererSizeDefault.onFullScreenToggle( !fullScreen );

						},
						onOver: function ( _mouseenter ) {

							mouseenter = _mouseenter;

						},
						THREE: THREE,

					} );
					options.canvasMenu = canvasMenu;

				} else canvasMenu.setPlayer( player );

			}

			//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			if ( options.orbitControls ) {

				controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
				controls.update();
				controls.addEventListener( 'change', function () {

					//change of size of the points if points is not shaderMaterial and if camera is moving
					var vector = new THREE.Vector3();
					vector.copy( camera.position );
					var quaternion = new THREE.Quaternion( -camera.quaternion.x, -camera.quaternion.y, -camera.quaternion.z, camera.quaternion.w );
					vector.applyQuaternion( quaternion );
					options.point.sizePointsMaterial = 200 / vector.z;
					group.children.forEach( function ( mesh ) {

						if ( ( mesh.material !== undefined ) && ( mesh.material.uniforms === undefined ) )
							mesh.material.size = options.point.size / options.point.sizePointsMaterial;

					} );

					if ( frustumPoints !== undefined )
						frustumPoints.onChangeControls();

				} );

			}

			// helper

			if ( options.axesHelper ) {

				var cookieName = getCanvasName();
				axesHelper = new THREE.AxesHelper( 1 * scale, {

					cookie: cookie,
					cookieName: cookieName === '' ? '' : '_' + cookieName,
					scene: scene,
					negativeAxes: true,
					colors: colorsHelper / 0xff, //gray axes
					colorsHelper: colorsHelper,
					scales: options.scales,

				} );
				scene.add( axesHelper );

				if ( controls !== undefined )
					controls.update();//if scale != 1 and position != 0 of the screen, то после открытия canvas положение картинки смещено. Положение восстанавливается только если подвигать мышью
			}

			defaultPoint.size = options.point.size;

			var pointName = 'Point_' + getCanvasName();
			cookie.getObject( pointName, options.point, options.point );
			createXDobjects( group, options );

			if ( options.arrayCloud ) {//Array of points with cloud

				frustumPoints = new FrustumPoints.create( camera, controls//, guiSelectPoint
					, group, 'FrustumPoints_' + getCanvasName(), stereoEffect.options.spatialMultiplex, renderer, options,
					{//points and lines options.Default is { }

						point: {//points options.Default is {}

							size: 0.01,//Size of each frustum point.Default is 0;

						},
						//display: false,//true - display frustum points.Default is true
						//info: true, //true - display information about frustum point if user move mouse over or click this point.Default is false

						//Stereo options. Available only if user has selected a stereo mode (spatialMultiplex !== spatialMultiplex.Mono)
						stereo: {

							//lines: false, // Display or hide lines between Frustum Points for more comfortable visualisation in the stereo mode.Default is true
							//hide: 10, // Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.Default is 0
							//opacity: 1,//Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque. Default is 0.3

						},

						//

						//zCount: 5,// The count of layers of the frustum of the camera's field of view. Default is 50
						//yCount: 3,// The count of vertical points for each z level of the  frustum of the camera's field of view.. Default is 30

						//изменение размеров усеченной пирамиды FrustumPoints

						near: 10,// Shift of the frustum layer near to the camera in percents.
						//0 percents - no shift.
						//100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды.
						//Default is 0
						far: 70,// Shift of the frustum layer far to the camera in percents.
						// 0 percents - no shift.
						// 100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды.
						// Default is 0
						base: 70,// Scale of the base of the frustum points in percents.
						// 0 base is null
						// 100 no scale
						// Default is 100
						square: true,// true - Square base of the frustum points.Default is false
					},
					cFrustumPoints
				);
				cFrustumPoints.setFrustumPoints( frustumPoints );
				options.arrayCloud.frustumPoints = frustumPoints;

			}

			function selectPlayScene( t, index, boPlayer ) {

				group.userData.t = t;
				group.children.forEach( function ( mesh ) {

					if (

						( mesh.userData.selectPlayScene === undefined ) ||
						( boPlayer && mesh.userData.boFrustumPoints )

					)
						return;

					//Эти строки нужны что бы появлялся текст возле точки, если на нее наведена мышка
					//при условии, что до этого точка была передвинута с помошью проигрывателя.
					delete mesh.geometry.boundingSphere;
					mesh.geometry.boundingSphere = null;

					mesh.userData.selectPlayScene( t );
					function setAttributes( a, b ) {

						var attributes = mesh.geometry.attributes,
							arrayFuncs = mesh.userData.arrayFuncs;
						if ( arrayFuncs === undefined )
							return;
						if ( t === undefined )
							console.error( 'setPosition: t = ' + t );

						for ( var i = 0; i < arrayFuncs.length; i++ ) {

							var funcs = arrayFuncs[i], needsUpdate = false;
							function setPosition( axisName, fnName ){

								var value = execFunc( funcs, axisName, t, a, b );
								if( value !== undefined ) {

									attributes.position[fnName]( i, value );
									needsUpdate = true;

								}

							}
							setPosition( 'x', 'setX' );
							setPosition( 'y', 'setY' );
							setPosition( 'z', 'setZ' );
							let color;
							var min, max;
							if ( options.scales.w !== undefined ) {

								min = options.scales.w.min; max = options.scales.w.max;

							} else {

								max = value;
								min = max - 1;

							}
							var boSetColorAttribute = true;
							if ( typeof funcs.w === "function" ) {

								attributes.position.setW( i, funcs.w( t, a, b ) );
								needsUpdate = true;

								var value = funcs.w( t, a, b );
								color = palette.toColor( value, min, max );

							} else if ( typeof funcs.w === "object" ){

								if ( funcs.w instanceof THREE.Color )
									color = funcs.w;
								else color = palette.toColor( execFunc( funcs, 'w', t, a, b ), min, max );

							} else if ( typeof funcs.w === "number" )
								color = palette.toColor( funcs.w, min, max );
							else {

								boSetColorAttribute = false;

							}
							if ( boSetColorAttribute )
								setColorAttribute( attributes, i, color );
							if ( needsUpdate )
								attributes.position.needsUpdate = true;

							if ( funcs.line !== undefined )
								funcs.line.addPoint( getObjectPosition( mesh, i ), index, color );

						};

					}
					setAttributes( options.a, options.b );
					var message = 'myThreejs.create.onloadScripts.init.selectPlayScene: invalid mesh.scale.';
					if ( mesh.scale.x <= 0 ) console.error( message + 'x = ' + mesh.scale.x );
					if ( mesh.scale.y <= 0 ) console.error( message + 'y = ' + mesh.scale.y );
					if ( mesh.scale.z <= 0 ) console.error( message + 'z = ' + mesh.scale.z );

					options.guiSelectPoint.setMesh();

					var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
					if ( ( selectedPointIndex !== -1 ) && options.guiSelectPoint.isSelectedMesh( mesh ) ) {

						var position = getObjectPosition( mesh, selectedPointIndex );

						if ( axesHelper !== undefined )
							axesHelper.exposePosition( position );

						if ( gui !== undefined )
							options.guiSelectPoint.setPosition( position, {

								object: mesh,
								index: selectedPointIndex,

							} );

					}

				} );

			}
			selectPlayScene( options.player === undefined ? 0 : options.player.min, 0 );

			//default setting for each 3D object
			group.children.forEach( function ( mesh ) {

				mesh.userData.default = mesh.userData.default || {};

				mesh.userData.default.scale = new THREE.Vector3();
				mesh.userData.default.scale.copy( mesh.scale );

				mesh.userData.default.position = new THREE.Vector3();
				mesh.userData.default.position.copy( mesh.position );

				mesh.userData.default.rotation = new THREE.Euler();
				mesh.userData.default.rotation.copy( mesh.rotation );

			} );
			if ( gui !== undefined ) {

				//THREE.AxesHelper gui
				if ( ( options.scene === undefined ) && ( typeof scene !== 'undefined' ) )
					options.scene = scene;
				options.cookie = cookie;
				if ( options.axesHelperGui === true )
					AxesHelperGui( fOptions, options.guiSelectPoint, {

						axesHelper: axesHelper,
						options: options,
						cookie: cookie,
						getLanguageCode: getLanguageCode,

					} );//, options );

				options.guiSelectPoint.addControllers();
				
				//OrbitControls gui

				if ( ( options.orbitControls !== undefined ) && ( options.orbitControls.gui ) )
					OrbitControlsGui( fOptions, controls, {

						getLanguageCode: getLanguageCode,
						scales: options.scales,

					} );

				// light

				var scales = axesHelper === undefined ? options.scales : axesHelper.options.scales;
				pointLight1.controls( group, fOptions, scales, lang.light + ' 1' );
				pointLight2.controls( group, fOptions, scales, lang.light + ' 2' );

				//point

				function FolderPoint( folder, point, defaultPoint, setSize, PCOptions ) {

					PCOptions = PCOptions || {};

					PCOptions.min = PCOptions.min || 0.01;
					PCOptions.max = PCOptions.max || 1;
					PCOptions.settings = PCOptions.settings || {}; 
					PCOptions.settings.offset = PCOptions.settings.offset || 1;
					PCOptions.step = PCOptions.step || 0.01;

					var fPoint = folder.addFolder( lang.pointSettings ),
						fSize = fPoint.addFolder( lang.size );
					dat.folderNameAndTitle( fSize, lang.size, lang.sizeTitle );
					this.display = function( display ){ fPoint.domElement.style.display = display; }

					fSize.add( new PositionController( function ( shift ) {

						setSize( point.size + shift );

					}, PCOptions//{ offset: 0.01, min: 0.01, max: 0.1, step: 0.01 }
					) );

					//size
					this.size = dat.controllerZeroStep( fSize, point, 'size', function ( value ) {

						setSize( value );

					} );
					dat.controllerNameAndTitle( this.size, lang.size, lang.sizeTitle );

					//point default button
					dat.controllerNameAndTitle( fPoint.add( {

						defaultF: function ( value ) {

							setSize( defaultPoint.size );

						},

					}, 'defaultF' ), lang.defaultButton, lang.defaultPointTitle );

				}
				var folderPoint = new FolderPoint( fOptions, options.point, defaultPoint, function( value ) {

					if ( value === undefined )
						value = options.point.size;
					if ( value < 0 )
						value = 0;
					group.children.forEach( function ( mesh ) {

						if ( ( mesh.type !== 'Points' ) || mesh.userData.boFrustumPoints )
							return;
						if ( mesh.material.uniforms === undefined )
							mesh.material.size = value / options.point.sizePointsMaterial;//PointsMaterial
						else mesh.material.uniforms.pointSize.value = value;//shaderMaterial

					} );
					//					options.point.size = value;
					folderPoint.size.setValue( value );
					cookie.setObject( pointName, options.point );

				} )

				//Frustum points
				if ( frustumPoints )
					frustumPoints.gui( fOptions, getLanguageCode, FolderPoint );

				//default button
				dat.controllerNameAndTitle( gui.add( {
					defaultF: function ( value ) {

						controls.target = new THREE.Vector3();
						camera.position.copy( defaultCameraPosition );
						controls.object.position.copy( camera.position );
						controls.update();

					},

				}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

			}

			//raycaster

			group.children.forEach( function ( item ) {

				if ( item.userData.raycaster !== undefined ) {

					if ( raycaster.stereo !== undefined )
						raycaster.stereo.addParticle( item );

				}

			} );
			function getRendererSize() {

				var style = {

					position: renderer.domElement.style.position,
					left: renderer.domElement.style.left,
					top: renderer.domElement.style.top,
					width: renderer.domElement.style.width,
					height: renderer.domElement.style.height,

				},
					sizeOriginal = new THREE.Vector2();
				renderer.getSize( sizeOriginal );
				return {

					onFullScreenToggle: function ( fs ) {

						arrayContainers.display( elContainer.parentElement, !fs );//fullScreen );
						return { renderer: renderer, camera: camera };

					},

				};

			};
			rendererSizeDefault = getRendererSize();

			//https://github.com/mrdoob/stats.js/
			if ( options.stats !== undefined ) {

				try {

					stats = new Stats();
					elContainer.appendChild( stats.dom );

				} catch (e) {


				}

			}

			window.addEventListener( 'resize', onResize, false );

		}
		function onResize() {

			var size;
			if ( isFullScreen() )
				size = new THREE.Vector2( window.innerWidth, window.innerHeight );
			else {

				size = new THREE.Vector2();
				renderer.getSize( size );

			}
			camera.aspect = size.x / size.y;
			camera.updateProjectionMatrix();

			if ( typeof se === 'undefined' )
				renderer.setSize( size.x, size.y );
			else
				stereoEffect.setSize( size.x, size.y );

			if ( frustumPoints !== undefined )
				frustumPoints.update();

		}
		function onDocumentMouseMove( event ) {

			if ( raycaster !== undefined ) {

				if ( raycaster.stereo !== undefined )
					raycaster.stereo.onDocumentMouseMove( event );
				else {

					// Test of the old version of THREE.Raycaster
					event.preventDefault();
					var left = renderer.domElement.offsetLeft,
						top = renderer.domElement.offsetTop,
						size = new THREE.Vector2;
					renderer.getSize( size );
					mouse.x = ( event.clientX / size.x ) * 2 - 1 - ( left / size.x ) * 2;
					mouse.y = -( event.clientY / size.y ) * 2 + 1 + ( top / size.y ) * 2;

				}

			}
			if ( event.buttons != 1 )
				return;

			render();

		}
		function onObjectMouseDown( position, intersection ) {

			if ( ( axesHelper !== undefined ) && ( intersection.object.type === "Points" ) )
				axesHelper.exposePosition( position );
			else alert( 'You are clicked the "' + intersection.object.type + '" type object.'
				+ ( intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.' )
				+ ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )' );

			if ( typeof gui !== 'undefined' )
				console.warn( 'qqq' );

		}
		function onDocumentMouseDown( event ) {

			if ( raycaster === undefined )
				return;

			if ( mouseenter )
				return;

			if ( raycaster.stereo !== undefined ) {

				raycaster.stereo.onDocumentMouseDown( event );
				return;

			}
			raycaster.setFromCamera( mouse, camera );
			intersects = raycaster.intersectObjects( group.children );//particles );
			if ( intersects.length > 0 ) {

				var intersection = intersects[0],
					position = getPosition( intersection );
				onObjectMouseDown( position, intersection );

			}

		}
		function animate() {

			if ( stats !== undefined )
				stats.begin();

			requestId = requestAnimationFrame( animate );

			if ( player !== undefined )
				player.animate();
			render();

			if ( stats !== undefined )
				stats.end();

		}
		function render() {

			//console.log( 'elContainer.id = ' + elContainer.id )
			if ( typeof stereoEffect === 'undefined' )
				renderer.render( scene, camera );
			else stereoEffect.render( scene, camera );

			if ( ( raycaster !== undefined ) && ( raycaster.stereo === undefined ) ) {

				raycaster.setFromCamera( mouse, camera );
				intersects = raycaster.intersectObjects( group.children );//particles );
				if ( intersects.length > 0 ) {

					onIntersection( intersects, mouse );

				} else {

					onIntersectionOut( intersects );

				}

			}

			if( cameraPosition === undefined )
				cameraPosition = new THREE.Vector3(); 
			if ( pointSize === undefined )
				pointSize = options.point.size;
			if(
				!cameraPosition.equals(camera.position) ||
				( pointSize != options.point.size ) ||
				( ( frustumPoints !== undefined ) && frustumPoints.animate() )
			) {

				cameraPosition.copy( camera.position );
				pointSize = options.point.size;

				group.children.forEach( function ( mesh ) {

					if ( mesh instanceof THREE.Points === false )
						return;

					if ( mesh.geometry.attributes.size === undefined ) {

						mesh.material.size = pointSize / options.point.sizePointsMaterial;
						return;

					}
					if ( options.point.opacity !== undefined )
						mesh.material.uniforms.opacity.value = options.point.opacity;

					//scale
					var scale = myPoints.getGlobalScale( mesh );
					var cameraPosition = new THREE.Vector3( camera.position.x / scale.x, camera.position.y / scale.y, camera.position.z / scale.z );
					scale = ( scale.x + scale.y + scale.z ) / 3;

					//set size of points with ShaderMaterial
					//https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial
					//Example https://threejs.org/examples/?q=points#webgl_custom_attributes_points2

					//points with ShaderMaterial
					for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

						var position = getObjectPosition( mesh, i ),//getObjectLocalPosition( mesh, i ),
							position3d = new THREE.Vector3( position.x, position.y, position.z ),
							distance = position3d.distanceTo( cameraPosition ),
							y = 1;
						//дальние точки очень маленькие
						//	angle = cameraPosition.angleTo( position3d ),
						//	cameraFov = ( Math.PI / 180 ) * 0.5 * camera.fov,
						//	y = 1 - 0.4 * ( angle / cameraFov );
						
						mesh.geometry.attributes.size.setX( i, Math.tan(

								mesh.userData.shaderMaterial.point !== undefined &&
								mesh.userData.shaderMaterial.point.size !== undefined ?
									mesh.userData.shaderMaterial.point.size : options.point.size
									
							) * distance * scale * y );
						mesh.geometry.attributes.size.needsUpdate = true;

					}


				} );

				//set size of the SpriteText
				if (
					( axesHelper !== undefined )
					&& ( defaultPoint.size !== undefined )
					&& axesHelper.options.scales.display
				)
					axesHelper.arraySpriteText.forEach( function ( spriteItem ) {

						spriteItem.userData.setSize( cameraPosition, Math.tan( 0.025 ) * scale );

					} );

			}
			if ( options.guiSelectPoint.render !== undefined )
				options.guiSelectPoint.render();

		}

		var timeoutControls;

		arrayCreates.shift();
		var params = arrayCreates.shift();
		if ( params === undefined )
			return;
		myThreejs.create( params.createXDobjects, params.options );

	}

	var optionsStyle = {

		tag: 'style',

	}

	if ( options.dat !== undefined ) {

		loadScript.sync( '../../../../dropdownMenu/master/styles/gui.css', optionsStyle );

		//for .container class
		loadScript.sync( '../../../../dropdownMenu/master/styles/menu.css', optionsStyle );

	}

	function execFunc( funcs, axisName, t, a, b ) {

		var func = funcs[axisName], typeofFuncs = typeof func;
		switch ( typeofFuncs ) {

			case "undefined":
				return undefined;
			case "function":
				return func( t, a, b );
			case "number":
				return func;
			case "object":
				if ( Array.isArray( func ) ) {

					if( func.length === 0 ) {

						console.error( 'myThreejs.create.execFunc: funcs["' + axisName + '"] array is empty' );
						return;

					}
					var a = func,
						l = func.length - 1,
						max = options.player.max,
						min = options.player.min,
						tStep = ( max - min ) / l,
						tStart = min, tStop = max,
						iStart = 0, iStop = l;
					for( var i = 0; i < func.length; i++ ) {

						if( tStep * i + min < t ) {

							iStart = i;
							iStop = i + 1;
							tStart = tStep * iStart + min;
							tStop = tStep * iStop + min;

						}

					}
					function execW( i ){
						
						if ( typeof a[i] === "function" )
							return a[i]( t, a, b );
						if ( a[i] instanceof THREE.Color )
							return a[i];

					}
					if ( typeof a[iStart] !== "number" ) {

						if( axisName === 'w') {

							return execW( iStart );

						}
						console.error( 'myThreejs.create.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + ( typeof a[iStart] ) + ' is not number' );
						return;

					}
					if ( typeof a[iStop] !== "number" ) {

						if( axisName === 'w')
							return execW( iStop );
						console.error( 'myThreejs.create.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + ( typeof a[iStop] ) + ' is not number' );
						return;

					}
					var x = ( a[iStop] - a[iStart] ) / ( tStop - tStart ),
						y = a[iStart] - x * tStart;
					return x * t + y;

				}
				if( axisName !== 'w' )
					console.error( 'myThreejs.create.execFunc: funcs["' + axisName + '"] object is not array' );
				return;
			default:
				console.error( 'myThreejs.create.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs );
		}
		return;

	}

	/**
	 * Get array of THREE.Vector4 points.
	 * @param {number} t first parameter of the arrayFuncs item function. Start time of animation.
	 * @param {[THREE.Vector4|THREE.Vector3|THREE.Vector2]} arrayFuncs points.geometry.attributes.position array
	 * THREE.Vector4: 4D point.
	 * THREE.Vector3: 3D point. w = 1. Default is white color
	 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
	 * Vector's x, y, z, w is position of the point.
	 * Can be as:
	 * float - position of the point.
	 * [float] - array of positions of the point.
	 * Function - position of the point is function of the t. Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
	 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
	 * 
	 * object: {
	 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
	 *   [name]: point name. Default is undefined.
	 *   [trace]: true - displays the trace of the point movement. Default is undefined.
	 * }
	 * or
	 * object: {
	 *   x: x axis. Defauilt is 0.
	 *   y: y axis. Defauilt is 0.
	 *   z: z axis. Defauilt is 0.
	 *   w: w axis. Defauilt is 0.
	 * }
	 *
	 * array: [
	 *   0: x axis. Defauilt is 0.
	 *   1: y axis. Defauilt is 0.
	 *   2: z axis. Defauilt is 0.
	 *   3: w axis. Defauilt is 0.
	 * ]
	 * @param {number} a second parameter of the arrayFuncs item function. Default is 1.
	 * @param {number} b third parameter of the arrayFuncs item function. Default is 0.
	 * @returns array of THREE.Vector4 points.
	 */
	options.getPoints = function ( t, arrayFuncs, a, b ) {

		if ( t === undefined )
			console.error( 'getPoints: t = ' + t );
		for ( var i = 0; i < arrayFuncs.length; i++ ) {

			var item = arrayFuncs[i];
			if ( Array.isArray( item ) )
				arrayFuncs[i] = new THREE.Vector4(

					item[0] === undefined ? 0 : item[0],
					item[1] === undefined ? 0 : item[1],
					item[2] === undefined ? 0 : item[2],
					item[3] === undefined ? 0 : item[3]

				);
			else if (

				( typeof item === "object" )
				&& ( item instanceof THREE.Vector2 === false )
				&& ( item instanceof THREE.Vector3 === false )
				&& ( item instanceof THREE.Vector4 === false )

			) {
				
				if( ( item.vector === undefined ) )
					arrayFuncs[i] = new THREE.Vector4(

						item.x === undefined ? 0 : item.x,
						item.y === undefined ? 0 : item.y,
						item.z === undefined ? 0 : item.z,
						item.w === undefined ? 0 : item.w

					);
				else if (

					   ( item.vector instanceof THREE.Vector2 === true )
					|| ( item.vector instanceof THREE.Vector3 === true )
					|| ( item.vector instanceof THREE.Vector4 === true )

				)
					arrayFuncs[i].vector = new THREE.Vector4(

						item.vector.x === undefined ? 0 : item.vector.x,
						item.vector.y === undefined ? 0 : item.vector.y,
						item.vector.z === undefined ? 0 : item.vector.z,
						item.vector.w === undefined ? 0 : item.vector.w

					);
				else {

					if ( item.vector.length === 4 )
						arrayFuncs[i].vector = new THREE.Vector4(

							item.vector[0] === undefined ? 0 : item.vector[0],
							item.vector[1] === undefined ? 0 : item.vector[1],
							item.vector[2] === undefined ? 0 : item.vector[2],
							item.vector[3] === undefined ? 0 : item.vector[3]

						);
					else if ( item.vector.length === 3 )

						arrayFuncs[i].vector = new THREE.Vector3(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],
						item.vector[2] === undefined ? 0 : item.vector[2],

					);
					else console.error( 'options.getPoints(...) falied! item.vector.length = ' + item.vector.length );

				}

			}

		};
		var points = [];
		for ( var i = 0; i < arrayFuncs.length; i++ ){

			var funcs = arrayFuncs[i];
			function getAxis(axisName) {

				if ( ( funcs instanceof THREE.Vector2 ) || ( funcs instanceof THREE.Vector3 ) || ( funcs instanceof THREE.Vector4 ) ) {

					return execFunc( funcs, axisName, t, a, b );

				}
				if ( funcs.vector === undefined ) {

					console.error( 'options.getPoints: funcs.vector = ' + funcs.vector );
					return;

				}
				if ( funcs.name !== undefined )
					funcs.vector.name = funcs.name;
				if ( funcs.trace ) {

					if ( options.player === undefined )
						console.warn( 'Please define the options.player for displays the trace of the point movement.' );
					else {

						funcs.vector.line = new traceLine();

					}

				}
				arrayFuncs[i] = funcs.vector;
				funcs = funcs.vector;
				return execFunc( funcs, axisName, t, a, b );


			}
			var point = funcs.vector instanceof THREE.Vector3 === true ?
				new THREE.Vector3( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ) ) :
				new THREE.Vector4( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ), getAxis( 'w' ), );

			if ( funcs.w === undefined )
				point.w = {};//Если тут поставить NaN то в points.geometry.attributes.position.array он преобразуется в 0.
			//Тогда в gui появится ненужный орган управления controllerW
			//от балды поставил пустой объект что бы при создании points.geometry.attributes.position.array
			//это зачение преобразвалось в NaN.

			points.push( point );

		}
		return points;

	}

	/**
	 * Get array of mesh colors.
	 * @param {number} t first parameter of the arrayFuncs item function. Start time of animation.
	 * @param {[THREE.Vector4|THREE.Vector3|THREE.Vector2]} arrayFuncs points.geometry.attributes.position array
	 * THREE.Vector4: 4D point.
	 * THREE.Vector3: 3D point. w = 1. Default is white color
	 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
	 * Vector's x, y, z, w is position of the point.
	 * Can be as:
	 * float - position of the point.
	 * [float] - array of positions of the point.
	 * Function - position of the point is function of the t. Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
	 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
	 *
	 * object: {
	 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
	 *   [name]: point name. Default is undefined.
	 *   [trace]: true - displays the trace of the point movement. Default is undefined.
	 * }
	 * @param {object} scale options.scales.w
	 * @param {object} [optionsColor] followed options is available:
	 * @param {THREE.BufferAttribute} [optionsColor.positions] geometry.attributes.position of the new mesh. Default is undefined.
	 * @param {[]} [optionsColor.colors] array for mesh colors. Default is undefined.
	 * @param {boolean} [optionsColor.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. Default is undefined.
	 * @returns array of mesh colors.
	 */
	options.getColors = function ( t, arrayFuncs, scale, /*positions, colors, length*/ optionsColor ) {

		if ( t === undefined )
			console.error( 'getColors: t = ' + t );

		optionsColor = optionsColor || {};
		if ( ( optionsColor.positions !== undefined ) && Array.isArray( arrayFuncs ) && ( arrayFuncs.length !== optionsColor.positions.count ) ) {

			console.error( 'getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count );
			return optionsColor.colors;

		}
		optionsColor.colors = optionsColor.colors || [];
		var length = Array.isArray( arrayFuncs ) ? arrayFuncs.length : optionsColor.positions.count;

		//Standard normal distribution
		//https://en.wikipedia.org/wiki/Normal_distribution
		function getStandardNormalDistribution( x ) {

			var res = Math.exp( -0.5 * x * x ) / Math.sqrt( 2 * Math.PI );
			//console.log( 'x = ' + x + ' y = ' + res );
			return res;

		}
/*
		var standardNormalDistributionZero;
		if ( positions !== undefined )
			standardNormalDistributionZero = getStandardNormalDistribution( 0 );
*/
		for( var i = 0; i < length; i++ ) {

			var funcs = Array.isArray(arrayFuncs) ? arrayFuncs[i] : undefined,
				vector;
			if (
				( funcs instanceof THREE.Vector4 ) ||//w of the funcs is color of the point
				( optionsColor.positions.itemSize === 4 )//w position of the positions is color of the point
			 ) {

				var min, max;
				if ( scale !== undefined ) {

					min = scale.min; max = scale.max;

				} else {

					max = funcs instanceof THREE.Vector4 ? funcs.w : 1;
					min = max - 1;

				}
				var color = palette.toColor( funcs === undefined ? new THREE.Vector4().fromBufferAttribute( optionsColor.positions, i ).w : funcs.w, min, max );
				optionsColor.colors.push( color.r, color.g, color.b );

			} else if ( optionsColor.colors instanceof THREE.Float32BufferAttribute )
				vector = new THREE.Vector3( 1, 1, 1 );
			else optionsColor.colors.push( 1, 1, 1 );//white

			//opacity
			if ( optionsColor.opacity !== undefined ) {

				var opacity = 0,
					standardNormalDistributionZero = getStandardNormalDistribution( 0 );
				group.children.forEach( function ( mesh ) {

					if ( !mesh.userData.cloud )
						return;
					for ( var iMesh = 0; iMesh < mesh.geometry.attributes.position.count; iMesh++ ) {

						var position = getObjectPosition( mesh, iMesh );
						opacity += getStandardNormalDistribution(
							getWorldPosition(//myThreejs.getWorldPosition(
								camera, new THREE.Vector3().fromBufferAttribute( optionsColor.positions, i )
							).distanceTo( position ) * 5
						) / standardNormalDistributionZero;

					}

				} );

				if ( debug.opacity !== undefined )
					opacity = debug.opacity;
					
				if ( optionsColor.colors instanceof THREE.Float32BufferAttribute ) {

					optionsColor.colors.setXYZW( i, vector.x, vector.y, vector.z, opacity );

				}
				else optionsColor.colors.push( opacity );

			} else optionsColor.colors.push( 1 );

		}
		return optionsColor.colors;

	}

	/**
	 * Displays a sprite text if you move mouse over an 3D object
	 * @param {object} intersection. See https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
	 * @param {THREE.Scene} scene.
	 * @param {THREE.Vector2} mouse mouse position.
	 */
	options.addSpriteTextIntersection = function ( intersection, scene, mouse ) {

		if ( intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo() )
			return;
		var spriteTextIntersection = findSpriteTextIntersection( scene );
		var textColor = 'rgb( 128, 128, 128 )',
			position = getPosition( intersection );

		// Make the spriteText follow the mouse
		//https://stackoverflow.com/questions/36033879/three-js-object-follows-mouse-position
		var vector = new THREE.Vector3( mouse.x, mouse.y, 0 );
		vector.unproject( camera );
		var dir = vector.sub( camera.position ).normalize();
		var pos = camera.position.clone().add( dir.multiplyScalar( 1 ) );

		var parent = intersection.object.parent;
		while ( parent !== null ) {

			pos.sub( parent.position );
			pos.divide( parent.scale );
			parent = parent.parent;

		}

		if ( spriteTextIntersection === undefined ) {

			var isArrayFuncs = ( ( intersection.index !== undefined ) && ( intersection.object.userData.arrayFuncs !== undefined ) ),
				funcs = !isArrayFuncs ? undefined : intersection.object.userData.arrayFuncs,
				func = ( funcs === undefined ) || ( typeof funcs === "function" ) ? undefined : funcs[intersection.index],
				pointName = !isArrayFuncs ?
					undefined :
					intersection.object.userData.pointName === undefined ?
						func === undefined ? undefined : func.name :
						intersection.object.userData.pointName( intersection.index ),
				color = !isArrayFuncs || ( func === undefined ) ?
					undefined :
					Array.isArray(func.w) ?
						execFunc( func, 'w', group.userData.t, options.a, options.b ) :
						func.w;
			if ( ( color === undefined ) && ( intersection.object.geometry.attributes.ca !== undefined ) ) {

				var vector = new THREE.Vector3().fromArray(intersection.object.geometry.attributes.ca.array, intersection.index * intersection.object.geometry.attributes.ca.itemSize);
				color = new THREE.Color( vector.x, vector.y, vector.z );

			}
			var cookieName = getCanvasName();

			/**
			 * Converting World coordinates to Screen coordinates
			 * https://stackoverflow.com/questions/11586527/converting-world-coordinates-to-screen-coordinates-in-three-js-using-projection
			 */
			function worldToScreen( world ) {

				var width = canvas.width, height = canvas.height;
				var widthHalf = width / 2, heightHalf = height / 2;

				var pos = world.clone();
				pos.project(camera);
				pos.x = ( pos.x * widthHalf ) + widthHalf;
				pos.y = - ( pos.y * heightHalf ) + heightHalf;
				return pos;

			}
			var screenPos = worldToScreen( pos );

			spriteTextIntersection = new THREE.SpriteText(
				( intersection.object.name === '' ? '' : lang.mesh + ': ' + intersection.object.name + '\n' ) +
				( pointName === undefined ? '' : lang.pointName + ': ' + pointName + '\n' ) +
				options.scales.x.name + ': ' + position.x +
				'\n' + options.scales.y.name + ': ' + position.y +
				'\n' + options.scales.z.name + ': ' + position.z +
				(//w
					!isArrayFuncs ?
						'' :
						funcs[intersection.index] instanceof THREE.Vector4 ||
						funcs[intersection.index] instanceof THREE.Vector3 ||
						typeof funcs === "function" ?
							color instanceof THREE.Color ?
								'\n' + lang.color + ': ' + new THREE.Color( color.r, color.g, color.b ).getHexString() :
								'\n' + options.scales.w.name + ': ' + position.w :
							''

				) +
				(//opacity
					( intersection.object.geometry.attributes.ca === undefined ) ||
					( intersection.object.geometry.attributes.ca.itemSize < 4 ) ?
						'' :
						'\n' + lang.opacity + ': ' + new THREE.Vector4().fromArray(

							intersection.object.geometry.attributes.ca.array,
							intersection.index * intersection.object.geometry.attributes.ca.itemSize

						).w
				)
				, {

					textHeight: 0.2,
					fontColor: textColor,
					rect: {

						displayRect: true,
						borderThickness: 3,
						borderRadius: 10,
						borderColor: textColor,
						backgroundColor: 'rgba( 0, 0, 0, 1 )',

					},
					position: pos,
					center: new THREE.Vector2( screenPos.x < ( canvas.width / 2 ) ? 0 : 1, screenPos.y < ( canvas.height / 2 ) ? 1 : 0 ),
					cookieName: cookieName === '' ? '' : '_' + cookieName,

				} );
			spriteTextIntersection.name = spriteTextIntersectionName;
			spriteTextIntersection.scale.divide( scene.scale );
			scene.add( spriteTextIntersection );

		} else spriteTextIntersection.position.copy( pos );

	}

	/**
	 * Hides a sprite text if you move mouse out an object
	 * @param {THREE.Scene} scene.
	 */
	options.removeSpriteTextIntersection = function ( scene ) {

		var detected = false;
		do {

			var spriteTextIntersection = findSpriteTextIntersection( scene );
			if ( spriteTextIntersection !== undefined ) {

				scene.remove( spriteTextIntersection );
				if ( detected )
					console.error( 'Duplicate spriteTextIntersection' );
				detected = true;

			}

		} while ( spriteTextIntersection !== undefined )

	}
	onloadScripts();

}
var spriteTextIntersectionName = 'spriteTextIntersection';
function findSpriteTextIntersection( scene ) {

	var spriteTextIntersection;
	scene.children.forEach( function ( item ) {

		if ( ( item.type === "Sprite" ) && ( item.name === spriteTextIntersectionName ) ) {

			spriteTextIntersection = item;
			return;

		}

	} );
	return spriteTextIntersection;

}

//Localization

var lang = {

	defaultButton: 'Default',
	defaultTitle: 'Restore Orbit controls settings.',
	point: 'Point Local Position',
	pointTitle: 'The position attribute of the selected point',
	pointWorld: 'Point World Position',
	pointWorldTitle: 'The position of the selected point after scaling, moving and rotation of the mesh',
	points: 'Points',
	mesh: 'Mesh',
	meshs: 'Meshs',
	pointName: 'Point Name',
	select: 'Select',
	notSelected: 'Not selected',
	scale: 'Scale',
	rotation: 'Rotation',
	position: 'Position',
	color: 'Сolor',
	settings: 'Settings',
	webglcontextlost: 'The user agent has detected that the drawing buffer associated with a WebGLRenderingContext object has been lost.',

	defaultButton: 'Default',
	defaultScaleTitle: 'Restore default 3d object scale.',
	defaultPositionTitle: 'Restore default 3d object position.',
	default3DObjectTitle: 'Restore default settings of all 3d objects.',
	defaultRotationTitle: 'Restore default 3d object rotation.',
	defaultLocalPositionTitle: 'Restore default local position.',

	light: 'Light',
	displayLight: 'Display',
	displayLightTitle: 'Display or hide the light source.',
	restoreLightTitle: 'Restore position of the light source',

	pointSettings: 'Point',
	size: 'Size',
	sizeTitle: 'Size of the point with "ShaderMaterial" material',
	opacity: 'Opacity',
	opacityTitle: 'Float in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.',
	defaultPointTitle: 'Restore point.',
	
	trace: 'Trace',
	traceTitle: 'Display the trace of the point movement.',
	traceAllTitle: 'Display the trace of the movement of all points of the mesh.',

};

switch ( getLanguageCode() ) {

	case 'ru'://Russian language
		lang.defaultButton = 'Восстановить';
		lang.defaultTitle = 'Восстановить положение осей координат по умолчанию.';
		lang.point = 'Локальная позиция точки';
		lang.pointTitle = 'Position attribute of the selected point';
		lang.pointWorld = 'Абсолютная позиция точки';
		lang.pointWorldTitle = 'Позиция выбранной точки после масштабирования, перемещения и вращения 3D объекта';
		lang.points = 'Точки';
		lang.mesh = '3D объект';
		lang.meshs = '3D объекты';
		lang.pointName = 'Имя точки';
		lang.select = 'Выбрать';
		lang.notSelected = 'Не выбран';
		lang.scale = 'Масштаб';
		lang.rotation = 'Вращение';
		lang.position = 'Позиция';
		lang.name = 'Имя';
		lang.color = 'Цвет';
//		lang.opacity = 'Непрозрачность',
		lang.settings = 'Настройки';
		lang.webglcontextlost = 'Пользовательский агент обнаружил, что буфер рисунка, связанный с объектом WebGLRenderingContext, потерян.';

		lang.defaultButton = 'Восстановить';
		lang.defaultScaleTitle = 'Восстановить масштаб 3D объекта по умолчанию.';
		lang.defaultPositionTitle = 'Восстановить позицию 3D объекта по умолчанию.';
		lang.default3DObjectTitle = 'Восстановить настройки всех 3D объектов по умолчанию.';
		lang.defaultRotationTitle = 'Восстановить поворот 3D объекта по умолчанию.';
		lang.defaultLocalPositionTitle = 'Восстановить локальную позицию точки по умолчанию.';

		lang.light = 'Свет';
		lang.displayLight = 'Показать';
		lang.displayLightTitle = 'Показать или скрыть источник света.';
		lang.restoreLightTitle = 'Восстановить положение источника света';

		lang.pointSettings = 'Точка';
		lang.size = 'Размер';
		lang.sizeTitle = 'Размер точки с материалом типа "ShaderMaterial"';
		lang.opacity = 'Непрозрачность';
		lang.opacityTitle = 'Число в диапазоне 0,0 - 1,0, указывающий, насколько прозрачен материал. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';
		lang.defaultPointTitle = 'Восстановить точку';

		lang.trace = 'Трек';
		lang.traceTitle = 'Показать трек перемещения точки.';
		lang.traceAllTitle = 'Показать трек перемещения всех точек выбранного 3D объекта.';

		break;

}

//for raycaster
function getPosition( intersection ) {

	return getObjectPosition( intersection.object, intersection.index );

}
function getObjectLocalPosition( object, index ) {

	var attributesPosition = object.geometry.attributes.position,
		position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
	position.fromArray( attributesPosition.array, index * attributesPosition.itemSize );
	return position;

}

/**
 * gets position of the vector in world coordinates, taking into account the position, scale and rotation of the 3D object
 * @param {THREE.Object3D} object
 * @param {THREE.Vector3} pos local position
 * @returns world position 
 */
export function getWorldPosition( object, pos ) {

	var position = new THREE.Vector3(),
		positionAngle = new THREE.Vector3();
	position = pos.clone();

	position.multiply( object.scale );

	//rotation
	positionAngle.copy( position );
	positionAngle.applyEuler( object.rotation );
	position.x = positionAngle.x;
	position.y = positionAngle.y;
	position.z = positionAngle.z;

	position.add( object.position );
	return position;

}
function getObjectPosition( object, index ) {

	if ( index === -1 )
		return undefined;
	if ( index === undefined )
		return object.position;
	return getWorldPosition( object, getObjectLocalPosition( object, index ) )

}

/**
 * Displaying points
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * Function - position of the point is function of the t. Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 * if arrayFuncs.length === 0 then push new THREE.Vector3().
 * 
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   name: point name
 *   trace: true - Displays the trace of the point movement. Default is false
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 * 
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * @param {object} options see myThreejs.create options for details
 * @param {object} [pointsOptions] followed points options is availablee:
 * @param {number} [pointsOptions.tMin] start time. Uses for playing of the points. Default is 0.
 * @param {string} [pointsOptions.name] Name of the points. Used for displaying of items of the Select drop down control of the Meshs folder of the dat.gui. Default is "".
 * @param {object} [pointsOptions.shaderMaterial] creates the THREE.Points with THREE.ShaderMaterial material.
 * The size of the each point of the THREE.Points seems the same on canvas
 * because I reduce the size of the points closest to the camera and increase the size of the points farthest to the camera.
 * See var shaderMaterialDefault of the frustumPoints for details.
 * @param {THREE.Vector3} [pointsOptions.position] position of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * Vector's x, y, z is position of the points.
 * Can be as:
 * float - position of the points.
 * [float] - array of positions of the points.
 * Function - position of the points is function of the t. Example: new Function( 't', 'return 0.1 + t' )
 * @param {THREE.Vector3} [pointsOptions.scale] scale of the points. Default is new THREE.Vector3( 1, 1, 1 ).
 * Vector's x, y, z is scale of the points.
 * Can be as:
 * float - scale of the points.
 * [float] - array of scales of the points.
 * Function - scale of the points is function of the t. Example: new Function( 't', 'return 1.1 + t' )
 * @param {THREE.Vector3} [pointsOptions.rotation] rotation of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * Vector's x, y, z is rotation of the points.
 * Can be as:
 * float - rotation of the points.
 * [float] - array of rotations of the points.
 * Function - rotation of the points is function of the t. Example: new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' )
 * @param {array} [pointsOptions.arrayCloud] Array of points with cloud.
 * If you define the array of points with cloud, then you can define a points with cloud.
 * For example you can define
 * arrayCloud: options.arrayCloud
 * on the params of the getShaderMaterialPoints( params, onReady ) function.
 * Or
 * arrayCloud: options.arrayCloud
 * on the pointsOptions of the myThreejs.points function.
 * Default is undefined
 * @param {boolean} [pointsOptions.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. See options.getColors for details. Default is undefined.
 */
export function points( arrayFuncs, group, options, pointsOptions ) { myPoints.create( arrayFuncs, group, options, pointsOptions ) }

/**
 * Converts the mesh.geometry.attributes.position to mesh.userData.arrayFuncs.
 * Used to restore the default point position.
 * @param {THREE.Mesh} mesh
 */
export function setArrayFuncs( mesh ) {

	mesh.userData.arrayFuncs = [];//Display the "Restore default local position" button.
	for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ )
		mesh.userData.arrayFuncs.push( getObjectLocalPosition( mesh, i ) );

}
/**
 * Limits angles of rotations of the mesh between 0 and 360 degrees.
 * @param {THREE.Euler} rotation angles for limitation
 */
export function limitAngles( rotation ) {

	function limitAngle( axisName ) {

		while ( rotation[axisName] > Math.PI * 2 )
			rotation[axisName] -= Math.PI * 2

	}
	limitAngle( 'x' );
	limitAngle( 'y' );
	limitAngle( 'z' );

}
/**
 * @callback getPoints
 * @param {number} t first parameter of the arrayFuncs item function. Start time of animation.
 * @param {[THREE.Vector4|THREE.Vector3|THREE.Vector2]} arrayFuncs points.geometry.attributes.position array.
 * See https://github.com/anhr/myThreejs#arrayfuncs-item  for details.
 * @param {number} a second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} b third parameter of the arrayFuncs item function. Default is 0.
 */

/**
 * @callback getColors
 * @param {number} t first parameter of the arrayFuncs item function. Start time of animation.
 * @param {[THREE.Vector4|THREE.Vector3|THREE.Vector2]} arrayFuncs points.geometry.attributes.position array.
 * See https://github.com/anhr/myThreejs#arrayfuncs-item  for details.
 * @param {object} scale options.scales.w
 * @returns array of mesh colors.
 */

/**
 * get THREE.Points with THREE.ShaderMaterial material
 * @param {object} params
 * @param {getPoints} params.getPoints get array of THREE.Vector4 points.
 * See https://github.com/anhr/myThreejs#optionsgetpoints-t-arrayfuncs-a-b- for details.
 * @param {getColors} params.getColors Get array of mesh colors.
 * See https://github.com/anhr/myThreejs#optionsget%D1%81olors-t-arrayfuncs-scale- for details.
 * @param {THREE.WebGLRenderer} params.renderer WebGLRenderer.
 * See https://threejs.org/docs/index.html#api/en/constants/Renderer for details.
 * @param {number} params.tMin start time. Uses for playing of the points. Default is 0.
 * @param {array} params.arrayFuncs points.geometry.attributes.position array.
 * See https://github.com/anhr/myThreejs#arrayfuncs-item  for details.
 * @param {number} params.a second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} params.b third parameter of the arrayFuncs item function. Default is 0.
 * @param {Float32Array} params.sizes array of the size attribute of the geometry. Array length is params.arrayFuncs.length.
 * Example: new Float32Array( arrayFuncs.length ).
 * @param {object} params.scales axes scales.
 * See options.scales of myThreejs.create( createXDobjects, options ) https://github.com/anhr/myThreejs#mythreejscreate-createxdobjects-options-.
 * @returns THREE.Points with THREE.ShaderMaterial material
 */
export function getShaderMaterialPoints( params ) {

	return myPoints.getShaderMaterialPoints( params );
	
}
