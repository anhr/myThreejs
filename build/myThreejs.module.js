/**
 * node.js version of the myThreejs
 *
 * I use myThreejs into my projects for displaying of my 3D objects in the canvas.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import { AxesHelper, Color, Fog, Group, PerspectiveCamera, PointLight, Raycaster, Scene, SpriteText, Vector2, Vector3, WebGLRenderer } from 'http://localhost/threejs/three.js/build/three.module.js';
import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
import OrbitControlsGui from 'http://localhost/threejs/nodejs/commonNodeJS/OrbitControlsGui.js';

function myRequest(options) {
	this.loadXMLDoc = function () {
		var req;
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();
			if (!req) throw "new XMLHttpRequest() failed!";
		} else if (window.ActiveXObject) {
			req = this.NewActiveXObject();
			if (!req) throw "NewActiveXObject() failed!";
		} else throw "myRequest.loadXMLDoc(...) failed!";
		return req;
	};
	this.NewActiveXObject = function () {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		} catch (e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.3.0");
		} catch (e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {}
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
		ErrorMessage('This browser does not support XMLHttpRequest. Probably, your security settings do not allow Web sites to use ActiveX controls installed on your computer. Refresh your Web page to find out the current status of your Web page or enable the "Initialize and script ActiveX controls not marked as safe" and "Run Active X controls and plug-ins" of the Security settings of the Internet zone of your browser.');
		return null;
	};
	this.XMLHttpRequestStart = function (onreadystatechange, async) {
		this.XMLHttpRequestStop();
		this.req.onreadystatechange = onreadystatechange;
		if ("onerror" in this.req) {
			this.req.onerror = function (event) {
				ErrorMessage("XMLHttpRequest error. url: " + this.url, false, false);
			};
		}
		this.XMLHttpRequestReStart(async);
	};
	this.getUrl = function () {
		if (typeof this.url == 'undefined' || this.url == null) {
			this.url = "XMLHttpRequest.xml";
		}
		return this.url + (this.params ? this.params : "");
	};
	this.XMLHttpRequestReStart = function (async) {
		try {
			if (typeof async == 'undefined') async = true;
			this.req.open("GET", this.getUrl(), async);
			if (async) {
				var timeout = (60 + 30) * 1000;
				if ("timeout" in this.req)
					this.req.timeout = timeout;
				if ("ontimeout" in this.req) this.req.ontimeout = function () {
					ErrorMessage('XMLHttpRequest timeout', false, false);
				};else {
					clearTimeout(this.timeout_id_SendReq);
					this.timeout_id_SendReq = setTimeout(function () {
						ErrorMessage('XMLHttpRequest timeout 2', false, false);
					}, timeout);
				}
			}
			this.req.send(null);
		} catch (e) {
			ErrorMessage(e.message + " url: " + this.url, false, false);
		}
	};
	this.XMLHttpRequestStop = function () {
		if (this.req == null) return;
		this.req.abort();
	};
	this.ProcessReqChange = function (processStatus200) {
		var req = this.req;
		switch (req.readyState) {
			case 4:
				{
					if (typeof req.status == "unknown") {
						consoleError('typeof XMLHttpRequest status == "unknown"');
						return true;
					}
					if (req.status == 200)
						{
							clearTimeout(this.timeout_id_SendReq);
							return processStatus200(this);
						}
					else {
							ErrorMessage("Invalid XMLHttpRequest status : " + req.status + " url: " + this.url);
						}
				}
				break;
			case 1:
			case 2:
			case 3:
				break;
			case 0:
			default:
				throw "processReqChange(); req.readyState = " + req.readyState;
				break;
		}
		return true;
	};
	this.processStatus200Error = function () {
		var error = this.GetElementText('error', true);
		if (error) {
			ErrorMessage(error);
			return true;
		}
		return false;
	};
	this.GetElementText = function (tagName, noDisplayErrorMessage) {
		var xmlhttp = this.req;
		if (!xmlhttp.responseXML) {
			if (noDisplayErrorMessage != true) ErrorMessage('GetXMLElementText(xmlhttp, ' + tagName + '); xmlhttp.responseXML is null.\nxmlhttp.responseText:\n' + xmlhttp.responseText);
			return null;
		}
		var element = xmlhttp.responseXML.getElementsByTagName(tagName);
		if (element.length == 0) {
			if (noDisplayErrorMessage != true) ErrorMessage('GetXMLElementText(xmlhttp, "' + tagName + '"); element.length == ' + element.length);
			return "";
		}
		var text = "";
		for (var i = 0; i < element.length; i++) {
			if (typeof element[i].textContent == 'undefined') {
				if (typeof element[i].text == 'undefined') {
					ErrorMessage('GetXMLElementText(xmlhttp, ' + tagName + '); element[' + i + '].text) == undefined');
					return '';
				}
				if (text != "") text += " ";
				text += element[i].text;
			} else text += element[i].textContent;
		}
		return text;
	};
	if (options.data) {
		this.req = options.data.req;
		this.url = options.data.url;
		this.params = options.data.params;
	} else {
		try {
			this.req = this.loadXMLDoc();
		} catch (e) {
			var message;
			if (typeof e.message == 'undefined') message = e;else message = e.message;
			ErrorMessage("Your browser is too old and is not compatible with our site.\n\n" + window.navigator.appName + " " + window.navigator.appVersion + "\n\n" + message);
			return;
		}
	}
	if (!this.req) {
		consoleError("Invalid myRequest.req: " + this.req);
		return;
	}
	function ErrorMessage(error) {
		console.error(error);
		options.onerror(error);
	}
}
function sync(url, options) {
	options = options || {};
	options.onload = options.onload || function () {};
	options.onerror = options.onerror || function () {};
	var response,
	    request = new myRequest(options);
	request.url = url;
	request.XMLHttpRequestStart(function () {
		request.ProcessReqChange(function (myRequest) {
			if (myRequest.processStatus200Error()) return;
			response = myRequest.req.responseText;
			console.log('loadFile.sync.onload() ' + url);
			options.onload(response, url);
			return;
		});
	}, false
	);
	return response;
}

function sync$1(src, options) {
	options = options || {};
	options.onload = options.onload || function () {};
	options.onerror = options.onerror || function () {};
	options.appendTo = options.appendTo || document.getElementsByTagName('head')[0];
	if (isScriptExists(options.appendTo, src)) {
		options.onload();
		return;
	}
	if (src instanceof Array) {
		var error,
		    optionsItem = {
			appendTo: options.appendTo,
			tag: options.tag,
			onload: function onload(response, url) {
				console.log('loadScript.sync.onload: ' + url);
			},
			onerror: function onerror(str) {
				options.onerror(str);
				error = str;
			}
		};
		for (var i = 0; i < src.length; i++) {
			var item = src[i];
			loadScriptBase(function (script) {
				script.setAttribute("id", item);
				script.innerHTML = sync(item, optionsItem);
			}, optionsItem);
			if (error !== undefined) break;
		}
		if (error === undefined) options.onload();
	} else loadScriptBase(function (script) {
		script.setAttribute("id", src);
		script.innerHTML = sync(src, options);
	}, options);
}
function async(src, options) {
	options = options || {};
	options.appendTo = options.appendTo || document.getElementsByTagName('head')[0];
	options.onload = options.onload || function () {};
	var isrc;
	function async(srcAsync) {
		function next() {
			if (src instanceof Array && isrc < src.length - 1) {
				isrc++;
				async(src[isrc]);
			} else options.onload();
		}
		if (isScriptExists(options.appendTo, srcAsync, options.onload)) {
			next();
			return;
		}
		loadScriptBase(function (script) {
			script.setAttribute("id", srcAsync);
			function _onload() {
				console.log('loadScript.async.onload() ' + srcAsync);
				if (options.onload !== undefined) {
					next();
				}
			}
			if (script.readyState && !script.onload) {
				script.onreadystatechange = function () {
					if (script.readyState == "complete") {
						if (options.onload !== undefined) options.onload();
					}
					if (script.readyState == "loaded") {
						setTimeout(options.onload, 0);
						this.onreadystatechange = null;
					}
				};
			} else {
				script.onload = _onload;
				script.onerror = function (e) {
					var str = 'loadScript: "' + this.src + '" failed';
					if (options.onerror !== undefined) options.onerror(str, e);
					console.error(str);
				};
			}
			script.src = srcAsync;
		}, options);
	}
	if (src instanceof Array) {
		isrc = 0;
		async(src[isrc]);
	} else async(src);
}
function loadScriptBase(callback, options) {
	options.tag = options.tag || {};
	if (typeof options.tag === "string") {
		switch (options.tag) {
			case 'style':
				options.tag = {
					name: 'style',
					attribute: {
						name: 'rel',
						value: 'stylesheet'
					}
				};
				break;
			default:
				console.error('Invalid options.tag: ' + options.tag);
				return;
		}
	}
	options.tag.name = options.tag.name || 'script';
	var script = document.createElement(options.tag.name);
	options.tag.attribute = options.tag.attribute || {};
	options.tag.attribute.name = options.tag.attribute.name || "type";
	options.tag.attribute.value = options.tag.attribute.value || 'text/javascript';
	script.setAttribute(options.tag.attribute.name, options.tag.attribute.value);
	callback(script);
	options.appendTo.appendChild(script);
}
function isScriptExists(elParent, srcAsync, onload) {
	var scripts = elParent.querySelectorAll('script');
	for (var i = 0; i < scripts.length; i++) {
		var child = scripts[i];
		if (child.id === srcAsync) {
			return true;
		}
	}
	return false;
}

var loadScript = {
  sync: sync$1,
  async: async
};

var loadFile = {
  sync: sync
};

function isEnabled() {
	return navigator.cookieEnabled;
}
function set(name, value, cookie_date) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	value = value.toString();
	if (cookie_date === undefined) {
		cookie_date = new Date();
		cookie_date.setTime(cookie_date.getTime() + 1000 * 60 * 60 * 24 * 365);
	}
	document.cookie = name + "=" + value + (typeof settings == 'undefined' ? '' : settings) + "; expires=" + cookie_date.toGMTString();
	if (document.cookie === '') console.error('document.cookie is empty');
}
function setObject(name, object) {
	set(name, JSON.stringify(object));
}
function get(name, defaultValue) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	if (results) return unescape(results[2]);
	if (typeof defaultValue == 'undefined') return '';
	return defaultValue;
}
function getObject(name, options, optionsDefault) {
	new defaultCookie().getObject(name, options, copyObject(name, optionsDefault));
}
function copyObject(name, objectDefault) {
	return JSON.parse(get(name, JSON.stringify(objectDefault)));
}
function consoleCookieEnabled() {
	console.error('navigator.cookieEnabled = ' + navigator.cookieEnabled);
}
function defaultCookie(name) {
	this.get = function (defaultValue) {
		return defaultValue;
	};
	this.set = function () {};
	this.getObject = function (name, options, optionsDefault) {
		if (!optionsDefault) return;
		Object.keys(optionsDefault).forEach(function (key) {
			options[key] = optionsDefault[key];
		});
	};
	this.copyObject = function (name, objectDefault) {
		return JSON.parse(JSON.stringify(objectDefault));
	};
	this.setObject = function () {};
	this.isTrue = function (defaultValue) {
		return defaultValue;
	};
}

var cookie = {
  set: set,
  setObject: setObject,
  get: get,
  getObject: getObject,
  copyObject: copyObject,
  defaultCookie: defaultCookie
};

var debug = true;
var url = 'localhost/threejs';
var min = '';
function arrayContainersF() {
	var array = [];
	this.push = function (elContainer) {
		array.push(elContainer);
	};
	this.display = function (elContainer, fullScreen) {
		array.forEach(function (itemElContainer) {
			itemElContainer.style.display = itemElContainer === elContainer || !fullScreen ? 'block' : 'none';
		});
	};
}
var arrayContainers = new arrayContainersF();
var arrayCreates = [];
function create(create3Dobjects, options) {
	arrayCreates.push({
		create3Dobjects: create3Dobjects,
		options: options
	});
	if (arrayCreates.length > 1) return;
	options = options || {};
	options.scale = 1;
	function onloadScripts() {
		var elContainer = options.elContainer === undefined ? document.getElementById("containerDSE") : typeof options.elContainer === "string" ? document.getElementById(options.elContainer) : options.elContainer;
		if (elContainer === null) {
			elContainer = document.createElement('div');
			document.querySelector('body').appendChild(elContainer);
		}
		arrayContainers.push(elContainer);
		elContainer.innerHTML = loadFile.sync('https://raw.githack.com/anhr/myThreejs/master/canvasContainer.html');
		elContainer = elContainer.querySelector('.container');
		var elCanvas = elContainer.querySelector('canvas');
		var camera,
		    defaultCameraPosition = new Vector3(0.4, 0.4, 2),
		    scene,
		    renderer,
		    controls,
		    stereoEffect,
		    group,
		    playController,
		    canvasMenu,
		    raycaster,
		    INTERSECTED = [],
		    scale = options.scale,
		    axesHelper,
		    colorsHelper = 0x80;
		var mouse = new Vector2(),
		intersects;
		elCanvas.addEventListener('mousemove', onDocumentMouseMove, false);
		elCanvas.addEventListener('mousedown', onDocumentMouseDown, false);
		init();
		animate();
		function init() {
			camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
			camera.position.copy(defaultCameraPosition);
			scene = new Scene();
			scene.background = new Color(0x000000);
			scene.fog = new Fog(0x000000, 250, 1400);
			renderer = new WebGLRenderer({
				antialias: true,
				canvas: elCanvas
			});
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSizeOld = renderer.setSize;
			renderer.setSize = function (width, height, updateStyle) {
				renderer.setSizeOld(width, height, updateStyle);
				timeoutControls = setTimeout(function () {
					elContainer.style.height = elCanvas.style.height;
					elContainer.style.width = elCanvas.style.width;
					elContainer.style.left = elCanvas.style.left;
					elContainer.style.top = elCanvas.style.top;
					elContainer.style.position = elCanvas.style.position;
					if (canvasMenu !== undefined) canvasMenu.setSize(width, height);
				}, 0);
			};
			renderer.setSize(options.canvas !== undefined && options.canvas.width !== undefined ? options.canvas.width : elCanvas.clientWidth, options.canvas !== undefined && options.canvas.height !== undefined ? options.canvas.height : elCanvas.clientHeight);
			if (options.stereoEffect) {
				stereoEffect = new options.stereoEffect.StereoEffect(renderer, {
					spatialMultiplex: options.stereoEffect.spatialMultiplexsIndexs.Mono,
					far: camera.far,
					camera: camera,
					stereoAspect: 1,
					cookie: cookie,
					elParent: elCanvas.parentElement
				});
				stereoEffect.options.spatialMultiplex = options.stereoEffect.spatialMultiplexsIndexs.Mono;
			}
			var light = new PointLight(0xffffff, 1);
			light.position.copy(new Vector3(1, 1, 1));
			scene.add(light);
			light = new PointLight(0xffffff, 1);
			light.position.copy(new Vector3(-2, -2, -2));
			scene.add(light);
			group = new Group();
			scene.add(group);
			if (options.dat && (options.controllerPlay || options.stereoEffect)) {
				var gui = new dat.GUI({
					autoPlace: false
				});
				if (gui.__closeButton.click !== undefined)
					gui.__closeButton.click();
				elContainer.querySelector('#my-gui-container').appendChild(gui.domElement);
			}
			if (options.controllerPlay) {
				var colorRed = new Color(0xff0000);
				playController = controllerPlay.create(group, {
					onShowObject3D: function onShowObject3D(objects3DItem, index) {
						objects3DItem.visible = true;
						if (canvasMenu !== undefined) canvasMenu.setIndex(index);
					},
					onHideObject3D: function onHideObject3D(objects3DItem) {
						objects3DItem.visible = false;
					},
					onSelectedObject3D: function onSelectedObject3D(objects3DItem, index) {
						objects3DItem.material.color = colorRed;
						objects3DItem.visible = true;
						if (canvasMenu !== undefined) canvasMenu.setIndex(index);
					},
					onRestoreObject3D: function onRestoreObject3D(objects3DItem) {
						objects3DItem.material.color = objects3DItem.userData.color;
						objects3DItem.visible = true;
					},
					onRenamePlayButton: function onRenamePlayButton(name, title) {
						var elMenuButtonPlay = document.getElementById('menuButtonPlay');
						if (elMenuButtonPlay === null) return;
						elMenuButtonPlay.innerHTML = name;
						elMenuButtonPlay.title = title;
					},
					onRenameRepeatButton: function onRenameRepeatButton(title, color) {
						var elMenuButtonRepeat = document.getElementById('menuButtonRepeat');
						if (elMenuButtonRepeat === null) return;
						elMenuButtonRepeat.title = title;
					}
				});
				if (gui !== undefined) gui.add(playController);
			}
			create3Dobjects(group);
			if (stereoEffect !== undefined && typeof gui !== 'undefined') var spatialMultiplexsIndexs = options.stereoEffect.spatialMultiplexsIndexs;
			stereoEffect.gui(gui, {
				getLanguageCode: getLanguageCode,
				gui: gui,
				stereoEffect: stereoEffect,
				onChangeMode: function onChangeMode(mode) {
					var fullScreen = true;
					switch (mode) {
						case spatialMultiplexsIndexs.Mono:
							fullScreen = false;
							break;
						case spatialMultiplexsIndexs.SbS:
						case spatialMultiplexsIndexs.TaB:
							break;
						default:
							console.error('myThreejs: Invalid spatialMultiplexIndex = ' + mode);
							return;
					}
					rendererSizeDefault.onFullScreenToggle(!fullScreen);
				}
			});
			if (options.menuPlay) {
				canvasMenu = new menuPlay.create(elContainer, {
					stereoEffect: { stereoEffect: stereoEffect, spatialMultiplexsIndexs: options.stereoEffect.spatialMultiplexsIndexs },
					playController: playController,
					onFullScreenToggle: function onFullScreenToggle() {
						return rendererSizeDefault.onFullScreenToggle();
					},
					onFullScreen: function onFullScreen(fullScreen, elContainer) {
						rendererSizeDefault.onFullScreenToggle(!fullScreen);
					}
				});
				options.canvasMenu = canvasMenu;
			}
			if (options.orbitControls) {
				controls = new options.orbitControls(camera, renderer.domElement);
				controls.target.set(scene.position.x * 2, scene.position.y * 2, scene.position.z * 2);
				controls.update();
			}
			if (options.axesHelper) {
				axesHelper = new AxesHelper(1 * scale, {
					cookie: cookie,
					scene: scene,
					negativeAxes: true,
					colors: colorsHelper / 0xff,
					colorsHelper: colorsHelper,
					scales: options.axesHelper.scales
				});
				scene.add(axesHelper);
				if (controls !== undefined) controls.update();
				axesHelper.gui(gui, {
					getLanguageCode: getLanguageCode,
					cookie: cookie,
					lang: {
						languageCode: 'ru',
						axesHelper: 'Оси координат',
						negativeAxes: 'Минусовые оси',
						negativeAxesTitle: 'Отображать отрицательные оси.',
						scales: 'Шкалы',
						displayScales: 'Показать',
						displayScalesTitle: 'Показать или скрыть шкалы осей координат.',
						min: 'Минимум',
						max: 'Максимум',
						marks: 'Риски',
						marksTitle: 'Количество отметок на шкале',
						defaultButton: 'Восстановить',
						defaultTitle: 'Восстановить настройки осей координат по умолчанию.',
						zoom: 'Масштаб',
						in: 'увеличить',
						out: 'уменьшить',
						wheelZoom: 'Прокрутите колесико мыши для изменения масштаба',
						offset: 'Сдвиг',
						add: 'добавить',
						subtract: 'вычесть',
						wheelPosition: 'Прокрутите колесико мыши для изменения позиции'
					}
				});
			}
			if (gui !== undefined) {
				if (options.orbitControlsGui === true) OrbitControlsGui(gui, controls, {
					getLanguageCode: getLanguageCode,
					scales: options.axesHelper.scales
				});
				dat.controllerNameAndTitle(gui.add({
					defaultF: function defaultF(value) {
						controls.target = new Vector3();
						camera.position.copy(defaultCameraPosition);
						controls.object.position.copy(camera.position);
						controls.update();
					}
				}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
			}
			group.children.forEach(function (item) {
				if (item.userData.raycaster !== undefined) {
					if (raycaster === undefined) {
						raycaster = new Raycaster();
						raycaster.params.Points.threshold = item.material.size / 3;
						raycaster.setStereoEffect({
							renderer: renderer,
							camera: camera,
							stereoEffect: stereoEffect,
							onIntersection: function onIntersection(intersects) {
								intersects.forEach(function (intersection) {
									if (intersection.object.userData.raycaster !== undefined) {
										intersection.object.userData.raycaster.onIntersection(raycaster, intersection, scene, intersection.object);
										INTERSECTED.push(intersection.object);
									}
								});
							},
							onIntersectionOut: function onIntersectionOut(intersects) {
								if (INTERSECTED.length === 0) return;
								INTERSECTED.forEach(function (intersection) {
									intersection.userData.raycaster.onIntersectionOut(scene, intersection);
								});
								while (INTERSECTED.length > 0) {
									INTERSECTED.pop();
								}
							},
							onMouseDown: function onMouseDown(intersects) {
								var intersection = intersects[0];
								if (intersection.object.userData.raycaster !== undefined && intersection.object.userData.raycaster.onMouseDown !== undefined) {
									intersection.object.userData.raycaster.onMouseDown(raycaster, intersection, scene);
								}
								if (intersection.object.type === "Points") {
									axesHelper.exposePosition(raycaster.stereo.getPosition(intersection, true));
								}
							}
						});
					}
					raycaster.stereo.addParticle(item);
				}
			});
			function getRendererSize() {
				var style = {
					position: renderer.domElement.style.position,
					left: renderer.domElement.style.left,
					top: renderer.domElement.style.top,
					width: renderer.domElement.style.width,
					height: renderer.domElement.style.height
				},
				    sizeOriginal = new Vector2();
				renderer.getSize(sizeOriginal);
				return {
					onFullScreenToggle: function onFullScreenToggle(fullScreen) {
						var size = new Vector2();
						renderer.getSize(size);
						if (fullScreen === undefined) fullScreen = size.x === window.innerWidth && size.y === window.innerHeight;
						if (fullScreen) {
							renderer.setSize(sizeOriginal.x, sizeOriginal.y);
							renderer.domElement.style.position = style.position;
							renderer.domElement.style.left = style.left;
							renderer.domElement.style.top = style.top;
							renderer.domElement.style.width = style.width;
							renderer.domElement.style.height = style.height;
						} else {
							renderer.setSize(window.innerWidth, window.innerHeight);
							renderer.domElement.style.position = 'fixed';
							renderer.domElement.style.left = 0;
							renderer.domElement.style.top = 0;
							renderer.domElement.style.width = '100%';
							renderer.domElement.style.height = '100%';
						}
						camera.aspect = size.x / size.y;
						camera.updateProjectionMatrix();
						fullScreen = !fullScreen;
						arrayContainers.display(elContainer.parentElement, fullScreen);
						if (canvasMenu !== undefined) canvasMenu.setFullScreenButton(fullScreen);
						return fullScreen;
					}
				};
			}
			var rendererSizeDefault = getRendererSize();
			window.addEventListener('resize', onResize, false);
		}
		function onResize() {
			var size = new Vector2();
			renderer.getSize(size);
			camera.aspect = size.x / size.y;
			camera.updateProjectionMatrix();
			if (typeof se === 'undefined') renderer.setSize(size.x, size.y);else stereoEffect.setSize(size.x, size.y);
		}
		function onDocumentMouseMove(event) {
			if (raycaster.stereo !== undefined) raycaster.stereo.onDocumentMouseMove(event);else {
				event.preventDefault();
				var left = renderer.domElement.offsetLeft,
				    top = renderer.domElement.offsetTop,
				    size = new Vector2();
				renderer.getSize(size);
				mouse.x = event.clientX / size.x * 2 - 1 - left / size.x * 2;
				mouse.y = -(event.clientY / size.y) * 2 + 1 + top / size.y * 2;
			}
			if (event.buttons != 1) return;
			render();
		}
		function onDocumentMouseDown(event) {
			if (raycaster.stereo !== undefined) raycaster.stereo.onDocumentMouseDown(event);else {
				raycaster.setFromCamera(mouse, camera);
				intersects = raycaster.intersectObjects(particles);
				if (intersects.length > 0) {
					var intersection = intersects[0],
					    position = getPosition(intersection);
					alert('You are clicked the "' + intersection.object.type + '" type object.' + (intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.') + ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )');
				}
			}
		}
		function animate() {
			requestAnimationFrame(animate);
			render();
		}
		function render() {
			if (typeof stereoEffect === 'undefined')
				renderer.render(scene, camera);else stereoEffect.render(scene, camera);
			if (raycaster.stereo === undefined) {
				raycaster.setFromCamera(mouse, camera);
				intersects = raycaster.intersectObjects(group.children);
				if (intersects.length > 0) onIntersection(intersects);else onIntersectionOut(intersects);
			}
		}
		var timeoutControls;
		arrayCreates.shift();
		var params = arrayCreates.shift();
		if (params === undefined) return;
		create(params.create3Dobjects, params.options);
	}
	var optionsStyle = {
		tag: 'style'
	};
	var arrayScripts = [];
	if (options.menuPlay) {
		arrayScripts.push(debug ? "http://" + url + "/nodejs/menuPlay/build/menuPlay.js" : "https://raw.githack.com/anhr/menuPlay/master/build/menuPlay." + min + "js");
	}
	if (options.dat) {
		loadScript.sync(debug ? 'http://' + url + '/nodejs/dropdownMenu/styles/gui.css' : 'https://raw.githack.com/anhr/DropdownMenu/master/styles/gui.css', optionsStyle);
		loadScript.sync(debug ? 'http://' + url + '/nodejs/dropdownMenu/styles/menu.css' : 'https://raw.githack.com/anhr/DropdownMenu/master/styles/menu.css', optionsStyle);
	}
	if (options.controllerPlay) {
		arrayScripts.push(debug ? "http://" + url + "/nodejs/controllerPlay/build/controllerPlay.js" : "https://raw.githack.com/anhr/controllerPlay/master/build/controllerPlay." + min + "js");
	}
	if (arrayScripts.length > 0) {
		loadScript.async(arrayScripts, {
			onload: onloadScripts,
			onerror: function onerror(str, e) {
				console.error(str);
			}
		});
	} else onloadScripts();
}
var spriteTextIntersectionName = 'spriteTextIntersection';
function findSpriteTextIntersection(scene) {
	var spriteTextIntersection;
	scene.children.forEach(function (item) {
		if (item.type === "Sprite" && item.name === spriteTextIntersectionName) {
			spriteTextIntersection = item;
			return;
		}
	});
	return spriteTextIntersection;
}
function addSpriteTextIntersection(raycaster, intersection, scene) {
	var spriteTextIntersection = findSpriteTextIntersection(scene);
	if (spriteTextIntersection !== undefined) return;
	var textColor = 'rgb( 128, 128, 128 )',
	    position = raycaster.stereo === undefined ? getPosition(intersection) : raycaster.stereo.getPosition(intersection, true);
	if (findSpriteTextIntersection(scene)) return;
	spriteTextIntersection = new SpriteText('x: ' + position.x + ' y: ' + position.y + ' z: ' + position.z, {
		textHeight: 0.1,
		fontColor: textColor,
		rect: {
			displayRect: true,
			borderThickness: 3,
			borderRadius: 10,
			borderColor: textColor,
			backgroundColor: 'rgba( 0, 0, 0, 1 )'
		},
		position: position.multiply(intersection.object.scale),
		center: new Vector2(0.5, 0)
	});
	spriteTextIntersection.name = spriteTextIntersectionName;
	spriteTextIntersection.scale.divide(scene.scale);
	scene.add(spriteTextIntersection);
}
function removeSpriteTextIntersection(scene) {
	var detected = false;
	do {
		var spriteTextIntersection = findSpriteTextIntersection(scene);
		if (spriteTextIntersection !== undefined) {
			scene.remove(spriteTextIntersection);
			if (detected) console.error('Duplicate spriteTextIntersection');
			detected = true;
		}
	} while (spriteTextIntersection !== undefined);
}
var lang = {
	defaultButton: 'Default',
	defaultTitle: 'Restore Orbit controls settings.'
};
switch (getLanguageCode()) {
	case 'ru':
		lang.defaultButton = 'Восстановить';
		lang.defaultTitle = 'Восстановить положение осей координат по умолчанию.';
		break;
}

export { create, addSpriteTextIntersection, removeSpriteTextIntersection };
//# sourceMappingURL=myThreejs.module.js.map
