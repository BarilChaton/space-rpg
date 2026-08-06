import Scene from '../components/three/scene'
import { useBackground } from './backgroundContext'

const GameBackground = () => {
  const { mode, transition, currentSystemId, destinationSystemId } = useBackground()

  return (
    <div className="pointer-events-none fixed inset-0 z-1 bg-[#02030a]">
      <Scene mode={mode} transition={transition} currentSystemId={currentSystemId} destinationSystemId={destinationSystemId} />
    </div>
  )
}

export default GameBackground
