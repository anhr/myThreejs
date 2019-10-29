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

/**
 * @callback onSelectScene
 * @param {number} index current index of the scene of the animation
 */

/**
 * 3D objects animation.
 * @param {object} options followed options is available
 * @param {number} [options.marks] Number of scenes of 3D objects animation. Default is 2
 * @param {boolean} [options.repeat] true - Infinitely repeating 3D objects animation. Default is false
 * @param {number} [options.zoomMultiplier] zoom multiplier of the time axis. Default is 2
 * @param {number} [options.positionOffset] offset of the time axis. Default is 1
 * @param {string} [options.name] Time axis name. Default is "T". Available only if you use dat gui and the axes is visible (options.axesHelper of myThreejs.create is not undefined).
 * @param {number} [options.min] Animation start time. Default is 0.
 * @param {number} [options.max] Animation end time. Default is 1.
 * @param {Function|object} [options.cookie] Your custom cookie function for saving and loading of the Player settings. Default cookie is not saving settings.
 * @param {onSelectScene} onSelectScene
 */
function Player( options, onSelectScene ) {

	options.min = options.min || 0;
	options.max = options.max || 1;
	options.marks = options.marks || 2;
	options.repeat = options.repeat || false;
//	options.controllers = [];

	options.cookie = options.cookie || new cookie.defaultCookie();

	var selectSceneIndex = 0,//-1;
		_this = this;

	/**
	 * select scene for playing
	 * @param {number} index of the scene. Between 0 and options.marks - 1
	 */
	this.selectScene = function( index ) {

		if ( index >= options.marks )
			index = 0;
		else if ( index < 0 )
			index = options.marks - 1;
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
	var playing = false, controllers = this.controllers, time, timeNext, settings = { interval: 25 }, cookieName = 'Player';//, timerId

	options.cookie.getObject( cookieName, settings, settings );

	function RenamePlayButtons() {

		controllers.forEach( function ( controller ) {

			controller.onRenamePlayButtons( playing );

		} );

	}

	function play() {

		if ( ( selectSceneIndex === -1 ) || ( selectSceneIndex === options.marks ) ) {

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

		return options.repeat;

	}

	function playNext() {

		selectSceneIndex++;
		if ( selectSceneIndex >= options.marks ) {

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
	 * Use has clicked the Play ► / Pause ❚❚ button
	 */
	this.play3DObject = function() {

		if ( playing ) {

			pause();
			return;

		}

		playing = true;
		if ( selectSceneIndex >= options.marks )
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
	 * Use has clicked the repeat ⥀ button
	 */
	this.repeat = function () {

		options.repeat = !options.repeat;
		this.onChangeRepeat( options.repeat );

	}

	this.getOptions = function () { return options; }
	this.getSelectSceneIndex = function () { return selectSceneIndex; }

	/**
	 * User has changed the rate of changing of animation scenes per second.
	 * @param {number} value new rate
	 */
	this.onChangeTimerId = function ( value ) {

		settings.interval = value;
		options.cookie.setObject( cookieName, settings );

	}

	/**
	 * Event of the changing of the rate of changing of animation scenes per second.
	 * @param {number} value new rate
	 */
	this.onChangeRepeat = function ( value ) {

		options.repeat = value;
		this.controllers.forEach( function ( controller ) {

			controller.onChangeRepeat();

		} );

	}

}
export default Player;
