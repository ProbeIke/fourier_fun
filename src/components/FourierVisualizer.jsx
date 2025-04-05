import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createFourierBars } from '../utils/waveUtils';

/**
 * Component for 3D visualization of a Fourier transform
 * @param {Object} props - Component props
 * @param {Array<{frequency: number, magnitude: number, phase: number}>} props.fourierData - Fourier transform data
 * @param {Object} props.dimensions - Dimensions for the visualization
 * @param {string} props.color - Color of the bars
 */
function FourierVisualizer({ 
  fourierData = [], 
  dimensions = { width: 10, height: 2, depth: 3 },
  color = '#ffffff'
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const barsRef = useRef(null);

  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    // Position camera to view bars from the front
    camera.position.set(0, 4, 7);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x555555, 0x333333);
    scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (sceneRef.current) {
        // Dispose of all geometries and materials
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // Store original Fourier data for animation
  const originalFourierDataRef = useRef([]);
  
  // Animation variables
  const timeRef = useRef(0);
  const speedRef = useRef(0.05);
  
  // Update the animation loop when fourierData changes
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || fourierData.length === 0) return;
    
    // Store the original Fourier data for animation
    originalFourierDataRef.current = [...fourierData];
    
    // Animation function for bar translation
    const animateBars = () => {
      if (!barsRef.current) return;
      
      // Update time
      timeRef.current += speedRef.current;
      
      // Animate each bar based on its frequency
      barsRef.current.children.forEach((bar, index) => {
        if (index < originalFourierDataRef.current.length) {
          const frequency = originalFourierDataRef.current[index].frequency;
          const magnitude = originalFourierDataRef.current[index].magnitude;
          const phase = originalFourierDataRef.current[index].phase;
          
          // Calculate vertical translation based on frequency and time
          // This creates a wave-like motion for each bar
          const translateY = Math.sin(frequency * 0.2 + timeRef.current * frequency * 0.5 + phase) * 0.2;
          
          // Apply translation
          bar.position.y = bar.userData.originalY + translateY;
        }
      });
    };
    
    // Add the animation function to the render loop
    const originalRender = rendererRef.current.render;
    rendererRef.current.render = function() {
      animateBars();
      originalRender.apply(this, arguments);
    };
    
    return () => {
      // Restore original render function on cleanup
      if (rendererRef.current) {
        rendererRef.current.render = originalRender;
      }
    };
  }, [fourierData]);
  
  // Update the Fourier visualization when fourierData changes
  useEffect(() => {
    if (!sceneRef.current || fourierData.length === 0) return;

    // Remove previous bars if they exist
    if (barsRef.current) {
      sceneRef.current.remove(barsRef.current);
      barsRef.current.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }

    // Create a group for all bars
    const barsGroup = new THREE.Group();
    
    // Create bar points
    const barPoints = createFourierBars(fourierData, dimensions.width, dimensions.height, dimensions.depth);
    
    // Calculate how many points per bar (8 vertices per bar)
    const pointsPerBar = 8;
    
    // Create bars
    for (let i = 0; i < barPoints.length / pointsPerBar; i++) {
      const barGeometry = new THREE.BoxGeometry(
        barPoints[i * pointsPerBar + 1].x - barPoints[i * pointsPerBar].x,
        barPoints[i * pointsPerBar + 4].y - barPoints[i * pointsPerBar].y,
        barPoints[i * pointsPerBar + 2].z - barPoints[i * pointsPerBar + 1].z
      );
      
      // Create material with slight transparency
      const barMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.8,
        specular: 0x444444,
        shininess: 30
      });
      
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      
      // Position the bar at its center
      const centerX = (barPoints[i * pointsPerBar].x + barPoints[i * pointsPerBar + 1].x) / 2;
      const centerY = (barPoints[i * pointsPerBar].y + barPoints[i * pointsPerBar + 4].y) / 2;
      const centerZ = (barPoints[i * pointsPerBar].z + barPoints[i * pointsPerBar + 2].z) / 2;
      
      bar.position.set(centerX, centerY, centerZ);
      
      // Store original Y position for animation
      bar.userData = { originalY: centerY };
      
      barsGroup.add(bar);
    }
    
    // Add bars to scene
    sceneRef.current.add(barsGroup);
    barsRef.current = barsGroup;
    
  }, [fourierData, dimensions, color]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
}

export default FourierVisualizer;
