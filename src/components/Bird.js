import * as CANNON from "cannon-es";
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { Clock, AnimationMixer } from "three";

export default class Bird {
  constructor(scene, camera, physicsWorld) {
    this.scene = scene;
    this.camera = camera;
    this.clock = new Clock();
    this.mixer = null;
    this.bird = null;
    this.isFalling = false;
    this.physicsWorld = physicsWorld;

    this.initPhysics();
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

  initPhysics() {
    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 1, 0),
      shape: new CANNON.Sphere(0.5),
    });

    this.body.collisionResponse = true;
    // biar maju ke depan terus
    this.body.velocity.set(2, 0, 0);

    // kunci burung biar ga jatuh
    this.body.angularFactor.set(0, 0, 0);

    this.physicsWorld.addBody(this.body);

    this.body.addEventListener("collide", (event) => {
      if (event.body) {
        console.log("Collision detected with:", event.body);
        this.onCollision(event);
      }
    });
  }

  update() {
    if (this.mixer && !this.isFalling) {
      this.mixer.update(this.clock.getDelta());
    }

    if (this.bird && this.body) {
      this.bird.position.copy(this.body.position);
      this.bird.quaternion.copy(this.body.quaternion);

      // biar ga nembus lantai
      if (this.body.position.y < -1) {
        this.body.position.y = -1;
        this.body.velocity.y = 0;
      }

      if (Math.round(this.body.position.y) <= -1 && this.isFalling) {
        this.stopAnimation();
        this.stopBird();

        // reset dari awal lagi
        alert("Game Over semetara hehe");
        this.resetBird();
      }

      this.camera.position.set(this.bird.position.x - 5, this.bird.position.y + 2, this.bird.position.z);
      this.camera.lookAt(this.bird.position);
    }
  }

  jump() {
    if (this.body && !this.isFalling) {
      this.body.velocity.y = 5;
    }
  }

  stopAnimation() {
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
  }

  stopBird() {
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.body.angularFactor.set(0, 0, 0);
    this.body.velocity.set(0, 0, 0);
  }

  onCollision(event) {
    this.body.velocity.set(-2, -5, 0);
    this.body.angularFactor.set(1, 1, 1);
    this.body.angularVelocity.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    this.isFalling = true;
    this.stopAnimation();
  }

  resetBird() {
    this.body.position.set(0, 1, 0);
    this.body.velocity.set(2, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.body.quaternion.set(0, 0, 0, 1);
    this.body.angularFactor.set(0, 0, 0);
    this.isFalling = false;

    if (this.mixer && this.bird) {
      const animations = this.mixer._actions;
      animations.forEach((action) => {
        action.reset();
        action.play();
      });
    }
    location.reload();
  }
}
