
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
);

// Register Service Worker for Ad Blocking
// Register Service Worker for Ad Blocking (Production Only)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const isDev = import.meta.env.DEV;
    
    // Always unregister existing SWs in dev to prevent conflicts
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for(let registration of registrations) {
        registration.unregister().then(() => {
          console.log('Unregistered SW for dev consistency');
        });
      }
      
      // Only register in production
      if (!isDev) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      }
    });
  });
}
