import * as CANNON from "cannon-es";
import * as THREE from "three";
import Controls from "./components/controls.js";
import Lights from "./components/Lights.js";
import Floor from "./components/Floor.js";
import SkyBox from "./components/SkyBox.js";
import Pipe from "./components/Pipe.js";
import Bird from "./components/Bird.js";
import KeyboardHelper from "./components/keyboard.js";
import AudioHelper from "./components/Audio.js";
import Score from "./components/Score.js";

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

// set audio
// const audio = new AudioHelper(camera, "/src/assets/audios/backsound_squid_game.mp3", {
//   loop: true,
//   volume: 0.5,
//   autoplay: true,
// });

const keyboard = new KeyboardHelper();
///////////////////////////////////////////////////////////////////////////////////////////////////////

// PIPA
const textureLoader = new THREE.TextureLoader();
const barkColorTexture = textureLoader.load("./assets/textures/Bark014_1K-PNG_Color.png");
const barkAOTexure = textureLoader.load("./assets/textures/Bark014_1K-PNG_AmbientOcclusion.png");
const barkRoughnessTexture = textureLoader.load("./assets/textures/Bark014_1K-PNG_Roughness.png");
const barkNormalTexture = textureLoader.load("./assets/textures/Bark014_1K-PNG_NormalGL.png");
const barkMaterial = new THREE.MeshStandardMaterial({
  map: barkColorTexture,
  aoMap: barkAOTexure,
  roughnessMap: barkRoughnessTexture,
  normalMap: barkNormalTexture,
  roughness: 1.0,
  metalness: 0.0,
});

const pipes = [];
for (let i = 0; i < 5; i++) {
  const pipe = new Pipe(scene, barkMaterial, world, i * 20 + 10, 0, 20, 15);
  pipes.push(pipe);
}
// end of PIPA

// SCORE
const scoreManager = new Score();

// Burungnya
const bird = new Bird(scene, camera, world, scoreManager);
///////////////////////////////////////////////////////////////////////////////////////////////////////

function updateFloor() {
  const birdX = bird.body.position.x;

  scene.children.forEach((object) => {
    if (object.name === "floor") {
      const speed = bird.body.velocity.x;
      object.position.x -= speed * 0.02;

      // Jika lantai sudah di luar pandangan kamera, pindahkan ke depan
      if (object.position.x < birdX - 50) {
        object.position.x += 100;
      }
    }
  });
}

function updatePipes() {
  pipes.forEach((pipe) => {
    // Cek apakah burung melewati pipa
    if (bird.body.position.x > pipe.bottomPipe.mesh.position.x && !pipe.bottomPipe.mesh.scored) {
      scoreManager.updateScore(1);
      pipe.bottomPipe.mesh.scored = true;
      console.log("Burung melewati pasangan pipa, skor bertambah.");
    }

    // Jika pipa keluar dari pandangan kamera, pindahkan ke depan
    if (pipe.bottomPipe.mesh.position.x < camera.position.x - 10) {
      const pairGap = 20;
      const newX = pipe.bottomPipe.mesh.position.x + pairGap * 5;
      pipe.updatePosition(newX, pipe.bottomPipe.mesh.position.z);
      pipe.bottomPipe.mesh.scored = false;
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  world.step(1 / 60);

  if (keyboard.keys[" "]) {
    bird.jump();
    keyboard.keys[" "] = false;
  }

  bird.update();
  updatePipes();
  updateFloor();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
