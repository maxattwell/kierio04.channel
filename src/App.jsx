import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Text3D, Center, useFont } from '@react-three/drei'
import { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import './App.css'
import Footer from './Footer'
import Banner from './Banner'

function CoinWithCutout() {
    const font = useFont('/fonts/manrope_extrabold.typeface.json')

  
  const geometry = useMemo(() => {
    if (!font) return null
    
    // Create cylinder (coin) - oriented along Z axis by default
    const cylinderGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.4, 64)
    
    // Create K text geometry
    const textGeometry = new TextGeometry('K', {
      font: font,
      size: 2.5,
      height: 1.0, // Make it thick enough to go through the coin
      curveSegments: 9,
      bevelEnabled: true, // Enable bevel to make strokes thicker
      bevelThickness: 0.05, // Increase to make strokes thicker (was 0.05)
      bevelSize: 0.15, // Increase to expand the outline (was 0.03)
      bevelSegments: 8 // Keep low to reduce artifacts
    })
    
    // Center the text geometry
    textGeometry.computeBoundingBox()
    const centerOffset = new THREE.Vector3()
    textGeometry.boundingBox.getCenter(centerOffset)
    textGeometry.translate(-centerOffset.x, -centerOffset.y, -centerOffset.z)
    
    // Scale horizontally to make the font appear flatter/wider (IKEA-like)
      textGeometry.scale(1.6, 0.7, 1) // Increase X scale to widen, keep Y and Z at 1
    
    // Rotate the cylinder to face the camera (not the K)
    cylinderGeometry.rotateX(Math.PI / 2)
    
    // Perform CSG subtraction
    const evaluator = new Evaluator()
    const cylinderBrush = new Brush(cylinderGeometry)
    const textBrush = new Brush(textGeometry)
    
    const result = evaluator.evaluate(cylinderBrush, textBrush, SUBTRACTION)
    
    return result.geometry
  }, [font])
  
  if (!geometry) return null
  
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#3a3a3a"
        metalness={0.9}
        roughness={0.3}
      />
    </mesh>
  )
}

function GoldRing() {
  const geometry = useMemo(() => {
    // Create outer cylinder
    const outerCylinder = new THREE.CylinderGeometry(2.8, 2.8, 0.4, 64)
    // Create inner cylinder to subtract - slightly taller to avoid CSG artifacts
    const innerCylinder = new THREE.CylinderGeometry(2.5, 2.5, 0.45, 64)
    
    // Rotate both to match coin orientation
    outerCylinder.rotateX(Math.PI / 2)
    innerCylinder.rotateX(Math.PI / 2)
    
    // Perform CSG subtraction to create ring
    const evaluator = new Evaluator()
    const outerBrush = new Brush(outerCylinder)
    const innerBrush = new Brush(innerCylinder)
    
    const result = evaluator.evaluate(outerBrush, innerBrush, SUBTRACTION)
    
    return result.geometry
  }, [])
  
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.9}
        roughness={0.3}
      />
    </mesh>
  )
}

function RotatingK({ onZoomComplete }) {
  const meshRef = useRef()
  const { camera, gl } = useThree()
  
  // State for drag interaction
  const [isDragging, setIsDragging] = useState(false)
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 })
  const [angularVelocity, setAngularVelocity] = useState({ x: 0, y: 0 })
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 })
  const autoRotationOffset = useRef(0)
  
  // Zoom animation state
  const [hasZoomed, setHasZoomed] = useState(false)
  const zoomStartTime = useRef(null)
  
  // Damping and auto-rotation constants
  const DAMPING = 0.95
  const AUTO_ROTATION_SPEED = 0.3
  const RESET_THRESHOLD = 0.01
  const RESET_SPEED = 0.05
  const ZOOM_DURATION = 2.5 // seconds for the zoom-in animation

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Handle zoom-in animation
      if (!hasZoomed) {
        if (zoomStartTime.current === null) {
          zoomStartTime.current = state.clock.elapsedTime
        }
        
        const elapsed = state.clock.elapsedTime - zoomStartTime.current
        
        if (elapsed < ZOOM_DURATION) {
          // Ease-out function for smooth deceleration
          const t = elapsed / ZOOM_DURATION
          const easeOut = 1 - Math.pow(1 - t, 3)
          
          // Start from very far away (z = -200) and zoom to z = 0
          const startZ = -200
          const endZ = 0
          meshRef.current.position.z = startZ + (endZ - startZ) * easeOut
        } else {
          meshRef.current.position.z = 0
          setHasZoomed(true)
          if (onZoomComplete) {
            onZoomComplete()
          }
        }
      }
      
      if (!isDragging) {
        // Apply damping to angular velocity
        setAngularVelocity(prev => ({
          x: prev.x * DAMPING,
          y: prev.y * DAMPING
        }))

        // Apply velocity to rotation
        if (Math.abs(angularVelocity.x) > 0.001 || Math.abs(angularVelocity.y) > 0.001) {
          setCurrentRotation(prev => ({
            x: prev.x + angularVelocity.x,
            y: prev.y + angularVelocity.y
          }))
        }

        // Reset X rotation when settled
        if (Math.abs(angularVelocity.x) < RESET_THRESHOLD && Math.abs(angularVelocity.y) < RESET_THRESHOLD) {
          // Find the nearest equivalent angle to 0 (level position)
          const TWO_PI = Math.PI * 2
          const normalizedX = ((currentRotation.x % TWO_PI) + TWO_PI) % TWO_PI
          const targetX = normalizedX > Math.PI ? TWO_PI : 0
          const currentNormalized = currentRotation.x - Math.floor(currentRotation.x / TWO_PI) * TWO_PI
          const diff = targetX - normalizedX
          
          if (Math.abs(diff) > 0.01) {
            setCurrentRotation(prev => ({
              x: prev.x + diff * RESET_SPEED,
              y: prev.y
            }))
          }
        }
      }

      // Always apply rotation (whether dragging or not)
      meshRef.current.rotation.x = currentRotation.x
      if (!isDragging) {
        meshRef.current.rotation.y = currentRotation.y + state.clock.elapsedTime * AUTO_ROTATION_SPEED - autoRotationOffset.current
      } else {
        meshRef.current.rotation.y = currentRotation.y
      }
    }
  })

  const handlePointerDown = (event) => {
    event.stopPropagation()
    setIsDragging(true)
    setPreviousMousePosition({
      x: event.clientX,
      y: event.clientY
    })
    setAngularVelocity({ x: 0, y: 0 })
    
    // Capture current rotation including auto-rotation
    if (meshRef.current) {
      setCurrentRotation({
        x: meshRef.current.rotation.x,
        y: meshRef.current.rotation.y
      })
    }
    
    gl.domElement.style.cursor = 'grabbing'
  }

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x
        const deltaY = event.clientY - previousMousePosition.y

        // Update rotation based on drag
        setCurrentRotation(prev => ({
          x: prev.x + deltaY * 0.01,
          y: prev.y + deltaX * 0.01
        }))

        // Calculate velocity for inertia
        setAngularVelocity({
          x: deltaY * 0.01,
          y: deltaX * 0.01
        })

        setPreviousMousePosition({
          x: event.clientX,
          y: event.clientY
        })
      }
    }

    const handlePointerUp = (event) => {
      setIsDragging(false)
      
      // Update the auto-rotation offset to account for manual rotation
      if (meshRef.current) {
        const state = gl.getContext()
        autoRotationOffset.current = performance.now() / 1000 * AUTO_ROTATION_SPEED - meshRef.current.rotation.y + currentRotation.y
      }
      
      gl.domElement.style.cursor = 'grab'
    }

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, previousMousePosition, gl.domElement])

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerOver={() => !isDragging && (gl.domElement.style.cursor = 'grab')}
      onPointerOut={() => !isDragging && (gl.domElement.style.cursor = 'default')}
    >
      {/* Invisible larger sphere for easier clicking/dragging */}
      <mesh visible={false}>
        <sphereGeometry args={[4, 32, 32]} />
      </mesh>
      <Suspense fallback={<Loader />}>
        <CoinWithCutout />
        <GoldRing />
      </Suspense>
    </group>
  )
}

function Loader() {
  return (
    <mesh>
      <cylinderGeometry args={[2.5, 2.5, 0.4, 64]} />
      <meshStandardMaterial 
        color="#3a3a3a" 
        metalness={0.9}
        roughness={0.3}
        opacity={0.3}
        transparent={true}
      />
    </mesh>
  )
}

function App() {
  const [coinHasZoomed, setCoinHasZoomed] = useState(false)

  return (
    <>
      <Banner show={coinHasZoomed} />
      <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ antialias: true, stencil: true }}
        >
          <ambientLight intensity={2.0} />
          <directionalLight position={[5, 5, 5]} intensity={3.0} />
          <directionalLight position={[-5, -5, -5]} intensity={2.0} />
          <directionalLight position={[0, 5, 0]} intensity={2.5} />
          <directionalLight position={[0, -5, 0]} intensity={2.0} />
          <pointLight position={[0, 0, 5]} intensity={3.0} color="#ffffff" />
          <pointLight position={[0, 0, -5]} intensity={3.0} color="#ffffff" />
          <pointLight position={[5, 0, 0]} intensity={2.0} color="#ffffff" />
          <pointLight position={[-5, 0, 0]} intensity={2.0} color="#ffffff" />
          <Suspense fallback={<Loader />}>
            <RotatingK onZoomComplete={() => setCoinHasZoomed(true)} />
          </Suspense>
        </Canvas>
      </div>
      <Footer show={coinHasZoomed} />
    </>
  )
}

export default App
