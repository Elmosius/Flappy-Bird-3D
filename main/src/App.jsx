/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";

export default function App() {
  return (
    <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        style={{
          background: "lightblue",
        }}
      >
        <mesh>
          {/* <sphereGeometry args={[1, 8, 8]} /> */}\
          <boxGeometry args={[1, 1, 1]} />
          <meshPhongMaterial color={0x00bfff} />
          <ambientLight />
          <directionalLight position={[0, 0, 5]} intensity={1} />
        </mesh>
      </Canvas>
    </div>
  );
}
