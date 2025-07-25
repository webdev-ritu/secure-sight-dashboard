'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from './3d-camera-visualization.module.css';

interface Camera {
  id: number;
  name: string;
  location: string;
}

export default function CameraVisualization({ cameras }: { cameras: Camera[] }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.Fog(0x0f172a, 5, 15);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 6, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Create room
    const createRoom = () => {
      const room = new THREE.Group();

      // Floor
      const floorGeometry = new THREE.PlaneGeometry(20, 20);
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1e293b,
        roughness: 0.8,
        metalness: 0.2
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      room.add(floor);

      // Walls
      const wallGeometry = new THREE.PlaneGeometry(20, 8);
      const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x334155,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });

      const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
      leftWall.position.set(-10, 4, 0);
      leftWall.rotation.y = Math.PI / 2;
      leftWall.receiveShadow = true;
      room.add(leftWall);

      const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
      rightWall.position.set(10, 4, 0);
      rightWall.rotation.y = Math.PI / 2;
      rightWall.receiveShadow = true;
      room.add(rightWall);

      const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
      backWall.position.set(0, 4, -10);
      backWall.receiveShadow = true;
      room.add(backWall);

      return room;
    };

    const room = createRoom();
    scene.add(room);

    // Create security cameras
    const createCameraModel = (color: number) => {
      const group = new THREE.Group();

      // Camera base
      const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
      const baseMaterial = new THREE.MeshStandardMaterial({ color });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 0.1;
      base.castShadow = true;
      group.add(base);

      // Camera body
      const bodyGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.8);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.7,
        roughness: 0.3
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      body.castShadow = true;
      group.add(body);

      // Camera lens
      const lensGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const lensMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5
      });
      const lens = new THREE.Mesh(lensGeometry, lensMaterial);
      lens.position.set(0, 0.5, 0.5);
      group.add(lens);

      return group;
    };

    // Position cameras based on their location
    cameras.forEach(camera => {
      const color = 
        camera.location === 'Entrance' ? 0xef4444 :
        camera.location === 'Vault' ? 0x8b5cf6 :
        0x3b82f6;

      const cameraModel = createCameraModel(color);
      
      // Position cameras
      switch(camera.location) {
        case 'Entrance':
          cameraModel.position.set(-6, 3, 8);
          cameraModel.rotation.y = Math.PI;
          break;
        case 'Vault':
          cameraModel.position.set(0, 4, -8);
          cameraModel.rotation.y = 0;
          break;
        case 'Shop Floor':
          cameraModel.position.set(6, 3, 5);
          cameraModel.rotation.y = -Math.PI / 2;
          break;
        default:
          cameraModel.position.set(0, 3, 0);
      }

      // Add camera label
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const context = canvas.getContext('2d')!;
      context.fillStyle = 'rgba(15, 23, 42, 0.8)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = 'Bold 20px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(camera.name, canvas.width/2, 40);
      context.font = '14px Arial';
      context.fillText(camera.location, canvas.width/2, 70);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(cameraModel.position);
      sprite.position.y += 1.5;
      sprite.scale.set(3, 1.5, 1);
      scene.add(sprite);

      scene.add(cameraModel);
    });

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [cameras]);

  return <div ref={mountRef} className={styles.visualizationContainer} />;
}