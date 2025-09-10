// make this 120 for the mac:
#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec4    uColor;		 // object color
uniform vec4    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent
uniform sampler2D	uImageUnit;
uniform	float	uRad;
uniform float	uSc, uTc;
uniform float	uMag, uWhirl, uMosaic;

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uS0, uT0, uD;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates


void
main( )
{
	vec2 st = vST - vec2(uSc, uTc);

	// determine the color using the square-boundary equations:

	if( length(st) > uRad )
	{
		vec3 rgb = texture( uImageUnit, vST ).rgb;
		gl_FragColor = vec4( rgb, 1. );
	} else {

		//magnification
		float r = length(st);
		float rp = uMag * length(st);
		
		//whirling
		float th = atan(st.t, st.s);
		float thp = th - uWhirl * rp;
		

		//restoring
		st = rp * vec2( cos(thp),sin(thp) );
		st += vec2(uSc, uTc);

		
		//mosaicing
		// which block of pixels will this pixel be in?
		int numins = int(st.s / uMosaic);
		int numint = int(st.t / uMosaic);
		float sc = numins * uMosaic + uMosaic/2.;
		float tc = numint * uMosaic + uMosaic/2.;

		// for this entire block of pixels, we are only going to sample the texture at its center (sc,tc):
		st.s = sc;
		st.t = tc;
		

		vec3 rgb = texture( uImageUnit, st ).rgb;
		gl_FragColor = vec4( rgb, 1. );
	}

	// apply the per-fragmewnt lighting to myColor:
	/*
	vec3 Normal = normalize(vN);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);

	vec3 ambient = uKa * myColor;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * myColor;

	float ss = 0.;
	if( dot(Normal,Light) > 0. )	      // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		ss = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * ss * uSpecularColor.rgb;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
	*/
}

