/**
 * @module myPoints
 *
 * Array of my points.
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

import * as THREE from '../../../three.js/dev/build/three.module.js';

/**
 * Creating the new points and adding it into group
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
 * @param {THREE.Group} group Group for new points
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
 * @param {object} [pointsOptions.cloud] position of the each point of this points array is cloud of random positions according with normal distribution. See https://en.wikipedia.org/wiki/Normal_distribution for details.Default is undefined.
 * @param {boolean} [pointsOptions.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. See options.getColors for details. Default is undefined.
 */
function create( arrayFuncs, group, options, pointsOptions ) {

	if ( ( typeof arrayFuncs !== 'function' ) && ( arrayFuncs.length === 0 ) )
		arrayFuncs.push( new THREE.Vector3() );
	pointsOptions = pointsOptions || {};
	pointsOptions.tMin = pointsOptions.tMin || 0;
	pointsOptions.name = pointsOptions.name || '';
	pointsOptions.position = pointsOptions.position || new THREE.Vector3( 0, 0, 0 );
	pointsOptions.scale = pointsOptions.scale || new THREE.Vector3( 1, 1, 1 );
	pointsOptions.rotation = pointsOptions.rotation || new THREE.Vector3();

	if ( pointsOptions.shaderMaterial )
		getShaderMaterialPoints( {

			getPoints: options.getPoints,
			getColors: options.getColors,
			renderer: options.renderer,
			tMin: pointsOptions.tMin,
			arrayFuncs: arrayFuncs,
			a: options.a, b: options.b,
			sizes: new Float32Array( arrayFuncs.length ),
			scales: options.scales,
			shaderMaterial: pointsOptions.shaderMaterial,
			opacity: pointsOptions.opacity,
			position: pointsOptions.position,
			pointSize: options.point.size,
			path: pointsOptions.path,
			uniforms: pointsOptions.uniforms,
			boFrustumPoints: pointsOptions.boFrustumPoints,
			arrayCloud: pointsOptions.cloud === undefined ? undefined : options.arrayCloud,

		}, function ( points ) {

/*
			var requestId = window.requestAnimationFrame( function () {

				Points( points );
				group.add( points );

			} );
*/			
			Points( points );
			if ( !points.userData.boFrustumPoints )
				options.addParticle( points );
			
//			group.add( points );
//			onReady( points );
//			options.render();
			
		} );
	else {

		var points = new THREE.Points(

			new THREE.BufferGeometry().setFromPoints( options.getPoints( pointsOptions.tMin, arrayFuncs, options.a, options.b ), 4 ),
			new THREE.PointsMaterial( { size: options.point.size, vertexColors: THREE.VertexColors } )

		);
		points.geometry.addAttribute( 'color',
			new THREE.Float32BufferAttribute( options.getColors( pointsOptions.tMin, arrayFuncs, options.scales.w ), 3 ) );
		Points( points );

	}
	function Points( points ) {
		
		points.name = pointsOptions.name;//'Wave';
		points.userData.arrayFuncs = arrayFuncs;
		if ( pointsOptions.pointIndexes !== undefined )
			points.userData.pointIndexes = function ( pointIndex ) { return pointsOptions.pointIndexes( pointIndex ); }
		if ( pointsOptions.pointName !== undefined )
			points.userData.pointName = function ( pointIndex ) { return pointsOptions.pointName( pointIndex ); }
		if ( pointsOptions.controllers !== undefined ) {

			points.userData.addControllers = pointsOptions.addControllers;
			points.userData.controllers = function ( /*cFrustumPoints*/ ) { return pointsOptions.controllers( /*cFrustumPoints*/ ); }

		}
		points.userData.raycaster = {

			onIntersection: function ( raycaster, intersection, scene, mouse ) {

				options.addSpriteTextIntersection( intersection, scene, mouse );

			},
			onIntersectionOut: function ( scene ) {

				options.removeSpriteTextIntersection( scene );

			},

		}
		points.userData.selectPlayScene = function ( t ) {

			setPositions( t );
			setScales( t );
			setRotations( t );

		}
		if ( pointsOptions.cloud !== undefined )
			points.userData.cloud = pointsOptions.cloud;
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
		setPositions();
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
		setScales();
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
		setRotations();
		group.add( points );
//console.warn('group.add( ' + points.name + ' )');
		if ( pointsOptions.onReady !== undefined )
			pointsOptions.onReady( points );

		options.guiSelectPoint.addMesh( points );

	}
//	return points;

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
 * @param {boolean} [params.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. See options.getColors for details. Default is undefined.
 * @param {function(THREE.Points)} onReady Callback function that take as input the new THREE.Points.
 */
function getShaderMaterialPoints( params, onReady ) {

	var geometry;
	if ( typeof params.arrayFuncs === 'function' )
		geometry = params.arrayFuncs();
	else geometry = new THREE.BufferGeometry().setFromPoints( params.getPoints( params.tMin, params.arrayFuncs, params.a, params.b ),
		params.arrayFuncs[0] instanceof THREE.Vector3 ? 3 : 4 );
//	geometry.addAttribute( 'size', new THREE.Float32BufferAttribute( geometry.attributes.position.count, 1 ) );
	if (params.arrayCloud !== undefined ){

		for ( var i = 0; i < geometry.attributes.position.count; i++ ){

			params.arrayCloud.push( new THREE.Vector4().fromArray( geometry.attributes.position.array, i * geometry.attributes.position.itemSize ) );

		}
		
	}
	if ( !params.boFrustumPoints )
		geometry.addAttribute( 'ca', new THREE.Float32BufferAttribute(
	//		params.getColors( params.tMin, params.arrayFuncs, params.scales.w, params.opacity ? geometry.attributes.position : undefined, undefined, geometry.attributes.position.count ),
			params.getColors( params.tMin, params.arrayFuncs, params.scales.w, { opacity: params.opacity, positions: geometry.attributes.position } ),
			4 ) );
/*		
	///////////////////////////////////////
	//https://threejs.org/docs/index.html#api/en/textures/DataTexture
	//http://localhost/anhr/Three.js/dev/Examples/webaudio_visualizer.html

	// create a buffer with color data

	var format = THREE.RGBAFormat,//LuminanceFormat,//Available formats https://threejs.org/docs/index.html#api/en/constants/Textures
								//D:\My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\src\constants.js
		itemSize = format === THREE.RGBAFormat ? 4 : format === THREE.RGBFormat ? 3 : format === THREE.LuminanceFormat ? 1 : NaN,
		width = 2, height = 1,//format === THREE.LuminanceFormat ? 1 : 2,
		size = width * height,
		type = THREE.FloatType;
	var data = type === THREE.FloatType ? new Float32Array( itemSize * size ) : new Uint8Array( itemSize * size );

	if( !isNaN( itemSize ) ) {

		function addItem( i, vector ) {

			var stride = i * itemSize;

			data[stride] = vector.x;
			if ( itemSize > 1 ) {

				data[stride + 1] = vector.y;
				if ( itemSize > 2 ) {

					data[stride + 2] = vector.z;
					if ( itemSize > 3 )
						data[stride + 3] = vector.w;

				}

			}

		}
		addItem( 0, new THREE.Vector4( 10.0, 100, 100, 1 ) );
		addItem( 1, new THREE.Vector4( 5.0, 10.0, 20.0, 30.0 ) );

	} else console.error( 'itemSize = ' + itemSize );

	// used the buffer to create a DataTexture

	var cloudPoints = new THREE.DataTexture( data, width, height, format, type );
//	cloudPoints.wrapS = THREE.RepeatWrapping;
//	cloudPoints.wrapT = THREE.RepeatWrapping;
	///////////////////////////////////////
*/

	var texture = new THREE.TextureLoader().load( "/anhr/myThreejs/master/textures/point.png" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	var uniforms = {

		color: { value: new THREE.Color( 0xffffff ) },
		pointTexture: { value: texture },
//		cloudPoints: { value: cloudPoints },

		//если убрать эту переменную, то размер точек невозможно будет регулировать
		opacity: {
			value: ( params.shaderMaterial !== undefined ) &&
				( params.shaderMaterial.point !== undefined ) &&
				( params.shaderMaterial.point.opacity !== undefined ) ?
				params.shaderMaterial.point.opacity : 1.0
		},//Float in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
		//			cameraPosition: { value: myPoints.camera.position },
		pointSize: { value: ( params.shaderMaterial !== undefined ) && ( params.shaderMaterial.point !== undefined ) ?
			params.shaderMaterial.point.size :
			params.pointSize === undefined ? 0.0 : params.pointSize },
	/*			
		pointSize: { value: params.pointSize === undefined ?
			params.shaderMaterial === undefined ? 0.0 : params.shaderMaterial.point.size :
			params.pointSize },
	*/				
	//			pointsPosition: { value: params.position === undefined ? new THREE.Vector3( 0, 0, 0 ) : params.position },
	//			pointsPosition: { value: new THREE.Vector3( 0.4, 0.4, 2.0 ) },

	}
	if( params.uniforms !== undefined )
		params.uniforms( uniforms );

	loadShaderText(function ( shaderText ) {

		//See description of the
		//const int cloudPointsWidth = %s;
		//in the \frustumPoints\vertex.c
		if ( uniforms.cloudPointsWidth )
			shaderText.vertex = shaderText.vertex.replace( '%s', uniforms.cloudPointsWidth.value + '.' );

		var points = new THREE.Points( geometry, new THREE.ShaderMaterial( {

			//See https://threejs.org/examples/webgl_custom_attributes_points2.html
			//D: \My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\examples\webgl_custom_attributes_points2.html
			//OpenGL Shading Language https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language
			//Обзор спецификации GLSL ES 2.0 http://a-gro-pro.blogspot.com/2013/06/glsl-es-20.html
			//Open GL 4. Язык шейдеров. Книга рецептов http://www.cosmic-rays.ru/books61/2015ShadingLanguage.pdf
			//OpenGL® 4.5 Reference Pages. Ключевые слова по алфавиту https://www.khronos.org/registry/OpenGL-Refpages/gl4/

			uniforms: uniforms,
			vertexShader: shaderText.vertex,
			fragmentShader: shaderText.fragment,
			transparent: true,
			//		opacity: 0.1,

		} ) );
		points.userData.shaderMaterial = params.shaderMaterial;
		if( onReady !== undefined )
			onReady( points );
		var requestId;
		var needsUpdate = false;
/*
		function animate() {

			requestId = requestAnimationFrame( animate );
			if ( needsUpdate )
				return;
			needsUpdate = true;
			if ( points.material.uniforms.cloudPoints !== undefined )
				points.material.uniforms.cloudPoints.value.needsUpdate = needsUpdate;

		}
		animate();
*/
		//нужно что бы обновились точки в frustumPoints
		if ( points.material.uniforms.cloudPoints !== undefined )
			points.material.uniforms.cloudPoints.value.needsUpdate = true;
	}, params.path );
	
/*
	if ( requestId !== undefined )
		window.cancelAnimationFrame( requestId );
*/
//	return points;

/*
		var points = new THREE.Points( geometry, new THREE.ShaderMaterial( {

			//See https://threejs.org/examples/webgl_custom_attributes_points2.html
			//D: \My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\examples\webgl_custom_attributes_points2.html
			//https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language
			//Обзор спецификации GLSL ES 2.0 http://a-gro-pro.blogspot.com/2013/06/glsl-es-20.html
			//Open GL 4. Язык шейдеров. Книга рецептов http://www.cosmic-rays.ru/books61/2015ShadingLanguage.pdf

			uniforms: {

				color: { value: new THREE.Color( 0xffffff ) },
				pointTexture: { value: texture },

				//если убрать эту переменную, то размер точек невозможно будет регулировать
				opacity: {
					value: ( params.shaderMaterial !== undefined ) &&
						( params.shaderMaterial.point !== undefined ) &&
						( params.shaderMaterial.point.opacity !== undefined ) ?
						params.shaderMaterial.point.opacity : 1.0
				},//Float in the range of 0.0 - 1.0 indicating how transparent the material is.
				//A value of 0.0 indicates fully transparent, 1.0 is fully opaque.

			},
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
			//		opacity: 0.1,

		} ) );
		points.userData.shaderMaterial = params.shaderMaterial;
//		onReady( points );
*/

}

/**Не работает
 * map of vertex.
 * For preventing of the duplicate loading of the vertex from file.
 * key: path to vertex file
 * value: vertex code
 * */
//const vertexMap = new Map();

/**
 * Loading of the vertex and fragment contents from external files.
 * Thanks to https://stackoverflow.com/a/48188509/5175935
 * @param {function()} onLoad Callback function that called after success loading.
 * */
function loadShaderText ( onload, path ) {

	var shaderText = {};
/*	
	if ( ( shaderText !== undefined ) && ( shaderText.vertex !== undefined ) && ( path === undefined ) ) {

		if( shaderText.fragment === undefined )
			console.error( 'shaderText.fragment = ' + shaderText.fragment );
		onload();
		return;

	}
*/	
//	arrayOnLoad.push( onload );

	/**
	 * This is a basic asyncronous shader loader for THREE.js.
	 * Thanks to https://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/
	 * https://github.com/THeK3nger/threejs-async-shaders-example
	 * 
	 * It uses the built-in THREE.js async loading capabilities to load shaders from files!
	 * 
	 * `onProgress` and `onError` are stadard TREE.js stuff. Look at 
	 * https://threejs.org/examples/webgl_loader_obj.html for an example. 
	 * 
	 * @param {String} vertex_url URL to the vertex shader code.
	 * @param {String} fragment_url URL to fragment shader code
	 * @param {function(String, String)} onLoad Callback function(vertex, fragment) that take as input the loaded vertex and fragment contents.
	 * @param {object} [options] followed options is available
	 * @param {function(event)} [options.onProgress] Callback for the `onProgress` event.
	 * @param {function(event)} [options.onError] Callback for the `onError` event.
	 */
	function ShaderLoader( vertex_url, fragment_url, onLoad, options ) {

		options = options || {};
		var vertex_loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
		vertex_loader.setResponseType( 'text' );
		vertex_loader.load( vertex_url, function ( vertex_text ) {

			var fragment_loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
			fragment_loader.setResponseType( 'text' );
			fragment_loader.load( fragment_url, function ( fragment_text ) {

				onLoad( vertex_text, fragment_text );

			}, options.onProgress, options.onError );

		}, options.onProgress, options.onError );

	}
	/*
		//Thanks to https://stackoverflow.com/a/42594856/5175935
		window.getRunningScript = () => {
			return () => {
	
	//Not compatible with FireFox
	//			return new Error().stack.match(/at (https?:[^:]*)/)[1];
				return new Error().stack.match(/(https?:[^:]*)/)[0];
	
			}
		}
		var runningScript = getRunningScript()();
	console.warn( 'runningScript = ' + runningScript );
	*/

	//Thanks to https://stackoverflow.com/a/27369985/5175935
	//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
	var getCurrentScript = function () {

		if ( document.currentScript && ( document.currentScript.src !== '' ) )
			return document.currentScript.src;
		var scripts = document.getElementsByTagName( 'script' ),
			str = scripts[scripts.length - 1].src;
		if ( str !== '' )
			return src;
		//Thanks to https://stackoverflow.com/a/42594856/5175935
		return new Error().stack.match( /(https?:[^:]*)/ )[0];

	};
	//Thanks to https://stackoverflow.com/a/27369985/5175935
	var getCurrentScriptPath = function () {
		var script = getCurrentScript(),
			path = script.substring( 0, script.lastIndexOf( '/' ) );
		return path;
	};
	//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
	var currentScriptPath = getCurrentScriptPath();

//	shaderText = {};
//console.warn('path: ' + path + ( path === undefined ? '' : ' path.vertex: ' + path.vertex ) );
	path = path || {};
	path.vertex = path.vertex || currentScriptPath + "/vertex.c";
	path.fragment = path.fragment || currentScriptPath + "/fragment.c";
	ShaderLoader( path.vertex, path.fragment,
		function ( vertex, fragment ) {

//console.warn( 'path: ' + path + ' shaderText.vertex = ' + shaderText.vertex );
/*
			if( vertexMap.has(path.vertex) )
				console.error( 'Duplucate vertex. file: ' + path.vertex );
			else vertexMap.set( path.vertex, vertex );
*/
			shaderText.vertex = vertex;
			shaderText.fragment = fragment;
			onload( shaderText );

		},
		{

			onError: function ( event ) {

				console.error( event.srcElement.responseURL + ' status = ' + event.srcElement.status + ' ' + event.srcElement.statusText );

			}

		}

	);

}

/**
 * The vertex and fragment contents
 * */
//var shaderText;
/**
 * Loading of the vertex and fragment contents from external files.
 * Creating the new points and adding it into group
 * */
export var myPoints = {

	/**
	 * Creating the new points and adding it into group
	 * */
	create: create,
	getGlobalScale: function ( mesh ) {

		var parent = mesh.parent, scale = new THREE.Vector3( 1, 1, 1 );
		while ( parent !== null ) {

			scale.multiply( parent.scale );
			parent = parent.parent;

		}
		return scale;

	},
	/**
	* get THREE.Points with THREE.ShaderMaterial material
	* */
	getShaderMaterialPoints: getShaderMaterialPoints,

}