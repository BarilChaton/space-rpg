import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { createPlanetTexture } from './utils'

function Planet({ seed = 2468, position = [3.2, -1.35, 0], radius = 3.25, rotationSpeed = 0.015 }) {
  const planetRef = useRef()

  const planetTexture = useMemo(() => {
    return createPlanetTexture({
      seed,
      oceanLevel: 0.04,
      continentScale: 1.25,
      mountainStrength: 0.22,
      temperatureOffset: 0,
      moistureOffset: 0
    })
  }, [seed])

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed
    }
  })

  useEffect(() => {
    return () => {
      planetTexture.dispose()
    }
  }, [planetTexture])

  return (
    <group position={position} rotation={[0.08, 0, -0.12]}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshStandardMaterial map={planetTexture} roughness={0.9} metalness={0.02} />
      </mesh>
    </group>
  )
}

export default Planet
