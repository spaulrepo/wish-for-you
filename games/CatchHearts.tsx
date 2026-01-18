import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../types';

interface Heart {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export const CatchHearts: React.FC<GameProps> = ({ onComplete }) => {
  const [basketX, setBasketX] = useState(50);
  const basketXRef = useRef(50); // Ref for immediate game loop access

  const [hearts, setHearts] = useState<Heart[]>([]);
  const heartsRef = useRef<Heart[]>([]); // Ref for game loop state

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0); // Ref for game loop score

  const TARGET = 10;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    
    setBasketX(percentage);
    basketXRef.current = percentage;
  };

  // Game Loop
  useEffect(() => {
    let animationId: number;
    
    // Initialize first heart
    heartsRef.current = [{
       id: Math.random(),
       x: Math.random() * 90 + 5,
       y: 0,
       speed: Math.random() * 0.5 + 0.5
    }];
    setHearts([...heartsRef.current]);

    const update = () => {
      if (scoreRef.current >= TARGET) {
         return; 
      }

      let currentHearts = heartsRef.current;
      let scoreChanged = false;

      // 1. Move
      currentHearts = currentHearts.map(h => ({ ...h, y: h.y + h.speed }));

      // 2. Collision & Bounds
      currentHearts = currentHearts.filter(h => {
        // Collision Logic
        if (h.y > 85 && h.y < 95 && Math.abs(h.x - basketXRef.current) < 10) {
          scoreRef.current += 1;
          scoreChanged = true;
          return false; // Caught
        }
        return h.y < 100; // Remove if off screen
      });

      // 3. Spawn only if empty (One at a time)
      if (currentHearts.length === 0 && scoreRef.current < TARGET) {
         currentHearts.push({
           id: Math.random(),
           x: Math.random() * 90 + 5,
           y: -15, // Start slightly above
           speed: Math.random() * 0.6 + 0.6 // Slightly faster pace
         });
      }

      // Update refs and state
      heartsRef.current = currentHearts;
      setHearts(currentHearts);
      
      if (scoreChanged) {
        setScore(scoreRef.current);
      }

      animationId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationId);
  }, []); // Empty dependency array ensures loop doesn't restart on state changes

  useEffect(() => {
    if (score >= TARGET) {
      setTimeout(onComplete, 500);
    }
  }, [score, onComplete]);

  return (
    <div 
      className="relative w-full h-[60vh] bg-indigo-950 rounded-3xl overflow-hidden touch-none cursor-crosshair"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <div className="absolute top-4 right-4 text-white font-bold bg-white/20 px-4 py-1 rounded-full z-10">
        Love Caught: {score}/{TARGET}
      </div>

      {hearts.map(h => (
        <div 
          key={h.id}
          className="absolute text-3xl will-change-transform"
          style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translateX(-50%)' }}
        >
          💖
        </div>
      ))}

      {/* Basket */}
      <div 
        className="absolute bottom-4 w-20 h-10 bg-rose-500 rounded-b-2xl rounded-t-sm border-4 border-rose-300 shadow-lg flex items-center justify-center transition-none will-change-transform"
        style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-16 h-1 bg-rose-200/50 rounded-full mt-1"></div>
      </div>
      
      <div className="absolute bottom-1 w-full text-center text-indigo-200 text-xs opacity-50 pointer-events-none">
        Slide to catch the heart
      </div>
    </div>
  );
};