import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry } from 'three'
import { createSeededRandom, getRandomSpherePosition, getRandomStarColor } from './utils'

function StarLayer({ seed, count, minRadius, maxRadius, size, opacity, colorVariation = false, rotationSpeed = 0 }) {
  const starsRef = useRef()

  const geometry = useMemo(() => {
    const random = createSeededRandom(seed)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const index = i * 3
      const [x, y, z] = getRandomSpherePosition(random, minRadius, maxRadius)
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

    return starGeometry
  }, [seed, count, minRadius, maxRadius, colorVariation])

  useLayoutEffect(() => {
    return () => geometry.dispose()
  }, [geometry])

  useFrame((_, delta) => {
    if (!starsRef.current || rotationSpeed === 0) return

    starsRef.current.rotation.y += delta * rotationSpeed
  })

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial
        size={size}
        transparent
        opacity={opacity}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}

function Starfield({ seed = 4812, backgroundCount = 6000, mediumCount = 850, brightCount = 90 }) {
  return (
    <group>
      <StarLayer seed={seed} count={backgroundCount} minRadius={35} maxRadius={95} size={0.06} opacity={0.82} rotationSpeed={0.0008} />

      <StarLayer
        seed={seed + 1}
        count={mediumCount}
        minRadius={30}
        maxRadius={75}
        size={0.12}
        opacity={0.95}
        colorVariation
        rotationSpeed={0.0014}
      />

      <StarLayer
        seed={seed + 2}
        count={brightCount}
        minRadius={25}
        maxRadius={60}
        size={0.26}
        opacity={1}
        colorVariation
        rotationSpeed={0.002}
      />
    </group>
  )
}

export default Starfield
