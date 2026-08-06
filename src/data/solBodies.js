export const solBodies = {
  sun: {
    id: 'sun',
    name: 'Sol',
    type: 'star',
    position: [-400, 40, -150],
    radius: 14,
    intensity: 1000000
  },

  earth: {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    position: [0, 0, 0],
    radius: 3.4
  },

  luna: {
    id: 'luna',
    name: 'Luna',
    type: 'moon',
    parentBodyId: 'earth',
    position: [28, 3, -10],
    radius: 1.1
  },

  mars: {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    position: [310, -28, -62],
    radius: 2.1
  }
}

export function getSolBody(bodyId) {
  return solBodies[bodyId] ?? null
}