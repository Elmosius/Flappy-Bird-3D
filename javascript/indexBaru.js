import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Load Floor Texture
const textureLoader = new THREE.TextureLoader();
const rockyTexture = textureLoader.load('./textures/rocky_texture.jpg');
rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;
rockyTexture.repeat.set(10, 10);

const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: rockyTexture,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -15;
scene.add(floor);

// Load Bark Textures
const barkColorTexture = textureLoader.load('./textures/Bark014_1K-PNG_Color.png');
const barkAOTexure = textureLoader.load('./textures/Bark014_1K-PNG_AmbientOcclusion.png');
const barkRoughnessTexture = textureLoader.load('./textures/Bark014_1K-PNG_Roughness.png');
const barkNormalTexture = textureLoader.load('./textures/Bark014_1K-PNG_NormalGL.png');

barkColorTexture.wrapS = barkColorTexture.wrapT = THREE.RepeatWrapping;
barkAOTexure.wrapS = barkAOTexure.wrapT = THREE.RepeatWrapping;
barkRoughnessTexture.wrapS = barkRoughnessTexture.wrapT = THREE.RepeatWrapping;
barkNormalTexture.wrapS = barkNormalTexture.wrapT = THREE.RepeatWrapping;

// Material with Textures
const barkMaterial = new THREE.MeshStandardMaterial({
  map: barkColorTexture,
  aoMap: barkAOTexure,
  roughnessMap: barkRoughnessTexture,
  normalMap: barkNormalTexture,
  roughness: 1.0,
  metalness: 0.0,
});

// Function to Create Pipes
function createPipe(x, z, height, gap) {
  const randomGapY = Math.random() * 10 - 5; // Random gap position

  // Bottom Pipe
  const bottomPipeGeometry = new THREE.CylinderGeometry(1, 1, height, 32);
  bottomPipeGeometry.setAttribute("uv2", new THREE.BufferAttribute(bottomPipeGeometry.attributes.uv.array, 2)); // Add uv2 for aoMap
  const bottomPipe = new THREE.Mesh(bottomPipeGeometry, barkMaterial);
  bottomPipe.position.set(x, randomGapY - gap / 2 - height / 2, z);
  scene.add(bottomPipe);

  // Top Pipe
  const topPipeGeometry = new THREE.CylinderGeometry(1, 1, height, 32);
  topPipeGeometry.setAttribute("uv2", new THREE.BufferAttribute(topPipeGeometry.attributes.uv.array, 2)); // Add uv2 for aoMap
  const topPipe = new THREE.Mesh(topPipeGeometry, barkMaterial);
  topPipe.position.set(x, randomGapY + gap / 2 + height / 2, z);
  scene.add(topPipe);

  // Bottom Edge
  const bottomEdgeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
  const bottomEdge = new THREE.Mesh(bottomEdgeGeometry, barkMaterial);
  bottomEdge.position.set(x, randomGapY - gap / 2, z);
  scene.add(bottomEdge);

  // Top Edge
  const topEdgeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
  const topEdge = new THREE.Mesh(topEdgeGeometry, barkMaterial);
  topEdge.position.set(x, randomGapY + gap / 2, z);
  scene.add(topEdge);
}

// Add Pipes
for (let i = 0; i < 5; i++) {
  const x = i * 15;
  const z = 0;
  const height = 20;
  const gap = 10;
  createPipe(x, z, height, gap);
}

// Load Bird Model
const loader = new GLTFLoader();
let bird;
loader.load('./assets/phoenix_bird.glb', (gltf) => {
  bird = gltf.scene;
  bird.position.set(-2, 5, 0);
  bird.scale.set(0.005, 0.005, 0.005);
  scene.add(bird);
});

// Skybox
const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxTexture = skyboxLoader.load([
  './skyBox/cube_right.png', './skyBox/cube_left.png',
  './skyBox/cube_up.png', './skyBox/cube_down.png',
  './skyBox/cube_back.png', './skyBox/cube_front.png',
]);
scene.background = skyboxTexture;

// Animation
function animate() {
  requestAnimationFrame(animate);
  if (bird) bird.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize Event
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

camera.position.set(0, 2, 30);