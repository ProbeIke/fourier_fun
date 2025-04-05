import { useState, useEffect } from 'react';
import { generateCompositeWave, calculateFourierTransform } from '../utils/waveUtils';

/**
 * Component for controlling wave parameters and generating wave data
 * @param {Object} props - Component props
 * @param {Function} props.onWaveDataChange - Callback when wave data changes
 * @param {Function} props.onFourierDataChange - Callback when Fourier data changes
 * @param {Function} props.onFrequenciesChange - Callback when frequencies change
 * @param {Function} props.onAmplitudesChange - Callback when amplitudes change
 * @param {Function} props.onPhasesChange - Callback when phases change
 * @param {Array<number>} props.initialFrequencies - Initial frequencies
 * @param {Array<number>} props.initialAmplitudes - Initial amplitudes
 * @param {Array<number>} props.initialPhases - Initial phases
 */
function WaveController({ 
  onWaveDataChange, 
  onFourierDataChange,
  onFrequenciesChange,
  onAmplitudesChange,
  onPhasesChange,
  initialFrequencies = [2, 5, 8],
  initialAmplitudes = [0.5, 0.3, 0.2],
  initialPhases = [0, Math.PI / 4, Math.PI / 2]
}) {
  // Wave parameters
  const [frequencies, setFrequencies] = useState(initialFrequencies);
  const [amplitudes, setAmplitudes] = useState(initialAmplitudes);
  const [phases, setPhases] = useState(initialPhases);
  const [sampleCount, setSampleCount] = useState(1024);
  
  // Update wave data when parameters change
  useEffect(() => {
    // Generate wave data
    const waveData = generateCompositeWave(
      sampleCount,
      frequencies,
      amplitudes,
      phases
    );
    
    // Calculate Fourier transform
    const fourierData = calculateFourierTransform(waveData);
    
    // Call callbacks with new data
    if (onWaveDataChange) {
      onWaveDataChange(waveData);
    }
    
    if (onFourierDataChange) {
      onFourierDataChange(fourierData);
    }
  }, [frequencies, amplitudes, phases, sampleCount, onWaveDataChange, onFourierDataChange]);
  
  // Update a frequency at a specific index
  const updateFrequency = (index, value) => {
    const newFrequencies = [...frequencies];
    newFrequencies[index] = parseFloat(value);
    setFrequencies(newFrequencies);
    if (onFrequenciesChange) {
      onFrequenciesChange(newFrequencies);
    }
  };
  
  // Update an amplitude at a specific index
  const updateAmplitude = (index, value) => {
    const newAmplitudes = [...amplitudes];
    newAmplitudes[index] = parseFloat(value);
    setAmplitudes(newAmplitudes);
    if (onAmplitudesChange) {
      onAmplitudesChange(newAmplitudes);
    }
  };
  
  // Update a phase at a specific index
  const updatePhase = (index, value) => {
    const newPhases = [...phases];
    newPhases[index] = parseFloat(value);
    setPhases(newPhases);
    if (onPhasesChange) {
      onPhasesChange(newPhases);
    }
  };
  
  return (
    <div className="wave-controller">
      <h3>Wave Parameters</h3>
      
      <div className="controller-section">
        <label htmlFor="sample-count">Sample Count:</label>
        <input
          id="sample-count"
          type="range"
          min="128"
          max="2048"
          step="128"
          value={sampleCount}
          onChange={(e) => setSampleCount(parseInt(e.target.value))}
        />
        <span>{sampleCount}</span>
      </div>
      
      <div className="wave-components">
        {frequencies.map((freq, index) => (
          <div key={index} className="wave-component">
            <h4>Wave Component {index + 1}</h4>
            
            <div className="parameter">
              <label htmlFor={`frequency-${index}`}>Frequency:</label>
              <input
                id={`frequency-${index}`}
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={freq}
                onChange={(e) => updateFrequency(index, e.target.value)}
              />
              <span>{freq} Hz</span>
            </div>
            
            <div className="parameter">
              <label htmlFor={`amplitude-${index}`}>Amplitude:</label>
              <input
                id={`amplitude-${index}`}
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={amplitudes[index]}
                onChange={(e) => updateAmplitude(index, e.target.value)}
              />
              <span>{amplitudes[index].toFixed(2)}</span>
            </div>
            
            <div className="parameter">
              <label htmlFor={`phase-${index}`}>Phase:</label>
              <input
                id={`phase-${index}`}
                type="range"
                min="0"
                max={2 * Math.PI}
                step={Math.PI / 12}
                value={phases[index]}
                onChange={(e) => updatePhase(index, e.target.value)}
              />
              <span>{(phases[index] / Math.PI).toFixed(2)}π</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WaveController;
