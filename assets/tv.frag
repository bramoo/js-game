// https://www.shadertoy.com/view/MsXGD4
precision mediump float;

uniform vec3      resolution;           // viewport resolution (in pixels)
uniform float     time;           // shader playback time (in seconds)
uniform sampler2D uSampler;

float scanline(vec2 uv) {
	return sin(resolution.y * uv.y * 0.7 - time * 10.0);
}

float slowscan(vec2 uv) {
	return sin(resolution.y * uv.y * 0.02 + time * 6.0);
}

// from https://www.shadertoy.com/view/4sf3Dr
// Thanks, Jasper
vec2 crt(vec2 coord, float bend)
{
	// put in symmetrical coords
	coord = (coord - 0.5) * 2.0;

	coord *= 0.5;	
	
	// deform coords
	coord.x *= 1.0 + pow((abs(coord.y) / bend), 2.0);
	coord.y *= 1.0 + pow((abs(coord.x) / bend), 2.0);

	// transform back to 0.0 - 1.0 space
	coord  = (coord / 1.0) + 0.5;

	return coord;
}

vec2 scandistort(vec2 uv) {
	float scan2 = clamp(cos(uv.y * 2.0 + time + 4.0) * 10.0, 0.0, 1.0) ;
	float scan1 = clamp(cos(uv.y * 2.0 + time), 0.0, 1.0);
	float amount = scan1 * scan2 * uv.x; 
	
	uv.x -= 0.05 * amount;

	return uv;
	 
}

float vignette(vec2 uv) {
	uv = (uv - 0.5) * 0.98;
	return clamp(pow(cos(uv.x * 3.1415), 1.2) * pow(cos(uv.y * 3.1415), 1.2) * 50.0, 0.0, 1.0);
}

void main( void )
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 sd_uv = scandistort(uv);
	vec2 crt_uv = crt(sd_uv, 2.0);
			
	vec4 color = texture2D(uSampler, crt_uv);	
		
	vec4 scanline_color = vec4(scanline(crt_uv));
	vec4 slowscan_color = vec4(slowscan(crt_uv));
	
	gl_FragColor = mix(color, mix(scanline_color, slowscan_color, 0.5), 0.05) * vignette(uv);

	// gl_FragColor = color;

	//fragColor = vec4(vignette(uv));
	//vec2 scan_dist = scandistort(uv);
	//fragColor = vec4(scan_dist.x, scan_dist.y,0.0, 1.0);
}