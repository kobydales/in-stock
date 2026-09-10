import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// iOS Safari's edge-swipe-back gesture is a system-level recognizer that
// triggers on any touch starting near the left edge of the screen — it's
// separate from CSS touch-action/overscroll-behavior and isn't stopped by
// them. Because the mobile sidebar sits `position: fixed` at that same
// edge, the gesture's page-peel animation can reveal it mid-swipe. The
// only reliable fix is to preventDefault() the touch before Safari's
// recognizer claims it, which we do only for touches starting in a thin
// strip (20px) along the left edge so normal scrolling elsewhere is
// untouched.
const EDGE_SWIPE_ZONE_PX = 20
document.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches[0]?.clientX < EDGE_SWIPE_ZONE_PX) {
      e.preventDefault()
    }
  },
  { passive: false }
)

// Register the service worker so the app shell can install and load a
// usable screen when offline. Skipped in dev by default since Vite's dev
// server and a caching service worker can fight each other; it activates
// automatically once you build and serve the production bundle.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service worker registration failed:', err)
    })
  })
}
