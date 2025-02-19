import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || '4000';
export const ENV = process.env.NODE_ENV || 'dev';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
