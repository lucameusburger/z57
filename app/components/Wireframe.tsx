"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const MAX_PIXEL_RATIO = 2;
const FRAME_FILL = 0.98;

/** Whole model, always in frame. */
const FULL_VIEW = {
  focalLength: 3,
  tilt: 0.12,
  spinPerSecond: 0.22,
  startAngle: 0.5,
};

/** Camera inside the crop's sphere, so lines fill the frame in every direction. */
const CLOSE_UP_VIEW = {
  focalLength: 1.1,
  tilt: 0.55,
  spinPerSecond: 0.1,
  startAngle: 2.2,
  distance: 0.55,
};

const VERTEX_SHADER = `
attribute vec3 position;
uniform vec2 spin;
uniform vec2 tilt;
uniform vec3 camera;
void main() {
  float x = spin.x * position.x + spin.y * position.z;
  float z = spin.x * position.z - spin.y * position.x;
  float y = tilt.x * position.y - tilt.y * z;
  z = tilt.y * position.y + tilt.x * z;
  gl_Position = vec4(x * camera.x, y * camera.y, 0.0, camera.z - z);
}`;

// Premultiplied --foreground, so overlapping lines darken like the hairlines.
const FRAGMENT_SHADER = `
precision mediump float;
uniform float alpha;
void main() {
  gl_FragColor = vec4(vec3(28.0, 49.0, 8.0) / 255.0 * alpha, alpha);
}`;

// WebGL lines are one device pixel wide, so the same edges read far denser on a
// small or 1x canvas than on a large retina one.
const fullViewLineAlpha = (deviceWidth: number) =>
  Math.min(0.85, Math.max(0.32, deviceWidth / 3200));
const closeUpLineAlpha = (deviceWidth: number) =>
  Math.min(0.9, Math.max(0.45, deviceWidth / 1400));

type Extent = { x: number; y: number; z: number };

/**
 * The closest camera distance at which the corners of the model's bounding box
 * stay inside the frame at every angle of the spin.
 */
function fitCameraDistance(aspect: number, extent: Extent) {
  const { focalLength, tilt } = FULL_VIEW;
  const tiltCos = Math.cos(tilt);
  const tiltSin = Math.sin(tilt);
  const fits = (distance: number) => {
    for (let step = 0; step < 48; step++) {
      const angle = (step / 48) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      for (const cornerX of [-extent.x, extent.x]) {
        for (const cornerZ of [-extent.z, extent.z]) {
          for (const height of [-extent.y, extent.y]) {
            const x = cos * cornerX + sin * cornerZ;
            const z = cos * cornerZ - sin * cornerX;
            const y = tiltCos * height - tiltSin * z;
            const depth = distance - (tiltSin * height + tiltCos * z);
            if (
              Math.abs((x * focalLength) / aspect / depth) > FRAME_FILL ||
              Math.abs((y * focalLength) / depth) > FRAME_FILL
            ) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  let near = 1.5;
  let far = 40;
  for (let i = 0; i < 18; i++) {
    const middle = (near + far) / 2;
    if (fits(middle)) far = middle;
    else near = middle;
  }
  return far;
}

function compileProgram(gl: WebGLRenderingContext) {
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERTEX_SHADER],
    [gl.FRAGMENT_SHADER, FRAGMENT_SHADER],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/**
 * Decorative spinning wireframe, drawn from a file baked by build-wireframe.mjs.
 * `closeUp` puts the camera inside the geometry instead of framing all of it.
 */
export default function Wireframe({
  src,
  closeUp = false,
  className,
}: {
  src: string;
  closeUp?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      powerPreference: "low-power",
    });
    if (!canvas || !gl) return;

    const view = closeUp ? CLOSE_UP_VIEW : FULL_VIEW;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let disposed = false;
    let inView = false;
    let frame = 0;
    let lastTime = 0;
    let angle = view.startAngle;
    let draw: (() => void) | undefined;

    const tick = (time: number) => {
      frame = 0;
      if (disposed || !inView || !draw) return;
      if (lastTime) angle += ((time - lastTime) / 1000) * view.spinPerSecond;
      lastTime = time;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reducedMotion) {
        draw?.();
      } else if (draw && inView && !frame) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const load = async () => {
      const response = await fetch(src);
      if (!response.ok) return;
      const data = await response.arrayBuffer();
      if (disposed) return;

      const program = compileProgram(gl);
      if (!program) return;

      const [vertexCount, edgeCount] = new Uint32Array(data, 0, 2);
      const headerSize = 8;
      const verticesSize = vertexCount * 6;
      const vertices = new Int16Array(data, headerSize, vertexCount * 3);

      const extent: Extent = { x: 0, y: 0, z: 0 };
      for (let i = 0; i < vertices.length; i += 3) {
        extent.x = Math.max(extent.x, Math.abs(vertices[i]) / 32767);
        extent.y = Math.max(extent.y, Math.abs(vertices[i + 1]) / 32767);
        extent.z = Math.max(extent.z, Math.abs(vertices[i + 2]) / 32767);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(data, headerSize + verticesSize, edgeCount * 2),
        gl.STATIC_DRAW,
      );

      gl.useProgram(program);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 3, gl.SHORT, true, 6, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform2f(
        gl.getUniformLocation(program, "tilt"),
        Math.cos(view.tilt),
        Math.sin(view.tilt),
      );
      const spin = gl.getUniformLocation(program, "spin");
      const camera = gl.getUniformLocation(program, "camera");
      const alpha = gl.getUniformLocation(program, "alpha");

      draw = () => {
        const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
        const width = Math.round(canvas.clientWidth * pixelRatio);
        const height = Math.round(canvas.clientHeight * pixelRatio);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
          const aspect = width / height;
          // The wider side keeps the focal length, so a wide cell shows more.
          const widest = Math.max(aspect, 1);
          gl.uniform1f(
            alpha,
            closeUp ? closeUpLineAlpha(width) : fullViewLineAlpha(width),
          );
          gl.uniform3f(
            camera,
            closeUp
              ? CLOSE_UP_VIEW.focalLength
              : view.focalLength / aspect,
            closeUp
              ? CLOSE_UP_VIEW.focalLength * widest
              : view.focalLength,
            closeUp
              ? CLOSE_UP_VIEW.distance
              : fitCameraDistance(aspect, extent),
          );
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(spin, Math.cos(angle), Math.sin(angle));
        gl.drawElements(gl.LINES, edgeCount * 2, gl.UNSIGNED_SHORT, 0);
      };

      setReady(true);
      start();
    };

    let loading = false;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !loading) {
          loading = true;
          void load();
        }
        start();
      },
      { rootMargin: "600px" },
    );
    visibility.observe(canvas);

    const resizing = new ResizeObserver(() => {
      if (reducedMotion) draw?.();
    });
    resizing.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resizing.disconnect();
    };
  }, [src, closeUp]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "block transition-opacity duration-1000",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
