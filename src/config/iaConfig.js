import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

export const client = new OpenAI({
  apiKey,
  baseURL: 'https://api.groq.com/openai/v1'
});