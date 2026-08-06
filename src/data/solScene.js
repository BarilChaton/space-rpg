import { getSolBody } from './solBodies'

const locationBodies = {
  gateway: 'earth',
  earth: 'earth',
  luna: 'luna',
  mars: 'mars',
  sun: 'sun'
}

const locationViewOverrides = {
  gateway: {
    distanceMultiplier: 2.35,
    verticalMultiplier: 0.15,
    horizontalOffset: -1.15
  },

  earth: {
    distanceMultiplier: 2.7,
    verticalMultiplier: 0.1,
    horizontalOffset: 0
  },

  luna: {
    distanceMultiplier: 3.6,
    verticalMultiplier: 0.2,
    horizontalOffset: 0
  },

  mars: {
    distanceMultiplier: 2.9,
    verticalMultiplier: 0.15,
    horizontalOffset: 0
  },

  sun: {
    distanceMultiplier: 3.8,
    verticalMultiplier: 0.12,
    horizontalOffset: 0
  }
}

function createBodyView(body, {
  distanceMultiplier = 2.8,
  verticalMultiplier = 0.15,
  horizontalOffset = 0
} = {}) {
  const [x, y, z] = body.position

  return {
    id: body.id,
    bodyId: body.id,

    cameraPosition: [
      x + horizontalOffset * body.radius,
      y + verticalMultiplier * body.radius,
      z + distanceMultiplier * body.radius
    ],

    cameraTarget: [x, y, z]
  }
}

export function getSolLocationView(locationId) {
  const bodyId = locationBodies[locationId] ?? 'earth'
  const body = getSolBody(bodyId) ?? getSolBody('earth')
  const viewOptions = locationViewOverrides[locationId]

  return {
    ...createBodyView(body, viewOptions),
    id: locationId
  }
}