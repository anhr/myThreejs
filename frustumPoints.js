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

} from '../../three.js/dev/build/three.module.js';
import myThreejs from './myThreejs.js';
import cookie from '../../cookieNodeJS/master/cookie.js';

/**
* @callback onChangeControls
* @param {myThreejs.Points} points
*/

/**
 * Create FrustumPoints
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.OrbitControls} controls
 * @param {object} [guiSelectPoint] gui select point conrtollers. See function guiSelectPoint() for details
 * @param {THREE.Group} group group of objects to which a new FrustumPoints will be added
 * @param {string} cookieName cookie name
 * @param {object} options see myThreejs.create options for details
 * @param {onChangeControls} onChangeControls user has orbit controls. Default is undefined
 */
function create( camera, controls, guiSelectPoint, group, cookieName, options, onChangeControls ) {

	var cameraPerspectiveHelper = new CameraHelper( camera );
	//group.add( cameraPerspectiveHelper );
	var zeroPoint = new Vector3();
	var cameraDistanceDefault = camera.position.distanceTo( zeroPoint );
	controls.addEventListener( 'change', function ( o ) {

		setPointsParams();
		if( onChangeControls !== undefined )
			onChangeControls( points );

	} );

	var array = [],
		color = new Color( "rgb(255, 255, 255)" );//white

	function addPoint( point, pointName ) { array.push( { vector: [point.x, point.y, point.z, color], name: pointName } ); }
	function getPoint( pointName ) {

		var points = cameraPerspectiveHelper.pointMap[pointName],
			position = cameraPerspectiveHelper.geometry.attributes.position;
		return new Vector3().fromArray( position.array, points[0] * position.itemSize )

	}

	//var pointName;//, frustumName;

	//near точки ближней к камере полскости усеченной пирамиды
	var point_n1 = getPoint( 'n1' ),
		point_n2 = getPoint( 'n2' ),
		point_n3 = getPoint( 'n3' );

	//far точки основания пирамиды

	var point_f1 = getPoint( 'f1' ),
		point_f2 = getPoint( 'f2' ),
		point_f3 = getPoint( 'f3' );

	var pointStart = new Vector3().copy( point_n1 );

	function sqrtInt ( value ) {

		var a = parseInt(Math.sqrt( zCount - 1 ));
		return parseInt( value / a ) * a;
		/*
		value = parseInt( value / Math.sqrtInt( zCount - 1 )  );
		return value * ( zCount - 1 );
		*/

	}
	var zCount = 12,
		//zCountSqrt = sqrtInt ( zCount ),
		zStep = ( point_f1.z - point_n1.z ) / ( ( zCount - 1 ) * ( zCount - 1 ) ),

		//смещение по оси x
		zx = 0,
		zSqrtInt = 0,
		zxCount;//На столько частей надо поделить xStep что бы получить xzStep шаг смешения по оси x
	for ( zxCount = 0; zxCount < zCount; zxCount++ ) {

		if ( zSqrtInt !== sqrtInt( zxCount ) )
			break;

	}
	for ( var z = 0; z < zCount; z++ ) {

		var yCount = 10,
			ynStep = ( point_n3.y - point_n1.y ) / ( yCount - 1 ),
			yfStep = ( point_f3.y - point_f1.y ) / ( yCount - 1 ),
			yStep = ( ( yfStep - ynStep ) / ( ( zCount -1 ) * ( zCount -1 ) ) ) * z * z + ynStep,
			yzStep = yStep / ( zCount + 1 ),//координату точки надо мемного сдвинуть в зависимости от z что бы точки не накладывались друг на друга

			xCount = yCount * parseInt( camera.aspect ),
			xnStep = ( point_n2.x - point_n1.x ) / ( xCount - 1 ),
			xfStep = ( point_f2.x - point_f1.x ) / ( xCount - 1 ),
			xStep = ( ( xfStep - xnStep ) / ( ( zCount -1 ) * ( zCount -1 ) ) ) * z * z + xnStep,
			xzStep = xStep / zxCount;//координату точки надо мемного сдвинуть в зависимости от z что бы точки не накладывались друг на друга
		pointStart.y = - yStep * ( yCount - 1 ) / 2;
		pointStart.x = - xStep * ( xCount - 1 ) / 2;

//		if ( zx > 3 ) zx = 0;
		if( zSqrtInt !== sqrtInt( z ) ) {

			zx = 0;
			zSqrtInt = sqrtInt( z );

		}
		
		for ( var y = 0; y < yCount; y++ ) {

			for ( var x = 0; x < xCount; x++ )
				addPoint( new Vector3(

					pointStart.x + xStep * x + xzStep * zx,
					pointStart.y + yStep * y + yzStep * sqrtInt( z ),
					pointStart.z + zStep * z * z

				), 'x=' + x + ' y=' + y + ' z=' + z );

		}
		zx++;

	}

	var shaderMaterial = { point: { size: 0.001, } };
	cookie.getObject( cookieName, shaderMaterial.point, shaderMaterial.point );

	var points = myThreejs.Points( array, options, {

			name: 'frustum points',
			shaderMaterial: shaderMaterial,
			position: camera.position,
			scale: camera.scale,
			rotation: camera.rotation,

		}
	);
	points.userData.boFrustumPoints = true;
	function setPointsParams() {

		points.position.copy( camera.position );
		points.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.z );
		var scale = camera.position.distanceTo( zeroPoint ) / cameraDistanceDefault;
		points.scale.x = scale;
		points.scale.y = scale;
		points.scale.z = scale;
/*		
console.warn( 'points.position: ' + points.position.x + ' ' + points.position.y + ' ' + points.position.z +
' points.scale: ' + points.scale.x + ' ' + points.scale.y + ' ' + points.scale.z +
' points.rotation: ' + points.rotation.x + ' ' + points.rotation.y + ' ' + points.rotation.z );
*/
		guiSelectPoint.setMesh();

	}
	group.add( points );

	var pointSize = points.userData.shaderMaterial.point.size, defaultSize = pointSize;
	this.animate = function(){

		if( pointSize === points.userData.shaderMaterial.point.size )
			return false;
		pointSize = points.userData.shaderMaterial.point.size;
		return true;

	}

	/**
	* @callback FolderPoint
	* @param {object} folder parent folder
	* @param {function} setSettings save points setting to the cookie
	*/

	/**
	 * Adds FrustumPoints folder into dat.GUI.
	 * See https://github.com/dataarts/dat.gui/blob/master/API.md about dat.GUI API.
	 * @param {object} folder parent folder
	 * @param {object} getLanguageCode returns the "primary language" subtag of the version of the browser. Default returns "en" is English
	 * @param {FolderPoint} FolderPoint creates the folder of the point's settings
	 */
	this.gui = function ( folder, getLanguageCode, FolderPoint ) {

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
		
		var folderPoint = new FolderPoint( fFrustumPoints, points.userData.shaderMaterial.point, defaultSize, function( value ) {

			if ( value === undefined )
				value = points.userData.shaderMaterial.point.size;
			if ( value < 0 )
				value = 0;
			points.userData.shaderMaterial.point.size = value;
			folderPoint.size.setValue( value );
			cookie.setObject( cookieName, points.userData.shaderMaterial.point );

		}, { settings: { offset: 0.001 }, min: 0.001, max: 0.01, step: 0.0001 } );

	}

}
var FrustumPoints = {

	create: create,

}

export default FrustumPoints;

