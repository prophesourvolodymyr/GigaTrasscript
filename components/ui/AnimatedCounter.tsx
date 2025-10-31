'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatValue?: (value: number) => string;
}

/**
 * Animated counter with rolling wheel effect
 * Numbers roll up like a slot machine
 */
export default function AnimatedCounter({
  value,
  duration = 2000,
  className = '',
  formatValue = (v) => v.toString(),
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Only animate once when value first becomes available
    if (value === 0 || hasAnimated) {
      setDisplayValue(value);
      return;
    }

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    // Ease-out exponential for smooth deceleration
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing
      const easedProgress = easeOutExpo(progress);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, hasAnimated]);

  const formattedValue = formatValue(displayValue);
  const digits = formattedValue.split('');

  return (
    <span className={`inline-flex ${className}`}>
      {digits.map((digit, index) => (
        <span
          key={index}
          className={`inline-block ${isAnimating ? 'animate-roll-in' : ''}`}
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          {digit}
        </span>
      ))}
      <style jsx>{`
        @keyframes roll-in {
          0% {
            transform: translateY(100%) rotateX(90deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-10%) rotateX(-10deg);
          }
          100% {
            transform: translateY(0) rotateX(0);
            opacity: 1;
          }
        }
        .animate-roll-in {
          animation: roll-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: center bottom;
        }
      `}</style>
    </span>
  );
}
