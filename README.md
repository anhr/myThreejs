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
| createXDobjects | <code>callback</code> |  | creates my 3D objects. callback function ( group ) group: [group](https://threejs.org/docs/index.html#api/en/objects/Group) of my 3d or 4d objects. |
| [options] | <code>object</code> |  | followed options is available: |
| [options.elContainer] | <code>HTMLElement or string</code> | document.getElementById( "containerDSE" ) or a div element, child of body. | If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui. If a string, then is id of the HTMLElement.|
| [options.orbitControls] | <code>object</code> |  | use [orbitControls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls) allow the camera to orbit around a target.|
| [options.orbitControls.gui] | <code>boolean</code> | false | true - displays the orbit controls gui. |
| [options.axesHelper] | <code>boolean</code> | false | true - displays the AxesHelper. |
| [options.axesHelperGui] | <code>boolean</code> | false | true - displays the AxesHelper gui. |
| [options.stereoEffect] | <code>boolean</code> | false | true - use [stereoEffect](https://github.com/anhr/three.js/blob/dev/examples/jsm/effects/StereoEffect.js). |
| [options.dat] | <code>boolean</code> | false | true - use [dat.gui](https://github.com/dataarts/dat.gui) JavaScript Controller Library. |
| [options.menuPlay] | <code>boolean</code> | false | true - use my dropdown menu for canvas in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D objects in my projects. |
| [options.player] | <code>object</code> |  | 3D objects animation. |
| [options.player.min] | <code>number</code> | 0 | Animation start time. |
| [options.player.max] | <code>number</code> | 1 | Animation end time. |
| [options.canvas] | <code>object</code> |  | canvas properties. |
| [options.canvas.width] | <code>number</code> |  | width of the canvas. |
| [options.canvas.height] | <code>number</code> |  | height of the canvas. |
| [options.a] | <code>number</code> | 1 | Can be use as 'a' parameter of the Function. See [arrayFuncs](https://github.com/anhr/myThreejs#arrayfuncs-item) for details. |
| [options.b] | <code>number</code> | 0 | Can be use as 'b' parameter of the Function. See [arrayFuncs](#arrayfuncs-item) for details. |
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

### myThreejs.Points( arrayFuncs, options, pointsOptions )

Displaying points.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arrayFuncs | <code>array of THREE.Vector4 or THREE.Vector3 or THREE.Vector2 or object</code> |  | points.geometry.attributes.position array |
| [options] | <code>object</code> |  | followed options is available: |
| [options.elContainer] | <code>HTMLElement or string</code> | document.getElementById( "containerDSE" ) or a div element, child of body. | If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui. If a string, then is id of the HTMLElement.|

 ### arrayFuncs item

 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * Function - position of the point is function of the t. Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 * if arrayFuncs.length === 0 then push new THREE.Vector3().
 * 
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   name: point name
 * }
 * @param {object} options see myThreejs.create options for details
 * @param {object} [pointsOptions] followed points options is availablee:
 * @param {number} [pointsOptions.tMin] start time. Uses for playing of the points. Default is 0.
 * @param {string} [pointsOptions.name] Name of the points. Used for displaying of items of the Select drop down control of the Meshs folder of the dat.gui. Default is "".
 * @param {THREE.Vector3} [pointsOptions.position] position of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * Vector's x, y, z is position of the points.
 * Can be as:
 * float - position of the points.
 * [float] - array of positions of the points.
 * Function - position of the points is function of the t. Example: new Function( 't', 'return 0.1 + t' )
 * @param {THREE.Vector3} [pointsOptions.scale] scale of the points. Default is new THREE.Vector3( 1, 1, 1 ).
 * Vector's x, y, z is scale of the points.
 * Can be as:
 * float - scale of the points.
 * [float] - array of scales of the points.
 * Function - scale of the points is function of the t. Example: new Function( 't', 'return 1.1 + t' )
 * @param {THREE.Vector3} [pointsOptions.rotation] rotation of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * Vector's x, y, z is rotation of the points.
 * Can be as:
 * float - rotation of the points.
 * [float] - array of rotations of the points.
 * Function - rotation of the points is function of the t. Example: new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' )

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
