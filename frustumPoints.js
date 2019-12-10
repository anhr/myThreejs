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
import clearThree from '../../commonNodeJS/master/clearThree.js';

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

	var points, zeroPoint = new Vector3(), cameraDistanceDefault = camera.position.distanceTo( zeroPoint ), _this = this;
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
	function removePoints() {

		if ( points === undefined )
			return;
		clearThree( points );
		group.remove( points );

	}

	var shaderMaterialDefault = {

		point: { size: 0.001, },
		display: true,
		zCount: 5,
		yCount: 3,

	}, shaderMaterial = {};
	Object.freeze( shaderMaterialDefault );
	cookie.getObject( cookieName, shaderMaterial, shaderMaterialDefault );
//	function saveSettings() { cookie.setObject( cookieName, points.userData.shaderMaterial ); }
	function saveSettings() { cookie.setObject( cookieName, shaderMaterial ); }

	function update() {

		var cameraPerspectiveHelper = new CameraHelper( camera );
		//group.add( cameraPerspectiveHelper );
		controls.addEventListener( 'change', function ( o ) {

			setPointsParams();
			if ( onChangeControls !== undefined )
				onChangeControls( points );

		} );

		var array = [];
		var color = new Color( "rgb(255, 255, 255)" );//white

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

		function sqrtInt( value ) {

			var a = parseInt( Math.sqrt( zCount - 1 ) );
			return parseInt( value / a ) * a;
			/*
			value = parseInt( value / Math.sqrtInt( zCount - 1 )  );
			return value * ( zCount - 1 );
			*/

		}
		var zCount = shaderMaterial.zCount,
			zStep = ( point_f1.z - point_n1.z ) / ( ( zCount - 1 ) * ( zCount - 1 ) ),

			//смещение по оси x
			zx = 0,
			zSqrtInt = 0,
			zxCount;//На столько частей надо поделить xStep что бы получить xzStep шаг смешения по оси x
		for ( zxCount = 0; zxCount < zCount; zxCount++ ) {

			if ( zSqrtInt !== sqrtInt( zxCount ) )
				break;

		}
		
		var yCount = shaderMaterial.yCount;

		//You can see the Chrome memory crash if you has set very big shaderMaterial.zCount or  shaderMaterial.yCount. (about 900000).
		//Unfortunately you cannot to catch memory crash. https://stackoverflow.com/questions/44531357/how-to-catch-and-handle-chrome-memory-crash
		//Instead I temporary set shaderMaterial.zCount to default value and restore it after creating of all z levels.
		//Now you can see default shaderMaterial.zCount after memory crash and reloading of the wab page.
		shaderMaterial.zCount = shaderMaterialDefault.zCount;
		shaderMaterial.yCount = shaderMaterialDefault.yCount;
		saveSettings();

		for ( var z = 0; z < zCount; z++ ) {

			var ynStep = ( point_n3.y - point_n1.y ) / ( yCount - 1 ),
				yfStep = ( point_f3.y - point_f1.y ) / ( yCount - 1 ),
				yStep = ( ( yfStep - ynStep ) / ( ( zCount - 1 ) * ( zCount - 1 ) ) ) * z * z + ynStep,
				yzStep = yStep / ( zCount + 1 ),//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга

				xCount = yCount * parseInt( camera.aspect ),
				xnStep = ( point_n2.x - point_n1.x ) / ( xCount - 1 ),
				xfStep = ( point_f2.x - point_f1.x ) / ( xCount - 1 ),
				xStep = ( ( xfStep - xnStep ) / ( ( zCount - 1 ) * ( zCount - 1 ) ) ) * z * z + xnStep,
				xzStep = xStep / zxCount;//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга
			pointStart.y = - yStep * ( yCount - 1 ) / 2;
			pointStart.x = - xStep * ( xCount - 1 ) / 2;

			if ( zSqrtInt !== sqrtInt( z ) ) {

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
		//For Chrome memory crash see above.
		shaderMaterial.zCount = zCount;
		shaderMaterial.yCount = yCount;
		saveSettings();

		removePoints();

		points = myThreejs.Points( array, options, {

			name: 'frustum points',
			shaderMaterial: shaderMaterial,
			position: camera.position,
			scale: camera.scale,
			rotation: camera.rotation,

		}
		);
		points.userData.boFrustumPoints = true;
		group.add( points );

	}
	update();

	if ( !shaderMaterial.display )
		removePoints();

	var pointSize = points.userData.shaderMaterial.point.size, defaultSize = pointSize;
	this.animate = function(){

		if( pointSize === points.userData.shaderMaterial.point.size )
			return false;
		pointSize = points.userData.shaderMaterial.point.size;
		return true;

	}
	this.update = function () {

		update();

		//Эта команда нужна в случае изменения размера окна браузера когда canvas на весь экран
		setPointsParams();
		pointSize = 0;//update point's size

	}
	var raycaster;
	this.setRaycaster = function ( _raycaster ) { raycaster = _raycaster; }

	/**
	* @callback FolderPoint
	* @param {object} folder parent folder
	* @param {function} setSettings save points setting to the cookie
	*/

	/**
	 * Adds FrustumPoints folder into dat.GUI.
	 * See https://github.com/dataarts/dat.gui/blob/master/API.md about dat.GUI API.
	 * @param {object} folder parent folder
	 * @param {function} getLanguageCode returns the "primary language" subtag of the version of the browser. Default returns "en" is English
	 * @param {FolderPoint} FolderPoint creates the folder of the point's settings
	 */
	this.gui = function ( folder, getLanguageCode, FolderPoint ) {

		//Localization

		var lang = {

			frustumPoints: 'Frustum Points',
			frustumPointsTitle: 'A cloud of the fixed points in front of the camera for describe the properties of space.',

			displayScales: 'Display',
			displayScalesTitle: 'Display or hide Frustum Points.',

			defaultButton: 'Default',
			defaultTitle: 'Restore default Frustum Points settings.',

			zCount: 'Z Count',
			zCountTitle: "The count of layers of the  frustum of the camera's field of view.",

			yCount: 'Y Count',
			yCountTitle: "The count of vertical points for each z level of the  frustum of the camera's field of view.",

		}; 

		var languageCode = getLanguageCode === undefined ? 'en'//Default language is English
			: getLanguageCode();
		switch ( languageCode ) {

			case 'ru'://Russian language

				lang.frustumPoints = 'Неподвижные точки';
				lang.frustumPointsTitle = 'Облако точек перед камерой для описания свойств пространства';

				lang.display = 'Показать';
				lang.displayTitle = 'Показать или скрыть неподвижные точки.';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить настройки неподвижных точек.';

				lang.zCount = 'Z cлои';
				lang.zCountTitle = 'Количество слоев усеченной пирамиды, образующей поле зрения камеры';

				lang.yCount = 'Y точки';
				lang.yCountTitle = "Количество вертикальных точек в каждом слое усеченной пирамиды, образующей поле зрения камеры.";

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

		function displayControllers( value ) {

			var display = value ? 'block' : 'none';
			folderPoint.display( display );
			cZCount.__li.style.display = display;
			cYCount.__li.style.display = display;

		}
		var cDisplay = fFrustumPoints.add( points.userData.shaderMaterial, 'display' ).onChange( function ( value ) {

			if ( shaderMaterial.display ) {

				_this.update();
				raycaster.stereo.addParticle( points );
				displayControllers( true );

			} else {

				raycaster.stereo.removeParticle( points );
				removePoints();
				displayControllers( false );

			}
			saveSettings();

		} );
		dat.controllerNameAndTitle( cDisplay, lang.display, lang.displayTitle );
		
		var folderPoint = new FolderPoint( fFrustumPoints, points.userData.shaderMaterial.point, defaultSize, function( value ) {

			if ( value === undefined )
				value = points.userData.shaderMaterial.point.size;
			if ( value < 0 )
				value = 0;
			points.userData.shaderMaterial.point.size = value;
			folderPoint.size.setValue( value );
			saveSettings();

		}, { settings: { offset: 0.001 }, min: 0.001, max: 0.01, step: 0.0001 } );

		function setCount() {

			raycaster.stereo.removeParticle( points );
			_this.update();
			raycaster.stereo.addParticle( points );
			saveSettings();

		}

		//zCount
		var cZCount = fFrustumPoints.add( points.userData.shaderMaterial, 'zCount' ).min( 3 ).step( 1 ).onChange( function ( value ) {

			setCount();
			
		} );
		dat.controllerNameAndTitle( cZCount, lang.zCount, lang.zCountTitle );

		//yCount
		var cYCount = fFrustumPoints.add( shaderMaterial, 'yCount' ).min( 3 ).step( 1 ).onChange( function ( value ) {

			setCount();

		} );
		dat.controllerNameAndTitle( cYCount, lang.yCount, lang.yCountTitle );

		//Default button
		dat.controllerNameAndTitle( fFrustumPoints.add( {

			defaultF: function ( value ) {

//				points.userData.shaderMaterial = JSON.parse( JSON.stringify( shaderMaterialDefault ) );
				cDisplay.setValue( shaderMaterialDefault.display );
				folderPoint.size.setValue( shaderMaterialDefault.point.size );
				cZCount.setValue( shaderMaterialDefault.zCount );
				cYCount.setValue( shaderMaterialDefault.yCount );
//				_this.update();
				saveSettings();

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
		displayControllers( points.userData.shaderMaterial.display );

	}

}
var FrustumPoints = {

	create: create,

}

export default FrustumPoints;

