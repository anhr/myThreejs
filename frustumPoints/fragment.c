//frustumPoints
uniform vec4 color;
uniform sampler2D pointTexture;
//uniform sampler2D cloudPoints;
//uniform vec3 cameraPosition;
//uniform float opacity;
varying vec4 vColor;
//float r = 0.0;
void main() {
/*
r = r + 0.001;
if(r > 1.0)
	r = 0.0;
*/
	vec4 color = vec4( vColor ) * texture2D( pointTexture, gl_PointCoord );
//	vec4 color = vec4( vColor ) * texture2D( cloudPoints, gl_PointCoord );
//color.r = 0.0;
	gl_FragColor = color;
//	gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );
}
