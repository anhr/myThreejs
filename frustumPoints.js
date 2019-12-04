/**
 * frustumPoints
 * 
 * Array of points, statically fixed in front of the camera.
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

import {

	Color,
	Vector3,
	CameraHelper,
	/*
	Vector2,
	Vector4,
	PerspectiveCamera,
	Scene,
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
	*/

} from '../../three.js/dev/build/three.module.js';
import myThreejs from './myThreejs.js';
import cookie from '../../cookieNodeJS/master/cookie.js';

function create( camera, controls, guiSelectPoint, renderer, group, options ) {

	var cameraPerspectiveHelper = new CameraHelper( camera );
	//group.add( cameraPerspectiveHelper );
//	var layer = - ( camera.far - camera.near ) / 2;
	var zeroPoint = new Vector3();
	var cameraDistanceDefault = camera.position.distanceTo( zeroPoint );
	controls.addEventListener( 'change', function ( o ) {

		setPointsParams();

	} );

	var array = [],
		color = new Color( "rgb(255, 255, 255)" );//white

/*
	function addPoint( pointName, frustumName ){

		var points = cameraPerspectiveHelper.pointMap[pointName],
			position = cameraPerspectiveHelper.geometry.attributes.position,
			point = new Vector3().fromArray( position.array, points[0] * position.itemSize )
		array.push( { vector: [point.x, point.y, point.z, color], name: frustumName + ' ' + pointName } );

	}
*/
	function addPoint( point, pointName ) {

		array.push( { vector: [point.x, point.y, point.z, color], name: pointName } );

	}
	function getPoint( pointName ) {

		var points = cameraPerspectiveHelper.pointMap[pointName],
			position = cameraPerspectiveHelper.geometry.attributes.position;
		return new Vector3().fromArray( position.array, points[0] * position.itemSize )

	}

	var pointName;//, frustumName;

	//near
	//addPoint( 'n1', 'near' );
//	frustumName = 'near';

	pointName = 'n1';
	var point_n1 = getPoint( pointName );

	pointName = 'n2';
	var point_n2 = getPoint( pointName );

	pointName = 'n3';
	var point_n3 = getPoint( pointName );

	//far
//	frustumName = 'far';

	var pointName = 'f1';
	var point_f1 = getPoint( pointName );

	pointName = 'f2';
	var point_f2 = getPoint( pointName );

	pointName = 'f3';
	var point_f3 = getPoint( pointName );
/*
	var pointStart = new Vector3().copy( point_f1 );

	var yCount = 10,
		yStep = ( point_f3.y - point_f1.y ) / ( yCount - 1 );
	for ( var y = 0; y < yCount; y++ ) {

		var xCount = yCount * parseInt( camera.aspect ),
			xStep = ( point_f2.x - point_f1.x ) / ( xCount - 1 ),
			zStep = 0;
		var z = 0;
		for ( var x = 0; x < xCount; x++ )
			addPoint( new Vector3( pointStart.x + xStep * x, pointStart.y + yStep * y, pointStart.z + zStep * z ), frustumName + ' x=' + x + ', y=' + y + ', z=' + z );

	}
*/
	var pointStart = new Vector3().copy( point_n1 );

	var zCount = 10,
		zStep = ( point_f1.z - point_n1.z ) / ( ( zCount - 1 ) * ( zCount - 1 ) );
	for ( var z = 0; z < zCount; z++ ) {

		var yCount = 10,
			ynStep = ( point_n3.y - point_n1.y ) / ( yCount - 1 ),
			yfStep = ( point_f3.y - point_f1.y ) / ( yCount - 1 ),
			yStep = ( ( yfStep - ynStep ) / ( ( zCount -1 ) * ( zCount -1 ) ) ) * z * z + ynStep,

			xCount = yCount * parseInt( camera.aspect ),
			xnStep = ( point_n2.x - point_n1.x ) / ( xCount - 1 ),
			xfStep = ( point_f2.x - point_f1.x ) / ( xCount - 1 ),
			xStep = ( ( xfStep - xnStep ) / ( ( zCount -1 ) * ( zCount -1 ) ) ) * z * z + xnStep;
//			zxStep = ( ( ( point_f1.x - point_n1.x ) / ( zCount - 1 ) ) * z );
//			zyStep = ( ( ( point_f1.y - point_n1.y ) / ( zCount - 1 ) ) * z ),// / yCount;
//		pointStart.x = point_n1.x + zxStep;
//		pointStart.y = point_n1.y - yStep * ( yCount - 1 ) / 2;
		pointStart.y = - yStep * ( yCount - 1 ) / 2;
//		pointStart.x = point_n1.x - xStep * ( xCount - 1 ) / 2;
		pointStart.x = - xStep * ( xCount - 1 ) / 2;
//		pointStart.y = point_n1.y - zyStep * yCount / 2;
//		var yStep = ( point_n3.y - point_n1.y ) / ( yCount - 1 ) + zyStep;
		for ( var y = 0; y < yCount; y++ ) {
/*
			var xCount = yCount * parseInt( camera.aspect ),
				xStep = ( point_n2.x - point_n1.x ) / ( xCount - 1 ) - zxStep / ( yCount + 1 );
*/				
			for ( var x = 0; x < xCount; x++ )
				addPoint( new Vector3( pointStart.x + xStep * x, pointStart.y + yStep * y, pointStart.z + zStep * z * z ), 'x=' + x + ', y=' + y + ', z=' + z );

		}

	}

//	addPoint( point_n1, frustumName + ' ' + pointName );
/*	
	var pointName = 'n1',
		points = cameraPerspectiveHelper.pointMap[pointName],
		position = cameraPerspectiveHelper.geometry.attributes.position,
		point = new Vector3().fromArray( position.array, points[0] * position.itemSize )
	array.push( { vector: [point.x, point.y, point.z, color], name: 'near ' + pointName } );
*/	
	//array.push ( { vector: new Vector3().set( -1, -1, -1 ).unproject( camera ), name: 'near' } );
//	addPoint( point_f1, frustumName + ' ' + pointName );
	//addPoint( 'f1', 'far' );
	//array.push ( { vector: new Vector3().set( -1, -1, 1 ).unproject( camera ), name: 'far' } );
	//array.push ( new Vector3().set( -1, -1, 1 ).unproject( camera ) );
/*
	var zCount = 10, pointStart = new Vector3().copy( point_n1 ),
		xStep = ( point_f1.x - point_n1.x ) / ( zCount - 1 ),
		yStep = ( point_f1.y - point_n1.y ) / ( zCount - 1 ),
		zStep = ( point_f1.x - point_n1.z ) / ( zCount - 1 );
	for ( var z = 0; z < zCount; z++ )
		addPoint( new Vector3( pointStart.x + xStep * z, pointStart.y + yStep * z, pointStart.z + zStep * z ), z );
*/		
/*
	var layer = 1;//-9//1.79 точек уже не видно, чтобы точки увидеть приходится крутить колесико мыши для уменьшения масштаба 
	var layerC = cameraDistanceDefault - layer,
		angleMaxY = ( Math.PI / 180 ) * 0.5 * camera.fov,
		yCount = 3, yStep = 2 * angleMaxY / ( yCount - 1 ),
		angleMaxX = angleMaxY * camera.aspect,
		xCount = yCount, xStep = 2 * angleMaxX / ( xCount - 1 );
	for( var y = 0; y < yCount; y++ )
		array.push( { vector: [0, Math.tan( ( y * yStep ) - angleMaxY ) * layerC, layer, color], name: y } );
*/		
/*		
	for( var y = 0; y < yCount; y++ )
		for( var x = 0; x < xCount; x++ )
			array.push( { vector: [Math.tan( ( x * xStep ) - angleMaxX ) * layerC, Math.tan( ( y * yStep ) - angleMaxY ) * layerC, layer, color], name: y } );
*/			
//	var yMax = Math.tan( ( Math.PI / 180 ) * 0.5 * camera.fov ) * ( cameraDistanceDefault - layer ),
/*
	var yMax = Math.tan( ( Math.PI / 180 ) * 0.5 * camera.fov ) * ( cameraDistanceDefault - layer ),
		yCount = 10, yStep = 2 * yMax / yCount,
		xMax = yMax * camera.aspect, xCount = 4, xStep = 2 * xMax / xCount;
*/
/*
	var zCount = 10, layerStep = ( 9 + 1.78 ) / ( zCount -1 );
	for ( var z = 0; z < zCount; z++) {

		var layer = -9//1.79 точек уже не видно, чтобы точки увидеть приходится крутить колесико мыши для уменьшения масштаба 
			+ layerStep * z;
		var yMax = ( Math.tan( ( Math.PI / 180 ) * 0.5 * camera.fov ) * ( cameraDistanceDefault - layer ) * ( -0.02 * layer + 0.77 )//( -0.079777 * layer + 0.232 )//* 0.75//этот коэффициент добавил для того, чтобы влазили все точки на canvas и еще был небольшой отступ от края
		 ),
										 yCount = 10, 								  yStep = 2 * yMax / ( yCount - 1 ),
			xMax = yMax * camera.aspect, xCount = yCount * parseInt( camera.aspect ), xStep = 2 * xMax / ( xCount - 1 );
		for( var x = 0; x < xCount; x++ )
			for( var y = 0; y < yCount; y++ )
				array.push( { vector: [x * xStep - xMax, y * yStep - yMax, layer, color], name: 'x=' + x + '. y=' + y + '. z=' + z } );

	}
*/
/*
	var yMax = ( Math.tan( ( Math.PI / 180 ) * 0.5 * camera.fov ) * ( cameraDistanceDefault - layer ) ) / layer,
									 yCount = 10, 								  yStep = 2 * yMax / ( yCount + 3 ),
		xMax = yMax * camera.aspect, xCount = yCount * parseInt( camera.aspect ), xStep = 2 * xMax / ( xCount + 4 );
	for( var i = 0; i < xCount; i++ )
		for( var j = 0; j < yCount; j++ )
			array.push( { vector: [( i + 2 ) * xStep - xMax, ( j + 2 ) * yStep - yMax, layer, color], name: 'x=' + i + '. y=' + j } );
*/			
/*
	var yMax = ( Math.tan( ( Math.PI / 180 ) * 0.5 * camera.fov ) * ( cameraDistanceDefault - layer ) ) / layer,
									 yCount = 10, 								  yStep = 2 * yMax / yCount,
		xMax = yMax * camera.aspect, xCount = yCount * parseInt( camera.aspect ), xStep = 2 * xMax / xCount;
	for( var i = 0; i < xCount - 1; i++ )
		for( var j = 0; j < yCount - 1; j++ )
			array.push( { vector: [i * xStep - xMax + xStep, j * yStep - yMax + yStep, layer, color], name: i + '.' + j } );
*/			
/*	
	for( var i = 0; i < yCount - 1; i++ )
		array.push( { vector: [0, i * yStep - yMax + yStep , layer, color], name: i } );
*/
/*
	for( var i = 0; i < xCount - 1; i++ )
		array.push( { vector: [i * xStep - xMax + xStep, 0, layer, color], name: i } );
*/
/*
	for( var i = 0; i < xCount; i++ )
		for( var j = 0; j < yCount; j++ )
			array.push( { vector: [i * xStep, j * yStep, layer, color], name: i + '.' + j } );
*/			
	var points = myThreejs.Points( array, options, {

			name: 'frustum points',
			shaderMaterial: { point: { size: 0.001, } },
			position: camera.position,
			scale: camera.scale,
			rotation: camera.rotation,

		}
	);
	function setPointsParams() {

		points.position.copy( camera.position );
		points.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.z );
		//points.position.divide( new Vector3( camera.far, camera.far, camera.far ) );
		var scale = camera.position.distanceTo( zeroPoint ) / cameraDistanceDefault;
		points.scale.x = scale;
		points.scale.y = scale;
		points.scale.z = scale;
		/*		
				points.rotation.copy( camera.rotation );
		*/
		//points.needsUpdate = true;
/*		
console.warn( 'points.position: ' + points.position.x + ' ' + points.position.y + ' ' + points.position.z +
' points.scale: ' + points.scale.x + ' ' + points.scale.y + ' ' + points.scale.z +
' points.rotation: ' + points.rotation.x + ' ' + points.rotation.y + ' ' + points.rotation.z );
*/
		//		console.warn(points);
		guiSelectPoint.setMesh();

	}
	group.add( points );
//	setTimeout( function () { setPointsParams(); }, 100 ); 

//	var boSetPointsParams = false;
	var pointSize = points.userData.shaderMaterial.point.size, defaultSize = pointSize;
	this.animate = function(){

		if( pointSize === points.userData.shaderMaterial.point.size )
			return false;
		pointSize = points.userData.shaderMaterial.point.size;
//		console.warn( 'pointSize = ' + pointSize );
		return true;
/*
		if( boSetPointsParams )
			return;
//		setPointsParams();
		boSetPointsParams = true;
*/		

	}

	/**
	* @callback FolderPoint
	* @param {object} folder parent folder
	* @param {function} setSettings save points setting to the cookie
	*/

	/**
	 * Adds FrustumPoints folder into dat.GUI.
	 * See https://github.com/dataarts/dat.gui/blob/master/API.md about dat.GUI API.
	 * @param {any} folder parent folder
	 * @param {any} getLanguageCode returns the "primary language" subtag of the version of the browser. Default returns "en" is English
	 * @param {FolderPoint} FolderPoint creates the folder of the point's settings
	 * @param {string} pointName cookie name
	 */
	this.gui = function ( folder, getLanguageCode, FolderPoint, pointName ) {

		//Localization

		var lang = {

			frustumPoints: 'Frustum Points',
			frustumPointsTitle: 'A cloud of the fixed points in front of the camera for describe the properties of space.',

		};

		var languageCode = getLanguageCode === undefined ? 'en'//Default language is English
			: getLanguageCode();
		switch ( languageCode ) {

			case 'ru'://Russian language

				lang.frustumPoints = 'Неподвижные точки';
				lang.frustumPointsTitle = 'Облако точек перед камерой для описания свойств пространства';

				break;
			default://Custom language
				if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
					break;

				Object.keys( options.lang ).forEach( function ( key ) {

					if ( lang[key] === undefined )
						return;
					lang[key] = options.lang[key];

				} );

		}

		var fFrustumPoints = folder.addFolder( lang.frustumPoints );
		dat.folderNameAndTitle( fFrustumPoints, lang.frustumPoints, lang.frustumPointsTitle );

		cookie.getObject( pointName,  points.userData.shaderMaterial.point,  points.userData.shaderMaterial.point );
		
		var folderPoint = new FolderPoint( fFrustumPoints, points.userData.shaderMaterial.point, defaultSize, function( value ) {

			if ( value === undefined )
				value = options.point.size;
			if ( value < 0 )
				value = 0;
			points.userData.shaderMaterial.point.size = value;
//			points.needsUpdate = true;
			folderPoint.size.setValue( value );
			cookie.setObject( pointName, points.userData.shaderMaterial.point );
//			setPointsParams();

		}, { settings: { offset: 0.001 }, min: 0.001, max: 0.01, step: 0.0001 } );

	}

}
var FrustumPoints = {

	create: create,

}

export default FrustumPoints;

