import * as THREE from "three";

export function createGreenBorder({ size = 200, borderThickness = 1, borderHeight = 0.1, color = 0x00ff00 } = {}) {
  const borderLength = size + borderThickness * 2;
  const borderMat = new THREE.MeshBasicMaterial({ color });

  const borderTop = new THREE.Mesh(
    new THREE.BoxGeometry(borderLength, borderHeight, borderThickness),
    borderMat
  );
  borderTop.position.set(0, borderHeight / 2, -size / 2 - borderThickness / 2);

  const borderBottom = borderTop.clone();
  borderBottom.position.set(0, borderHeight / 2, size / 2 + borderThickness / 2);

  const borderLeft = new THREE.Mesh(
    new THREE.BoxGeometry(borderThickness, borderHeight, borderLength),
    borderMat
  );
  borderLeft.position.set(-size / 2 - borderThickness / 2, borderHeight / 2, 0);

  const borderRight = borderLeft.clone();
  borderRight.position.set(size / 2 + borderThickness / 2, borderHeight / 2, 0);

  return [borderTop, borderBottom, borderLeft, borderRight];
}
