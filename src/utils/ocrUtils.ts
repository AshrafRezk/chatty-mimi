
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
 * Comprehensive analysis of an image file - combines OCR and visual analysis
 * @param file The image file to process
 * @returns An object containing both text and visual analysis results
 */
export const smartSightAnalysis = async (file: File): Promise<{text: string, caption: string}> => {
  // Process both OCR and image analysis in parallel
  const [extractedText, imageCaption] = await Promise.all([
    extractTextFromImage(file).catch(err => {
      console.error("OCR failed:", err);
      return "";
    }),
    analyzeImage(file).catch(err => {
      console.error("Image analysis failed:", err);
      return "";
    })
  ]);
  
  return {
    text: extractedText.trim(),
    caption: imageCaption.trim()
  };
};
