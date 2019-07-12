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
		options.onerror('duplicate downloading of the ' + src + ' file');
		return;
	}
	if (src instanceof Array) {
		var error,
		    optionsItem = {
			appendTo: options.appendTo,
			tag: options.tag,
			onload: function (response, url) {
				console.log('loadScript.onload: ' + url);
			},
			onerror: function (str) {
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
		if (isScriptExists(options.appendTo, srcAsync, options.onload)) return;
		loadScriptBase(function (script) {
			script.setAttribute("id", srcAsync);
			function _onload() {
				if (options.onload !== undefined) {
					if (src instanceof Array && isrc < src.length - 1) {
						isrc++;
						async(src[isrc]);
					} else options.onload();
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
		if (child.id == srcAsync) {
			if (onload !== undefined) onload();
			return true;
		}
	}
	return false;
}

var loadScript = {
  sync: sync$1,
  async: async
};

function create(create3Dobjects, options) {
			options = options || {};
			function onloadScripts() {
						if (WEBGL.isWebGLAvailable() === false) {
									document.body.appendChild(WEBGL.getWebGLErrorMessage());
									alert(WEBGL.getWebGLErrorMessage().innerHTML);
						}
						var elContainer = options.elContainer === undefined ? document.getElementById("containerDSE") : typeof options.elContainer === "string" ? document.getElementById(options.elContainer) : options.elContainer;
						if (elContainer === null) {
									elContainer = document.createElement('div');
									document.querySelector('body').appendChild(elContainer);
						}
						elContainer.innerHTML = loadFile.sync('http://localhost/nodejs/myThreejs/canvasContainer.html', {
									onload: function onload(response, url) {
												console.log('loadFile.onload: ' + url);
									}
						});
						elContainer = elContainer.querySelector('.container');
						var elCanvas = elContainer.querySelector('canvas');
						var camera, scene, renderer, controls, stereoEffect, group, playController;
						function createMenu() {
									if (typeof menuPlay !== 'undefined') menuPlay.create(elContainer, {
												stereoEffect: stereoEffect,
												playController: playController
									});
						}
						init();
						animate();
						createMenu();
						function init() {
									camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
									camera.position.set(0.4, 0.4, 2);
									scene = new THREE.Scene();
									scene.background = new THREE.Color(0x000000);
									scene.fog = new THREE.Fog(0x000000, 250, 1400);
									renderer = new THREE.WebGLRenderer({
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
															if (typeof menuPlay !== 'undefined') menuPlay.setSize(width, height);
												}, 0);
									};
									renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
									if (THREE.OrbitControls !== undefined) {
												controls = new THREE.OrbitControls(camera, renderer.domElement);
												controls.target.set(0, 0, 0);
												controls.update();
									}
									if (THREE.StereoEffect !== undefined) {
												stereoEffect = new THREE.StereoEffect(renderer, {
															spatialMultiplex: THREE.StereoEffectParameters.spatialMultiplexsIndexs.Mono,
															far: camera.far,
															camera: camera,
															stereoAspect: 1,
															rememberSize: true,
															onFullScreen: function onFullScreen(fullScreen) {
																		setFullScreenButton(fullScreen);
															},
															cookie: THREE.cookie
												});
												stereoEffect.options.spatialMultiplex = THREE.StereoEffectParameters.spatialMultiplexsIndexs.Mono;
									}
									var light = new THREE.PointLight(0xffffff, 1);
									light.position.copy(new THREE.Vector3(1, 1, 1));
									scene.add(light);
									light = new THREE.PointLight(0xffffff, 1);
									light.position.copy(new THREE.Vector3(-2, -2, -2));
									scene.add(light);
									group = new THREE.Group();
									scene.add(group);
									if (typeof dat !== 'undefined') {
												var gui = new dat.GUI({
															autoPlace: false
												});
												if (gui.__closeButton.click !== undefined)
															gui.__closeButton.click();
												document.getElementById('my-gui-container').appendChild(gui.domElement);
												if (typeof controllerPlay !== "undefined") {
															var colorRed = new THREE.Color(0xff0000);
															playController = controllerPlay.create(group, {
																		onShowObject3D: function onShowObject3D(objects3DItem, index) {
																					objects3DItem.visible = true;
																					if (typeof menuPlay !== "undefined") menuPlay.setIndex(index);
																		},
																		onHideObject3D: function onHideObject3D(objects3DItem) {
																					objects3DItem.visible = false;
																		},
																		onSelectedObject3D: function onSelectedObject3D(objects3DItem, index) {
																					objects3DItem.material.color = colorRed;
																					objects3DItem.visible = true;
																					if (typeof menuPlay !== "undefined") menuPlay.setIndex(index);
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
															gui.add(playController);
												}
									}
									create3Dobjects(group);
									if (stereoEffect !== undefined && typeof gui !== 'undefined') THREE.gui.stereoEffect(gui, stereoEffect.options, {
												gui: gui,
												stereoEffect: stereoEffect
									});
									window.addEventListener('resize', onResize, false);
						}
						function onResize() {
									var size = new THREE.Vector2();
									renderer.getSize(size);
									camera.aspect = size.x / size.y;
									camera.updateProjectionMatrix();
									if (typeof se === 'undefined') renderer.setSize(size.x, size.y);else stereoEffect.setSize(size.x, size.y);
						}
						function animate() {
									requestAnimationFrame(animate);
									render();
						}
						function render() {
									if (typeof stereoEffect === 'undefined') renderer.render(scene, camera);else stereoEffect.render(scene, camera);
						}
						var timeoutControls;
						function setFullScreenButton(fullScreen) {
									var elMenuButtonFullScreen = document.getElementById('menuButtonFullScreen');
									if (elMenuButtonFullScreen === null) return;
									if (fullScreen === undefined) fullScreen = !(stereoEffect === undefined || !stereoEffect.isFullScreen());
									if (fullScreen) {
												elMenuButtonFullScreen.innerHTML = '⤦';
												elMenuButtonFullScreen.title = 'Non Full Screen';
									} else {
												elMenuButtonFullScreen.innerHTML = '⤢';
												elMenuButtonFullScreen.title = 'Full Screen';
									}
						}
			}
			var optionsStyle = {
						tag: 'style',
						onload: function onload(response, url) {
									console.log('loadScript.onload: ' + url);
						}
			};
			var arrayScripts = [
			"https://raw.githack.com/anhr/three.js/dev/examples/js/WebGL.js"];
			if (options.menuPlay) {
						arrayScripts.push("https://raw.githack.com/anhr/menuPlay/master/build/menuPlay.min.js");
			}
			if (options.orbitControls) arrayScripts.push("https://raw.githack.com/anhr/three.js/dev/examples/js/controls/OrbitControls.js");
			if (options.dat) {
						loadScript.sync('https://raw.githack.com/anhr/DropdownMenu/master/styles/gui.css', optionsStyle);
						loadScript.sync('https://raw.githack.com/anhr/DropdownMenu/master/styles/menu.css', optionsStyle);
						arrayScripts.push("https://raw.githack.com/anhr/three.js/dev/examples/js/libs/dat.gui.min.js");
						if (options.controllerPlay) {
									arrayScripts.push("https://raw.githack.com/anhr/controllerPlay/master/build/controllerPlay.min.js");
						}
			}
			if (options.stereoEffect) {
						arrayScripts.push("https://raw.githack.com/anhr/three.js/dev/examples/js/effects/StereoEffect.js");
			}
			loadScript.sync(arrayScripts, {
						onload: onloadScripts,
						onerror: function onerror(str, e) {
									console.error(str);
						}
			});
}

export { create };
//# sourceMappingURL=myThreejs.module.js.map
