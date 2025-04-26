# About
this project was be started like for test particle system, and after was tweek for testing shaders

this repo was publicated as is

## included stuff
- [particle system](particle.hpp)

was make for self-learn

---
## shaders
- [space](sp3.frag) - [src](https://www.shadertoy.com/view/XlfGRj)
- [Singulariti](sp1.frag) - [src](https://www.shadertoy.com/view/3csSWB)
- [blur circles](sp.frag) - [src](https://www.shadertoy.com/view/7tyyDy)
- [another blur](sp2.frag) - [src](https://www.shadertoy.com/view/4d2Xzw)
- [portal shader](sp4.frag) - [src](https://www.shadertoy.com/view/lcfyDj)
- [Colorworm tunel](sp5.frag) - [scr](https://www.shadertoy.com/view/33sSzf)

[preview](demo/)

also there have a shader template for SFML 3.0

there are some reasons why the template is exactly like this
```glsl
/* Signed distance drawing methods */
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
//uniform vec2 u_mouse;
//uniform vec2 u_coord;
//uniform sampler2D u_texture

#define PI_TWO 1.570796326794897
#define PI 3.141592653589793
#define TWO_PI 6.283185307179586

#define rx vec2(1./min(u_resolution.x,u_resolution.y))
#define uv vec2(gl_FragCoord.xy/u_resolution.xy)

vec4 mainImage(vec4 fragColor,vec4 fragCoord){

// you shader code...

    fragColor=vec4(sin(uv.x),cos(uv.y),tan(uv.xy));
    return fragColor;
}

void main(){
    gl_FragColor=mainImage(gl_FragColor,gl_FragCoord);
}

```
---

I got the idea from here:i take idea from
  https://www.sfml-dev.org/tutorials/2.6/graphics-vertex-array.php


using Libs [SFML 3.0.0](https://github.com/SFML/SFML)


## using CMake to build the project (CMakeLists.txt)
```bash
git clone https://github.com/Novarior/Particles_CPP.git

mkdir build && cd build
cmake CMakeLists.txt
cmake --build .
```
### after build
goto 'bin' and start app

for change curent shader rename  shader to `sp.frag`

---

### using free font 
Muli-Regular.ttf
https://fonts.google.com/specimen/Mulish?selection.family=Muli

### Tested on MacOS 
