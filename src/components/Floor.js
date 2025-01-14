import * as THREE from "three";
import * as CANNON from "cannon-es";

export default class Floor {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.addFloor();
  }

  addFloor() {
    const textureLoader = new THREE.TextureLoader();
    const rockyTexture = textureLoader.load("./assets/textures/rocky_texture.jpg");
    rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;
    rockyTexture.repeat.set(10, 10);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({ map: rockyTexture }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.name = "floor";
    this.scene.add(floor);

    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    floorBody.position.set(0, -1, 0);
    this.physicsWorld.addBody(floorBody);
  }
}
