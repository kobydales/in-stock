import { useState, useEffect } from 'react'

// Captures the browser's install prompt (Chrome/Edge/Android) so we can
// trigger it from our own styled button instead of waiting for a browser
// mini-infobar. Returns null on browsers that don't support this (notably
// iOS Safari, which has no install-prompt API — there, "Add to Home
// Screen" is a manual step from the browser's Share menu).
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    function handleAppInstalled() {
      setInstalled(true)
      setDeferredPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return { canInstall: Boolean(deferredPrompt) && !installed, promptInstall }
}

// Detects iOS Safari specifically. iOS has no beforeinstallprompt API at
// all — "Add to Home Screen" only exists as a manual step in the Share
// sheet — so we show instructions there instead of a button that will
// simply never appear.
export function useIsIOSInstallable() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
  return isIOS && !isStandalone
}
