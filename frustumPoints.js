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

function create( camera, controls, guiSelectPoint, renderer, group, options ) {

	var cameraPerspectiveHelper = new CameraHelper( camera );
//	group.add( cameraPerspectiveHelper );
//	var layer = - ( camera.far - camera.near ) / 2;
	var zeroPoint = new Vector3();
	var cameraDistanceDefault = camera.position.distanceTo( zeroPoint );
	controls.addEventListener( 'change', function ( o ) {

		//setPointsParams();

	} );

	var array = [],
		color = new Color( "rgb(255, 255, 255)" );
/*
	//near
	//array.push ( { vector: new Vector3().set( -1, -1, -1 ).unproject( camera ), name: 'near' } );

	//far
	array.push ( { vector: new Vector3().set( -1, -1, 1 ).unproject( camera ), name: 'far' } );
	//array.push ( new Vector3().set( -1, -1, 1 ).unproject( camera ) );
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
			shaderMaterial: true,
			position: camera.position,
			scale: camera.scale,
			rotation: camera.rotation,

		}
	);
	function setPointsParams() {

		points.position.copy( camera.position );
		points.position.divide( new Vector3( camera.far, camera.far, camera.far ) );
		var scale = camera.position.distanceTo( zeroPoint ) / cameraDistanceDefault;
		points.scale.x = scale;
		points.scale.y = scale;
		points.scale.z = scale;
		points.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.z );
		/*		
				points.rotation.copy( camera.rotation );
		*/
		points.needsUpdate = true;
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

	var boSetPointsParams = false;
	this.animate = function(){

		if( boSetPointsParams )
			return;
		setPointsParams();
		boSetPointsParams = true;

	}

}
var FrustumPoints = {

	create: create,

}

export default FrustumPoints;

