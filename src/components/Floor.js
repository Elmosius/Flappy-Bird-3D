import * as THREE from "three";
import * as CANNON from "cannon-es";

export default class Floor {
  constructor(scene, physicsWorld, camera) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.camera = camera;
    this.rockyTexture = null;
    this.initFloor();
  }

  initFloor() {
    const textureLoader = new THREE.TextureLoader();
    this.rockyTexture = textureLoader.load("./assets/textures/rocky_texture.jpg");
    this.rockyTexture.wrapS = this.rockyTexture.wrapT = THREE.RepeatWrapping;
    this.rockyTexture.repeat.set(50, 50);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({ map: this.rockyTexture }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    floor.name = "floor";
    this.scene.add(floor);

    // Sinkronkan posisi tubuh fisik lantai
    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    floorBody.position.set(0, -5, 0);
    this.physicsWorld.addBody(floorBody);

    this.floor = floor;
  }

  update() {
    if (this.rockyTexture && this.camera) {
      // Gulir tekstur sesuai posisi kamera
      this.rockyTexture.offset.x = this.camera.position.x * 0.01;
      this.rockyTexture.offset.y = this.camera.position.z * 0.01;
    }
  }
}
