export const solSystem = {
  id: 'sol',
  name: 'Sol',
  starType: 'G-type main-sequence star',
  locations: [
    {
      id: 'gateway',
      name: 'Gateway Station',
      shortName: 'Gateway',
      type: 'station',
      parentBody: 'earth',
      distanceLabel: 'Current location',
      description: 'Humanity’s primary interstellar transit and commercial hub.',
      available: true
    },
    {
      id: 'earth',
      name: 'Earth',
      shortName: 'Earth',
      type: 'planet',
      distanceLabel: 'Low orbit transfer',
      description: 'Humanity’s homeworld and political centre of the inner colonies.',
      available: false
    },
    {
      id: 'luna',
      name: 'Luna',
      shortName: 'Luna',
      type: 'moon',
      distanceLabel: '384,400 km',
      description: 'A heavily industrialised moon supporting shipyards, mines and research centres.',
      available: true
    },
    {
      id: 'mars',
      name: 'Mars',
      shortName: 'Mars',
      type: 'planet',
      distanceLabel: 'Variable transfer distance',
      description: 'Humanity’s oldest independent planetary colony.',
      available: true
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      shortName: 'Jupiter',
      type: 'planet',
      distanceLabel: 'Outer-system route',
      description: 'A major centre for fuel harvesting and scientific operations.',
      available: false
    },
    {
      id: 'jump-gate-alpha',
      name: 'Jump Gate Alpha',
      shortName: 'Gate Alpha',
      type: 'jump-gate',
      distanceLabel: 'Outer Sol',
      description: 'The primary interstellar departure point from the Sol system.',
      available: false
    }
  ]
}

export function getSolLocation(locationId) {
  return solSystem.locations.find(location => location.id === locationId) ?? null
}