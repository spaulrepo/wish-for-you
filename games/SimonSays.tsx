import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { GameProps } from '../types';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const WIN_SEQUENCE_LENGTH = 5;

export const SimonSays: React.FC<GameProps> = ({ onComplete }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [message, setMessage] = useState("Watch the sequence!");

  const addNewColor = () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence(prev => [...prev, color]);
  };

  useEffect(() => {
    if (sequence.length === 0) {
      setTimeout(addNewColor, 1000);
    }
  }, []);

  useEffect(() => {
    if (sequence.length > 0) {
      playSequence();
    }
  }, [sequence]);

  const playSequence = async () => {
    setIsPlayingSequence(true);
    setUserStep(0);
    setMessage(`Level ${sequence.length}/${WIN_SEQUENCE_LENGTH}`);
    
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(null);
    }
    
    setIsPlayingSequence(false);
    setMessage("Your turn!");
  };

  const handleColorClick = (color: string) => {
    if (isPlayingSequence) return;

    // Flash the clicked color briefly
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    if (color === sequence[userStep]) {
      if (userStep === sequence.length - 1) {
        if (sequence.length === WIN_SEQUENCE_LENGTH) {
            setMessage("You Win!");
            setTimeout(onComplete, 1000);
        } else {
            setMessage("Correct! Get ready...");
            setTimeout(addNewColor, 1000);
        }
      } else {
        setUserStep(prev => prev + 1);
      }
    } else {
      setMessage("Oops! Try again.");
      setSequence([]); // Reset
      setTimeout(() => {
        addNewColor(); // Start over
      }, 1000);
    }
  };

  const getColorClass = (color: string) => {
    const base = "w-24 h-24 rounded-2xl transition-all duration-200 transform active:scale-95 shadow-lg border-b-4";
    const isActive = activeColor === color;
    
    switch(color) {
      case 'red': return `${base} bg-red-500 border-red-700 ${isActive ? 'brightness-150 scale-105 shadow-red-500/50' : 'opacity-80'}`;
      case 'blue': return `${base} bg-blue-500 border-blue-700 ${isActive ? 'brightness-150 scale-105 shadow-blue-500/50' : 'opacity-80'}`;
      case 'green': return `${base} bg-green-500 border-green-700 ${isActive ? 'brightness-150 scale-105 shadow-green-500/50' : 'opacity-80'}`;
      case 'yellow': return `${base} bg-yellow-400 border-yellow-600 ${isActive ? 'brightness-150 scale-105 shadow-yellow-400/50' : 'opacity-80'}`;
      default: return base;
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-rose-600 mb-2">Game 4: Harmony</h2>
      <p className="text-xl font-medium text-slate-700 mb-8 h-8">{message}</p>
      
      <div className="grid grid-cols-2 gap-4 bg-slate-100 p-6 rounded-3xl shadow-inner">
        {COLORS.map(color => (
          <button
            key={color}
            className={getColorClass(color)}
            onClick={() => handleColorClick(color)}
            disabled={isPlayingSequence}
          />
        ))}
      </div>
    </div>
  );
};