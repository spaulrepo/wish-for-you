import { QuoteData, BIRTHDAY_QUOTES, FINAL_BIRTHDAY_NOTE } from "../types";

// Service now returns static, curated content for the birthday gift
export const generateQuote = async (theme: string): Promise<QuoteData> => {
  // Simulating a small delay for better UX pacing
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const key = theme.toUpperCase();
  return BIRTHDAY_QUOTES[key] || BIRTHDAY_QUOTES['JOY'];
};

export const generateFinalNote = async (): Promise<string> => {
  // Simulating a small delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return FINAL_BIRTHDAY_NOTE;
};
