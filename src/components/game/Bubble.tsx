import { memo, useState, useEffect } from 'react';
import { Bubble as BubbleType } from '@/types/game';

interface BubbleProps {
  bubble: BubbleType;
  onExpire: (id: string) => void;
}

export const BubbleComponent = memo(({ bubble, onExpire }: BubbleProps) => {
  const [isPopping, setIsPopping] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const size = 60 + Math.random() * 20; // Random size between 60-80px

  useEffect(() => {
    const timeLeft = bubble.duration - (Date.now() - bubble.createdAt);
    
    // Start fade animation before removal
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, Math.max(0, timeLeft - 300));

    return () => clearTimeout(fadeTimer);
  }, [bubble.duration, bubble.createdAt]);

  const colorClass = `bubble-${bubble.color}`;
  const animationClass = isPopping ? 'bubble-pop' : isFading ? 'bubble-fade' : '';

  return (
    <div
      className={`bubble ${colorClass} ${animationClass}`}
      style={{
        left: bubble.x,
        top: bubble.y,
        width: size,
        height: size,
        fontSize: size * 0.45,
        '--bubble-duration': `${bubble.duration}ms`,
      } as React.CSSProperties}
    >
      {bubble.char}
    </div>
  );
});

BubbleComponent.displayName = 'BubbleComponent';
