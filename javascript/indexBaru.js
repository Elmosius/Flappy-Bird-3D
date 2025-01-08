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
floor.position.y = -10;
scene.add(floor);

const pipes = [];

const textureLoader2 = new THREE.TextureLoader();
const barkTexture = textureLoader2.load('./textures/bark.png'); // Pastikan jalur file benar
barkTexture.wrapS = THREE.RepeatWrapping; // Ulangi tekstur pada sumbu S (X)
barkTexture.wrapT = THREE.RepeatWrapping; // Ulangi tekstur pada sumbu T (Y)
barkTexture.repeat.set(1, 1); // Atur pengulangan tekstur

// Material dengan tekstur bark
const barkMaterial = new THREE.MeshStandardMaterial({
  map: barkTexture, // Terapkan tekstur
  roughness: 0.7, // Atur kekasaran material
  metalness: 0, // Atur tingkat metalik
});

function createPipe(x, z, height, gap) {
    const pipeColor = 0x5fc943;
    const pipeMaterial = new THREE.MeshStandardMaterial({ color: pipeColor });
  
    const randomGapY = Math.random() * 10 - 5; // Posisi celah acak antara -5 hingga +5
  
    // Bagian bawah pipa
    const bottomPipeGeometry = new THREE.CylinderGeometry(1, 1, height, 32); // Geometri tabung bawah
    const bottomPipe = new THREE.Mesh(bottomPipeGeometry, barkMaterial);
    bottomPipe.position.set(x, randomGapY - gap / 2 - height / 2, z); // Tempatkan bagian bawah
    scene.add(bottomPipe);
  
    // Bagian atas pipa
    const topPipeGeometry = new THREE.CylinderGeometry(1, 1, height, 32); // Geometri tabung atas
    const topPipe = new THREE.Mesh(topPipeGeometry, barkMaterial);
    topPipe.position.set(x, randomGapY + gap / 2 + height / 2, z); // Tempatkan bagian atas
    scene.add(topPipe);
  
    // Ujung bawah (membesar)
    const bottomEdgeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32); // Membesar di ujung
    const bottomEdge = new THREE.Mesh(bottomEdgeGeometry, barkMaterial);
    bottomEdge.position.set(x, randomGapY - gap / 2, z); // Tepat di ujung atas pipa bawah
    scene.add(bottomEdge);
  
    // Ujung atas (membesar)
    const topEdgeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32); // Membesar di ujung
    const topEdge = new THREE.Mesh(topEdgeGeometry, barkMaterial);
    topEdge.position.set(x, randomGapY + gap / 2, z); // Tepat di ujung bawah pipa atas
    scene.add(topEdge);
  
    // Simpan pasangan pipa dan posisi dasarnya
    pipes.push({
      lowerPipe: bottomPipe,
      upperPipe: topPipe,
      baseY: randomGapY, // Simpan posisi celah acak
      gapHeight: gap,
    });
  }
  
  // Tambahkan pipa ke scene
  for (let i = 0; i < 5; i++) {
    const x = i * 15; // Posisi horizontal
    const z = 0; // Posisi sumbu Z
    const height = 20; // Tinggi tubuh pipa
    const gap = 10; // Jarak antara pipa atas dan bawah
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
    './skyBox/cube_right.png', './skyBox/cube_left.png',
    './skyBox/cube_up.png', './skyBox/cube_down.png',
    './skyBox/cube_back.png', './skyBox/cube_front.png',
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
  
