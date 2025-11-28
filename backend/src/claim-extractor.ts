import OpenAI from 'openai';
import { Claim } from './types';
import * as crypto from 'crypto';

export class ClaimExtractor {
  private client: OpenAI;

  constructor(apiKey: string, baseURL: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
    });
  }

  async extractClaims(text: string): Promise<Claim[]> {
    const prompt = `Extract all factual claims from the following text. 
    Return ONLY a JSON array of claims in this exact format:
    [{"text": "claim text", "category": "fact/statistic/event/person"}]
    
    Text: ${text}
    
    Extract claims that can be verified as true or false. Ignore opinions.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'asi1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a factual claim extraction expert. Return only valid JSON arrays.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content || '[]';
      const parsedClaims = JSON.parse(content);

      return parsedClaims.map((claim: any) => ({
        id: crypto.randomUUID(),
        text: claim.text,
        category: claim.category || 'general',
        confidence: 0.8,
      }));
    } catch (error) {
      console.error('Claim extraction error:', error);
      return [];
    }
  }
}
