import './App.css'
import FourierContainer from './components/FourierContainer'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Andre's Fourier Fun Land</h1>
        <p className="app-description">
          An interactive tool to visualize and hear Fourier transforms
        </p>
      </header>

      <main className="app-main">
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
