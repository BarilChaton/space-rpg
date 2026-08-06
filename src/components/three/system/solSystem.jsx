import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import Planet from '../planet/planet'
import Sun from '../sun/sun'
import { solBodies } from '../../../data/solBodies'

function Luna() {
  const lunaRef = useRef()
  const body = solBodies.luna

  useFrame((_, delta) => {
    if (lunaRef.current) lunaRef.current.rotation.y += delta * 0.015
  })

  return (
    <mesh ref={lunaRef} position={body.position}>
      <sphereGeometry args={[body.radius, 48, 48]} />
      <meshStandardMaterial color="#777b82" roughness={1} metalness={0} />
    </mesh>
  )
}

function Mars() {
  const marsRef = useRef()
  const body = solBodies.mars

  useFrame((_, delta) => {
    if (marsRef.current) marsRef.current.rotation.y += delta * 0.01
  })

  return (
    <mesh ref={marsRef} position={body.position}>
      <sphereGeometry args={[body.radius, 64, 64]} />
      <meshStandardMaterial color="#9a452d" roughness={0.95} metalness={0.02} />
    </mesh>
  )
}

function SolSystem() {
  const sun = solBodies.sun
  const earth = solBodies.earth

  return (
    <>
      <Sun position={sun.position} radius={sun.radius} intensity={sun.intensity} />
      <Planet position={earth.position} radius={earth.radius} rotationSpeed={0.012} />
      <Luna />
      <Mars />
    </>
  )
}

export default SolSystem
