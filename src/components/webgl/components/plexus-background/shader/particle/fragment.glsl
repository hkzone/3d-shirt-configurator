uniform sampler2D tParticle;
uniform float uSpeed;
uniform float uOpacity;
uniform float uAlpha;
uniform float uTime;

varying vec4 vRandom;

#pragma glslify: rotate = require('glsl-rotate/rotate')

void main() {

    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    uv -= 0.5;
    rotate(uv, mix(0.0, 6.26, vRandom.x));
    uv.x *= mix(1.0, 1.5, vRandom.y);
    uv.y *= mix(1.0, 1.5, vRandom.w);
    uv += 0.5;

    float alpha = mix(0.05, uOpacity, vRandom.y);
    alpha *= max(0.0, mix(-0.5, 1.0, sin(uTime * uSpeed * vRandom.x + vRandom.w * 6.28) * 0.5 + 0.5));

    vec4 texColor = texture2D(tParticle, uv);
    gl_FragColor.rgba = texColor.rgba;
    gl_FragColor.a = texColor.a * alpha * uAlpha;
}