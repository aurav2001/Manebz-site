import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeHeroCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for mouse interaction
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Central Core: Wireframe Icosahedron
    const coreGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00F2FE,
      wireframe: true,
      emissive: 0x005577,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // Inner Solid Glowing Core
    const innerGeometry = new THREE.OctahedronGeometry(1.0, 2);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      emissive: 0x00F2FE,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    mainGroup.add(innerMesh);

    // Orbit Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    // Orbit Ring 2
    const ring2Geo = new THREE.TorusGeometry(3.1, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // Floating Neural Particles
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyan = new THREE.Color(0x00F2FE);
    const emerald = new THREE.Color(0x10B981);
    const purple = new THREE.Color(0x8B5CF6);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.6 ? cyan : (Math.random() > 0.5 ? emerald : purple);
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00F2FE, 3, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10B981, 2, 50);
    pointLight2.position.set(-5, -5, -3);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      const rect = currentMount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      targetX = (x - 0.5) * 1.5;
      targetY = (y - 0.5) * 1.5;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainGroup.rotation.y = elapsedTime * 0.25 + mouseX;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + mouseY;

      coreMesh.rotation.x = elapsedTime * 0.3;
      coreMesh.rotation.z = elapsedTime * 0.2;

      innerMesh.rotation.y = -elapsedTime * 0.5;
      innerMesh.rotation.z = -elapsedTime * 0.4;

      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.x = -elapsedTime * 0.3;

      particles.rotation.y = -elapsedTime * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[450px] sm:h-[550px] lg:h-[620px] relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center"
      title="Interactive 3D Quantum Infrastructure Core — Hover or Move cursor to rotate"
    />
  );
};

export default ThreeHeroCanvas;
