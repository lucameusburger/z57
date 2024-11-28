"use client";

import * as THREE from "three";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Play, Rotate3d } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";

import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "@react-three/drei";
import bgImage from "@/app/images/bg.jpg";

function Model({ objUrl, mtlUrl, autoRotate = false }: { objUrl: string; mtlUrl: string; autoRotate: boolean }) {
  const materials = useLoader(MTLLoader, mtlUrl);
  const obj = useLoader(OBJLoader, objUrl, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const modelRef = useRef<THREE.Group>();

  // Center the model when it loads
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x = Math.PI / 2; // 90 degrees in radians
      modelRef.current.rotation.y = Math.PI; // 90 degrees in radians

      // Create a bounding box
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());

      // Move the model so its center is at the origin
      modelRef.current.position.x -= center.x;
      modelRef.current.position.y -= center.y;
      modelRef.current.position.z -= center.z;
    }
  }, [obj]);

  useFrame(() => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.z += 0.001;
    }
  });

  return <primitive ref={modelRef} object={obj} />;
}

export default function Model3D() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [controlsEnabled, setControlsEnabled] = useState(false);

  return (
    <div
      className="h-[80vh] md:h-[800px] max-h-[80vh] w-full rounded-3xl overflow-hidden border border-foreground "
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-blur-md h-full w-full">
        <button className={"rounded-full bg-foreground text-background hover:text-foreground p-3 absolute left-4 top-4 z-20 hover:bg-background border " + (autoRotate ? "border-background" : "border-foreground")} onClick={() => setAutoRotate(!autoRotate)}>
          <Play className="w-6 h-6" />
        </button>
        <button className={"rounded-full bg-foreground text-background hover:text-foreground p-3 absolute left-4 top-[4.5rem] z-20 hover:bg-background border " + (controlsEnabled ? "border-background" : "border-foreground")} onClick={() => setControlsEnabled(!controlsEnabled)}>
          <Rotate3d className="w-6 h-6" />
        </button>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <ambientLight intensity={3} />
            <directionalLight position={[10, 10, 5]} intensity={10} />
            <Model objUrl="/model/model.obj" mtlUrl="/model/model.mtl" autoRotate={autoRotate} />
            <OrbitControls
              enabled={controlsEnabled}
              enableZoom={controlsEnabled}
              onStart={() => {}} // Remove the autoRotate toggle
              onEnd={() => {}} // Remove the autoRotate toggle
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
