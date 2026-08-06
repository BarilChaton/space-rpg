import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './auth/authProvider'
import BackgroundProvider from './background/BackgroundProvider'
import CommanderProvider from './commander/CommanderProvider'
import ShipProvider from './ship/shipProvider.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CommanderProvider>
        <ShipProvider>
          <BackgroundProvider>
            <App />
          </BackgroundProvider>
        </ShipProvider>
      </CommanderProvider>
    </AuthProvider>
  </BrowserRouter>
)
