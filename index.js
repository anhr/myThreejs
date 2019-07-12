/**
 * myThreejs
 * 
 * I use myThreejs into my projects for displaying of my 3D objects in the canvas.
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

//import * as THREE from 'three';

/**
 * @callback create3Dobjects
 * @param {Group} group group of my 3d objects. https://threejs.org/docs/index.html#api/en/objects/Group
 */

/**
 * Creates new canvas with my 3D objects
 * @param {create3Dobjects} create3Dobjects callback creates my 3D objects.
 * @param {object} [options] followed options is available:
 * @param {HTMLElement|string} [options.elContainer] If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui.
 * If a string, then is id of the HTMLElement.
 * Default is document.getElementById( "containerDSE" ) or a div element, child of body.
 * @param {boolean} [options.orbitControls] true - use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
 * @param {boolean} [options.stereoEffect] true - use stereoEffect. https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
 * @param {boolean} [options.dat] true - use dat-gui JavaScript Controller Library. https://github.com/dataarts/dat.gui
 * @param {boolean} [options.controllerPlay] true - use PlayController https://github.com/anhr/controllerPlay. My custom controller in my version of dat.gui https://github.com/anhr/dat.gui for playing of 3D obects in my projects.
 * Available only if options.dat = true
 */
export function create( create3Dobjects, options ) {

	options = options || {};

	function onloadScripts() {

/*
		if ( options.dat )
			loadScript.sync( 'http://localhost/nodejs/dropdownMenu/styles/gui.css', optionsStyle );
*/
		if ( WEBGL.isWebGLAvailable() === false ) {

			document.body.appendChild( WEBGL.getWebGLErrorMessage() );
			alert( WEBGL.getWebGLErrorMessage().innerHTML );

		}

		var elContainer = options.elContainer === undefined ? document.getElementById( "containerDSE" ) :
			typeof options.elContainer === "string" ? document.getElementById( options.elContainer ) : options.elContainer;
		if ( elContainer === null ) {

			elContainer = document.createElement( 'div' );
			document.querySelector( 'body' ).appendChild( elContainer );

		}
		elContainer.innerHTML = loadFile.sync( 'http://localhost/nodejs/myThreejs/canvasContainer.html', {

			onload: function ( response, url) {

				console.log( 'loadFile.onload: ' + url );

			}

		} );
		elContainer = elContainer.querySelector( '.container' );
		var elCanvas = elContainer.querySelector( 'canvas' );

		var camera, scene, renderer, controls, stereoEffect, group, playController;//, cubeType = 'cube', raycaster

		function createMenu() {

			if ( typeof menuPlay !== 'undefined' )
				menuPlay.create( elContainer, {

					stereoEffect: stereoEffect,
					playController: playController,

				} );

		}

		init();
		animate();
		createMenu();

		function init() {

			// CAMERA

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.set( 0.4, 0.4, 2 );

			// SCENE

			scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x000000 );
			scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

			//

			renderer = new THREE.WebGLRenderer( {

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

					if ( typeof menuPlay !== 'undefined' )
						menuPlay.setSize( width, height );

				}, 0 );

			};
			renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );

			//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			if ( THREE.OrbitControls !== undefined ) {

				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 0, 0 );
				controls.update();

			}

			//StereoEffect. https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
			if ( THREE.StereoEffect !== undefined ) {

				stereoEffect = new THREE.StereoEffect( renderer, {

					spatialMultiplex: THREE.StereoEffectParameters.spatialMultiplexsIndexs.Mono, //.SbS,
					far: camera.far,
					camera: camera,
					stereoAspect: 1,
					rememberSize: true,
					onFullScreen: function ( fullScreen ) {

						setFullScreenButton( fullScreen );

					},
					cookie: THREE.cookie,

				} );
				stereoEffect.options.spatialMultiplex = THREE.StereoEffectParameters.spatialMultiplexsIndexs.Mono;

			}

			//Light

			var light = new THREE.PointLight( 0xffffff, 1 );
			light.position.copy( new THREE.Vector3( 1, 1, 1 ) );
			scene.add( light );

			light = new THREE.PointLight( 0xffffff, 1 );
			light.position.copy( new THREE.Vector3( -2, -2, -2 ) );
			scene.add( light );
/*
			//raycaster

			raycaster = new THREE.Raycaster();
			raycaster.params.Points.threshold = 0.03;
			raycaster.setStereoEffect( {

				renderer: renderer,
				stereoEffect: stereoEffect,
				onIntersection: function ( intersects ) {

					onIntersection( intersects );

				},
				onIntersectionOut: function ( intersects ) {

					onIntersectionOut( intersects );

				},
				onMouseDown: function ( intersects ) {

					onMouseDown( intersects );

				}

			} );
*/
			group = new THREE.Group();
			scene.add( group );

			//dat-gui JavaScript Controller Library
			//https://github.com/dataarts/dat.gui
			if ( typeof dat !== 'undefined' ) {

				var gui = new dat.GUI( {

					autoPlace: false,
					//			closed: true,//Icorrect "Open Controls" button name

				} );

				//Close gui window
				if ( gui.__closeButton.click !== undefined )//for compatibility with Safari 5.1.7 for Windows
					gui.__closeButton.click();

				//Thanks to https://stackoverflow.com/questions/41404643/place-dat-gui-strictly-inside-three-js-scene-without-iframe
				document.getElementById( 'my-gui-container' ).appendChild( gui.domElement );

				//PlayController https://github.com/anhr/controllerPlay. My custom controller in my version of dat.gui https://github.com/anhr/dat.gui for playing of 3D obects in my projects.
				if ( typeof controllerPlay !== "undefined" ) {

					var colorRed = new THREE.Color( 0xff0000 );
					playController = controllerPlay.create( group, {

						onShowObject3D: function ( objects3DItem, index ) {

							objects3DItem.visible = true;
							if ( typeof menuPlay !== "undefined" )
								menuPlay.setIndex( index );

						},
						onHideObject3D: function ( objects3DItem ) {

							objects3DItem.visible = false;//hide object3D

						},
						onSelectedObject3D: function ( objects3DItem, index ) {

							objects3DItem.material.color = colorRed;
							objects3DItem.visible = true;
							if ( typeof menuPlay !== "undefined" )
								menuPlay.setIndex( index );

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
					gui.add( playController );

				}

			}

			create3Dobjects( group );

			if ( ( stereoEffect !== undefined ) && ( typeof gui !== 'undefined' ) )
				THREE.gui.stereoEffect( gui, stereoEffect.options, {

					gui: gui,
					stereoEffect: stereoEffect,

				} );

			window.addEventListener( 'resize', onResize, false );

		}
		function onResize() {

			var size = new THREE.Vector2();
			renderer.getSize( size );
			camera.aspect = size.x / size.y;
			camera.updateProjectionMatrix();

			if ( typeof se === 'undefined' )
				renderer.setSize( size.x, size.y );
			else
				stereoEffect.setSize( size.x, size.y );

		}
		function onDocumentMouseMove( event ) {
			/*if ( raycaster.stereo !== undefined )
				raycaster.stereo.onDocumentMouseMove( event );
			else */{

				// Test of the old version of THREE.Raycaster
				event.preventDefault();
				var left = renderer.domElement.offsetLeft,
					top = renderer.domElement.offsetTop,
					size = new THREE.Vector2;
				renderer.getSize( size );
				mouse.x = ( event.clientX / size.x ) * 2 - 1 - ( left / size.x ) * 2;
				mouse.y = -( event.clientY / size.y ) * 2 + 1 + ( top / size.y ) * 2;

			}
			if ( event.buttons != 1 )
				return;

			render();

		}
		function onDocumentMouseDown( event ) {
/*
			if ( raycaster.stereo !== undefined )
				raycaster.stereo.onDocumentMouseDown( event );
*/
		}
		function animate() {

			requestAnimationFrame( animate );

			render();

		}

		function render() {

			if ( typeof stereoEffect === 'undefined' )
				renderer.render( scene, camera );
			else stereoEffect.render( scene, camera );

		}
/*
		var canvasMouseOver = false,
			elControls = elContainer.querySelectorAll( '.controls' ),
			timeoutControls;
*/
		var timeoutControls;

		function setFullScreenButton( fullScreen ) {

			var elMenuButtonFullScreen = document.getElementById( 'menuButtonFullScreen' );
			if ( elMenuButtonFullScreen === null )
				return;

			if ( fullScreen === undefined )
				fullScreen = !( ( stereoEffect === undefined ) || !stereoEffect.isFullScreen() );
			if ( fullScreen ) {

				elMenuButtonFullScreen.innerHTML = '⤦';
				elMenuButtonFullScreen.title = 'Non Full Screen';

			} else {

				elMenuButtonFullScreen.innerHTML = '⤢';
				elMenuButtonFullScreen.title = 'Full Screen';

			}

		}

	}

	var optionsStyle = {

		//style rel="stylesheet"
		tag: 'style',
		onload: function ( response, url ) {

			console.log( 'loadScript.onload: ' + url );

		},

	}
	var arrayScripts = [

		//"http://localhost/threejs/three.js/build/three.js",

		//"http://localhost/threejs/three.js/examples/js/WebGL.js",
		"https://raw.githack.com/anhr/three.js/dev/examples/js/WebGL.js",

	];
	if ( options.menuPlay ) {


		//arrayScripts.push( "http://localhost/nodejs/menuPlay/build/menuPlay.js" );
		//arrayScripts.push( "http://localhost/nodejs/menuPlay/build/menuPlay.min.js" );
		//arrayScripts.push( "https://raw.githack.com/anhr/menuPlay/master/build/menuPlay.js" );
		arrayScripts.push( "https://raw.githack.com/anhr/menuPlay/master/build/menuPlay.min.js" );


	}

	if ( options.orbitControls )
		arrayScripts.push( "https://raw.githack.com/anhr/three.js/dev/examples/js/controls/OrbitControls.js" );
	if ( options.dat ) {

		//loadScript.sync( 'http://localhost/nodejs/dropdownMenu/styles/gui.css', optionsStyle );
		loadScript.sync( 'https://raw.githack.com/anhr/DropdownMenu/master/styles/gui.css', optionsStyle );

		//for .container class
		//loadScript.sync( 'http://localhost/nodejs/dropdownMenu/styles/menu.css', optionsStyle );
		loadScript.sync( 'https://raw.githack.com/anhr/DropdownMenu/master/styles/menu.css', optionsStyle );

		//arrayScripts.push( "https://raw.githack.com/anhr/three.js/dev/examples/js/libs/dat.gui.js" );
		arrayScripts.push( "https://raw.githack.com/anhr/three.js/dev/examples/js/libs/dat.gui.min.js" );

		if ( options.controllerPlay ) {

			//arrayScripts.push( "https://raw.githack.com/anhr/controllerPlay/master/build/controllerPlay.js" );
			arrayScripts.push( "https://raw.githack.com/anhr/controllerPlay/master/build/controllerPlay.min.js" );

		}

	}

	if ( options.stereoEffect ) {

		arrayScripts.push( "https://raw.githack.com/anhr/three.js/dev/examples/js/effects/StereoEffect.js" );
		//arrayScripts.push( "http://localhost/threejs/three.js/examples/js/effects/StereoEffect.js" );

	}

	loadScript.sync( arrayScripts, {
		onload: onloadScripts,
		onerror: function ( str, e ) {

			console.error( str );

		},

	} );

//	onloadScripts();

}
