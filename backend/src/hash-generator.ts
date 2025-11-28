import * as crypto from 'crypto';
import { Claim, DKGFact, TruthScore } from './types';

export class HashGenerator {
  generatePipelineHash(
    postText: string,
    claims: Claim[],
    dkgFacts: DKGFact[],
    truthScore: TruthScore
  ): string {
    const pipelineData = {
      postText,
      claims: claims.map(c => c.text),
      dkgFactsCount: dkgFacts.length,
      truthScore: truthScore.overallScore,
      timestamp: truthScore.timestamp,
      modelVersion: 'MirrorAI-v1.0',
    };

    const dataString = JSON.stringify(pipelineData);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  generateDKGAssetMetadata(hash: string, truthScore: TruthScore) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FactCheck',
      verificationHash: hash,
      truthScore: truthScore.overallScore,
      claimsAnalyzed: truthScore.claimScores.length,
      dkgFactsUsed: truthScore.dkgFactsUsed,
      timestamp: truthScore.timestamp,
      verifiedBy: 'MirrorAI',
    };
  }
}
