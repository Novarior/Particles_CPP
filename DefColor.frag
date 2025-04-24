/* Signed distance drawing methods */
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_coord;
uniform float u_time;

#define PI_TWO 1.570796326794897
#define PI 3.141592653589793
#define TWO_PI 6.283185307179586

#define rx 1./min(u_resolution.x,u_resolution.y)
#define uv1 gl_FragCoord.xy/u_resolution.xy

vec4 mainImage(vec4 fragColor,vec4 fragCoord){
    vec2 uv=uv1;
    
    fragColor=vec4(sin(uv.x),cos(uv.y),tan(uv.xy));
    return fragColor;
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}
