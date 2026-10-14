"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Pizza() {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.12;
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, -pointer.y * 0.19 - 0.12, 4, delta);
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, pointer.x * 0.16, 4, delta);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
  });
  const olives = [[-.52,.31],[.42,.54],[.57,-.25],[-.1,-.58],[-.63,-.28],[.06,.12],[.2,-.1]];
  const tomato = [[-.2,.59],[.38,.12],[-.4,-.05],[.15,-.5],[.68,.22],[-.58,.52]];
  const basil = [[-.38,.35],[.5,-.48],[.06,.48],[-.14,-.27]];
  return <group ref={ref} rotation={[-0.12, 0.25, -0.12]}>
    <mesh castShadow receiveShadow position={[0, -.08, 0]}><cylinderGeometry args={[1.48, 1.48, .19, 64]} /><meshStandardMaterial color="#b9753d" roughness={.72} /></mesh>
    <mesh position={[0, .025, 0]}><cylinderGeometry args={[1.4, 1.4, .04, 64]} /><meshStandardMaterial color="#d94c37" roughness={.65} /></mesh>
    <mesh position={[0, .055, 0]}><cylinderGeometry args={[1.34, 1.34, .045, 64]} /><meshStandardMaterial color="#edc96d" roughness={.5} /></mesh>
    <mesh position={[0,.055,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.34,.13,16,64]} /><meshStandardMaterial color="#e5b86d" roughness={.62} /></mesh>
    {tomato.map(([x,z],i)=><mesh key={`tomato${i}`} position={[x,.095,z]} rotation={[-Math.PI/2,0,i]}><circleGeometry args={[.125,24]} /><meshStandardMaterial color="#c83f31" roughness={.45} /></mesh>)}
    {olives.map(([x,z],i)=><mesh key={`olive${i}`} position={[x,.125,z]} rotation={[Math.PI/2,.2,i]}><torusGeometry args={[.075,.027,8,16]} /><meshStandardMaterial color="#394b32" roughness={.3} /></mesh>)}
    {basil.map(([x,z],i)=><mesh key={`basil${i}`} position={[x,.11,z]} rotation={[-.2,0,i*1.2]} scale={[.09,.025,.16]}><sphereGeometry args={[1,16,12]} /><meshStandardMaterial color="#628047" roughness={.6} /></mesh>)}
    {[[.78,.48],[-.86,.62],[.86,-.7],[-.84,-.65],[.1,-.93]].map(([x,z],i)=><mesh key={`pepper${i}`} position={[x,.11,z]} rotation={[.2,i,0]}><sphereGeometry args={[.075,16,12]} /><meshStandardMaterial color="#78904d" roughness={.4} /></mesh>)}
  </group>;
}

export default function FoodHero3D() {
  return <div className="hero-canvas" aria-label="Interactive 3D illustration of a freshly made vegetarian pizza"><Canvas camera={{ position: [0, 3.5, 5.6], fov: 37 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={1.1} /><directionalLight position={[4,6,4]} intensity={2.1} castShadow shadow-mapSize={[1024,1024]} /><pointLight position={[-4,2,-2]} intensity={1.2} color="#f6c56b" />
    <Suspense fallback={null}><Float speed={1.05} rotationIntensity={.07} floatIntensity={.18}><Pizza /></Float><ContactShadows position={[0,-1.02,0]} opacity={.32} scale={5} blur={2.5} far={3} /></Suspense>
  </Canvas></div>;
}
