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
    //Iterator and attenuation (distance-squared)
    float iterator=.15;
    float alpha=0.;
    //Resolution for scaling and centering
    //Centered ratio-corrected coordinates
    vec2 point=(fragCoord.xy*2.-u_resolution)/u_resolution.y/.7;
    //Diagonal vector for skewing
    vec2 diagonal=vec2(-1,1);
    //Blackhole center
    vec2 blackhole=point-iterator*diagonal;
    //Rotate and apply perspective
    
    vec2 v1=vec2(dot(blackhole,blackhole));
    vec2 v2=.1+iterator/v1;
    vec2 v3=vec2(mat2(3,3,diagonal/v2));
    vec2 coor=point*v3;
    //Rotate into spiraling coordinates
    vec2 vect=coor*mat2(cos(1.*log(alpha=dot(coor,coor))+u_time*iterator+vec4(0,33,11,0)))/iterator;
    //Waves cumulative total for coloring
    vec2 wave=vec2(0.,0.);
    
    //Loop through waves
    for(int q=2;q<9;q++){
        wave+=(1.+sin(vect));
        vect+=.7*sin(vect.yx*iterator+u_time)/iterator+.5;
    }
    
    iterator=length(sin(vect/.3)*.4+coor*(1.5+diagonal));
    //Red/blue gradient
    
    fragColor=vec4(1.-exp(-exp(coor.x*vec4(2.6,-.1,-1.2,sin(u_time*3.14)))/wave.xyyx/(2.+iterator*iterator/4.-iterator)/(.5+1./alpha)/(.03+abs(length(point)-.7))));
    
    return fragColor;
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}
