/**
 * myThreejs
 * 
 * I use myThreejs in my projects for displaying of my 3D objects in the canvas.
 * 
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

//Please download https://github.com/anhr/dat.gui/tree/CustomController to '../../../../My documents/MyProjects/webgl/three.js/GitHub/dat.gui' folder
//import { GUI, controllers } from '../../../../My documents/MyProjects/webgl/three.js/GitHub/dat.gui';

//Please download https://github.com/anhr/loadScriptNodeJS into ../loadScriptNodeJS folder
import loadScript from '../loadScriptNodeJS/loadScript.js';

//Please download https://github.com/anhr/loadFileNodeJS into ../loadFileNodeJS folder
import loadFile from '../loadFileNodeJS/loadFile.js';

//https://threejs.org/docs/#manual/en/introduction/Import-via-modules
//import * as THREE from 'http://localhost/threejs/three.js/src/three.js';//'three';
//import * as THREE from 'http://localhost/threejs/three.js/build/three.module.js';
//import * as THREE from '../../three.js/build/three.module.js';
//import * as THREE from 'http://localhost/threejs/three.js/build/three.js';
//import { Vector2 } from '../../three.js/src/math/Vector2.js';
import {

	Vector2,
	Vector3,
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

} from 'http://localhost/threejs/three.js/build/three.module.js';
/*
import { Vector2 } from 'http://localhost/threejs/three.js/src/math/Vector2.js';
//import { Vector2 } from '../../three.js/src/math/Vector2.js';
import { Vector3 } from '../three.js/src/math/Vector3.js';
*/

//import { WEBGL } from 'http://localhost/threejs/three.js/examples/jsm/WEBGL.js';

//import { OrbitControls } from 'http://localhost/threejs/three.js/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'http://localhost/threejs/three.js/examples/js/controls/OrbitControls.js';

//import { SpriteText, SpriteTextGui } from 'http://localhost/threejs/three.js/examples/jsm/objects/SpriteText.js';
//import SpriteText from '../../three.js/examples/jsm/objects/SpriteText.js';
//import SpriteText from '../SpriteText.js';

import cookie from '../cookieNodeJS/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';

import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';

//import OrbitControlsGui from '../cookieNodeJS/OrbitControlsGui.js';
//import OrbitControlsGui from '../commonNodeJS/OrbitControlsGui.js';
import OrbitControlsGui from 'http://localhost/threejs/nodejs/commonNodeJS/OrbitControlsGui.js';
//import OrbitControlsGui from 'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControlsGui.js';

/*
//import CustomController from '../../dat.gui/src/dat/controllers/CustomController.js';
//import Controller from '../../dat.gui/src/dat/controllers/Controller.js';
//import ColorController from '../../dat.gui/src/dat/controllers/ColorController.js';
//import { GUI, controllers } from '../../dat.gui';
import { controllers } from '../../dat.gui/build/dat.gui.module.js';

class MyController extends controllers.CustomController {

	constructor( onclickController ) {

		super( {
		}, 'offset', 0.1, 10, 0.1 );
		if ( this.property === undefined )
			console.error( 'init() returns ' + this.property );

	}

}
new MyController();
*/
var debug = true,
	url = 'localhost/threejs',//'192.168.1.2'//ATTENTION!!! localhost is not available for debugging of the mobile devices
	min = '';//min.

function arrayContainersF(){

	var array = [];
	this.push = function ( elContainer ) {

		array.push( elContainer );

	};
	this.display = function ( elContainer, fullScreen ) {

		//console.log( 'onFullScreen( ' + fullScreen + ')' );
		array.forEach( function ( itemElContainer ) {

			itemElContainer.style.display = ( itemElContainer === elContainer ) || ! fullScreen ? 'block' : 'none';
			//console.log( 'itemElContainer.id = ' + itemElContainer.id + ' itemElContainer.style.display = ' + itemElContainer.style.display );

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
 * @callback create3Dobjects
 * @param {Group} group group of my 3d objects. https://threejs.org/docs/index.html#api/en/objects/Group
 */

/**
 * Creates new canvas with my 3D objects
 * @param {any} THREE
 * @param {create3Dobjects} create3Dobjects callback creates my 3D objects.
 * @param {object} [options] followed options is available:
 * @param {HTMLElement|string} [options.elContainer] If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui.
 * If a string, then is id of the HTMLElement.
 * Default is document.getElementById( "containerDSE" ) or a div element, child of body.
 * @param {any} [options.orbitControls] use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
 * @param {boolean} [options.orbitControlsGui] true - displays the orbit controls gui.
 * Available only if options.orbitControls is defined. Default is false.
 * @param {Object} [options.stereoEffect] use stereoEffect.
 * @param {Object} [options.stereoEffect.StereoEffect] https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
 * @param {Object} [options.stereoEffect.spatialMultiplexsIndexs] https://en.wikipedia.org/wiki/DVB_3D-TV
 * @param {boolean} [options.dat] true - use dat-gui JavaScript Controller Library. https://github.com/dataarts/dat.gui
 * @param {boolean} [options.controllerPlay] true - use PlayController https://github.com/anhr/controllerPlay. My custom controller in my version of dat.gui https://github.com/anhr/dat.gui for playing of 3D obects in my projects.
 * Available only if options.dat = true
 * @param {object} [options.canvas] canvas properties
 * @param {number} [options.canvas.width] width of the canvas
 * @param {number} [options.canvas.height] height of the canvas
 * @todo If you want to use raycaster (working out what objects in the 3d space the mouse is over) https://threejs.org/docs/index.html#api/en/core/Raycaster,
 * please add following object into your 3D Object userdata:
 * your3dObject.userData.raycaster = {

		onIntersection: function ( raycaster, intersection, scene, INTERSECTED ) {

			//Mouse is over of your 3D object event
			//TO DO something
			//For example you can use
			myThreejs.addSpriteTextIntersection( raycaster, intersection, scene );
			//for displaying of the position of your 3D object
			//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

		},
		onIntersectionOut: function ( scene, INTERSECTED ) {

			//Mouse is out of your 3D object event
			//TO DO something
			//For example you can use
			myThreejs.removeSpriteTextIntersection( scene );
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
export function create( create3Dobjects, options ) {

	//console.log( 'myThreejs.create(...)' );

	arrayCreates.push( {

		create3Dobjects: create3Dobjects,
		options: options,

	} );
	if ( arrayCreates.length > 1 )
		return;

	options = options || {};
	options.scale = 1;

	function onloadScripts() {

//console.log( 'onloadScripts()' );
/*
		if ( THREE.WEBGL.isWebGLAvailable() === false ) {

			document.body.appendChild( WEBGL.getWebGLErrorMessage() );
			alert( WEBGL.getWebGLErrorMessage().innerHTML );

		}
*/
		var elContainer = options.elContainer === undefined ? document.getElementById( "containerDSE" ) :
			typeof options.elContainer === "string" ? document.getElementById( options.elContainer ) : options.elContainer;
		if ( elContainer === null ) {

			elContainer = document.createElement( 'div' );
			document.querySelector( 'body' ).appendChild( elContainer );

		}
		//elContainer.innerHTML = '<img src="https://raw.githubusercontent.com/anhr/TreeElementNodeJS/master/img/wait.gif">';
		arrayContainers.push( elContainer );
		elContainer.innerHTML = loadFile.sync( 'https://raw.githack.com/anhr/myThreejs/master/canvasContainer.html' );//'http://' + url + '/nodejs/myThreejs/canvasContainer.html'
		elContainer = elContainer.querySelector( '.container' );
		var elCanvas = elContainer.querySelector( 'canvas' );

		var camera, defaultCameraPosition = new Vector3( 0.4, 0.4, 2 ), scene, renderer, controls, stereoEffect, group, playController,
			canvasMenu, raycaster, INTERSECTED = [], scale = options.scale, axesHelper, colorsHelper = 0x80;//, cubeType = 'cube', spriteTextIntersection, dotLines = new dotLines()

		//for raycaster

		var mouse = new Vector2(),
//			particles = [],
			intersects;
		elCanvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
		elCanvas.addEventListener( 'mousedown', onDocumentMouseDown, false );

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
				canvas: elCanvas,

			} );
			renderer.setPixelRatio( window.devicePixelRatio );

			//resize
			renderer.setSizeOld = renderer.setSize;
			renderer.setSize = function ( width, height, updateStyle ) {

				renderer.setSizeOld( width, height, updateStyle );

				timeoutControls = setTimeout( function () {

					elContainer.style.height = elCanvas.style.height;//height + "px";
					elContainer.style.width = elCanvas.style.width;//width + "px";
					elContainer.style.left = elCanvas.style.left;
					elContainer.style.top = elCanvas.style.top;
					elContainer.style.position = elCanvas.style.position;

//					if ( typeof menuPlay !== 'undefined' )
					if ( canvasMenu !== undefined )
						canvasMenu.setSize( width, height );

				}, 0 );

			};
			//			renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
			renderer.setSize( ( options.canvas !== undefined ) && (options.canvas.width !== undefined ) ? options.canvas.width : elCanvas.clientWidth,
				( options.canvas !== undefined ) && ( options.canvas.height !== undefined ) ? options.canvas.height : elCanvas.clientHeight );

			//StereoEffect. https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
			//if ( THREE.StereoEffect !== undefined )
			if ( options.stereoEffect ){

				stereoEffect = new options.stereoEffect.StereoEffect( renderer, {

					spatialMultiplex: options.stereoEffect.spatialMultiplexsIndexs.Mono, //.SbS,
					far: camera.far,
					camera: camera,
					stereoAspect: 1,
					cookie: cookie,
					elParent: elCanvas.parentElement,

				} );
				stereoEffect.options.spatialMultiplex = options.stereoEffect.spatialMultiplexsIndexs.Mono;

			}

//scene.add( new SpriteText( '888' ) );
			//Light

			var light = new PointLight( 0xffffff, 1 );
			light.position.copy( new Vector3( 1, 1, 1 ) );
			scene.add( light );
//scene.add( new SpriteText( 'sss' ) );

			light = new PointLight( 0xffffff, 1 );
			light.position.copy( new Vector3( -2, -2, -2 ) );
			scene.add( light );
//scene.add( new SpriteText( 'aaa' ) );

			group = new Group();
			scene.add( group );
//scene.add( new SpriteText( '999' ) );

			//dat-gui JavaScript Controller Library
			//https://github.com/dataarts/dat.gui
//			if ( typeof dat !== 'undefined' )
			if ( options.dat && ( options.controllerPlay || options.stereoEffect )){

				var gui = new dat.GUI( {

					autoPlace: false,
					//			closed: true,//Icorrect "Open Controls" button name

				} );

				//Close gui window
				if ( gui.__closeButton.click !== undefined )//for compatibility with Safari 5.1.7 for Windows
					gui.__closeButton.click();

				//Thanks to https://stackoverflow.com/questions/41404643/place-dat-gui-strictly-inside-three-js-scene-without-iframe
				elContainer.querySelector( '#my-gui-container' ).appendChild( gui.domElement );

			}
			//PlayController https://github.com/anhr/controllerPlay. My custom controller in my version of dat.gui https://github.com/anhr/dat.gui for playing of 3D obects in my projects.
			//				if ( typeof controllerPlay !== "undefined" )
			if ( options.controllerPlay ) {

				var colorRed = new Color( 0xff0000 );
				playController = controllerPlay.create( group, {

					onShowObject3D: function ( objects3DItem, index ) {

						objects3DItem.visible = true;
						if ( canvasMenu !== undefined )
							canvasMenu.setIndex( index );

					},
					onHideObject3D: function ( objects3DItem ) {

						objects3DItem.visible = false;//hide object3D

					},
					onSelectedObject3D: function ( objects3DItem, index ) {

						objects3DItem.material.color = colorRed;
						objects3DItem.visible = true;
						//							if ( typeof menuPlay !== "undefined" )
						if ( canvasMenu !== undefined )
							canvasMenu.setIndex( index );

					},
					onRestoreObject3D: function ( objects3DItem ) {

						objects3DItem.material.color = objects3DItem.userData.color;
						objects3DItem.visible = true;

					},
					onRenamePlayButton: function ( name, title ) {

						var elMenuButtonPlay = document.getElementById( 'menuButtonPlay' );
						if ( elMenuButtonPlay === null )
							return;
						elMenuButtonPlay.innerHTML = name;
						elMenuButtonPlay.title = title;

					},
					onRenameRepeatButton: function ( title, color ) {

						var elMenuButtonRepeat = document.getElementById( 'menuButtonRepeat' );
						if ( elMenuButtonRepeat === null )
							return;
						//					elMenuButtonRepeat.innerHTML = name;
						elMenuButtonRepeat.title = title;

					},

				} );
				if ( gui !== undefined )
					gui.add( playController );

			}

			create3Dobjects( group );

			if ( ( stereoEffect !== undefined ) && ( typeof gui !== 'undefined' ) )

				var spatialMultiplexsIndexs = options.stereoEffect.spatialMultiplexsIndexs;
				stereoEffect.gui( gui, {

					getLanguageCode: getLanguageCode,
					gui: gui,
					stereoEffect: stereoEffect,
					onChangeMode: function ( mode ) {

						var fullScreen = true;;
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

					},

				} );
/*
				THREE.gui.stereoEffect( gui, stereoEffect.options, {

					gui: gui,
					stereoEffect: stereoEffect,
					onChangeMode: function ( mode ) {

						var fullScreen = true;;
						switch ( mode ) {

							case THREE.StereoEffectParameters.spatialMultiplexsIndexs.Mono:
								fullScreen = false;
								break;
							case THREE.StereoEffectParameters.spatialMultiplexsIndexs.SbS:
							case THREE.StereoEffectParameters.spatialMultiplexsIndexs.TaB:
								break;
							default: console.error( 'myThreejs: Invalid spatialMultiplexIndex = ' + mode );
								return;

						}
						rendererSizeDefault.onFullScreenToggle( !fullScreen );

					},

				} );
*/

			if ( options.menuPlay ) {


				canvasMenu = new menuPlay.create( elContainer, {

//					stereoEffect: stereoEffect,
					stereoEffect: { stereoEffect: stereoEffect, spatialMultiplexsIndexs: options.stereoEffect.spatialMultiplexsIndexs },
					playController: playController,
					onFullScreenToggle: function () {

						return rendererSizeDefault.onFullScreenToggle();

					},
					onFullScreen: function ( fullScreen, elContainer ) {

						rendererSizeDefault.onFullScreenToggle( !fullScreen );
						//						arrayContainers.display( elContainer.parentElement, fullScreen );

					}

				} );
				options.canvasMenu = canvasMenu;

			}

			//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			//if ( THREE.OrbitControls !== undefined )
			if ( options.orbitControls ) {

				controls = new options.orbitControls( camera, renderer.domElement );
				//				controls.target.set( 0, 0, 0 );
				controls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
				controls.update();

			}

			// helper

			if ( options.axesHelper ) {

				axesHelper = new AxesHelper( 1 * scale, {
					cookie: cookie,
					scene: scene,
					negativeAxes: true,
					colors: colorsHelper / 0xff, //gray axes
					colorsHelper: colorsHelper,
					//controls: controls,
					//camera: camera,
					scales: options.axesHelper.scales,
				} );
				scene.add( axesHelper );

				if ( controls !== undefined )
					controls.update();//if scale != 1 and position != 0 of the screen, то после открытия canvas положение картинки смещено. Положение восстанавливается только если подвигать мышью

				axesHelper.gui( gui, {

					getLanguageCode: getLanguageCode,
					cookie: cookie,
					lang: {

						languageCode: 'ru',

						axesHelper: 'Оси координат', //'Axes Helper'

						negativeAxes: 'Минусовые оси',
						negativeAxesTitle: 'Отображать отрицательные оси.',

						scales: 'Шкалы',

						displayScales: 'Показать',
						displayScalesTitle: 'Показать или скрыть шкалы осей координат.',

						min: 'Минимум',
						max: 'Максимум',

						marks: 'Риски',
						marksTitle: 'Количество отметок на шкале',

						defaultButton: 'Восстановить',
						defaultTitle: 'Восстановить настройки осей координат по умолчанию.',

						//Zoom
						zoom: 'Масштаб',
						in: 'увеличить',
						out: 'уменьшить',
						wheelZoom: 'Прокрутите колесико мыши для изменения масштаба',

						//Position
						offset: 'Сдвиг',
						add: 'добавить',
						subtract: 'вычесть',
						wheelPosition: 'Прокрутите колесико мыши для изменения позиции',

					}

				} );

			}

			//OrbitControls gui
			if ( gui !== undefined ) {

				if ( options.orbitControlsGui === true )
					OrbitControlsGui( gui, controls, {

						getLanguageCode: getLanguageCode,
						scales: options.axesHelper.scales,

					} );

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
						raycaster.setStereoEffect( {

							renderer: renderer,
							camera: camera,
							stereoEffect: stereoEffect,
							onIntersection: function ( intersects ) {

/*
if ( intersects.length > 1 )
	console.warn( 'intersects.length > 1' );
								var intersection = intersects[0];
								if ( intersection.object.userData.raycaster !== undefined ) {

									intersection.object.userData.raycaster.onIntersection( raycaster, intersection, scene, INTERSECTED );
									INTERSECTED = intersection.object;

								}
*/
								intersects.forEach( function ( intersection ) {

									if ( intersection.object.userData.raycaster !== undefined ) {

										intersection.object.userData.raycaster.onIntersection( raycaster, intersection, scene, intersection.object );
										INTERSECTED.push( intersection.object );

									}

								} );

							},
							onIntersectionOut: function ( intersects ) {


//console.warn( 'intersects.length > 0' );
/*
								intersects.forEach( function ( intersection ) {

									intersection.userData.raycaster.onIntersectionOut( scene, intersection );

								} );
*/
//								if ( INTERSECTED === undefined )
								if ( INTERSECTED.length === 0 )
									return;
								INTERSECTED.forEach( function ( intersection ) {

									intersection.userData.raycaster.onIntersectionOut( scene, intersection );

								} );
								while ( INTERSECTED.length > 0 )
									INTERSECTED.pop();
/*
								INTERSECTED.userData.raycaster.onIntersectionOut( scene, INTERSECTED );
								INTERSECTED = undefined;
*/

								//					onIntersectionOut( intersects );

							},
							onMouseDown: function ( intersects ) {

								var intersection = intersects[0];
								if (
									( intersection.object.userData.raycaster !== undefined )
									&& ( intersection.object.userData.raycaster.onMouseDown !== undefined ) ) {

									intersection.object.userData.raycaster.onMouseDown( raycaster, intersection, scene );

								}
								if ( intersection.object.type === "Points" ) {

									//									dotLines.dottedLines( raycaster.stereo.getPosition( intersection, true ) );
									axesHelper.exposePosition( raycaster.stereo.getPosition( intersection, true ) );

								}

							}

						} );

					}

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
			var rendererSizeDefault = getRendererSize();

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
			if ( event.buttons != 1 )
				return;

			render();

		}
		function onDocumentMouseDown( event ) {

			if ( raycaster.stereo !== undefined )
				raycaster.stereo.onDocumentMouseDown( event );
			else {

				raycaster.setFromCamera( mouse, camera );
				intersects = raycaster.intersectObjects( particles );
				if ( intersects.length > 0 ) {

					var intersection = intersects[0],
						position = getPosition( intersection );
					alert( 'You are clicked the "' + intersection.object.type + '" type object.'
						+ ( intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.' )
						+ ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )' );

				}

			}
		}
		function animate() {

			requestAnimationFrame( animate );

			render();

		}

		function render() {

			//console.log( 'elContainer.id = ' + elContainer.id )
			if ( typeof stereoEffect === 'undefined' )
//			if ( ! options.stereoEffect )
				renderer.render( scene, camera );
			else stereoEffect.render( scene, camera );

			if ( raycaster.stereo === undefined ) {

				raycaster.setFromCamera( mouse, camera );
				intersects = raycaster.intersectObjects( group.children );//particles );
				if ( intersects.length > 0 )
					onIntersection( intersects );
				else onIntersectionOut( intersects );

			}

		}

		var timeoutControls;

		arrayCreates.shift();
		var params = arrayCreates.shift();
		if ( params === undefined )
			return;
		create( params.create3Dobjects, params.options );

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
/*
	if ( typeof THREE === 'undefined' ) {

		arrayScripts.push( debug ? "http://" + url + "/threejs/three.js/build/three.js" :
			"https://raw.githack.com/anhr/three.js/dev/build/three.js");
		arrayScripts.push( debug ? "http://" + url + "/threejs/three.js/examples/js/WebGL.js" :
			"https://raw.githack.com/anhr/three.js/dev/examples/js/WebGL.js" );

	}
*/
	if ( options.menuPlay ) {


		arrayScripts.push( debug ? "http://" + url + "/nodejs/menuPlay/build/menuPlay.js" :
			"https://raw.githack.com/anhr/menuPlay/master/build/menuPlay." + min + "js" );
		//arrayScripts.push( "http://' + url + '/nodejs/menuPlay/build/menuPlay." + min + "js" );
		//arrayScripts.push( "https://raw.githack.com/anhr/menuPlay/master/build/menuPlay.js" );
		//arrayScripts.push( "https://raw.githack.com/anhr/menuPlay/master/build/menuPlay." + min + "js" );


	}
/*
	if ( options.orbitControls )
		arrayScripts.push( debug ? "http://" + url + "/threejs/three.js/examples/js/controls/OrbitControls.js" :
			"https://raw.githack.com/anhr/three.js/dev/examples/js/controls/OrbitControls.js" );
*/
	if ( options.dat ) {

		//loadScript.sync( 'http://' + url + '/nodejs/dropdownMenu/styles/gui.css', optionsStyle );
		loadScript.sync( debug ? 'http://' + url + '/nodejs/dropdownMenu/styles/gui.css' :
			'https://raw.githack.com/anhr/DropdownMenu/master/styles/gui.css', optionsStyle );

		//for .container class
		//loadScript.sync( 'http://' + url + '/nodejs/dropdownMenu/styles/menu.css', optionsStyle );
		loadScript.sync( debug ? 'http://' + url + '/nodejs/dropdownMenu/styles/menu.css' :
			'https://raw.githack.com/anhr/DropdownMenu/master/styles/menu.css', optionsStyle );
/*
		//arrayScripts.push( "https://raw.githack.com/anhr/three.js/dev/examples/js/libs/dat.gui.js" );
		arrayScripts.push( debug ? "http://" + url + "/threejs/three.js/examples/js/libs/dat.gui.js" :
			"https://raw.githack.com/anhr/three.js/dev/examples/js/libs/dat.gui." + min + "js" );
*/

	}

	if ( options.controllerPlay ) {

		//arrayScripts.push( "https://raw.githack.com/anhr/controllerPlay/master/build/controllerPlay.js" );
		arrayScripts.push( debug ? "http://" + url + "/nodejs/controllerPlay/build/controllerPlay.js" :
			"https://raw.githack.com/anhr/controllerPlay/master/build/controllerPlay." + min + "js" );

	}
/*
	if ( options.stereoEffect ) {

		arrayScripts.push( debug ? "http://" + url + "/threejs/three.js/examples/js/effects/StereoEffect.js" :
			"https://raw.githack.com/anhr/three.js/dev/examples/js/effects/StereoEffect.js" );

	}
*/
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

			/*
									if ( spriteTextIntersection !== undefined )
										console.error( 'Duplucate spriteTextIntersection' );
			*/
			spriteTextIntersection = item;
			return;

		}

	} );
	return spriteTextIntersection;

}
export function addSpriteTextIntersection( raycaster, intersection, scene ) {

	var spriteTextIntersection = findSpriteTextIntersection( scene );
	if ( spriteTextIntersection !== undefined )
		return;
	var textColor = 'rgb( 128, 128, 128 )',
		position = raycaster.stereo === undefined ? getPosition( intersection ) : raycaster.stereo.getPosition( intersection, true );
	if ( findSpriteTextIntersection( scene ) )
		return;
	spriteTextIntersection = new SpriteText( 'x: ' + position.x + ' y: ' + position.y + ' z: ' + position.z, {

		textHeight: 0.1,
		fontColor: textColor,
		rect: {

			displayRect: true,
			borderThickness: 3,
			borderRadius: 10,
			borderColor: textColor,
			backgroundColor: 'rgba( 0, 0, 0, 1 )',

		},
		position: position.multiply( intersection.object.scale ),
		center: new Vector2( 0.5, 0 ),

	} );
	spriteTextIntersection.name = spriteTextIntersectionName;
	spriteTextIntersection.scale.divide( scene.scale );
	scene.add( spriteTextIntersection );
/*
	loadScript.sync( debug ? "http://" + url + "/threejs/three.js/src/objects/SpriteText.js" :
		'https://raw.githubusercontent.com/anhr/three.js/dev/src/objects/SpriteText.js', {

		onload: function ( response ) {

			setTimeout( function () {

				if ( findSpriteTextIntersection( scene ) )
					return;
				spriteTextIntersection = new SpriteText( 'x: ' + position.x + ' y: ' + position.y + ' z: ' + position.z, {

					textHeight: 0.1,
					fontColor: textColor,
					rect: {

						displayRect: true,
						borderThickness: 3,
						borderRadius: 10,
						borderColor: textColor,
						backgroundColor: 'rgba( 0, 0, 0, 1 )',

					},
					position: position.multiply( intersection.object.scale ),
					center: new Vector2( 0.5, 0 ),

				} );
				spriteTextIntersection.name = spriteTextIntersectionName;
				spriteTextIntersection.scale.divide( scene.scale );
				scene.add( spriteTextIntersection );
				//								INTERSECTED = intersection.object;

			}, 0 );

		},
		onerror: function ( str, e ) {

			console.error( str );

		},

	} );
*/

}
export function removeSpriteTextIntersection( scene ) {

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

//Localization

var lang = {

	defaultButton: 'Default',
	defaultTitle: 'Restore Orbit controls settings.',

};

switch ( getLanguageCode() ) {

	case 'ru'://Russian language
		lang.defaultButton = 'Восстановить';
		lang.defaultTitle = 'Восстановить положение осей координат по умолчанию.';
		break;

}
