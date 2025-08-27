'use client';

import { useEffect, useState, memo } from 'react';

// Desktop performance monitoring hook
export const useDesktopPerformance = () => {
  const [isHighEndDesktop, setIsHighEndDesktop] = useState(false);
  const [gpuAcceleration, setGpuAcceleration] = useState(false);
  const [memoryAvailable, setMemoryAvailable] = useState(0);
  const [cpuCores, setCpuCores] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    const checkDesktopCapabilities = () => {
      // Check for high-end desktop capabilities
      const memory = (navigator as any).deviceMemory || 8; // GB
      const cores = (navigator as any).hardwareConcurrency || 8;
      const isHighEnd = memory >= 8 && cores >= 4;
      
      setIsHighEndDesktop(isHighEnd);
      setMemoryAvailable(memory);
      setCpuCores(cores);

      // Check for GPU acceleration
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          setGpuAcceleration(renderer && !renderer.includes('Software'));
        }
      }
    };

    checkDesktopCapabilities();
  }, []);

  return { isHighEndDesktop, gpuAcceleration, memoryAvailable, cpuCores, isHydrated };
};

// Desktop-specific image component with high-res support
export const DesktopImage = memo(({ 
  src, 
  alt, 
  className = '', 
  highResSrc = '',
  fallback = '/placeholder.png' 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  highResSrc?: string;
  fallback?: string; 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { isHighEndDesktop } = useDesktopPerformance();

  useEffect(() => {
    // Use high-res image for desktop if available
    const finalSrc = isHighEndDesktop && highResSrc ? highResSrc : src;
    setImageSrc(finalSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src, highResSrc, isHighEndDesktop]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-700/50 rounded animate-pulse flex items-center justify-center">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
});

DesktopImage.displayName = 'DesktopImage';

// Desktop-optimized grid component
export const DesktopGrid = memo(({ 
  children, 
  columns = 4,
  gap = 6 
}: { 
  children: React.ReactNode; 
  columns?: number;
  gap?: number;
}) => {
  const { isHighEndDesktop } = useDesktopPerformance();
  
  const gridCols = isHighEndDesktop ? columns : Math.min(columns, 3);
  const gridGap = isHighEndDesktop ? gap : gap - 2;

  return (
    <div 
      className={`grid gap-${gridGap} grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols} xl:grid-cols-${columns}`}
      style={{
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        gap: `${gridGap * 0.25}rem`
      }}
    >
      {children}
    </div>
  );
});

DesktopGrid.displayName = 'DesktopGrid';

// Desktop performance warning component
export const DesktopPerformanceWarning = memo(({ 
  isHighEndDesktop, 
  gpuAcceleration,
  isHydrated 
}: { 
  isHighEndDesktop: boolean; 
  gpuAcceleration: boolean;
  isHydrated: boolean;
}) => {
  if (!isHydrated || (isHighEndDesktop && gpuAcceleration)) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-information-line text-blue-900 text-lg"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 text-sm mb-1">Performance Mode</h3>
            <p className="text-blue-800/90 text-xs">
              {!isHighEndDesktop && "Optimizing for your hardware. Some features may be limited."}
              {!gpuAcceleration && "Hardware acceleration not detected. Performance may be reduced."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

DesktopPerformanceWarning.displayName = 'DesktopPerformanceWarning';

// Desktop-specific animations
export const useDesktopAnimations = () => {
  const { isHighEndDesktop } = useDesktopPerformance();
  
  return {
    animationClass: isHighEndDesktop ? 'animate-fade-in' : 'opacity-100',
    transitionDuration: isHighEndDesktop ? 'duration-300' : 'duration-200',
    hoverScale: isHighEndDesktop ? 'hover:scale-105' : 'hover:scale-102',
    blurEffect: isHighEndDesktop ? 'backdrop-blur-md' : 'backdrop-blur-sm'
  };
};

// Desktop keyboard shortcuts
export const useDesktopShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Trigger search functionality
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + / for help
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        // Show help modal
        console.log('Help shortcut triggered');
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        const modals = document.querySelectorAll('[data-modal]');
        modals.forEach(modal => {
          if (modal.classList.contains('opacity-100')) {
            modal.classList.remove('opacity-100', 'pointer-events-auto');
            modal.classList.add('opacity-0', 'pointer-events-none');
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Desktop hover effects
export const useDesktopHover = () => {
  const { isHighEndDesktop } = useDesktopPerformance();
  
  return {
    hoverClass: isHighEndDesktop ? 'hover:shadow-2xl hover:scale-105' : 'hover:shadow-lg hover:scale-102',
    transitionClass: isHighEndDesktop ? 'transition-all duration-300 ease-out' : 'transition-all duration-200',
    glowClass: isHighEndDesktop ? 'hover:shadow-cyan-500/25' : 'hover:shadow-cyan-500/10'
  };
};

// Desktop scroll optimizations
export const useDesktopScroll = () => {
  useEffect(() => {
    const { isHighEndDesktop } = useDesktopPerformance();
    
    if (isHighEndDesktop) {
      // Enable smooth scrolling for desktop
      document.documentElement.style.scrollBehavior = 'smooth';
      
      // Add custom scrollbar styles for desktop
      const style = document.createElement('style');
      style.textContent = `
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
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
};

// Desktop context menu
export const useDesktopContextMenu = () => {
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      // Prevent default context menu on specific elements
      const target = event.target as HTMLElement;
      if (target.closest('[data-no-context-menu]')) {
        event.preventDefault();
        return;
      }

      // Custom context menu for interactive elements
      if (target.closest('[data-context-menu]')) {
        event.preventDefault();
        // Show custom context menu
        console.log('Custom context menu triggered');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);
};

// Desktop drag and drop
export const useDesktopDragDrop = () => {
  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer!.dropEffect = 'copy';
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer!.files;
      if (files.length > 0) {
        // Handle file drop
        console.log('Files dropped:', files);
      }
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);
};

// Desktop performance monitoring
export const useDesktopPerformanceMonitoring = () => {
  useEffect(() => {
    const { isHighEndDesktop } = useDesktopPerformance();
    
    if (isHighEndDesktop) {
      // Monitor frame rate
      let frameCount = 0;
      let lastTime = performance.now();
      
      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          if (fps < 30) {
            console.warn('Low frame rate detected:', fps);
          }
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
      };
      
      requestAnimationFrame(measureFPS);
      
      // Monitor memory usage
      const memoryInterval = setInterval(() => {
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
          
          if (usagePercent > 80) {
            console.warn('High memory usage detected:', usagePercent.toFixed(1) + '%');
          }
        }
      }, 10000);
      
      return () => {
        clearInterval(memoryInterval);
      };
    }
  }, []);
};

// Main DesktopOptimizer component
const DesktopOptimizer = () => {
  const { isHighEndDesktop, gpuAcceleration, isHydrated } = useDesktopPerformance();
  
  useEffect(() => {
    // Only apply optimizations after hydration
    if (!isHydrated) return;
    
    // Apply desktop-specific optimizations
    if (isHighEndDesktop) {
      // Enable hardware acceleration
      document.body.style.transform = 'translateZ(0)';
      document.body.style.willChange = 'auto';
      
      // Add desktop-specific classes
      document.body.classList.add('desktop-optimized');
      
      // Monitor performance
      useDesktopPerformanceMonitoring();
      
      // Enable scroll optimizations
      useDesktopScroll();
      
      // Enable keyboard shortcuts
      useDesktopShortcuts();
      
      // Enable context menu
      useDesktopContextMenu();
      
      // Enable drag and drop
      useDesktopDragDrop();
    }
  }, [isHighEndDesktop, isHydrated]);

  return (
    <>
      <DesktopPerformanceWarning 
        isHighEndDesktop={isHighEndDesktop} 
        gpuAcceleration={gpuAcceleration}
        isHydrated={isHydrated}
      />
    </>
  );
};

export default DesktopOptimizer; 