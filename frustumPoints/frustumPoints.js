/**
 * frustumPoints
 * 
 * Array of points, statically fixed in front of the camera.
 * I use frustumPoints for displaying of the clouds around points.
 * 
 * For using please define an array of the points with cloud:
 * 
 * var arrayCloud = [];
 *
 * Then you can define:
 * 
 * arrayCloud: options.arrayCloud
 * 
 * on the params of the getShaderMaterialPoints( params, onReady ) function.
 * Or
 * 
 * arrayCloud: options.arrayCloud
 * 
 * on the pointsOptions of the myThreejs.points function.
 *
 * Or
 * if points is new THREE.Points(...) then:
 *
 * if ( options.arrayCloud !== undefined )
 * 	points.userData.cloud = {
 *
 * 		indexArray: myThreejs.pushArrayCloud( options.arrayCloud, points.geometry ),//индекс массива точек в pointsOptions.arrayCloud которые принадлежат этому points
 *
 * 	}
 *
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
/*
import {

	Vector3, Vector4,
	CameraHelper,
	Group,
	BufferGeometry,
	BufferAttribute,

	//lines
	LineBasicMaterial,
	Geometry,
	Line,

	//create a buffer with color data
	RGBAFormat, RGBFormat, LuminanceFormat,
	FloatType,
	DataTexture,

} from '../../../three.js/dev/build/three.module.js';
*/
import { myThreejs, THREE } from './../myThreejs.js';
import cookie from '../../../commonNodeJS/master/cookieNodeJS/cookie.js';
import clearThree from '../../../commonNodeJS/master/clearThree.js';
import { dat } from '../../../commonNodeJS/master/dat/dat.module.js';


//memory limit
//import roughSizeOfObject from '../../commonNodeJS/master/SizeOfObject.js';

var debug = {

	notHiddingFrustumPoints: true, //Точки не скрываются когда пересчитываются их координаты когда пользователь поворачивает сцену
	//notMoveFrustumPoints: true,//Точки двигаются относительно камеры вместе с остальными 3D объектами когда пользователь поворачивает сцену
	//linesiInMono: true,//Возможность показать линии в отсутсвии стерео режима

};

/**
 * Create FrustumPoints
 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
 * @param {THREE.OrbitControls} controls
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
function create( camera, controls, group, cookieName, spatialMultiplex, renderer, options, shaderMaterialDefault, cFrustumPoints, palette ) {

	if ( ( options.arrayCloud === undefined ) || ( options.arrayCloud.length === 0 ) )
		return undefined;//нет точек с облаком. Поэтому нет смысла создавать frustumPoints
	shaderMaterialDefault = shaderMaterialDefault || {};
	shaderMaterialDefault.point = shaderMaterialDefault.point || {};
	shaderMaterialDefault.point.size = shaderMaterialDefault.point.size || 0;//0.01;//Size of each frustum point

	shaderMaterialDefault.display = shaderMaterialDefault.display === undefined ? true : shaderMaterialDefault.display;//true - display frustum points
	shaderMaterialDefault.info = shaderMaterialDefault.info !== undefined ? shaderMaterialDefault.info : false;//true - display information about frustum point if user move mouse over or click this point.

	//Stereo
	shaderMaterialDefault.stereo = shaderMaterialDefault.stereo || {};
	shaderMaterialDefault.stereo.lines = false;//сейчас lines не использую shaderMaterialDefault.stereo.lines === undefined ? true : shaderMaterialDefault.stereo.lines;//Display or hide lines between Frustum Points for more comfortable visualisation in the stereo mode.
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

	//оставить shaderMaterial.stereo по умолчанию потому что сейчас lines не использую
	//и возможно в cookie сохранились зачения shaderMaterial.stereo от старых версий этой программы
	shaderMaterial.stereo.lines = shaderMaterialDefault.stereo.lines;
	shaderMaterial.stereo.hide = shaderMaterialDefault.stereo.hide;
	shaderMaterial.stereo.opacity = shaderMaterialDefault.stereo.opacity;

	var points, zeroPoint = new THREE.Vector3(), cameraDistanceDefault = camera.position.distanceTo( zeroPoint ), _this = this,
		lines = [], groupFrustumPoints = new THREE.Group(), names,
//		cloudPoints,
		cloud = function () {

			var uniforms;
			var distanceTableWidth;//distanceTable points count
			this.create = function ( _uniforms ) {

				uniforms = _uniforms;

				//array of all points with cloud
				this.cloudPoints = new this.addUniforms( THREE.RGBAFormat, options.arrayCloud.getCloudsCount(), 'cloudPoints' );

				//function of distance between points. Use for creating of the cloud around point
				//distanceTable is THREE.DataTexture
				//	width = distanceTableWidth( distanceTable points count )
				//	height = 2
				//THREE.DataTexture contains two lines:
				//	Every line have x from 0 to width - 1
				//	First line (y = 0) is function of distance
				//	Second line (y = 1) is distance from cloud point to frustum point
				//Такая структура distanceTable позволяет неравномерно распределять точки по дистанции
				//Если function of distance меняется быстро, то надо наставить побольше точек
				//Если function of distance почти не меняется, точек можно поставить поменьше
				//Это позволит поставить последнюю точку на достаточно большой дистанции
				//и таким образом можно учитывать малое влияние облака на большом расстоянии.
				distanceTableWidth = 256;//distanceTable points count
				const pointLength = 2;//Every point contains two coordinates
				new this.addUniforms( THREE.LuminanceFormat,//RGFormat,//RGBFormat,
					distanceTableWidth, 'distanceTable', {

						height: pointLength,
						onReady: function ( data, itemSize, updateItem ) {

							//debug
							//var linePoints = [];
							////////////////////////////
							var fDistancePrev, x = 0;
							const dDistanceMax = 0.035;
							var dx = 0.5 / ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.00196078431372549
							//ddx	xmax
							//1.001	0.5686435272529023 y = 9.515363374066325e-8
							//var dx = 1.5 / ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.0058823529411764705
							//ddx	xmax
							//1.001	1.686899158126089 y = 1.614196454247848e-62
							//1.01	5.688013140820184
							//1.05	11783.008823594038
							//1.1	285390429.9744771
							//var dx = 2/ ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.00784313725490196
							//ddx	xmax
							//1.001	2.2149519380160148 y = 2.932926014021469e-107
							//1.01	7.0082200110085715
							//1.05	12925.219146819716
							//1.1	314479812.6420277
							//var dx = 20/ ( distanceTableWidth - 1 ); const ddx = 1.1;
							//dx = 0.0784313725490196
							//ddx	xmax
							//1.001	22.56677751344284 y = 0
							//1.1	11942365647.747343 y = 0
							for ( var i = 0; i < distanceTableWidth; i++ ) {

								var fDistance = getStandardNormalDistribution( x );
								//console.warn( 'dx = ' + dx );
								x += dx;
								if ( fDistancePrev !== undefined ) {

									if ( Math.abs( fDistancePrev - fDistance ) > dDistanceMax )
										dx /= ddx;
									else dx *= ddx;

								}
								fDistancePrev = fDistance;

								updateItem( i, fDistance );//function of distance
/*
								x = ( i / ( distanceTableWidth - 1 ) ) * 0.5;
								var fDistance = - i / ( distanceTableWidth - 1 ) + 1;
								updateItem( i, itemSize === 3 ?
									new THREE.Vector3( i, 0, 0 ) : itemSize === 2 ?
										new THREE.Vector2( i, 0 ) : fDistance );//function of distance
*/
								updateItem( i + distanceTableWidth, x );//distance from cloud point to frustum point

								//debug
								//if ( linePoints !== undefined )
								//	linePoints.push( new THREE.Vector3( x, fDistance, 0 ) );
								////////////////////////////

							}

							//debug
							/*
							if ( linePoints !== undefined ) {

								//group.add( new THREE.Line( new THREE.BufferGeometry().setFromPoints( linePoints ), new THREE.LineBasicMaterial( {
								//	color: 0x0000ff
								//} ) ) );
								group.add( new THREE.Points( new THREE.BufferGeometry().setFromPoints( linePoints ),
									new THREE.PointsMaterial( { color: 0xffffff, alphaTest: 0.5 } ) ) );

							}
							*/
							////////////////////////////

						}

					} );

			}
			this.addUniforms = function ( format, width, key, options ) {

				options = options || {};
				//format = RGBAFormat,//LuminanceFormat,//Available formats https://threejs.org/docs/index.html#api/en/constants/Textures
				//D:\My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\src\constants.js
				var itemSize = format === THREE.RGBAFormat ? 4 : format === THREE.RGBFormat ? 3 : format === THREE.LuminanceFormat ? 1 : NaN;
				var height = options.height || 1,//format === THREE.LuminanceFormat ? 1 : 2,
					size = width * height,
					type = THREE.FloatType,
					data = type === THREE.FloatType ? new Float32Array( itemSize * size ) : new Uint8Array( itemSize * size );
				/*Uncaught TypeError: Right-hand side of 'instanceof' is not callable
				if( !this instanceof cloud )
					console.error('');
				*/
				if ( this.addUniforms !== undefined )
					console.error('Please use "new this.addUniforms(...)"');
				this.updateItem = function ( i, vector ){

					var x, y, z, w;
					if ( typeof vector === "number" )
						x = vector;
					else if ( vector.x === undefined ) {

						x = vector.r;
						y = vector.g;
						z = vector.b;
						/*
												vector.x = vector.r;
												vector.y = vector.g;
												vector.z = vector.b;
						*/

					} else {

						x = vector.x;
						y = vector.y;
						z = vector.z;
						if ( isNaN( vector.w ) )
							console.error( 'frustumPoints.create.cloud.addUniforms.updateItem: vector.w = ' + vector.w );
						w = vector.w;

					}
					var vectorSize = y === undefined ? 1 : z === undefined ? 2 : w === undefined ? 3 : 4;
					if ( vectorSize !== itemSize )
						console.error( 'frustumPoints.create.cloud.addUniforms.updateItem: vectorSize = ' + vectorSize + ' !== itemSize = ' + itemSize );
					var stride = i * itemSize;
					data[stride] = x;
					if ( itemSize > 1 ) {

						data[stride + 1] = y;
						if ( itemSize > 2 ) {

							data[stride + 2] = z;
							if ( itemSize > 3 )
								data[stride + 3] = w;

						}

					}

				}

				if ( options.onReady !== undefined )
					options.onReady( data, itemSize, this.updateItem );

				uniforms[key] = {

					value: new THREE.DataTexture( data,
						width, height, format, type )

				};
				uniforms[key].value.needsUpdate = true;

				return itemSize;

			}
			this.editShaderText = function ( shaderText ) {

				var scloudPointsWidth = 0;
				for ( var i = 0; i < options.arrayCloud.length; i++ ) {

					var arrayVectors = options.arrayCloud[i];
					scloudPointsWidth += arrayVectors.length;

				}
				shaderText.vertex = shaderText.vertex.replace( '%scloudPointsWidth', scloudPointsWidth + '.' );
				shaderText.vertex = shaderText.vertex.replace( '%distanceTableWidth', distanceTableWidth + '.' );

			}
			this.updateMesh = function ( mesh ) {

				if ( mesh.userData.cloud === undefined )
					return;
				for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

					this.cloudPoints.updateItem( mesh.userData.cloud.indexArray + i,
						myThreejs.getWorldPosition( mesh,
							new THREE.Vector4().fromArray( mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize ) ) );

				}

			}

		};
	cloud = new cloud();
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
		options.guiSelectPoint.setMesh();

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
			options.guiSelectPoint.removeMesh( points );//не удаляю frustumPoints из списка Meshes потому что сюда попадает только если пользователь изменил число точек frustumPoints.
		//В этом случае создается новый frustumPoints, который надо присоеденить к старому frustumPoints из списка Meshes.
		//Если я удалю frustumPoints из списка Meshes а потом добавлю туда новый frustumPoints,
		//то изменится индекс frustumPoints в списке Meshes
		//и тогда неверно будет выполняться function update() в frustumPoints и как результат буде неверный список Ponts списке Meshes
		//for testing
		//Select in the canvas any point, but not frustum point.
		//Now you can see your selected point in the in the Meshes/Points/Select list in the gui.
		//Change Settings/Frustum Points/Z count in the gui.
		//Now your selected point is deselected.
		//Select in the canvas your point again.
		//Now yiou can see "Cannot read property 'selected' of undefined" error message in the console.
		//Try to select your point in the gui. You can not to do it because your point is not exists in the Meshes/Points/Select list. Instead you see all Frustum Points in the Meshs/Points/Select list.

		group.remove( points );
		renderer.renderLists.dispose();
		clearThree( points );
		points = undefined;

	}
	function isLines() {

		return shaderMaterial.stereo.lines
			&& ( debug.linesiInMono || ( spatialMultiplex !== spatialMultiplexsIndexs.Mono ) );

	}
	function update( onReady ) {

		if ( points === undefined ) {

			progress( onReady );

		}

	}
	this.onChangeControls = function ( ) {

		if ( !debug.notHiddingFrustumPoints ) {

			//Updating of the canvas is too slow if FrustumPoints count is very big (about 'Z Count' = 50 and 'Y Count' = 30).
			//I am hidding all points during  changing of the contdrol and show it again after 500 msec for resolving of the problem.
			if ( timeoutControls === undefined ) {

				group.remove( points );
				group.remove( groupFrustumPoints );
				options.raycaster.removeParticle( points );

			}
			clearTimeout( timeoutControls );
			timeoutControls = setTimeout( function () {

				group.add( groupFrustumPoints );
				if ( shaderMaterial.info )
					options.raycaster.addParticle( points );

				clearTimeout( timeoutControls );
				timeoutControls = undefined;

				if ( !debug.notMoveFrustumPoints ) {

					_this.update();

				}

			}, 500 );

		} else if ( !debug.notMoveFrustumPoints ) {

			_this.update();

		}
				
	}
	function progress( onReady ) {

		if ( !shaderMaterial.display )
			return;

		var cameraPerspectiveHelper = new THREE.CameraHelper( camera );

		var array, indexArray = 0;//, names;// = [];

		function getPoint( pointName ) {

			var points = cameraPerspectiveHelper.pointMap[pointName],
				position = cameraPerspectiveHelper.geometry.attributes.position;
			return new THREE.Vector3().fromArray( position.array, points[0] * position.itemSize )

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

		var pointStart = new THREE.Vector3().copy( point_n1 );

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

			for ( var y = 0; y < yCount; y++ ) {

				for ( var x = 0; x < xCount; x++ )
					if ( z >= zStart ) {

						function addPoint( point/*, pointName*/ ) {

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
						addPoint( new THREE.Vector3(

							pointStart.x + xStep * x + xzStep * zx,
							pointStart.y + yStep * y + yzStep * zy,
							pointStart.z + zStep * z * z

						) );

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
			if( zStart >= zEnd )
				return;
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

		removePoints( true );

		var itemSize = 3;
		_this.pointIndexes = function( pointIndex ) {

			if ( names === undefined ) {

				console.error( 'names = ' + names );//сюда попадает в отладочной версии
				return undefined;

			}
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
			return { x: x, y: y, z: z };

		}

		//Thanks to https://stackoverflow.com/a/27369985/5175935
		//Такая же функция есть в myPoints.js но если ее использовать то она будет возвращать путь на myPoints.js
		const getCurrentScript = function () {

			if ( document.currentScript && ( document.currentScript.src !== '' ) )
				return document.currentScript.src;
			const scripts = document.getElementsByTagName( 'script' ),
				str = scripts[scripts.length - 1].src;
			if ( str !== '' )
				return src;
			//Thanks to https://stackoverflow.com/a/42594856/5175935
			return new Error().stack.match( /(https?:[^:]*)/ )[0];

		};
		//Thanks to https://stackoverflow.com/a/27369985/5175935
		const getCurrentScriptPath = function () {
			const script = getCurrentScript(),
				path = script.substring( 0, script.lastIndexOf( '/' ) );
			return path;
		};
		//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
		var path = getCurrentScriptPath();
		var cameraPositionDefault = new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z );
		var cameraQuaternionDefault = new THREE.Vector4(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
		
		myThreejs.points( //array
			function () {

				var geometry = new THREE.BufferGeometry(),
					geometryLength = ( zEnd - zStart + 1 ) * xCount * yCount;

				array = new Float32Array( geometryLength * itemSize );
				indexArray = 0;
				names = null;
				names = [];

				eachZ( zStart, zEnd );

				geometry.setAttribute( 'position', new THREE.BufferAttribute( array, itemSize ) );

				return geometry;

			}, group, options, {

				name: 'frustum points',
				shaderMaterial: shaderMaterial,
				boFrustumPoints: true,
				position: camera.position,
				scale: camera.scale,
				rotation: camera.rotation,
				opacity: true,
				pointIndexes: function ( pointIndex ) { return _this.pointIndexes( pointIndex ); },
				path: {
					
					vertex: path + '/vertex.c',

				},
				pointName: function( pointIndex ) {

					var indexes = _this.pointIndexes( pointIndex );
					if ( indexes === undefined )
						return indexes;
					return 'x = ' + indexes.x + ', y = ' + indexes.y + ', z = ' + ( indexes.z + zStart ) + ', i = ' + pointIndex;

				},
				controllers: function ( /*cFrustumPoints*/ ) {

					cFrustumPoints.appendChild({ xCount: xCount, yCount: yCount, zCount: zCount,  });

				},
				uniforms: function( uniforms ){

					cloud.create( uniforms );

					//rotate the quaternion vector to 180 degrees
					cameraQuaternionDefault.x = - cameraQuaternionDefault.x;
					cameraQuaternionDefault.y = - cameraQuaternionDefault.y;
					cameraQuaternionDefault.z = - cameraQuaternionDefault.z;
					
					cameraPositionDefault.applyQuaternion( cameraQuaternionDefault );

					uniforms.cameraPositionDefault = { value: cameraPositionDefault };
					uniforms.cameraQuaternion = { value: camera.quaternion };

					//palette
					//ВНИМАНИЕ!!! Для того, что бы палитра передалась в vertex надо добавить 
					//points.material.uniforms.palette.value.needsUpdate = true;
					//в getShaderMaterialPoints.loadShaderText
/*					
					var format = RGBFormat,//THREE.LuminanceFormat,//RGBAFormat,//Available formats https://threejs.org/docs/index.html#api/en/constants/Textures
						//D:\My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\src\constants.js
						itemSize = format === RGBAFormat ? 4 : format === RGBFormat ? 3 : format === LuminanceFormat ? 1 : NaN;
					var width = 256,
						height = 1,//format === THREE.LuminanceFormat ? 1 : 2,
						size = width * height,
						type = FloatType;//IntType;
//					var arrayPalette = type === FloatType ? new Float32Array( itemSize * size ) : type === IntType ? new Int8Array( itemSize * size ) : NaN;//new Uint8Array( itemSize * size )
					uniforms.palette = { value: new DataTexture( type === FloatType ? new Float32Array( itemSize * size ) : type === IntType ? new Int8Array( itemSize * size ) : NaN,//arrayPalette,
						width, height, format, type ) }
*/
/*
					var uniformKey = 'palette'//, size = 256,
						itemSize = cloud.addUniforms( RGBFormat, 256, uniformKey, function ( data, itemSize, updateItem )
*/						
					new cloud.addUniforms( THREE.RGBFormat, 256, 'palette', {

						onReady: function ( data, itemSize, updateItem ) {

							var min, max;
							if ( options.scales.w !== undefined ) {

								min = options.scales.w.min; max = options.scales.w.max;

							} else {

								console.error( 'params.pointsOptions.uniforms: params.options.scales.w = ' + params.options.scales.w );
								return;

							}

							var size = data.length / itemSize;
							for ( var i = 0; i < size; i++ )
								updateItem( i, options.palette.toColor( ( max - min ) * i / ( size - 1 ) + min, min, max ) );

						}

					} );
/*
					function updateItem ( i, vector, data ) {

						var stride = i * itemSize;

						data[stride] = vector.r;
						if ( itemSize > 1 ) {

							data[stride + 1] = vector.g;
							if ( itemSize > 2 ) {

								data[stride + 2] = vector.b;
								if ( itemSize > 3 )
									data[stride + 3] = 1;//vector.w;

							}

						}

					}
					var size = uniforms.palette.value.image.width;
					for ( var i = 0; i < size; i++ )
						updateItem ( i, options.palette.toColor( ( max - min ) * i / ( size - 1 ) + min, min, max ),
						uniforms[uniformKey].value.image.data );
*/
					return cloud;

				},
				onReady: function ( newPoints ) {

					points = newPoints;
					points.userData.boFrustumPoints = true;
					points.userData.isInfo = function() { return shaderMaterial.info; }
					
					saveSettings();
					if ( shaderMaterial.info )
						options.raycaster.addParticle( points );

					if ( !shaderMaterial.display )
						removePoints();
					pointOpacity = points === undefined ?
						1.0 :
						points.userData.shaderMaterial === undefined ? shaderMaterial.point.opacity : points.userData.shaderMaterial.point.opacity;
					if ( onReady !== undefined )
						onReady();

				},

		} );

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
						geometry.vertices.push( new THREE.Vector3( vector.x, vector.y, vector.z ) );

					}
					var line = new Line( geometry, material );
					line.position.copy( camera.position );
					line.scale.copy( camera.scale );
					line.rotation.copy( camera.rotation );
					groupFrustumPoints.add( line );

					lines.push( line );

				}

		}

	}
	update();
	var pointOpacity;
	this.setSpatialMultiplexs = function( spatialMultiplexNew ) {

		spatialMultiplex = spatialMultiplexNew;

		//Не помню почему не удаляю старый points из списка cMeshs, но если так делать, то будут какие то запутанные косяки.
		//Поэтому не удаляю points из списка cMeshs а только получаю индекс points в этом списке.
		var index = options.guiSelectPoint.getMeshIndex( points );

		update();

		//затем заменяю указатель на старый points в списке cMeshs на новый.
		options.guiSelectPoint.setIndexMesh( index, points );
		
	}
	this.animate = function(){

		if (
			( points === undefined ) ||
			( points.userData.shaderMaterial === undefined ) ||
			( //( pointSize === points.userData.shaderMaterial.point.size ) &&
				( pointOpacity === points.userData.shaderMaterial.point.opacity ) )
		)
			return false;
		pointOpacity = points.userData.shaderMaterial.point.opacity;
		points.material.uniforms.opacity.value = points.userData.shaderMaterial.point.opacity;
		return true;

	}
	this.update = function ( onReady ) {

		update( onReady );

		//Эта команда нужна в случае изменения размера окна браузера когда canvas на весь экран
		setPointsParams();

		var cameraQuaternionDefault = new THREE.Vector4(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
		
		if ( points === undefined )
			return;//User has changed 'Z Count' of the frustumPoints
			
		points.material.uniforms.cameraPositionDefault.value.copy( camera.position );

		//rotate the quaternion vector to 180 degrees
		cameraQuaternionDefault.x = - cameraQuaternionDefault.x;
		cameraQuaternionDefault.y = - cameraQuaternionDefault.y;
		cameraQuaternionDefault.z = - cameraQuaternionDefault.z;
		
		points.material.uniforms.cameraPositionDefault.value.applyQuaternion( cameraQuaternionDefault ); 

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
				lang.opacityTitle = 'Число в диапазоне 0.0 - 1.0, указывающее, насколько прозрачены линии. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';

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
			//fStereo.domElement.style.display = display;

		}
		//Display frustumPoints
		var cDisplay = fFrustumPoints.add( shaderMaterial, 'display' ).onChange( function ( value ) {

			if ( shaderMaterial.display ) {

				update();

			} else {

				options.raycaster.removeParticle( points );
				removePoints();

			}
			displayControllers( shaderMaterial.display );
			saveSettings();

		} );
		dat.controllerNameAndTitle( cDisplay, lang.display, lang.displayTitle );

		//FrustumPoints info.
		//Display information about frustum point if user move mouse over or click this point.
		var cInfo = fFrustumPoints.add( shaderMaterial, 'info' ).onChange( function ( value ) {

			if ( points === undefined ) {

//				console.error( 'points = ' + points );
				return;//shaderMaterial.display = false

			}
			if ( shaderMaterial.info )
				options.raycaster.addParticle( points );
			else {

				options.guiSelectPoint.selectPoint( -1 );
				options.raycaster.removeParticle( points );

			}
			saveSettings();

		} );
		dat.controllerNameAndTitle( cInfo, lang.info, lang.infoTitle );

		/*сейчас lines не использую
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

		/////////////////////////////////
		*/

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

			//Не помню зачем это написал
			if ( value === undefined ) {

				console.warn( 'under constraction' );
//				value = points.userData.shaderMaterial.point.size;

			}
			if ( value < 0 )
				value = 0;

			//See this.animate = function() for details about size of the points
			//points.userData.shaderMaterial.point.size = value;

			points.material.uniforms.pointSize.value = value;
			
			folderPoint.size.setValue( value );
			saveSettings();

		}, {

				settings: { offset: 0.1 },

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
			var index = options.guiSelectPoint.getMeshIndex( points );

			options.raycaster.removeParticle( points );
			removePoints( true );

			_this.update( function() {

				//затем заменяю указатель на старый points в списке cMeshs на новый.
				options.guiSelectPoint.setIndexMesh( index, points );

				saveSettings();
				canUpdate = true;

				points.userData.controllers();
				
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

				/*сейчас lines не использую
				//Stereo
				cDisplayLines.setValue( shaderMaterialDefault.stereo.lines );
				cHide.setValue( shaderMaterialDefault.stereo.hide );
				cOpacity.setValue( shaderMaterialDefault.stereo.opacity );
				*/

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
	this.isDisplay = function () { return shaderMaterial.display; }
	this.getSelectedIndex = function ( cFrustumPoints ) { return cFrustumPoints.selectPoint( names ); }
	this.selectPoint = function ( cFrustumPoints ) {

		var index = this.getSelectedIndex( cFrustumPoints );
		if ( index === null )
			return;
		options.guiSelectPoint.select( { object: points, index: index } );
		
	}
	this.updateCloudPoints = function () {

		group.children.forEach( function ( mesh ) {

			if ( !mesh.userData.cloud )
				return;
			if ( mesh.geometry.attributes.position.itemSize !== 4 ) {

				console.error( 'mesh.geometry.attributes.position.itemSize = ' + mesh.geometry.attributes.position.itemSize );
				return;

			}
			cloud.updateMesh( mesh );
/*
			for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

				cloud.updateItem( mesh.userData.cloud.indexArray + '_' + i,
					new THREE.Vector4().fromArray( mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize ),
					true );

			}
*/

		} );
		needsUpdate();

	}
	function needsUpdate(){

		if ( points !== undefined )
			points.material.uniforms.cloudPoints.value.needsUpdate = true;

	}
	this.updateCloudPoint = function ( mesh ) {

		cloud.updateMesh( mesh );
		needsUpdate();

	}
	this.updateCloudPointItem = function ( points, i ) {

		if ( points.userData.cloud === undefined )
			return;
		if ( points.geometry.attributes.position.itemSize !== 4 )
			console.error( 'points.geometry.attributes.position.itemSize = ' + points.geometry.attributes.position.itemSize );
//		cloud.updateItem( points.userData.cloud.indexArray + '_' + i,
		cloud.cloudPoints.updateItem( points.userData.cloud.indexArray + i,
			myThreejs.getWorldPosition( points,
				new THREE.Vector4().fromArray( points.geometry.attributes.position.array, i * points.geometry.attributes.position.itemSize ) ),
			true );
		needsUpdate();

	}

	//Convert all points with cloud, but not shaderMaterial from local to world positions
	// i.e. calculate scales, positions and rotation of the points.
	//Converting of all points with cloud and shaderMaterial see getShaderMaterialPoints function in the myPoints.js file
	this.updateCloudPoints();
	return this;

}

export var FrustumPoints = {

	create: create,

}

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

				frustumPoints.selectPoint( _this );

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

		if ( index === undefined )
			return;//Сюда попадает в отладочной версии когда не заданы имена точек
		if ( parseInt( cFrustumPointsX.getValue() ) !== index.x )
			cFrustumPointsX.setValue( index.x );
		if ( parseInt( cFrustumPointsY.getValue() ) !== index.y )
			cFrustumPointsY.setValue( index.y );
		if ( parseInt( cFrustumPointsZ.getValue() ) !== index.z )
			cFrustumPointsZ.setValue( index.z );

	};
	this.getSelectedIndex = function () { return frustumPoints.getSelectedIndex( this ); }
	this.selectPoint = function ( names ) {

		if ( names === undefined ) {

			console.warn( 'Сюда попадает во время отладки когда не задаю имени каждой точки или когда the cDisplay checkbox of the frustumPoints is not checked' );
			return null;

		}
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
	this.isDisplay = function () {

		if( 
			(cFrustumPointsX.domElement.parentElement.parentElement.style.display !== cFrustumPointsY.domElement.parentElement.parentElement.style.display )
			|| (cFrustumPointsX.domElement.parentElement.parentElement.style.display !== cFrustumPointsZ.domElement.parentElement.parentElement.style.display )
		)
			console.error( 'cFrustumPointsF.isDisplay failed!' );
		return cFrustumPointsX.domElement.parentElement.parentElement.style.display !== 'none';

	}

}
//Standard normal distributionю. Нормальное распределение
//https://en.wikipedia.org/wiki/Normal_distribution
function getStandardNormalDistribution( x ) {

	var standardDeviation = 0.1;//чем больше среднеквадратическое отклонение, тем шире пик нормального распределения
	var res = Math.exp( -0.5 * x * x / ( standardDeviation * standardDeviation ) );// / Math.sqrt( 2 * Math.PI );
	//console.warn( 'x = ' + x + ' y = ' + res );
	return res;

}
