
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
    
    return data.text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
};
