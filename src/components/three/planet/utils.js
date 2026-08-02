import {
  CanvasTexture,
  ClampToEdgeWrapping,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three'

// --------------------------------------------------
// General helpers
// --------------------------------------------------

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

function lerp(start, end, amount) {
  return start + (end - start) * amount
}

function smoothstep(value) {
  return value * value * (3 - 2 * value)
}

function mixColor(colorA, colorB, amount) {
  const t = clamp(amount)

  return [
    lerp(colorA[0], colorB[0], t),
    lerp(colorA[1], colorB[1], t),
    lerp(colorA[2], colorB[2], t),
  ]
}

function createCanvasTexture(canvas) {
  const texture = new CanvasTexture(canvas)

  texture.colorSpace = SRGBColorSpace
  texture.wrapS = ClampToEdgeWrapping
  texture.wrapT = ClampToEdgeWrapping
  texture.minFilter = LinearMipmapLinearFilter
  texture.generateMipmaps = true

  return texture
}

// --------------------------------------------------
// Seeded 3D noise
// --------------------------------------------------

function hash3D(x, y, z, seed) {
  let value =
    Math.imul(x, 374761393) +
    Math.imul(y, 668265263) +
    Math.imul(z, 2147483647) +
    Math.imul(seed, 1442695041)

  value = Math.imul(value ^ (value >>> 13), 1274126177)
  value ^= value >>> 16

  return (value >>> 0) / 4294967295
}

function valueNoise3D(x, y, z, seed) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const z0 = Math.floor(z)

  const x1 = x0 + 1
  const y1 = y0 + 1
  const z1 = z0 + 1

  const tx = smoothstep(x - x0)
  const ty = smoothstep(y - y0)
  const tz = smoothstep(z - z0)

  const c000 = hash3D(x0, y0, z0, seed)
  const c100 = hash3D(x1, y0, z0, seed)
  const c010 = hash3D(x0, y1, z0, seed)
  const c110 = hash3D(x1, y1, z0, seed)
  const c001 = hash3D(x0, y0, z1, seed)
  const c101 = hash3D(x1, y0, z1, seed)
  const c011 = hash3D(x0, y1, z1, seed)
  const c111 = hash3D(x1, y1, z1, seed)

  const x00 = lerp(c000, c100, tx)
  const x10 = lerp(c010, c110, tx)
  const x01 = lerp(c001, c101, tx)
  const x11 = lerp(c011, c111, tx)

  const y0Value = lerp(x00, x10, ty)
  const y1Value = lerp(x01, x11, ty)

  return lerp(y0Value, y1Value, tz) * 2 - 1
}

function fbm3D(x, y, z, {
  seed,
  octaves = 6,
  frequency = 1,
  persistence = 0.5,
  lacunarity = 2,
}) {
  let value = 0
  let amplitude = 1
  let maximum = 0

  for (let octave = 0; octave < octaves; octave++) {
    value += valueNoise3D(
      x * frequency,
      y * frequency,
      z * frequency,
      seed + octave * 1013,
    ) * amplitude

    maximum += amplitude
    amplitude *= persistence
    frequency *= lacunarity
  }

  return value / maximum
}

// --------------------------------------------------
// Planet surface
// --------------------------------------------------

const planetCanvasCache = new Map()

const PLANET_QUALITY = {
  low: {
    width: 256,
    height: 128,
    continentOctaves: 4,
    warpOctaves: 2,
    detailOctaves: 2,
    climateOctaves: 2,
  },
  medium: {
    width: 512,
    height: 256,
    continentOctaves: 5,
    warpOctaves: 3,
    detailOctaves: 3,
    climateOctaves: 3,
  },
  high: {
    width: 1024,
    height: 512,
    continentOctaves: 6,
    warpOctaves: 4,
    detailOctaves: 5,
    climateOctaves: 4,
  },
}

export function createPlanetTexture({
  seed = 1,
  quality = 'medium',
  width,
  height,
  oceanLevel = 0.04,
  continentScale = 1.25,
  mountainStrength = 0.22,
  temperatureOffset = 0,
  moistureOffset = 0,
} = {}) {
  const qualitySettings = PLANET_QUALITY[quality] || PLANET_QUALITY.medium

  const textureWidth = width || qualitySettings.width
  const textureHeight = height || qualitySettings.height

  const cacheKey = JSON.stringify({
    seed,
    quality,
    width: textureWidth,
    height: textureHeight,
    oceanLevel,
    continentScale,
    mountainStrength,
    temperatureOffset,
    moistureOffset,
  })

  const cachedCanvas = planetCanvasCache.get(cacheKey)

  if (cachedCanvas) return createCanvasTexture(cachedCanvas)

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = textureWidth
  canvas.height = textureHeight

  const imageData = context.createImageData(textureWidth, textureHeight)
  const pixels = imageData.data

  const deepOcean = [4, 19, 48]
  const ocean = [8, 55, 98]
  const shallowOcean = [20, 104, 135]
  const beach = [186, 170, 116]

  const desert = [166, 131, 72]
  const grassland = [74, 112, 57]
  const forest = [31, 79, 48]
  const rainforest = [20, 69, 44]
  const tundra = [105, 116, 101]
  const rock = [100, 94, 86]
  const mountain = [137, 132, 123]
  const snow = [221, 230, 232]

  const longitudeCos = new Float32Array(textureWidth)
  const longitudeSin = new Float32Array(textureWidth)

  for (let x = 0; x < textureWidth; x++) {
    const longitude = Math.PI * 2 * (x / textureWidth)

    longitudeCos[x] = Math.cos(longitude)
    longitudeSin[x] = Math.sin(longitude)
  }

  const continentOptions = {
    seed,
    octaves: qualitySettings.continentOctaves,
    frequency: 1,
    persistence: 0.52,
    lacunarity: 2.05,
  }

  const warpOptions = {
    seed: seed + 191,
    octaves: qualitySettings.warpOctaves,
    frequency: 1,
    persistence: 0.55,
    lacunarity: 2.15,
  }

  const detailOptions = {
    seed: seed + 431,
    octaves: qualitySettings.detailOctaves,
    frequency: 1,
    persistence: 0.48,
    lacunarity: 2.2,
  }

  const climateOptions = {
    seed: seed + 1201,
    octaves: qualitySettings.climateOctaves,
    frequency: 1,
    persistence: 0.52,
    lacunarity: 2,
  }

  for (let y = 0; y < textureHeight; y++) {
    const latitude = Math.PI * (y / (textureHeight - 1) - 0.5)
    const latitudeSin = Math.sin(latitude)
    const latitudeCos = Math.cos(latitude)
    const latitudeFactor = Math.abs(latitudeSin)

    for (let x = 0; x < textureWidth; x++) {
      const sphereX = latitudeCos * longitudeCos[x]
      const sphereY = latitudeSin
      const sphereZ = latitudeCos * longitudeSin[x]

      const continentNoise = fbm3D(
        sphereX * continentScale,
        sphereY * continentScale,
        sphereZ * continentScale,
        continentOptions,
      )

      const continentalWarp = fbm3D(
        sphereX * 2.1 + 7.4,
        sphereY * 2.1 - 3.1,
        sphereZ * 2.1 + 5.8,
        warpOptions,
      )

      const detailNoise = fbm3D(
        sphereX * 5.5,
        sphereY * 5.5,
        sphereZ * 5.5,
        detailOptions,
      )

      /*
       * Reuse the detail field for mountain ridges instead of calculating
       * another full five-octave noise field.
       */
      const ridges = 1 - Math.abs(detailNoise)

      const elevation =
        continentNoise * 0.8 +
        continentalWarp * 0.16 +
        detailNoise * 0.1 +
        Math.pow(ridges, 4) * mountainStrength -
        oceanLevel

      const climateNoise = fbm3D(
        sphereX * 3.2 + 17,
        sphereY * 3.2 - 11,
        sphereZ * 3.2 + 4,
        climateOptions,
      )

      /*
       * Moisture and temperature use the same broad climate field with
       * different contributions. This avoids another expensive FBM call.
       */
      const moisture = clamp(
        climateNoise * 0.5 +
        detailNoise * 0.08 +
        0.5 +
        moistureOffset,
      )

      const temperature = clamp(
        1 -
        latitudeFactor * 1.15 -
        Math.max(elevation, 0) * 0.45 -
        climateNoise * 0.08 +
        temperatureOffset,
      )

      let color

      if (elevation < 0) {
        const depth = clamp(-elevation * 4)

        if (depth > 0.55) {
          color = mixColor(ocean, deepOcean, (depth - 0.55) / 0.45)
        } else {
          color = mixColor(shallowOcean, ocean, depth / 0.55)
        }
      } else if (elevation < 0.025) {
        color = mixColor(beach, grassland, elevation / 0.025)
      } else if (elevation > 0.48 || temperature < 0.12) {
        const snowAmount = clamp(
          Math.max(
            (elevation - 0.42) * 4,
            (0.18 - temperature) * 5,
          ),
        )

        color = mixColor(mountain, snow, snowAmount)
      } else if (elevation > 0.3) {
        const rockAmount = clamp((elevation - 0.3) / 0.18)
        color = mixColor(grassland, rock, rockAmount)
      } else if (temperature < 0.3) {
        color = mixColor(tundra, grassland, moisture * 0.35)
      } else if (moisture < 0.25) {
        color = mixColor(desert, grassland, moisture / 0.25)
      } else if (moisture > 0.72 && temperature > 0.58) {
        color = mixColor(forest, rainforest, (moisture - 0.72) / 0.28)
      } else if (moisture > 0.5) {
        color = mixColor(grassland, forest, (moisture - 0.5) / 0.22)
      } else {
        color = mixColor(desert, grassland, (moisture - 0.25) / 0.25)
      }

      const surfaceVariation = 0.92 + detailNoise * 0.07
      const index = (y * textureWidth + x) * 4

      pixels[index] = clamp(color[0] * surfaceVariation, 0, 255)
      pixels[index + 1] = clamp(color[1] * surfaceVariation, 0, 255)
      pixels[index + 2] = clamp(color[2] * surfaceVariation, 0, 255)
      pixels[index + 3] = 255
    }
  }

  context.putImageData(imageData, 0, 0)

  planetCanvasCache.set(cacheKey, canvas)

  return createCanvasTexture(canvas)
}