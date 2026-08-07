import Earth from '../planets/earth'
import TexturedBody from '../planets/texturedBody'
import Sun from '../sun/sun'

import { solBodies } from '../../../data/solBodies'

function SolSystem() {
  const sun = solBodies.sun
  const earth = solBodies.earth
  const luna = solBodies.luna
  const mars = solBodies.mars

  return (
    <>
      <Sun position={sun.position} radius={sun.radius} intensity={sun.intensity} />

      <Earth position={earth.position} radius={earth.radius} rotationSpeed={0.012} />

      <TexturedBody position={luna.position} radius={luna.radius} texturePath="/textures/2k_moon.jpg" rotationSpeed={0.004} roughness={1} />

      <TexturedBody
        position={mars.position}
        radius={mars.radius}
        texturePath="/textures/2k_mars.jpg"
        rotationSpeed={0.009}
        roughness={0.92}
      />
    </>
  )
}

export default SolSystem
