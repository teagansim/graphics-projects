// make this 120 for the mac:
#version 330 compatibility

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

out  vec2  vST;	  // (s,t) texture coordinates
out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye
out	 vec3  vMC;

// wave amp and period
uniform float uA, uP;

uniform float uLightX, uLightY, uLightZ;

vec3 LightPosition = vec3(  uLightX, uLightY, uLightZ );
const float pi = 3.14159;

void
main( )
{
	vec4 vert = gl_Vertex;
	vert.z = uA * (1. - vert.y) * sin(2. * pi * vert.x / uP);
	vST = gl_MultiTexCoord0.st;
	vec4 ECposition = gl_ModelViewMatrix * vert;

	float dzdx = uA * (1. - vert.y) * (2.* pi / uP) * cos( 2. * pi * vert.x / uP );
	float dzdy = -uA * sin( 2. * pi * vert.x / uP );
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	vN = normalize( cross(Tx, Ty) );  // normal vector

	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vert;
	vMC = vert.xyz;
}
