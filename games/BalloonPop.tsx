import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../types';

interface Balloon {
  id: number;
  x: number;
  y: number; // percentage from top
  speed: number;
  color: string;
  popped: boolean;
}

const COLORS = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];

export const BalloonPop: React.FC<GameProps> = ({ onComplete }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const TARGET_SCORE = 10;
  const [gameLoop, setGameLoop] = useState<number | null>(null);

  // Spawn balloons
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (score >= TARGET_SCORE) return;
      
      setBalloons(prev => {
        if (prev.length > 8) return prev; // Limit concurrent balloons
        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10, // 10% to 90% width
            y: 110, // Start below screen
            speed: Math.random() * 0.5 + 0.3,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            popped: false
          }
        ];
      });
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [score]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      setBalloons(prev => {
        const next = prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -20 && !b.popped); // Remove if off screen or popped
        
        return next;
      });
      animationFrameId = requestAnimationFrame(loop);
    };
    
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (score >= TARGET_SCORE) {
      setTimeout(onComplete, 1000);
    }
  }, [score, onComplete]);

  const popBalloon = (id: number) => {
    setBalloons(prev => {
      // Prevent double counting if user clicks multiple times fast
      if (!prev.find(b => b.id === id)) return prev;
      setScore(s => s + 1);
      return prev.filter(b => b.id !== id);
    });
  };

  return (
    <div className="relative w-full h-[60vh] overflow-hidden bg-sky-100 rounded-3xl shadow-inner border-4 border-sky-200 touch-none select-none">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
        <span className="font-bold text-slate-700">Pop Count: {score}/{TARGET_SCORE}</span>
      </div>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
        <span className="text-6xl font-black text-sky-800">GAME 2</span>
      </div>

      {balloons.map(balloon => (
        <div
          key={balloon.id}
          onPointerDown={(e) => {
            e.preventDefault();
            popBalloon(balloon.id);
          }}
          className={`absolute w-16 h-20 rounded-[50%] ${balloon.color} cursor-pointer hover:brightness-110 active:scale-90 transition-transform shadow-lg opacity-90`}
          style={{
            left: `${balloon.x}%`,
            top: `${balloon.y}%`,
          }}
        >
          {/* Balloon string */}
          <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-400/50"></div>
          {/* Shine */}
          <div className="absolute top-3 left-3 w-3 h-6 bg-white/30 rounded-[50%] -rotate-45"></div>
        </div>
      ))}
      
      {score >= TARGET_SCORE && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Popped!</h1>
         </div>
      )}
    </div>
  );
};