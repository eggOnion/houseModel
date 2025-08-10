import * as THREE from "three";

function lerpVector3(start, end, alpha) {
    return start.clone().lerp(end, alpha);
}

/**
 * Smoothly moves the camera to focus on a given position
 * @param {THREE.Vector3} buildingPosition - Target building position
 * @param {THREE.PerspectiveCamera} camera - The camera to move
 * @param {THREE.OrbitControls} controls - OrbitControls instance
 * @param {number} duration - Duration in milliseconds
 */

export function smoothFocus(buildingPosition, camera, controls, duration = 1000) {
    if (!camera || !controls) return;

    const startCamPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const endTarget = buildingPosition.clone();

    const offset = new THREE.Vector3(30, 20, 40);
    const endCamPos = buildingPosition.clone().add(offset);

    let startTime = performance.now();

    function animateFocus() {
        let elapsed = performance.now() - startTime;
        let alpha = Math.min(elapsed / duration, 1);

        camera.position.copy(lerpVector3(startCamPos, endCamPos, alpha));
        controls.target.copy(lerpVector3(startTarget, endTarget, alpha));
        controls.update();

        if (alpha < 1) {
            requestAnimationFrame(animateFocus);
        }
    }
    animateFocus();
}
