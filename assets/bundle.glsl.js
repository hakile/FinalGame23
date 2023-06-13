
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord;

#ifndef saturate
#define saturate(v) clamp(v,0.,1.)
//      clamp(v,0.,1.)
#endif
vec3 cyan=vec3(0.,0.5765,0.8275),
     magenta=vec3(0.8,0.,0.4196),
     yellow=vec3(1.,0.9451,0.0471);

void main(void){
    vec2 uv=fragCoord.xy/resolution;
    uv.x-=.5;
    uv.x*=resolution.x/resolution.y;
    uv.x+=.5;
    vec3 col=vec3(1.);
    col*=mix(cyan,vec3(1.),saturate((length(uv-vec2(.6,.4))-.2)/5e-3));
    col*=mix(magenta,vec3(1.),saturate((length(uv-vec2(.4,.4))-.2)/5e-3));
    col*=mix(yellow,vec3(1.),saturate((length(uv-vec2(.5,.6))-.2)/5e-3));
    if(floor(mod(fragCoord.y,2.))==0.){
    col=vec3(-2.);
    col+=mix(cyan,vec3(1.),saturate((length(uv-vec2(.6,.4))-.2)/5e-3));
    col+=mix(magenta,vec3(1.),saturate((length(uv-vec2(.4,.4))-.2)/5e-3));
    col+=mix(yellow,vec3(1.),saturate((length(uv-vec2(.5,.6))-.2)/5e-3));
    }
    gl_FragColor=vec4(col,1.);
}

---
name: Colorful Voronoi
type: fragment
author: Brandon Fogerty (xdpixel.com)
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

vec2 hash(vec2 p)
{
    mat2 m = mat2(  13.85, 47.77,
                    99.41, 8.48
                );

    return fract(sin(m*p) * 46738.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 1.0;
    for(int y = -1; y <= 1; y++)
    {
        for(int x = -1; x <= 1; x++)
        {
            vec2 latticePoint = vec2(x, y);
            float currentDistance = distance(latticePoint + hash(g+latticePoint), f);
            distanceToClosestFeaturePoint = min(distanceToClosestFeaturePoint, currentDistance);
        }
    }

    return distanceToClosestFeaturePoint;
}

void main( void )
{
    vec2 uv = ( fragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float offset = voronoi(uv*10.0 + vec2(time));
    float t = 1.0/abs(((uv.x + sin(uv.y + time)) + offset) * 30.0);

    float r = voronoi( uv * 1.0 ) * 1.0;
    vec3 finalColor = vec3(10.0 * uv.y, 2.0, 1.0 * r ) * t;

    gl_FragColor = vec4(finalColor, 1.0 );
}