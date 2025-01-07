/* eslint-disable react/no-unknown-property */

export default function PlaneMesh() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshStandardMaterial color="lightblue" transparent="true" opacity={0.8} />
    </mesh>
  );
}
