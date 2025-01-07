import { useRef } from "react";
import { DoubleSide, SpotLightHelper, TextureLoader } from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls, useHelper, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import PlaneMesh from "./components/PlaneMesh";

function LightWithHelper() {
  const light = useRef();
  const { angle, position } = useControls({
    angle: {
      value: Math.PI / 8,
      min: 0,
      max: Math.PI / 16,
    },
    position: {
      value: [0, 4, 1],
      step: 0.1,
    },
  });

  useHelper(light, SpotLightHelper, "orange");
  return <spotLight ref={light} position={position} intensity={15} angle={angle} castShadow />;
}

function AnimatedBox({ position = [0, 0, 0] }) {
  const gravel_texture = useTexture("/textures/gravel_bewarna/Gravel022_1K-JPG_Color.jpg");
  const gravel_normal = useTexture("/textures/gravel_bewarna/Gravel022_1K-JPG_NormalGL.jpg");
  const gravel_ao = useTexture("/textures/gravel_bewarna/Gravel022_1K-JPG_AmbientOcclusion.jpg");
  const gravel_rough = useTexture("/textures/gravel_bewarna/Gravel022_1K-JPG_Roughness.jpg");

  const boxRef = useRef();

  const { color, speed } = useControls({
    color: "#ffffff",
    speed: {
      value: 0.01,
      min: 0,
      max: 0.1,
    },
  });

  useFrame(() => {
    boxRef.current.rotation.x += speed;
    boxRef.current.rotation.y += speed;
  });

  return (
    <mesh position={position} ref={boxRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} map={gravel_texture} normalMap={gravel_normal} roughnessMap={gravel_rough} aoMap={gravel_ao} side={DoubleSide} />
    </mesh>
  );
}

export default function App() {
  return (
    <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        style={{
          background: "white",
        }}
      >
        <PlaneMesh />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>

        <axesHelper args={[10]} />
        <gridHelper args={[10, 10]} />
        <OrbitControls />
        <AnimatedBox position={[0, 1, 0]} />
        {/* <directionalLight position={[0, 0, 5]} intensity={1} castShadow /> */}
        <LightWithHelper />
      </Canvas>
    </div>
  );
}
