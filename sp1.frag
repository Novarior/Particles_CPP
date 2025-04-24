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
#define uv1 gl_FragCoord.xy/u_resolution
#define st coord(FragCoord.xy*u_resolution.xy)
#define mx coord(u_mouse)

vec4 mainImage(vec4 Out,vec4 F)
{
    vec4 g;
    //Iterator and attenuation (distance-squared)
    float iterator=.1;
    float alpha=0.;
    //Resolution for scaling and centering
    //Centered ratio-corrected coordinates
    vec2 point=(F.xy*2.-u_resolution)/u_resolution.y/.7;
    //Diagonal vector for skewing
    vec2 diagonal=vec2(-1,1);
    //Blackhole center
    vec2 blackhole=point-iterator*diagonal;
    //Rotate and apply perspective
    vec2 coor=point*mat2(1,1,diagonal/(.1+iterator/dot(blackhole,blackhole)));
    //Rotate into spiraling coordinates
    vec2 vect=coor*mat2(cos(1.*log(alpha=dot(coor,coor))+u_time*iterator+vec4(0,33,11,0)))/iterator;
    //Waves cumulative total for coloring
    vec2 wave;
    
    //Loop through waves
    for(float q=.2;q<9.;q++){
        wave+=(1.+sin(vect));
        vect+=.7*sin(vect.yx*iterator+u_time)/iterator+.5;
    }
    
    iterator=length(sin(vect/.3)*.4+coor*(1.5+diagonal));
    //Red/blue gradient
    Out=1.-exp(-exp(coor.x*vec4(2.6,-.1,-1.2,sin(u_time*PI_TWO)))/wave.xyyx/(2.+iterator*iterator/4.-iterator)/(.5+1./alpha)/(.03+abs(length(point)-.7)));
    
    return Out;
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}
