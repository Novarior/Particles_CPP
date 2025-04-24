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
#define eler 2.71828

#define rx 1./min(u_resolution.x,u_resolution.y)
#define uv1 gl_FragCoord.xy/u_resolution.xy
#define st coord(FragCoord.xy*u_resolution.xy)
#define mx coord(u_mouse)

vec4 msinh(vec4 x){
    return vec4(
        pow(eler,x.x)-pow(eler,-x.x),
        pow(eler,x.y)-pow(eler,-x.y),
        pow(eler,x.z)-pow(eler,-x.z),
        pow(eler,x.w)-pow(eler,-x.w)
    );
}

vec4 mcosh(vec4 x){
    return vec4(
        pow(eler,x.x)+pow(eler,-x.x),
        pow(eler,x.y)+pow(eler,-x.y),
        pow(eler,x.z)+pow(eler,-x.z),
        pow(eler,x.w)+pow(eler,-x.w)
    );
}

vec4 mtanh(vec4 x){
    return msinh(x)/mcosh(x);
}

vec4 mainImage(vec4 fragColor,vec4 fragCoord)
{
    vec2 uv=(fragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec3 r=vec3(uv,1.);
    vec4 o=vec4(0.);
    vec3 p;
    float z=.0;
    float d=0.;
    
    for(float i=0.;i<100.;i++){
        
        // Ray direction, modulated by time and camera
        p=z*normalize(vec3(uv,.5));
        p.z+=u_time;
        
        // Rotating plane using a cos matrix
        vec4 angle=vec4(0.,33.,11.,0.);
        vec4 a=z*.2+u_time*.1+angle;
        p.xy*=mat2(cos(a.x),-sin(a.x),sin(a.x),cos(a.x));
        
        // Distance estimator
        z+=d=length(cos(p+cos(p.yzx+p.z-u_time*.2)).xy)/6.;
        
        // Color accumulation using sin palette
        o+=(sin(p.x+u_time+vec4(0.,2.,3.,0.))+1.)/d;
    }
    
    o=mtanh(o/5000.);
    fragColor=vec4(o.rgb,1.);
    return fragColor;
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}
