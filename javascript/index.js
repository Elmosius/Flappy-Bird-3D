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
floor.position.y = -1;
scene.add(floor);

const pipeColor = 0x5fc943;
const pipeGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
const pipeMaterial = new THREE.MeshStandardMaterial({ color: pipeColor });

const pipeSpacing = 10; // Jarak antar pasangan pipa
const gapHeight = 5; // Tinggi celah antara pipa atas dan bawah
const pipeCount = 10; // Jumlah pasangan pipa
let pipes = []; // Array untuk menyimpan pasangan pipa

for (let i = 0; i < pipeCount; i++) {
  const xPosition = i * pipeSpacing;

  // Pipa bawah
  const lowerPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
  lowerPipe.position.set(xPosition, -5, 0); // Posisi pipa bawah lebih rendah
  scene.add(lowerPipe);

  // Pipa atas
  const upperPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
  upperPipe.position.set(xPosition, 5 + gapHeight, 0); // Posisi pipa atas lebih tinggi
  scene.add(upperPipe);

  pipes.push({ lowerPipe, upperPipe, baseY: Math.random() * 2 - 1 }); // Simpan pipa dan posisi dasar
}

const loader = new GLTFLoader();
let bird;
loader.load('./assets/phoenix_bird.glb', (gltf) => {
  bird = gltf.scene;
  bird.position.set(-2, 5, 0);
  bird.scale.set(0.005, 0.005, 0.005);
  scene.add(bird);
});

camera.position.set(0, 2, 30);

let time = 0; // Waktu untuk animasi

function animate() {
  requestAnimationFrame(animate);

  if (bird) {
    bird.rotation.y += 0.01;
  }

  // Animasi naik turun pipa
  time += 0.01;
  pipes.forEach((pair, index) => {
    const waveOffset = index * 0.5; // Offset gelombang untuk setiap pipa
    const wave = Math.sin(time + waveOffset) * 2; // Gelombang sinusoidal
    pair.lowerPipe.position.y = pair.baseY + wave - 5;
    pair.upperPipe.position.y = pair.baseY + wave + 5 + gapHeight;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});