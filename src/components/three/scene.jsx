import { Canvas } from '@react-three/fiber'

import Planet from './planet/planet'
import Starfield from './stars/starfield'
import Sun from './sun/sun'

function Scene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 7],
        fov: 48,
        near: 0.1,
        far: 200
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance'
      }}>
      <color attach="background" args={['#02030a']} />

      <ambientLight intensity={0.13} color="#718297" />

      <directionalLight position={[-4, 2, 6]} intensity={0.8} color="#7f98b2" />

      <directionalLight position={[1, 2, -4]} intensity={3} color="#ffb25c" />

      <Starfield seed={4812} backgroundCount={7000} mediumCount={1000} brightCount={110} />

      <Sun position={[-0.85, 2.15, -1.7]} intensity={4.2} />

      <Planet position={[3.45, -1.5, 0]} radius={3.4} rotationSpeed={0.012} />
    </Canvas>
  )
}

export default Scene
