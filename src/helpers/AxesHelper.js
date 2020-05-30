/**
 * @author sroucheray / http://sroucheray.org/
 * @author mrdoob / http://mrdoob.com/
 * @authod anhr / https://github.com/anhr/
 */

import { THREE, SpriteText } from '../../../../nodejs/three.js';
/*
import { LineSegments } from '../objects/LineSegments.js';
import { VertexColors } from '../constants.js';
import { LineBasicMaterial } from '../materials/LineBasicMaterial.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Group } from '../objects/Group.js';
import { Vector3 } from '../math/Vector3.js';
import { Vector2 } from '../math/Vector2.js';
import { ConeBufferGeometry } from '../geometries/ConeGeometry.js';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial.js';
import { Geometry } from '../core/Geometry.js';
import { Mesh } from '../objects/Mesh.js';
import { Line } from '../objects/Line.js';
import { LineDashedMaterial } from '../materials/LineDashedMaterial.js';
*/

//import cookie from 'http://localhost/nodejs/cookieNodeJS/master/cookie.js';
import cookie from '../../../../cookieNodeJS/master/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';

//import { SpriteText, SpriteTextGui } from 'http://localhost/threejs/three.js/examples/jsm/objects/SpriteText.js';
//import { SpriteText, SpriteTextGui } from '../../examples/jsm/objects/SpriteText.js';
//import { SpriteText, SpriteTextGui } from '../objects/SpriteText.js';

import clearThree from '../../../../commonNodeJS/master/clearThree.js';

export var AxesHelperOptions = {

	cookieName: 'AxesHelper',
	getScalesOptions: getScalesOptions,
	axesEnum: {
		x: 0,
		y: 1,
		z: 2,
		w: 3,
		getName: function ( id ) {

			var axesEnum = this,
				name;
			Object.keys( this ).forEach( function ( key ) {

				if ( axesEnum[key] === id )
					name = key;

			} );
			if ( name === undefined )
				console.error( 'AxesHelperOptions.axesEnum.getName: invalid id = ' + id );
			return name;

		}
	},

}
/**
 * @callback cookie
 * @param {string} name name of the cookie is 'axes'
 */

/**
 * An axis object to visualize the 3 axes. Extention of https://threejs.org/docs/index.html#api/en/helpers/AxesHelper
 * @param {number} size size of the lines representing the axes. Default is 1.
 * @param {object} [options] followed options is available
 * @param {boolean} [options.negativeAxes] true - draw negative axes. Default is false.
 * @param {cookie} [options.cookie] Your custom cookie function for saving and loading of the AxesHelper settings. Default cookie is not saving settings.
 * @param {cookie} [options.cookieName] Name of the cookie is "AxesHelper" + options.cookieName. Default is undefined.
 * @param {string|number|number[]} [options.colors] axes colors string or number or array
//Each string or number or array color item defines the intensity of color as an value between 0 and 1.
//      0 is dark
//      1 is max intensity.
//      Example of string: "0.5"//gray axes
//      Example of number: 0.5//gray axes
//        Array length is 3. Same color for all axis.
//          Item 0 is red intensity.
//          Item 1 is green intensity.
//          Item 2 is blue intensity.
//          Example
//          [
//            //red green blue
//            0.5,  0.5,  0.5,//gray axes
//          ]
//        Array length is 9. Specifies a color for each axis.
//          From 0 to 2 items is x axis color.
//          From 3 to 5 items is y axis color.
//          From 6 to 8 items is z axis color.
//          Example
//          [
//            //red green blue
//            0,    0,    1,//x is blue
//            0,    1,    0,//y is green
//            1,    0,    0,//z is red
//          ]
//        Array length is 18. Specifies a color for each vertex of the axis.
//          Array items format
//            0  to 5  is color of the axes x
//            6  to 11 is color of the axes y
//            12 to 17 is color of the axes z
//          Format of each axes
//            0 to 2 is color of the begin vertex of the axis
//            3 to 6 is color of the end vertex of the axis
//          Format of each color
//            0 is read
//            1 is green
//            2 is blue
//
//          Default is
//          [
//            begin             end
//            red   green blue  red   green blue
//            1,    0,    0,    1,    0.6,  0,//Axes x
//            0,    1,    0,    0.6,  1,    0,//Axes y
//            0,    0,    1,    0,    0.6,  1,//Axes z
//          ]
 * @param {object} [options.scales] axes scales
 * @param {boolean} [options.scales.display] true - displays the label and scale of the axes. Default is false.
 * @param {number} [options.scales.precision] Formats a scale marks into a specified length. Default is 4
 *
 * @param {object} [options.scales.x] X axis options.
 * @param {number} [options.scales.x.zoomMultiplier] zoom multiplier. Default is 1.1
 * @param {number} [options.scales.x.offset] position offset. Default is 0.1
 * @param {string} [options.scales.x.name] axis name. Default is "X".
 * @param {number} [options.scales.x.min] Minimum range of the x axis. Default is -1.
 * @param {number} [options.scales.x.max] Maximum range of the x axis. Default is 1.
 * @param {number} [options.scales.x.marks] Number of x scale marks. Default is 5.
 *
 * @param {object} [options.scales.y] Y axis options.
 * @param {number} [options.scales.y.zoomMultiplier] zoom multiplier. Default is 1.1
 * @param {number} [options.scales.y.offset] position offset. Default is 0.1
 * @param {string} [options.scales.y.name] axis name. Default is "Y".
 * @param {number} [options.scales.y.min] Minimum range of the y axis. Default is -1.
 * @param {number} [options.scales.y.max] Maximum range of the y axis. Default is 1.
 * @param {number} [options.scales.y.marks] Number of y scale marks. Default is 5.
 *
 * @param {object} [options.scales.z] Z axis options.
 * @param {number} [options.scales.z.zoomMultiplier] zoom multiplier. Default is 1.1
 * @param {number} [options.scales.z.offset] position offset. Default is 0.1
 * @param {string} [options.scales.z.name] axis name. Default is "Z".
 * @param {number} [options.scales.z.min] Minimum range of the z axis. Default is -1.
 * @param {number} [options.scales.z.max] Maximum range of the z axis. Default is 1.
 * @param {number} [options.scales.z.marks] Number of z scale marks. Default is 5.
 *
 * @param {object} [options.scales.t] Animation time. Default is {}
 * @param {number} [options.scales.t.zoomMultiplier] zoom multiplier. Default is 2
 * @param {number} [options.scales.t.offset] position offset. Default is 1
 * @param {string} [options.scales.t.name] Time name. Default is "T".
 * @param {number} [options.scales.t.min] Animation start time. Default is 0.
 * @param {number} [options.scales.t.max] Animation stop time. Default is 1.
 * @param {number} [options.scales.t.marks] Number of scenes of 3D objects animation. Default is 2.
 * @param {boolean} [options.scales.t.repeat] true - Infinite repeat of animation.. Default is false.
 *
 * @param {Scene} [options.scene] Scenes allow you to set up what and where is to be rendered by three.js. https://threejs.org/docs/index.html#api/en/scenes/Scene.
 * @param {number} [options.colorsHelper] axle gray saturation.
 */
export function AxesHelper( size, options ) {

	var axesHelper = this,
		cookieName = options === undefined ? undefined : AxesHelperOptions.cookieName + ( options.cookieName || '' );

	size = size || 1;

	options = options || {};
	this.options = options;

	options.negativeAxes = options.negativeAxes || false;

	this.setSettings = function () {

//		options.cookieObject.setObject( cookieName, options.scales );
		options.cookie.setObject( cookieName, options.scales );
//		options.cookie.setObject( cookieName, scalesNew );

	}

	//scales

	var scalesOptions = getScalesOptions( options, cookieName );
	const optionsDefault = scalesOptions.optionsDefault;
	this.optionsDefault = optionsDefault;//for AxesHelperGui

	if ( ( options.scene === undefined ) && ( typeof scene !== 'undefined' ) )
		options.scene = scene;

	this.axesEnum = AxesHelperOptions.axesEnum;

	function getScalePosition() {

		var scales = options.scales;
		var scale = new THREE.Vector3(
				Math.abs( scales.x.min - scales.x.max ) / 2,
				Math.abs( scales.y.min - scales.y.max ) / 2,
				Math.abs( scales.z.min - scales.z.max ) / 2
			),
			position = new THREE.Vector3(
				( scales.x.min + scales.x.max ) / 2,
				( scales.y.min + scales.y.max ) / 2,
				( scales.z.min + scales.z.max ) / 2,
			);
		return {

			scale: scale,
			position: position,

		}

	}

	function getVertices() {

		var scalePosition = getScalePosition(),

			negativeSize = options.negativeAxes ? - size : 0,

			vertices = [
				//begin	vertex									end vertex
				//x				y				z				x		y		z
				negativeSize,	0,				0,				size,	0,		0,	//Axes x
				0,				negativeSize,	0,				0,		size,	0,	//Axes y
				0,				0,				negativeSize,	0,		0,		size//Axes z
			];

		if ( options.scene !== undefined ) {

			options.scene.scale.copy( new THREE.Vector3( 1, 1, 1 ).divide( scalePosition.scale ) );
			scalePosition.position.multiply( options.scene.scale );
			options.scene.position.copy( scalePosition.position );
			options.scene.position.negate();

		}
		return new THREE.Float32BufferAttribute( vertices, 3 );

	}

	//colors
	if ( options.colors ) {

		if ( ( typeof options.colors === 'string' ) || ( typeof options.colors === 'number' ) )
			options.colors = [ options.colors, options.colors, options.colors ];
		if ( Array.isArray( options.colors ) )
			switch ( options.colors.length ) {

				case 18://Specifies a color for each vertex of the axis.
					break;
				case 9://Specifies a color for each axis.
					var colors = options.colors;
					options.colors = [
						//begin									end
						//red		green			blue		red			green		blue
						colors[ 0 ], colors[ 1 ], colors[ 2 ], colors[ 0 ], colors[ 1 ], colors[ 2 ], //x
						colors[ 3 ], colors[ 4 ], colors[ 5 ], colors[ 3 ], colors[ 4 ], colors[ 5 ], //y
						colors[ 6 ], colors[ 7 ], colors[ 8 ], colors[ 6 ], colors[ 7 ], colors[ 8 ], //z
					];
					break;
				case 3://Same color for all axis.
					var colors = options.colors;
					options.colors = [
						//begin									end
						//red		green			blue		red			green		blue
						colors[ 0 ], colors[ 1 ], colors[ 2 ], colors[ 0 ], colors[ 1 ], colors[ 2 ], //x
						colors[ 0 ], colors[ 1 ], colors[ 2 ], colors[ 0 ], colors[ 1 ], colors[ 2 ], //y
						colors[ 0 ], colors[ 1 ], colors[ 2 ], colors[ 0 ], colors[ 1 ], colors[ 2 ], //z
					];
					break;
				default: console.error( 'THREE.AxesHelper: Invalid options.colors.length = ' + options.colors.length );
					return;

			}
		else {

			console.error( 'THREE.AxesHelper: Invalid options.colors: ' + options.colors );
			return;

		}

	}
	var colors = options.colors || [
		//begin					end
		//red	green	blue	red		green	blue
		1,		0,		0,		1,		0.6,	0, //Axes x
		0,		1,		0,		0.6,	1,		0, //Axes y
		0,		0,		1,		0,		0.6,	1, //Axes z
	];
	function getColor( colorIndex ) {

		colorIndex *= 3;
		return ( ( colors[ colorIndex ] * 0xff ) << 16 ) + ( ( colors[ colorIndex + 1 ] * 0xff ) << 8 ) + colors[ colorIndex + 2 ] * 0xff;

	}

	var geometry = new THREE.BufferGeometry();
	geometry.setAttribute( 'position', getVertices() );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

	var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

	THREE.LineSegments.call( this, geometry, material );

	function getVerticePosition( verticeIndex ) {

		verticeIndex *= 3;
		var array = geometry.attributes.position.array;
		return new THREE.Vector3( array[ verticeIndex ], array[ verticeIndex + 1 ], array[ verticeIndex + 2 ] );

	}
	this.getAxesPosition = function ( axesId ) {

		var axes = this.axesEnum.getName( axesId );
		return {

			min: {
				position: getVerticePosition( axesId * 2 ),
				scale: options.scales[ axes ].min,
			},
			max: {

				position: getVerticePosition( axesId * 2 + 1 ),
				scale: options.scales[ axes ].max,

			}

		};

	};

	//axes scales

	var axesScales;
	this.displayScales = function ( visible ) { axesScales.visible = visible; }

	//

	this.restore = function ( ) {

		if ( typeof controllerNegativeAxes !== 'undefined' ) {

			controllerNegativeAxes.setValue( optionsDefault.negativeAxes );

		}
//		controllerDisplayScales.setValue( optionsDefault.scales.display );
		function restore( scaleControllers, scale, windowRange ) {

			scaleControllers.min.setValue( scale.min );
			scaleControllers.max.setValue( scale.max );
			scaleControllers.marks.setValue( scale.marks );
			scaleControllers.scaleController.setValue( scale.zoomMultiplier );
			scaleControllers.positionController.setValue( scale.offset );
			onchangeWindowRange( windowRange );

		}
		restore( options.scalesControllers.x, optionsDefault.scales.x, axesHelper.windowRangeX );
		restore( options.scalesControllers.y, optionsDefault.scales.y, axesHelper.windowRangeY );
		restore( options.scalesControllers.z, optionsDefault.scales.z, axesHelper.windowRangeZ );
		restore( options.scalesControllers.t, optionsDefault.scales.t, axesHelper.windowRangeT );

	}
	this.arraySpriteText = [];
	this.arraySpriteText.options = {

		textHeight: 0.06 * size,
		rect: {
			displayRect: true,
			borderThickness: 3,
			borderRadius: 10,
			backgroundColor: 'rgba( 0, 0, 0, 1 )',
		},
		cookie: { cookie: options.cookie },
		precision: options.scales.precision,

	};
	function addAxesScales() {

		var groupMarksTextX = new THREE.Group(), groupMarksTextY = new THREE.Group(), groupMarksTextZ = new THREE.Group();

		if ( ! axesScales )
			axesScales = new THREE.Group();

		axesScales.add( groupMarksTextX );
		axesScales.add( groupMarksTextY );
		axesScales.add( groupMarksTextZ );

		//////////////////////////////////////////
		//The label keeps facing to you
		//Example https://stackoverflow.com/questions/28337772/make-text-always-appear-orthogonal-to-the-plane-when-rotating-a-cube/28340855

		// convert a 24 bit binary color to 0..255 R,G,B
		//https://gist.github.com/lrvick/2080648
		function binToRGB( bin ) {

			return {

				r: bin >> 16,
				g: bin >> 8 & 0xFF,
				b: bin & 0xFF,

			};

		}

		function drawScale( scaleIndex ) {

			var scales,
				position = getVerticePosition( scaleIndex * 2 + 1 ),
				color = getColor( scaleIndex * 2 + 1 ), //0x0000ff,//blue
				textColor = binToRGB( color ),

				markX = 0, markY = 0, markZ = 0,
				groupMarksText, marksTextCenter,
				textPositionMarks = new THREE.Vector3( 0, 0, 0 ),

				rotate = new THREE.Vector3( 0, 0, 0 ), angle = Math.PI * 0.5,
				textPosition = new THREE.Vector3( 0, 0, 0 ).copy( position ), delta = 0;//0.03
			textColor.a = 1.0;
			switch ( scaleIndex ) {

				case axesHelper.axesEnum.x:
					rotate.z = - angle;
					textPosition.y -= delta;
					textPosition.z -= delta;
					scales = options.scales.x;
					markY = 1;
					groupMarksText = groupMarksTextX;
					marksTextCenter = new THREE.Vector2( 1, 1 );
					break;
				case axesHelper.axesEnum.y:
					textPosition.x += delta;
					textPosition.z += delta;
					scales = options.scales.y;
					markX = 1;
					groupMarksText = groupMarksTextY;
					marksTextCenter = new THREE.Vector2( 0, 0 );
					textPositionMarks.x = 1;
					textPositionMarks.y = 1;
					break;
				case axesHelper.axesEnum.z:
					rotate.x = angle;
					textPosition.x += delta;
					textPosition.y -= delta;
					scales = options.scales.z;
					markY = 1;
					groupMarksText = groupMarksTextZ;
					marksTextCenter = new THREE.Vector2( 0, 1 );
					break;
				default: console.error( 'THREE.AxesHelper.addAxesScales.drawScale: Invalid scaleIndex = ' + scaleIndex );

			}

			//Adds to the axes scale an arrow as cone
			//options
			//	position: THREE.Vector3 - position of the cone
			//	rotate: THREE.Vector3 of radians - Rotate the cone about the X, Y, Z axis.
			//	height: height of the cone
			function drawCone( options ) {

				options = options || {};
				var height = 0.05 * size,
					radius = height / 5,
					geometry = new THREE.ConeBufferGeometry( radius, height, 8 );
				if ( options.rotate !== undefined ) {

					geometry.rotateX( options.rotate.x );
					geometry.rotateY( options.rotate.y );
					geometry.rotateZ( options.rotate.z );

				}

				var material = new THREE.MeshBasicMaterial( { color: options.color === undefined ? 0xffffff : options.color } );

				var mesh = new THREE.Mesh( geometry, material );
				if ( options.position !== undefined ) mesh.position.copy( options.position );
				axesScales.add( mesh );

			}
			drawCone( {

				position: position,
				rotate: rotate,
				color: color,

			} );

			function text( text, position, optionsText ) {

				var optionsCur = {},
					strColor = textColor.r + "," + textColor.g + "," + textColor.b;
				optionsCur.commonOptions = axesHelper.arraySpriteText.options;
				optionsCur.commonOptions.rect.borderColor = 'rgb( ' + strColor + ' )';
				var delta = 0.01 * size;
				optionsCur.position = new THREE.Vector3(
					position.x + delta * textPositionMarks.x,
					position.y - delta * ( optionsText.up === undefined ? 1 : - 1 ) + delta * textPositionMarks.y,
					position.z + delta * textPositionMarks.z );
				optionsCur.fontColor = "rgba(" + strColor + "," + textColor.a + ")";
				if ( optionsText.center !== undefined )
					optionsCur.center = optionsText.center;
				optionsCur.cookieName = options.cookieName;
				var spriteText = new SpriteText( text, optionsCur );
				axesHelper.arraySpriteText.push( spriteText );
				if ( optionsText.group === undefined )
					axesScales.add( spriteText );
				else optionsText.group.add( spriteText );

			}

			//Window Range

			function scaleMark( position, markText ) {

				var material = new THREE.LineBasicMaterial( { color: color } ),
					geometry = new THREE.Geometry();

				//scale mark
				var markSize = 0.01 * size;
				geometry.vertices.push( new THREE.Vector3(
					position.x - markSize * markX,
					position.y - markSize * markY,
					position.z - markSize * markZ ) );
				geometry.vertices.push( new THREE.Vector3(
					position.x + markSize * markX,
					position.y + markSize * markY,
					position.z + markSize * markZ ) );
				groupMarksText.add( new THREE.Line( geometry, material ) );
				text( parseFloat( markText.toPrecision( options.scales.precision ) ), position, {

					group: groupMarksText,
					center: marksTextCenter,

				} );
				axesHelper.arraySpriteText[axesHelper.arraySpriteText.length - 1].options.textDefault = markText;//use for changing of the markText precision

			}

			function windowRange( scalesNew ) {

				scalesNew = scalesNew || scales;

				//remove all old mark's texts
				for ( var i = groupMarksText.children.length - 1; i >= 0; i -- ) {

					groupMarksText.remove( groupMarksText.children[ i ] );

				}

				var minPosition = getVerticePosition( scaleIndex * 2 );
				if ( scalesNew.min !== undefined )
					scaleMark( minPosition, scalesNew.min );

				var maxPosition = getVerticePosition( scaleIndex * 2 + 1 );
				if ( scalesNew.max !== undefined )
					scaleMark( maxPosition, scalesNew.max );

				if ( ( scalesNew.min !== undefined ) && ( scalesNew.max !== undefined ) && ( scalesNew.min !== scalesNew.max ) ) {

					var marks = scalesNew.marks - 1;// || 6;
					var step = ( scalesNew.max - scalesNew.min ) / marks,
						distanceX = ( maxPosition.x - minPosition.x ) / marks,
						distanceY = ( maxPosition.y - minPosition.y ) / marks,
						distanceZ = ( maxPosition.z - minPosition.z ) / marks;
					for ( var i = 1; i < marks; i ++ ) {

						scaleMark( new THREE.Vector3(
							minPosition.x + distanceX * i,
							minPosition.y + distanceY * i,
							minPosition.z + distanceZ * i ), scalesNew.min + step * i );

					}

				}
//				options.cookie.setObject( cookieName, options.scales );
				axesHelper.setSettings();

			}

			switch ( scaleIndex ) {

				case axesHelper.axesEnum.x:
					axesHelper.windowRangeX = windowRange;
					break;
				case axesHelper.axesEnum.y:
					axesHelper.windowRangeY = windowRange;
					break;
				case axesHelper.axesEnum.z:
					axesHelper.windowRangeZ = windowRange;
					break;
				default: console.error( 'THREE.AxesHelper.addAxesScales.drawScale: Invalid scaleIndex = ' + scaleIndex );

			}
			windowRange( scales );

			//text

			text( scales.name, textPosition, {

				center: new THREE.Vector2( 1, 0 ),
				up: true,

			} );

		}
		drawScale( axesHelper.axesEnum.x );
		drawScale( axesHelper.axesEnum.y );
		drawScale( axesHelper.axesEnum.z );

		//

		axesHelper.add( axesScales );
		if ( options.scene !== undefined ) {

			axesHelper.scale.divide( options.scene.scale );
			axesHelper.position.sub( options.scene.position ).multiply( axesHelper.scale );

		}

	}
	addAxesScales();
	axesScales.visible = options.scales.display;

	//dotted lines
	function dotLines( _scene ) {

		var lineX, lineY, lineZ, scene = _scene;
		var groupDotLines;
		this.remove = function () {

			if ( groupDotLines === undefined )
				return;

			//clear memory
			//
			//Если это не делать, то со временем может произойти событие webglcontextlost
			//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
			//
			//for testing
			//	open http://localhost/threejs/nodejs/controllerPlay/Examples/html/ page
			//	select a point
			//	open dat.gui
			//	in the PlayController:
			//		click the ⥀ button
			//		Rate of changing of animation scenes per second to 25
			//		click the ► play button
			//	Now you can see animation of the scene
			//	In the Windows open Resource Monitor
			//		Open the Memory tab
			//		The Commit(KB) for chrome.exe do not increasing about 20 minutes.
			clearThree( groupDotLines );

			scene.remove( groupDotLines );
			groupDotLines = undefined;
			lineX = undefined;
			lineY = undefined;
			lineZ = undefined;

		};
		function createGroup() {

			dotLines.remove();
			groupDotLines = new Group();
			scene.add( groupDotLines );

		}
		function verticeAxis( position, scale ) { return - position / scale; }
		function getDashSize( axesId ) {

			return 0.05 / ( Math.max( Math.max( options.scene.scale.x, options.scene.scale.y ), options.scene.scale.z ) );

		}
		this.dottedLines = function ( pointVertice ) {


			if ( axesHelper === undefined )
				return;

			if ( groupDotLines !== undefined ) {

				function dottedLine( axesId ) {

					var line;
					switch ( axesId ) {

						case axesHelper.axesEnum.x:
							line = lineX;
							break;
						case axesHelper.axesEnum.y:
							line = lineY;
							break;
						case axesHelper.axesEnum.z:
							line = lineZ;
							break;
						default: console.error( 'AxesHelper.dotLines.dottedLines.dottedLine: axesId = ' + axesId );
							return;

					}
					var lineVertices = line.geometry.attributes.position.array;
					lineVertices[0] = axesId === axesHelper.axesEnum.x ? pointVertice.x :
						verticeAxis( options.scene.position.x, options.scene.scale.x );
					lineVertices[1] = axesId === axesHelper.axesEnum.y ? pointVertice.y :
						verticeAxis( options.scene.position.y, options.scene.scale.y );
					lineVertices[2] = axesId === axesHelper.axesEnum.z ? pointVertice.z :
						verticeAxis( options.scene.position.z, options.scene.scale.z );

					lineVertices[3] = pointVertice.x;
					lineVertices[4] = pointVertice.y;
					lineVertices[5] = pointVertice.z;

					var size = getDashSize( axesId );
					lineX.material.dashSize = size;
					lineX.material.gapSize = size;

					line.geometry.attributes.position.needsUpdate = true;

				}
				dottedLine( axesHelper.axesEnum.x );
				dottedLine( axesHelper.axesEnum.y );
				dottedLine( axesHelper.axesEnum.z );
				return;

			}

			createGroup();

			function dottedLine( axesId ) {

				var lineVertices = [
					new THREE.Vector3( 0, 0, 0 ),
					pointVertice,
				];
				lineVertices[0].x = axesId === axesHelper.axesEnum.x ? lineVertices[1].x : verticeAxis( options.scene.position.x, options.scene.scale.x );//- options.scene.position.x / options.scene.scale.x;
				lineVertices[0].y = axesId === axesHelper.axesEnum.y ? lineVertices[1].y : verticeAxis( options.scene.position.y, options.scene.scale.y );//- options.scene.position.y / options.scene.scale.y;
				lineVertices[0].z = axesId === axesHelper.axesEnum.z ? lineVertices[1].z : verticeAxis( options.scene.position.z, options.scene.scale.z );//- options.scene.position.z / options.scene.scale.z;

				var size = getDashSize( axesId );
				if ( options.colorsHelper === undefined )
					options.colorsHelper = 0x80;
				var line = new LineSegments( new BufferGeometry().setFromPoints( lineVertices ),
					new LineDashedMaterial( {
					color: 'rgb(' + options.colorsHelper + ', ' + options.colorsHelper + ', ' + options.colorsHelper + ')',
					dashSize: size, gapSize: size
					} ) );
				line.computeLineDistances();
				groupDotLines.add( line );
				return line;

			}
			lineX = dottedLine( axesHelper.axesEnum.x );
			lineY = dottedLine( axesHelper.axesEnum.y );
			lineZ = dottedLine( axesHelper.axesEnum.z );

		};
		this.update = function () {

			if ( groupDotLines === undefined )
				return;

			function dottedLine( axesId, line ) {

				var size = getDashSize( axesId );
				line.material.dashSize = size;
				line.material.gapSize = size;

				var positionArray = line.geometry.attributes.position.array,
					itemSize = line.geometry.attributes.position.itemSize;
				positionArray[itemSize + axesHelper.axesEnum.x] =
					axesId === axesHelper.axesEnum.x ? positionArray[axesHelper.axesEnum.x]
						: verticeAxis( options.scene.position.x, options.scene.scale.x );
				positionArray[itemSize + axesHelper.axesEnum.y] =
					axesId === axesHelper.axesEnum.y ? positionArray[axesHelper.axesEnum.y]
						: verticeAxis( options.scene.position.y, options.scene.scale.y );
				positionArray[itemSize + axesHelper.axesEnum.z] =
					axesId === axesHelper.axesEnum.z ? positionArray[axesHelper.axesEnum.z]
						: verticeAxis( options.scene.position.z, options.scene.scale.z );
				line.geometry.attributes.position.needsUpdate = true;

			}
			dottedLine( axesHelper.axesEnum.x, groupDotLines.children[axesHelper.axesEnum.x] );
			dottedLine( axesHelper.axesEnum.y, groupDotLines.children[axesHelper.axesEnum.y] );
			dottedLine( axesHelper.axesEnum.z, groupDotLines.children[axesHelper.axesEnum.z] );

		}
		this.movePointAxes = function ( axesId, value ) {

			var line;
			switch ( axesId ) {

			case mathBox.axesEnum.x:
				line = lineX;
				break;
			case mathBox.axesEnum.y:
				line = lineY;
				break;
			case mathBox.axesEnum.z:
				line = lineZ;
				break;
			default: console.error( 'point.userData.movePointAxes: invalid axesId: ' + axesId );
				return;

			}
			if ( line === undefined )
			return;
			line.geometry.attributes.position.array[axesId + 3] = value;

			lineX.geometry.attributes.position.array[axesId] = value;
			lineY.geometry.attributes.position.array[axesId] = value;
			lineZ.geometry.attributes.position.array[axesId] = value;

			lineX.geometry.attributes.position.needsUpdate = true;
			lineY.geometry.attributes.position.needsUpdate = true;
			lineZ.geometry.attributes.position.needsUpdate = true;

		};

	}
	dotLines = new dotLines( options.scene );

	/**
	* Expose position on axes.
	* @param {THREE.Vector3} pointVertice position
	*/
	this.exposePosition = function ( pointVertice ) {

		if ( pointVertice === undefined )
			dotLines.remove();
		else dotLines.dottedLines( pointVertice );

	}

	this.onchangeWindowRange = function () {

		var scale = new THREE.Vector3( 1, 1, 1 ).divide( options.scene.scale );
		axesHelper.scale.set( scale.x, scale.y, scale.z );

		axesHelper.position.set(
			( options.scales.x.min + options.scales.x.max ) / 2,
			( options.scales.y.min + options.scales.y.max ) / 2,
			( options.scales.z.min + options.scales.z.max ) / 2
		);

//		dotLines.remove();

	}

	this.updateDotLines = function () {

		dotLines.update();

	}

}

AxesHelper.prototype = Object.create( THREE.LineSegments.prototype );
AxesHelper.prototype.constructor = AxesHelper;

function getAxis( axix, name ) {

	axix = axix || {};
	axix.zoomMultiplier = axix.zoomMultiplier || 1.1;
	axix.offset = axix.offset || 0.1;
	axix.name = axix.name || name;
	var marksDefault = 5;
	axix.marks = axix.marks || marksDefault;
	axix.min = axix.min !== undefined ? axix.min : -1;
	axix.max = axix.max !== undefined ? axix.max : 1;
	return axix;

}

export function getScalesOptions( options, cookieName ) {

	options.cookie = options.cookie || new cookie.defaultCookie();

	cookieName = cookieName || AxesHelperOptions.cookieName;
	options.scales = options.scales || {}

	options.scales.display = options.scales.display || false;
	options.scales.precision = options.scales.precision || 4;

	options.scales.x = getAxis( options.scales.x, 'X' );
	options.scales.y = getAxis( options.scales.y, 'Y' );
	options.scales.z = getAxis( options.scales.z, 'Z' );
/*
	options.scales.t = options.scales.t || {};
	options.scales.t.zoomMultiplier = options.scales.t.zoomMultiplier || 2;
	options.scales.t.offset = options.scales.t.offset || 1;
	options.scales.t.name = options.scales.t.name || 'T';
	options.scales.t.min = options.scales.t.min !== undefined ? options.scales.t.min : 0;
	options.scales.t.max = options.scales.t.max !== undefined ? options.scales.t.max : 1;
*/
	const optionsDefault = {};
	optionsDefault.scales = JSON.parse( JSON.stringify( options.scales ) );
	Object.freeze( optionsDefault );

	options.scales = cookie.copyObject( cookieName, optionsDefault.scales );
/*
	//Показать или скрыть ось времени
	//Допустим сначала я не хотел показывать ось времени. тоесть установил options.scales.t = undefined
	//В куках ось времени не сохранится
	//Теперь я захотел показать ось времени options.scales.t = {}
	//сейчас после чтения AxesHelper куков у меня будет options.scales.t = undefined
	//потму что до этого оси времени в куках не было и ось времени не будет отображаться
	//Для решения проблемы сохраняем в t состояние оси времени которое приходит из моей программы
	var t = options.scales.t;

	options.scales = cookie.copyObject( cookieName, optionsDefault.scales );

	//Показать или скрыть ось времени
	//
	//Если в куках не было оси времени options.scales.t = undefined и t != undefined
	//то устанавливаем options.scales.t равным значаеию из моей прогаммы. Другими словами надо отобразить ось времени
	//
	//Если в куках была ось времени options.scales.t != undefined но из программы не нужно отображать ось времни t = undefined
	//То приравниваем options.scales.t = undefined
	//
	//Если в куках была ось времени options.scales.t != undefined и из программы нужно отображать ось времни t != undefined
	//то оставляем значение оси времени options.scales.t из куков
	//
	//Если в куках не было ось времени options.scales.t = undefined и из программы не нужно отображать ось времни t = undefined
	//то ничего не приравниваем и остается options.scales.t = undefined
	if ( ( options.scales.t === undefined ) || ( t === undefined ) )
		options.scales.t = t;
	if ( options.onChangeScaleT !== undefined )
		options.onChangeScaleT( options.scales.t );

	return { t: t, optionsDefault: optionsDefault, }
*/
	return { optionsDefault: optionsDefault, }

}
