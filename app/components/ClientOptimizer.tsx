'use client';

import { useEffect, useState } from 'react';

// Client-side optimizer to prevent hydration mismatches
const ClientOptimizer = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after component mounts
    setIsHydrated(true);

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
          }
        }, 0);
      });
    }
    
    // Memory usage monitoring
    if ('memory' in performance) {
      setInterval(function() {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
          console.warn('High memory usage detected');
        }
      }, 30000);
    }
    
    // Connection monitoring
    if ('connection' in navigator) {
      const connection = navigator.connection;
      connection.addEventListener('change', function() {
        console.log('Connection changed:', connection.effectiveType);
      });
    }
    
    // Desktop-specific optimizations
    const isDesktop = window.innerWidth >= 1024 && window.innerHeight >= 768;
    
    if (isDesktop) {
      // Enable hardware acceleration
      document.body.style.transform = 'translateZ(0)';
      document.body.style.willChange = 'auto';
      
      // Optimize for desktop performance
      const style = document.createElement('style');
      style.textContent = `
        /* Desktop-specific optimizations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Smooth scrolling for desktop */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar for desktop */
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 6px;
          border: 2px solid rgba(31, 41, 55, 0.3);
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #0891b2, #2563eb);
        }
        
        /* Enhanced hover effects for desktop */
        .desktop-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .desktop-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* GPU acceleration for animations */
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* High-quality backdrop blur for desktop */
        .desktop-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `;
      document.head.appendChild(style);
      
      // Monitor frame rate for desktop
      let frameCount = 0;
      let lastTime = performance.now();
      
      function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          if (fps < 30) {
            console.warn('Low frame rate detected on desktop:', fps);
          }
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
      }
      
      requestAnimationFrame(measureFPS);
    }

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
          .then(function(registration) {
            console.log('SW registered: ', registration);
          })
          .catch(function(registrationError) {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  // Don't render anything during SSR
  if (!isHydrated) {
    return null;
  }

  return null;
};

export default ClientOptimizer; 