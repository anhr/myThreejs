/**
 * 3D objects animation.
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

import cookie from '../../cookieNodeJS/master/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';

import ScaleController from '../../commonNodeJS/master/ScaleController.js';
import PositionController from '../../commonNodeJS/master/PositionController.js';

/**
 * @callback onSelectScene
 * @param {number} index current index of the scene of the animation
 */

/**
 * @callback onChangeScaleT
 * @param {object} scale the updated time settings
 */

/**
 * 3D objects animation.
 * @param {object} options followed options is available
 * @param {number} [options.settings] time settings.
 * @param {number} [options.settings.marks] Number of scenes of 3D objects animation. Default is 2
 * @param {boolean} [options.settings.repeat] true - Infinitely repeating 3D objects animation. Default is false.
 * @param {number} [options.settings.zoomMultiplier] zoom multiplier of the time. Default is 1.1.
 * @param {number} [options.settings.offset] offset of the time. Default is 0.1.
 * @param {number} [options.settings.min] Animation start time. Default is 0.
 * @param {number} [options.settings.max] Animation end time. Default is 1.
 * @param {onChangeScaleT} [options.onChangeScaleT] event. User has updated the time settings.
 * @param {object} [options.cookie] Your custom cookie function for saving and loading of the Player settings. Default cookie is not saving settings.
 * @param {onSelectScene} onSelectScene event of the changing of scene during animation
 */
function Player( options, onSelectScene ) {

	var settings = options.settings || {};
/*	
	options.min = options.min || 0;
	options.max = options.max || 1;
	options.marks = options.marks || 2;
	options.repeat = options.repeat || false;
	options.interval = options.interval || 25;
//	options.controllers = [];
*/
	settings.min = settings.min || 0;
	settings.max = settings.max || 1;
	settings.marks = settings.marks || 2;
	settings.repeat = settings.repeat || false;
	settings.interval = settings.interval || 25;
	settings.zoomMultiplier = settings.zoomMultiplier || 1.1;
	settings.offset = settings.offset || 0.1;

	const axesDefault = JSON.parse( JSON.stringify( settings ) );
	Object.freeze( axesDefault );

	options.cookie = options.cookie || new cookie.defaultCookie();

	var selectSceneIndex = 0,//-1;
		_this = this;

	/**
	 * select scene for playing
	 * @param {number} index of the scene. Between 0 and settings.marks - 1
	 */
	this.selectScene = function( index ) {

		if ( index >= settings.marks )
			index = 0;
		else if ( index < 0 )
			index = settings.marks - 1;
		while ( selectSceneIndex !== index ) {
			if ( selectSceneIndex < index )
				selectSceneIndex++;
			else selectSceneIndex--;
			onSelectScene( selectSceneIndex );
		}
/*
		selectSceneIndex = index;
		onSelectScene( index );
*/

	}

	/**
	 * Go to next object 3D
	 */
	this.next = function() {

		_this.selectScene( selectSceneIndex + 1 );

	}

	/**
	 * Go to previous object 3D
	 */
	this.prev = function () {

		_this.selectScene( selectSceneIndex - 1 );

	}
	this.pushController = function ( controller ) {

		if ( ( controller.object !== undefined ) && ( controller.object.playRate !== undefined ) )
			controller.object.playRate = settings.interval;
		controllers.push( controller );

	}

	//Play/Pause

	this.controllers = [];
	var playing = false, controllers = this.controllers, time, timeNext,// settings = { interval: 25 },
		cookie = options.cookie, cookieName = 'Player' + ( options.cookieName || '' );

	options.cookie.getObject( cookieName, settings, settings );
//	cookie.getObject( cookieName, options, options );

	function RenamePlayButtons() {

		controllers.forEach( function ( controller ) {

			controller.onRenamePlayButtons( playing );

		} );

	}

	function play() {

		if ( ( selectSceneIndex === -1 ) || ( selectSceneIndex === settings.marks ) ) {

			selectSceneIndex = 0;

		}
		onSelectScene( selectSceneIndex );

	}

	function pause() {

		playing = false;
		RenamePlayButtons();

		time = undefined;

	}
	function isRepeat() {

		return settings.repeat;

	}

	function playNext() {

		selectSceneIndex++;
		if ( selectSceneIndex >= settings.marks ) {

			if ( isRepeat() )
				selectSceneIndex = 0;
			else {

				pause();
				return;

			}

		}
		play();

	}

	/**
	 * Animation of 3D object
	 * call from function animate()
	 */
	this.animate = function () {

		if ( time === undefined )
			return;
		var timeCur = new Date().getTime();
		if ( isNaN( timeNext ) )
			console.error( 'Player.animate: timeNext = ' + timeNext );
		if ( timeCur < timeNext )
			return;
		while ( timeCur > timeNext ) timeNext += 1000 / settings.interval;
		playNext();

	}
	/**
	 * User has clicked the Play ► / Pause ❚❚ button
	 */
	this.play3DObject = function() {

		if ( playing ) {

			pause();
			return;

		}

		playing = true;
		if ( selectSceneIndex >= settings.marks )
			selectSceneIndex = -1;
		playNext();
		RenamePlayButtons();
		controllers.forEach( function ( controller ) {

			if ( controller.controller !== undefined ) {

				settings.interval = controller.controller.getValue();
				return;

			}

		} );
		time = new Date().getTime();
		timeNext = time + 1000 / settings.interval;

	}

	/**
	 * User has clicked the repeat ⥀ button
	 */
	this.repeat = function () {

		settings.repeat = !settings.repeat;
		this.onChangeRepeat( settings.repeat );

	}

	this.getOptions = function () { return options; }
	this.getSettings = function () { return options.settings; }
	this.getSelectSceneIndex = function () { return selectSceneIndex; }


	function setSettings() {

//		options.cookie.setObject( cookieName, settings );
		cookie.setObject( cookieName, options.settings );
		options.onChangeScaleT( options.settings );

	}

	/**
	 * User has changed the rate of changing of animation scenes per second.
	 * @param {number} value new rate
	 */
	this.onChangeTimerId = function ( value ) {

		settings.interval = value;
		setSettings();
//		options.cookie.setObject( cookieName, settings );

	}

	/**
	 * Event of the changing of the rate of changing of animation scenes per second.
	 * @param {number} value new rate
	 */
	this.onChangeRepeat = function ( value ) {

		settings.repeat = value;
		this.controllers.forEach( function ( controller ) {

			controller.onChangeRepeat();

		} );

	}

	this.gui = function ( folder, getLanguageCode ) {

//		settings.t = scalesT;

		//Localization

		var lang = {

			player: 'Player',
			playerTitle: '3D objects animation.',

			min: 'Min',
			max: 'Max',

			marks: 'Frames',
			marksTitle: 'Player frames count',

			defaultButton: 'Default',
			defaultTitle: 'Restore default player settings.',

		};

		var languageCode = getLanguageCode === undefined ? 'en'//Default language is English
			: getLanguageCode();
		switch ( languageCode ) {

			case 'ru'://Russian language

				lang.player = 'Проигрыватель';
				lang.playerTitle = 'Анимация 3D объектов.';

				lang.min = 'Минимум';
				lang.max = 'Максимум';

				lang.marks = 'Кадры';
				lang.marksTitle = 'Количество кадров проигрывателя';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';

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

		//

		var fPlayer = folder.addFolder( lang.player );
		dat.folderNameAndTitle( fPlayer, lang.player, lang.playerTitle );

		var playController = this.PlayController;
/*
		let {default: controllerPlay } = await import('../../controllerPlay/master/controllerPlay.js');
		var playController = controllerPlay.create( this );//player );
		fPlayer.add( playController );
*/

		function scale() {

			var axes = options.settings, scaleControllers = {};
/*			
			const axesDefault = JSON.parse( JSON.stringify( axes ) );
			Object.freeze( axesDefault );
*/
			function onclick( customController, action ) {

				var zoom = customController.controller.getValue();

				axes.min = action( axes.min, zoom );
				//						axes.min *= zoom;
				scaleControllers.min.setValue( axes.min );

				axes.max = action( axes.max, zoom );
				//						axes.max *= zoom;
				scaleControllers.max.setValue( axes.max );
				setSettings();
				
			}

			scaleControllers.folder = fPlayer.addFolder( axes.name );

//			let {default: ScaleController }  = await import('../../commonNodeJS/master/ScaleController.js');
/*
			import('../../commonNodeJS/master/ScaleController.js')
			  .then(module => {

				var ScaleController = module.default;

			  })
			  .catch(err => {
				console.error( err.message );
			  });			
*/			  
			scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick, axes ) ).onChange( function ( value ) {

				axes.zoomMultiplier = value;
//				options.cookie.setObject( cookieName, options.scales );
				setSettings();

			} );

//			let {default: PositionController }  = await import('../../commonNodeJS/master/PositionController.js');
			var positionController = new PositionController( function ( shift ) {

				//			console.warn( 'shift = ' + shift );
				onclick( positionController, function ( value, zoom ) {

					value += shift;//zoom;
					return value;

				} );

			}, { settings: options.settings, getLanguageCode: getLanguageCode, } );
			scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

//				axes.positionOffset = value;
				axes.offset = value;
//				options.cookie.setObject( cookieName, options.scales );
				setSettings();

			} );

			//min
			scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) {

				setSettings();

			} );
			dat.controllerNameAndTitle( scaleControllers.min, lang.min );

			//max
			scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) {

				setSettings();

			} );
			dat.controllerNameAndTitle( scaleControllers.max, lang.max );

			//marks
			if ( axes.marks !== undefined ) {//w axis do not have marks

				scaleControllers.marks = dat.controllerZeroStep( scaleControllers.folder, axes, 'marks', function ( value ) {

					setSettings();

				} );
				dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
					axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

			}

			//Default button
			dat.controllerNameAndTitle( scaleControllers.folder.add( {

				defaultF: function ( value ) {

//					playController._controller.setValue( axesDefault.interval );
					playController.setValue( axesDefault.interval );
					
					axes.zoomMultiplier = axesDefault.zoomMultiplier;
					scaleControllers.scaleController.setValue( axes.zoomMultiplier );

					axes.offset = axesDefault.offset;
					scaleControllers.positionController.setValue( axes.offset );

					axes.min = axesDefault.min;
					scaleControllers.min.setValue( axes.min );

					axes.max = axesDefault.max;
					scaleControllers.max.setValue( axes.max );

					if ( axesDefault.marks !== undefined ) {

						axes.marks = axesDefault.marks;
						scaleControllers.marks.setValue( axes.marks );

					}

					setSettings();

//					onchangeWindowRange( windowRange, axes );
/*
					if ( guiParams.axesHelper !== undefined )
						guiParams.axesHelper.updateDotLines();
*/

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		}
		scale();

	}

}
export default Player;
