import * as THREE from "three";

export function addGreenery(scene, basePosition, widthX, depthZ) {
  const bushGeo = new THREE.SphereGeometry(0.8, 12, 8);
  const bushMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });

  const bushPositions = [
    [-widthX / 2 - 2, 0.8, depthZ / 2 + 2],
    [widthX / 2 + 2, 0.8, depthZ / 2 + 2],
    [-widthX / 2 - 2, 0.8, -depthZ / 2 - 2],
    [widthX / 2 + 2, 0.8, -depthZ / 2 - 2],
    [0, 0.8, depthZ / 2 + 3],
    [0, 0.8, -depthZ / 2 - 3],
    [-widthX / 4, 0.8, depthZ / 2 + 3],
    [widthX / 4, 0.8, depthZ / 2 + 3],
  ];

  bushPositions.forEach(([x, y, z]) => {
    const bush = new THREE.Mesh(bushGeo, bushMat);
    bush.position.set(basePosition.x + x, y, basePosition.z + z);
    bush.castShadow = true;
    bush.receiveShadow = true;
    scene.add(bush);
  });
}
