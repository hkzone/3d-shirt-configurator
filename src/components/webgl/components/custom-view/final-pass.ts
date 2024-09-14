import { ShaderPass } from 'three-stdlib';
import glsl from 'glslify';
import * as THREE from 'three';

const vertexShader = glsl`
    varying vec2 vUv;
    
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vUv = uv;
    }`;

const fragmentShader = glsl`
      uniform sampler2D tDiffuseBackground;
      uniform sampler2D tDiffuseMain;
      uniform float uScaleBackground;
      uniform vec2 uOffsetMain;
      uniform bool uUseOverlay;
      uniform vec3 uOverlayColor;

      varying vec2 vUv;

      #ifndef HALF_PI
      #define HALF_PI 1.5707963267948966
      #endif

      float sineOut(float t) {
        return sin(t * HALF_PI);
      }

      // ** modified from https://gl-transitions.com/editor/ButterflyWaveScrawler * // 
      uniform float uAnimate;
  
      float amplitude = .3;
      float waves = 20.0;
      float colorSeparation= 0.5;
      float PI = 3.14159265358979323846264;
      float compute(vec2 p, float progress, vec2 center) {
        vec2 o = p*sin(progress * amplitude)-center;
        // horizontal vector
        vec2 h = vec2(1., 0.);
        // butterfly polar function (don't ask me why this one :))
        float theta = acos(dot(o, h)) * waves;
        return (exp(cos(theta)) - 2.*cos(4.*theta) + pow(sin((2.*theta - PI) / 24.), 5.)) / 10.;
      }
      
      vec4 transition(vec2 uv,vec2 uv2) {
        vec2 p = uv.xy / vec2(1.0).xy;
        vec2 p2 = uv2.xy / vec2(1.0).xy;
        float progress = 1.- uAnimate;
        float inv = 1. - progress;
        vec2 dir = p - vec2(.5);
        vec2 dir2 = p2 - vec2(.5);
        float dist = length(dir);
        float dist2 = length(dir2);
        float disp = compute(p, progress, vec2(0.5, 0.5)) ;
        float disp2 = compute(p2, progress, vec2(0.5, 0.5)) ;
        vec4 diffuse1 =texture2D(tDiffuseBackground,p2 + inv*disp2);
        vec4 diffuse2 =texture2D(tDiffuseMain,p + inv*disp);
        vec4 texTo =mix(diffuse1,diffuse2,diffuse2.a);
        diffuse1 = vec4(
       texture2D(tDiffuseBackground,p2 + progress*disp2*(1.0 - colorSeparation)).r,
       texture2D(tDiffuseBackground,p2 + progress*disp2).g,
       texture2D(tDiffuseBackground,p2 + progress*disp2*(1.0 + colorSeparation)).b,
        1.0);
        diffuse2 = vec4(
       texture2D(tDiffuseMain,p + progress*disp*(1.0 - colorSeparation)).r,
       texture2D(tDiffuseMain,p + progress*disp).g,
       texture2D(tDiffuseMain,p + progress*disp*(1.0 + colorSeparation)).b,
        1.0);

         vec4 texFrom = mix(diffuse1,diffuse2,diffuse2.a);
        return texTo*progress + texFrom*inv;
      }
      // ************************** end of modified part ************************** //

      vec2 scale(in vec2 st, in float s) {
        return (st - 0.5) * s + 0.5;
      }

      void main() {
      vec2 scaledUV= scale(vUv,1./uScaleBackground);
      vec2 offsetUV=vec2(vUv.x+uOffsetMain.x, vUv.y+uOffsetMain.y);
      
      gl_FragColor = transition( offsetUV , scaledUV);

      if (uUseOverlay) {
        float controller = step(vUv.y, 0.4);
        gl_FragColor = mix(gl_FragColor, vec4(uOverlayColor,1.), (1. - smoothstep(0., 0.4, sineOut(vUv.y))) * controller);
      }
          
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }
    `;

export interface PassParameters {
  scaleBackground?: number;
}

class FinalPass extends ShaderPass {
  constructor(options: PassParameters) {
    super({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uAnimate: { value: 0 },
        tDiffuseBackground: { value: null },
        tDiffuseMain: { value: null },
        uScaleBackground: { value: options.scaleBackground ?? 1 },
        uOffsetMain: { value: new THREE.Vector2(0, 0) },
        uOverlayColor: { value: new THREE.Color(0) }, // Default to white
        uUseOverlay: { value: false },
      },
    });
  }

  /**
   * Custom render method for FinalPass
   *
   * @override
   * This method overrides the default ShaderPass render method.
   * Instead of using readBuffer and writeBuffer, it directly renders
   * the final composited result to the screen.
   *
   * @param {THREE.WebGLRenderer} gl - The WebGL renderer
   * @param {THREE.RenderTarget} rt - The background render target
   * @param {THREE.RenderTarget} rt2 - The main scene render target
   */
  render(gl: THREE.WebGLRenderer, rt: THREE.RenderTarget, rt2: THREE.RenderTarget) {
    // Set the background and main textures
    this.material.uniforms.tDiffuseBackground.value = rt.texture;
    this.material.uniforms.tDiffuseMain.value = rt2.texture;

    this.fsQuad.material = this.material;

    // Render directly to the screen (null render target)
    gl.setRenderTarget(null);
    this.fsQuad.render(gl);
  }
}

export { FinalPass };
