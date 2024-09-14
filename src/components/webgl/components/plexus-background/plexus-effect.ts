import * as THREE from 'three';

import particleFrag from './shader/particle/fragment.glsl';
import particleVert from './shader/particle/vertex.glsl';
import lineFrag from './shader/line/fragment.glsl';
import lineVert from './shader/line/vertex.glsl';

export type plexusEffectArgs = {
  maxParticleCount?: number;
  radius?: number;
  heightScalingFactor?: number;
  minDistance?: number;
  limitConnections?: boolean;
  maxConnections: number;
  uniforms?: {
    uMinSize: { value: number };
    uMaxSize: { value: number };
    uOpacity: { value: number };
    uSpeed: { value: number };
    uAlpha: { value: number };
  };
};

class PlexusEffect extends THREE.Object3D {
  public limitConnections: boolean;
  public maxConnections: number;
  public minDistance: number;
  public particleUniforms;
  public heightScalingFactor: number;
  public maxParticleCount: number;

  private positions!: Float32Array;
  private random!: Float32Array;
  private colors!: Float32Array;
  private particlePositions!: Float32Array;
  private particlesData: Array<{ velocity: THREE.Vector3; numConnections: number }> = [];
  private particlesGeometry: THREE.BufferGeometry | null = null;
  private particleMaterial: THREE.ShaderMaterial | null = null;
  private particles: THREE.Points<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.ShaderMaterial,
    THREE.Object3DEventMap
  > | null = null;
  private lineGeometry: THREE.BufferGeometry | null = null;
  private lineMaterial: THREE.ShaderMaterial | null = null;
  private lines: THREE.Line<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.ShaderMaterial,
    THREE.Object3DEventMap
  > | null = null;
  private particleCount: number;
  private r: number;
  private maxHeight!: number;

  constructor(args: plexusEffectArgs) {
    super();

    this.maxParticleCount = args.maxParticleCount ?? 1000;
    this.particleCount = args.maxParticleCount ?? 1000;
    this.r = args.radius ?? 4.5;
    this.heightScalingFactor = args.heightScalingFactor ?? 1.2;
    this.minDistance = args.minDistance ?? 0.75;
    this.limitConnections = args.limitConnections ?? false;
    this.maxConnections = args.maxConnections ?? Infinity;

    this.particleUniforms = {
      ...(args.uniforms ?? {
        uMinSize: { value: 0.1 },
        uMaxSize: { value: 0.65 },
        uOpacity: { value: 0.2 },
        uSpeed: { value: 0.1 },
        uAlpha: { value: 1 },
      }),
      uTime: { value: 0 },
      tParticle: { value: new THREE.Texture() },
    };
    this.init();
  }

  init() {
    this.maxHeight = Math.acos(this.heightScalingFactor / 2) - Math.PI;
    this.maxHeight = Math.abs(this.heightScalingFactor * this.r * Math.cos(this.maxHeight));
    this.createParticles();
    this.createLines();
  }

  get lineColor() {
    return this.lineMaterial?.uniforms.uColor.value;
  }

  set lineColor(color: THREE.Color) {
    if (this.lineMaterial) this.lineMaterial.uniforms.uColor.value = color;
  }

  setLayers(value: number) {
    this.lines && this.lines.layers.set(value);
    this.particles && this.particles.layers.set(value);
  }

  destroy() {
    this.particlesGeometry?.dispose();
    this.particlesGeometry = null;
    this.lineGeometry?.dispose();
    this.lineGeometry = null;

    this.particleMaterial?.dispose();
    this.particleMaterial = null;
    this.lineMaterial?.dispose();
    this.lineMaterial = null;

    this.particles && this.remove(this.particles);
    this.lines && this.remove(this.lines);
  }

  set radius(radius: number) {
    this.r = radius;
  }

  set particleTexture(texture: THREE.Texture) {
    if (this.particles) {
      this.particleUniforms.tParticle.value = texture;
      this.particleMaterial && (this.particleMaterial.needsUpdate = true);
    }
  }

  private animate = () => {
    if (!this.particles || !this.lines) return;

    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    for (let i = 0; i < this.particleCount; i++) {
      this.particlesData[i].numConnections = 0;

      // get the particle
      const particleData = this.particlesData[i];

      this.particlePositions[3 * i] += particleData.velocity.x;
      this.particlePositions[3 * i + 1] += particleData.velocity.y;
      this.particlePositions[3 * i + 2] += particleData.velocity.z;

      let normal = new THREE.Vector3(
        this.particlePositions[3 * i],
        this.particlePositions[3 * i + 1],
        this.particlePositions[3 * i + 2]
      );

      const d = normal.length();

      normal = normal.normalize();

      if (d > this.r + 0.2 || d < this.r) {
        let velocity = new THREE.Vector3(particleData.velocity.x, particleData.velocity.y, particleData.velocity.z);

        velocity.sub(normal.multiplyScalar(2 * normal.dot(velocity)));
        particleData.velocity.copy(velocity);
      }

      if (this.particlePositions[3 * i + 1] > this.maxHeight) {
        normal.set(0, -1, 0);
        let velocity = new THREE.Vector3(particleData.velocity.x, particleData.velocity.y, particleData.velocity.z);

        velocity.sub(normal.multiplyScalar(2 * normal.dot(velocity)));
        particleData.velocity.copy(velocity);
      }

      if (this.particlePositions[3 * i + 1] < -this.maxHeight) {
        normal.set(0, 1, 0);
        let velocity = new THREE.Vector3(particleData.velocity.x, particleData.velocity.y, particleData.velocity.z);

        velocity.sub(normal.multiplyScalar(2 * normal.dot(velocity)));
        particleData.velocity.copy(velocity);
      }

      if (this.limitConnections && particleData.numConnections >= this.maxConnections) {
        continue;
      }

      // Check collision
      for (let j = i + 1; j < this.particleCount; j++) {
        const particleDataB = this.particlesData[j];
        const dx = this.particlePositions[3 * i] - this.particlePositions[3 * j];
        const dy = this.particlePositions[3 * i + 1] - this.particlePositions[3 * j + 1];
        const dz = this.particlePositions[3 * i + 2] - this.particlePositions[3 * j + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (this.limitConnections && particleDataB.numConnections >= this.maxConnections) {
          continue;
        }

        if (dist < this.minDistance) {
          particleData.numConnections++;
          particleDataB.numConnections++;
          const alpha = 1 - dist / this.minDistance;

          this.positions[vertexpos++] = this.particlePositions[3 * i];
          this.positions[vertexpos++] = this.particlePositions[3 * i + 1];
          this.positions[vertexpos++] = this.particlePositions[3 * i + 2];

          this.positions[vertexpos++] = this.particlePositions[3 * j];
          this.positions[vertexpos++] = this.particlePositions[3 * j + 1];
          this.positions[vertexpos++] = this.particlePositions[3 * j + 2];

          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;

          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;

          numConnected++;
        }
      }
    }
    this.lines.geometry.setDrawRange(0, numConnected * 2);

    this.lines.geometry.attributes.position.needsUpdate = true;
    this.lines.geometry.attributes.colorAlpha.needsUpdate = true;

    this.particles.geometry.attributes.position.needsUpdate = true;
  };

  private createParticles() {
    const segments = this.maxParticleCount * this.maxParticleCount;

    this.positions = new Float32Array(3 * segments);
    this.colors = new Float32Array(3 * segments);

    this.particlePositions = new Float32Array(3 * this.maxParticleCount);
    this.random = new Float32Array(4 * this.maxParticleCount);

    for (let i = 0; i < this.maxParticleCount; i++) {
      const alpha = Math.acos(this.heightScalingFactor * Math.random() - this.heightScalingFactor / 2) - Math.PI;
      const beta = 2 * Math.PI * Math.random();
      const radius = this.r * (1 + 0.2 * Math.random());

      const x = radius * Math.cos(beta) * Math.sin(alpha);
      const y = radius * Math.cos(alpha);
      const z = radius * Math.sin(beta) * Math.sin(alpha);

      this.particlePositions[3 * i] = x;
      this.particlePositions[3 * i + 1] = y;
      this.particlePositions[3 * i + 2] = z;

      this.random[3 * i] = Math.random();
      this.random[3 * i + 1] = Math.random();
      this.random[3 * i + 2] = Math.random();
      this.random[3 * i + 3] = Math.random();

      const ss = 0.001;

      // add it to the geometry
      this.particlesData.push({
        velocity: new THREE.Vector3(
          ss * (2 * Math.random() - 1),
          ss * (2 * Math.random() - 1),
          ss * (2 * Math.random() - 1)
        ),
        numConnections: 0,
      });
    }

    this.particlesGeometry = new THREE.BufferGeometry();

    this.particlesGeometry.setDrawRange(0, this.maxParticleCount);

    this.particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.particlesGeometry.setAttribute(
      'random',
      new THREE.BufferAttribute(this.random, 4).setUsage(THREE.DynamicDrawUsage)
    );

    this.particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      uniforms: this.particleUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.particles = new THREE.Points(this.particlesGeometry, this.particleMaterial);
    this.particles.renderOrder = 2;
    this.particles.frustumCulled = false;
    this.add(this.particles);
  }

  private createLines() {
    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.lineGeometry.setAttribute(
      'colorAlpha',
      new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.lineGeometry.computeBoundingSphere();
    this.lineGeometry.setDrawRange(0, 0);

    this.lineMaterial = new THREE.ShaderMaterial({
      vertexShader: lineVert,
      fragmentShader: lineFrag,
      uniforms: {
        uAlpha: { value: 1 },
        uColor: { value: new THREE.Color(0xffffff) },
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });

    this.lines = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    this.lines.renderOrder = 3;
    this.lines.frustumCulled = false;
    this.add(this.lines);
  }

  render(delta: number) {
    this.animate();
    this.particles && (this.particles.material.uniforms.uTime.value += delta);
  }
}

export { PlexusEffect };
