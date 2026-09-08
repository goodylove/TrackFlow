import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from '@dr.pogodin/react-helmet'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import "./styles/index.css"
import App from './App.tsx'
import { queryClient } from './lib/query/query-client'
import { Toaster } from './components/ui/toaster'
import { AuthSessionProvider } from './feature/auth/auth-session-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthSessionProvider>
            <App />
          </AuthSessionProvider>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
