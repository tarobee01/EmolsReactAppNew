import { useEffect } from "react";
import * as THREE from 'three';
import centerImage from '/three.png';

const Object = () => {
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 2.0;

    const scene = new THREE.Scene();

    const createColoredSphere = (position, color, opacity = 1, renderOrder = 0) => {
      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.renderOrder = renderOrder;
      scene.add(mesh);

      return mesh;
    };

    const offsetSphere1 = createColoredSphere([0.5, 1.5, 0.5], 0xffffff, 0.5, 1);
    const offsetSphere2 = createColoredSphere([-0.5, 1.5, -0.5], 0xffffff, 0.5, 1);

    const radius = 0.6;

    const animation = (time) => {
      offsetSphere1.position.x = Math.cos(time / 1000 + Math.PI / 3) * radius;
      offsetSphere1.position.z = Math.sin(time / 1000 + Math.PI / 3) * radius;

      offsetSphere2.position.x = Math.cos(time / 1000 + Math.PI / 3 * 4) * radius;
      offsetSphere2.position.z = Math.sin(time / 1000 + Math.PI / 3 * 4) * radius;

      offsetSphere1.position.y = Math.sin(time / 1000 + Math.PI / 3) * 0.15;
      offsetSphere2.position.y = Math.sin(time / 1000 + Math.PI / 3 * 4) * 0.15;

      renderer.render(scene, camera);
    };

    const textureLoader = new THREE.TextureLoader();
    const centerTexture = textureLoader.load(centerImage);
    const centerGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const centerMaterial = new THREE.MeshBasicMaterial({ map: centerTexture, transparent: true });
    const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    scene.add(centerMesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
    renderer.setClearColor(0xffffff, 0);
    document.body.appendChild(renderer.domElement);

    return () => {
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default Object;
