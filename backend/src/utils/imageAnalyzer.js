import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/constants.js';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function analyzeImage(base64Image, dictOfVars) {
    try {
        // Remove the data:image/png;base64, prefix if present
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You have been given an image to analyze. Please provide:
        1. A brief one-line description of what you see (keep it under 10 words)
        2. A detailed interpretation or analysis of the image

        If it's a mathematical expression or equation:
        - Include the solution in your detailed interpretation
        - If there are variable assignments, note them

        If it's a drawing or scene:
        - Describe the key elements, style, and any notable details
        - Provide context or meaning if apparent

        Return your analysis in this exact JSON format:
        [{
            "expr": "Brief one-line description",
            "result": "Detailed interpretation and analysis",
            "assign": false  // true only for variable assignments
        }]`;

        const result = await model.generateContent([
            { text: prompt },
            {
                inlineData: {
                    mimeType: 'image/png',
                    data: base64Data
                }
            }
        ]);

        const response = await result.response;
        console.log('Gemini response:', response.text());

        let answers = [];
        try {
            // Try to parse the response as JSON
            const text = response.text();
            const jsonMatch = text.match(/\[.*\]/s);
            if (jsonMatch) {
                answers = JSON.parse(jsonMatch[0]);
            } else {
                // If no JSON array found, create a simple interpretation
                answers = [{
                    expr: text,
                    result: "See expression for details",
                    assign: false
                }];
            }
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            // Create a fallback response
            answers = [{
                expr: response.text(),
                result: "Could not parse structured result",
                assign: false
            }];
        }

        // Ensure assign property exists and is boolean
        return answers.map(answer => ({
            ...answer,
            assign: Boolean(answer.assign)
        }));

    } catch (error) {
        console.error('Error in analyzeImage:', error);
        throw error;
    }
}