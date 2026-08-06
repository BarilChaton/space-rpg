export const starSystems = {
  sol: {
    id: 'sol',
    name: 'Sol',
    discovered: true,
    handcrafted: true
  }
}

export function getStarSystem(systemId) {
  return starSystems[systemId] ?? null
}