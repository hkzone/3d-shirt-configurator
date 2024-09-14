uniform float uAlpha;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vColor;

void main() {

    gl_FragColor.rgb = uColor;
    gl_FragColor.a = vColor.r * uAlpha;
}