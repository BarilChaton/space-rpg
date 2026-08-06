export const stations = {
  gateway: {
    id: 'gateway',
    name: 'Gateway Station',
    shortName: 'Gateway',
    systemId: 'sol',
    orbiting: 'Earth',
    type: 'Interstellar Transit Hub',
    description:
      'Humanity’s oldest interstellar port and the primary commercial gateway between Earth and the surrounding colonies.'
  }
}

export function getStation(stationId) {
  return stations[stationId] ?? null
}