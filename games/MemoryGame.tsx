import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { GameProps } from '../types';

const EMOJIS = ['🎂', '🎁', '💖', '🌟', '😊', '🎉'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<GameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Duplicate emojis to make pairs and shuffle
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(deck);
  }, []);

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    const cardIndex = cards.findIndex(c => c.id === id);
    if (cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      checkForMatch(newFlipped, newCards);
    }
  };

  const checkForMatch = (flippedIds: number[], currentCards: Card[]) => {
    const [firstId, secondId] = flippedIds;
    const firstCard = currentCards.find(c => c.id === firstId)!;
    const secondCard = currentCards.find(c => c.id === secondId)!;

    if (firstCard.emoji === secondCard.emoji) {
      setTimeout(() => {
        const newCards = currentCards.map(c => 
          c.id === firstId || c.id === secondId 
            ? { ...c, isMatched: true, isFlipped: true } 
            : c
        );
        setCards(newCards);
        setFlippedCards([]);
        setIsLocked(false);
        
        if (newCards.every(c => c.isMatched)) {
          setTimeout(onComplete, 1000);
        }
      }, 500);
    } else {
      setTimeout(() => {
        const newCards = currentCards.map(c => 
          c.id === firstId || c.id === secondId 
            ? { ...c, isFlipped: false } 
            : c
        );
        setCards(newCards);
        setFlippedCards([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-rose-600 mb-6">Game 1: Sweet Memories</h2>
      <p className="text-center text-slate-600 mb-4">Find all the matching pairs!</p>
      
      <div className="grid grid-cols-4 gap-3 w-full">
        {cards.map(card => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square relative cursor-pointer perspective-1000`}
          >
            <div className={`w-full h-full duration-500 transform-style-3d transition-all ${card.isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front (Hidden) */}
              <div className="absolute inset-0 w-full h-full bg-rose-200 rounded-xl backface-hidden flex items-center justify-center border-2 border-rose-300 shadow-sm">
                <span className="text-2xl opacity-50">?</span>
              </div>
              {/* Back (Revealed) */}
              <div className="absolute inset-0 w-full h-full bg-white rounded-xl backface-hidden rotate-y-180 flex items-center justify-center border-2 border-rose-400 shadow-md">
                <span className="text-3xl">{card.emoji}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};