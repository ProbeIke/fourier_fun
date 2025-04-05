import { useState } from 'react'
import './App.css'
import FourierContainer from './components/FourierContainer'

function App() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Fourier Transform Visualizer</h1>
        <p className="app-description">
          An interactive tool to visualize and hear Fourier transforms
        </p>
      </header>

      <main className="app-main">
        <section className="intro-section">
          <h2>Welcome to Fourier Fun</h2>
          <p>
            This project allows you to explore Fourier transforms through interactive
            visualizations. Adjust the parameters below to see how different frequencies
            combine to form complex waveforms and their frequency domain representations.
          </p>
          <button 
            className="info-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? 'Hide Info' : 'Learn More'}
          </button>
          
          {showInfo && (
            <div className="info-panel">
              <h3>What are Fourier Transforms?</h3>
              <p>
                Fourier transforms decompose a signal into the frequencies that make it up.
                This mathematical technique has applications in:
              </p>
              <ul>
                <li>Signal processing</li>
                <li>Audio analysis and synthesis</li>
                <li>Image processing</li>
                <li>Quantum physics</li>
                <li>And many other fields</li>
              </ul>
              <p>
                This project uses:
              </p>
              <ul>
                <li><strong>math.js</strong> - For mathematical calculations including FFT</li>
                <li><strong>Three.js</strong> - For 3D visualizations</li>
                <li><strong>React</strong> - For the user interface</li>
              </ul>
            </div>
          )}
        </section>

        <section className="visualization-section">
          <h2>3D Visualization</h2>
          <p>
            Interact with the 3D visualizations by dragging to rotate, scrolling to zoom,
            and adjusting the wave parameters below.
          </p>
          <FourierContainer />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Fourier Transform Visualization Project
          Built with React, math.js, and Three.js
        </p>
      </footer>
    </div>
  )
}

export default App
