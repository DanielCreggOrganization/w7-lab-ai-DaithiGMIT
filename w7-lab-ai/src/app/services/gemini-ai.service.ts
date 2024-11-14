import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private readonly MODEL_NAME = 'gemini-1.5-flash';
  
  async getImageAsBase64(imageUrl: string): Promise<string> {
    // TODO: Move image conversion code here
    // HINT: Copy the code from your component that:
    // 1. Fetches the image
    const response = await fetch(imageUrl);
    // 2. Converts to blob
    const blob = await response.blob();
    // 3. Converts to base64
    const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    // 4. Returns the base64 string
    return base64data.split(',')[1];
  }

  async generateRecipe(imageBase64: string, prompt: string): Promise<string> {
    try {
      
      // TODO: Move AI generation code here
      // HINT: Copy the code that:
      // 1. Creates the AI client
      const genAI = new GoogleGenerativeAI(environment.apiKey);
      // 2. Gets the model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      // 3. Calls generateContent
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { 
              inlineData: { 
                mimeType: 'image/jpeg', 
                data: imageBase64
              } 
            },
            { text: prompt }
          ]
        }]
      });
      // 4. Returns the response text
      return result.response.text();
      
    } catch (error) {
      throw new Error('Failed to generate recipe');
    }
  }
}