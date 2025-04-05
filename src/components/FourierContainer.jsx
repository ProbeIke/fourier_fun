import { useState } from 'react';
import WaveController from './WaveController';
import WaveVisualizer from './WaveVisualizer';
import FourierVisualizer from './FourierVisualizer';

/**
 * Container component that combines wave controller and visualizers
 */
function FourierContainer() {
  const [waveData, setWaveData] = useState([]);
  const [fourierData, setFourierData] = useState([]);
  
  return (
    <div className="fourier-container">
      <div className="visualizers">
        <div className="visualizer-card">
          <h3>Sound Wave Visualization</h3>
          <WaveVisualizer 
            waveData={waveData} 
            dimensions={{ width: 10, height: 2, depth: 3 }}
            color="#61dafb"
          />
        </div>
        
        <div className="visualizer-card">
          <h3>Fourier Transform Visualization</h3>
          <FourierVisualizer 
            fourierData={fourierData} 
            dimensions={{ width: 10, height: 2, depth: 3 }}
            color="#8e44ad"
          />
        </div>
      </div>
      
      <div className="controller-card">
        <WaveController 
          onWaveDataChange={setWaveData}
          onFourierDataChange={setFourierData}
        />
      </div>
    </div>
  );
}

export default FourierContainer;
