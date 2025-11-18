import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import { useRef, useState, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import './App.css'

function RotatingK() {
  const meshRef = useRef()
  const { camera, gl } = useThree()
  
  // State for drag interaction
  const [isDragging, setIsDragging] = useState(false)
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 })
  const [angularVelocity, setAngularVelocity] = useState({ x: 0, y: 0 })
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 })
  const autoRotationOffset = useRef(0)
  
  // Damping and auto-rotation constants
  const DAMPING = 0.95
  const AUTO_ROTATION_SPEED = 0.3
  const RESET_THRESHOLD = 0.01
  const RESET_SPEED = 0.05

  useFrame((state, delta) => {
    if (meshRef.current) {
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
      {/* Yellow ring accent - positioned first so it's behind the K */}
      <mesh position={[0, 0, -0.3]} rotation={[0, 0, 0]}>
        <torusGeometry args={[2.2, 0.25, 16, 100]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <Center>
        <Text3D
          font="/kierio04.channel/fonts/helvetiker_bold.typeface.json"
          size={3}
          height={0.5}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.15}
          bevelSize={0.08}
          bevelOffset={0}
          bevelSegments={5}
        >
          K
          <meshStandardMaterial
            color="#000000"
            metalness={0.3}
            roughness={0.4}
          />
        </Text3D>
      </Center>
    </group>
  )
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4a90e2" wireframe />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        <pointLight position={[0, 0, 5]} intensity={0.6} color="#FFD700" />
        <Suspense fallback={<Loader />}>
          <RotatingK />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
