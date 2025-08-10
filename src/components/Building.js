import * as THREE from "three";

export function addBuildingToScene(scene, {
  position = new THREE.Vector3(0, 0, 0),
  floors = 0,
  floorHeight = 0,
  widthX = 0,
  depthZ = 0,
  color = 0x000000,
  roofColor = 0x000000,
}) {
  const buildingHeight = floors * floorHeight;

  const buildingGeo = new THREE.BoxGeometry(widthX, buildingHeight, depthZ);
  const buildingMat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
  const building = new THREE.Mesh(buildingGeo, buildingMat);
  building.position.set(position.x, buildingHeight / 2, position.z);
  building.castShadow = true;
  scene.add(building);

  const edges = new THREE.EdgesGeometry(buildingGeo);
  const outline = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x2e7d32, linewidth: 12 })
  );
  outline.position.copy(building.position);
  scene.add(outline);

  const roofGeo = new THREE.BoxGeometry(widthX + 0.4, 0.6, depthZ + 0.4);
  const roofMat = new THREE.MeshStandardMaterial({ color: roofColor });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(position.x, buildingHeight + 0.3, position.z);
  scene.add(roof);

  // Windows
  const windowGeom = new THREE.PlaneGeometry(0.9, 0.6);
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x9fc7ff,
    metalness: 0.1,
    roughness: 0.6,
    transparent: true,
    opacity: 0.95,
  });

  const addWindowsToFace = (face) => {
    const cols = Math.floor((face === "left" || face === "right") ? (depthZ / 1.6) : (widthX / 1.6));
    const rows = floors;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const w = new THREE.Mesh(windowGeom, windowMat.clone());

        const y = (r * floorHeight) + (floorHeight / 2);
        let x = 0, z = 0;

        if (face === "front") {
          x = -widthX / 2 + (c + 1) * (widthX / (cols + 1));
          z = depthZ / 2 + 0.01;
          w.rotation.y = 0;
        } else if (face === "back") {
          x = -widthX / 2 + (c + 1) * (widthX / (cols + 1));
          z = -depthZ / 2 - 0.01;
          w.rotation.y = Math.PI;
        } else if (face === "left") {
          x = -widthX / 2 - 0.01;
          z = -depthZ / 2 + (c + 1) * (depthZ / (cols + 1));
          w.rotation.y = Math.PI / 2;
        } else {
          x = widthX / 2 + 0.01;
          z = -depthZ / 2 + (c + 1) * (depthZ / (cols + 1));
          w.rotation.y = -Math.PI / 2;
        }

        w.position.set(x + position.x, y, z + position.z);

        const tone = 0.7 + Math.random() * 0.3;
        w.material.color = new THREE.Color(0.6 * tone, 0.75 * tone, 1 * tone);

        scene.add(w);
      }
    }
  };

  ["front", "back", "left", "right"].forEach(addWindowsToFace);

  // Door
  const doorGeo = new THREE.BoxGeometry(3, 2.6, 0.2);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x6b6b6b });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(position.x, 1.3, position.z + depthZ / 2 + 0.11);
  scene.add(door);

  return building.position.clone(); // return position for focusing
}
