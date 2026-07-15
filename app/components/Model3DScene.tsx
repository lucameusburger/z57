"use client";

import * as THREE from "three";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Fullscreen, Play, Rotate3d, RotateCcw } from "lucide-react";
import {
  type ElementRef,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

function Model({ autoRotate }: { autoRotate: boolean }) {
  const obj = useLoader(OBJLoader, "/model/model.obj");
  const modelRef = useRef<THREE.Group | null>(null);
  const invalidate = useThree((state) => state.invalidate);
  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x211f20,
        opacity: 0.48,
        transparent: true,
        wireframe: true,
      }),
    [],
  );

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = wireframeMaterial;
      }
    });

    modelRef.current.rotation.y = Math.PI;
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const center = box.getCenter(new THREE.Vector3());
    modelRef.current.position.sub(center);
    modelRef.current.position.z -= 10;
    modelRef.current.position.x -= 5;
    invalidate();
  }, [invalidate, obj, wireframeMaterial]);

  useEffect(() => () => wireframeMaterial.dispose(), [wireframeMaterial]);

  useFrame(() => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return <primitive dispose={null} object={obj} ref={modelRef} />;
}

function ModelLoadingFallback() {
  return null;
}

export default function Model3DScene() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [controlsEnabled, setControlsEnabled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const controlsRef = useRef<ElementRef<typeof OrbitControls> | null>(null);

  const resetModel = () => {
    if (!controlsRef.current) return;

    controlsRef.current.reset();
    controlsRef.current.object.position.set(0, 0, 5);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const controlButtonClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground bg-background transition-colors hover:bg-foreground hover:text-background";
  const activeToggleButtonClass =
    "bg-foreground text-background hover:bg-foreground hover:text-background";

  return (
    <div className="relative h-[60vh] max-h-[680px] min-h-[420px] w-full overflow-hidden rounded-3xl border border-foreground bg-background md:h-[70vh]">
      <div
        className={
          "h-full w-full bg-background " +
          (fullscreen ? "fixed inset-0 z-50" : "")
        }
      >
        <div className="absolute left-4 top-4 z-20 flex flex-col gap-1">
          <button
            type="button"
            className={`${controlButtonClass} ${autoRotate ? activeToggleButtonClass : ""}`}
            onClick={() => setAutoRotate((current) => !current)}
            aria-label="Automatisches Drehen umschalten"
          >
            <Play className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`${controlButtonClass} ${controlsEnabled ? activeToggleButtonClass : ""}`}
            onClick={() => setControlsEnabled((current) => !current)}
            aria-label="Interaktive Steuerung umschalten"
          >
            <Rotate3d className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={controlButtonClass}
            onClick={resetModel}
            aria-label="Kameraposition zurücksetzen"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={controlButtonClass}
            onClick={() => {
              const nextFullscreen = !fullscreen;
              setFullscreen(nextFullscreen);
              if (nextFullscreen) setControlsEnabled(true);
            }}
            aria-label="Vollbild umschalten"
          >
            <Fullscreen className="h-5 w-5" />
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 text-center text-xs text-foreground/60">
          Untexturierte, ressourcenschonende Vorschau
        </div>

        <Canvas
          camera={{ position: [0, 0, 5] }}
          dpr={[1, 1.35]}
          frameloop={autoRotate ? "always" : "demand"}
          performance={{ min: 0.5 }}
          gl={{
            alpha: true,
            antialias: false,
            depth: true,
            failIfMajorPerformanceCaveat: false,
            powerPreference: "low-power",
            preserveDrawingBuffer: false,
            stencil: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={<ModelLoadingFallback />}>
            <Model autoRotate={autoRotate} />
            <OrbitControls
              ref={controlsRef}
              enabled={controlsEnabled}
              enableZoom={controlsEnabled}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
