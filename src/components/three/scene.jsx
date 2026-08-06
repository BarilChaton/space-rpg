import { Canvas } from '@react-three/fiber'

import SceneCamera from './system/sceneCamera'
import SolSystem from './system/solSystem'
import Starfield from './stars/starfield'

function Scene({ currentLocationId, destinationLocationId, transition, onTravelComplete }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 7],
        fov: 48,
        near: 0.1,
        far: 5000
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance'
      }}>
      <color attach="background" args={['#02030a']} />

      <ambientLight intensity={0.025} color="#607087" />

      <directionalLight position={[8, 4, 10]} intensity={0.08} color="#607a98" />

      <Starfield seed={4812} backgroundCount={7000} mediumCount={1000} brightCount={110} />

      <SolSystem />

      <SceneCamera
        currentLocationId={currentLocationId}
        destinationLocationId={destinationLocationId}
        transition={transition}
        onTravelComplete={onTravelComplete}
      />
    </Canvas>
  )
}

export default Scene
