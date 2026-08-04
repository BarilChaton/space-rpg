import { Navigate, Route, Routes } from 'react-router-dom'
import MainMenu from './pages/mainMenu'
import CreateCommander from './pages/createCommander'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/commander/new" element={<CreateCommander />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
