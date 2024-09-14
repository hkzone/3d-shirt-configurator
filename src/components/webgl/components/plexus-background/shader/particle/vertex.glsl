attribute vec4 random;

uniform float uMinSize;
uniform float uMaxSize;

varying vec4 vRandom;

void main() {
    vRandom = random;

    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = mix(uMinSize, uMaxSize, random.x) * 100.0 / length(mvPos.xyz);
}