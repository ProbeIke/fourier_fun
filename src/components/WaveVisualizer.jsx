import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createWavePoints } from '../utils/waveUtils';

/**
 * Component for 3D visualization of a sound wave
 * @param {Object} props - Component props
 * @param {Array<number>} props.waveData - Array of wave amplitude values
 * @param {Object} props.dimensions - Dimensions for the visualization
 * @param {string} props.color - Color of the wave line
 */
function WaveVisualizer({ 
  waveData = [], 
  dimensions = { width: 10, height: 2, depth: 3 },
  color = '#61dafb'
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const waveRef = useRef(null);

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
    camera.position.set(0, 2, 5);
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
      
      if (waveRef.current) {
        waveRef.current.rotation.y += 0.002;
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

  // Update the wave visualization when waveData changes
  useEffect(() => {
    if (!sceneRef.current || waveData.length === 0) return;

    // Remove previous wave if it exists
    if (waveRef.current) {
      sceneRef.current.remove(waveRef.current);
      if (waveRef.current.geometry) waveRef.current.geometry.dispose();
      if (waveRef.current.material) waveRef.current.material.dispose();
    }

    // Create wave points
    const points = createWavePoints(waveData, dimensions.width, dimensions.height, dimensions.depth);
    
    // Create wave geometry
    const waveGeometry = new THREE.BufferGeometry();
    
    // Create positions array for the line
    const positions = new Float32Array(points.length * 3);
    
    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });
    
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create wave material
    const waveMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      linewidth: 2
    });
    
    // Create wave line
    const waveLine = new THREE.Line(waveGeometry, waveMaterial);
    
    // Add wave to scene
    sceneRef.current.add(waveLine);
    waveRef.current = waveLine;
    
  }, [waveData, dimensions, color]);

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

export default WaveVisualizer;
