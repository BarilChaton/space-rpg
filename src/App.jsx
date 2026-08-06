import { Navigate, Route, Routes } from 'react-router-dom'
import AuthDeepLinkHandler from './auth/AuthDeepLinkHandler'
import MainMenu from './pages/mainMenu'
import CreateCommander from './pages/createCommander'
import Ship from './pages/ship'
import StationHub from './pages/stationHub'

function App() {
  return (
    <>
      <AuthDeepLinkHandler />

      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/commander/new" element={<CreateCommander />} />
        <Route path="/game/station" element={<StationHub />} />
        <Route path="/game/ship" element={<Ship />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
