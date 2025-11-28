import * as dotenv from 'dotenv';
import { ClaimExtractor } from './claim-extractor';
import { DKGQuerier } from './dkg-query';
import { TruthScorer } from './truth-scorer';
import { HashGenerator } from './hash-generator';
import { VerificationResult, DKGFact } from './types';

dotenv.config();

export class MirrorAI {
  private claimExtractor: ClaimExtractor;
  private dkgQuerier: DKGQuerier;
  private truthScorer: TruthScorer;
  private hashGenerator: HashGenerator;

  constructor() {
    const apiKey = process.env.ASI_API_KEY || '';
    const baseURL = process.env.ASI_BASE_URL || 'https://api.asi1.ai/v1';

    this.claimExtractor = new ClaimExtractor(apiKey, baseURL);
    this.dkgQuerier = new DKGQuerier();
    this.truthScorer = new TruthScorer(apiKey, baseURL);
    this.hashGenerator = new HashGenerator();
  }

  async verifyPost(postText: string): Promise<VerificationResult> {
    console.log('🔍 Step 1: Extracting claims...');
    const claims = await this.claimExtractor.extractClaims(postText);
    console.log(`✅ Found ${claims.length} claims`);

    console.log('\n🔍 Step 2: Querying DKG for facts...');
    const dkgFactsMap = new Map<string, DKGFact[]>();
    
    for (const claim of claims) {
      const facts = await this.dkgQuerier.queryRelatedFacts(claim.text);
      dkgFactsMap.set(claim.id, facts);
    }
    const totalFacts = Array.from(dkgFactsMap.values()).flat().length;
    console.log(`✅ Retrieved ${totalFacts} DKG facts`);

    console.log('\n🔍 Step 3: Calculating truth score...');
    const truthScore = await this.truthScorer.calculateTruthScore(claims, dkgFactsMap);
    console.log(`✅ Truth Score: ${truthScore.overallScore}/100`);

    console.log('\n🔍 Step 4: Generating pipeline hash...');
    const allFacts = Array.from(dkgFactsMap.values()).flat();
    const pipelineHash = this.hashGenerator.generatePipelineHash(
      postText,
      claims,
      allFacts,
      truthScore
    );
    console.log(`✅ Hash: ${pipelineHash.substring(0, 16)}...`);

    console.log('\n🔍 Step 5: Publishing to DKG...');
    const ual = await this.dkgQuerier.publishVerification(
      pipelineHash,
      truthScore.overallScore,
      postText
    );

    return {
      postText,
      claims,
      truthScore,
      pipelineHash,
      dkgAssetUAL: ual || 'Not published (insufficient tokens or network issue)',
      timestamp: new Date().toISOString(),
    } as unknown as VerificationResult;
  }
}

// Test function
async function test() {
  const mirrorAI = new MirrorAI();
  
  const testPost = "Ethereum transitioned to proof-of-stake in September 2022. Bitcoin remains on proof-of-work.";
  
  console.log('🚀 Testing MirrorAI\n');
  console.log('=' .repeat(60));
  
  const result = await mirrorAI.verifyPost(testPost);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULT:\n');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n' + '='.repeat(60));
}

if (require.main === module) {
  test().catch(console.error);
}