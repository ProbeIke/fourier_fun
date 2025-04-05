import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createWavePoints, createComponentWavePoints } from '../utils/waveUtils';

/**
 * Component for 3D visualization of a sound wave
 * @param {Object} props - Component props
 * @param {Array<number>} props.waveData - Array of wave amplitude values
 * @param {Object} props.dimensions - Dimensions for the visualization
 * @param {string} props.color - Color of the wave line
 * @param {Array<number>} props.frequencies - Array of frequencies for component waves
 * @param {Array<number>} props.amplitudes - Array of amplitudes for component waves
 * @param {Array<number>} props.phases - Array of phases for component waves
 */
function WaveVisualizer({ 
  waveData = [], 
  dimensions = { width: 10, height: 2, depth: 3 },
  color = '#61dafb',
  frequencies = [2, 5, 8],
  amplitudes = [0.5, 0.3, 0.2],
  phases = [0, Math.PI / 4, Math.PI / 2]
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const waveRef = useRef(null);
  const componentWavesRef = useRef([]);

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
    // Position camera to view waves from the side
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

    // Animation variables
    let time = 0;
    const speed = 0.01;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Update time for wave translation
      time += speed;
      
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

  // Store original wave data for animation
  const originalWaveDataRef = useRef([]);
  
  // Animation variables
  const timeRef = useRef(0);
  const speedRef = useRef(0.05);
  
  // Store component wave data for animation
  const componentWaveDataRef = useRef([]);
  
  // Update the animation loop when waveData changes
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || waveData.length === 0) return;
    
    // Store the original wave data for animation
    originalWaveDataRef.current = [...waveData];
    
    // Animation function for wave translation
    const animateWaves = () => {
      // Update time
      timeRef.current += speedRef.current;
      
      // Animate main wave
      if (waveRef.current && waveRef.current.geometry) {
        const positions = waveRef.current.geometry.attributes.position.array;
        const count = positions.length / 3;
        
        for (let i = 0; i < count; i++) {
          const x = positions[i * 3]; // x position
          const originalY = originalWaveDataRef.current[i % originalWaveDataRef.current.length];
          
          // Calculate y position based on time and x position
          // This creates a wave that moves along the x-axis
          // Use a combination of frequencies for a more natural motion
          const t = timeRef.current * 2; // Speed factor
          const wavePos = Math.sin(2 * Math.PI * (x / dimensions.width + t));
          
          // Apply the translation effect to the original wave data
          positions[i * 3 + 1] = originalY * wavePos;
        }
        
        waveRef.current.geometry.attributes.position.needsUpdate = true;
      }
      
      // Animate component waves
      componentWavesRef.current.forEach((wave, waveIndex) => {
        if (wave && wave.geometry) {
          const positions = wave.geometry.attributes.position.array;
          const count = positions.length / 3;
          
          // Get the frequency for this component wave
          const freq = frequencies[waveIndex] || 1;
          const phase = phases[waveIndex] || 0;
          
          for (let i = 0; i < count; i++) {
            const x = positions[i * 3]; // x position
            
            // Calculate the wave position based on time, frequency, and phase
            // This creates a wave that translates along the x-axis at the wave frequency
            const t = timeRef.current * freq * 0.5;
            const wavePos = Math.sin(2 * Math.PI * freq * (x / dimensions.width + t) + phase);
            
            // Update y position
            positions[i * 3 + 1] = wavePos * (amplitudes[waveIndex] || 0.5);
          }
          
          wave.geometry.attributes.position.needsUpdate = true;
        }
      });
    };
    
    // Add the animation function to the render loop
    const originalRender = rendererRef.current.render;
    rendererRef.current.render = function() {
      animateWaves();
      originalRender.apply(this, arguments);
    };
    
    return () => {
      // Restore original render function on cleanup
      if (rendererRef.current) {
        rendererRef.current.render = originalRender;
      }
    };
  }, [waveData, frequencies, amplitudes, phases, dimensions.width]);
  
  // Update the wave visualization when waveData changes
  useEffect(() => {
    if (!sceneRef.current || waveData.length === 0) return;

    // Remove previous wave if it exists
    if (waveRef.current) {
      sceneRef.current.remove(waveRef.current);
      if (waveRef.current.geometry) waveRef.current.geometry.dispose();
      if (waveRef.current.material) waveRef.current.material.dispose();
    }

    // Remove previous component waves if they exist
    componentWavesRef.current.forEach(wave => {
      if (wave) {
        sceneRef.current.remove(wave);
        if (wave.geometry) wave.geometry.dispose();
        if (wave.material) wave.material.dispose();
      }
    });
    componentWavesRef.current = [];

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
    
    // Create component waves
    const componentWavePoints = createComponentWavePoints(
      waveData.length,
      frequencies,
      amplitudes,
      phases,
      dimensions.width,
      dimensions.height,
      dimensions.depth
    );
    
    // Create component wave colors (different shades of the main color)
    const componentColors = [
      '#ff6b6b', // Red
      '#48dbfb', // Blue
      '#1dd1a1', // Green
      '#feca57', // Yellow
      '#5f27cd'  // Purple
    ];
    
    // Create and add component waves to the scene
    componentWavePoints.forEach((componentPoints, index) => {
      // Create component wave geometry
      const componentGeometry = new THREE.BufferGeometry();
      
      // Create positions array for the component line
      const componentPositions = new Float32Array(componentPoints.length * 3);
      
      componentPoints.forEach((point, i) => {
        componentPositions[i * 3] = point.x;
        componentPositions[i * 3 + 1] = point.y;
        componentPositions[i * 3 + 2] = point.z;
      });
      
      componentGeometry.setAttribute('position', new THREE.BufferAttribute(componentPositions, 3));
      
      // Create component wave material with a different color
      const componentColor = componentColors[index % componentColors.length];
      const componentMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(componentColor),
        linewidth: 2
      });
      
      // Create component wave line
      const componentLine = new THREE.Line(componentGeometry, componentMaterial);
      
      // Add component wave to scene
      sceneRef.current.add(componentLine);
      componentWavesRef.current.push(componentLine);
    });
    
  }, [waveData, dimensions, color, frequencies, amplitudes, phases]);

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
