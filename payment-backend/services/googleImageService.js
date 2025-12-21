/**
 * Google Gemini Image Generation Service
 * Uses Google's Imagen model via the Generative AI SDK
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the client with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Generate an image using Google Gemini Imagen
 * @param {string} prompt - The image generation prompt
 * @returns {Promise<{success: boolean, imageUrl?: string, error?: string}>}
 */
async function generateImage(prompt) {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    console.log('[GoogleImageService] Generating image with prompt:', prompt.substring(0, 100) + '...');

    // Use Imagen 3 model for image generation
    const model = genAI.getGenerativeModel({ 
      model: "imagen-3.0-generate-002"
    });

    const result = await model.generateImages({
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
        safetyFilterLevel: "BLOCK_MEDIUM_AND_ABOVE"
      }
    });

    if (result.images && result.images.length > 0) {
      const image = result.images[0];
      
      // Convert to base64 data URL
      const base64Data = image.bytesBase64Encoded;
      const mimeType = image.mimeType || 'image/png';
      const imageUrl = `data:${mimeType};base64,${base64Data}`;
      
      console.log('[GoogleImageService] Image generated successfully');
      return { success: true, imageUrl };
    }

    throw new Error('No images returned from Imagen API');

  } catch (error) {
    console.error('[GoogleImageService] Error generating image:', error.message);
    
    // Handle specific error cases
    if (error.message.includes('API_KEY')) {
      return { success: false, error: 'Invalid or missing Google AI API key' };
    }
    
    if (error.message.includes('quota') || error.message.includes('rate')) {
      return { success: false, error: 'API quota exceeded. Please try again later.' };
    }
    
    if (error.message.includes('safety') || error.message.includes('blocked')) {
      return { success: false, error: 'Image generation blocked due to safety filters' };
    }

    return { success: false, error: error.message };
  }
}

/**
 * Build an optimized prompt for educational image generation
 * @param {string} type - Type of image (DIAGRAM, FLOW, EXPLANATION, EXAMPLE)
 * @param {string} topic - Topic name
 * @param {string} details - Detailed description
 * @returns {string} Optimized prompt
 */
function buildEducationalPrompt(type, topic, details) {
  const baseStyle = 'Professional, clean, educational style. High quality, 4K resolution.';
  
  switch (type.toUpperCase()) {
    case 'DIAGRAM':
      return `Educational diagram showing ${topic}. ${details}. Clean labeled diagram with clear visual hierarchy, minimal text, visual representation on white background. ${baseStyle}`;
    
    case 'FLOW':
      return `Flowchart or process flow diagram for ${topic}. ${details}. Clear arrows showing direction, labeled steps, professional educational style on light background. ${baseStyle}`;
    
    case 'EXPLANATION':
      return `Visual explanation of ${topic}. ${details}. Infographic style with clear visual elements, educational and engaging. ${baseStyle}`;
    
    case 'EXAMPLE':
      return `Visual example illustrating ${topic}. ${details}. Clear realistic illustration showing a practical example in educational context. ${baseStyle}`;
    
    default:
      return `Educational illustration about ${topic}. ${details}. Professional, clean, suitable for learning. ${baseStyle}`;
  }
}

module.exports = {
  generateImage,
  buildEducationalPrompt
};
