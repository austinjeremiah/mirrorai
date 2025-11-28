export interface Claim {
  id: string;
  text: string;
  category: string;
  confidence: number;
}

export interface DKGFact {
  subject: string;
  predicate: string;
  object: string;
  source: string;
  timestamp?: string;
}

export interface TruthScore {
  overallScore: number;
  claimScores: ClaimScore[];
  dkgFactsUsed: number;
  timestamp: string;
}

export interface ClaimScore {
  claim: Claim;
  score: number;
  matchedFacts: DKGFact[];
  reasoning: string;
}

export interface VerificationResult {
  postText: string;
  claims: Claim[];
  truthScore: TruthScore;
  pipelineHash: string;
  dkgAssetUAL: string;
  timestamp: string;
}
