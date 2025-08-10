import React, { useRef, useEffect, useState } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { addBuildingToScene } from "./Building";
import { addGreenery } from "./Greenery";
import { createGreenBorder } from "./GreenBorder";
import { smoothFocus } from "../utils/focusUtils";
import HDBInfoBox from "./HDBInfoBox";
import TotalYearCount from "./TotalYearCount";

export default function HDBScene() {
    const mountRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const buildingPositionsRef = useRef({});
    const [infoData, setInfoData] = useState(null);

    useEffect(() => {
        const mount = mountRef.current;
        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f4f8);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(30, 20, 40);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        mount.appendChild(renderer.domElement);

        // Lights
        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemi.position.set(0, 50, 0);
        scene.add(hemi);

        const dir = new THREE.DirectionalLight(0xffffff, 0.8);
        dir.position.set(10, 20, 10);
        dir.castShadow = true;
        scene.add(dir);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(200, 200);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0xe6eef6 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Border
        const borders = createGreenBorder({ size: 200, borderThickness: 1, borderHeight: 0.1, color: 0x00ff00 });
        borders.forEach(border => scene.add(border));

        // Buildings
        const pos1 = addBuildingToScene(scene, {
            position: new THREE.Vector3(0, 0, 0),
            floors: 12,
            floorHeight: 3,
            widthX: 16,
            depthZ: 12,
            color: 0x0099FF,
            roofColor: 0xcbdaf0
        });

        const pos2 = addBuildingToScene(scene, {
            position: new THREE.Vector3(40, 0, -10),
            floors: 8,
            floorHeight: 3,
            widthX: 12,
            depthZ: 10,
            color: 0xf0d9d9,
            roofColor: 0xd9c7c7
        });

        // Greenery
        addGreenery(scene, pos1, 16, 12);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, pos1.y, 0);
        controls.update();
        controlsRef.current = controls;

        buildingPositionsRef.current = {
            first: pos1,
            second: pos2,
            smoothFocus: (pos) => smoothFocus(pos, cameraRef.current, controlsRef.current)
        };

        // Resize
        const onResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        // Animate
        const clock = new THREE.Clock();
        const animate = () => {
            controls.update(clock.getDelta());
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", onResize);
            mount.removeChild(renderer.domElement);
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                    else obj.material.dispose();
                }
            });
        };
    }, []);

    const handleFocusBuilding1 = ({ yearCount, prevTotalOccupied, setPrevTotalOccupied }) => {
        const pos = buildingPositionsRef.current.first;
        buildingPositionsRef.current.smoothFocus(pos);

        const units = { 4: 80, 5: 40 };
        const occupied = {};
        Object.entries(units).forEach(([type, count]) => {
            occupied[type] = Math.floor(Math.random() * (count + 1));
        });

        const totalOccupied = Object.values(occupied).reduce((a, b) => a + b, 0);
        const prevTotal = prevTotalOccupied ?? totalOccupied;
        setPrevTotalOccupied(totalOccupied);

        setInfoData({
            address: "Blk 222, YY Street 11 S(123456)",
            totalUnits: Object.values(units).reduce((a, b) => a + b, 0),
            units,
            occupied,
            yearCount,
            occupiedDiff: totalOccupied - prevTotal,
            prevTotalOccupied: prevTotal
        });
    };

    const handleFocusBuilding2 = ({ yearCount, prevTotalOccupied, setPrevTotalOccupied }) => {
        const pos = buildingPositionsRef.current.second;
        buildingPositionsRef.current.smoothFocus(pos);

        const units = { 2: 20, 3: 30 };
        const occupied = {};
        Object.entries(units).forEach(([type, count]) => {
            occupied[type] = Math.floor(Math.random() * (count + 1));
        });

        const totalOccupied = Object.values(occupied).reduce((a, b) => a + b, 0);
        const prevTotal = prevTotalOccupied ?? totalOccupied;
        setPrevTotalOccupied(totalOccupied);

        setInfoData({
            address: "Blk 555, ZZ Avenue 3 S(654321)",
            totalUnits: Object.values(units).reduce((a, b) => a + b, 0),
            units,
            occupied,
            yearCount,
            occupiedDiff: totalOccupied - prevTotal,
            prevTotalOccupied: prevTotal
        });
    };

    return (
        <>
            <div style={{ marginBottom: 8 }}>
                <TotalYearCount label="Focus on Building 1" focusBuilding={handleFocusBuilding1} />
                <TotalYearCount label="Focus on Building 2" focusBuilding={handleFocusBuilding2} />
            </div>

            {infoData && (
                <HDBInfoBox
                    data={infoData}
                    onClose={() => setInfoData(null)}
                    yearCount={infoData?.yearCount ?? 0}
                />
            )}

            <div style={{ width: "100%", height: "480px" }} ref={mountRef}></div>
        </>
    );
}
