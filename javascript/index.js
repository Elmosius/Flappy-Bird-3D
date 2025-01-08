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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
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
floor.position.y = -5;
scene.add(floor);

// Array untuk menyimpan pasangan pipa
const pipes = [];

// Fungsi untuk membuat pipa dengan ujung membesar
function createPipe(x, z, height, gap) {
  const pipeColor = 0x5fc943; // Warna hijau
  const pipeMaterial = new THREE.MeshStandardMaterial({ color: pipeColor });

  // Bagian bawah pipa
  const bottomPipeGeometry = new THREE.CylinderGeometry(1, 1, height, 32); // Geometri tabung bawah
  const bottomPipe = new THREE.Mesh(bottomPipeGeometry, pipeMaterial);
  bottomPipe.position.set(x, height / 2, z); // Tempatkan bagian bawah
  scene.add(bottomPipe);

  // Bagian atas pipa
  const topPipeGeometry = new THREE.CylinderGeometry(1, 1, height, 32); // Geometri tabung atas
  const topPipe = new THREE.Mesh(topPipeGeometry, pipeMaterial);
  topPipe.position.set(x, gap + height + height / 2, z); // Tempatkan bagian atas
  scene.add(topPipe);

  // Ujung bawah (membesar)
  const bottomEdgeGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32); // Membesar di ujung
  const bottomEdge = new THREE.Mesh(bottomEdgeGeometry, pipeMaterial);
  bottomEdge.position.set(x, height + 0.25, z); // Tepat di ujung atas pipa bawah
  scene.add(bottomEdge);

  // Ujung atas (membesar)
  const topEdgeGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32); // Membesar di ujung
  const topEdge = new THREE.Mesh(topEdgeGeometry, pipeMaterial);
  topEdge.position.set(x, gap + height - 0.25, z); // Tepat di ujung bawah pipa atas
  scene.add(topEdge);

  // Simpan pasangan pipa dan posisi dasarnya
  pipes.push({
    lowerPipe: bottomPipe,
    upperPipe: topPipe,
    baseY: height / 2,
    gapHeight: gap,
  });
}

// Tambahkan pipa ke scene
for (let i = 0; i < 5; i++) {
  const x = i * 10; // Posisi horizontal
  const z = 0; // Posisi sumbu Z
  const height = 10; // Tinggi tubuh pipa
  const gap = 5; // Jarak antara pipa atas dan bawah
  createPipe(x, z, height, gap); // Panggil fungsi untuk membuat pipa
}

const loader = new GLTFLoader();
let bird;
loader.load('./assets/phoenix_bird.glb', (gltf) => {
  bird = gltf.scene;
  bird.position.set(-2, 5, 0);
  bird.scale.set(0.005, 0.005, 0.005);
  scene.add(bird);
});

const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxTexture = skyboxLoader.load([
  './skyBox/px.png', './skyBox/nx.png',
  './skyBox/py.png', './skyBox/ny.png',
  './skyBox/pz.png', './skyBox/nz.png',
]);
scene.background = skyboxTexture;

camera.position.set(0, 2, 30);

let time = 0; // Waktu untuk animasi

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