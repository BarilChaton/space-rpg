import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { BackSide, LinearMipmapLinearFilter, RepeatWrapping, SRGBColorSpace } from 'three'

function Earth({ position = [0, 0, 0], radius = 3.4, rotationSpeed = 0.012 }) {
  const earthRef = useRef()
  const { gl } = useThree()

  const loadedTexture = useTexture('/textures/2k_earth_daymap.jpg')

  const earthTexture = useMemo(() => {
    const texture = loadedTexture.clone()

    texture.colorSpace = SRGBColorSpace
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.minFilter = LinearMipmapLinearFilter
    texture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8)
    texture.needsUpdate = true

    return texture
  }, [loadedTexture, gl])

  useEffect(() => {
    return () => {
      earthTexture.dispose()
    }
  }, [earthTexture])

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * rotationSpeed
  })

  return (
    <group position={position}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[radius, 96, 96]} />

        <meshStandardMaterial map={earthTexture} roughness={0.9} metalness={0} />
      </mesh>

      <mesh scale={1.02}>
        <sphereGeometry args={[radius, 64, 64]} />

        <meshBasicMaterial color="#6ebfff" transparent opacity={0.08} side={BackSide} />
      </mesh>
    </group>
  )
}

useTexture.preload('/textures/2k_earth_daymap.jpg')

export default Earth
