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

//	Color,
	Vector3,
	CameraHelper,
	Group,
	BufferGeometry,
	BufferAttribute,

	//lines
	LineBasicMaterial,
	Geometry,
	Line,

} from '../../three.js/dev/build/three.module.js';
import myThreejs from './myThreejs.js';
import cookie from '../../cookieNodeJS/master/cookie.js';
import clearThree from '../../commonNodeJS/master/clearThree.js';
import { spatialMultiplexsIndexs } from '../../three.js/dev/examples/jsm/effects/StereoEffect.js';

//memory limit
//import roughSizeOfObject from '../../commonNodeJS/master/SizeOfObject.js';

var debug = {

	notHiddingFrustumPoints: true, //Точки не скрываются когда пересчитываются их координаты когда пользователь поворачивает сцену
	notMoveFrustumPoints: true,//Точки двигаются относительно камеры вместе с остальными 3D объектами когда пользователь поворачивает сцену
	//linesiInMono: true,//Возможность показать линии в отсутсвии стерео режима

};

/**
 * Create FrustumPoints
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.OrbitControls} controls
 * @param {object} [guiSelectPoint] gui select point conrtollers. See function guiSelectPoint() for details
 * @param {THREE.Group} group group of objects to which a new FrustumPoints will be added
 * @param {string} cookieName cookie name
 * @param {number} spatialMultiplex stereo effect mode. See spatialMultiplexsIndexs in the StereoEffect.js file for details
 * @param {object} options see myThreejs.create options for details
 * @param {object} [shaderMaterialDefault] points and lines options. Default is {}
 * @param {object} [shaderMaterialDefault.point] points options. Default is {}
 * @param {number} [shaderMaterialDefault.point.size] Size of each frustum point. Default is 0;//0.01
 * @param {boolean} [shaderMaterialDefault.display] true - display frustum points. Default is true
 * @param {boolean} [shaderMaterialDefault.info] true - display information about frustum point if user move mouse over or click this point. Default is false
 *
 * @param {object} [shaderMaterialDefault.stereo] stereo mode options
 * @param {boolean} [shaderMaterialDefault.stereo.lines] Display or hide lines between Frustum Points for more comfortable visualisation in the stereo mode. Default is true
 * @param {number} [shaderMaterialDefault.stereo.hide] Hide the nearby to the camera points in percentage to all points for more comfortable visualisation. Default is 0
 * @param {number} [shaderMaterialDefault.stereo.opacity] Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque. Default is 0.3
 *
 * @param {number} [shaderMaterialDefault.zCount] The count of layers of the frustum of the camera's field of view. Default is 50
 * @param {number} [shaderMaterialDefault.yCount] The count of vertical points for each z level of the  frustum of the camera's field of view.. Default is 30
 *
 * @param {number} [shaderMaterialDefault.near] Shift of the frustum layer near to the camera in percents.
 * 0 percents - no shift.
 * 100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды.
 * Default is 0
 * @param {number} [shaderMaterialDefault.far] Shift of the frustum layer far to the camera in percents.
 * 0 percents - no shift.
 * 100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды.
 * Default is 0
 * @param {number} [shaderMaterialDefault.base] Scale of the base of the frustum points in percents.
 * 0 base is null
 * 100 no scale
 * Default is 100
 * @param {boolean} [shaderMaterialDefault.square] true - Square base of the frustum points. Default is false
 */
function create( camera, controls, guiSelectPoint, group, cookieName, spatialMultiplex, renderer, options, shaderMaterialDefault, cFrustumPoints ) {

	shaderMaterialDefault = shaderMaterialDefault || {};
	shaderMaterialDefault.point = shaderMaterialDefault.point || {};
	shaderMaterialDefault.point.size = shaderMaterialDefault.point.size || 0;//0.01;//Size of each frustum point

	shaderMaterialDefault.display = shaderMaterialDefault.display === undefined ? true : shaderMaterialDefault.display;//true - display frustum points
	shaderMaterialDefault.info = shaderMaterialDefault.info !== undefined ? shaderMaterialDefault.info : false;//true - display information about frustum point if user move mouse over or click this point.

	//Stereo
	shaderMaterialDefault.stereo = shaderMaterialDefault.stereo || {};
	shaderMaterialDefault.stereo.lines = shaderMaterialDefault.stereo.lines === undefined ? true : shaderMaterialDefault.stereo.lines;//Display or hide lines between Frustum Points for more comfortable visualisation in the stereo mode.
	shaderMaterialDefault.stereo.hide = shaderMaterialDefault.stereo.hide || 0;//Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.
	shaderMaterialDefault.stereo.opacity = shaderMaterialDefault.stereo.opacity || 0.3;//Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.'
	
	shaderMaterialDefault.zCount = shaderMaterialDefault.zCount || 50;//The count of layers of the frustum of the camera's field of view.
	shaderMaterialDefault.yCount = shaderMaterialDefault.yCount || 30;//The count of vertical points for each z level of the  frustum of the camera's field of view.

	//изменение размеров усеченной пирамиды FrustumPoints

	shaderMaterialDefault.near = shaderMaterialDefault.near || 0;//Shift of the frustum layer near to the camera in percents.
	//0 percents - no shift.
	//100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды
	shaderMaterialDefault.far = shaderMaterialDefault.far || 0;//Shift of the frustum layer far to the camera in percents.
	//0 percents - no shift.
	//100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды
	shaderMaterialDefault.base = shaderMaterialDefault.base || 100;//Scale of the base of the frustum points in percents.
	//0 base is null
	//100 no scale
	shaderMaterialDefault.square = shaderMaterialDefault.square !== undefined ? shaderMaterialDefault.square : false; //true - Square base of the frustum points.
	var shaderMaterial = {};
	Object.freeze( shaderMaterialDefault );
	cookie.getObject( cookieName, shaderMaterial, shaderMaterialDefault );
	function saveSettings() { cookie.setObject( cookieName, shaderMaterial ); }

	var points, zeroPoint = new Vector3(), cameraDistanceDefault = camera.position.distanceTo( zeroPoint ), _this = this,
		lines = [], groupFrustumPoints = new Group(), names;
	group.add( groupFrustumPoints );

	function setPointsParams() {

		function set( points ) {

			if ( points === undefined )
				return;
			points.position.copy( camera.position );
			points.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.z );
			var scale = camera.position.distanceTo( zeroPoint ) / cameraDistanceDefault;
			points.scale.x = scale;
			points.scale.y = scale;
			points.scale.z = scale;

		}
		set( points );
		lines.forEach( function ( item ) { set( item ); } );
		/*
		console.warn( 'points.position: ' + points.position.x + ' ' + points.position.y + ' ' + points.position.z +
		' points.scale: ' + points.scale.x + ' ' + points.scale.y + ' ' + points.scale.z +
		' points.rotation: ' + points.rotation.x + ' ' + points.rotation.y + ' ' + points.rotation.z );
		*/
		guiSelectPoint.setMesh();

	}
	function removePoints( notRemoveMesh ) {

		lines.forEach( function ( item ) {

			clearThree( item );
			if ( groupFrustumPoints.children.indexOf( item ) === -1 )
				console.error( 'FrustumPoints.Create.removePoints() failed! Line is not in the group.' )
			groupFrustumPoints.remove( item );

		} );
		lines.length = 0;

		if ( points === undefined )
			return;
		if( !notRemoveMesh )
			guiSelectPoint.removeMesh( points );//не удаляю frustumPoints из сиска Meshs потому что сюда попадает только если пользователь изменил число точек frustumPoints.
		//В этом случае создается новый frustumPoints, который надо присоеденить к старому frustumPoints из списка Meshs.
		//Если я удалю frustumPoints из сиска Meshs а потом добавлю туда новый frustumPoints,
		//то изменится индекс frustumPoints в списке Meshs
		//и тогда неверно будет выполняться function update() в frustumPoints и как результат буде неверный список Ponts списке Meshs
		//for testing
		//Select in the canvas any point, but not frustum point.
		//Now you can see your selected point in the in the Meshs/Points/Select list in the gui.
		//Change Settings/Frustum Points/Z count in the gui.
		//Now your selected point is deselected.
		//Select in the canvas your point again.
		//Now yiou can see "Cannot read property 'selected' of undefined" error message in the console.
		//Try to select your point in the gui. You can not to do it because your point is not exists in the Meshs/Points/Select list. Instead you see all Frustum Points in the Meshs/Points/Select list.

		group.remove( points );
		renderer.renderLists.dispose();
		clearThree( points );
		points = undefined;

	}
	function isLines() {

		return shaderMaterial.stereo.lines
			&& ( debug.linesiInMono || ( spatialMultiplex !== spatialMultiplexsIndexs.Mono ) );

	}
	//mouse cursor
	var cursor = {};
	function update( onReady ) {

		cursor.requestId = window.requestAnimationFrame( function () {

			//start
			renderer.domElement.style.cursor = 'progress';
			renderer.cursor = renderer.domElement.style.cursor;//эта строка нужна что бы новый курсор оставался при движении мыши
			cursor.requestId = window.requestAnimationFrame( function () {

				//progress1
				//две фазы прогресса progress1 и progress2 нужно что бы указатель мыши переключился на progress
				//сразу после того как пользователь отпустил кнопку мыши
				//Иначе после отпускания кнопки мыши на экране ничего не происходит в течении некоторого времени
				//Не знаю почему это надо
				cursor.requestId = window.requestAnimationFrame( function () {

					//progress2
					if ( points === undefined ) {

						progress();

					} else {

						options.getСolors( 0, undefined, options.scales.w, points.geometry.attributes.position, points.geometry.attributes.ca );
						points.geometry.attributes.ca.needsUpdate = true;
						group.add( points );

					}

					//mouse cursor
					renderer.cursor = cursor.cursor;

					cursor.requestId = window.requestAnimationFrame( function () {

						//ready
						renderer.domElement.style.cursor = '';//cursor.cursor;
						window.cancelAnimationFrame( cursor.requestId );
						cursor.requestId = undefined;
						if ( onReady !== undefined )
							onReady();

					} );

				} );

			} );

		} );

	}
	function progress() {

		if ( !shaderMaterial.display )
			return;

		var cameraPerspectiveHelper = new CameraHelper( camera ), timeoutControls;
		controls.addEventListener( 'change', function ( o ) {

			if ( !debug.notHiddingFrustumPoints ) {

				//Updating of the canvas is too slow if FrustumPoints count is very big (about 'Z Count' = 50 and 'Y Count' = 30).
				//I am hidding all points during  changing of the contdrol and show it again after 500 msec for resolving of the problem.
				if ( timeoutControls === undefined ) {

					group.remove( points );
					group.remove( groupFrustumPoints );
					raycaster.stereo.removeParticle( points );

				}
				clearTimeout( timeoutControls );
				timeoutControls = setTimeout( function () {

//					group.add( points );если тут добавлять в группу то сначала будут видны старые точки.
					group.add( groupFrustumPoints );
					if ( shaderMaterial.info )
						raycaster.stereo.addParticle( points );

					clearTimeout( timeoutControls );
					timeoutControls = undefined;

					if ( !debug.notMoveFrustumPoints ) {

						_this.update();

					}

				}, 500 );

			}

		} );

		var array, indexArray = 0;//, names;// = [];

		function getPoint( pointName ) {

			var points = cameraPerspectiveHelper.pointMap[pointName],
				position = cameraPerspectiveHelper.geometry.attributes.position;
			return new Vector3().fromArray( position.array, points[0] * position.itemSize )

		}

		//near точки ближней к камере плоскости усеченной пирамиды
		var point_n1 = getPoint( 'n1' ),
			point_n2 = getPoint( 'n2' ),
			point_n3 = getPoint( 'n3' );

		//far точки основания пирамиды

		var point_f1 = getPoint( 'f1' ),
			point_f2 = getPoint( 'f2' ),
			point_f3 = getPoint( 'f3' );

		//изменение размеров усеченной пирамиды FrustumPoints

		//Scale of the base of the frustum points.
		point_n1.x = ( point_n1.x * shaderMaterial.base ) / 100;
		point_n2.x = ( point_n2.x * shaderMaterial.base ) / 100;
		point_n3.x = ( point_n3.x * shaderMaterial.base ) / 100;
		point_n1.y = ( point_n1.y * shaderMaterial.base ) / 100;
		point_n2.y = ( point_n2.y * shaderMaterial.base ) / 100;
		point_n3.y = ( point_n3.y * shaderMaterial.base ) / 100;
		point_f1.x = ( point_f1.x * shaderMaterial.base ) / 100;
		point_f2.x = ( point_f2.x * shaderMaterial.base ) / 100;
		point_f3.x = ( point_f3.x * shaderMaterial.base ) / 100;
		point_f1.y = ( point_f1.y * shaderMaterial.base ) / 100;
		point_f2.y = ( point_f2.y * shaderMaterial.base ) / 100;
		point_f3.y = ( point_f3.y * shaderMaterial.base ) / 100;

		//Square base of the frustum points.
		if ( shaderMaterial.square ) {

			point_n1.x /= camera.aspect;
			point_n2.x /= camera.aspect;
			point_n3.x /= camera.aspect;
			point_f1.x /= camera.aspect;
			point_f2.x /= camera.aspect;
			point_f3.x /= camera.aspect;

		}

		var pointn1x = point_n1.x, pointn2x = point_n2.x, pointn3x = point_n3.x,
			pointn1y = point_n1.y, pointn2y = point_n2.y, pointn3y = point_n3.y,
			pointn1z = point_n1.z;
		//Shift of the frustum layer near to the camera
		point_n1.x = point_n1.x + ( ( point_f1.x - point_n1.x ) * shaderMaterial.near ) / 100;
		point_n2.x = point_n2.x + ( ( point_f2.x - point_n2.x ) * shaderMaterial.near ) / 100;
		point_n3.x = point_n3.x + ( ( point_f3.x - point_n3.x ) * shaderMaterial.near ) / 100;
		point_n1.y = point_n1.y + ( ( point_f1.y - point_n1.y ) * shaderMaterial.near ) / 100;
		point_n2.y = point_n2.y + ( ( point_f2.y - point_n2.y ) * shaderMaterial.near ) / 100;
		point_n3.y = point_n3.y + ( ( point_f3.y - point_n3.y ) * shaderMaterial.near ) / 100;
		point_n1.z = point_n2.z = point_n3.z = point_n1.z + ( ( point_f1.z - point_n1.z ) * shaderMaterial.near ) / 100;
		//Shift of the frustum layer far to the camera
		point_f1.x = point_f1.x + ( ( pointn1x - point_f1.x ) * shaderMaterial.far ) / 100;
		point_f2.x = point_f2.x + ( ( pointn2x - point_f2.x ) * shaderMaterial.far ) / 100;
		point_f3.x = point_f3.x + ( ( pointn3x - point_f3.x ) * shaderMaterial.far ) / 100;
		point_f1.y = point_f1.y + ( ( pointn1y - point_f1.y ) * shaderMaterial.far ) / 100;
		point_f2.y = point_f2.y + ( ( pointn2y - point_f2.y ) * shaderMaterial.far ) / 100;
		point_f3.y = point_f3.y + ( ( pointn3y - point_f3.y ) * shaderMaterial.far ) / 100;
		point_f1.z = point_f2.z = point_f3.z = point_f1.z + ( ( pointn1z - point_f1.z ) * shaderMaterial.far ) / 100;

		var pointStart = new Vector3().copy( point_n1 );

		function sqrtInt( value ) {

			var a = parseInt( Math.sqrt( zCount - 1 ) );
			if ( isLines() )
				return value / a;
			return parseInt( value / a ) * a;

		}
		var zCount = shaderMaterial.zCount,
			zStep = ( point_f1.z - point_n1.z ) / ( ( zCount - 1 ) * ( zCount - 1 ) ),

			//смещение по оси x
			zx = 0;
/*
			zxCount = zCount;//На столько частей надо поделить xStep что бы получить xzStep шаг смешения по оси x
			zSqrtInt = 0,
		if ( !isLines() )
			for ( zxCount = 0; zxCount < zCount; zxCount++ ) {

				if ( zSqrtInt !== sqrtInt( zxCount ) )
					break;

			}
*/		
		var yCount = shaderMaterial.yCount,
			xCount = yCount * ( shaderMaterial.square ? 1 : parseInt( camera.aspect ) ),
			zy = 0;//смещение по оси y

		//You can see the Chrome memory crash if you has set very big shaderMaterial.zCount or  shaderMaterial.yCount. (about 900000).
		//Unfortunately you cannot to catch memory crash. https://stackoverflow.com/questions/44531357/how-to-catch-and-handle-chrome-memory-crash
		//Instead I temporary set shaderMaterial.zCount to default value and restore it after creating of all z levels.
		//Now you can see default shaderMaterial.zCount after memory crash and reloading of the wab page.
		shaderMaterial.zCount = shaderMaterialDefault.zCount;
		shaderMaterial.yCount = shaderMaterialDefault.yCount;
		saveSettings();

		var zStart = parseInt( ( zCount * shaderMaterial.stereo.hide ) / 100 ),
			zEnd = zStart + zCount - 1;
/*
		if ( isLines() )
			zx = 0;
*/
		function Z( z ){

			//console.warn( 'z ' + z );
			var ynStep = ( point_n3.y - point_n1.y ) / ( yCount - 1 ),
				yfStep = ( point_f3.y - point_f1.y ) / ( yCount - 1 ),
				yStep = ( ( yfStep - ynStep ) / ( ( zCount - 1 ) * ( zCount - 1 ) ) ) * z * z + ynStep,
				sqrtZCount = parseInt( Math.sqrt( zCount ) ),
//				yzStep = isLines() ? ( yStep / zCount ) * parseInt( Math.sqrt( zCount ) ) : yStep / ( zCount + 1 ),//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга
//				yzStep = isLines() ? ( yStep / zCount ) * sqrtZCount : yStep / ( sqrtZCount + ( sqrtZCount * sqrtZCount > zCount ? 1 : 0 ) ),//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга
				yzStep = isLines() ? ( yStep / zCount ) * sqrtZCount : yStep / ( sqrtZCount + parseInt(Math.sqrt(zCount - ( sqrtZCount * sqrtZCount ))) ),//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга

				xnStep = ( point_n2.x - point_n1.x ) / ( xCount - 1 ),
				xfStep = ( point_f2.x - point_f1.x ) / ( xCount - 1 ),
				xStep = ( ( xfStep - xnStep ) / ( ( zCount - 1 ) * ( zCount - 1 ) ) ) * z * z + xnStep,
//				xzStep = xStep / zxCount;//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга
				xzStep = xStep / parseInt( Math.sqrt( zCount ) );//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга
			pointStart.y = - yStep * ( yCount - 1 ) / 2;
			pointStart.x = - xStep * ( xCount - 1 ) / 2;

			if ( isLines() )
				zx = z;
/*
			else if ( zSqrtInt !== sqrtInt( z ) ) {

				zx = 0;
				zSqrtInt = sqrtInt( z );

			}
*/

			for ( var y = 0; y < yCount; y++ ) {

				for ( var x = 0; x < xCount; x++ )
					if ( z >= zStart ) {

						function addPoint( point/*, pointName*/ ) {
/*
							if ( ( x === 0 ) && ( y === 0 ) )
								console.warn( 'point ' + ( indexArray / itemSize ) +
									' x ' + x + ' y ' + y + ' z ' + z +
									' zy ' + zy +
									' zx ' + zx + //' xzStep ' + xzStep + ' xStep ' + xStep
									' point.x ' + point.x + ' point.y ' + point.y + ' point.z ' + point.z
								);
*/								
							names.push(

								x === 0 ?
									y === 0 ? { y: y, z: z } : { y: y } :
									x

							);
							array[indexArray] = point.x;
							indexArray++;
							array[indexArray] = point.y;
							indexArray++;
							array[indexArray] = point.z;
							indexArray++;

						}
						addPoint( new Vector3(

							pointStart.x + xStep * x + xzStep * zx,
//							pointStart.y + yStep * y + yzStep * sqrtInt( z ),
							pointStart.y + yStep * y + yzStep * zy,
							pointStart.z + zStep * z * z

						) );//, 'x=' + x + ' y=' + y + ' z=' + z );

					}

			}
			zx++;
			if ( !isLines() && ( zx >= parseInt( Math.sqrt( zCount ) ) ) ) {

				zx = 0;
				zy++;

			}

		}
		function eachZ( zStart, zEnd ) {

			if ( zStart > zEnd )
				return;
			Z( zStart );
//			if( ( zStart + 1 ) >= zEnd )
			if( zStart >= zEnd ) {

/*
				if( ( zStart + 1 ) !== zEnd  )
					console.error( '(zStart + 1 ) = ' + (zStart + 1) + ' !== zEnd = ' + zEnd );
*/					
				return;

			}
			Z( zEnd );
			var zMid = parseInt( ( zStart + zEnd ) / 2 );
			if ( zMid === zStart )
				return;//for testing set 'Z Count' = 6
			Z( zMid );
			eachZ( zStart + 1 , zMid - 1 );
			eachZ( zMid + 1, zEnd - 1 );

		}

		//For Chrome memory crash see above.
		shaderMaterial.zCount = zCount;
		shaderMaterial.yCount = yCount;

		//если оставить эту строку то когда произойдет переполнение памяти, веб страница вечно будет не открываться
		//for testing set 'Z Count' = 100 and 'Y count' = 1000
		//saveSettings();

		//if ( group.children.indexOf( points ) !== -1 )
			removePoints( true );

		var itemSize = 3;
		_this.pointIndexes = function( pointIndex ) {

			var name = names[pointIndex], x, y, z,
				index = pointIndex;
			function getObject( ){

				index--;
				while ( ( index >= 0 ) && ( typeof names[index] !== "object" ) )
					index--;
				name = names[index];

			}
			function getZ(){

				while ( ( index >= 0 ) && ( name.z === undefined ) )
					getObject();

			}
			if ( typeof name === "object" ){

				x = 0;
				y = name.y;
				getZ();
				z = name.z;

			} else {

				x = name;
				getObject();
				y = name.y;
				getZ();
				z = name.z;

			}
//				console.warn( 'pointName( ' + pointIndex + ' ) z = ' + ( z + zStart ) + ' y = ' + y + ' x ' + x );
			return { x: x, y: y, z: z };

		}
		points = myThreejs.Points( //array
			function(){

				var geometry = new BufferGeometry(),
					geometryLength = ( zEnd - zStart + 1 ) * xCount * yCount;

				array = new Float32Array( geometryLength * itemSize );
				indexArray = 0;
				names = null;
				names = [];

				eachZ( zStart, zEnd );
				//for ( var z = zStart; z < zCount; z++ ) Z( z );

				geometry.addAttribute( 'position', new BufferAttribute( array, itemSize ) );
				return geometry;

			}, options, {

				name: 'frustum points',
				shaderMaterial: shaderMaterial,
				position: camera.position,
				scale: camera.scale,
				rotation: camera.rotation,
				opacity: true,
				pointIndexes: function ( pointIndex ) { return _this.pointIndexes( pointIndex ); },
				pointName: function( pointIndex ) {

					var indexes = _this.pointIndexes( pointIndex );
					return 'x = ' + indexes.x + ', y = ' + indexes.y + ', z = ' + ( indexes.z + zStart ) + ', i = ' + pointIndex;

				},
				controllers: function ( /*cFrustumPoints*/ ) {

//					if ( cFrustumPoints !== undefined )
						cFrustumPoints.appendChild({ xCount: xCount, yCount: yCount, zCount: zCount,  });

				}

		} );
		//array = null;
		points.userData.boFrustumPoints = true;
		points.userData.isInfo = function() { return shaderMaterial.info; }
		pointSize = undefined;
		guiSelectPoint.addMesh( points );

		if ( isLines() ) {

			for ( var x = 0; x < xCount; x++ )
				for ( var y = 0; y < yCount; y++ ) {

					var material = new LineBasicMaterial( {

						color: 0xffffff,
						opacity: shaderMaterial.stereo.opacity,
						transparent: true,

					});

					var geometry = new Geometry();
					for ( var z = zStart; z < zCount; z++ ) {

						var vector = array[x + xCount * y + xCount * yCount * ( z - zStart )];
						geometry.vertices.push( new Vector3( vector.x, vector.y, vector.z ) );

					}
					var line = new Line( geometry, material );
					line.position.copy( camera.position );
					line.scale.copy( camera.scale );
					line.rotation.copy( camera.rotation );
					groupFrustumPoints.add( line );

					lines.push( line );

				}

		}
		group.add( points );
		saveSettings();
		if ( shaderMaterial.info )
			raycaster.stereo.addParticle( points );

	}
	update();

	if ( !shaderMaterial.display )
		removePoints();

	var pointSize = points === undefined ?
		0 :
		points.userData.shaderMaterial === undefined ? shaderMaterial.point.size : points.userData.shaderMaterial.point.size,
		pointOpacity = points === undefined ?
			1.0 :
			points.userData.shaderMaterial === undefined ? shaderMaterial.point.opacity : points.userData.shaderMaterial.point.opacity;
//		defaultOpacity = pointOpacity;
	this.setSpatialMultiplexs = function( spatialMultiplexNew ) {

		spatialMultiplex = spatialMultiplexNew;

		//Не помню почему не удаляю старый points из списка cMeshs, но если так делать, то будут какие то запутанные косяки.
		//Поэтому не удаляю points из списка cMeshs а только получаю индекс points в этом списке.
		var index = guiSelectPoint.getMeshIndex( points );

		update();

		//затем заменяю указатель на старый points в списке cMeshs на новый.
		guiSelectPoint.setIndexMesh( index, points );
		
	}
	this.animate = function(){

		if (
			( points === undefined ) ||
			( points.userData.shaderMaterial === undefined ) ||
			( ( pointSize === points.userData.shaderMaterial.point.size ) &&
				( pointOpacity === points.userData.shaderMaterial.point.opacity ) )
		)
			return false;
		pointSize = points.userData.shaderMaterial.point.size;
		pointOpacity = points.userData.shaderMaterial.point.opacity;
		points.material.uniforms.opacity.value = points.userData.shaderMaterial.point.opacity;
		return true;

	}
	this.update = function ( onReady ) {

		update( onReady );

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

			display: 'Display',
			displayTitle: 'Display or hide Frustum Points.',

			info: 'Information',
			infoTitle: 'Display information about frustum point if user move mouse over or click this point.',

			stereo: 'Stereo',
			stereoTitle: 'Frustum Points setting for stereo mode of the canvas',

			displayLines: 'Display Lines',
			displayLinesTitle: 'Display or hide lines between Frustum Points for more comfortable visualisation in the stereo mode.',

			hide: 'Hide Nearby Points',
			hideTitle: 'Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.',

			opacity: 'Opacity',
			opacityTitle: 'Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.',

			near: 'Near Layer',
			nearTitle: 'Shift of the frustum layer near to the camera in percents.',

			far: 'Far Layer',
			farTitle: 'Shift of the frustum layer far to the camera in percents.',

			base: 'Scale',
			baseTitle: 'Scale of the base of the frustum points in percents.',

			square: 'Square Base',
			squareTitle: 'Square base of the frustum points.',

			defaultButton: 'Default',
			defaultTitle: 'Restore default Frustum Points settings.',

			zCount: 'Z Count',
			zCountTitle: "The count of layers of the frustum of the camera's field of view.",

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

				lang.info = 'Информация';
				lang.infoTitle = 'Отображать информацию о неподвижной точке, если пользователь наведет курсор мыши или щелкнет эту точку.';

				lang.stereo = 'Стерео';
				lang.stereoTitle = 'Настройки неподвижных точек для стерео режима холста';

				lang.displayLines = 'Показать линии';
				lang.displayLinesTitle = 'Показать или скрыть линии между неподвижными точками.';

				lang.hide = 'Близкие точки';
				lang.hideTitle = 'Скрыть близкие к камере точки в процентах ко всем точкам для более удобной визуализации.';

				lang.opacity = 'Непрозрачность';
				lang.opacityTitle = 'Число в диапазоне 0.0 - 1.0, указывающий, насколько прозрачены линии. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';

				lang.near = 'Ближний слой';
				lang.nearTitle = 'Смещение ближайшего к камере слоя точек в процентах.';

				lang.far = 'Дальний слой';
				lang.nearTitle = 'Смещение дальнего от камеры слоя точек в процентах.';

				lang.base = 'Масштаб';
				lang.baseTitle = 'Масштаб неподвижных точек в процентах.';

				lang.square = 'Квадратное основание';
				lang.squareTitle = 'Неподвиждые точки образуют пирамиду с квадратным основанием.';

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
			fStereo.domElement.style.display = display;

		}
		//Display frustumPoints
		var cDisplay = fFrustumPoints.add( shaderMaterial, 'display' ).onChange( function ( value ) {

			if ( shaderMaterial.display ) {

				update();
				displayControllers( true );

			} else {

				raycaster.stereo.removeParticle( points );
				removePoints();
				displayControllers( false );

			}
			saveSettings();

		} );
		dat.controllerNameAndTitle( cDisplay, lang.display, lang.displayTitle );

		//FrustumPoints info.
		//Display information about frustum point if user move mouse over or click this point.
		var cInfo = fFrustumPoints.add( shaderMaterial, 'info' ).onChange( function ( value ) {

			if ( shaderMaterial.info )
				raycaster.stereo.addParticle( points );
			else {

				guiSelectPoint.selectPoint( -1 );
				raycaster.stereo.removeParticle( points );

			}
			saveSettings();

		} );
		dat.controllerNameAndTitle( cInfo, lang.info, lang.infoTitle );

		/////////////////////////////////
		//Stereo

		var fStereo = fFrustumPoints.addFolder( lang.stereo );
		dat.folderNameAndTitle( fStereo, lang.stereo, lang.stereoTitle );

		//Display lines
		var cDisplayLines = fStereo.add( shaderMaterial.stereo, 'lines' ).onChange( function ( value ) { update(); } );
		dat.controllerNameAndTitle( cDisplayLines, lang.displayLines, lang.displayLinesTitle );

		//Hide Nearby Points
		var cHide = fStereo.add( shaderMaterial.stereo, 'hide', 0, 50, 1 ).onChange( function ( value ) { update(); } )
		dat.controllerNameAndTitle( cHide, lang.hide, lang.hideTitle );

		var cOpacity = fStereo.add( shaderMaterial.stereo, 'opacity', 0.0, 1.0, 0.01 ).onChange( function ( value ) { update(); } );
		dat.controllerNameAndTitle( cOpacity, lang.opacity, lang.opacityTitle );

		//Stereo
		/////////////////////////////////

		//Shift of the frustum layer near to the camera in percents
		var cNear = fFrustumPoints.add( shaderMaterial, 'near', 0, 100, 1 ).onChange( function ( value ) { update(); } );
		dat.controllerNameAndTitle( cNear, lang.near, lang.nearTitle );

		//Shift of the frustum layer far to the camera in percents
		var cFar = fFrustumPoints.add( shaderMaterial, 'far', 0, 100, 1 ).onChange( function ( value ) { update(); } );
		dat.controllerNameAndTitle( cFar, lang.far, lang.farTitle );

		//Scale of the base of the frustum points in percents.
		var cBase = fFrustumPoints.add( shaderMaterial, 'base', 0, 100, 1 ).onChange( function ( value ) { update(); } );
		dat.controllerNameAndTitle( cBase, lang.base, lang.baseTitle );
		
		//Square base of the frustum points.
		var cSquare = fFrustumPoints.add( shaderMaterial, 'square' ).onChange( function ( value ) { update(); } );
		dat.controllerNameAndTitle( cSquare, lang.square, lang.squareTitle );

		var folderPoint = new FolderPoint( fFrustumPoints, shaderMaterial.point, shaderMaterialDefault.point, function( value ) {

			if ( value === undefined )
				value = points.userData.shaderMaterial.point.size;
			if ( value < 0 )
				value = 0;

			//See this.animate = function() for details about size of the points
			points.userData.shaderMaterial.point.size = value;
			
			folderPoint.size.setValue( value );
			saveSettings();

		}, {

			settings: { offset: 0.001 }, min: 0.001, max: 0.01, step: 0.0001,
			setOpacity: function( value ) {

				if ( folderPoint.opacity.getValue() !== value )
					folderPoint.opacity.setValue( value );
				points.userData.shaderMaterial.point.opacity = value;

				lines.forEach( function ( line ) {

					line.material.opacity = value;

				} );

				saveSettings();
				
			}

		} );

		var toUpdate = true,//Когда пользователь нажимает кнопку Default надо установить toUpdate = false
							//что бы несколько раз не вызывался _this.update(); чтобы быстрее работало
			canUpdate = true;
		function update() {

			if ( !toUpdate || !canUpdate )
				return;
			canUpdate = false;

			//Не помню почему не удаляю старый points из списка cMeshs, но если так делать, то будут какие то запутанные косяки.
			//Поэтому не удаляю points из списка cMeshs а только получаю индекс points в этом списке.
			var index = guiSelectPoint.getMeshIndex( points );

			raycaster.stereo.removeParticle( points );
			removePoints( true );

			_this.update( function() {

				//затем заменяю указатель на старый points в списке cMeshs на новый.
				guiSelectPoint.setIndexMesh( index, points );

				saveSettings();
//				raycaster.stereo.addParticle( points );
				canUpdate = true;

				points.userData.controllers();// myThreejs.cFrustumPoints );
				
			} );

		}

		//zCount
		var cZCount = fFrustumPoints.add( shaderMaterial, 'zCount' ).min( 3 ).step( 1 ).onChange( function ( value ) { update(); } );
		dat.controllerNameAndTitle( cZCount, lang.zCount, lang.zCountTitle );

		//yCount
		var cYCount = fFrustumPoints.add( shaderMaterial, 'yCount' ).min( 3 ).step( 1 ).onChange( function ( value ) { update(); } );
		dat.controllerNameAndTitle( cYCount, lang.yCount, lang.yCountTitle );

		//Default button
		dat.controllerNameAndTitle( fFrustumPoints.add( {

			defaultF: function ( value ) {

				toUpdate = false;

				cDisplay.setValue( shaderMaterialDefault.display );
				cInfo.setValue( shaderMaterialDefault.info );

				//Stereo
				cDisplayLines.setValue( shaderMaterialDefault.stereo.lines );
				cHide.setValue( shaderMaterialDefault.stereo.hide );
				cOpacity.setValue( shaderMaterialDefault.stereo.opacity );

				cNear.setValue( shaderMaterialDefault.near );
				cFar.setValue( shaderMaterialDefault.far );
				cBase.setValue( shaderMaterialDefault.base );
				cSquare.setValue( shaderMaterialDefault.square );

				folderPoint.size.setValue( shaderMaterialDefault.point.size );

				cZCount.setValue( shaderMaterialDefault.zCount );
				cYCount.setValue( shaderMaterialDefault.yCount );

				toUpdate = true;
				update();
				saveSettings();

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
		displayControllers( shaderMaterial.display );

	}
	this.selectPoint = function ( cFrustumPoints, guiSelectPoint ) {

//		return cFrustumPoints.selectPoint( names );
		var index = cFrustumPoints.selectPoint( names );
		if ( index === null )
			return;
		guiSelectPoint.select( { object: points, index: index } );
/*		
		if ( axesHelper !== undefined )
			axesHelper.exposePosition( getObjectPosition( mesh, index ) );
*/			
		
	}

}

export var FrustumPoints = {

	create: create,

}

//export default FrustumPoints;

export function cFrustumPointsF( guiSelectPoint ) {

	var cFrustumPointsX = null, cFrustumPointsY = null, cFrustumPointsZ = null,
		_this = this;
	this.create = function ( fPoints, languageCode ) {

		function frustumPointsControl( name ) {


			//Localization

			var lang = {

				notSelected: 'Not selected',

			};

			switch ( languageCode ) {

				case 'ru'://Russian language
					lang.notSelected = 'Не выбран';

					break;

			}

			var controller = fPoints.add( { Points: lang.notSelected }, 'Points', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

				frustumPoints.selectPoint( _this, guiSelectPoint );

			} );
			controller.__select[0].selected = true;
			dat.controllerNameAndTitle( controller, name );
			return controller;

		}

		cFrustumPointsX = frustumPointsControl( 'x' );
		cFrustumPointsY = frustumPointsControl( 'y' );
		cFrustumPointsZ = frustumPointsControl( 'z' );

	}

	var frustumPoints;
	this.setFrustumPoints = function ( _frustumPoints ) { frustumPoints = _frustumPoints; }

	this.appendChild = function ( count ) {

		function appendChild( cFrustumPoints, count ) {

			//thanks to https://stackoverflow.com/a/48780352/5175935
			cFrustumPoints.domElement.querySelectorAll( 'select option' ).forEach( option => { if ( option.value != '-1' ) option.remove() } );
/*			
			var opt = document.createElement( 'option' );
			opt.innerHTML = lang.notSelected;
			opt.setAttribute( 'value', -1 );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
			cPoints.__select.appendChild( opt );
*/			

			for ( var i = 0; i < count; i++ ) {

				var opt = document.createElement( 'option' );
				opt.innerHTML = i;
				//					opt.setAttribute( 'value', iPosition );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
				cFrustumPoints.__select.appendChild( opt );

			}

		}
		appendChild( cFrustumPointsX, count.xCount );
		appendChild( cFrustumPointsY, count.yCount );
		appendChild( cFrustumPointsZ, count.zCount );

	}
	this.pointIndexes = function ( index ) {

		if ( parseInt( cFrustumPointsX.getValue() ) !== index.x )
			cFrustumPointsX.setValue( index.x );
		if ( parseInt( cFrustumPointsY.getValue() ) !== index.y )
			cFrustumPointsY.setValue( index.y );
		if ( parseInt( cFrustumPointsZ.getValue() ) !== index.z )
			cFrustumPointsZ.setValue( index.z );

	};
	this.selectPoint = function ( names ) {

		var x = parseInt( cFrustumPointsX.getValue() ),
			y = parseInt( cFrustumPointsY.getValue() ),
			z = parseInt( cFrustumPointsZ.getValue() );
		if ( isNaN( x ) || isNaN( y ) || isNaN( z ) )
			return null;
		for ( var i = 0; i < names.length; i++ ) {

			var name = names[i];
			if ( ( typeof name !== "object" ) || ( name.z === undefined ) || ( name.z !== z ) )
				continue;
			for ( ; i < names.length; i++ ) {

				name = names[i];
				if ( ( typeof name !== "object" ) || ( name.y !== y ) )
					continue;
				for ( ; i < names.length; i++ ) {

					name = names[i];
					if ( typeof name === "object" ) {

						if ( ( x === 0 ) && ( name.y === y ) ) {

							console.warn( 'x = ' + x + ', y = ' + y + ', z = ' + z + ', i = ' + i );
							return i;

						}

					}
					if ( name === x ) {

						//console.warn( 'x = ' + x + ', y = ' + y + ', z = ' + z + ', i = ' + i );
						return i;

					}

				}

			}

		}
		console.error( 'FrustumPoints.selectPoint: not selected' );
		return null;

	}
	this.display = function ( display ) {

		cFrustumPointsX.domElement.parentElement.parentElement.style.display = display;
		cFrustumPointsY.domElement.parentElement.parentElement.style.display = display;
		cFrustumPointsZ.domElement.parentElement.parentElement.style.display = display;

	}

}
