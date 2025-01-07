import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";

function AnimatedBox({ position = [0, 0, 0] }) {
  const boxRef = useRef();

  useFrame(() => {
    boxRef.current.rotation.x += 0.01;
    boxRef.current.rotation.y += 0.01;
  });

  return (
    <mesh position={position} ref={boxRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial color={0x00bfff} />
    </mesh>
  );
}

export default function App() {
  return (
    <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        style={{
          background: "white",
        }}
      >
        <axesHelper args={[10]} />
        <gridHelper args={[10]} />
        <OrbitControls />
        <AnimatedBox position={[0, 0.5, 0]} />
        <directionalLight position={[0, 0, 5]} intensity={1} />
      </Canvas>
    </div>
  );
}
