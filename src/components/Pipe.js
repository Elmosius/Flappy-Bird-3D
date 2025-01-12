import * as THREE from "three";

export default class Pipe {
  constructor(scene, barkMaterial, x, z, height, gap) {
    this.scene = scene;
    this.barkMaterial = barkMaterial;
    this.x = x;
    this.z = z;
    this.height = height;
    this.gap = gap;

    this.addPipes();
  }

  addPipes() {
    const randomGapY = Math.random() * 10 - 5;

    // Bottom Pipe
    const bottomPipe = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, this.height, 32), this.barkMaterial);
    bottomPipe.position.set(this.x, randomGapY - this.gap / 2 - this.height / 2, this.z);
    this.scene.add(bottomPipe);

    // Top Pipe
    const topPipe = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, this.height, 32), this.barkMaterial);
    topPipe.position.set(this.x, randomGapY + this.gap / 2 + this.height / 2, this.z);
    this.scene.add(topPipe);
  }
}
