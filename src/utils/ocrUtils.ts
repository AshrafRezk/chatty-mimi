
import Tesseract from 'tesseract.js';

/**
 * Extracts text from an image or PDF file using OCR
 * @param file The file to process
 * @returns The extracted text
 */
export const extractTextFromImage = async (file: File): Promise<string> => {
  try {
    // Create URL for the file
    const fileURL = URL.createObjectURL(file);
    
    // Use Tesseract.js for OCR
    const { data } = await Tesseract.recognize(
      fileURL,
      'eng', // Default language, can be extended to support multiple languages
      {
        logger: (m) => {
          console.debug(`OCR Progress: ${m.status} ${(m.progress * 100).toFixed(2)}%`);
        }
      }
    );
    
    // Clean up the URL object
    URL.revokeObjectURL(fileURL);
    
    // Clean up the extracted text to make it more useful
    const cleanedText = cleanExtractedText(data.text);
    
    return cleanedText;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
};

/**
 * Cleans up extracted OCR text to make it more useful
 * @param text Raw OCR text
 * @returns Cleaned text
 */
const cleanExtractedText = (text: string): string => {
  // Basic cleaning - remove excess whitespace
  let cleaned = text.replace(/\s+/g, ' ').trim();
  
  // Remove very common OCR errors and symbols that are likely errors
  cleaned = cleaned.replace(/[^\w\s.,;:!?"'()[\]{}\-–—+*/=<>@#$%&|\\^`~©®™]/g, '');
  
  // Remove lines with too many special characters (likely gibberish)
  const lines = cleaned.split('\n');
  const cleanedLines = lines.filter(line => {
    const specialCharCount = (line.match(/[^\w\s.,;:!?"'()]/g) || []).length;
    const textLength = line.trim().length;
    return textLength > 0 && (specialCharCount / textLength < 0.3);
  });
  
  // Join lines back together
  cleaned = cleanedLines.join('\n');
  
  // If the cleaned text is too short or appears to be garbage, return a more friendly message
  if (cleaned.length < 10 || isGibberish(cleaned)) {
    return "Unable to extract meaningful text from this image.";
  }
  
  return cleaned;
};

/**
 * Simple check for gibberish text
 * @param text Text to check
 * @returns True if the text appears to be gibberish
 */
const isGibberish = (text: string): boolean => {
  // Check for too many unusual character combinations
  const unusualCombos = (text.match(/[^a-zA-Z0-9\s]{2,}/g) || []).length;
  
  // Check for coherent words
  const wordMatch = text.match(/\b[a-zA-Z]{3,}\b/g);
  const wordCount = wordMatch ? wordMatch.length : 0;
  
  // If there are very few actual words but lots of text, it's likely gibberish
  const totalLength = text.length;
  
  return (unusualCombos > 5) || (totalLength > 30 && wordCount < 3);
};

/**
 * Analyzes an image using Hugging Face's image captioning model
 * @param file The image file to analyze
 * @returns The caption describing the image
 */
export const analyzeImage = async (file: File): Promise<string> => {
  try {
    // Convert file to base64
    const base64Image = await fileToBase64(file);
    
    // Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: base64Image })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // The API returns an array of caption objects
    if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      return result[0].generated_text;
    }
    
    return "Unable to analyze the image content.";
  } catch (error) {
    console.error('Image analysis error:', error);
    return "Unable to analyze the image content.";
  }
};

/**
 * Converts a file to base64 encoding
 * @param file The file to convert
 * @returns Base64 encoded string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Extract the base64 part (remove the data:image/xyz;base64, prefix)
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Processes an image file based on the selected analysis type
 * @param file The image file to process
 * @param analysisType The type of analysis to perform
 * @returns The result of the analysis
 */
export const processImageFile = async (file: File, analysisType: "extractText" | "analyzeImage" | null): Promise<string> => {
  if (!analysisType) return "";
  
  try {
    if (analysisType === "extractText") {
      return await extractTextFromImage(file);
    } else if (analysisType === "analyzeImage") {
      return await analyzeImage(file);
    }
    return "";
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};
