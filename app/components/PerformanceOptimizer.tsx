'use client';

import { useEffect, useState, memo } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow' | 'unknown'>('unknown');

  useEffect(() => {
    // Detect low-end devices
    const checkDeviceCapabilities = () => {
      const memory = (navigator as any).deviceMemory || 4; // GB
      const cores = (navigator as any).hardwareConcurrency || 4;
      const isLowEnd = memory < 4 || cores < 4;
      setIsLowEndDevice(isLowEnd);
    };

    // Detect connection speed
    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
          setConnectionSpeed('slow');
        } else if (effectiveType === '3g' || downlink < 5) {
          setConnectionSpeed('slow');
        } else {
          setConnectionSpeed('fast');
        }
      } else {
        setConnectionSpeed('unknown');
      }
    };

    checkDeviceCapabilities();
    checkConnectionSpeed();

    // Listen for connection changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', checkConnectionSpeed);
    }

    return () => {
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', checkConnectionSpeed);
      }
    };
  }, []);

  return { isLowEndDevice, connectionSpeed };
};

// Optimized image component
export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  fallback = '/placeholder.png' 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  fallback?: string; 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

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
          <div className="loading-spinner w-6 h-6"></div>
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

OptimizedImage.displayName = 'OptimizedImage';

// Lazy loading component
export const LazyLoad = memo(({ 
  children, 
  threshold = 0.1 
}: { 
  children: React.ReactNode; 
  threshold?: number; 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, threshold]);

  return (
    <div ref={setRef} className={isVisible ? 'animate-fade-in' : 'opacity-0'}>
      {isVisible ? children : (
        <div className="h-32 bg-gray-700/50 rounded animate-pulse"></div>
      )}
    </div>
  );
});

LazyLoad.displayName = 'LazyLoad';

// Debounced input component
export const DebouncedInput = memo(({ 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  delay = 300 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string; 
  className?: string; 
  delay?: number; 
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, onChange, delay, value]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className={`input-mobile ${className}`}
    />
  );
});

DebouncedInput.displayName = 'DebouncedInput';

// Virtual scroll component for large lists
export const VirtualList = memo(({ 
  items, 
  itemHeight = 60, 
  containerHeight = 400,
  renderItem 
}: { 
  items: any[]; 
  itemHeight: number; 
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode; 
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      className="scrollbar-thin"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualList.displayName = 'VirtualList';

// Performance warning component
export const PerformanceWarning = memo(({ 
  isLowEndDevice, 
  connectionSpeed 
}: { 
  isLowEndDevice: boolean; 
  connectionSpeed: 'fast' | 'slow' | 'unknown'; 
}) => {
  if (!isLowEndDevice && connectionSpeed !== 'slow') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm rounded-2xl mobile-padding border border-yellow-400/30 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-information-line text-yellow-900 text-lg"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mobile-text mb-1">Performance Mode</h3>
            <p className="text-yellow-800/90 text-xs sm:text-sm">
              {isLowEndDevice && connectionSpeed === 'slow' && 
                "Optimizing for your device and connection speed. Some animations may be reduced."}
              {isLowEndDevice && connectionSpeed !== 'slow' && 
                "Optimizing for your device. Some animations may be reduced."}
              {!isLowEndDevice && connectionSpeed === 'slow' && 
                "Optimizing for your connection speed. Images may load slower."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

PerformanceWarning.displayName = 'PerformanceWarning';

// Preload critical resources
export const usePreloadResources = (resources: string[]) => {
  useEffect(() => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      link.href = resource;
      document.head.appendChild(link);
    });
  }, [resources]);
};

// Memory management hook
export const useMemoryOptimization = () => {
  useEffect(() => {
    const cleanup = () => {
      // Clear any cached data that's not needed
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('temp') || name.includes('cache')) {
              caches.delete(name);
            }
          });
        });
      }
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Periodic cleanup
    const interval = setInterval(cleanup, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      clearInterval(interval);
    };
  }, []);
};

// Main PerformanceOptimizer component
const PerformanceOptimizer = () => {
  const { isLowEndDevice, connectionSpeed } = usePerformanceMonitor();
  
  useEffect(() => {
    // Apply performance optimizations based on device capabilities
    if (isLowEndDevice) {
      // Reduce animations for low-end devices
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
      document.documentElement.style.setProperty('--transition-duration', '0.15s');
    }
    
    // Apply memory optimization
    useMemoryOptimization();
    
    // Preload critical resources
    usePreloadResources([
      '/fonts/inter-var.woff2',
      'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css'
    ]);
  }, [isLowEndDevice]);

  return (
    <>
      <PerformanceWarning 
        isLowEndDevice={isLowEndDevice} 
        connectionSpeed={connectionSpeed} 
      />
    </>
  );
};

export { PerformanceOptimizer }; 