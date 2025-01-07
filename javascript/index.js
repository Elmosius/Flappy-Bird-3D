import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Cahaya ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Cahaya arah
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();
const rockyTexture = textureLoader.load('./textures/rocky_texture.jpg');

const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: rockyTexture,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; 
floor.position.y = -1; 
scene.add(floor);

const pipeColor = 0x5fc943; 
const pipeGeometry = new THREE.CylinderGeometry(1, 1, 10, 32); 
const pipeMaterial = new THREE.MeshStandardMaterial({ color: pipeColor });

for (let i = 0; i < 10; i++) {
  const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
  pipe.position.set(i * 5, Math.random() * 5 - 2, 0); // Posisikan pipa secara horizontal
  scene.add(pipe);
}

const loader = new GLTFLoader();
let bird;
loader.load('./assets/phoenix_bird.glb', (gltf) => {
  bird = gltf.scene;
  bird.position.set(-2, 5, 0); 
  bird.scale.set(0.005, 0.005, 0.005); 
  scene.add(bird);
});

camera.position.set(0, 2, 10);

function animate() {
  requestAnimationFrame(animate);

  if (bird) {
    bird.rotation.y += 0.01;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
