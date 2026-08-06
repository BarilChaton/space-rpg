import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry } from 'three'

import { createSeededRandom, getRandomSpherePosition, getRandomStarColor } from './utils'

function StarLayer({ seed, count, radius, thickness, size, opacity, colorVariation = false, rotationSpeed = 0 }) {
  const starsRef = useRef()
  const { camera } = useThree()

  const geometry = useMemo(() => {
    const random = createSeededRandom(seed)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const index = i * 3
      const minimumRadius = radius - thickness * 0.5
      const maximumRadius = radius + thickness * 0.5
      const [x, y, z] = getRandomSpherePosition(random, minimumRadius, maximumRadius)
      const color = colorVariation ? getRandomStarColor(random) : getRandomStarColor(() => 0)

      positions[index] = x
      positions[index + 1] = y
      positions[index + 2] = z

      colors[index] = color.r
      colors[index + 1] = color.g
      colors[index + 2] = color.b
    }

    const starGeometry = new BufferGeometry()

    starGeometry.setAttribute('position', new BufferAttribute(positions, 3))
    starGeometry.setAttribute('color', new BufferAttribute(colors, 3))
    starGeometry.computeBoundingSphere()

    return starGeometry
  }, [seed, count, radius, thickness, colorVariation])

  useLayoutEffect(() => {
    return () => geometry.dispose()
  }, [geometry])

  useFrame((_, delta) => {
    if (!starsRef.current) return

    starsRef.current.position.copy(camera.position)

    if (rotationSpeed !== 0) {
      starsRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <points ref={starsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={size}
        transparent
        opacity={opacity}
        vertexColors
        sizeAttenuation={false}
        depthWrite={false}
        depthTest
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

function Starfield({ seed = 4812, backgroundCount = 6500, mediumCount = 900, brightCount = 100 }) {
  return (
    <group>
      <StarLayer seed={seed} count={backgroundCount} radius={2200} thickness={100} size={1.1} opacity={0.72} rotationSpeed={0.00005} />

      <StarLayer
        seed={seed + 1}
        count={mediumCount}
        radius={2250}
        thickness={90}
        size={1.7}
        opacity={0.9}
        colorVariation
        rotationSpeed={0.00008}
      />

      <StarLayer
        seed={seed + 2}
        count={brightCount}
        radius={2300}
        thickness={80}
        size={2.8}
        opacity={1}
        colorVariation
        rotationSpeed={0.00012}
      />
    </group>
  )
}

export default Starfield
