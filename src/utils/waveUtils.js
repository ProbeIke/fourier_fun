import * as math from 'mathjs';

/**
 * Generates a composite wave with three frequencies
 * @param {number} sampleCount - Number of samples to generate
 * @param {Array<number>} frequencies - Array of frequencies in Hz
 * @param {Array<number>} amplitudes - Array of amplitudes for each frequency
 * @param {Array<number>} phases - Array of phase shifts for each frequency (in radians)
 * @returns {Array<number>} - Array of wave amplitude values
 */
export function generateCompositeWave(
  sampleCount = 1024,
  frequencies = [2, 5, 8],
  amplitudes = [0.5, 0.3, 0.2],
  phases = [0, Math.PI / 4, Math.PI / 2]
) {
  // Ensure all arrays have the same length
  const componentCount = Math.min(
    frequencies.length,
    amplitudes.length,
    phases.length
  );
  
  // Generate time domain samples
  const samples = new Array(sampleCount).fill(0);
  const timeStep = 1 / sampleCount;
  
  // Generate each sample as a sum of sine waves
  for (let i = 0; i < sampleCount; i++) {
    const t = i * timeStep;
    for (let j = 0; j < componentCount; j++) {
      samples[i] += amplitudes[j] * Math.sin(2 * Math.PI * frequencies[j] * t + phases[j]);
    }
  }
  
  return samples;
}

/**
 * Calculates the Fourier transform of a signal
 * @param {Array<number>} signal - Input signal (time domain)
 * @returns {Array<{frequency: number, magnitude: number, phase: number}>} - Frequency domain representation
 */
export function calculateFourierTransform(signal) {
  // Use mathjs to calculate the FFT
  const fft = math.fft(signal);
  
  // Extract magnitude and phase from complex numbers
  const result = fft.slice(0, fft.length / 2).map((complex, index) => {
    const magnitude = Math.sqrt(complex.re * complex.re + complex.im * complex.im);
    const phase = Math.atan2(complex.im, complex.re);
    const frequency = index; // Normalized frequency
    
    return { frequency, magnitude, phase };
  });
  
  return result;
}

/**
 * Normalizes an array of values to a given range
 * @param {Array<number>} values - Array of values to normalize
 * @param {number} min - Minimum value of the target range
 * @param {number} max - Maximum value of the target range
 * @returns {Array<number>} - Normalized values
 */
export function normalizeValues(values, min = 0, max = 1) {
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal;
  
  if (range === 0) return values.map(() => (min + max) / 2);
  
  return values.map(val => min + ((val - minVal) / range) * (max - min));
}

/**
 * Creates 3D points for a wave visualization
 * @param {Array<number>} samples - Wave samples
 * @param {number} width - Width of the visualization
 * @param {number} height - Height of the visualization
 * @param {number} depth - Depth of the visualization (for 3D effect)
 * @returns {Array<{x: number, y: number, z: number}>} - Array of 3D points
 */
export function createWavePoints(samples, width = 10, height = 2, depth = 3) {
  const normalizedSamples = normalizeValues(samples, -height / 2, height / 2);
  const points = [];
  
  const segmentWidth = width / (samples.length - 1);
  
  for (let i = 0; i < samples.length; i++) {
    const x = -width / 2 + i * segmentWidth;
    const y = normalizedSamples[i];
    const z = 0;
    
    points.push({ x, y, z });
  }
  
  return points;
}

/**
 * Generates a single component wave
 * @param {number} sampleCount - Number of samples to generate
 * @param {number} frequency - Frequency in Hz
 * @param {number} amplitude - Amplitude of the wave
 * @param {number} phase - Phase shift in radians
 * @returns {Array<number>} - Array of wave amplitude values
 */
export function generateComponentWave(
  sampleCount = 1024,
  frequency = 2,
  amplitude = 0.5,
  phase = 0
) {
  const samples = new Array(sampleCount).fill(0);
  const timeStep = 1 / sampleCount;
  
  for (let i = 0; i < sampleCount; i++) {
    const t = i * timeStep;
    samples[i] = amplitude * Math.sin(2 * Math.PI * frequency * t + phase);
  }
  
  return samples;
}

/**
 * Creates 3D points for component waves visualization
 * @param {number} sampleCount - Number of samples to generate
 * @param {Array<number>} frequencies - Array of frequencies in Hz
 * @param {Array<number>} amplitudes - Array of amplitudes for each frequency
 * @param {Array<number>} phases - Array of phase shifts for each frequency (in radians)
 * @param {number} width - Width of the visualization
 * @param {number} height - Height of the visualization
 * @param {number} depth - Depth of the visualization (for 3D effect)
 * @returns {Array<Array<{x: number, y: number, z: number}>>} - Array of arrays of 3D points, one array per component
 */
export function createComponentWavePoints(
  sampleCount = 1024,
  frequencies = [2, 5, 8],
  amplitudes = [0.5, 0.3, 0.2],
  phases = [0, Math.PI / 4, Math.PI / 2],
  width = 10,
  height = 2,
  depth = 3
) {
  // Ensure all arrays have the same length
  const componentCount = Math.min(
    frequencies.length,
    amplitudes.length,
    phases.length
  );
  
  const componentWaves = [];
  
  // Generate each component wave
  for (let j = 0; j < componentCount; j++) {
    const componentSamples = generateComponentWave(
      sampleCount,
      frequencies[j],
      amplitudes[j],
      phases[j]
    );
    
    // Create points for this component
    const normalizedSamples = normalizeValues(componentSamples, -height / 2, height / 2);
    const points = [];
    
    const segmentWidth = width / (sampleCount - 1);
    
    // Calculate z-offset for this component
    // Space components evenly along z-axis
    const zOffset = -depth / 2 + (j + 1) * (depth / (componentCount + 1));
    
    for (let i = 0; i < sampleCount; i++) {
      const x = -width / 2 + i * segmentWidth;
      const y = normalizedSamples[i];
      const z = zOffset;
      
      points.push({ x, y, z });
    }
    
    componentWaves.push(points);
  }
  
  return componentWaves;
}

/**
 * Creates 3D points for a Fourier transform visualization
 * @param {Array<{frequency: number, magnitude: number, phase: number}>} fourierData - Fourier transform data
 * @param {number} width - Width of the visualization
 * @param {number} height - Height of the visualization
 * @param {number} depth - Depth of the visualization
 * @returns {Array<{x: number, y: number, z: number}>} - Array of 3D points for bars
 */
export function createFourierBars(fourierData, width = 10, height = 2, depth = 3) {
  // Extract magnitudes and normalize them
  const magnitudes = fourierData.map(item => item.magnitude);
  const normalizedMagnitudes = normalizeValues(magnitudes, 0, height);
  
  const bars = [];
  const barWidth = width / fourierData.length;
  const halfBarWidth = barWidth * 0.8 / 2; // 80% of the available space for each bar
  
  for (let i = 0; i < fourierData.length; i++) {
    const centerX = -width / 2 + (i + 0.5) * barWidth;
    const barHeight = normalizedMagnitudes[i];
    
    // Create the 8 vertices of a 3D bar
    const y0 = 0;
    const y1 = barHeight;
    
    // Bottom face vertices
    bars.push(
      { x: centerX - halfBarWidth, y: y0, z: -halfBarWidth },
      { x: centerX + halfBarWidth, y: y0, z: -halfBarWidth },
      { x: centerX + halfBarWidth, y: y0, z: halfBarWidth },
      { x: centerX - halfBarWidth, y: y0, z: halfBarWidth }
    );
    
    // Top face vertices
    bars.push(
      { x: centerX - halfBarWidth, y: y1, z: -halfBarWidth },
      { x: centerX + halfBarWidth, y: y1, z: -halfBarWidth },
      { x: centerX + halfBarWidth, y: y1, z: halfBarWidth },
      { x: centerX - halfBarWidth, y: y1, z: halfBarWidth }
    );
  }
  
  return bars;
}
