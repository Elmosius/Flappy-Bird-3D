import * as THREE from "three";
import * as CANNON from "cannon-es";
  
export default class Pipe {
  constructor(scene, barkMaterial, physicsWorld, x, z, height, gap) {
    this.scene = scene;
    this.barkMaterial = barkMaterial;
    this.physicsWorld = physicsWorld;
    this.x = x;
    this.z = z;
    this.height = height;
    this.gap = gap;

    this.bottomPipe = null;
    this.topPipe = null;
    this.addPipes();
  }

  addPipes() {
    const randomGapY = Math.random() * 10 - 5;

    const bottomPipeMesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, this.height, 32), this.barkMaterial);
    bottomPipeMesh.position.set(this.x, randomGapY - this.gap / 2 - this.height / 2, this.z);
    this.scene.add(bottomPipeMesh);

    const bottomPipeBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Cylinder(1, 1, this.height, 32),
    });
    bottomPipeBody.position.set(this.x, randomGapY - this.gap / 2 - this.height / 2, this.z);
    this.physicsWorld.addBody(bottomPipeBody);

    const topPipeMesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, this.height, 32), this.barkMaterial);
    topPipeMesh.position.set(this.x, randomGapY + this.gap / 2 + this.height / 2, this.z);
    this.scene.add(topPipeMesh);

    const topPipeBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Cylinder(1, 1, this.height, 32),
    });
    topPipeBody.position.set(this.x, randomGapY + this.gap / 2 + this.height / 2, this.z);
    this.physicsWorld.addBody(topPipeBody);

    this.bottomPipe = { mesh: bottomPipeMesh, body: bottomPipeBody };
    this.topPipe = { mesh: topPipeMesh, body: topPipeBody };
  }
}
