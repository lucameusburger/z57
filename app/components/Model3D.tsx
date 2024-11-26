"use client";

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";

import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "@react-three/drei";
import bgImage from "@/app/images/bg.jpg";
import { useLoader } from "@react-three/fiber";

function Model({ objUrl, mtlUrl, autoRotate = false }: { objUrl: string; mtlUrl: string; autoRotate: boolean }) {
  const materials = useLoader(MTLLoader, mtlUrl);
  const obj = useLoader(OBJLoader, objUrl, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const modelRef = useRef<THREE.Group>();

  useFrame(() => {
    if (autoRotate && modelRef.current) {
      // modelRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={modelRef} object={obj} />;
}

export default function Model3D() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div
      className="h-[800px] w-full rounded-3xl overflow-hidden border border-foreground"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={30} />
          <Model objUrl="/model/model.obj" mtlUrl="/model/model.mtl" autoRotate={autoRotate} />
          <OrbitControls enableZoom={true} onStart={() => setAutoRotate(false)} onEnd={() => setAutoRotate(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
}
