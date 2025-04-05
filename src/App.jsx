import { useState } from 'react'
import './App.css'

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
            This project will allow you to explore Fourier transforms through interactive
            visualizations and audio representations.
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
                This project will use:
              </p>
              <ul>
                <li><strong>math.js</strong> - For mathematical calculations</li>
                <li><strong>Three.js</strong> - For 3D visualizations</li>
                <li><strong>Tone.js</strong> - For audio synthesis</li>
              </ul>
            </div>
          )}
        </section>

        <section className="features-section">
          <h2>Coming Soon</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Visual Representation</h3>
              <p>Interactive 3D visualization of Fourier transforms</p>
            </div>
            <div className="feature-card">
              <h3>Audio Representation</h3>
              <p>Hear the components of a signal</p>
            </div>
            <div className="feature-card">
              <h3>Interactive Controls</h3>
              <p>Adjust parameters and see real-time changes</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          This is a template for a Fourier Transform visualization project.
          Libraries: React, math.js, Three.js, and Tone.js
        </p>
      </footer>
    </div>
  )
}

export default App
