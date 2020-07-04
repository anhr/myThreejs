/**
 * MoveGroup
 *
 * change group's position and scale.
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

import ScaleController from '../../commonNodeJS/master/ScaleController.js';
import PositionController from '../../commonNodeJS/master/PositionController.js';
import Cookie from '../../cookieNodeJS/master/cookie.js';
import { THREE } from './three.js';
import { dat } from '../../commonNodeJS/master/dat.module.js';

/**
 * Change group's position and scale.
 * @param {any} group THREE group or scene
 * @param {object} [options] followed options is available
 * @param {object} [options.scales] axes scales. See AxesHelper( ... ) for details. Default is {}
 * @param {Cookie} [options.cookie] Your custom cookie function for saving and loading of the MoveGroup settings. Default cookie is not saving settings.
 * @param {string} [options.cookieName] Name of the cookie is "MoveGroup" + options.cookieName. Default is undefined.
 */
export function MoveGroup( group, options ) {

	options = options || {};
	options.scales = options.scales || {};

	function getScalePosition() {

		var scales = options.scales;
		var scale = new THREE.Vector3(
			Math.abs( scales.x.min - scales.x.max ) / 2,
			scales.y === undefined ? 1 : Math.abs( scales.y.min - scales.y.max ) / 2,
			scales.z === undefined ? 1 : Math.abs( scales.z.min - scales.z.max ) / 2
		),
			position = new THREE.Vector3(
				( scales.x.min + scales.x.max ) / 2,
//				( scales.x.max - scales.x.min ) / 2,
				scales.y === undefined ? 0 : ( scales.y.min + scales.y.max ) / 2,
				scales.z === undefined ? 0 : ( scales.z.min + scales.z.max ) / 2,
			);
		return {

			scale: scale,
			position: position,

		}

	}
	var scalePosition = getScalePosition();
	//group.scale.copy( new THREE.Vector3( 1, 1, 1 ).divide( scalePosition.scale ) );
//	scalePosition.position.multiply( group.scale );
	//group.position.copy( scalePosition.position );
	//group.position.add( scalePosition.position );
	//group.position.negate();
//group.position.x = -6;
	group.scale.copy( new THREE.Vector3( 1, 1, 1 ).divide( scalePosition.scale ) );
	scalePosition.position.multiply( group.scale );
	group.position.copy( scalePosition.position );
	group.position.negate();
//	group.scale.copy( new THREE.Vector3( 1, 1, 1 ).divide( scalePosition.scale ) );
//group.position.x = -1.75;

	let cookie = options.cookie || new Cookie.defaultCookie();
	const cookieName = 'MoveGroup' + ( options.cookieName ? '_' + options.cookieName : '' );
/*
	//Если я заморожу входной параметр options, то не смогу его модифицировать в другихчастях программы
	//Поэтому приходится делать копию options и ее замораживать
	const optionsDefault = JSON.parse( JSON.stringify( options ) );
	Object.freeze( optionsDefault );
	cookie.getObject( cookieName, options, optionsDefault );
*/
	let optionsGroup = {

		scale: group.scale,
		position: group.position,
		x: { zoomMultiplier: 1.2, offset: 0.1, },
		y: { zoomMultiplier: 1.2, offset: 0.1, },
		z: { zoomMultiplier: 1.2, offset: 0.1, },

	};
	const groupOptionsDefault = JSON.parse( JSON.stringify( optionsGroup ) );
/*	
	let groupOptionsDefault = {

		scale: new THREE.Vector3().copy( group.scale ),
		position: new THREE.Vector3().copy( group.position ),

	}
*/	
	Object.freeze( groupOptionsDefault );
	cookie.getObject( cookieName, optionsGroup, groupOptionsDefault );

	//move group from cookie
	group.scale.copy( optionsGroup.scale );
	group.position.copy( optionsGroup.position );

	//Restore optionsGroup from group
	//Если не восстановить optionsGroup из group, то после перемещения group это не будет сохраняться в cookie
	optionsGroup.scale = group.scale;
	optionsGroup.position = group.position;

	function setDefault( axisName ) {

		let scale = options.scales[axisName];
		if ( !scale )
			return;
		options.scales[axisName].default = function(){

//			group.scale[axisName] = groupOptionsDefault.scale[axisName];
			options.scalesControllers[axisName].scale.setValue( groupOptionsDefault.scale[axisName] );
			options.scalesControllers[axisName].scaleController.setValue( groupOptionsDefault[axisName].zoomMultiplier );
			options.scalesControllers[axisName].position.setValue( groupOptionsDefault.position[axisName] );
			options.scalesControllers[axisName].positionController.setValue( groupOptionsDefault[axisName].offset );
//			optionsGroup.zoomMultiplier = groupOptionsDefault.zoomMultiplier;
			cookie.setObject( cookieName, optionsGroup );

		}

	}
	setDefault( 'x' );
	setDefault( 'y' );
	setDefault( 'z' );
//cookie.setObject( cookieName, options );

//	let group = _group;
	this.gui = function ( gui, guiParams ) {

		guiParams = guiParams || {};

		//Localization

		var lang = {

			moveGroup: 'Move Group',
			scale: 'Scale',
			position: 'Position',

			defaultButton: 'Default',
			defaultTitle: 'Move axis to default position.',

		};

		var languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
			: guiParams.getLanguageCode();
		switch ( languageCode ) {

			case 'ru'://Russian language

				lang.moveGroup = 'Переместить группу'; scale
				lang.scale = 'Масштаб'; 
				lang.position = 'Позиция';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Переместить ось а исходное состояние.';

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

		if ( guiParams.lang )
			lang.moveGroup = guiParams.lang.moveGroup || lang.moveGroup;

		function axisZoom( axisName, action, zoom ) {

			let scale = options.scalesControllers[axisName].scale;
			if ( !scale )
				return;
			scale.setValue( action( scale.getValue(), zoom ) );
			cookie.setObject( cookieName, optionsGroup );

		}

		//

		//move group folder
		let fMoveGroup = gui.addFolder( lang.moveGroup );

		fMoveGroup.add( new ScaleController(
			function ( customController, action ) {

				let zoom = customController.controller.getValue();
				axisZoom( 'x', action, zoom );
				axisZoom( 'y', action, zoom );
				axisZoom( 'z', action, zoom );

			}, {

			settings: { zoomMultiplier: 1.1, },
			getLanguageCode: guiParams.getLanguageCode,

		} ) );

		function scale( axes, windowRange, scaleControllers,// axesDefault,
			axisName ) {

			if ( axes === undefined )
				return;//Not 3D AxesHelper

//			Object.freeze( axesDefault );

			function onclick( customController, action ) {

				var zoom = customController.controller.getValue();

				axisZoom( axisName, action, zoom );
				if ( guiParams.axesHelper !== undefined )
					guiParams.axesHelper.updateDotLines();

			}

			scaleControllers.folder = fMoveGroup.addFolder( axes.name );

			//Scale
			scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
				{ settings: optionsGroup[axisName], getLanguageCode: guiParams.getLanguageCode, } ) ).onChange( function ( value ) {

					optionsGroup[axisName].zoomMultiplier = value;
					cookie.setObject( cookieName, optionsGroup );
					if ( guiParams.axesHelper )
						guiParams.axesHelper.setSettings();

				} );
			scaleControllers.scale = dat.controllerZeroStep( scaleControllers.folder, group.scale, axisName, function ( value ) {

				console.warn ( 'scale.' + axisName + ' = ' + group.scale[axisName] );

//				onchangeWindowRange( windowRange );

			} );
			dat.controllerNameAndTitle( scaleControllers.scale, lang.scale );

			//Position
			var positionController = new PositionController( function ( shift ) {

				//			console.warn( 'shift = ' + shift );
				function onclick( customController, action ) {

					var offset = customController.controller.getValue();


					function axisOffset( axisName, action, offset ) {

						let position = options.scalesControllers[axisName].position;
						if ( !position )
							return;
						position.setValue( action( position.getValue(), offset ) );
						cookie.setObject( cookieName, optionsGroup );

					}
					axisOffset( axisName, action, offset );
					if ( guiParams.axesHelper !== undefined )
						guiParams.axesHelper.updateDotLines();

				}
				onclick( positionController, function ( value, zoom ) {

					value += shift;//zoom;
					return value;

				} );

			}, { settings: {}, getLanguageCode: guiParams.getLanguageCode, } );
			scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

				optionsGroup[axisName].offset = value;
				cookie.setObject( cookieName, optionsGroup );

			} );
			scaleControllers.position = dat.controllerZeroStep( scaleControllers.folder, group.position, axisName, function ( value ) {

//				console.warn( 'position.' + axisName + ' = ' + group.position[axisName] );

				//				onchangeWindowRange( windowRange );

			} );
			dat.controllerNameAndTitle( scaleControllers.position, lang.position );

			//Default button
			dat.controllerNameAndTitle( scaleControllers.folder.add( {

				defaultF: function ( value ) {

					axes.default();

/*					
					axes.min = axesDefault.min;
					scaleControllers.min.setValue( axes.min );

					axes.max = axesDefault.max;
					scaleControllers.max.setValue( axes.max );

					if ( axesDefault.marks !== undefined ) {

						axes.marks = axesDefault.marks;
						scaleControllers.marks.setValue( axes.marks );

					}

					onchangeWindowRange( windowRange, axes );
*/
					if ( guiParams.axesHelper !== undefined )
						guiParams.axesHelper.updateDotLines();

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		}
		options.scalesControllers = { x: {}, y: {}, z: {}, w: {} };//, t: {}, };
		function windowRange() {

			options.cookie.setObject( cookieName, options.scales );

		}
		if ( options.scales ) {

			scale( options.scales.x,
				guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeX, options.scalesControllers.x,// optionsDefault.scales.x,
				'x' );
			scale( options.scales.y,
				guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeY,
				options.scalesControllers.y,// optionsDefault.scales.y,
				'y' );
			scale( options.scales.z,
				guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeZ,
				options.scalesControllers.z,// optionsDefault.scales.z,
				'z' );
			
		}

		//default button
		var defaultParams = {

			defaultF: function ( value ) {

				if (options.scales.x) options.scales.x.default();
				if (options.scales.y) options.scales.y.default();
				if (options.scales.z) options.scales.z.default();
				
			},

		};
		dat.controllerNameAndTitle( fMoveGroup.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

	}

}
