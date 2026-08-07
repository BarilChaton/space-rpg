import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { LinearMipmapLinearFilter, RepeatWrapping, SRGBColorSpace } from 'three'

function TexturedBody({
  position = [0, 0, 0],
  radius = 1,
  texturePath,
  rotationSpeed = 0.01,
  initialRotation = 0,
  roughness = 0.95,
  metalness = 0,
  segments = 64
}) {
  const bodyRef = useRef()
  const { gl } = useThree()

  const loadedTexture = useTexture(texturePath)

  const texture = useMemo(() => {
    const clonedTexture = loadedTexture.clone()

    clonedTexture.colorSpace = SRGBColorSpace
    clonedTexture.wrapS = RepeatWrapping
    clonedTexture.wrapT = RepeatWrapping
    clonedTexture.minFilter = LinearMipmapLinearFilter
    clonedTexture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8)
    clonedTexture.needsUpdate = true

    return clonedTexture
  }, [loadedTexture, gl])

  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  useFrame((_, delta) => {
    if (bodyRef.current) bodyRef.current.rotation.y += delta * rotationSpeed
  })

  return (
    <mesh ref={bodyRef} position={position} rotation={[0, initialRotation, 0]}>
      <sphereGeometry args={[radius, segments, segments]} />

      <meshStandardMaterial map={texture} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}

export default TexturedBody
