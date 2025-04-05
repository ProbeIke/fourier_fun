# Fourier Transform Visualizer

An interactive web application to visualize and hear Fourier transforms using React, math.js, Three.js, and Tone.js.

## Project Overview

This project aims to create an interactive tool that helps users understand Fourier transforms through both visual and audio representations. The Fourier transform is a mathematical technique that decomposes a function into its constituent frequencies, which has applications in signal processing, audio analysis, image processing, and many other fields.

## Features (Planned)

- **Visual Representation**: Interactive 3D visualization of Fourier transforms using Three.js
- **Audio Representation**: Hear the components of a signal using Tone.js
- **Mathematical Exploration**: Explore the mathematics behind Fourier transforms with math.js
- **Interactive Controls**: Adjust parameters and see/hear real-time changes

## Technologies Used

- **React**: Frontend framework
- **math.js**: Mathematical operations and Fourier transform calculations
- **Three.js**: 3D visualization
- **Tone.js**: Audio synthesis and processing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/fourier-fun.git
   cd fourier-fun
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
fourier_fun/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Current Status

This is currently a basic template/infrastructure setup. The full implementation of the Fourier transform visualization and audio features will be developed in future iterations.

## License

MIT

## Acknowledgments

- The Fourier transform, named after Jean-Baptiste Joseph Fourier
- The developers of React, math.js, Three.js, and Tone.js for their amazing libraries
