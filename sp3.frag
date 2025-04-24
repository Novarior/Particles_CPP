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
#define MAX_ITER 5
#define COLOR 0

#define rx 1./min(u_resolution.x,u_resolution.y)
#define uv1 gl_FragCoord.xy/u_resolution.xy
#define st coord(FragCoord.xy*u_resolution.xy)
#define mx coord(u_mouse)

#define iterations 17
#define formuparam.53

#define volsteps 20
#define stepsize.1

#define zoom.800
#define tile.850
#define speed.010

#define brightness.0015
#define darkmatter.300
#define distfading.730
#define saturation.850

vec4 mainImage(vec4 fragColor,vec4 fragCoord)
{
    //get coords and direction
    vec2 uv=uv1;
    uv.y*=u_resolution.y/u_resolution.x;
    vec3 dir=vec3(uv*zoom,1.);
    float time=u_time*speed+.25;
    
    //mouse rotation
    float a1=.5+u_mouse.x/u_resolution.x*2.;
    float a2=.8+u_mouse.y/u_resolution.y*2.;
    mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
    mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
    dir.xz*=rot1;
    dir.xy*=rot2;
    vec3 from=vec3(1.,.5,.5);
    from+=vec3(time*2.,time,-2.);
    from.xz*=rot1;
    from.xy*=rot2;
    
    //volumetric rendering
    float s=.1,fade=1.;
    vec3 v=vec3(0.);
    for(int r=0;r<volsteps;r++){
        vec3 p=from+s*dir*.5;
        p=abs(vec3(tile)-mod(p,vec3(tile*2.)));// tiling fold
        float pa,a=pa=0.;
        for(int i=0;i<iterations;i++){
            p=abs(p)/dot(p,p)-formuparam;// the magic formula
            a+=abs(length(p)-pa);// absolute sum of average change
            pa=length(p);
        }
        float dm=max(0.,darkmatter-a*a*.001);//dark matter
        a*=a*a;// add contrast
        if(r>6)fade*=1.-dm;// dark matter, don't render near
        //v+=vec3(dm,dm*.5,0.);
        v+=fade;
        v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade;// coloring based on distance
        fade*=distfading;// distance fading
        s+=stepsize;
    }
    v=mix(vec3(length(v)),v,saturation);//color adjust
    fragColor=vec4(v*.01,1.);
    return fragColor;
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}
