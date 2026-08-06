import { Navigate, Route, Routes } from 'react-router-dom'

import AuthDeepLinkHandler from './auth/AuthDeepLinkHandler'
import GameBackground from './background/GameBackground'
import CreateCommander from './pages/createCommander'
import MainMenu from './pages/mainMenu'
import Ship from './pages/ship'
import StationHub from './pages/stationHub'

function App() {
  return (
    <main className="relative h-dvh overflow-hidden bg-[#02030a]">
      <AuthDeepLinkHandler />

      <GameBackground />

      <div className="relative z-10 h-full">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/commander/new" element={<CreateCommander />} />
          <Route path="/game/station" element={<StationHub />} />
          <Route path="/game/ship" element={<Ship />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  )
}

export default App
