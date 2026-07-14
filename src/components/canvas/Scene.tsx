"use client";

import { Canvas } from "@react-three/fiber";
import { NeonParticles } from "./NeonParticles";
import { Preload, Environment } from "@react-three/drei";
import { Suspense } from "react";

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10 bg-transparent pointer-events-none">
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[15, 15, 15]} intensity={2} color="#ffd700" />
          <pointLight position={[-15, -15, -15]} intensity={1.8} color="#ff007f" />
          <pointLight position={[0, 0, 20]} intensity={1} color="#b026ff" />
          <NeonParticles count={350} />
          <Environment preset="city" />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
