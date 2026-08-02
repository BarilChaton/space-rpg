import { Color } from 'three'

// --------------------------------------------------
// Seeded random
// --------------------------------------------------

export function createSeededRandom(seed = 1) {
  let value = seed % 2147483647

  if (value <= 0) value += 2147483646

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

// --------------------------------------------------
// Star colors
// --------------------------------------------------

const STAR_COLORS = [
  { color: '#ffffff', weight: 0.66 },
  { color: '#dce8ff', weight: 0.14 },
  { color: '#a9c7ff', weight: 0.08 },
  { color: '#fff4d6', weight: 0.07 },
  { color: '#ffd0a3', weight: 0.035 },
  { color: '#ffad8a', weight: 0.015 }
]

export function getRandomStarColor(random) {
  const value = random()
  let accumulatedWeight = 0

  for (const entry of STAR_COLORS) {
    accumulatedWeight += entry.weight

    if (value <= accumulatedWeight) return new Color(entry.color)
  }

  return new Color('#ffffff')
}

// --------------------------------------------------
// Position generation
// --------------------------------------------------

export function getRandomSpherePosition(random, minRadius, maxRadius) {
  const radius = minRadius + random() * (maxRadius - minRadius)
  const theta = random() * Math.PI * 2
  const phi = Math.acos(2 * random() - 1)

  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  ]
}