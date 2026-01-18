import React, { useState, useEffect } from 'react';
import { AppStage, QuoteData } from './types';
import { generateQuote, generateFinalNote } from './services/geminiService';
import { Button } from './components/Button';
import { Confetti } from './components/Confetti';
import { MemoryGame } from './games/MemoryGame';
import { BalloonPop } from './games/BalloonPop';
import { CatchHearts } from './games/CatchHearts';
import { SimonSays } from './games/SimonSays';

export default function App() {
  const [stage, setStage] = useState<AppStage>(AppStage.INTRO);
  const [currentQuote, setCurrentQuote] = useState<QuoteData | null>(null);
  const [finalNote, setFinalNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper to transition to quote
  const handleGameComplete = async (nextStage: AppStage, theme: string) => {
    setIsLoading(true);
    // Add small delay for UX
    await new Promise(r => setTimeout(r, 800));
    
    const quote = await generateQuote(theme);
    setCurrentQuote(quote);
    setStage(nextStage);
    setIsLoading(false);
  };

  // Helper to transition to next game
  const handleNextLevel = (nextGameStage: AppStage) => {
    setStage(nextGameStage);
    setCurrentQuote(null);
  };

  // Helper for final stage
  const handleFinal = async () => {
    setIsLoading(true);
    const note = await generateFinalNote();
    setFinalNote(note);
    setStage(AppStage.FINAL);
    setIsLoading(false);
  };

  // Helper to restart the app
  const handleRestart = () => {
    setStage(AppStage.INTRO);
    setFinalNote('');
    setCurrentQuote(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mb-4"></div>
          <p className="text-rose-400 font-medium">Preparing a surprise...</p>
        </div>
      );
    }

    switch (stage) {
      case AppStage.INTRO:
        return (
          <div className="text-center px-6">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-orange-400 mb-8 drop-shadow-sm">
              Happy<br/>Birthday!
            </h1>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-md mx-auto">
              I've prepared a small journey for you. Four little challenges to celebrate how amazing you are.
              Are you ready?
            </p>
            <Button size="lg" onClick={() => setStage(AppStage.GAME_1)}>
              Start Journey ✨
            </Button>
          </div>
        );

      case AppStage.GAME_1:
        return <MemoryGame onComplete={() => handleGameComplete(AppStage.QUOTE_1, "MEMORIES")} />;
      
      case AppStage.QUOTE_1:
        return <QuoteView quote={currentQuote} onNext={() => handleNextLevel(AppStage.GAME_2)} />;

      case AppStage.GAME_2:
        return <BalloonPop onComplete={() => handleGameComplete(AppStage.QUOTE_2, "STRENGTH")} />;

      case AppStage.QUOTE_2:
        return <QuoteView quote={currentQuote} onNext={() => handleNextLevel(AppStage.GAME_3)} />;

      case AppStage.GAME_3:
        return <CatchHearts onComplete={() => handleGameComplete(AppStage.QUOTE_3, "LOVE")} />;

      case AppStage.QUOTE_3:
        return <QuoteView quote={currentQuote} onNext={() => handleNextLevel(AppStage.GAME_4)} />;
        
      case AppStage.GAME_4:
        return <SimonSays onComplete={() => handleGameComplete(AppStage.QUOTE_4, "JOURNEY")} />;

      case AppStage.QUOTE_4:
        return <QuoteView quote={currentQuote} onNext={handleFinal} isLast />;

      case AppStage.FINAL:
        return (
          <div className="text-center px-6 max-w-lg mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-rose-600 mb-6">Congratulations! 🎉</h1>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-rose-100 transform transition-all hover:scale-105 duration-500 w-full">
               <p className="text-xl text-slate-700 italic leading-loose font-serif">
                 "{finalNote}"
               </p>
            </div>
            <div className="mt-6 text-sm text-rose-400 mb-8">
               Created with ❤️ just for you.
            </div>
            <Button onClick={handleRestart} variant="secondary">
              Play Again
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-100 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {stage === AppStage.FINAL && <Confetti />}

      <div className="z-10 w-full flex justify-center">
        {renderContent()}
      </div>
    </div>
  );
}

const QuoteView: React.FC<{ quote: QuoteData | null, onNext: () => void, isLast?: boolean }> = ({ quote, onNext, isLast }) => {
  if (!quote) return null;

  return (
    <div className="max-w-md w-full text-center px-4 animate-[fadeIn_1s_ease-out]">
      <div className="mb-8 text-6xl text-rose-300 font-serif">"</div>
      <h3 className="text-2xl md:text-3xl font-medium text-slate-800 leading-normal mb-12 font-serif">
        {quote.text}
      </h3>
      {/* Author removed as requested */}
      
      <Button onClick={onNext} size="lg" className="animate-bounce">
        {isLast ? "Open Gift 🎁" : "Next Chapter ➜"}
      </Button>
    </div>
  );
}