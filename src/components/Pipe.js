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
    bottomPipeMesh.name = "pipe";
    bottomPipeMesh.scored = false;
    this.scene.add(bottomPipeMesh);

    const bottomPipeBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Cylinder(1, 1, this.height, 32),
    });
    bottomPipeBody.position.set(this.x, randomGapY - this.gap / 2 - this.height / 2, this.z);
    this.physicsWorld.addBody(bottomPipeBody);

    const bottomEdgeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const bottomEdgeMesh = new THREE.Mesh(bottomEdgeGeometry, this.barkMaterial);
    bottomEdgeMesh.position.set(this.x, randomGapY - this.gap / 2, this.z);
    bottomEdgeMesh.name = "pipe";
    this.scene.add(bottomEdgeMesh);

    const bottomEdgeBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Cylinder(1.5, 1.5, 2, 32),
    });
    bottomEdgeBody.position.set(this.x, randomGapY - this.gap / 2, this.z);
    this.physicsWorld.addBody(bottomEdgeBody);

    const topPipeMesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, this.height, 32), this.barkMaterial);
    topPipeMesh.position.set(this.x, randomGapY + this.gap / 2 + this.height / 2, this.z);
    topPipeMesh.name = "pipe";
    this.scene.add(topPipeMesh);

    const topPipeBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Cylinder(1, 1, this.height, 32),
    });
    topPipeBody.position.set(this.x, randomGapY + this.gap / 2 + this.height / 2, this.z);
    this.physicsWorld.addBody(topPipeBody);

    const topEdgeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const topEdgeMesh = new THREE.Mesh(topEdgeGeometry, this.barkMaterial);
    topEdgeMesh.position.set(this.x, randomGapY + this.gap / 2, this.z);
    topEdgeMesh.name = "pipe";
    this.scene.add(topEdgeMesh);

    const topEdgeBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Cylinder(1.5, 1.5, 2, 32),
    });
    topEdgeBody.position.set(this.x, randomGapY + this.gap / 2, this.z);
    this.physicsWorld.addBody(topEdgeBody);

    this.bottomPipe = {
      mesh: bottomPipeMesh,
      body: bottomPipeBody,
      edge: { mesh: bottomEdgeMesh, body: bottomEdgeBody },
    };
    this.topPipe = {
      mesh: topPipeMesh,
      body: topPipeBody,
      edge: { mesh: topEdgeMesh, body: topEdgeBody },
    };
  }
}
