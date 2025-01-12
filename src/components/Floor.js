import * as THREE from "three";

export default class Floor {
  constructor(scene) {
    this.scene = scene;
    this.addFloor();
  }

  addFloor() {
    const textureLoader = new THREE.TextureLoader();
    const rockyTexture = textureLoader.load("./assets/textures/rocky_texture.jpg");
    rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;
    rockyTexture.repeat.set(10, 10);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ map: rockyTexture }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    this.scene.add(floor);
  }
}
