attribute vec3 colorAlpha;

varying vec2 vUv;
varying vec3 vColor;

void main() {
    vUv = uv;
    vColor = vec3(1.);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}