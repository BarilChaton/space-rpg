import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './auth/authProvider'
import CommanderProvider from './commander/CommanderProvider'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CommanderProvider>
        <App />
      </CommanderProvider>
    </AuthProvider>
  </BrowserRouter>
)
