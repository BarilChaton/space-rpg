import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, ClampToEdgeWrapping, Color, LinearFilter, SpriteMaterial, SRGBColorSpace } from 'three'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'

// --------------------------------------------------
// Texture helpers
// --------------------------------------------------

function prepareTexture(canvas) {
  const texture = new CanvasTexture(canvas)

  texture.colorSpace = SRGBColorSpace
  texture.wrapS = ClampToEdgeWrapping
  texture.wrapT = ClampToEdgeWrapping
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true

  return texture
}

function createRadialTexture({
  size = 512,
  centerColor = 'rgba(255,255,255,1)',
  innerColor = 'rgba(255,225,145,0.85)',
  middleColor = 'rgba(255,150,45,0.28)',
  outerColor = 'rgba(255,80,0,0)'
} = {}) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = size
  canvas.height = size

  const center = size * 0.5
  const gradient = context.createRadialGradient(center, center, 0, center, center, center)

  gradient.addColorStop(0, centerColor)
  gradient.addColorStop(0.1, innerColor)
  gradient.addColorStop(0.38, middleColor)
  gradient.addColorStop(1, outerColor)

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  return prepareTexture(canvas)
}

function createStarburstTexture({ size = 1024, seed = 4917, rayCount = 34 } = {}) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = size
  canvas.height = size

  const center = size * 0.5

  let state = seed >>> 0

  function random() {
    state += 0x6d2b79f5

    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }

  const core = context.createRadialGradient(center, center, 0, center, center, center * 0.55)

  core.addColorStop(0, 'rgba(255,255,255,1)')
  core.addColorStop(0.08, 'rgba(255,245,190,0.98)')
  core.addColorStop(0.24, 'rgba(255,190,70,0.48)')
  core.addColorStop(0.58, 'rgba(255,110,20,0.1)')
  core.addColorStop(1, 'rgba(255,80,0,0)')

  context.fillStyle = core
  context.fillRect(0, 0, size, size)

  context.save()
  context.translate(center, center)
  context.globalCompositeOperation = 'lighter'

  for (let i = 0; i < rayCount; i++) {
    const angle = random() * Math.PI * 2
    const length = size * (0.18 + random() * 0.32)
    const width = size * (0.0008 + random() * 0.004)
    const opacity = 0.05 + random() * 0.2

    context.save()
    context.rotate(angle)

    const rayGradient = context.createLinearGradient(0, 0, length, 0)

    rayGradient.addColorStop(0, `rgba(255,245,190,${opacity})`)
    rayGradient.addColorStop(0.1, `rgba(255,205,100,${opacity * 0.75})`)
    rayGradient.addColorStop(0.45, `rgba(255,150,45,${opacity * 0.3})`)
    rayGradient.addColorStop(1, 'rgba(255,110,20,0)')

    context.fillStyle = rayGradient
    context.beginPath()
    context.moveTo(0, -width)
    context.lineTo(length, -width * 0.12)
    context.lineTo(length, width * 0.12)
    context.lineTo(0, width)
    context.closePath()
    context.fill()

    context.restore()
  }

  const majorRays = [
    { angle: 0, length: 0.46, width: 0.005, opacity: 0.28 },
    { angle: Math.PI, length: 0.46, width: 0.005, opacity: 0.28 },
    { angle: Math.PI * 0.5, length: 0.4, width: 0.004, opacity: 0.22 },
    { angle: Math.PI * 1.5, length: 0.4, width: 0.004, opacity: 0.22 },
    { angle: Math.PI * 0.25, length: 0.34, width: 0.003, opacity: 0.16 },
    { angle: Math.PI * 1.25, length: 0.34, width: 0.003, opacity: 0.16 }
  ]

  for (const ray of majorRays) {
    context.save()
    context.rotate(ray.angle)

    const length = size * ray.length
    const width = size * ray.width
    const gradient = context.createLinearGradient(0, 0, length, 0)

    gradient.addColorStop(0, `rgba(255,255,225,${ray.opacity})`)
    gradient.addColorStop(0.18, `rgba(255,210,120,${ray.opacity * 0.75})`)
    gradient.addColorStop(1, 'rgba(255,150,60,0)')

    context.fillStyle = gradient
    context.beginPath()
    context.moveTo(0, -width)
    context.lineTo(length, 0)
    context.lineTo(0, width)
    context.closePath()
    context.fill()

    context.restore()
  }

  context.restore()

  return prepareTexture(canvas)
}

function createGhostTexture({ size = 256, color = [255, 190, 95], ring = false } = {}) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = size
  canvas.height = size

  const center = size * 0.5
  const gradient = context.createRadialGradient(center, center, 0, center, center, center)

  if (ring) {
    gradient.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},0)`)
    gradient.addColorStop(0.42, `rgba(${color[0]},${color[1]},${color[2]},0.015)`)
    gradient.addColorStop(0.63, `rgba(${color[0]},${color[1]},${color[2]},0.22)`)
    gradient.addColorStop(0.72, `rgba(${color[0]},${color[1]},${color[2]},0.05)`)
    gradient.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`)
  } else {
    gradient.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},0.42)`)
    gradient.addColorStop(0.25, `rgba(${color[0]},${color[1]},${color[2]},0.2)`)
    gradient.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`)
  }

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  return prepareTexture(canvas)
}

// --------------------------------------------------
// Sun
// --------------------------------------------------

function Sun({ position = [0, 0, 0], radius = 14, intensity = 4000000, color = '#fff1c6' }) {
  const lightRef = useRef()
  const raySpriteRef = useRef()

  const textures = useMemo(
    () => ({
      core: createRadialTexture({
        centerColor: 'rgba(255,255,255,1)',
        innerColor: 'rgba(255,247,200,0.98)',
        middleColor: 'rgba(255,175,55,0.4)',
        outerColor: 'rgba(255,90,0,0)'
      }),

      corona: createRadialTexture({
        centerColor: 'rgba(255,245,190,0.72)',
        innerColor: 'rgba(255,190,75,0.52)',
        middleColor: 'rgba(255,120,25,0.17)',
        outerColor: 'rgba(255,60,0,0)'
      }),

      rays: createStarburstTexture(),

      warmGhost: createGhostTexture({
        color: [255, 178, 82]
      }),

      coolGhost: createGhostTexture({
        color: [140, 185, 255]
      }),

      warmRing: createGhostTexture({
        color: [255, 194, 110],
        ring: true
      }),

      coolRing: createGhostTexture({
        color: [115, 165, 255],
        ring: true
      })
    }),
    []
  )

  const materials = useMemo(
    () => ({
      core: new SpriteMaterial({
        map: textures.core,
        color: new Color('#fff4c8'),
        transparent: true,
        opacity: 1,
        blending: AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        toneMapped: false
      }),

      corona: new SpriteMaterial({
        map: textures.corona,
        color: new Color('#ff9a32'),
        transparent: true,
        opacity: 0.72,
        blending: AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        toneMapped: false
      }),

      rays: new SpriteMaterial({
        map: textures.rays,
        color: new Color('#ffc265'),
        transparent: true,
        opacity: 0.82,
        blending: AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        toneMapped: false
      })
    }),
    [textures]
  )

  useEffect(() => {
    const light = lightRef.current

    if (!light) return

    const lensflare = new Lensflare()

    lensflare.addElement(new LensflareElement(textures.core, 620, 0, new Color('#fff1bd')))
    lensflare.addElement(new LensflareElement(textures.warmGhost, 90, 0.24, new Color('#ffd18c')))
    lensflare.addElement(new LensflareElement(textures.warmRing, 170, 0.42, new Color('#d59a62')))
    lensflare.addElement(new LensflareElement(textures.coolGhost, 48, 0.58, new Color('#9abaff')))
    lensflare.addElement(new LensflareElement(textures.warmGhost, 230, 0.72, new Color('#c88b55')))
    lensflare.addElement(new LensflareElement(textures.coolRing, 340, 0.88, new Color('#7189b9')))
    lensflare.addElement(new LensflareElement(textures.warmGhost, 62, 1, new Color('#ffd090')))

    light.add(lensflare)

    return () => {
      light.remove(lensflare)

      if (typeof lensflare.dispose === 'function') {
        lensflare.dispose()
      }
    }
  }, [textures])

  useFrame((_, delta) => {
    if (!raySpriteRef.current) return

    raySpriteRef.current.material.rotation += delta * 0.003
  })

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((material) => material.dispose())
      Object.values(textures).forEach((texture) => texture.dispose())
    }
  }, [materials, textures])

  return (
    <group position={position}>
      {/* Physical stellar light */}
      <pointLight ref={lightRef} color={color} intensity={intensity} distance={0} decay={2} />

      {/* Small visible stellar surface */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color="#fff1b0" toneMapped={false} />
      </mesh>

      {/* Bright center */}
      <sprite material={materials.core} scale={[radius * 4.2, radius * 4.2, 1]} />

      {/* Irregular starburst rays */}
      <sprite ref={raySpriteRef} material={materials.rays} scale={[radius * 11, radius * 11, 1]} />

      {/* Soft surrounding corona */}
      <sprite material={materials.corona} scale={[radius * 8, radius * 8, 1]} />
    </group>
  )
}

export default Sun
