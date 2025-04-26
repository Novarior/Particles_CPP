/* Signed distance drawing methods */
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_coord;
uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;

#define PI_TWO float 1.570796326794897
#define PI float 3.141592653589793
#define TWO_PI float 6.283185307179586

#define rx 1./min(u_resolution.x,u_resolution.y)
#define uv1 vec2(gl_FragCoord.xy/u_resolution.xy)

#define ITERATIONS int(150)
#define GOLDEN_ANGLE float(2.3999632);

mat2 rot(){
    return mat2(
        cos(2.3999632),
        sin(2.3999632),
        -sin(2.3999632),
        cos(2.3999632)
    );
}

vec3 Bokeh(sampler2D tex,vec2 uv,float radius)
{
    // Инициализация векторов нулями
    vec3 acc=vec3(0.,0.,0.);
    vec3 div=vec3(0.,0.,0.);
    
    // Начальные значения
    float r=.5;
    vec2 vangle=vec2(0.,radius*.01/sqrt(float(ITERATIONS)));
    
    for(int j=0;j<ITERATIONS;j++){
        // Инкремент r
        r+=1./r;
        
        // Поворот вектора используя заранее определенную матрицу
        vangle=rot()*vangle;
        
        // Семплирование текстуры с использованием texture2D вместо texture
        vec4 texColor=texture2D(tex,uv+(r-1.)*vangle);
        
        // Преобразование в vec3 и применение контраста
        vec3 col=texColor.rgb*texColor.rgb*1.8;
        
        // Расчет bokeh эффекта (pow работает только с float в GLSL 1.1)
        vec3 bokeh=vec3(
            pow(col.r,4.),
            pow(col.g,4.),
            pow(col.b,4.)
        );
        
        // Аккумуляция результатов
        acc+=col*bokeh;
        div+=bokeh;
    }
    
    // Возвращаем результат
    return acc/div;
}

vec4 mainImage(vec4 fragColor,vec4 fragCoord){
    
    float time=mod(u_time*.2+.25,3.);
    
    float rad=.8-.8*cos(time*6.283);
    
    fragColor=vec4(Bokeh(u_texture_1,uv1,rad),1.);
    
    return fragColor;
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}
