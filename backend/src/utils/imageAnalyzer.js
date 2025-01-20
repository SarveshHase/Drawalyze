// src/utils/imageAnalyzer.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/constants.js';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function analyzeImage(base64Image, dictOfVars) {
    try {
        // Remove the data:image/png;base64, prefix if present
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You have been given an image with some mathematical expressions, equations, or graphical problems, and you need to solve them. 
      Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). Parentheses have the highest priority, followed by Exponents, then Multiplication and Division, and lastly Addition and Subtraction. 

      YOU CAN HAVE FIVE TYPES OF EQUATIONS/EXPRESSIONS IN THIS IMAGE, AND ONLY ONE CASE SHALL APPLY EVERY TIME: 
      Following are the cases: 
      1. Simple mathematical expressions like 2 + 2, 3 * 4, 5 / 6, 7 - 8, etc.: In this case, solve and return the answer in the format of a LIST OF ONE DICT [{"expr": given expression, "result": calculated answer}]. 
      2. Set of Equations like x^2 + 2x + 1 = 0, 3y + 4x = 0, 5x^2 + 6y + 7 = 12, etc.: In this case, solve for the given variable, and the format should be a COMMA SEPARATED LIST OF DICTS, with dict 1 as {"expr": "x", "result": 2, "assign": true} and dict 2 as {"expr": "y", "result": 5, "assign": true}. 
      3. Assigning values to variables like x = 4, y = 5, z = 6, etc.: In this case, assign values to variables and return another key in the dict called {"assign": true}, keeping the variable as "expr" and the value as "result" in the original dictionary. RETURN AS A LIST OF DICTS. 
      4. Analyzing Graphical Math problems, which are word problems represented in drawing form. You need to return the answer in the format of a LIST OF ONE DICT [{"expr": given expression, "result": calculated answer}]. 
      5. Detecting Abstract Concepts that a drawing might show, such as love, hate, jealousy, patriotism, etc. USE THE SAME FORMAT AS OTHERS TO RETURN THE ANSWER, where "expr" will be the explanation of the drawing, and "result" will be the abstract concept. 

      Here is a dictionary of user-assigned variables to use if needed: ${JSON.stringify(dictOfVars)}

      Please analyze the image and return the answer in the specified format. Make sure to return a valid JSON array of objects.`;

        const result = await model.generateContent([
            {
                text: prompt,
            },
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