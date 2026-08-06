import Scene from '../components/three/scene'
import { useBackground } from './backgroundContext'

function GameBackground() {
  const { currentLocationId, destinationLocationId, transition, completeTravel } = useBackground()

  return (
    <div className="pointer-events-none fixed inset-0 z-1 bg-[#02030a]">
      <Scene
        currentLocationId={currentLocationId}
        destinationLocationId={destinationLocationId}
        transition={transition}
        onTravelComplete={completeTravel}
      />
    </div>
  )
}

export default GameBackground
