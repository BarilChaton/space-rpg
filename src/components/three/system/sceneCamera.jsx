import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Quaternion, Vector3 } from 'three'

import { getSolLocationView } from '../../../data/solScene'

const ORIENTATION_DURATION = 0.9
const MIN_TRAVEL_DURATION = 3.5
const MAX_TRAVEL_DURATION = 8
const TRAVEL_SPEED = 24

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1)
}

function easeOutCubic(value) {
  const t = clamp01(value)
  return 1 - Math.pow(1 - t, 3)
}

function smootherstep(value) {
  const t = clamp01(value)
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function SceneCamera({ currentLocationId, destinationLocationId, transition, onTravelComplete }) {
  const { camera } = useThree()

  const phaseRef = useRef('idle')
  const elapsedRef = useRef(0)
  const travelDurationRef = useRef(MIN_TRAVEL_DURATION)

  const startPositionRef = useRef(new Vector3())
  const endPositionRef = useRef(new Vector3())
  const destinationTargetRef = useRef(new Vector3())
  const restingPositionRef = useRef(new Vector3())
  const restingTargetRef = useRef(new Vector3())

  const startQuaternionRef = useRef(new Quaternion())
  const endQuaternionRef = useRef(new Quaternion())

  const lookCameraRef = useRef(new PerspectiveCamera())
  const activeDestinationRef = useRef(null)

  useEffect(() => {
    if (transition !== 'traveling' || !destinationLocationId) return
    if (activeDestinationRef.current === destinationLocationId) return

    const destinationView = getSolLocationView(destinationLocationId)

    activeDestinationRef.current = destinationLocationId
    phaseRef.current = 'orienting'
    elapsedRef.current = 0

    startPositionRef.current.copy(camera.position)
    endPositionRef.current.set(...destinationView.cameraPosition)
    destinationTargetRef.current.set(...destinationView.cameraTarget)

    startQuaternionRef.current.copy(camera.quaternion)

    lookCameraRef.current.position.copy(camera.position)
    lookCameraRef.current.up.copy(camera.up)
    lookCameraRef.current.quaternion.copy(camera.quaternion)
    lookCameraRef.current.lookAt(destinationTargetRef.current)

    endQuaternionRef.current.copy(lookCameraRef.current.quaternion)
  }, [camera, destinationLocationId, transition])

  useEffect(() => {
    if (transition === 'traveling') return

    activeDestinationRef.current = null
    phaseRef.current = 'idle'
    elapsedRef.current = 0
  }, [transition])

  useFrame((_, delta) => {
    if (phaseRef.current === 'idle') {
      const currentView = getSolLocationView(currentLocationId)
      const smoothing = 1 - Math.exp(-delta * 3)

      restingPositionRef.current.set(...currentView.cameraPosition)

      const travelDistance = camera.position.distanceTo(endPositionRef.current)

      travelDurationRef.current = Math.min(Math.max(travelDistance / TRAVEL_SPEED, MIN_TRAVEL_DURATION), MAX_TRAVEL_DURATION)

      restingTargetRef.current.set(...currentView.cameraTarget)

      camera.position.lerp(restingPositionRef.current, smoothing)
      camera.lookAt(restingTargetRef.current)
      return
    }

    elapsedRef.current += delta

    if (phaseRef.current === 'orienting') {
      const progress = clamp01(elapsedRef.current / ORIENTATION_DURATION)
      const easedProgress = easeOutCubic(progress)

      camera.quaternion.slerpQuaternions(startQuaternionRef.current, endQuaternionRef.current, easedProgress)

      if (progress >= 1) {
        phaseRef.current = 'moving'
        elapsedRef.current = 0
        startPositionRef.current.copy(camera.position)
      }

      return
    }

    if (phaseRef.current === 'moving') {
      const progress = clamp01(elapsedRef.current / travelDurationRef.current)
      const easedProgress = smootherstep(progress)

      camera.position.lerpVectors(startPositionRef.current, endPositionRef.current, easedProgress)
      camera.lookAt(destinationTargetRef.current)

      if (progress >= 1) {
        camera.position.copy(endPositionRef.current)
        camera.lookAt(destinationTargetRef.current)

        phaseRef.current = 'complete'
        elapsedRef.current = 0

        onTravelComplete?.()
      }
    }
  })

  return null
}

export default SceneCamera
