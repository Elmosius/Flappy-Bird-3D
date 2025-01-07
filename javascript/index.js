import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import KeyboardHelper from "./keyboard.js";

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xa0a0a0, 20, 100);

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
rockyTexture.wrapS = THREE.RepeatWrapping;
rockyTexture.wrapT = THREE.RepeatWrapping;
rockyTexture.repeat.set(10, 10);

const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ map: rockyTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

const pipeColor = 0x5fc943;
const pipeGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
const pipeMaterial = new THREE.MeshStandardMaterial({ color: pipeColor });

for (let i = 0; i < 10; i++) {
  const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
  pipe.position.set(i * 5, Math.random() * 5 - 2, 0); 
  scene.add(pipe);
}

const loader = new GLTFLoader();
let bird; 
let mixer; 
let clock = new THREE.Clock();

loader.load('./assets/phoenix_bird.glb', (gltf) => {
  bird = gltf.scene;
  bird.position.set(0, 1, 0); 
  bird.scale.set(0.005, 0.005, 0.005); 
  scene.add(bird);

  mixer = new THREE.AnimationMixer(bird);
  if (gltf.animations.length > 0) {
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }
});

const keyboard = new KeyboardHelper(); 

camera.position.set(0, 2, 10); 

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); 
  const elapsed = clock.getElapsedTime(); 

  if (mixer) mixer.update(delta);

  if (bird) {
    const birdPosition = bird.position;
    const offset = 5; 
    camera.position.set(
      birdPosition.x - offset, 
      birdPosition.y + 2,      
      birdPosition.z           
    );

    camera.lookAt(birdPosition);
  }
  if (bird) {
    if (keyboard.keys["d"] || keyboard.keys["ArrowRigt"]) bird.position.z += 0.1; // Gerak mundur
    if (keyboard.keys["s"] || keyboard.keys["ArrowDown"]) bird.position.x -= 0.1; // Gerak kiri
    if (keyboard.keys["w"] || keyboard.keys["Arrowup"]) bird.position.x += 0.1; // Gerak kanan
    if (keyboard.keys["a"] || keyboard.keys["ArrowLeft"]) bird.position.z -= 0.1; // Gerak kanan
    if (keyboard.keys[" "]) bird.position.y += 0.5; // Lompat (spasi)
    if (keyboard.keys["Shift"]) bird.position.y -= 0.1; // Turun (Shift)
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
