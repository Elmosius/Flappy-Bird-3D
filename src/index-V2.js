import * as CANNON from "cannon-es";
import * as THREE from "three";
import Controls from "./components/controls.js";
import Lights from "./components/lights.js";
import Floor from "./components/Floor.js";
import SkyBox from "./components/SkyBox.js";
import Pipe from "./components/Pipe.js";
import Bird from "./components/Bird.js";
import KeyboardHelper from "./components/keyboard.js";

//* SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xa0a0a0, 20, 100);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// cannon
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// new Controls(camera, document.body);
new Lights(scene);
new Floor(scene, world);
new SkyBox(scene);

const keyboard = new KeyboardHelper();
///////////////////////////////////////////////////////////////////////////////////////////////////////

// PIPA
const textureLoader = new THREE.TextureLoader();
const barkColorTexture = textureLoader.load("./assets/textures/pipe_texture.jpg");
const barkAOTexure = textureLoader.load("./assets/textures/pipe_texture.jpg");
const barkRoughnessTexture = textureLoader.load("./assets/textures/pipe_texture.jpg");
const barkNormalTexture = textureLoader.load("./assets/textures/pipe_texture.jpg");
const barkMaterial = new THREE.MeshStandardMaterial({
  map: barkColorTexture,
  aoMap: barkAOTexure,
  roughnessMap: barkRoughnessTexture,
  normalMap: barkNormalTexture,
  roughness: 1.0,
  metalness: 0.0,
});
for (let i = 0; i < 5; i++) {
  new Pipe(scene, barkMaterial, world, i * 20 + 10, 0, 20, 10);
}
// end of PIPA
const bird = new Bird(scene, camera, world);

///////////////////////////////////////////////////////////////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);

  world.step(1 / 60);

  if (keyboard.keys[" "]) {
    bird.jump();
  }

  bird.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
