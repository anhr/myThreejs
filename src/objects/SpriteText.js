/**
 * A sprite based text component.
 * @author anhr / https://github.com/anhr/
*/

//Attenttion!!! Save this file as UTF-8 for localization

//Внимание!!! если я это сюда засуну, то размер файла three.module.js сильно разбухает
//и после нескольких сборок появлется ошибка:
/*
<--- Last few GCs --->

[20028:0000022CB0C5B5A0]    44050 ms: Mark-sweep 1296.6 (1354.1) -> 1296.5 (1322.6) MB, 1303.7 / 0.0 ms  last resort GC in old space requested
[20028:0000022CB0C5B5A0]    45339 ms: Mark-sweep 1296.5 (1322.6) -> 1296.5 (1322.6) MB, 1288.8 / 0.0 ms  last resort GC in old space requested


<--- JS stacktrace --->

==== JS stack trace =========================================

Security context: 00000347374A5EC1 <JSObject>
    1: anonymous( aka anonymous )[D: \My documents\MyProjects\webgl\three.js\GitHub\three.js\node_modules\rollup\dist\rollup.js: ~1066][pc = 000001C8B6D9F939]( this = 0000036FB5382311 < undefined >, loc = 0000026335D7B061 < String[8]: 11732595 >)
2: arguments adaptor frame: 3 -> 1
3: forEach( this = 0000036FB53D3E41<JSArray[2113121]>)
    5: clone[D: \My documents\MyProjects\webgl\three.js\G...

	FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
npm ERR! code ELIFECYCLE
npm ERR! errno 3
npm ERR! three@0.106.2 build: `rollup -c`
npm ERR! Exit status 3
npm ERR!
npm ERR! Failed at the three@0.106.2 build script.
npm ERR! This is probably not a problem with npm.There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     C: \Users\Andrej\AppData\Roaming\npm - cache\_logs\2019 - 08 - 04T10_31_25_309Z - debug.log
*/
//Мне кажется это происходит потому что в файле three.module.js создается несколько функций SpriteText
//в которые входит собственный экземляр THREE
//import { Sprite, SpriteMaterial, Texture, LinearFilter, Vector3, Vector2 } from "../../../build/three.module.js";
//import * as THREE from "../../../build/three.module.js";
import { THREE } from '../../../../nodejs/three.js';
/*
import { Sprite } from './Sprite.js';
import { SpriteMaterial } from '../materials/SpriteMaterial.js';
import { Texture } from '../textures/Texture.js';
import { LinearFilter } from '../constants.js';
import { Vector3 } from '../math/Vector3.js'; 
import { Vector2 } from '../math/Vector2.js';
*/
//import cookie from 'http://localhost/nodejs/cookieNodeJS/master/cookie.js';
import cookie from '../../../../cookieNodeJS/master/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';

/**
 * A sprite based text component.
 * @param {string} text The text to be displayed on the sprite.
 * @param {object} [options] followed options is available
 * @param {THREE.Vector3} [options.position] Position of the text. Default is new THREE.Vector3(0,0,0).
 * @param {number} [options.textHeight] The height of the text. Default is 1.
 * @param {string} [options.fontFace] CSS font-family - specifies the font of the text. Default is 'Arial'.
 * @param {string[]} [options.fontFaces] array of fontFaces. Example ['Arial', 'Verdana', 'Times'].
 * @param {string} [options.fontColor] RGBA object or RGB object or HEX value. Default is 'rgba(255, 255, 255, 1)'.
 *	Examples 'rgba(0, 0, 255, 0.5)', '#00FF00'.
 * @param {boolean} [options.bold] CSS font-weight. Equivalent of 700. Default is false.
 * @param {boolean} [options.italic] CSS font-style. Default is false.
 * @param {string} [options.fontProperties] Other font properties. The font property uses the same syntax as the CSS font property.
 * 	Default is empty string. Example "900", "oblique lighter".
 * @param {THREE.Vector2} [options.center] The text's anchor point.
 * 	A value of (0.5, 0.5) corresponds to the midpoint of the text.
 * 	A value of (0, 0) corresponds to the left lower corner of the text.
 * 	A value of (0, 1) corresponds to the left upper corner of the text.
 * 	Default is (0, 1).
 * @param {object} [options.rect] rectangle around the text.
 * @param {boolean} [options.rect.displayRect] true - the rectangle around the text is visible. Default is false.
 * @param {string} [options.rect.backgroundColor] background color. RGBA object or RGB object or HEX value
 * 	Default is 'rgba(0, 0, 0, 0)' - black transparent.
 * 	Examples 'rgba(0, 0, 255, 0.5)', '#00FF00'.
 * @param {string} [options.rect.borderColor] border color. RGBA object or RGB object or HEX value. Default is 'rgba(0, 255, 0, 1)' - green.
 * @param {number} [options.rect.borderThickness] border thickness. Default is 0 - no border.
 * @param {number} [options.rect.borderRadius] border radius. Default is 0 - no radius.
 * @param {Function|object} [options.cookie] Your custom cookie function for saving and loading of the SpriteText settings. Default cookie is not saving settings.
 * 	Or cookie can be an object
 * @param {Function} [options.cookie.cookie] Your custom cookie function.
 * @param {string} [options.cookie.name] name of the cookie. Default is 'SpriteText'.
 * 	You can specify different names of cookie for saving user settings for different SpriteText objects.
 * @param {object} [options.commonOptions] common options for two or more SpriteText objects. Default is undefined.
 * @see Thanks to / https://github.com/vasturiano/three-spritetext
 */
var SpriteText = function ( text, options ) {

	var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.Texture() } ) ),
		optionsDefault;

	//copy options to default options. User can restore of default options by click Default button in gui.
	if ( options !== undefined ) {

		optionsDefault = {};
		if ( options.commonOptions !== undefined ) {

			//сделал эту затычку для AxesHelper для случая когда я меняю масштаб по какой нибудь из осей.
			// В этом случае непонятно почему в options.commonOptions появляется новый элемент options.commonOptions.optionsDefault
			// который берется из AxesHelper.arraySpriteText.options
			if ( options.commonOptions.optionsDefault !== undefined )
				optionsDefault = options.commonOptions.optionsDefault;
			else copyObject( optionsDefault, options.commonOptions );

		} else copyObject( optionsDefault, options );

	}

	options = options || {};
	sprite.options = options;

	//copy to options a common options for two or more SpriteText objects
	copyObject( options, options.commonOptions );

	//saving options
	var cookieName =
		( options.commonOptions !== undefined ) &&
		( options.commonOptions.cookie !== undefined ) &&
		( options.commonOptions.cookie.name !== undefined ) ?
			options.commonOptions.cookie.name : 'SpriteText' + ( options.cookieName || '' );
	if ( ( options.commonOptions !== undefined ) && ( options.commonOptions.cookie !== undefined ) ) {

		if ( options.commonOptions.cookie.name === undefined )
			options.commonOptions.cookie.name = cookieName;
		options.cookie = options.commonOptions.cookie;

	}
	else options.cookie = 
		typeof options.cookie === "function" ? options.cookie = {

			cookie: options.cookie,
			name: cookieName,

		} : {

			cookie: options.cookie || new cookie.defaultCookie(),
			name: cookieName,

		};

	options.text = text;
	options.position = options.position || new THREE.Vector3( 0, 0, 0 );
	options.textHeight = options.textHeight || 1;
	options.fontFace = options.fontFace || 'Arial';
	options.bold = options.bold || false;
	options.italic = options.italic || false;
	options.fontProperties = options.fontProperties || '';
	options.rect = options.rect || {};
	options.rect.displayRect = options.rect.displayRect || false;
	options.fontColor = options.fontColor || 'rgba(255, 255, 255, 1)';
	options.center = options.center || new THREE.Vector2( 0, 1 );

	//Default options
	if ( optionsDefault )
		Object.keys( optionsDefault ).forEach( function ( key ) {

			if ( typeof optionsDefault[ key ] === "object" )
				Object.keys( optionsDefault[ key ] ).forEach( function ( key2 ) {

					optionsDefault[ key ][ key2 ] = options[ key ][ key2 ];

				} );
			else optionsDefault[ key ] = options[ key ];

		} );

	options.cookie.cookie.getObject( cookieName, options, optionsDefault );

	var canvas = document.createElement( 'canvas' );
	sprite.material.map.minFilter = THREE.LinearFilter;
	var fontSize = 90;
	const context = canvas.getContext( '2d' );

	var angleDistance = 1;
	sprite.userData.setSize = function ( cameraPosition, angle ) {

		var position = sprite.position,
			distance = new THREE.Vector3( position.x, position.y, position.z ).distanceTo( cameraPosition );
		angleDistance = angle * distance * 40;
		var textHeight = options.textHeight * angleDistance;
		sprite.scale.set( textHeight * canvas.width / canvas.height, textHeight );

	}
	sprite.update = function ( optionsUpdate ) {

		if ( optionsUpdate !== undefined )
			Object.keys( optionsUpdate ).forEach( function ( key ) {

				if ( typeof optionsUpdate[ key ] === "object" ) {

					Object.keys( optionsUpdate[ key ] ).forEach( function ( key2 ) {

						options[ key ][ key2 ] = optionsUpdate[ key ][ key2 ];

					} );

				} else options[ key ] = optionsUpdate[ key ];

			} );

		options.font = `${options.fontProperties ? options.fontProperties + ' ' : ''}${options.bold ? 'bold ' : ''}${options.italic ? 'italic ' : ''}${fontSize}px ${options.fontFace}`;

		context.font = options.font;

		var width = 0, linesCount = 1,
			lines;
		if ( typeof options.text === 'string' ) {

			linesCount = 0;
			lines = options.text.split( /\r\n|\r|\n/ );
			lines.forEach( function ( line ) {

				var lineWidth = context.measureText( line ).width;
				if ( width < lineWidth )
					width = lineWidth;
				linesCount += 1;

			} );

		} else width = context.measureText( options.text ).width;
		const textWidth = width;
//		const textWidth = context.measureText( options.text ).width;
		canvas.width = textWidth;
		canvas.height = fontSize * linesCount;

		context.font = options.font;

		//Rect
		//Thanks to http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html

		var borderThickness = options.rect.hasOwnProperty( "borderThickness" ) ?
			options.rect[ "borderThickness" ] : 0;
		if ( options.rect.displayRect ) {

			// background color
			context.fillStyle = options.rect.hasOwnProperty( "backgroundColor" ) ?
				options.rect[ "backgroundColor" ] : 'rgba(0, 0, 0, 0)';

			// border color
			context.strokeStyle = options.rect.hasOwnProperty( "borderColor" ) ?
				options.rect[ "borderColor" ] : 'rgba(0, 255, 0, 1)';

			context.lineWidth = borderThickness;

			// function for drawing rounded rectangles
			function roundRect( ctx, x, y, w, h, r ) {

				ctx.beginPath();
				ctx.moveTo( x + r, y );
				ctx.lineTo( x + w - r, y );
				ctx.quadraticCurveTo( x + w, y, x + w, y + r );
				ctx.lineTo( x + w, y + h - r );
				ctx.quadraticCurveTo( x + w, y + h, x + w - r, y + h );
				ctx.lineTo( x + r, y + h );
				ctx.quadraticCurveTo( x, y + h, x, y + h - r );
				ctx.lineTo( x, y + r );
				ctx.quadraticCurveTo( x, y, x + r, y );
				ctx.closePath();
				ctx.fill();
				ctx.stroke();

			}
			roundRect( context,
				borderThickness / 2,
				borderThickness / 2,
				canvas.width - borderThickness,
				canvas.height - borderThickness,
				options.rect.borderRadius === undefined ? 0 : options.rect.borderRadius
			);

		}

		context.fillStyle = options.fontColor;
		context.textBaseline = 'bottom';
		if ( linesCount > 1 ) {
			for ( var i = 0; i < lines.length; i++ ) {

				var line = lines[i];
				context.fillText( line, 0, canvas.height - ( ( lines.length - i - 1 ) * fontSize ) + 2 * borderThickness );

			}

		} else context.fillText( options.text, 0, canvas.height + 2 * borderThickness );

		// Inject canvas into sprite
		sprite.material.map.image = canvas;
		sprite.material.map.needsUpdate = true;

		if ( options.hasOwnProperty( 'textHeight' ) )
			sprite.scale.set( options.textHeight * angleDistance * canvas.width / canvas.height, options.textHeight * angleDistance );
		if ( options.hasOwnProperty( 'position' ) )
			sprite.position.copy( options.position );
		if ( options.hasOwnProperty( 'center' ) )
			sprite.center = options.center;

	};
	sprite.update();

	if ( optionsDefault !== undefined )
		sprite.options.optionsDefault = optionsDefault;

	return sprite;

};

/**
 * Adds SpriteText folder into gui.
 * @param {GUI} gui see https://github.com/dataarts/dat.gui/blob/master/API.md for details
 * @param {Sprite|Sprite[]} sprite sprite with text component, returned by new SpriteText(...) or array of sprites
 * If sprite is array of sprites, then you can add an options property into array of sprites.
 * Options property contains common properties for all items of array of sprites.
 * See options of the SpriteText for details.
 * @param {object} [guiParams] Followed parameters is allowed. Default is no parameters
 * @param {Function} [guiParams.getLanguageCode] Your custom getLanguageCode() function.
* returns the "primary language" subtag of the language version of the browser.
* Examples: "en" - English language, "ru" Russian.
* See the "Syntax" paragraph of RFC 4646 https://tools.ietf.org/html/rfc4646#section-2.1 for details.
* Default returns the 'en' is English language.
 * @param {object} [guiParams.lang] Object with localized language values
 * @param {GUI} [guiParams.parentFolder] parent folder, returned by gui.addFolder(name) https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+addFolder
 * @param {string} [guiParams.spriteFolder] sprite folder name. Default is lang.spriteText
 * @returns {GUI} sprite folder
 */
var SpriteTextGui = function ( gui, sprite, guiParams ) {

	var options = sprite.options || {},
		optionsCookie = {};
	if ( Array.isArray( sprite ) ) {

		var spriteOptions = sprite[0].options;

		//общие настройки options для всех элементов массива sprite приравниваю к настройкам первого элемента массива
		//для того, что бы они были равны общим настройкам выбранным пользователем, которые были сохранены в cookie.
		//Иначе при обновлении веб страницы обшие настройки в gui будут равны настройкам по умолчанию,
		//а сами элементы массива будут отображаться с настройкмии пользователя, которые были сохранены в cookie.
		//
		//Другми словами обшие настройки при открытии веб страницы должны быть равны общим настройками,
		//котрые выбрал пользователь во время предыдущего открытия веб сраницы.
		//
		//For testing open http://localhost/threejs/three.js/examples/webgl_sprites_text.html
		//Clear cookie.
		//Go to gui.
		//Open Sprite Array folder and change Height from 2 to 10.
		//Update web page
		//Now you can see Height = 10
		Object.keys( options ).forEach( function ( key ) {

			if ( key === "cookie" )
				return;
			if ( typeof options[key] === "object" )
				Object.keys( options[key] ).forEach( function ( key2 ) {

					options[key][key2] = spriteOptions[key][key2];

				} );
			else options[key] = spriteOptions[key];

		} );

		if ( options.optionsDefault === undefined )
			options.optionsDefault = spriteOptions.optionsDefault;

	}

	guiParams = guiParams || {};

	if ( options.cookie === undefined )
		options.cookie = function () {

			this.get = function ( defaultValue ) {

				// Default cookie is not loading settings
				return defaultValue;

			};

			this.set = function () {

				// Default cookie is not saving settings

			};

			this.isTrue = function ( defaultValue ) {

				return defaultValue;

			};

		};

	//Localization

	var lang = {

		spriteText: 'Sprite Text',

		text: 'Text',
		textTitle: 'The text to be displayed on the sprite.',

		textHeight: 'Height',
		textHeightTitle: 'Text Height.',

		fontFace: 'Font Face',
		fontFaceTitle: 'Choose text font.',

		bold: 'Bold',

		italic: 'Italic',

		fontProperties: 'Font Properties',
		fontPropertiesTitle: 'Other font properties. The font property uses the same syntax as the CSS font property.',

		fontStyle: 'Font Style',
		fontStyleTitle: 'Text style being used when drawing text. Read only.',

		displayRect: 'Rect',
		displayRectTitle: 'Display a rectangle around the text.',

		fontColor: 'Font Color',

		anchor: 'Anchor',
		anchorTitle: 'The text anchor point.',

		defaultButton: 'Default',
		defaultTitle: 'Restore default Sprite Text settings.',

	};

	var _languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
		: guiParams.getLanguageCode();
	switch ( _languageCode ) {

		case 'ru'://Russian language
			lang.spriteText = 'Текстовый спрайт';//'Sprite Text'

			lang.text = 'Текст';
			lang.textTitle = 'Текст, который будет отображен в спрайте.';

			lang.textHeight = 'Высота';
			lang.textHeightTitle = 'Высота текста.';

			lang.fontFace = 'Имя шрифта';
			lang.fontFaceTitle = 'Выберите шрифта текста.';

			lang.bold = 'Жирный';

			lang.italic = 'Наклонный';

			lang.fontProperties = 'Дополнительно';
			lang.fontPropertiesTitle = 'Дополнительные свойства шрифта. Свойство шрифта использует тот же синтаксис, что и свойство шрифта CSS.';

			lang.fontStyle = 'Стиль шрифта';
			lang.fontStyleTitle = 'Стиль шрифта, используемый при рисовании текста. Не редактируется.';

			lang.displayRect = 'Прямоугольник';
			lang.displayRectTitle = 'Отобразить прямоугольник вокруг текста.';

			lang.fontColor = 'Цвет шрифта';

			lang.anchor = 'Якорь';
			lang.anchorTitle = 'Точка привязки текста.';

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки текстового спрайта по умолчанию.';
			break;
		default://Custom language
			if ( ( guiParams.lang === undefined ) || ( guiParams.lang.languageCode != _languageCode ) )
				break;

			Object.keys( guiParams.lang ).forEach( function ( key ) {

				if ( lang[key] === undefined )
					return;
				lang[key] = guiParams.lang[key];

			} );

	}

	//

	function updateSpriteText() {

		if ( Array.isArray( sprite ) )
			sprite.forEach( function ( spriteItem ) {

				spriteItem.update( options );

			} );
		else sprite.update( options );

		if ( controllerFont !== undefined )
			controllerFont.setValue( options.font );

		copyObject( optionsCookie, options );
		options.cookie.cookie.setObject( options.cookie.name, optionsCookie );

	}

	if ( !guiParams.hasOwnProperty( 'parentFolder' ) )
		guiParams.parentFolder = gui;

	//Sprite folder
	var fSpriteText = guiParams.parentFolder.addFolder( guiParams.spriteFolder || lang.spriteText );//'Sprite Text'

	//Sprite text
	if ( options.hasOwnProperty( 'text' ) ) {

		optionsCookie['text'] = options.text;
		dat.controllerNameAndTitle(
			fSpriteText.add( options, 'text' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.text, lang.textTitle );

	}

	//Sprite text height
	var textHeight = 'textHeight';
	if ( options.hasOwnProperty( textHeight ) ) {

		optionsCookie[textHeight] = options.textHeight;
//		var textHeightDefault = options.textHeight;
		var textHeightDefault = options.optionsDefault.textHeight,
			min = textHeightDefault / 3,
			max = textHeightDefault * 3;
		dat.controllerNameAndTitle(
			fSpriteText.add( options, textHeight, min, max, ( max - min ) / 100 ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.textHeight, lang.textHeightTitle );

	}

	//font faces
	if ( options.fontFaces !== undefined ) {

		optionsCookie['fontFace'] = options.fontFace;
		dat.controllerNameAndTitle(
			fSpriteText.add( options, 'fontFace', options.fontFaces ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.fontFace, lang.fontFaceTitle );

	}

	//bold
	if ( options.hasOwnProperty( 'bold' ) ) {

		optionsCookie['bold'] = options.bold;
		dat.controllerNameAndTitle(
			fSpriteText.add( options, 'bold' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.bold );

	}

	//italic
	if ( options.hasOwnProperty( 'italic' ) ) {

		optionsCookie['italic'] = options.italic;
		dat.controllerNameAndTitle(
			fSpriteText.add( options, 'italic' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.italic );

	}

	//font properties
	if ( options.hasOwnProperty( 'fontProperties' ) ) {

		optionsCookie['fontProperties'] = options.fontProperties;
		dat.controllerNameAndTitle(
			fSpriteText.add( options, 'fontProperties' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.fontProperties, lang.fontPropertiesTitle );

	}

	//font style
	if ( options.hasOwnProperty( 'font' ) ) {

		optionsCookie['font'] = options.font;
		var controllerFont = fSpriteText.add( options, 'font' );
		controllerFont.__input.readOnly = true;
		dat.controllerNameAndTitle( controllerFont, lang.fontStyle, lang.fontStyleTitle );

	}

	//text rectangle
	if ( ( options.hasOwnProperty( 'rect' ) ) && ( options.rect.hasOwnProperty( 'displayRect' ) ) ) {

		optionsCookie['displayRect'] = options.displayRect;
		dat.controllerNameAndTitle( fSpriteText.add( options.rect, 'displayRect' ).onChange( function ( value ) {

			updateSpriteText();

		} ), lang.displayRect, lang.displayRectTitle );

	}

	//font сolor
	if ( options.hasOwnProperty( 'fontColor' ) ) {

		optionsCookie['fontColor'] = options.fontColor;
		dat.controllerNameAndTitle( fSpriteText.addColor( options, 'fontColor' ).onChange( function ( value ) {

			updateSpriteText();

		} ), lang.fontColor );

	}

	//anchor
	if ( options.hasOwnProperty( 'center' ) ) {

		optionsCookie['center'] = options.center;

		//anchor folder
		var fAnchor = fSpriteText.addFolder( 'center' );
		dat.folderNameAndTitle( fAnchor, lang.anchor, lang.anchorTitle );

		//anchor x
		fAnchor.add( options.center, 'x', 0, 1, 0.1 ).onChange( function ( value ) {

			updateSpriteText();

		} );

		//anchor y
		fAnchor.add( options.center, 'y', 0, 1, 0.1 ).onChange( function ( value ) {

			updateSpriteText();

		} );

	}
/*
	if ( guiParams.addControllers !== undefined )
		guiParams.addControllers( fSpriteText );
*/
	//default button
	var optionsDefault = options.optionsDefault,
		defaultParams = {
			defaultF: function ( value ) {

				function setValues( folder, key, optionsDefault ) {

					folder.__controllers.forEach( function ( controller ) {

						if ( controller.property !== key ) {

							if ( typeof optionsDefault[key] !== "object" )
								return;
							Object.keys( optionsDefault[key] ).forEach( function ( optionKey ) {

								if ( controller.property !== optionKey )
									return;
								controller.setValue( optionsDefault[key][optionKey] );

							} );
							return;

						}
						controller.setValue( optionsDefault[key] );

					} );

				}

				Object.keys( optionsDefault ).forEach( function ( key ) {

					setValues( fSpriteText, key, optionsDefault );

					Object.keys( fSpriteText.__folders ).forEach( function ( keyFolder ) {

						if ( keyFolder !== key )
							return;
						Object.keys( optionsDefault[keyFolder] ).forEach( function ( key ) {

							setValues( fSpriteText.__folders[keyFolder], key, optionsDefault[keyFolder] );

						} );

					} );

				} );
//				if ( guiParams.default !== undefined ) guiParams.default();

			},

		};
	if ( optionsDefault === undefined ) console.error( 'SpriteTextGui: optionsDefault = ' + optionsDefault );
	dat.controllerNameAndTitle( fSpriteText.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
	return fSpriteText;

};

export { SpriteText, SpriteTextGui };

function copyObject( dest, src ) {

	if ( src === undefined )
		return;
	Object.keys( src ).forEach( function ( key ) {

		if ( key === "cookie" )
			return;
		if ( typeof src[key] === "object" )
			Object.keys( src[key] ).forEach( function ( key2 ) {

				if ( dest[key] === undefined ) dest[key] = {};
				dest[key][key2] = src[key][key2];

			} );
		else dest[key] = src[key];

	} );

}
