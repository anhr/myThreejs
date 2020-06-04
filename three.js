//import * as THREE from 'https://threejs.org/build/three.module.js';

/*
import * as THREE from '../three.js.r116/build/three.module.js';
import { WEBGL } from '../three.js.r116/examples/jsm/WebGL.js';
import { OrbitControls } from '../three.js.r116/examples/jsm/controls/OrbitControls.js';
import { ConvexBufferGeometry } from '../three.js.r116/examples/jsm/geometries/ConvexGeometry.js';
*/
import * as THREE from '../../three.js/dev/build/three.module.js';
import { WEBGL } from '../../three.js/dev/examples/jsm/WebGL.js';
import { OrbitControls } from '../../three.js/dev/examples/jsm/controls/OrbitControls.js';
import { ConvexBufferGeometry } from '../../three.js/dev/examples/jsm/geometries/ConvexGeometry.js';
/*
import { StereoEffect, spatialMultiplexsIndexs } from '../myThreejs/master/Examples/jsm/effects/StereoEffect.js';
import { SpriteTextGui, SpriteText } from '../myThreejs/master/src/objects/SpriteText.js';
import { AxesHelper, AxesHelperOptions } from '../myThreejs/master/src/helpers/AxesHelper.js';
*/
import { StereoEffect, spatialMultiplexsIndexs } from './Examples/jsm/effects/StereoEffect.js';
import { SpriteTextGui, SpriteText } from './src/objects/SpriteText.js';
import { AxesHelper, AxesHelperOptions } from './src/helpers/AxesHelper.js';

Object.assign( THREE.BufferGeometry.prototype, {

	setFromPoints: function ( points, itemSize ) {

		itemSize = itemSize || 3;
		var position = [];

		for ( var i = 0, l = points.length; i < l; i++ ) {

			var point = points[i];
			position.push( point.x, point.y, point.z || 0 );
			if ( itemSize >= 4 )
				position.push( point.w || 0 );

		}

		this.setAttribute( 'position', new THREE.Float32BufferAttribute( position, itemSize ) );

		return this;

	},

} );
/*
Object.assign( THREE.Vector4.prototype, {

	multiply: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
//		this.w *= v.w || 1;
		if ( v.w !== undefined )
			this.w *= v.w;

		return this;

	},

} );
*/
Object.assign( THREE.Vector4.prototype, {

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		if ( v.w !== undefined )
			this.w += v.w;

		return this;

	},

} );
export {

	THREE,
	WEBGL,
	OrbitControls,
	ConvexBufferGeometry,
	StereoEffect, spatialMultiplexsIndexs,
	SpriteText, SpriteTextGui,
	AxesHelper, AxesHelperOptions

}
