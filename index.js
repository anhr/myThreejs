/**
 * myThreejs
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

//import controllerPlay from 'https://raw.githack.com/anhr/controllerPlay/master/controllerPlay.js';
import controllerPlay from '../../controllerPlay/master/controllerPlay.js';

//import menuPlay from 'https://raw.githack.com/anhr/menuPlay/master/menuPlay.js';
import menuPlay from '../../menuPlay/master/menuPlay.js';

import Player from './player.js';

//import OrbitControlsGui from '../cookieNodeJS/OrbitControlsGui.js';
//import OrbitControlsGui from 'http://localhost/threejs/commonNodeJS/master/OrbitControlsGui.js';
//import OrbitControlsGui from 'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControlsGui.js';
import OrbitControlsGui from '../../commonNodeJS/master/OrbitControlsGui.js';

import AxesHelperGui from '../../commonNodeJS/master/AxesHelperGui.js';
import clearThree from '../../commonNodeJS/master/clearThree.js';
import ColorPicker from '../../colorpicker/master/colorpicker.js';
import PositionController from '../../commonNodeJS/master/PositionController.js';
import ScaleController from '../../commonNodeJS/master/ScaleController.js';
import { StereoEffect, spatialMultiplexsIndexs } from '/anhr/three.js/dev/examples/jsm/effects/StereoEffect.js';
import { OrbitControls } from '/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';

var palette = new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
palette.toColor = function ( value, min, max ) {

	if ( value instanceof THREE.Color )
		return value;
	var c = this.hsv2rgb( value, min, max );
	if ( c === undefined )
		c = { r: 255, g: 255, b: 255 }
	return new THREE.Color( "rgb(" + c.r + ", " + c.g + ", " + c.b + ")" );

}

var debug = true,
	url = 'localhost/threejs',//'192.168.1.2'//ATTENTION!!! localhost is not available for debugging of the mobile devices
	min = '';//min.

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
 * @param {boolean} [options.stereoEffect] true - use stereoEffect https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js.
 * @param {boolean} [options.dat] true - use dat-gui JavaScript Controller Library. https://github.com/dataarts/dat.gui
 * @param {boolean} [options.menuPlay] true - use my dropdown menu for canvas in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D objects in my projects.
 * See nodejs\menuPlay\index.js
 * @param {object} [options.player] 3D objects animation.
 * @param {number} [options.player.min] Animation start time. Default is 0.
 * @param {number} [options.player.max] Animation end time. Default is 1.
 * @param {object} [options.canvas] canvas properties
 * @param {number} [options.canvas.width] width of the canvas
 * @param {number} [options.canvas.height] height of the canvas
 * @param {object} [options.axesHelper.scales] axes scales. See three.js\src\helpers\AxesHelper.js
 * @param {number} [options.a] Can be use as 'a' parameter of the Function. See arrayFuncs for details. Default is 1.
 * @param {number} [options.b] Can be use as 'b' parameter of the Function. See arrayFuncs for details. Default is 0.
 * @param {number} [options.point] point settings.
 * @param {number} [options.point.size] point size. Default is 0.05.
 * @param {object} [options.scales] axes scales. Default is {}
 * @param {object} [options.scales.w] w axis scale options of 4D objects. Default is {}
 * @param {string} [options.scales.w.name] axis name. Default is "W".
 * @param {number} [options.scales.w.min] Minimum range of the w axis. Default is 0.
 * @param {number} [options.scales.w.max] Maximum range of the w axis. Default is 100.
 * @todo If you want to use raycaster (working out what objects in the 3d space the mouse is over) https://threejs.org/docs/index.html#api/en/core/Raycaster,
 * please add following object into your 3D Object userdata:
 * your3dObject.userData.raycaster = {

		onIntersection: function ( raycaster, intersection, scene, INTERSECTED ) {

			//Mouse is over of your 3D object event
			//TO DO something
			//For example you can use
			options.addSpriteTextIntersection( raycaster, intersection, scene );
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
	options.point.size = options.point.size || 0.05;

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
	if ( options.scales.w !== undefined )
		options.scales.w = getAxis( options.scales.w, 'W', 0, 100 );

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

/*
			if ( typeof color === "function" )
				color = color( group.userData.t, options.a, options.b );
*/
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
//				group.add( line );
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

	}

	var camera, group, scene;

	function onloadScripts() {

		var elContainer = options.elContainer === undefined ? document.getElementById( "containerDSE" ) :
			typeof options.elContainer === "string" ? document.getElementById( options.elContainer ) : options.elContainer;
		if ( elContainer === null ) {

			elContainer = document.createElement( 'div' );
			document.querySelector( 'body' ).appendChild( elContainer );

		}
		arrayContainers.push( elContainer );
		elContainer.innerHTML = loadFile.sync( 'https://raw.githack.com/anhr/myThreejs/master/canvasContainer.html' );//'http://' + url + '/nodejs/myThreejs/canvasContainer.html'
		elContainer = elContainer.querySelector( '.container' );

		var defaultCameraPosition = new THREE.Vector3( 0.4, 0.4, 2 ),
			renderer, cursor, controls, stereoEffect, player,
			playController, canvasMenu, raycaster, INTERSECTED = [], scale = options.scale, axesHelper, colorsHelper = 0x80, fOptions,
			canvas = elContainer.querySelector( 'canvas' ), gui, rendererSizeDefault, // fullScreen,

			//uses only if stereo effects does not exists
			mouse = new THREE.Vector2(), intersects, 

			//https://www.khronos.org/webgl/wiki/HandlingContextLost
			requestId;//, gl, tex;
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		const gl = canvas.getContext( 'webgl' );

		//raycaster

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );

		function isFullScreen() {

			return canvasMenu.isFullScreen();
			//return fullScreen;
/*
			if ( size === undefined ) {

				size = new THREE.Vector2();
				renderer.getSize( size );

			}
			return ( size.x === window.innerWidth ) && ( size.y === window.innerHeight );
*/

		}
		function onIntersection( intersects, mouse ) {

			intersects.forEach( function ( intersection ) {

				if ( intersection.object.userData.raycaster !== undefined ) {

//					intersection.object.userData.raycaster.onIntersection( raycaster, intersection, scene, intersection.object );
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
//			selectedPointIndex = undefined;
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
//			camera.position.set( 0.4, 0.4, 2 );

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
			cursor = renderer.domElement.style.cursor;

			//resize
			renderer.setSizeOld = renderer.setSize;
			renderer.setSize = function ( width, height, updateStyle ) {

				renderer.setSizeOld( width, height, updateStyle );

				timeoutControls = setTimeout( function () {

					elContainer.style.height = canvas.style.height;//height + "px";
					elContainer.style.width = canvas.style.width;//width + "px";
					elContainer.style.left = canvas.style.left;
					elContainer.style.top = canvas.style.top;
					elContainer.style.position = canvas.style.position;

//					if ( typeof menuPlay !== 'undefined' )
					if ( canvasMenu !== undefined )
						canvasMenu.setSize( width, height );

				}, 0 );

			};
			//			renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
			renderer.setSize( ( options.canvas !== undefined ) && (options.canvas.width !== undefined ) ? options.canvas.width : canvas.clientWidth,
				( options.canvas !== undefined ) && ( options.canvas.height !== undefined ) ? options.canvas.height : canvas.clientHeight );

			//StereoEffect. https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
			//if ( THREE.StereoEffect !== undefined )
			if ( options.stereoEffect ){

				stereoEffect = new StereoEffect( renderer, {

					spatialMultiplex: spatialMultiplexsIndexs.Mono, //.SbS,
					far: camera.far,
					camera: camera,
					stereoAspect: 1,
					cookie: cookie,
					elParent: canvas.parentElement,

				} );
				stereoEffect.options.spatialMultiplex = spatialMultiplexsIndexs.Mono;

			}

			//Light
/*
			var light = new THREE.PointLight( 0xffffff, 1 );
			light.position.copy( new THREE.Vector3( 1, 1, 1 ) );
			scene.add( light );

			light = new THREE.PointLight( 0xffffff, 1 );
			light.position.copy( new THREE.Vector3( -2, -2, -2 ) );
			scene.add( light );
*/
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
//					var min = - multiplier, max = multiplier;
					function guiLightAxis( axesId ) {

//						var axesPosition = getAxesPosition( axesId ),
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
//						controllers[axesEnum.x].max( scales[axesEnum.getName( axesEnum.x )].max );
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

			//

			group = new THREE.Group();
			scene.add( group );
			function guiSelectPoint() {

				var f3DObjects, fPoint, cRestoreDefaultLocalPosition, fPointWorld, fPonts, cMeshs, fMesh, mesh, intersection, _this = this,//, fPoints, mechScaleDefault = new THREE.Vector3()
					cScaleX, cScaleY, cScaleZ, cPosition = new THREE.Vector3(), cRotations = new THREE.Vector3(),//, cPositionX, cPositionY, cPositionZ;
					cPoints, selectedPointIndex = -1,
					controllerX, controllerY, controllerZ, controllerW, cTrace, cTraceAll, controllerColor,
					controllerWorld = new THREE.Vector3();

				//function visibleTraceLine( point, value, index )
				function visibleTraceLine( intersection, value ) {

					if ( intersection.object.userData.arrayFuncs === undefined )
						return;
					var index = intersection.index || 0, point = intersection.object.userData.arrayFuncs[index];
					var line = point.line;
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

						getObjectPosition( mesh, index ),
						player.getSelectSceneIndex(),
						//								point.w//color
						color

					);

				}
				function exposePosition() {

					var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
					if ( selectedPointIndex === -1 )
						return;

					var position = getObjectPosition( mesh, selectedPointIndex );

					if ( axesHelper !== undefined )
						axesHelper.exposePosition( position );

					controllerWorld.x.setValue( position.x );
					controllerWorld.y.setValue( position.y );
					controllerWorld.z.setValue( position.z );

				}
				function setValue( controller, v ) {

					controller.object[controller.property] = v;
					if ( controller.__onChange )
						controller.__onChange.call( controller, v );
					controller.updateDisplay();
					return controller;

				}
//				function setPosition( position, intersectionSelected )
				function setPosition( intersectionSelected ) {

/*если это оставить то attribute.position выбранной точки будет неправильной если начать проигрывание player.selectScene
					setValue( controllerX, position.x );
					setValue( controllerY, position.y );
					setValue( controllerZ, position.z );

					var positionLocal = getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
					setValue( controllerWorld.x, positionLocal.x );
					setValue( controllerWorld.y, positionLocal.y );
					setValue( controllerWorld.z, positionLocal.z );
*/
					var positionLocal = getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
					setValue( controllerX, positionLocal.x );
					setValue( controllerY, positionLocal.y );
					setValue( controllerZ, positionLocal.z );

					var position = getObjectPosition( intersectionSelected.object, intersectionSelected.index );
					setValue( controllerWorld.x, position.x );
					setValue( controllerWorld.y, position.y );
					setValue( controllerWorld.z, position.z );
					
					var displayControllerW, displayControllerColor, none = 'none', block = 'block';
					if ( isNaN( position.w ) ) {

						displayControllerW = none;
						displayControllerColor = block;

						//color
						if ( intersectionSelected.object.userData.arrayFuncs === undefined )
							displayControllerColor = none;
						else {

							var func = intersectionSelected.object.userData.arrayFuncs[intersectionSelected.index];
							//console.warn( options + group );
							if ( func.w === undefined ) {

								displayControllerColor = none;
								/*
								//2D or 3D point
								var attributesColor = intersectionSelected.object.geometry.attributes.color;
								if ( attributesColor !== undefined ) {

									var color = attributesColor.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
									color.fromArray( attributesColor.array, intersectionSelected.index * attributesColor.itemSize );
									func.w = { r: color.x, g: color.y, b: color.z }//Default color for 2D and 3D points is white

								}
								*/

							}
							if ( func.w !== undefined ) {

								controllerColor.setValue( '#' + new THREE.Color( func.w.r, func.w.g, func.w.b ).getHexString() );
								controllerColor.userData = { intersection: intersectionSelected, }

							} else displayControllerColor = none;

						}
/*
						var display = 'block';
						if ( intersectionSelected.object.userData.arrayFuncs === undefined )
							display = 'none';
						else {

							var func = intersectionSelected.object.userData.arrayFuncs[intersectionSelected.index];
//console.warn( options + group );
							if ( func.w === undefined ) {

								//2D or 3D point
								var attributesColor = intersectionSelected.object.geometry.attributes.color;
								if ( attributesColor !== undefined ) {

									var color = attributesColor.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
									color.fromArray( attributesColor.array, intersectionSelected.index * attributesColor.itemSize );
									func.w = { r: color.x, g: color.y, b: color.z }//Default color for 2D and 3D points is white

								}

							}
							controllerColor.setValue( '#' + new THREE.Color( func.w.r, func.w.g, func.w.b ).getHexString() );
							controllerColor.userData = { intersection: intersectionSelected, }

						}
						controllerColor.domElement.style.display = display;
*/

					} else {

						if ( controllerW === undefined )
							displayControllerW = none;
						else {

							setValue( controllerW, position.w );
							displayControllerW = block;

						}
						displayControllerColor = none;

					}
					function dislayEl( controller, displayController ) {

						if ( controller === undefined )
							return;
						var el = controller.domElement;
						while ( el.tagName.toUpperCase() !== "LI" ) el = el.parentElement;
						el.style.display = displayController;

					}
					dislayEl( controllerW, displayControllerW )
					dislayEl( controllerColor, displayControllerColor )

				}
				this.setMesh = function () {

					setScaleControllers();
					setPositionControllers();
					setRotationControllers();

				}
				this.setPosition = function ( position, intersectionSelected ) {

					for ( var i = 0; i < cMeshs.__select.length; i++ ) {

						var option = cMeshs.__select[i];
						if ( option.selected && ( parseInt( option.getAttribute( 'value' ) ) === intersectionSelected.object.userData.index - 1 ) ) {

//							setPosition( position, intersectionSelected );
							setPosition( intersectionSelected );

						}

					}

				}
				this.select = function ( intersectionSelected ) {

					var position = getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
					if ( f3DObjects === undefined ) {

						selectedPointIndex = intersectionSelected.index || -1;
						if ( ( mesh !== undefined ) && ( mesh !== intersectionSelected.object ) && ( axesHelper !== undefined ) )
							axesHelper.exposePosition();//remove dot lines
						mesh = intersectionSelected.object;
						return;//options.dat !== true and gui === undefined. Do not use dat.gui

					}

					f3DObjects.close();//если тут не закрывать папку, то ингода прорпадает скроллинг окна dat.GUI
					//for testing:
					//Open https://raw.githack.com/anhr/myThreejs/master/Examples/html/
					//Set browser window height about 500 pixels.
					//Click Full Screen button.
					//Open Controls
					//Click a point.The "Meshs" folder opens and you can see the scrolling of the dat.gui window.

					//select mesh
					var index = intersectionSelected.object.userData.index;
					cMeshs.__select[index].selected = true;
					cMeshs.__onChange( index - 1 );

					function selectPoint() {

						if ( intersectionSelected.index === undefined )
							return;
						fPonts.open();
						cPoints.__select[intersectionSelected.index + 1].selected = true;
						var block = 'block';
						fPoint.domElement.style.display = block;
						fPointWorld.domElement.style.display = block;
						intersection = intersectionSelected;
						setPosition( intersectionSelected );

						var line = mesh.userData.arrayFuncs === undefined ? undefined : mesh.userData.arrayFuncs[intersectionSelected.index].line;//You can not trace points if you do not defined the mesh.userData.arrayFuncs
						cTrace.setValue( line === undefined ? false : line.isVisible() )

						cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display =
							intersection.object.userData.arrayFuncs === undefined ? 'none' : block;

					}
					selectPoint();

					f3DObjects.open();
					
				}
				this.isSelectedMesh = function ( meshCur ) { return mesh === meshCur }
				this.getSelectedPointIndex = function() {

					if ( cPoints === undefined ) {

						if ( selectedPointIndex === undefined )
							console.error( 'myThreejs.create.onloadScripts.init.guiSelectPoint.getSelectedPointIndex:  selectedPointIndex = ' + selectedPointIndex );
						return selectedPointIndex;//options.dat !== true and gui === undefined. Do not use dat.gui

					}

					for ( var i = 0; i < cPoints.__select.length; i++ ) {

						var option = cPoints.__select[i];
						if ( option.selected )
							return parseInt( option.getAttribute( 'value' ) );

					}
					console.error( 'myThreejs.create.onloadScripts.init.guiSelectPoint.getSelectedPointIndex: point is not selected' );

				}
				function setScaleControllers() {

					if ( ( mesh === undefined ) || ( gui === undefined ) )
						return;
					cScaleX.setValue( mesh.scale.x );
					cScaleY.setValue( mesh.scale.y );
					cScaleZ.setValue( mesh.scale.z );
/*
					var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
					if ( ( axesHelper !== undefined ) && ( selectedPointIndex !== -1 ) )
						axesHelper.exposePosition( getObjectPosition( mesh, selectedPointIndex ) );
*/

				}
				function setPositionControllers() {

					if ( ( mesh === undefined ) || ( gui === undefined ) )
						return;
					cPosition.x.setValue( mesh.position.x );
					cPosition.y.setValue( mesh.position.y );
					cPosition.z.setValue( mesh.position.z );
/*
					var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
					//						if ( ( axesHelper !== undefined ) && ( selectedPointIndex !== undefined ) )
					if ( ( axesHelper !== undefined ) && ( selectedPointIndex !== -1 ) )
						axesHelper.exposePosition( getObjectPosition( mesh, selectedPointIndex ) );
*/

				}
				function setRotationControllers() {

					if ( ( mesh === undefined ) || ( gui === undefined ) )
						return;
					cRotations.x.setValue( mesh.rotation.x );
					cRotations.y.setValue( mesh.rotation.y );
					cRotations.z.setValue( mesh.rotation.z );
/*
					var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
					if ( ( axesHelper !== undefined ) && ( selectedPointIndex !== -1 ) )
						axesHelper.exposePosition( getObjectPosition( mesh, selectedPointIndex ) );
*/

				}
				this.add = function ( folder ) {

					f3DObjects = folder.addFolder( lang.meshs );

					cMeshs = f3DObjects.add( { Meshs: lang.notSelected }, 'Meshs', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

//						cPoints.__select[0].selected = true;
						cPoints.__onChange( -1 );
						value = parseInt( value );
						var display;
						if ( value === -1 ) {

							display = 'none';
							mesh = undefined;

						} else {

							display = 'block';
							mesh = group.children[value];

							//points
							while ( cPoints.__select.length > 1 )
								cPoints.__select.remove( cPoints.__select.length - 1 );
							for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

								var opt = document.createElement( 'option' ),
									name = mesh.userData.arrayFuncs === undefined ? undefined : mesh.userData.arrayFuncs[i].name;
								opt.innerHTML = i + ( name === undefined ? '' : ' ' + name );
								opt.setAttribute( 'value', i );
								cPoints.__select.appendChild( opt );

							}

							setScaleControllers();
							setPositionControllers();
							setRotationControllers();
						}
						fMesh.domElement.style.display = display;

						mesh.userData.traceAll = mesh.userData.traceAll || false;
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
/*
						var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
						if ( ( axesHelper !== undefined ) && ( selectedPointIndex !== -1 ) )
							axesHelper.exposePosition( getObjectPosition( mesh, selectedPointIndex ) );
*/

					},
						{

							zoomMultiplier: 1.1,
							getLanguageCode: getLanguageCode,

						} ) );
					var scale = new THREE.Vector3();
					function setScale( axesName, value ) {

						mesh.scale[axesName] = value;
						mesh.needsUpdate = true;

						setScaleControllers();

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

//							mesh.scale.copy( mechScaleDefault );
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
/*
							var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
							if ( ( axesHelper !== undefined ) && ( selectedPointIndex !== -1 ) )
								axesHelper.exposePosition( getObjectPosition( mesh, selectedPointIndex ) );
*/

						}, { getLanguageCode: getLanguageCode, } ) );

						function setPosition( value ) {

							mesh.position[name] = value;
							mesh.needsUpdate = true;

							setPositionControllers();

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
//						vRotation = new THREE.Vector3(),
//						exRotation = { min: 0, max: Math.PI * 2, step: 1 / 360 };
					function addRotationControllers( name ) {

						cRotations[name] = fRotation.add( new THREE.Vector3(), name, 0, Math.PI * 2, 1 / 360 ).
							onChange( function ( value ) {

								mesh.rotation[name] = value;
								mesh.needsUpdate = true;

//								setRotationControllers();
								exposePosition();
/*
								var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
								if ( ( axesHelper !== undefined ) && ( selectedPointIndex !== -1 ) )
									axesHelper.exposePosition( getObjectPosition( mesh, selectedPointIndex ) );
*/

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

					fPonts = fMesh.addFolder( lang.points );
					cPoints = fPonts.add( { Points: lang.notSelected }, 'Points', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

						value = parseInt( value );
						var display, position;
						if ( value === -1 ) {

							display = 'none';

						} else {

							display = 'block';
							_this.select( { object: mesh, index: value } );
/*
							position = getObjectPosition( mesh, value );
							_this.select( position, { object: mesh, index: value } );
*/

						}
						if ( ( axesHelper !== undefined ) && ( mesh !== undefined ) )
							axesHelper.exposePosition( getObjectPosition( mesh, value ) );
						fPoint.domElement.style.display = display;
						fPointWorld.domElement.style.display = display;

					} );
					cPoints.__select[0].selected = true;
					dat.controllerNameAndTitle( cPoints, lang.select );

					//Points attribute position
					fPoint = fPonts.addFolder( lang.point );
					dat.folderNameAndTitle( fPoint, lang.point, lang.pointTitle );
					fPoint.domElement.style.display = 'none';
//					fPoint.open();

					//Points world position
					fPointWorld = fPonts.addFolder( lang.pointWorld );
					dat.folderNameAndTitle( fPointWorld, lang.pointWorld, lang.pointWorldTitle );
					fPointWorld.domElement.style.display = 'none';
					fPointWorld.open();

					//displays the trace of the movement of all points of the mesh
					cTraceAll = fPonts.add( { trace: false }, 'trace' ).onChange( function ( value ) {

						mesh.userData.traceAll = value;
/*
						if ( mesh.userData.arrayFuncs !== undefined )//You can not trace points if you do not defined the mesh.userData.arrayFuncs
							for ( var i = 0; i < mesh.userData.arrayFuncs.length; i++ )
								visibleTraceLine( { object: mesh, index: i }, value );
*/
						for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ )
							visibleTraceLine( { object: mesh, index: i }, value );

					} );
					dat.controllerNameAndTitle( cTraceAll, lang.trace, lang.traceAllTitle );

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

				this.addControllers = function (){

					//					var point = f3DObjects.add( { Points: lang.selectPoints }, 'Points', [lang.selectPoints, 'pizza', 'chrome', 'hooray'] );
					for ( var i = 0; i < group.children.length; i++ ) {

						var mesh = group.children[i];
						mesh.userData.index = cMeshs.__select.length;

						var opt = document.createElement( 'option' );
						opt.innerHTML = i + ' ' + ( mesh.name === '' ? mesh.constructor.name : mesh.name );
						opt.setAttribute( 'value', i );
						cMeshs.__select.appendChild( opt );

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

									//update of the w axis value
									//									movePointAxes( axesId, value );

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

									var points = intersection.object;
									points.geometry.attributes.position.array
									[axesId + intersection.index * points.geometry.attributes.position.itemSize] = value;
									points.geometry.attributes.position.needsUpdate = true;

									exposePosition();
									/*
																		//dotLines
																		if ( axesHelper !== undefined )
																			axesHelper.exposePosition( getPosition( intersection ) );
									*/

								} );
							/*
							controller = fPointWorld.add( {

								value: scale.min,

							}, 'value'),
								scale.min,
								scale.max,
								( scale.max - scale.min ) / 100 ).
								onChange( function ( value ) {
								} );*/

						}
						dat.controllerNameAndTitle( controller, scale.name );
						return controller;

					}
					var axesEnum = THREE.AxesHelperOptions.axesEnum;
					controllerX = axesGui( axesEnum.x );//, optionsGui.onChangeX ),
					controllerY = axesGui( axesEnum.y );//, optionsGui.onChangeY ),
					controllerZ = axesGui( axesEnum.z );//, optionsGui.onChangeZ );
					controllerW = axesGui( axesEnum.w );
					controllerColor = fPoint.addColor( {

						color: '#FFFFFF',

					}, 'color').
						onChange( function ( value ) {

							if ( controllerColor.userData === undefined )
								return;
							var intersection = controllerColor.userData.intersection;
							setColorAttribute( intersection.object.geometry.attributes, intersection.index, value );

						} );

					//read only
					/*
					controllerColor.domElement.querySelector( 'input' ).readOnly = true;
					controllerColor.domElement.querySelector( '.selector' ).style.display = 'none';
					*/

					dat.controllerNameAndTitle( controllerColor, lang.color );

					//displays the trace of the point movement
					cTrace = fPoint.add( { trace: false }, 'trace' ).onChange( function ( value ) {

						visibleTraceLine( intersection, value );

					} );
					dat.controllerNameAndTitle( cTrace, lang.trace, lang.traceTitle );

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
			guiSelectPoint = new guiSelectPoint();

			//dat-gui JavaScript Controller Library
			//https://github.com/dataarts/dat.gui
			if ( ( options.dat !== undefined ) ) {

				if ( gui !== undefined ) {

					for ( var i = gui.__controllers.length - 1; i >= 0; i-- )
						gui.remove( gui.__controllers[i] );
					var folders = Object.keys( gui.__folders );
					for ( var i = folders.length - 1; i >= 0; i-- )
						gui.removeFolder( gui.__folders[folders[i]] );
//					gui.destroy();

				} else gui = new dat.GUI( {

					//autoPlace: false,//Убрать скроллинг когда окно gui не влазит в окно браузера
//					closed: true,//Icorrect "Open Controls" button name

				} );

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

				guiSelectPoint.add( gui );

				//Убрал эту строку потому что еще не готовы options.scales которые устанавливаются в getScalesOptions
//				guiSelectPoint.addControllers();

			}

			//если я оставлю здесь этот вызов, то начальное время tMin будет еще не известно и не удасться установить все 3D объекты в начальное положение
//			createXDobjects( group );

			//PlayController https://github.com/anhr/controllerPlay. My custom controller in my version of dat.gui https://github.com/anhr/dat.gui for playing of 3D objects in my projects.

			if ( options.player !== undefined ) {

				options.player.cookie = cookie;
				player = new Player( options.player, function ( index ) {

					var t = ( ( options.player.max - options.player.min ) / ( options.player.marks - 1 ) ) * index + options.player.min;
//					group.userData.index = index;
					selectPlayScene( t, index );
					if ( canvasMenu !== undefined )
						canvasMenu.setIndex( index, options.player.name + ': ' + t );

				} );
				if ( gui !== undefined ) {

					playController = controllerPlay.create( player );
					gui.add( playController );

				}

			}
			if ( gui !== undefined )
				fOptions = gui.addFolder( lang.settings );
			if ( stereoEffect !== undefined ) {

//				var spatialMultiplexsIndexs = options.stereoEffect.spatialMultiplexsIndexs;
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

					},

				} );

			}

			if ( options.menuPlay ) {

				if ( ( canvasMenu === undefined ) ) {

					canvasMenu = new menuPlay.create( elContainer, {

						stereoEffect: stereoEffect === undefined ? stereoEffect :
							{ stereoEffect: stereoEffect, spatialMultiplexsIndexs: spatialMultiplexsIndexs },
						player: player,
						//					play: options.play,
						//					playController: playController,
						onFullScreenToggle: function ( fullScreen ) {

							return rendererSizeDefault.onFullScreenToggle( fullScreen );

						},
						onFullScreen: function ( fullScreen, elContainer ) {

							rendererSizeDefault.onFullScreenToggle( !fullScreen );
							//						arrayContainers.display( elContainer.parentElement, fullScreen );

						},
						THREE: THREE,

					} );
					options.canvasMenu = canvasMenu;

				} else canvasMenu.setPlayer( player );

			}

			//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			if ( options.orbitControls ) {

				controls = new OrbitControls( camera, renderer.domElement );
				//				controls.target.set( 0, 0, 0 );
				controls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
				controls.update();

			}

			options.onChangeScaleT = function ( scale ) {

				if ( canvasMenu !== undefined )
					canvasMenu.onChangeScale( scale );

			}

			// helper

			if ( options.axesHelper ) {

				if ( options.scales.t !== undefined ) {

					options.scales.t.min = options.scales.t.min || 0;
					options.scales.t.max = options.scales.t.max || 1;
					options.scales.t.marks = options.scales.t.marks || 2;

				}
				axesHelper = new THREE.AxesHelper( 1 * scale, {

					cookie: cookie,
					scene: scene,
					negativeAxes: true,
					colors: colorsHelper / 0xff, //gray axes
					colorsHelper: colorsHelper,
					onChangeScaleT: options.onChangeScaleT,
					scales: options.scales,

				} );
				scene.add( axesHelper );

				if ( controls !== undefined )
					controls.update();//if scale != 1 and position != 0 of the screen, то после открытия canvas положение картинки смещено. Положение восстанавливается только если подвигать мышью
			}

			createXDobjects( group, options );

			function selectPlayScene( t, index ) {

				group.userData.t = t;
				group.children.forEach( function ( mesh ) {

					if ( mesh.userData.selectPlayScene !== undefined ) {

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
								if ( typeof funcs.x === "function" ) {

									attributes.position.setX( i, funcs.x( t, a, b ) );
									needsUpdate = true;

								}
								if ( typeof funcs.y === "function" ) {

									attributes.position.setY( i, funcs.y( t, a, b ) );
									needsUpdate = true;

								}
								if ( typeof funcs.z === "function" ) {

									attributes.position.setZ( i, funcs.z( t, a, b ) );
									needsUpdate = true;

								}
								let color;
								if ( typeof funcs.w === "function" ) {

									attributes.position.setW( i, funcs.w( t, a, b ) );
									needsUpdate = true;

									var min, max, value = funcs.w( t, a, b );
									if ( options.scales.w !== undefined ) {

										min = options.scales.w.min; max = options.scales.w.max;

									} else {

										max = value;
										min = max - 1;

									}
									color = palette.toColor( value, min, max );

								} else if ( funcs.w instanceof THREE.Color ) {

									color = funcs.w;

								} else color = new THREE.Color( 1, 1, 1 );//white
//								if ( attributes.color !== undefined )
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

						guiSelectPoint.setMesh();

						var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
//							if ( selectedPointIndex !== undefined )
						if ( ( selectedPointIndex !== -1 ) && guiSelectPoint.isSelectedMesh( mesh ) ) {

							var position = getObjectPosition( mesh, selectedPointIndex );

							if ( axesHelper !== undefined )
								axesHelper.exposePosition( position );

							if ( gui !== undefined )
								guiSelectPoint.setPosition( position, {

									object: mesh,
									index: selectedPointIndex,

								} );

						}

					}

				} );

			}
//			group.userData.index = 0;
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
					AxesHelperGui( fOptions, guiSelectPoint, {

						axesHelper: axesHelper,
						options: options,
						cookie: cookie,
						getLanguageCode: getLanguageCode,

					} );//, options );

				guiSelectPoint.addControllers();
				
				//OrbitControls gui

//				if ( options.orbitControlsGui === true )
				if ( ( options.orbitControls !== undefined ) && ( options.orbitControls.gui ) )
					OrbitControlsGui( fOptions, controls, {

						getLanguageCode: getLanguageCode,
						scales: options.scales,
//						scales: options.axesHelper === undefined ? undefined : options.axesHelper.scales,

					} );

				// light

				var scales = axesHelper === undefined ? options.scales : axesHelper.options.scales;
				pointLight1.controls( group, fOptions, scales, lang.light + ' 1' );
				pointLight2.controls( group, fOptions, scales, lang.light + ' 2' );

				//point

				var defaultSize = options.point.size, pointName = 'Point_' + getCanvasName();
				cookie.getObject( pointName, options.point, options.point );

				var fPoint = fOptions.addFolder( lang.pointSettings ),
					fSize = fPoint.addFolder( lang.size );
				dat.folderNameAndTitle( fSize, lang.size, lang.sizeTitle );

				//point size
				function setSize( value ) {

					if ( value === undefined )
						value = options.point.size;
					if ( value < 0 )
						value = 0;
//					options.point.size = value;
					size.setValue( value );
					cookie.setObject( pointName, options.point );

				}

				fSize.add( new PositionController( function ( shift ) {

					setSize( options.point.size + shift );

				}, { offset: 0.01, min: 0.01, max: 0.1, step: 0.01 } ) );

				//size
				//	target = fX.add( orbitControls.target, 'x' );
				var size = dat.controllerZeroStep( fSize, options.point, 'size', function ( value ) {

					setSize( value );

				} );
				dat.controllerNameAndTitle( size, lang.size, lang.sizeTitle );

				//point size default button
				dat.controllerNameAndTitle( fSize.add( {

					defaultF: function ( value ) {

						setSize( defaultSize );

					},

				}, 'defaultF' ), lang.defaultButton, lang.defaultSizeTitle );

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

					if ( raycaster === undefined ) {

						raycaster = new THREE.Raycaster();
//item.material.size is NaN if item.material is ShaderMaterial
//						raycaster.params.Points.threshold = item.material.size / 3;//0.03;
						raycaster.params.Points.threshold = options.point.size / 3;//0.03;
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
//									var position = getPosition( intersection );
//									var position = getObjectLocalPosition( intersection.object, intersection.index );
//									guiSelectPoint.select( position, intersection );
									guiSelectPoint.select( intersection );
									if ( ( intersection.object.type === "Points" ) && ( axesHelper !== undefined ) )
										axesHelper.exposePosition( getPosition( intersection ) );

								}

							} );

					}

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

/*
						var size = new THREE.Vector2();
						renderer.getSize( size );
						if ( fs === undefined ) {

							fullScreen = ( size.x === window.innerWidth ) && ( size.y === window.innerHeight );
							//							fullScreen = isFullScreen( size );

						} else fullScreen = fs;
						if ( fullScreen ) {

							//restore size of the canvas
							renderer.setSize( sizeOriginal.x, sizeOriginal.y );
							renderer.domElement.style.position = style.position;
							renderer.domElement.style.left = style.left;
							renderer.domElement.style.top = style.top;
							renderer.domElement.style.width = style.width;
							renderer.domElement.style.height = style.height;

						} else {

							//Full screen of the canvas
							renderer.setSize( window.innerWidth, window.innerHeight );
							renderer.domElement.style.position = 'fixed';
							renderer.domElement.style.left = 0;
							renderer.domElement.style.top = 0;
							renderer.domElement.style.width = '100%';
							renderer.domElement.style.height = '100%';

						}

						camera.aspect = size.x / size.y;
						camera.updateProjectionMatrix();

						fullScreen = !fullScreen;
*/						
						arrayContainers.display( elContainer.parentElement, !fs );//fullScreen );
/*						
						if ( canvasMenu !== undefined )
							canvasMenu.setFullScreenButton( fullScreen );

						return fullScreen;
*/						
						return { renderer: renderer, camera: camera };

					},

				};

			};
			rendererSizeDefault = getRendererSize();

			window.addEventListener( 'resize', onResize, false );

			function getCanvasName() {
				return typeof options.elContainer === "object" ?
					options.elContainer.id :
					typeof options.elContainer === "string" ?
						options.elContainer :
						'';
			}

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

			requestId = requestAnimationFrame( animate );

			if ( player !== undefined )
				player.animate();

			render();

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

					renderer.domElement.style.cursor = 'pointer';
					onIntersection( intersects, mouse );

				} else {

					renderer.domElement.style.cursor = cursor;
					onIntersectionOut( intersects );

				}

			}

			//set size of points with ShaderMaterial
			//https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial
			//Example https://threejs.org/examples/?q=points#webgl_custom_attributes_points2
			group.children.forEach( function ( mesh ) {

				if ( ( mesh instanceof THREE.Points === false ) || ( mesh.geometry.attributes.size === undefined ) )
					return;

				//scale
				var parent = mesh.parent, scale = 1;
				while ( parent !== null ) {

					scale *= ( parent.scale.x + parent.scale.y + parent.scale.z ) / 3;
					parent = parent.parent;

				}

				//points with ShaderMaterial
				for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

					var position = getObjectPosition( mesh, i ),
						distance = new THREE.Vector3( position.x, position.y, position.z ).distanceTo( camera.position );
					mesh.geometry.attributes.size.setX( i, Math.tan( options.point.size ) * distance /
						scale );
//					mesh.geometry.attributes.size.setX( i, distance * options.point.size * 0.5 / scale );

//					mesh.geometry.attributes.size.setX( i, distance * options.point.size * 0.5 );
//					mesh.geometry.attributes.size.setX( i, distance * options.point.size * 0.5 * scene.scale.x );
					mesh.geometry.attributes.size.needsUpdate = true;

				}

			} );

		}

		var timeoutControls;

		arrayCreates.shift();
		var params = arrayCreates.shift();
		if ( params === undefined )
			return;
		create( params.createXDobjects, params.options );

	}

	var optionsStyle = {

		//style rel="stylesheet"
		tag: 'style',
/*
		onload: function ( response, url ) {

			console.log( 'loadScript.onload: ' + url );

		},
*/

	}

	var arrayScripts = [
	];
	if ( options.dat !== undefined ) {

/*
		loadScript.sync( debug ? 'http://' + url + '/dropdownMenu/master/styles/gui.css' :
			'https://raw.githack.com/anhr/DropdownMenu/master/styles/gui.css', optionsStyle );
*/
		loadScript.sync( '../../../../dropdownMenu/master/styles/gui.css', optionsStyle );

		//for .container class
/*
		loadScript.sync( debug ? 'http://' + url + '/dropdownMenu/master/styles/menu.css' :
			'https://raw.githack.com/anhr/DropdownMenu/master/styles/menu.css', optionsStyle );
*/
		loadScript.sync( '../../../../dropdownMenu/master/styles/menu.css', optionsStyle );

	}

	/**
	 * Get array of THREE.Vector4 points.
	 * @param {number} t first parameter of the arrayFuncs item function. Start time of the player.
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
	 * @param {number} a second parameter of the arrayFuncs item function. Default is 1.
	 * @param {number} b third parameter of the arrayFuncs item function. Default is 0.
	 * @returns array of THREE.Vector4 points.
	 */
	options.getPoints = function ( t, arrayFuncs, a, b ) {

		if ( t === undefined )
			console.error( 'getPoints: t = ' + t );
		var points = [];
//		arrayFuncs.forEach( function ( funcs )
		for ( var i = 0; i < arrayFuncs.length; i++ ){

			var funcs = arrayFuncs[i];
			function getAxis(axisName) {

				if ( ( funcs instanceof THREE.Vector2 ) || ( funcs instanceof THREE.Vector3 ) || ( funcs instanceof THREE.Vector4 ) )
					return typeof funcs[axisName] === "function" ? funcs[axisName]( t, a, b ) : funcs[axisName];
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
				return typeof funcs[axisName] === "function" ? funcs[axisName]( t, a, b ) : funcs[axisName];

			}
			var point = new THREE.Vector4( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ), getAxis( 'w' ), );

			if ( funcs.w === undefined )
				point.w = {};//Если тут поставить NaN то в points.geometry.attributes.position.array он преобразуется в 0.
			//Тогда в gui появится ненужный орган управления controllerW
			//от балды поставил пустой объект что бы при создании points.geometry.attributes.position.array
			//это зачение преобразвалось в NaN.

			points.push( point );

		}
		return points;

	}

	options.getСolors = function ( t, arrayFuncs, scale ) {

		if ( t === undefined )
			console.error( 'getСolors: t = ' + t );

		var colors = [];
		arrayFuncs.forEach( function ( funcs ) {

			var min, max;
			if ( scale !== undefined ) {

				min = scale.min; max = scale.max;

			} else {

				max = funcs instanceof THREE.Vector4 ? funcs.w : 1;
				min = max - 1;

			}
			if ( funcs instanceof THREE.Vector4 ) {

				var color = palette.toColor( funcs.w, min, max );
				colors.push( color.r, color.g, color.b );

			} else colors.push( 1, 1, 1 );//white

/*
			var color = palette.toColor( funcs instanceof THREE.Vector4 ? funcs.w : max, min, max );
			colors.push( color.r, color.g, color.b );
*/

		} );
		return colors;

	}

	options.addSpriteTextIntersection = function ( raycaster, intersection, scene, mouse ) {

		var spriteTextIntersection = findSpriteTextIntersection( scene );
		var textColor = 'rgb( 128, 128, 128 )',
			position = getPosition( intersection ),
			func = intersection.object.userData.arrayFuncs === undefined ? undefined : intersection.object.userData.arrayFuncs[intersection.index];

		// Make the spriteText follow the mouse
		//https://stackoverflow.com/questions/36033879/three-js-object-follows-mouse-position
		var vector = new THREE.Vector3( mouse.x, mouse.y, 0 );
		vector.unproject( camera );
		var dir = vector.sub( camera.position ).normalize();
		var pos = camera.position.clone().add( dir.multiplyScalar( 1 ) );

		var parent = intersection.object.parent;
		while ( parent !== null ) {

			pos.sub( parent.position );
//			pos.multiply( parent.scale );
			pos.divide( parent.scale );
/*
			pos.x /= parent.scale.x;
			pos.y /= parent.scale.y;
			pos.z /= parent.scale.z;
*/
			parent = parent.parent;

		}

		if ( spriteTextIntersection === undefined ) {

			var isArrayFuncs = ( ( intersection.index !== undefined ) && ( intersection.object.userData.arrayFuncs !== undefined ) );
			var pointName = !isArrayFuncs ? undefined : intersection.object.userData.arrayFuncs[intersection.index].name;
			spriteTextIntersection = new THREE.SpriteText(
				( intersection.object.name === '' ? '' : lang.mesh + ': ' + intersection.object.name + '\n' ) +
				( pointName === undefined ? '' : lang.pointName + ': ' + pointName + '\n' ) +
				options.scales.x.name + ': ' + position.x +
				'\n' + options.scales.y.name + ': ' + position.y +
				'\n' + options.scales.z.name + ': ' + position.z +
				(
					!isArrayFuncs ?
						'' :
						intersection.object.userData.arrayFuncs[intersection.index] instanceof THREE.Vector4 ?
							isNaN( position.w ) ?
								'\n' + lang.color + ': ' + new THREE.Color( func.w.r, func.w.g, func.w.b ).getHexString() :
								'\n' + options.scales.w.name + ': ' + position.w :
							''

				), {

					textHeight: 0.2,
					fontColor: textColor,
					rect: {

						displayRect: true,
						borderThickness: 3,
						borderRadius: 10,
						borderColor: textColor,
						backgroundColor: 'rgba( 0, 0, 0, 1 )',

					},
					position: pos,//position,//positionProject,
					center: new THREE.Vector2( 0.5, 0 ),

				} );
			spriteTextIntersection.name = spriteTextIntersectionName;
			spriteTextIntersection.scale.divide( scene.scale );
			scene.add( spriteTextIntersection );

		} else spriteTextIntersection.position.copy( pos );

	}

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

	if ( arrayScripts.length > 0 ) {

		//ATTENTION!!! If you use loadScript.sync, then you can not see some source code files during debugging.
		loadScript.async( arrayScripts, {
			onload: onloadScripts,
			onerror: function ( str, e ) {

				console.error( str );

			},

		} );

	}
	else onloadScripts();

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
	point: 'Point local position',
	pointTitle: 'The position attribute of the selected point',
	pointWorld: 'Point world position',
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
	defaultSizeTitle: 'Restore point size',
	
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
		lang.defaultSizeTitle = 'Восстановить размер точек';

		lang.trace = 'Трек';
		lang.traceTitle = 'Показать трек перемещения точки.';

		break;

}

//for raycaster
//var selectedPointIndex;
function getPosition( intersection ) {

	return getObjectPosition( intersection.object, intersection.index );

}
function getObjectLocalPosition( object, index ) {

	var attributesPosition = object.geometry.attributes.position,
		position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
	position.fromArray( attributesPosition.array, index * attributesPosition.itemSize );
	return position;

}
function getObjectPosition( object, index ) {

	var attributesPosition = object.geometry.attributes.position;
	if ( index === undefined )
		return object.position;
	var position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3(),
		position2 = getObjectLocalPosition( object, index ),
		positionAngle = new THREE.Vector3();
	position = position2.clone();

	position.multiply( object.scale );
/*
	var parent = object;
	while ( parent !== null ) {

		//position.multiply( parent.scale );
		position.x /= parent.scale.x;
		position.y /= parent.scale.y;
		position.z /= parent.scale.z;
		parent = parent.parent;

	}
*/
	//rotation
	positionAngle.copy( position );
	positionAngle.applyEuler( object.rotation );
	position.x = positionAngle.x;
	position.y = positionAngle.y;
	position.z = positionAngle.z;

	position.add( object.position );

	return position;

}

/**
 * Displaying points
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object} arrayFuncs points.geometry.attributes.position array
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
 * }
 * @param {object} options see myThreejs.create options for details
 * @param {object} [pointsOptions] followed points options is availablee:
 * @param {number} [pointsOptions.tMin] start time. Uses for playing of the points. Default is 0.
 * @param {string} [pointsOptions.name] Name of the points. Used for displaying of items of the Select drop down control of the Meshs folder of the dat.gui. Default is "".
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
 */
export function Points( arrayFuncs, options, pointsOptions ) {

	if ( arrayFuncs.length === 0 )
		arrayFuncs.push( new THREE.Vector3() );
	pointsOptions = pointsOptions || {};
	pointsOptions.tMin = pointsOptions.tMin || 0;
	pointsOptions.name = pointsOptions.name || '';
	pointsOptions.position = pointsOptions.position || new THREE.Vector3( 0, 0, 0 );
	pointsOptions.scale = pointsOptions.scale || new THREE.Vector3( 1, 1, 1 );
//	pointsOptions.rotation = pointsOptions.rotation || new THREE.Euler();
	pointsOptions.rotation = pointsOptions.rotation || new THREE.Vector3();

	var points = new THREE.Points(
		new THREE.BufferGeometry().setFromPoints( options.getPoints( pointsOptions.tMin, arrayFuncs, options.a, options.b ), 4 ),
		new THREE.PointsMaterial( { size: options.point.size, vertexColors: THREE.VertexColors } )
	);
	points.name = pointsOptions.name;//'Wave';
	points.geometry.addAttribute( 'color',
		new THREE.Float32BufferAttribute( options.getСolors( pointsOptions.tMin, arrayFuncs, options.scales.w ), 3 ) );
	points.userData.arrayFuncs = arrayFuncs;
	points.userData.raycaster = {

		onIntersection: function ( raycaster, intersection, scene, mouse ) {

			options.addSpriteTextIntersection( raycaster, intersection, scene, mouse );

		},
		onIntersectionOut: function ( scene ) {

			options.removeSpriteTextIntersection( scene );

		},

	}
	points.userData.selectPlayScene = function ( t ) {

		setPositions( t );
		setScales( t );
		setRotations( t );
//		setAttributes( options.a, options.b );

	}
	function setPositions( t ) {

		t = t || pointsOptions.tMin;
		function setPosition( axisName ) {

			points.position[axisName] = typeof pointsOptions.position[axisName] === "function" ?
				pointsOptions.position[axisName]( t, options.a, options.b ) :
				pointsOptions.position[axisName];

		}
		setPosition( 'x' );
		setPosition( 'y' );
		setPosition( 'z' );

	}
	//setPositions();
//	points.position.copy( pointsOptions.position );
	function setScales( t ) {

		t = t || pointsOptions.tMin;
		function setScale( axisName ) {

			points.scale[axisName] = typeof pointsOptions.scale[axisName] === "function" ?
				pointsOptions.scale[axisName]( t, options.a, options.b ) :
				pointsOptions.scale[axisName];

		}
		setScale( 'x' );
		setScale( 'y' );
		setScale( 'z' );

	}
//	points.scale.copy( pointsOptions.scale );
	function setRotations( t ) {

		t = t || pointsOptions.tMin;
		function setRotation( axisName ) {

			points.rotation[axisName] = typeof pointsOptions.rotation[axisName] === "function" ?
				pointsOptions.rotation[axisName]( t, options.a, options.b ) :
				pointsOptions.rotation[axisName];
			while ( points.rotation[axisName] > Math.PI * 2 )
				points.rotation[axisName] -= Math.PI * 2

		}
		setRotation( 'x' );
		setRotation( 'y' );
		setRotation( 'z' );

	}
//	points.rotation.copy(pointsOptions.rotation);
	return points;

}
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
