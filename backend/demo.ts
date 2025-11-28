import { MirrorAI } from './src/index';

async function demo() {
  console.log('🪞 MirrorAI Demo - Truth Verification System\n');
  console.log('=' .repeat(60));
  
  const mirrorAI = new MirrorAI();
  
  // Test Case 1: Crypto Facts
  console.log('\n📝 Test Case 1: Cryptocurrency Facts');
  console.log('-'.repeat(60));
  const test1 = "Ethereum transitioned to proof-of-stake in September 2022. Bitcoin remains on proof-of-work.";
  console.log(`Input: "${test1}"\n`);
  
  try {
    const result1 = await mirrorAI.verifyPost(test1);
    console.log(`\n✅ Truth Score: ${result1.truthScore.overallScore}/100`);
    console.log(`📊 Claims Found: ${result1.claims.length}`);
    console.log(`🔗 DKG Facts Used: ${result1.truthScore.dkgFactsUsed}`);
    console.log(`🔐 Hash: ${result1.pipelineHash.substring(0, 32)}...`);
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test Case 2: Mixed Claims
  console.log('\n\n📝 Test Case 2: Mixed Historical Claims');
  console.log('-'.repeat(60));
  const test2 = "The moon landing happened in 1969. The Earth is flat.";
  console.log(`Input: "${test2}"\n`);
  
  try {
    const result2 = await mirrorAI.verifyPost(test2);
    console.log(`\n✅ Truth Score: ${result2.truthScore.overallScore}/100`);
    console.log(`📊 Claims Found: ${result2.claims.length}`);
    console.log(`🔗 DKG Facts Used: ${result2.truthScore.dkgFactsUsed}`);
    console.log(`🔐 Hash: ${result2.pipelineHash.substring(0, 32)}...`);
    
    if (result2.claims.length > 0) {
      console.log('\n📋 Detailed Claim Scores:');
      result2.truthScore.claimScores.forEach((cs, idx) => {
        console.log(`  ${idx + 1}. "${cs.claim.text}"`);
        console.log(`     Score: ${cs.score}/100`);
        console.log(`     Reasoning: ${cs.reasoning}`);
      });
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Demo Complete!\n');
}

if (require.main === module) {
  demo().catch(console.error);
}
