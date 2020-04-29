//frustumPoints
//#define M_PI 3.1415926535897932384626433832795
#define quaternion_version
//#define debug_version
attribute float size;
//attribute vec4 ca;
varying vec4 vColor;
//uniform vec3 pointsPosition;
uniform float pointSize;
/*
uniform int cloudPointsCount;
uniform float v[1];
*/
//uniform vec2 dimensions[];
uniform sampler2D cloudPoints;
uniform vec4 cloudPoints0;
//uniform float cloudPoints0z;
//uniform int cloudPointsWidth;
uniform vec3 cameraPositionDefault;//Начальное положение камеры. Это значение не меняется когда пользователь поворачиват камеру

 #ifdef quaternion_version 
uniform vec4 cameraQuaternion;
//uniform vec4 cameraQuaternionDefault;
#else
uniform vec3 cameraRotation;//меняется когда пользователь поворачиват камеру
uniform vec3 cameraRotationDefault;//Начальный поворот камеры. Это значение не меняется когда пользователь поворачиват камеру
#endif

//uniform sampler2D pointTexture;
 #ifndef quaternion_version 
///////////////////////////////////////////////////
//https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
vec4 quat_from_axis_angle(vec3 axis, float angle)
{ 
  vec4 qr;
//  float half_angle = (angle * 0.5) * 3.14159 / 180.0;
  float half_angle = angle * 0.5;
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}
vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle)
{ 
  vec4 q = quat_from_axis_angle(axis, angle);
  vec3 v = position.xyz;
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}
/////////////////////////////////////////////////////
#endif
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

//I see:
//ERROR: 0:68: 'i' : Loop index cannot be compared with non-constant expression
//if cloudPointsWidth is not const
//For resolving of issue I am replace the cloudPointsWidth to the count of the cloud points
//after loading of this file and before including into THREE.ShaderMaterial.
//See 
//shaderText.vertex = shaderText.vertex.replace(...);
//in the function getShaderMaterialPoints(...)
const float cloudPointsWidth = %s;

vec3 pointPosition;
float w = 0.;

void distanceToCloudPoint(vec4 cloudPoint){
/*ERROR: 0:310: 'texelFetch' : no matching overloaded function found
	ivec2 texturePosition = ivec2(i,//point number
	0);
	vec4 cloudPoint = texelFetch( cloudPoints, texturePosition, 0 );
*/
//		float distance = distance( cloudPoint.xyz, position);//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml
//		vec3 cloudPoint = vec3( 0.0, 0.0, 0.0 );
/*
	float distance = 1.0 - distance( cloudPoint, position);//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml
	if ( distance < 0.0 )
		distance = 0.0;
*/
	//debug
//		float a = position.x - cloudPoint.x;
//		float a = distance( cloudPoint, position);//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml
//		float a = distance( cloudPoint.xyz - cameraPosition, position);//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml
//		float a = distance( vec3( 0.0, 0.0, 0.0 ), vec3( 1.0, 0.0, 0.0 ));

	//последняя хорошая версия
//		vec3 pointPosition = vec3( position.x, position.y, position.z + cameraPosition.z );

//float cosa = cos(10.);
//		vec3 pointPosition = vec3( mvPosition.x, mvPosition.y, mvPosition.z + cameraPosition.z );//Не вижу разницы между mvPosition и position
//		vec3 pointPosition = vec3( gl_Position.x + cameraPosition.x, gl_Position.y + cameraPosition.y, gl_Position.z + cameraPosition.z );
//		vec3 pointPosition = vec3( cPosition.x, cPosition.y, cPosition.z + cameraPosition.z );
//		vec3 pointPosition = vec3( position.x, position.y, position.z + cameraPosition.z );
/*
	//Хорошо если ось x смотрит точно на камеру для любой точки по оси x
	pointPosition.x += cloudPoint.x;
	pointPosition.z -= cloudPoint.x;
*/
	float distance = distance( cloudPoint.xyz, pointPosition);//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml

	//distance = 0
//		float distance = distance( cloudPoint.xyz, vec3(0., 0., 0. ));//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml

//		float distance = distance( cloudPoint.xyz, gl_Position.xyz);//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml
/*
	if( distance < 0. )
		distance = - distance;
	if( distance < 0. )
		distance = 0.;
*/
/*
if( distance < 0. )
{
//сюда не должно попадать
vColor = vec4(1,1,1,1);
gl_PointSize = 20.;
return;
}
*/

	float dmax = 0.3;
	distance = - distance / dmax + 1.;
	if( distance < 0. )
		distance = 0.;
	w += distance;
}
void main() {

	//ivec2 cloudPointsSize = textureSize( cloudPoints, 0 );
	//ERROR: 0:61: 'textureSize' : no matching overloaded function found
	//Похоже не поддерживается моей картой
	//https://cycling74.com/forums/share-v-modulejitter-shaders-for-fractals-2d-effects-and-for-3d-materials
//vec4 cloudPoint = texture2D( pointTexture, pointCoord );

//	vColor = ca;


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
//	vec4 cPosition = projectionMatrix * viewMatrix * vec4( position, 1.0 );
//	vec3 cPosition = rotate_vertex_position(position, vec3(0,1,0), cameraRotation.y);//rotate around Y
//	vec3 cPosition = rotate_vertex_position(position, vec3(0,1,0), ‭(3.14159 / 180.0) * 10.);//rotate around Y
//	vec3 cPosition = rotate_vertex_position(position, vec3(0,1,0), 0.17452);//rotate around Y
//	vec3 cPosition = rotate_vertex_position(position, vec3(0,1,0), 0.);//rotate around Y

/*сейчас поворачиваю вектор в коде javascript. See uniforms: function( uniforms ) in the frustumPoints.js
 #ifdef quaternion_version 
	vec3 cPositionDefault = cameraPositionDefault;
	//////////////////////////////////////////////
	//https://stackoverflow.com/questions/9037174/glsl-rotation-with-a-rotation-vector
	vec4 quaternionDefault = cameraQuaternionDefault;

	//rotate the quaternion vector to 180 degrees for subtract of the camera rotation from the current vector
	quaternionDefault.x = -quaternionDefault.x;
	quaternionDefault.y = -quaternionDefault.y;
	quaternionDefault.z = -quaternionDefault.z;

	cPositionDefault = cPositionDefault + 
		2.0*cross(quaternionDefault.xyz, cross(quaternionDefault.xyz, cPositionDefault) + quaternionDefault.w * cPositionDefault);
	//////////////////////////////////////////////
#else
float a = 0;
#endif
*/

	//работает когда ось z смотрит точно на камеру
	vec3 cPosition = vec3(position.x + cameraPositionDefault.x, position.y + cameraPositionDefault.y, position.z + cameraPositionDefault.z );

//	vec3 cPosition = vec3(position.x + cPositionDefault.x, position.y + cPositionDefault.y, position.z + cPositionDefault.z );

	//работает когда ось x смотрит точно на камеру
//	vec3 cPosition = vec3(position.x + cameraPositionDefault.z, position.y + cameraPositionDefault.y, position.z + cameraPositionDefault.x );

//	vec3 cPosition = vec3(position.z + cameraPosition.x, position.y + cameraPosition.y, position.x + cameraPosition.z );
 #ifdef quaternion_version 
	//////////////////////////////////////////////
	//https://stackoverflow.com/questions/9037174/glsl-rotation-with-a-rotation-vector
//	vec4 quaternion = cameraQuaternion;

	//rotate the quaternion vector to 180 degrees for subtract of the camera rotation from the current vector
/*
	quaternion.x = -quaternion.x;
	quaternion.y = -quaternion.y;
	quaternion.z = -quaternion.z;
*/
//	cPosition = cameraPosition + 2.0*cross(quaternion.xyz, cross(quaternion.xyz, cameraPosition) + quaternion.w * cameraPosition);
//	cPosition = cPosition + 2.0*cross(quaternion.xyz, cross(quaternion.xyz, cPosition) + quaternion.w * cPosition);
	cPosition = cPosition + 2.0*cross(cameraQuaternion.xyz, cross(cameraQuaternion.xyz, cPosition) + cameraQuaternion.w * cPosition);
	//////////////////////////////////////////////
#else
	//повернул cameraPosition на 90 градусов по оси y
	//теперь облако правильно становится когда поворачиваю камеру на - 90 градусов по оси y так что ось x смотрит точно на камеру
//	vec3 cPosition = rotate_vertex_position(cameraPosition, vec3(0,1,0), - M_PI / 2.);//rotate around Y

	//Хорошо повоачивается вокруг оси Y в пределах 180 градусов а потом облако уходит по оси z в положительном направлении
	//vec3 cPosition = rotate_vertex_position(cameraPosition, vec3(0,1,0), - cameraRotation.y);//rotate around Y

	//Хорошо поворачивантся вокруг оси X
	//vec3 cPosition = rotate_vertex_position(cameraPosition, vec3(1,0,0), - cameraRotation.x);//rotate around X

	//Хорошо поворачивантся по всем осям если ось z смотрит точно на камеру
/*
	vec3 cPosition = rotate_vertex_position(cameraPosition, vec3(1,0,0), - cameraRotation.x);//rotate around X
		 cPosition = rotate_vertex_position(	 cPosition, vec3(0,1,0), - cameraRotation.y);//rotate around Y
*/
	cPosition = rotate_vertex_position(cPosition, vec3(1,0,0), + cameraRotation.x);//rotate around X
	cPosition = rotate_vertex_position(cPosition, vec3(0,1,0), + cameraRotation.y);//rotate around Y

//	vec3 cPosition = cameraPosition;
#endif
//	vec3 cPosition = rotate_vertex_position(cameraPosition, vec3(0,1,0), 0.);//rotate around Y
	gl_Position = projectionMatrix * mvPosition;

#ifdef debug_version
//gl_PointSize =  10.0 * cloudPoint.z;
//gl_PointSize =  float(10 * cloudPointsWidth);
//gl_PointSize =  10.0 * cameraPosition.z;
//gl_PointSize =  300.0 * cameraRotation.z;
//gl_PointSize =  10.0 * position.x;
//gl_PointSize =  10.0 * mvPosition.x;
//gl_PointSize =  10.0 * cPosition.x;
//debug(50.0 * cameraQuaternion.w);
//	debug(10.0 * cPosition.z);
//	debug(20.0 * cameraRotationDefault.y);
//	debug(10.0 * position.z);
//	debug(10.0 * cameraPositionDefault.z);
//	debug(10.0 * gl_Position.x);
	debug(100.0 * texture2D( cloudPoints, vec2( 0., 0. ) ).z);
//	debug(100.0 * cloudPoints0.z);
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
	//vec3 pointPosition = vec3( position.x, position.y, position.z + cPosition.z );
	pointPosition = vec3( cPosition.x, cPosition.y, cPosition.z );
//	vec3 pointPosition = vec3( cPosition.x, cPosition.y, cPosition.z );

//	vec3 pointPosition = vec3( position.z + cPosition.z, position.y, - position.x );
#ifdef quaternion_version 
#else
/*
	pointPosition = rotate_vertex_position(pointPosition, vec3(1,0,0), + cameraRotationDefault.x);//rotate around X
	//Хорошо работает если начальное полжение камеры cameraRotationDefault вращается вокруг оси Y
	pointPosition = rotate_vertex_position(pointPosition, vec3(0,1,0), + cameraRotationDefault.y);//rotate around Y
*/
//	pointPosition = rotate_vertex_position(pointPosition, vec3(0,1,0), + cameraRotation.y);//rotate around Y
//	pointPosition = rotate_vertex_position(pointPosition, vec3(0,1,0), + 1.5707963267948966);//rotate around Y
//	pointPosition = rotate_vertex_position(pointPosition, vec3(0,0,1), - cameraRotation.z);//rotate around Z
/*
	vec3 pointRotate = rotate_vertex_position(pointPosition, vec3(1,0,0), - cameraRotation.x);//rotate around X
	pointPosition    = rotate_vertex_position(  pointRotate, vec3(0,1,0), - cameraRotation.y);//rotate around Y
*/
#endif

//	vec3 pointPosition = vec3( position.x + cPosition.x, position.y, position.z + cPosition.z );
//	vec3 pointPosition = cPosition;

//	vec3 pointPosition = vec3( position.x, position.y, position.z );

	//Хорошо если ось x смотрит точно на камеру для любой точки по оси x
//	vec3 pointPosition = vec3( position.x + 0.5, position.y, position.z + cPosition.z + 0.5 );

	//Хорошо если ось x смотрит точно на камеру для точки [0.4, 0, 0.5, 1]
//	vec3 pointPosition = vec3( position.x + 0.9, position.y, position.z + 2.1 );

	//Хорошо если ось x смотрит точно на камеру для точки [0, 0, 0.5, 1]
//	vec3 pointPosition = vec3( position.x + 0.5, position.y, position.z + 2.5 );

	//Хорошо если ось x смотрит точно на камеру для точки [-0.25, 0, 0.5, -1]
//	vec3 pointPosition = vec3( position.x + 0.25, position.y, position.z + 2.75 );

	//Хорошо если ось x смотрит точно на камеру для точки [-0.3, 0, 0.5, 1]
//	vec3 pointPosition = vec3( position.x + 0.2, position.y, position.z + 2.8 );

	//Хорошо если ось x смотрит точно на камеру для точки [-0.4, 0, 0.5, 1]
//	vec3 pointPosition = vec3( position.x + 0.1, position.y, position.z + 2.9 );

//	vec3 pointPosition = vec3( cPosition.x, cPosition.y, cPosition.z + 2.);
//	vec3 pointPosition = vec3( position.x + cPosition.x, position.y + cPosition.y, position.z + cPosition.z );
#ifndef debug_version
	vColor = vec4(1,1,1,1);
#endif
	distanceToCloudPoint(cloudPoints0);
	for ( float i = 1.; i < cloudPointsWidth; i++ ) {

		//В texture2D второй параметр Texture coordinates is float и лежит в диапазоне от 0. до 1.
		//https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Texture_coordinates
		//Поэтому для получения значения текущей точки с облаком i нужно поделить на общее число точек.
		//Пробовал вместо texture2D использовать texelFetch что бы избежать использовать Texture coordinates is float
		//https://stackoverflow.com/questions/31360409/what-is-texture-coordinate-p-in-texture-sampler2d-lookup-glsl
		//Но получил ошибку компиляции
		//ERROR: 0:310: 'texelFetch' : no matching overloaded function found
		distanceToCloudPoint(texture2D( cloudPoints, vec2( i/cloudPointsWidth, 0. ) ));

	}
//	w = - w / dmax + 1.;;
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
