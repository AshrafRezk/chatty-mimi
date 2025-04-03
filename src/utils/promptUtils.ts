
/**
 * Utility functions to enhance prompts for AI responses
 */

/**
 * Enhances a user's message with instructions for the AI to be more concise and direct
 * @param message - The original user message
 * @returns Enhanced message with instructions
 */
export function enhancePromptForConciseness(message: string, language: string = 'en'): string {
  const conciseInstructions = language === 'ar' 
    ? "كن مختصرًا ومباشرًا في إجابتك. قدم المعلومات المطلوبة بوضوح دون إطالة غير ضرورية."
    : "Be concise and direct in your response. Provide the requested information clearly without unnecessary elaboration.";
    
  return `${message}\n\n[${conciseInstructions}]`;
}

/**
 * Creates a system instruction to guide AI responses
 * @param persona - The AI persona type
 * @returns A system instruction string
 */
export function createSystemInstruction(persona: string, language: string = 'en'): string {
  const baseInstruction = language === 'ar'
    ? "قدم إجابات موجزة ومباشرة. تجنب المقدمات الطويلة والتفاصيل غير الضرورية. ركز على المعلومات الرئيسية المطلوبة."
    : "Provide succinct and direct answers. Avoid lengthy introductions and unnecessary details. Focus on the key information requested.";
    
  const personaInstructions: Record<string, string> = {
    'medicine': language === 'ar' 
      ? "قدم معلومات طبية دقيقة وموجزة." 
      : "Provide accurate and concise medical information.",
    'software': language === 'ar'
      ? "قدم حلولًا برمجية مباشرة وفعالة."
      : "Provide direct and effective programming solutions.",
    'real_estate': language === 'ar'
      ? "قدم تحليلات سوق العقارات بشكل موجز ومفيد."
      : "Provide concise and useful real estate market analyses."
  };
  
  return personaInstructions[persona] || baseInstruction;
}

export default {
  enhancePromptForConciseness,
  createSystemInstruction
};
