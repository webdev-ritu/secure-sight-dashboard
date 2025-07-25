'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';


interface Camera {
  id: number;
  name: string;
  location: string;
}

export default function CameraVisualization({ cameras = [] }: { cameras?: Camera[] }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      // Basic Three.js setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Simple lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Create a simple camera model
      const createCameraModel = () => {
        const group = new THREE.Group();
        
        // Camera body
        const geometry = new THREE.BoxGeometry(0.5, 0.3, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
        const cube = new THREE.Mesh(geometry, material);
        group.add(cube);
        
        // Camera lens
        const lensGeometry = new THREE.SphereGeometry(0.1);
        const lensMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.position.z = 0.3;
        group.add(lens);
        
        return group;
      };

      // Position cameras
      cameras.forEach((cam, index) => {
        const cameraModel = createCameraModel();
        
        // Simple positioning based on index
        cameraModel.position.x = (index % 3) * 2 - 2;
        cameraModel.position.z = Math.floor(index / 3) * 2 - 2;
        
        scene.add(cameraModel);
      });

      // Basic animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        mountRef.current?.removeChild(renderer.domElement);
      };

    } catch (error) {
      console.error('Error initializing 3D visualization:', error);
    }
  }, [cameras]);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
}