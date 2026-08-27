"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Color, Object3D } from "three";
import type { Group, InstancedMesh } from "three";

import { createLensMotion, updateLensFrame } from "./lens-animation";
import type { LensInput } from "./lens-animation";

const TAU = Math.PI * 2;

function LensGrip() {
  const mesh = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    const transform = new Object3D();
    const color = new Color();
    for (let index = 0; index < 72; index += 1) {
      const angle = (index / 72) * TAU;
      transform.position.set(
        Math.cos(angle) * 2.11,
        Math.sin(angle) * 2.11,
        -0.12,
      );
      transform.rotation.set(0, 0, angle);
      transform.updateMatrix();
      mesh.current.setMatrixAt(index, transform.matrix);
      mesh.current.setColorAt(
        index,
        color.set(index % 2 === 0 ? "#171a1d" : "#0b0d0f"),
      );
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor)
      mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, []);

  // The same 72 grip details in a single draw call, including on phones.
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 72]}>
      <boxGeometry args={[0.025, 0.19, 0.48]} />
      <meshStandardMaterial
        roughness={0.66}
        metalness={0.48}
        transparent
        opacity={0.82}
      />
    </instancedMesh>
  );
}

function LensAssembly({ input }: { input: RefObject<LensInput> }) {
  const group = useRef<Group>(null);
  const glass = useRef<Group>(null);
  const iris = useRef<Group>(null);
  const reflections = useRef<Group>(null);
  const motion = useRef(createLensMotion());
  const parts = { group, glass, iris, reflections };

  useFrame(({ clock }, delta) => {
    updateLensFrame(parts, motion.current, input, clock.elapsedTime, delta);
  });

  return (
    <group ref={group} rotation={[-0.05, 0.1, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.18]}>
        <cylinderGeometry args={[2.18, 2.08, 0.58, 120, 1, true]} />
        <meshStandardMaterial
          color="#090b0d"
          roughness={0.44}
          metalness={0.76}
          transparent
          opacity={0.84}
        />
      </mesh>

      <LensGrip />

      <mesh position={[0, 0, 0.14]}>
        <ringGeometry args={[1.76, 2.15, 120]} />
        <meshStandardMaterial
          color="#0d0f11"
          roughness={0.5}
          metalness={0.72}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh position={[0, 0, 0.18]}>
        <ringGeometry args={[1.62, 1.77, 120]} />
        <meshStandardMaterial
          color="#555b5e"
          roughness={0.24}
          metalness={0.9}
          transparent
          opacity={0.78}
        />
      </mesh>

      {[2.1, 2.04, 1.98, 1.91, 1.84].map((radius, index) => (
        <mesh key={`thread-${radius}`} position={[0, 0, 0.2 + index * 0.006]}>
          <torusGeometry args={[radius, 0.018, 12, 120]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#777d80" : "#171a1c"}
            roughness={0.34}
            metalness={0.92}
            transparent
            opacity={0.72}
          />
        </mesh>
      ))}

      <group ref={glass}>
        <mesh position={[0, 0, 0.24]}>
          <circleGeometry args={[1.61, 120]} />
          <meshPhysicalMaterial
            color="#24493d"
            emissive="#07120f"
            emissiveIntensity={0.18}
            roughness={0.04}
            metalness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.025}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>

        {[1.43, 1.2, 0.92, 0.62].map((radius, index) => (
          <mesh
            key={`glass-ring-${radius}`}
            position={[0, 0, 0.27 + index * 0.012]}
          >
            <torusGeometry
              args={[radius, index === 0 ? 0.035 : 0.018, 14, 120]}
            />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#5d766f" : "#243e37"}
              roughness={0.14}
              metalness={0.42}
              transparent
              opacity={0.34}
              depthWrite={false}
            />
          </mesh>
        ))}

        <group ref={iris} position={[0, 0, 0.34]}>
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index / 8) * TAU;
            return (
              <mesh
                key={`blade-${index}`}
                position={[
                  Math.cos(angle) * 0.2,
                  Math.sin(angle) * 0.2,
                  index * 0.002,
                ]}
                rotation={[0, 0, angle + 0.56]}
              >
                <boxGeometry args={[0.72, 0.25, 0.025]} />
                <meshStandardMaterial
                  color={index % 2 === 0 ? "#171b1e" : "#0d1012"}
                  roughness={0.4}
                  metalness={0.68}
                  transparent
                  opacity={0.66}
                  depthWrite={false}
                />
              </mesh>
            );
          })}
        </group>

        <mesh position={[0, 0, 0.44]}>
          <circleGeometry args={[0.14, 64]} />
          <meshPhysicalMaterial
            color="#000304"
            emissive="#020607"
            emissiveIntensity={0.12}
            roughness={0.04}
            clearcoat={1}
            transparent
            opacity={0.74}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0, 0.45]}>
          <torusGeometry args={[0.37, 0.024, 16, 80]} />
          <meshStandardMaterial
            color="#3c4947"
            roughness={0.18}
            metalness={0.82}
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </mesh>

        <group ref={reflections}>
          <mesh position={[-0.48, 0.54, 0.5]} scale={[1.75, 0.38, 1]}>
            <circleGeometry args={[0.3, 48]} />
            <meshBasicMaterial
              color="#d9edf1"
              transparent
              opacity={0.17}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0.55, 0.16, 0.48]} scale={[0.7, 1.6, 1]}>
            <circleGeometry args={[0.42, 48]} />
            <meshBasicMaterial
              color="#3d7954"
              transparent
              opacity={0.1}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function LensCanvas({
  input,
  dpr,
  active = true,
  onReady,
}: {
  input: RefObject<LensInput>;
  dpr: number;
  active?: boolean;
  onReady?: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () =>
      setVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      dpr={dpr}
      frameloop={visible && active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onReady?.();
      }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[3.5, 4.5, 6]}
        intensity={3.4}
        color="#eef2f3"
      />
      <pointLight
        position={[-3.5, 1.5, 4]}
        intensity={18}
        color="#86a9b6"
        distance={10}
      />
      <pointLight
        position={[3, -3, 3]}
        intensity={10}
        color="#a7adb2"
        distance={9}
      />
      <LensAssembly input={input} />
    </Canvas>
  );
}
