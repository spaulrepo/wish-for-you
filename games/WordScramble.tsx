import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { GameProps } from '../types';

const WORDS = [
  { scrambled: 'YARPT', answer: 'PARTY' },
  { scrambled: 'EMSLI', answer: 'SMILE' },
  { scrambled: 'GIFT', answer: 'GIFT' }, // Simple
  { scrambled: 'PHEYAP', answer: 'HAPPY' },
  { scrambled: 'KCEA', answer: 'CAKE' }
];

export const WordScramble: React.FC<GameProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const currentWord = WORDS[currentIdx];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase().trim() === currentWord.answer) {
      if (currentIdx < WORDS.length - 1) {
        setInput('');
        setCurrentIdx(prev => prev + 1);
      } else {
        onComplete();
      }
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setError(false);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold text-rose-600 mb-2">Game 2: Unscramble Joy</h2>
      <p className="text-slate-600 mb-8">Unscramble the birthday words!</p>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full border border-rose-100">
        <div className="text-sm text-slate-400 mb-2">Word {currentIdx + 1} of {WORDS.length}</div>
        <div className="text-4xl font-bold tracking-widest text-indigo-600 mb-8 font-mono">
          {currentWord.scrambled}
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full p-4 text-center text-xl border-2 rounded-xl focus:outline-none transition-colors ${
              error ? 'border-red-400 bg-red-50' : 'border-rose-200 focus:border-rose-400'
            } ${shake ? 'animate-bounce' : ''}`}
            placeholder="Type answer..."
            autoFocus
          />
          <Button type="submit" className="w-full">Next Word</Button>
        </form>
      </div>
    </div>
  );
};