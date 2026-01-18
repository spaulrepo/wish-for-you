export enum AppStage {
  INTRO = 'INTRO',
  GAME_1 = 'GAME_1',
  QUOTE_1 = 'QUOTE_1',
  GAME_2 = 'GAME_2',
  QUOTE_2 = 'QUOTE_2',
  GAME_3 = 'GAME_3',
  QUOTE_3 = 'QUOTE_3',
  GAME_4 = 'GAME_4',
  QUOTE_4 = 'QUOTE_4',
  FINAL = 'FINAL'
}

export interface QuoteData {
  text: string;
  author: string;
}

export interface GameProps {
  onComplete: () => void;
}

// Static personalized quotes
export const BIRTHDAY_QUOTES: Record<string, QuoteData> = {
  MEMORIES: {
    text: "Memories are the threads that weave the tapestry of our lives. Today, we celebrate the beautiful story you’ve written so far and the amazing chapters yet to come.",
    author: ""
  },
  STRENGTH: {
    text: "Your strength isn't just in what you can carry, but in how you lift others up. You are a beacon of kindness and resilience, and you are cherished more than you know.",
    author: ""
  },
  LOVE: {
    text: "The world is a brighter place simply because you are in it. May your birthday be filled with the same warmth and love that you so freely give to everyone around you.",
    author: ""
  },
  JOURNEY: {
    text: "Life is a beautiful journey, and every year is a new horizon. Embrace the adventure ahead with your beautiful smile, knowing you have so many people cheering you on.",
    author: ""
  },
  // Fallback
  JOY: {
    text: "May your day be filled with the kind of joy that makes your cheeks hurt from smiling.",
    author: ""
  }
};

// export const FINAL_BIRTHDAY_NOTE = "Happy Birthday! I wanted to create something special just for you, to remind you of how wonderful you are. You bring so much joy to my life and to everyone who knows you. I hope your day is as magical as you are. Wishing you love, laughter, and dreams come true.";

export const FINAL_BIRTHDAY_NOTE = `Happy Birthday, my dearest soul-friend 🤍

Some people walk into our lives quietly and then, without us realizing it, become home. You are that person for me. Through laughter that healed, tears that were understood without words, and moments that felt too heavy to carry alone—you were always there, standing beside me with a heart full of love.

On your birthday, I want you to know how deeply grateful I am for you. For your kindness that never asks for anything in return. For your strength, even on days you don’t see it yourself. For the way you love so purely and show up so genuinely, making the world softer just by being in it.

You deserve a life filled with peace, happiness, and dreams that come true one by one. May this year bring you moments that make your heart smile, love that feels safe and deep, and success that finds you effortlessly. And on days when things feel overwhelming, I hope you remember you’re never alone—you have me, always.

Thank you for being my constant, my safe place, my forever friend. I’m so proud of the person you are and so lucky to walk through life with you.

Happy Birthday. May your heart feel as loved today as you make others feel every single day 💖`;
