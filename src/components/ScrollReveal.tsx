import React, { useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useScroll';
import { cn } from '../lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in-up' | 'slide-in-left' | 'slide-in-right' | 'fade-in';
  delay?: number;
  threshold?: number;
  rootMargin?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isIntersecting, hasIntersected } = useIntersectionObserver(elementRef, {
    threshold,
    rootMargin,
  });

  const animationClasses = {
    'fade-in-up': 'animate-fade-in-up',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'fade-in': 'animate-fade-in',
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700 ease-out',
        !hasIntersected && 'opacity-0 translate-y-8',
        hasIntersected && 'opacity-100 translate-y-0',
        animationClasses[animation],
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
