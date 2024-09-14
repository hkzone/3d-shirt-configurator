/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/display-name */

/**
 * @file CustomView.tsx
 * @description Modified version of the View component from drei
 *
 * @modification
 * This file has been modified from the original drei View component to include
 * additional rendering steps for improved visual effects and layer management.
 *
 * @usage
 * 1. Layer Management:
 *    - Place background elements in layer 1
 *    - Place all other elements in layer 0 (default layer)
 *
 * 2. FinalPass Effect:
 *    - The background scaling effect is automatically applied in the final render pass
 *    - Adjust  final-pass.ts to customize the disered effects for the background and the main elements
 *
 * Use this component as you would use the original drei View component. The enhanced rendering
 * capabilities and layer management are applied automatically.
 *
 * @example
 * // In your scene setup:
 * <mesh layers={1}>
 *   <planeGeometry args={[10, 10]} />
 *   <meshBasicMaterial color="skyblue" /> // This will be rendered as background
 * </mesh>
 * <mesh>
 *   <boxGeometry />
 *   <meshStandardMaterial /> // This will be rendered in the foreground
 * </mesh>
 *
 * @see {@link https://github.com/pmndrs/drei/blob/master/src/web/View.tsx Original View component}
 */

import * as React from 'react';
import * as THREE from 'three';
import { RootState, context, createPortal, useFrame, useThree } from '@react-three/fiber';
import tunnel from 'tunnel-rat';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

import { useAppConfig } from '@/providers/app-config';
import { PAGE_TRANSITION_SECONDS } from '@/config/page-transition';
import { useViewport } from '@/providers/viewport';

import { FinalPass } from './final-pass';

const isOrthographicCamera = (def: any): def is THREE.OrthographicCamera =>
  def && (def as THREE.OrthographicCamera).isOrthographicCamera;
const col = new THREE.Color();
const tracked = tunnel();

/**
 * In `@react-three/fiber` after `v8.0.0` but prior to `v8.1.0`, `state.size` contained only dimension
 * information. After `v8.1.0`, position information (`top`, `left`) was added
 *
 * @todo remove this when drei supports v9 and up
 */
type LegacyCanvasSize = {
  height: number;
  width: number;
};

type CanvasSize = LegacyCanvasSize & {
  top: number;
  left: number;
};

function isNonLegacyCanvasSize(size: Record<string, number>): size is CanvasSize {
  return 'top' in size;
}

export type ContainerProps = {
  visible: boolean;
  scene: THREE.Scene;
  index: number;
  children?: React.ReactNode;
  frames: number;
  rect: React.MutableRefObject<DOMRect>;
  /**
   * @deprecated You can use inline Views now, see: https://github.com/pmndrs/drei/pull/1784
   */
  track?: React.MutableRefObject<HTMLElement>;
  canvasSize: LegacyCanvasSize | CanvasSize;
};

export type ViewProps = {
  /** Root element type, default: div */
  as?: string;
  /** CSS id prop */
  id?: string;
  /** CSS classname prop */
  className?: string;
  /** CSS style prop */
  style?: React.CSSProperties;
  /** If the view is visible or not, default: true */
  visible?: boolean;
  /** Views take over the render loop, optional render index (1 by default) */
  index?: number;
  /** If you know your view is always at the same place set this to 1 to avoid needless getBoundingClientRect overhead */
  frames?: number;
  /** The scene to render, if you leave this undefined it will render the default scene */
  children?: React.ReactNode;
  /** The tracking element, the view will be cut according to its whereabouts
   * @deprecated You can use inline Views now, see: https://github.com/pmndrs/drei/pull/1784
   */
  track?: React.MutableRefObject<HTMLElement>;
};

function computeContainerPosition(canvasSize: LegacyCanvasSize | CanvasSize, trackRect: DOMRect) {
  const { right, top, left: trackLeft, bottom: trackBottom, width, height } = trackRect;
  const isOffscreen = trackRect.bottom < 0 || top > canvasSize.height || right < 0 || trackRect.left > canvasSize.width;

  if (isNonLegacyCanvasSize(canvasSize)) {
    const canvasBottom = canvasSize.top + canvasSize.height;
    const bottom = canvasBottom - trackBottom;
    const left = trackLeft - canvasSize.left;

    return { position: { width, height, left, top, bottom, right }, isOffscreen };
  }
  // Fall back on old behavior if r3f < 8.1.0
  const bottom = canvasSize.height - trackBottom;

  return { position: { width, height, top, left: trackLeft, bottom, right }, isOffscreen };
}

function prepareSkissor(
  state: RootState,
  { left, bottom, width, height }: LegacyCanvasSize & { top: number; left: number } & { bottom: number; right: number }
) {
  let autoClear;
  const aspect = width / height;

  if (isOrthographicCamera(state.camera)) {
    if (
      state.camera.left !== width / -2 ||
      state.camera.right !== width / 2 ||
      state.camera.top !== height / 2 ||
      state.camera.bottom !== height / -2
    ) {
      Object.assign(state.camera, { left: width / -2, right: width / 2, top: height / 2, bottom: height / -2 });
      state.camera.updateProjectionMatrix();
    }
  } else if (state.camera.aspect !== aspect) {
    state.camera.aspect = aspect;
    state.camera.updateProjectionMatrix();
  }
  autoClear = state.gl.autoClear;
  state.gl.autoClear = false;
  state.gl.setViewport(left, bottom, width, height);
  state.gl.setScissor(left, bottom, width, height);
  state.gl.setScissorTest(true);

  return autoClear;
}

function finishSkissor(state: RootState, autoClear: boolean) {
  // Restore the default state
  state.gl.setScissorTest(false);
  state.gl.autoClear = autoClear;
}

function clear(state: RootState) {
  state.gl.getClearColor(col);
  state.gl.setClearColor(col, state.gl.getClearAlpha());
  state.gl.clear(true, true);
}

function Container({ visible = true, canvasSize, scene, index, children, frames, rect, track }: ContainerProps) {
  const rootState = useThree();
  const [isOffscreen, setOffscreen] = React.useState(false);

  const [{ dpr }, gl, camera] = useThree((s) => [s.viewport, s.gl, s.camera] as const);

  const { state } = useAppConfig();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { isTablet } = useViewport();

  camera.layers.enableAll;

  const [renderTarget, renderTargetBackground, finalPass, viewport] = React.useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(512, 512, {
      samples: dpr > 1 ? 0 : 2,
      colorSpace: gl.outputColorSpace,
    });
    const renderTargetBackground = new THREE.WebGLRenderTarget(512, 512, {
      samples: dpr > 1 ? 2 : 4,
      colorSpace: gl.outputColorSpace,
    });

    const finalPass = new FinalPass({
      scaleBackground: 2,
    });

    const viewport = new THREE.Vector4();

    gl.getViewport(viewport);

    return [renderTarget, renderTargetBackground, finalPass, viewport];
  }, []);

  useEffect(() => {
    if (finalPass.uniforms) {
      finalPass.uniforms.uOffsetMain.value.x = state.modelOffset.x;
      finalPass.uniforms.uOffsetMain.value.y = state.modelOffset.y;
    }
  }, [state.modelOffset]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('page-transition', () => {
        if (finalPass.uniforms) {
          finalPass.uniforms.uAnimate.value = 1;
        }
      });

      return () => {
        window.removeEventListener('page-transition', () => {
          if (finalPass.uniforms) {
            finalPass.uniforms.uAnimate.value = 1;
          }
        });
      };
    }
  }, []);

  useEffect(() => {
    const { z: width, w: height } = viewport;
    const { w, h } = {
      w: width * dpr,
      h: height * dpr,
    };

    renderTarget.setSize(w, h);
    renderTargetBackground.setSize(w, h);
  }, [dpr, renderTarget, renderTargetBackground, viewport.z, viewport.w]);

  useEffect(() => {
    finalPass.uniforms.uUseOverlay.value = pathname === '/' && isTablet;
  }, [pathname, isTablet]);

  useEffect(() => {
    finalPass.uniforms.uOverlayColor.value = theme === 'light' ? new THREE.Color(0xffffff) : new THREE.Color(0x00000);
  }, [theme]);

  let frameCount = 0;

  useFrame((state, delta) => {
    if (frames === Infinity || frameCount <= frames) {
      if (track) rect.current = track.current?.getBoundingClientRect();
      frameCount++;
    }
    if (rect.current) {
      const { position, isOffscreen: _isOffscreen } = computeContainerPosition(canvasSize, rect.current);

      if (isOffscreen !== _isOffscreen) setOffscreen(_isOffscreen);
      if (visible && !isOffscreen && rect.current) {
        const autoClear = prepareSkissor(state, position);

        gl.getViewport(viewport);

        gl.autoClear = true;
        let oldAlpha = 0;

        gl.setClearAlpha(oldAlpha);
        gl.setClearAlpha(1);

        gl.setRenderTarget(renderTargetBackground);
        state.camera.layers.set(pathname === '/' ? 1 : 999); //will render only clearcolor unless in root
        // When children are present render the portalled scene, otherwise the default scene
        gl.render(children ? state.scene : scene, state.camera);

        gl.setClearAlpha(oldAlpha);
        gl.clearDepth();
        state.camera.layers.set(0);
        state.gl.setRenderTarget(renderTarget);
        state.gl.render(children ? state.scene : scene, state.camera);

        state.gl.setRenderTarget(null);

        if (finalPass.uniforms && finalPass.uniforms.uAnimate.value > 0) {
          finalPass.uniforms.uAnimate.value -= ((0.01 * 60) / PAGE_TRANSITION_SECONDS) * delta;
        } else if (finalPass.uniforms && finalPass.uniforms.uAnimate.value < 0) {
          finalPass.uniforms.uAnimate.value = 0;
        }
        finalPass.render(gl, renderTargetBackground, renderTarget);

        finishSkissor(state, autoClear);
      }
    }
  }, index);

  React.useLayoutEffect(() => {
    const curRect = rect.current;

    if (curRect && (!visible || !isOffscreen)) {
      // If the view is not visible clear it once, but stop rendering afterwards!
      const { position } = computeContainerPosition(canvasSize, curRect);
      const autoClear = prepareSkissor(rootState, position);

      clear(rootState);
      finishSkissor(rootState, autoClear);
    }
  }, [visible, isOffscreen]);

  React.useEffect(() => {
    if (!track) return;

    const curRect = rect.current;
    // Connect the event layer to the tracking element
    const old = rootState.get().events.connected;

    rootState.setEvents({ connected: track.current });

    return () => {
      if (curRect) {
        const { position } = computeContainerPosition(canvasSize, curRect);
        const autoClear = prepareSkissor(rootState, position);

        clear(rootState);
        finishSkissor(rootState, autoClear);
      }
      rootState.setEvents({ connected: old });
    };
  }, [track]);

  React.useEffect(() => {
    if (isNonLegacyCanvasSize(canvasSize)) return;
    console.warn(
      'Detected @react-three/fiber canvas size does not include position information. <View /> may not work as expected. ' +
        'Upgrade to @react-three/fiber ^8.1.0 for support.\n See https://github.com/pmndrs/drei/issues/944'
    );
  }, []);

  return (
    <>
      {children}
      {/** Without an element that receives pointer events state.pointer will always be 0/0 */}
      <group onPointerOver={() => null} />
    </>
  );
}

const CanvasView = React.forwardRef(
  (
    { track, visible = true, index = 1, id, style, className, frames = Infinity, children, ...props }: ViewProps,
    fref: React.ForwardedRef<THREE.Group>
  ) => {
    const rect = React.useRef<DOMRect>(null!);
    const { size, scene } = useThree();
    const [virtualScene] = React.useState(() => new THREE.Scene());
    const [ready, toggle] = React.useReducer(() => true, false);

    const compute = React.useCallback(
      (event: any, state: any) => {
        if (rect.current && track && track.current && event.target === track.current) {
          const { width, height, left, top } = rect.current;
          const x = event.clientX - left;
          const y = event.clientY - top;

          state.pointer.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
          state.raycaster.setFromCamera(state.pointer, state.camera);
        }
      },
      [rect, track]
    );

    React.useEffect(() => {
      // We need the tracking elements bounds beforehand in order to inject it into the portal
      if (track) rect.current = track.current?.getBoundingClientRect();
      // And now we can proceed
      toggle();
    }, [track]);

    return (
      <group ref={fref} {...props}>
        {ready &&
          createPortal(
            <Container
              canvasSize={size}
              frames={frames}
              index={index}
              rect={rect}
              scene={scene}
              track={track}
              visible={visible}
            >
              {children}
            </Container>,
            virtualScene,
            {
              events: { compute, priority: index },
              size: {
                width: rect.current?.width,
                height: rect.current?.height,
                // @ts-ignore
                top: rect.current?.top,
                // @ts-ignore
                left: rect.current?.left,
              },
            }
          )}
      </group>
    );
  }
);

const HtmlView = React.forwardRef(
  (
    {
      as: El = 'div',
      id,
      visible,
      className,
      style,
      index = 1,
      track,
      frames = Infinity,
      children,
      ...props
    }: ViewProps,
    fref: React.ForwardedRef<HTMLElement>
  ) => {
    const uuid = React.useId();
    const ref = React.useRef<HTMLElement>(null!);

    React.useImperativeHandle(fref, () => ref.current);

    return (
      <>
        {/** @ts-ignore */}
        <El ref={ref} className={className} id={id} style={style} {...props} />
        <tracked.In>
          <CanvasView key={uuid} frames={frames} index={index} track={ref} visible={visible}>
            {children}
          </CanvasView>
        </tracked.In>
      </>
    );
  }
);

export type ViewportProps = { Port: () => JSX.Element } & React.ForwardRefExoticComponent<
  ViewProps & React.RefAttributes<HTMLElement | THREE.Group>
>;

export const CustomView = React.forwardRef((props: ViewProps, fref: React.ForwardedRef<HTMLElement | THREE.Group>) => {
  // If we're inside a canvas we should be able to access the context store
  const store = React.useContext(context);

  // If that's not the case we render a tunnel
  if (!store) return <HtmlView ref={fref as unknown as React.ForwardedRef<HTMLElement>} {...props} />;
  // Otherwise a plain canvas-view
  else return <CanvasView ref={fref as unknown as React.ForwardedRef<THREE.Group>} {...props} />;
}) as ViewportProps;

CustomView.Port = () => <tracked.Out />;
