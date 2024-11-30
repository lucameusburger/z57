"use client";

import * as THREE from "three";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Edges, OrbitControls } from "@react-three/drei";
import { Fullscreen, Play, Rotate3d, RotateCcw } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";

import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls as OrbitControlsType } from "three-stdlib";

// import bgImage from "@/app/images/bg.jpg";

function Model({ objUrl, mtlUrl, autoRotate = false }: { objUrl: string; mtlUrl: string; autoRotate: boolean }) {
  const materials = useLoader(MTLLoader, mtlUrl);

  // Modify materials before loading the object
  Object.values(materials.materials).forEach((material) => {
    material.transparent = true;
    if (material.name === "Z57_Türen_usw_rot") {
      material.opacity = 0.8;
    } else {
      material.opacity = 0.33;
    }
  });

  const obj = useLoader(OBJLoader, objUrl, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const modelRef = useRef<THREE.Group>();

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.PI;

      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());

      modelRef.current.position.x -= center.x;
      modelRef.current.position.y -= center.y;
      modelRef.current.position.z -= center.z;

      modelRef.current.position.z -= 10;
      modelRef.current.position.x -= 5;

      // Force update materials
      // modelRef.current.traverse((child) => {
      //   if (child instanceof THREE.Mesh) {
      //     if (Array.isArray(child.material)) {
      //       child.material.forEach((mat) => {
      //         mat.transparent = true;
      //         mat.opacity = 0.2;
      //         mat.needsUpdate = true;
      //       });
      //     } else {
      //       child.material.transparent = true;
      //       child.material.opacity = 0.6;
      //       child.material.needsUpdate = true;
      //     }
      //   }
      // });
    }
  }, [obj]);

  useFrame(() => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    // @ts-expect-error asd
    <group ref={modelRef}>
      <primitive object={obj} />
      {obj.children.map((child, index) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.Material;
          console.log(mat.name);
          // return <Edges lineWidth={1} key={index} geometry={child.geometry} threshold={15} color={mat.name === "Metall_Stahl,_verzinkt" ? "#c2382f" : "#211f20"} />;
          return <Edges lineWidth={mat.name === "Z57_Türen_usw_rot" ? 1 : 1} key={index} geometry={child.geometry} threshold={15} color={mat.name === "Z57_Türen_usw_rot" ? "#c2382f" : "#211f20"} />;
        }
        return null;
      })}
    </group>
  );
}

export default function Model3D() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [controlsEnabled, setControlsEnabled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const controlsRef = useRef<OrbitControlsType>(null);

  const resetModel = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(0, 0, 5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div
      className="h-[80vh] relative md:h-[800px] max-h-[80vh] w-full rounded-3xl overflow-hidden border border-foreground "
      style={
        {
          // backgroundImage: `url(${bgImage.src})`,
          // backgroundSize: "cover",
          // backgroundPosition: "center",
        }
      }
    >
      <div className={"h-full w-full" + (fullscreen ? " fixed top-0 left-0 z-50 bottom-0 right-0" : "")}>
        <div className="flex flex-col gap-1 absolute left-4 top-4">
          <button className={"rounded-full bg-foreground text-background hover:text-foreground p-3  z-20 hover:bg-background border " + (autoRotate ? "border-background" : "border-foreground")} onClick={() => setAutoRotate(!autoRotate)}>
            <Play className="w-6 h-6" />
          </button>
          <button className={"rounded-full bg-foreground text-background hover:text-foreground p-3  z-20 hover:bg-background border " + (controlsEnabled ? "border-background" : "border-foreground")} onClick={() => setControlsEnabled(!controlsEnabled)}>
            <Rotate3d className="w-6 h-6" />
          </button>
          <button className={"rounded-full bg-foreground text-background hover:text-foreground p-3  z-20 hover:bg-background border border-foreground"} onClick={resetModel}>
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            className={"rounded-full bg-foreground text-background hover:text-foreground p-3  z-20 hover:bg-background border border-foreground"}
            onClick={() => {
              setFullscreen(!fullscreen);
            }}
          >
            <Fullscreen className="w-6 h-6" />
          </button>
        </div>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <ambientLight intensity={6} />
            {/* <directionalLight position={[10, 10, 5]} intensity={10} /> */}
            <Model objUrl="/model/model.obj" mtlUrl="/model/model.mtl" autoRotate={autoRotate} />
            <OrbitControls ref={controlsRef} enabled={controlsEnabled} enableZoom={controlsEnabled} onStart={() => {}} onEnd={() => {}} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
