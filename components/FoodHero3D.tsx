"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, OrbitControls, useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Pizza() {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  // This supplied .glb file is actually a PNG image, so load it as a texture.
  const pizzaTexture = useTexture("/realistic_pizza.glb");
  pizzaTexture.colorSpace = THREE.SRGBColorSpace;
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.12;
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, -pointer.y * 0.19 - 0.12, 4, delta);
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, pointer.x * 0.16, 4, delta);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
  });
  return <group ref={ref} rotation={[-0.12, 0.25, -0.12]}>
    <mesh castShadow receiveShadow position={[0, -.08, 0]}><cylinderGeometry args={[1.4, 1.4, .18, 64]} /><meshStandardMaterial color="#b9753d" roughness={.72} /></mesh>
    <mesh position={[0, .015, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.36, 64]} /><meshStandardMaterial map={pizzaTexture} roughness={.72} /></mesh>
  </group>;
}

export default function FoodHero3D() {
  return <div className="hero-canvas" aria-label="Interactive 3D illustration of a freshly made vegetarian pizza"><Canvas camera={{ position: [0, 3.5, 5.6], fov: 37 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={0.8} /><directionalLight position={[5, 5, 5]} intensity={1.5} />
    <Suspense fallback={null}><Environment preset="city" /><Float speed={1.05} rotationIntensity={.07} floatIntensity={.18}><Pizza /></Float><ContactShadows position={[0,-.28,0]} opacity={.32} scale={4} blur={2.5} far={2} /></Suspense>
    <OrbitControls enableZoom={false} />
  </Canvas></div>;
}
