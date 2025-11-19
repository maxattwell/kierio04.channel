# 3D Rotating K Landing Page

A React landing page featuring an interactive 3D letter "K" that rotates slowly on the x-axis. Users can click and drag to spin the letter with inertia, and it will reset to its original rotation when it settles.

## Features

- **3D Text Rendering**: Uses Three.js and React Three Fiber for high-performance 3D graphics
- **Interactive Dragging**: Click and drag to spin the letter K with realistic physics
- **Inertia Effect**: The letter continues spinning after release with smooth damping
- **Auto-Reset**: Returns to original x-axis rotation when motion settles
- **Continuous Y-Axis Rotation**: Slowly rotates on the y-axis for visual interest
- **Responsive**: Works on desktop and mobile devices
- **Static Deployment**: Optimized for GitHub Pages deployment

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components for R3F (Text3D, Center)

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages via GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to Pages (under "Code and automation")
   - Under "Source", select "GitHub Actions"

2. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Automatic Deployment**:
   - The workflow will automatically build and deploy on every push to `main`
   - You can also manually trigger deployment from the Actions tab

4. **Access Your Site**:
   - Your site will be available at: `https://kierio04.com`
   - Check the Actions tab to monitor deployment progress

### Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to gh-pages branch (requires gh-pages package)
npm install -D gh-pages
npx gh-pages -d dist
```

## Project Structure

```
kierio04.com/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow
├── public/
│   └── fonts/
│       └── helvetiker_bold.typeface.json  # 3D font file
├── src/
│   ├── App.jsx              # Main app with 3D scene
│   ├── App.css              # Styling
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## Customization

### Change the Letter

In `src/App.jsx`, modify the Text3D component:

```jsx
<Text3D ...>
  K  {/* Change this to any letter or text */}
  ...
</Text3D>
```

### Adjust Rotation Speed

Modify the constants in the `RotatingK` component:

```jsx
const AUTO_ROTATION_SPEED = 0.3  // Y-axis rotation speed
const DAMPING = 0.95             // Inertia damping (higher = longer spin)
const RESET_SPEED = 0.05         // X-axis reset speed
```

### Change Colors

Update the material color and background:

```jsx
// 3D text color
<meshStandardMaterial
  color="#4a90e2"  // Change this
  metalness={0.6}
  roughness={0.2}
/>

// Background gradient (in App.css)
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## License

MIT
