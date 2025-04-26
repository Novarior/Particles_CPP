/* Signed distance drawing methods */
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_coord;
uniform float u_time;

uniform sampler2D u_texture;

#define PI_TWO float 1.570796326794897
#define PI float 3.141592653589793
#define TWO_PI float 6.283185307179586

#define rx vec2(1./min(u_resolution.x,u_resolution.y))
#define uv1 vec2(gl_FragCoord.xy/u_resolution.xy)

float Cir(vec2 uv,float r,bool blur){
    float a=0.;
    float b=0.;
    if(blur){
        a=.001;
        b=.1;
    }
    else{
        a=0.0;
        b=5./u_resolution.y;
    }
    return smoothstep(a,b,length(uv)-r);
}

vec4 mainImage(vec4 fragColor,vec4 fragCoord){
    vec2 uv=(fragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 t=vec2(sin(u_time*2.),sin(u_time*3.+cos(u_time*.5)))*.1;
    
    vec3 Col0=vec3(1.0, 1.0, 1.0);
    vec3 Col1=vec3(.1+uv.y*2.,.4+uv.x*-1.1,.8)*.828;
    vec3 Col2=vec3(1.0, 1.0, 1.0);
    
    float cir1=Cir(uv-t,.2,false);
    float cir2=Cir(uv+t,.2,false);
    float cir2B=Cir(uv+t,.16,true);
    
    vec3 col=mix(Col1+vec3(.3,.1,0.),Col2,cir2B);
    col=mix(col,Col0,cir1);
    col=mix(col,Col1,clamp(cir1-cir2,0.,1.));
    fragColor=vec4(col,1.);
    return fragColor;
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}
