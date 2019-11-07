# myThreejs

node.js version of the myThreejs.

I use myThreejs into my projects for displaying of my 3D objects in the canvas.
[Example](https://raw.githack.com/anhr/myThreejs/master/Examples/html/).

Uses in my projects:
 * [DropdownMenu](https://github.com/anhr/DropdownMenu)
 * [controllerPlay](https://github.com/anhr/controllerPlay)

## Packaged Builds
The easiest way to use myThreejs in your code is by using the built source at `build/myThreejs.js`. These built JavaScript files bundle all the necessary dependencies to run controllerPlay.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/myThreejs/master/build/myThreejs.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/myThreejs/master/build/myThreejs.min.js"></script>
```
or you can import myThreejs from myThreejs.js file in your JavaScript module. [Example.](https://raw.githack.com/anhr/myThreejs/master/Examples/html/)
```
import myThreejs from 'https://raw.githack.com/anhr/myThreejs/master/myThreejs.js';
```

Now you can use window.myThreejs in your javascript code.

### myThreejs.create( createXDobjects, options )

Creates new canvas with my 3D objects.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [events.onShowObject3D] | <code>callback</code> |  | The show 3D object event. callback function ( objects3DItem, index ) objects3DItem: showed mesh, index: index of showed mesh.|
| createXDobjects | <code>callback</code> |  | creates my 3D objects |
| [options] | <code>object</code> |  | followed options is available: |
 * @param {HTMLElement|string} [options.elContainer] 
| [options.elContainer] | <code>HTMLElement|string</code> | document.getElementById( "containerDSE" ) or a div element, child of body. | If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui. If a string, then is id of the HTMLElement.|
 * @param {any} [options.orbitControls] use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
 * @param {boolean} [options.orbitControlsGui] true - displays the orbit controls gui.
 * Available only if options.orbitControls is defined. Default is false.
 * @param {boolean} [options.axesHelperGui] true - displays the AxesHelper gui. Default is false.
 * @param {Object} [options.stereoEffect] use stereoEffect.
 * @param {Object} [options.stereoEffect.StereoEffect] https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
 * @param {Object} [options.stereoEffect.spatialMultiplexsIndexs] https://en.wikipedia.org/wiki/DVB_3D-TV
 * @param {boolean} [options.dat] true - use dat-gui JavaScript Controller Library. https://github.com/dataarts/dat.gui
 * @param {boolean} [options.menuPlay] true - use my dropdown menu for canvas in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D objects in my projects.
 * See nodejs\menuPlay\index.js
 * @param {object} [options.player] 3D objects animation.
 * @param {number} [options.player.min] Animation start time. Default is 0.
 * @param {number} [options.player.max] Animation end time. Default is 1.
 * @param {object} [options.canvas] canvas properties
 * @param {number} [options.canvas.width] width of the canvas
 * @param {number} [options.canvas.height] height of the canvas
 * @param {object} [options.axesHelper] axesHelper options. Default the axes is not visible
 * @param {object} [options.axesHelper.scales] axes scales. See three.js\src\helpers\AxesHelper.js
 * @param {object} [options.t] time options
 * @param {number} [options.a] Can be use as 'a' parameter of the Function. See arrayFuncs for details. Default is 1.
 * @param {number} [options.b] Can be use as 'b' parameter of the Function. See arrayFuncs for details. Default is 0.
 * @param {number} [options.point] point settings.
 * @param {number} [options.point.size] point size. Default is 0.05.
 * @param {object} [options.scales] axes scales. Default is {}
 * @param {object} [options.scales.w] w axis scale options of 4D objects. Default is {}
 * @param {string} [options.scales.w.name] axis name. Default is "W".
 * @param {number} [options.scales.w.min] Minimum range of the w axis. Default is 0.
 * @param {number} [options.scales.w.max] Maximum range of the w axis. Default is 100.

**Example.**  
```
<script>
group = new THREE.Group();
group.add( new THREE.Points( ... ) );
group.add( new THREE.Mesh( ... ) );

var gui = new dat.GUI();
var colorRed = new THREE.Color( 0xff0000 );
gui.add( controllerPlay.create( group, {

	onShowObject3D: function ( objects3DItem ) {

		objects3DItem.visible = true;

	},
	onHideObject3D: function ( objects3DItem ) {

		objects3DItem.visible = false;//hide object3D

	},
	onSelectedObject3D: function ( objects3DItem ) {

		objects3DItem.material.color = colorRed;
		objects3DItem.visible = true;

	},
	onRestoreObject3D: function ( objects3DItem ) {

		objects3DItem.material.color = objects3DItem.userData.color;
		objects3DItem.visible = true;

	},
	onRenamePlayButton: function ( name, title ) {

		var elMenuButtonPlay = document.getElementById( 'menuButtonPlay' );
		elMenuButtonPlay.innerHTML = name;
		elMenuButtonPlay.title = title;

	},
	onRenameRepeatButton: function ( title, color ) {

		var elMenuButtonRepeat = document.getElementById( 'menuButtonRepeat' );
		elMenuButtonRepeat.style.color = color;;
		elMenuButtonRepeat.title = title;

	},

} ) );
</script>
```

## Directory Contents

```
└── build - Compiled source code.
```

## Building your own DropdownMenu

In the terminal, enter the following:

```
$ npm install
$ npm run build
```

## npm scripts

- npm run build - Build development and production version of scripts.


## On the following browsers have been successfully tested:

Windows 10

	IE 11

	Microsoft Edge 41

	Chrome 74

	Opera 60

	Safari 5.1.7 "Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>"

	FireFox 56

Android 6.0.1

	Chrome 74 

	Samsung Galaxy S5 incorrect slider width

	FireFox 67 incorrect slider width

	Opera 52

	Opera Mini 43

LG Smart tv

	Chrome - init failed! WeekMap is not defined


## Thanks
The following libraries / open-source projects were used in the development of DropdownMenu:
 * [Rollup](https://rollupjs.org)
 * [Node.js](http://nodejs.org/)
 * [three.js](https://threejs.org/)

 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
