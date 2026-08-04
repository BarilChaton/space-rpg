import { useLayoutEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, CanvasTexture, Color, SRGBColorSpace } from 'three'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'

function createGlowTexture({
  size = 256,
  innerColor = 'rgba(255, 255, 255, 1)',
  middleColor = 'rgba(255, 190, 80, 0.45)',
  outerColor = 'rgba(255, 100, 20, 0)'
} = {}) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = size
  canvas.height = size

  const center = size / 2
  const gradient = context.createRadialGradient(center, center, 0, center, center, center)

  gradient.addColorStop(0, innerColor)
  gradient.addColorStop(0.12, innerColor)
  gradient.addColorStop(0.35, middleColor)
  gradient.addColorStop(1, outerColor)

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace

  return texture
}

function Sun({ position = [0.45, 1.3, -1.8], intensity = 7 }) {
  const lightRef = useRef()

  const coreTexture = useMemo(() => {
    return createGlowTexture({
      innerColor: 'rgba(255, 255, 245, 1)',
      middleColor: 'rgba(255, 190, 70, 0.6)',
      outerColor: 'rgba(255, 100, 20, 0)'
    })
  }, [])

  const flareTexture = useMemo(() => {
    return createGlowTexture({
      innerColor: 'rgba(255, 255, 255, 0.9)',
      middleColor: 'rgba(100, 180, 255, 0.25)',
      outerColor: 'rgba(30, 100, 255, 0)'
    })
  }, [])

  useLayoutEffect(() => {
    const light = lightRef.current

    if (!light) return

    const lensflare = new Lensflare()

    lensflare.addElement(new LensflareElement(coreTexture, 420, 0, new Color('#fff4d6')))

    lensflare.addElement(new LensflareElement(flareTexture, 80, 0.35, new Color('#8fc7ff')))

    lensflare.addElement(new LensflareElement(flareTexture, 130, 0.62, new Color('#ffd39b')))

    lensflare.addElement(new LensflareElement(flareTexture, 65, 0.82, new Color('#6faeff')))

    light.add(lensflare)

    return () => {
      light.remove(lensflare)
      lensflare.dispose()
    }
  }, [coreTexture, flareTexture])

  useLayoutEffect(() => {
    return () => {
      coreTexture.dispose()
      flareTexture.dispose()
    }
  }, [coreTexture, flareTexture])

  return (
    <group position={position}>
      <pointLight ref={lightRef} color="#fff0cf" intensity={intensity} distance={45} decay={1.6} />

      <sprite scale={[1.3, 1.3, 1]}>
        <spriteMaterial map={coreTexture} transparent opacity={0.95} blending={AdditiveBlending} depthWrite={false} />
      </sprite>

      <sprite scale={[3.5, 3.5, 1]}>
        <spriteMaterial map={coreTexture} transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  )
}

export default Sun
