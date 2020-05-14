//frustumPoints
//#define M_PI 3.1415926535897932384626433832795
//#define debug_version
attribute float size;
varying vec4 vColor;
uniform float pointSize;

//Cloud Points. See frustumPoints.create.cloud.editShaderText function for details. Example: uniform vec4 CP0_0;
%cloudPoints

uniform vec3 cameraPositionDefault;//Начальное положение камеры. Это значение не меняется когда пользователь поворачиват камеру
uniform vec4 cameraQuaternion;

#ifdef debug_version
void debug(float value)
{
	int red = 1;//positive value is red square
	int green = 0;
	if(value < 0.)
	{
		red = 0;
		green = 1;//negative value is green square
		value = - value;
	}
	gl_PointSize =  value;
	vColor = vec4(red,green,0,1);
}
#endif

vec3 pointPosition;
float w = 0.;

//distance to cloud point
void DTCP(vec4 cloudPoint){
	float distance = distance( cloudPoint.xyz, pointPosition);//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml
	float dmax = 0.3;
	distance = - distance / dmax + 1.;
	if( distance < 0. )
		distance = 0.;
	w += distance;
}
void main() {
	//////////////////////////////////////////////
	//default uniforms and attributes: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

	//default vertex attributes provided by Geometry and BufferGeometry
	//vec3 position: attribute vec3 position

	//vec3 cameraPosition = camera position in world space. Меняется с поворотом камеры
	//mat4 modelViewMatrix = camera.matrixWorldInverse * object.matrixWorld
	//mat4 projectionMatrix = camera.projectionMatrix Represents the information how to project the scene to clip space. Вычисляется из left, width, top, height, near, far усеченной пирамиды frustum перед камерой
	//mat4 viewMatrix = camera.matrixWorldInverse  The view matrix - the inverse of the Camera's matrixWorld.
	//////////////////////////////////////////////

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

	vec3 cPosition = vec3(position.x + cameraPositionDefault.x, position.y + cameraPositionDefault.y, position.z + cameraPositionDefault.z );
//	vec3 cPosition = vec3(position.x + cameraPosition.x, position.y + cameraPosition.y, position.z + cameraPosition.z );

	//Rotate position
	//https://stackoverflow.com/questions/9037174/glsl-rotation-with-a-rotation-vector
	cPosition = cPosition + 2.0*cross(cameraQuaternion.xyz, cross(cameraQuaternion.xyz, cPosition) + cameraQuaternion.w * cPosition);
	gl_Position = projectionMatrix * mvPosition;

#ifdef debug_version
//debug(50.0 * cameraQuaternion.w);
//	debug(10.0 * cPosition.z);
//	debug(20.0 * cameraRotationDefault.y);
//	debug(10.0 * position.z);
//	debug(10.0 * cameraPositionDefault.z);
//	debug(10.0 * gl_Position.x);
//	debug(100.0 * texture2D( cloudPoints, vec2( 0., 0. ) ).z);
//	debug(100.0 * cloudPoints0.z);
	debug(10.0 * cameraPosition.z);
/*
#ifdef quaternion_version 
	vec3 p = vec3(1,0,0);
	//////////////////////////////////////////////
	//https://stackoverflow.com/questions/9037174/glsl-rotation-with-a-rotation-vector
	quaternion = cameraQuaternion;

	//rotate the quaternion vector to 180 degrees for subtract of the camera rotation from the current vector
	quaternion.x = -quaternion.x;
	quaternion.y = -quaternion.y;
	quaternion.z = -quaternion.z;

	p = p + 2.0*cross(quaternion.xyz, cross(quaternion.xyz, p) + quaternion.w * p);
	//////////////////////////////////////////////
	debug(10.0 * p.x);
#else
	vec3 p = rotate_vertex_position(vec3(1,0,0), vec3(1,0,0), + cameraRotation.x);//rotate around X
//	cPosition = rotate_vertex_position(cPosition, vec3(0,1,0), + cameraRotation.y);//rotate around Y
	debug(10.0 * p.x);
#endif
*/
#endif
	pointPosition = vec3( cPosition.x, cPosition.y, cPosition.z );
#ifndef debug_version
	vColor = vec4(1,1,1,1);
#endif

	//distance to cloud points. See frustumPoints.create.cloud.editShaderText function for details. Example: DTCP(CP0_0);
%DTCP

	if ( w > 1. ){//перегрузка непрозрачности
#ifndef debug_version
		vColor.g = 0.;
		vColor.b = 0.;
#endif
		w = 1.;
	}
#ifndef debug_version
//	vColor = vec4(1,1,1,w);
	vColor.w = w;
	gl_PointSize = 2. * w + pointSize;
/*
	vColor = vec4(1,1,1,1);
	gl_PointSize = 4. * w;
*/
//	gl_PointSize = pointSize;
#endif

}
