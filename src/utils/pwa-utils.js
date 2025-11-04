// PWA Utilities for Gözcu Yazılım
export const PWAUtils = {
  // Check if PWA is installable
  isInstallable: () => {
    return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  },

  // Check if running on mobile
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Register service worker
  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered successfully:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  },

  // Show install prompt
  showInstallPrompt: () => {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show custom install button
      const installButton = document.getElementById('pwa-install-button');
      if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            } else {
              console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            installButton.style.display = 'none';
          });
        });
      }
    });

    // Track app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      // Track installation event
      if (window.gtag) {
        window.gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: 'App Installed'
        });
      }
    });
  },

  // Initialize PWA features
  init: async () => {
    await PWAUtils.registerServiceWorker();
    PWAUtils.showInstallPrompt();
    
    // Add to home screen for iOS
    PWAUtils.addToHomeScreenIOS();
  },

  // iOS Add to Home Screen
  addToHomeScreenIOS: () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;
    
    if (isIOS && !isInStandaloneMode) {
      // Show iOS install instructions
      const iosInstallBanner = document.getElementById('ios-install-banner');
      if (iosInstallBanner) {
        iosInstallBanner.style.display = 'block';
      }
    }
  },

  // Check if app is running in standalone mode
  isStandalone: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  },

  // Get app version
  getAppVersion: () => {
    return '1.0.0'; // Update this when you release new versions
  },

  // Update available notification
  showUpdateAvailable: () => {
    const updateBanner = document.getElementById('update-banner');
    if (updateBanner) {
      updateBanner.style.display = 'block';
    }
  },

  // Force update
  forceUpdate: () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
        });
      });
    }
    window.location.reload();
  }
};

// Auto-initialize PWA features
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    PWAUtils.init();
  });
}




