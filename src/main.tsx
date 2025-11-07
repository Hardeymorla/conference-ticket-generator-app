import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './components/context/UsersProvider.tsx'
import { EventsProvider } from './components/context/EventsProvider.tsx'
import { BookingsProvider } from './components/context/BookingsProvider.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventsProvider>
          <BookingsProvider>
            < App />
          </BookingsProvider>
        </EventsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
