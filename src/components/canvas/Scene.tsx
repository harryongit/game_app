"use client";

import { Canvas } from "@react-three/fiber";
import { NeonParticles } from "./NeonParticles";
import { Preload, Environment } from "@react-three/drei";
import { Suspense } from "react";

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10 bg-black pointer-events-none">
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#b026ff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#00f3ff" />
          <NeonParticles count={300} />
          <Environment preset="city" />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
