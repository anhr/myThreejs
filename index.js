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
import loadScript from '../../loadScriptNodeJS/loadScript.js';

//Please download https://github.com/anhr/loadFileNodeJS into ../loadFileNodeJS folder
import loadFile from '../../loadFileNodeJS/loadFile.js';

//https://threejs.org/docs/#manual/en/introduction/Import-via-modules
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

} from '../../../three.js/dev/build/three.module.js';//'http://localhost/threejs/three.js/build/three.module.js';


import cookie from '../../cookieNodeJS/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';

import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';


import controllerPlay from '../../controllerPlay/controllerPlay.js';
import menuPlay from '../../menuPlay/menuPlay.js';
import Player from './player.js';

//import OrbitControlsGui from '../cookieNodeJS/OrbitControlsGui.js';
//import OrbitControlsGui from 'http://localhost/threejs/nodejs/commonNodeJS/OrbitControlsGui.js';
//import OrbitControlsGui from 'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControlsGui.js';
import OrbitControlsGui from '../../commonNodeJS/OrbitControlsGui.js';

import AxesHelperGui from '../../commonNodeJS/AxesHelperGui.js';
import clearThree from '../../commonNodeJS/clearThree.js';
import ColorPicker from '../../colorpicker/colorpicker.js';
import PositionController from '../../commonNodeJS/PositionController.js';
import ScaleController from '../../commonNodeJS/ScaleController.js';

var palette = new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
palette.toColor = function ( value, min, max ) {

	var c = this.hsv2rgb( value, min, max );
	if ( c === undefined )
		c = { r: 255, g: 255, b: 255 }
	return new Color( "rgb(" + c.r + ", " + c.g + ", " + c.b + ")" );

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
 * @param {any} THREE
 * @param {createXDobjects} createXDobjects callback creates my 3D objects.
 * @param {object} [options] followed options is available:
 * @param {HTMLElement|string} [options.elContainer] If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui.
 * If a string, then is id of the HTMLElement.
 * Default is document.getElementById( "containerDSE" ) or a div element, child of body.
 * @param {any} [options.orbitControls] use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
 * @param {boolean} [options.orbitControlsGui] true - displays the orbit controls gui.
 * Available only if options.orbitControls is defined. Default is false.
 * @param {boolean} [options.axesHelperGui] true - displays the AxesHelper gui. Default is false.
 * @param {Object} [options.stereoEffect] use stereoEffect.
 * @param {Object} [options.stereoEffect.StereoEffect] https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
 * @param {Object} [options.stereoEffect.spatialMultiplexsIndexs] https://en.wikipedia.org/wiki/DVB_3D-TV
 * @param {boolean} [options.dat] true - use dat-gui JavaScript Controller Library. https://github.com/dataarts/dat.gui
 * @param {boolean} [options.menuPlay] true - use my dropdown menu for canvas in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D objects in my projects.
 * See nodejs\menuPlay\index.js
 * @param {object} [options.player] 3D objects animation.
 * @param {number} [options.player.min] Animation start time. Default is 0.
 * @param {number} [options.player.max] Animation end time. Default is 1.
 * @param {object} [options.canvas] canvas properties
 * @param {number} [options.canvas.width] width of the canvas
 * @param {number} [options.canvas.height] height of the canvas
 * @param {object} [options.axesHelper] axesHelper options. Default the axes is not visible
 * @param {object} [options.axesHelper.scales] axes scales. See three.js\src\helpers\AxesHelper.js
 * @param {object} [options.t] time options
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
 * Example: https://raw.githack.com/anhr/controllerPlay/master/Examples/html/
 */
export function create( createXDobjects, options ) {

	arrayCreates.push( {

		createXDobjects: createXDobjects,
		options: options,

	} );
	if ( arrayCreates.length > 1 )
		return;

	options = options || {};
	options.scale = 1;

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

		var camera, defaultCameraPosition = new Vector3( 0.4, 0.4, 2 ), scene, renderer, cursor, controls, stereoEffect, group, player,
			playController, canvasMenu, raycaster, INTERSECTED = [], scale = options.scale, axesHelper, colorsHelper = 0x80, fOptions,
			canvas = elContainer.querySelector( 'canvas' ), gui, rendererSizeDefault,
			//https://www.khronos.org/webgl/wiki/HandlingContextLost
			requestId;//, gl, tex;
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		const gl = canvas.getContext( 'webgl' );

		//raycaster

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );

		function onIntersection( intersects ) {

			intersects.forEach( function ( intersection ) {

				if ( intersection.object.userData.raycaster !== undefined ) {

					intersection.object.userData.raycaster.onIntersection( raycaster, intersection, scene, intersection.object );
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

			camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( defaultCameraPosition );
//			camera.position.set( 0.4, 0.4, 2 );

			// SCENE

			scene = new Scene();
			scene.background = new Color( 0x000000 );
			scene.fog = new Fog( 0x000000, 250, 1400 );

			//

			renderer = new WebGLRenderer( {

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

				stereoEffect = new options.stereoEffect.StereoEffect( renderer, {

					spatialMultiplex: options.stereoEffect.spatialMultiplexsIndexs.Mono, //.SbS,
					far: camera.far,
					camera: camera,
					stereoAspect: 1,
					cookie: cookie,
					elParent: canvas.parentElement,

				} );
				stereoEffect.options.spatialMultiplex = options.stereoEffect.spatialMultiplexsIndexs.Mono;

			}

			//Light
/*
			var light = new PointLight( 0xffffff, 1 );
			light.position.copy( new Vector3( 1, 1, 1 ) );
			scene.add( light );

			light = new PointLight( 0xffffff, 1 );
			light.position.copy( new Vector3( -2, -2, -2 ) );
			scene.add( light );
*/
			//A light that gets emitted from a single point in all directions.
			function pointLight() {

				var strLight = 'mathBoxLight',
					light,// = scene.getObjectByName( strLight ),
					position = new Vector3( 0.5 * options.scale, 0.5 * options.scale, 0.5 * options.scale ), controllers = {},
					axesEnum = AxesHelperOptions.axesEnum, multiplier = 2 * options.scale;

				function isLight() {

					return light !== undefined;

				}
				this.add = function ( positionCur ) {

					position = positionCur || position;
					if ( !isLight() ) {

						light = new PointLight( 0xffffff, 1 );
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
									new BufferGeometry().setFromPoints( pointVerticesSrc ) : pointVerticesSrc;
								var threshold = 0.05 * options.scale;
								return new Points( geometry,
									new PointsMaterial( {

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
			pointLight1.add( new Vector3( 2 * options.scale, 2 * options.scale, 2 * options.scale ) );
			var pointLight2 = new pointLight();
			pointLight2.add( new Vector3( -2 * options.scale, -2 * options.scale, -2 * options.scale ) );

			//

			group = new Group();
			scene.add( group );

			function setColorAttribute( colorAttribute, i, color ) {

				if ( typeof color === "string" )
					color = new Color( color );
				colorAttribute.setX( i, color.r );
				colorAttribute.setY( i, color.g );
				colorAttribute.setZ( i, color.b );
				colorAttribute.needsUpdate = true;

			}
			function guiSelectPoint() {

				var f3DObjects, fPoint, fPonts, cMeshs, fMesh, mesh, intersection, _this = this,//, fPoints, mechScaleDefault = new Vector3()
					cScaleX, cScaleY, cScaleZ, cPosition = new Vector3(), cRotations = new Vector3(),//, cPositionX, cPositionY, cPositionZ;
					cPoints, selectedPointIndex = -1;
				var controllerX, controllerY, controllerZ, controllerW, controllerColor;

				function setPosition( position, intersectionSelected ) {

					function setValue( controller, v ) {

						controller.object[controller.property] = v;
						if ( controller.__onChange )
							controller.__onChange.call( controller, v );
						controller.updateDisplay();
						return controller;

					}
					setValue( controllerX, position.x );
					setValue( controllerY, position.y );
					setValue( controllerZ, position.z );
					var displayControllerW, displayControllerColor, none = 'none', block = 'block';
					if ( isNaN( position.w ) ) {

						displayControllerW = none;
						displayControllerColor = block;

						//color
						var display = 'block';
						if ( intersectionSelected.object.userData.arrayFuncs === undefined )
							display = 'none';
						else {

							var func = intersectionSelected.object.userData.arrayFuncs[intersectionSelected.index];
							controllerColor.setValue( '#' + new Color( func.w.r, func.w.g, func.w.b ).getHexString() );
							controllerColor.userData = { intersection: intersectionSelected, }

						}
						controllerColor.domElement.style.display = display;

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

/*
							if ( axesHelper !== undefined )
								axesHelper.exposePosition( position );
*/
							setPosition( position, intersectionSelected );

						}

					}

				}
				this.select = function ( position, intersectionSelected ) {

					if ( f3DObjects === undefined ) {

						selectedPointIndex = intersectionSelected.index || -1;
						if ( ( mesh !== undefined ) && ( mesh !== intersectionSelected.object ) && ( axesHelper !== undefined ) )
							axesHelper.exposePosition();//remove dot lines
						mesh = intersectionSelected.object;
						return;//options.dat !== true and gui === undefined. Do not use dat.gui

					}
					f3DObjects.open();

					//select mesh
					var index = intersectionSelected.object.userData.index;
					cMeshs.__select[index].selected = true;
					cMeshs.__onChange( index - 1 );

					//select point
					if ( intersectionSelected.index === undefined )
						return;
					fPonts.open();
					cPoints.__select[intersectionSelected.index + 1].selected = true;
					fPoint.domElement.style.display = 'block';
					intersection = intersectionSelected;
					setPosition( position, intersectionSelected );
					
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

								var opt = document.createElement( 'option' );
								opt.innerHTML = i;
								opt.setAttribute( 'value', i );
								cPoints.__select.appendChild( opt );

							}

							setScaleControllers();
							setPositionControllers();
							setRotationControllers();
						}
						fMesh.domElement.style.display = display;

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

					},
						{

							zoomMultiplier: 1.1,
							getLanguageCode: getLanguageCode,

						} ) );
					var scale = new Vector3();
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

						}, { getLanguageCode: getLanguageCode, } ) );

						function setPosition( value ) {

							mesh.position[name] = value;
							mesh.needsUpdate = true;

							setPositionControllers();

						}
						var position = new Vector3();

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

						},

					}, 'defaultF' ), lang.defaultButton, lang.defaultPositionTitle );

					//rotation

					var fRotation = fMesh.addFolder( lang.rotation );
//						vRotation = new Vector3(),
//						exRotation = { min: 0, max: Math.PI * 2, step: 1 / 360 };
					function addRotationControllers( name ) {

						cRotations[name] = fRotation.add( new Vector3(), name, 0, Math.PI * 2, 1 / 360 ).
							onChange( function ( value ) {

								mesh.rotation[name] = value;
								mesh.needsUpdate = true;

							} );
						dat.controllerNameAndTitle( cRotations.x, options.scales.x.name );

					}
					addRotationControllers( 'x' );
					addRotationControllers( 'y' );
					addRotationControllers( 'z' );
/*
					cRotations.x = fRotation.add( vRotation, 'x', exRotation.min, exRotation.max, exRotation.step ).
						onChange( function ( value ) {

							mesh.position[name] += shift;
							mesh.needsUpdate = true;

						} );
					dat.controllerNameAndTitle( cRotations.x, options.scales.x.name );
					cRotations.y = fRotation.add( vRotation, 'y', exRotation.min, exRotation.max, exRotation.step ).
						onChange( function ( value ) {

							console.warn( 'rotation = ' + value );

						} );
					dat.controllerNameAndTitle( cRotations.y, options.scales.y.name );
					cRotations.z = fRotation.add( vRotation, 'z', 0, exRotation.min, exRotation.max, exRotation.step ).
						onChange( function ( value ) {

							console.warn( 'rotation = ' + value );

						} );
					dat.controllerNameAndTitle( cRotations.z, options.scales.z.name );
*/

					//Default rotation button
					dat.controllerNameAndTitle( fRotation.add( {

						defaultF: function ( value ) {

							mesh.rotation.copy( mesh.userData.default.rotation );
							mesh.needsUpdate = true;

							setRotationControllers();

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
							position = getObjectPosition( mesh, value );
							_this.select( position, { object: mesh, index: value } );

						}
						if ( axesHelper !== undefined )
							axesHelper.exposePosition( position );
						fPoint.domElement.style.display = display;

					} );
					cPoints.__select[0].selected = true;
					dat.controllerNameAndTitle( cPoints, lang.select );

					fPoint = fPonts.addFolder( lang.point );
					fPoint.domElement.style.display = 'none';
					fPoint.open();

					//Restore default settings of all 3d objects button.
					dat.controllerNameAndTitle( f3DObjects.add( {

						defaultF: function ( value ) {

							group.children.forEach( function ( mesh ) {

								mesh.scale.copy( mesh.userData.default.scale );
								mesh.needsUpdate = true; 

								setScaleControllers();

							} );

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

					//Point's axes controllers

					function axesGui( axesId, onChange ) {

						var axesName, scale, controller;
/*
						function movePointAxes( axesId, value ) {
*/
/*
							var points = intersection.object, axesName = axesEnum.getName( axesId );;
							points.geometry.attributes.position.array
							[axesId + intersection.index * points.geometry.attributes.position.itemSize] =
								( value - ( axesId > 2 ? 0 : intersection.object.position[axesName] ) ) /
								( axesId > 2 ? 1 : intersection.object.scale[axesName] );
							points.geometry.attributes.position.needsUpdate = true;
*/
/*
							//dotLines
							if ( axesHelper !== undefined )
								axesHelper.exposePosition( getPosition( intersection ) );

						}
*/
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
									setColorAttribute( attributes.color, i, color );

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

							//если я буду использовать эту строку то экстремумы шкал буду устанавливатся по умолчанию а не текущие
//							scale = options.scales[axesName];

							scale = axesHelper.options.scales[axesName];
							controller = fPoint.add( {

								value: scale.min,

							}, 'value',
							scale.min,
							scale.max,
							( scale.max - scale.min ) / 100 ).
							onChange( function ( value ) {

//								movePointAxes( axesId, value );

							} );

						}
						dat.controllerNameAndTitle( controller, scale.name );
						return controller;

					}
					var axesEnum = AxesHelperOptions.axesEnum;
					controllerX = axesGui( axesEnum.x );//, optionsGui.onChangeX ),
					controllerY = axesGui( axesEnum.y );//, optionsGui.onChangeY ),
					controllerZ = axesGui( axesEnum.z );//, optionsGui.onChangeZ );
					controllerW = axesGui( axesEnum.w );
					controllerColor = fPoint.addColor( {

						color: '#FFFFFF',

					}, 'color').
						onChange( function ( value ) {

							//console.warn( controllerColor);
							if ( controllerColor.userData === undefined )
								return;
							var intersection = controllerColor.userData.intersection;
							setColorAttribute( intersection.object.geometry.attributes.color, intersection.index, value );

						} );

					//read only
					controllerColor.domElement.querySelector( 'input' ).readOnly = true;
					controllerColor.domElement.querySelector( '.selector' ).style.display = 'none';

					dat.controllerNameAndTitle( controllerColor, lang.color );

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
			if ( ( options.dat !== undefined )
/*
				&& (
					options.player//.controllerPlay
					|| options.stereoEffect
					|| options.axesHelper
	//				|| options.axesHelperGui
					|| options.orbitControls
					|| ( typeof WebGLDebugUtils !== "undefined" )
				)
*/
			) {

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
					selectPlayScene( t );
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

				var spatialMultiplexsIndexs = options.stereoEffect.spatialMultiplexsIndexs;
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
						rendererSizeDefault.onFullScreenToggle( !fullScreen );

						canvasMenu.setSpatialMultiplexs( mode );

					},

				} );

			}

			if ( options.menuPlay ) {

				if ( ( canvasMenu === undefined ) ) {

					canvasMenu = new menuPlay.create( elContainer, {

						stereoEffect: stereoEffect === undefined ? stereoEffect :
							{ stereoEffect: stereoEffect, spatialMultiplexsIndexs: options.stereoEffect.spatialMultiplexsIndexs },
						player: player,
						//					play: options.play,
						//					playController: playController,
						onFullScreenToggle: function () {

							return rendererSizeDefault.onFullScreenToggle();

						},
						onFullScreen: function ( fullScreen, elContainer ) {

							rendererSizeDefault.onFullScreenToggle( !fullScreen );
							//						arrayContainers.display( elContainer.parentElement, fullScreen );

						}

					} );
					options.canvasMenu = canvasMenu;

				} else canvasMenu.setPlayer( player );

			}

			//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			if ( options.orbitControls ) {

				controls = new options.orbitControls( camera, renderer.domElement );
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
				axesHelper = new AxesHelper( 1 * scale, {

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

			function selectPlayScene( t ) {

				group.children.forEach( function ( mesh ) {

					if ( mesh.userData.selectPlayScene !== undefined ) {

						mesh.userData.selectPlayScene( t, function ( a, b ) {

							var attributes = mesh.geometry.attributes,
								arrayFuncs = mesh.userData.arrayFuncs;
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
									var color = palette.toColor( value, min, max );
									setColorAttribute( attributes.color, i, color );

								} else if ( funcs.w instanceof Color ) {

									var color = funcs.w;
									setColorAttribute( attributes.color, i, color );

								}
								if ( needsUpdate )
									attributes.position.needsUpdate = true;

							};
/*
							var selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
							if ( selectedPointIndex !== -1 ) {

								var position = getObjectPosition( mesh, selectedPointIndex );
								if ( axesHelper !== undefined )
									axesHelper.exposePosition( position );
								if ( gui !== undefined )
									guiSelectPoint.setPosition( position, {

										object: mesh,
										index: selectedPointIndex,

									} );

							}
*/

						} );
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
/*
								guiSelectPoint.select( position, {

									object: mesh,
									index: selectedPointIndex,

								} );
*/

						}

					}

				} );

			}
			selectPlayScene( options.player === undefined ? 0 : options.player.min );

			//default setting for each 3D object
			group.children.forEach( function ( mesh ) {

				mesh.userData.default = mesh.userData.default || {};

				mesh.userData.default.scale = new Vector3();
				mesh.userData.default.scale.copy( mesh.scale );

				mesh.userData.default.position = new Vector3();
				mesh.userData.default.position.copy( mesh.position );

				mesh.userData.default.rotation = new Euler();
				mesh.userData.default.rotation.copy( mesh.rotation );

			} );

			if ( gui !== undefined ) {

				//AxesHelper gui
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

				if ( options.orbitControlsGui === true )
					OrbitControlsGui( fOptions, controls, {

						getLanguageCode: getLanguageCode,
						scales: options.axesHelper === undefined ? undefined : options.axesHelper.scales,

					} );

				// light

				pointLight1.controls( group, fOptions, axesHelper.options.scales, lang.light + ' 1' );
				pointLight2.controls( group, fOptions, axesHelper.options.scales, lang.light + ' 2' );

				//default button
				dat.controllerNameAndTitle( gui.add( {
					defaultF: function ( value ) {

						controls.target = new Vector3();
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

						raycaster = new Raycaster();
						raycaster.params.Points.threshold = item.material.size / 3;//0.03;
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
									var position = getPosition( intersection );
//									if ( gui !== undefined )
									guiSelectPoint.select( position, intersection );
									if ( intersection.object.type === "Points" ) {

//										selectedPointIndex = intersection.index;
										if ( axesHelper !== undefined )
											axesHelper.exposePosition( position );

									}

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
					sizeOriginal = new Vector2();
				renderer.getSize( sizeOriginal );
				return {

					onFullScreenToggle: function ( fullScreen ) {

						var size = new Vector2();
						renderer.getSize( size );
						if ( fullScreen === undefined )
							fullScreen = ( size.x === window.innerWidth ) && ( size.y === window.innerHeight );
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
						arrayContainers.display( elContainer.parentElement, fullScreen );
						if ( canvasMenu !== undefined )
							canvasMenu.setFullScreenButton( fullScreen );

						return fullScreen;

					},

				};

			};
			rendererSizeDefault = getRendererSize();

			window.addEventListener( 'resize', onResize, false );

		}
		function onResize() {

			var size = new Vector2();
			renderer.getSize( size );
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
						size = new Vector2;
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
					onIntersection( intersects );

				} else {

					renderer.domElement.style.cursor = cursor;
					onIntersectionOut( intersects );

				}

			}

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

		//loadScript.sync( 'http://' + url + '/nodejs/dropdownMenu/styles/gui.css', optionsStyle );
		loadScript.sync( debug ? 'http://' + url + '/nodejs/dropdownMenu/styles/gui.css' :
			'https://raw.githack.com/anhr/DropdownMenu/master/styles/gui.css', optionsStyle );

		//for .container class
		//loadScript.sync( 'http://' + url + '/nodejs/dropdownMenu/styles/menu.css', optionsStyle );
		loadScript.sync( debug ? 'http://' + url + '/nodejs/dropdownMenu/styles/menu.css' :
			'https://raw.githack.com/anhr/DropdownMenu/master/styles/menu.css', optionsStyle );

	}

	options.getPoints = function ( t, arrayFuncs, a, b ) {

		if ( t === undefined )
			console.error( 'getPoints: t = ' + t );
		var points = [];
		arrayFuncs.forEach( function ( funcs ) {

			points.push( new Vector4(
				typeof funcs.x === "function" ? funcs.x( t, a, b ) : funcs.x,
				typeof funcs.y === "function" ? funcs.y( t, a, b ) : funcs.y,
				typeof funcs.z === "function" ? funcs.z( t, a, b ) : funcs.z,
				typeof funcs.w === "function" ? funcs.w( t, a, b ) : funcs.w,
			) );

		} );
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

				max = funcs instanceof Vector4 ? funcs.w : 1;
				min = max - 1;

			}
			var color = palette.toColor( funcs instanceof Vector4 ? funcs.w : max, min, max );
			colors.push( color.r, color.g, color.b );

		} );
		return colors;

	}

	options.addSpriteTextIntersection = function ( raycaster, intersection, scene ) {

		var spriteTextIntersection = findSpriteTextIntersection( scene );
		if ( spriteTextIntersection !== undefined )
			return;
		var textColor = 'rgb( 128, 128, 128 )',
			position = getPosition( intersection );//raycaster.stereo === undefined ? getPosition( intersection ) : raycaster.stereo.getPosition( intersection );//, true );
		if ( findSpriteTextIntersection( scene ) )
			return;
		var func = intersection.object.userData.arrayFuncs[intersection.index];
		spriteTextIntersection = new SpriteText(
			       options.scales.x.name + ': ' + position.x +
			'\n' + options.scales.y.name + ': ' + position.y +
			'\n' + options.scales.z.name + ': ' + position.z
			+ ( position instanceof Vector4 && !isNaN( position.w ) && ( options.scales.w !== undefined ) ?
			'\n' + options.scales.w.name + ': ' + position.w :
				isNaN( position.w ) ? '\n' + lang.color + ': ' + new Color( func.w.r, func.w.g, func.w.b ).getHexString() : '' ), {

				textHeight: 0.2,
				fontColor: textColor,
				rect: {

					displayRect: true,
					borderThickness: 3,
					borderRadius: 10,
					borderColor: textColor,
					backgroundColor: 'rgba( 0, 0, 0, 1 )',

				},
				position: position,//.multiply( intersection.object.scale ),
				center: new Vector2( 0.5, 0 ),

			} );
		spriteTextIntersection.name = spriteTextIntersectionName;
		spriteTextIntersection.scale.divide( scene.scale );
		scene.add( spriteTextIntersection );

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
	point: 'Point',
	points: 'Points',
	mesh: 'Mesh',
	meshs: 'Meshs',
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

	light: 'Light',
	displayLight: 'Display',
	displayLightTitle: 'Display or hide the light source.',
	restoreLightTitle: 'Restore position of the light source',
	
};

switch ( getLanguageCode() ) {

	case 'ru'://Russian language
		lang.defaultButton = 'Восстановить';
		lang.defaultTitle = 'Восстановить положение осей координат по умолчанию.';
		lang.point = 'Точка';
		lang.points = 'Точки';
		lang.mesh = '3D объект';
		lang.meshs = '3D объекты';
		lang.select = 'Выбрать';
		lang.notSelected = 'Не выбран';
		lang.scale = 'Масштаб';
		lang.rotation = 'Вращение';
		lang.position = 'Позиция';
		lang.color = 'Цвет';
		lang.settings = 'Настройки';
		lang.webglcontextlost = 'Пользовательский агент обнаружил, что буфер рисунка, связанный с объектом WebGLRenderingContext, потерян.';

		lang.defaultButton = 'Восстановить';
		lang.defaultScaleTitle = 'Восстановить масштаб 3D объекта по умолчанию.';
		lang.defaultPositionTitle = 'Восстановить позицию 3D объекта по умолчанию.';
		lang.default3DObjectTitle = 'Восстановить настройки всех 3D объектов по умолчанию.';
		lang.defaultRotationTitle = 'Восстановить поворот 3D объекта по умолчанию.';

		lang.light = 'Свет';
		lang.displayLight = 'Показать';
		lang.displayLightTitle = 'Показать или скрыть источник света.';
		lang.restoreLightTitle = 'Восстановить положение источника света';

		break;

}

//for raycaster
//var selectedPointIndex;
function getPosition( intersection ) {

	return getObjectPosition( intersection.object, intersection.index );

}
function getObjectPosition( object, index ) {

	var attributesPosition = object.geometry.attributes.position;
	if ( index !== undefined ) {

		var position = attributesPosition.itemSize >= 4 ? new Vector4( 0, 0, 0, 0 ) : new Vector3(),
			position2 = attributesPosition.itemSize >= 4 ? new Vector4( 0, 0, 0, 0 ) : new Vector3(),
			positionAngle = new Vector3();
		position2.fromArray( attributesPosition.array, index * attributesPosition.itemSize );
		position = position2.clone();

		//rotation
		positionAngle.copy( position );
		positionAngle.applyEuler( object.rotation );
		position.x = positionAngle.x;
		position.y = positionAngle.y;
		position.z = positionAngle.z;

		position.multiply( object.scale );
		position.add( object.position );
		return position;

	}
	return object.position;

}
