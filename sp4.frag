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
#define st coord(FragCoord.xy*u_resolution.xy)
#define mx coord(u_mouse)

vec4 permute_3d(vec4 x){return mod(((x*34.)+1.)*x,289.);}
vec4 taylorInvSqrt3d(vec4 r){return 1.79284291400159-.85373472095314*r;}

float simplexNoise3d(vec3 v)
{
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    
    // First corner
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    
    // Other corners
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    
    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1=x0-i1+1.*C.xxx;
    vec3 x2=x0-i2+2.*C.xxx;
    vec3 x3=x0-1.+3.*C.xxx;
    
    // Permutations
    i=mod(i,289.);
    vec4 p=permute_3d(permute_3d(permute_3d(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    
    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_=1./7.;// N=7
    vec3 ns=n_*D.wyz-D.xzx;
    
    vec4 j=p-49.*floor(p*ns.z*ns.z);//  mod(p,N*N)
    
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);// mod(j,N)
    
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    
    // Normalise gradients
    vec4 norm=taylorInvSqrt3d(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;
    p1*=norm.y;
    p2*=norm.z;
    p3*=norm.w;
    
    // Mix final noise value
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float fbm3d(vec3 x,const in int it){
    float v=0.;
    float a=.5;
    vec3 shift=vec3(100);
    
    for(int i=0;i<32;++i){
        if(i<it){
            v+=a*simplexNoise3d(x);
            x=x*2.+shift;
            a*=.5;
        }
    }
    return v;
}

vec3 rotateZ(vec3 v,float angle){
    float cosAngle=cos(angle);
    float sinAngle=sin(angle);
    return vec3(
        v.x*cosAngle-v.y*sinAngle,
        v.x*sinAngle+v.y*cosAngle,
        v.z
    );
}

float facture(vec3 vector){
    vec3 normalizedVector=normalize(vector);
    
    return max(max(normalizedVector.x,normalizedVector.y),normalizedVector.z);
}

vec3 emission(vec3 color,float strength){
    return color*strength;
}

vec4 mainImage(out vec4 fragColor,in vec4 fragCoord)
{
    // Normalized pixel coordinates (from 0 to 1) and (from -1 to 1)
    vec2 uv=(fragCoord.xy*2.-u_resolution.xy)/u_resolution.y;
    
    vec3 color=vec3(uv.xy,0.);
    color.z+=.4;
    
    color=normalize(color);
    color-=.2*vec3(0.,0.,u_time);
    
    float angle=-log2(length(uv));// log base 0.5
    
    color=rotateZ(color,angle);
    
    float frequency=1.5;
    float distortion=.05;
    color.x=fbm3d(color*frequency+0.,5)+distortion;
    color.y=fbm3d(color*frequency+1.,5)+distortion;
    color.z=fbm3d(color*frequency+2.,5)+distortion;
    vec3 noiseColor=color;// save
    
    noiseColor*=2.;
    noiseColor-=.1;
    noiseColor*=.188;
    noiseColor+=vec3(uv.xy,0.);
    
    float noiseColorLength=length(noiseColor);
    noiseColorLength=.770-noiseColorLength;
    noiseColorLength*=4.2;
    noiseColorLength=pow(noiseColorLength,1.);
    
    vec3 emissionColor=emission(vec3(0., 0.0, 0.651),noiseColorLength*.4);
    
    float fac=length(uv)-facture(color+.32);
    fac+=.1;
    fac*=3.;
    
    color=mix(emissionColor,vec3(fac),fac+1.2);
    
    color = mix(color, vec3(0.0588, 0.0078, 0.1725), fac); // black style
    
    return vec4(color,1.);
    // Output to screen
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}
