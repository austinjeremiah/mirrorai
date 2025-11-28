import OpenAI from 'openai';
import { Claim, DKGFact, TruthScore, ClaimScore } from './types';

export class TruthScorer {
  private client: OpenAI;

  constructor(apiKey: string, baseURL: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
    });
  }

  async calculateTruthScore(
    claims: Claim[],
    dkgFacts: Map<string, DKGFact[]>
  ): Promise<TruthScore> {
    const claimScores: ClaimScore[] = [];

    for (const claim of claims) {
      const relatedFacts = dkgFacts.get(claim.id) || [];
      const score = await this.scoreIndividualClaim(claim, relatedFacts);
      claimScores.push(score);
    }

    const overallScore = this.calculateOverallScore(claimScores);

    return {
      overallScore,
      claimScores,
      dkgFactsUsed: Array.from(dkgFacts.values()).flat().length,
      timestamp: new Date().toISOString(),
    };
  }

  private async scoreIndividualClaim(
    claim: Claim,
    facts: DKGFact[]
  ): Promise<ClaimScore> {
    if (facts.length === 0) {
      return {
        claim,
        score: 50, // Neutral score when no evidence
        matchedFacts: [],
        reasoning: 'No DKG evidence found for verification',
      };
    }

    const prompt = `Given the claim: "${claim.text}"
    And the following facts from DKG:
    ${facts.map(f => `- ${f.subject} ${f.predicate} ${f.object}`).join('\n')}
    
    Score this claim from 0-100 based on factual accuracy.
    Return ONLY a JSON object: {"score": number, "reasoning": "brief explanation"}`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'asi1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a fact-checking expert. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"score": 50, "reasoning": "Unable to verify"}');

      return {
        claim,
        score: result.score,
        matchedFacts: facts,
        reasoning: result.reasoning,
      };
    } catch (error) {
      console.error('Scoring error:', error);
      return {
        claim,
        score: 50,
        matchedFacts: facts,
        reasoning: 'Error during verification',
      };
    }
  }

  private calculateOverallScore(claimScores: ClaimScore[]): number {
    if (claimScores.length === 0) return 50;

    const sum = claimScores.reduce((acc, cs) => acc + cs.score, 0);
    return Math.round(sum / claimScores.length);
  }
}
