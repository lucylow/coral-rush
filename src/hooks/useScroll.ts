import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  progress: number;
}

interface UseScrollOptions {
  throttleMs?: number;
  passive?: boolean;
}

export const useScroll = (options: UseScrollOptions = {}) => {
  const { throttleMs = 16, passive = true } = options;
  
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: null,
    progress: 0,
  });

  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    const direction = scrollTop > lastScrollY ? 'down' : 'up';
    
    setScrollPosition({
      x: scrollLeft,
      y: scrollTop,
      direction: scrollTop !== lastScrollY ? direction : null,
      progress: Math.min(100, Math.max(0, progress)),
    });
    
    setLastScrollY(scrollTop);
  }, [lastScrollY]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const throttledHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(handleScroll, throttleMs);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll, throttleMs, passive]);

  return scrollPosition;
};

export const useScrollToTop = () => {
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, []);

  return scrollToTop;
};

export const useScrollToElement = () => {
  const scrollToElement = useCallback((
    elementId: string, 
    options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
  ) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView(options);
    }
  }, []);

  return scrollToElement;
};

export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
};
