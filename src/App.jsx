import { Navigate, Route, Routes } from 'react-router-dom'

import AuthDeepLinkHandler from './auth/AuthDeepLinkHandler'
import GameBackground from './background/GameBackground'
import { useBackground } from './background/backgroundContext'
import CreateCommander from './pages/createCommander'
import MainMenu from './pages/mainMenu'
import Navigation from './pages/navigation'
import Ship from './pages/ship'
import StationHub from './pages/stationHub'

function App() {
  const { interfaceVisible } = useBackground()

  return (
    <main className="relative h-dvh overflow-hidden bg-[#02030a]">
      <AuthDeepLinkHandler />
      <GameBackground />

      <div
        className={`relative z-10 h-full transition-opacity duration-300 ${
          interfaceVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/commander/new" element={<CreateCommander />} />
          <Route path="/game/station" element={<StationHub />} />
          <Route path="/game/ship" element={<Ship />} />
          <Route path="/game/navigation" element={<Navigation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  )
}

export default App
