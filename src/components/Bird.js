import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { Clock, AnimationMixer } from "three";

export default class Bird {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.clock = new Clock();
    this.mixer = null;
    this.bird = null;

    this.loadBird();
  }

  loadBird() {
    const loader = new GLTFLoader();
    loader.load("./assets/objects/phoenix_bird.glb", (gltf) => {
      this.bird = gltf.scene;
      this.bird.position.set(0, 1, 0);
      this.bird.scale.set(0.005, 0.005, 0.005);
      this.scene.add(this.bird);

      this.mixer = new AnimationMixer(this.bird);
      if (gltf.animations.length > 0) {
        const action = this.mixer.clipAction(gltf.animations[0]);
        action.play();
      }
    });
  }

  update() {
    if (this.mixer) this.mixer.update(this.clock.getDelta());
    if (this.bird) {
      this.bird.position.x += 0.1;
      this.camera.position.set(this.bird.position.x - 5, this.bird.position.y + 2, this.bird.position.z);
      this.camera.lookAt(this.bird.position);
    }
  }
}
