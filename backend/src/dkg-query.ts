import DKG from 'dkg.js';
import { DKGFact } from './types';

export class DKGQuerier {
  private dkg: any;
  private isInitialized: boolean = false;

  constructor() {
    try {
      const useLocalNode = process.env.USE_LOCAL_DKG === 'true';
      
      if (useLocalNode) {
        console.log('🏠 Using local DKG Edge Node...');
        this.dkg = new DKG({
          endpoint: process.env.DKG_ENDPOINT || 'http://localhost',
          port: parseInt(process.env.DKG_PORT || '8900'),
          blockchain: {
            name: 'otp:20430',
            publicKey: process.env.PUBLISH_WALLET_PUBLIC_KEY || '0xa2B4C8bc641d95eED7dCfFfA49bf289d96aaB32a',
            privateKey: process.env.PUBLISH_WALLET_PRIVATE_KEY || '0xab812b7a70a6caea64c65c472f93c0bcc716527ff556ab0f59cfb38597330de2',
          },
        });
      } else {
        console.log('🌐 Using OriginTrail DKG Gateway...');
        this.dkg = new DKG({
          endpoint: 'https://dkg-testnet.origintrail.io',
          port: 8900,
          blockchain: {
            name: 'otp:20430',
            publicKey: process.env.PUBLISH_WALLET_PUBLIC_KEY || '0xa2B4C8bc641d95eED7dCfFfA49bf289d96aaB32a',
            privateKey: process.env.PUBLISH_WALLET_PRIVATE_KEY || '0xab812b7a70a6caea64c65c472f93c0bcc716527ff556ab0f59cfb38597330de2',
          },
        });
      }
      this.isInitialized = true;
      console.log('✅ DKG Client initialized');
    } catch (error) {
      console.error('⚠️ DKG initialization error:', error);
      this.isInitialized = false;
    }
  }

  async queryRelatedFacts(claimText: string): Promise<DKGFact[]> {
    // Note: DKG v8+ requires actual UALs to query specific assets
    // For demo purposes, we'll use mock data that represents what would come from DKG
    // In production, you would:
    // 1. Have pre-indexed UALs of fact-checking databases
    // 2. Use this.dkg.asset.get(ual) to retrieve specific knowledge assets
    // 3. Parse the returned RDF/JSON-LD data
    
    const keywords = this.extractKeywords(claimText);
    console.log(`🔍 Querying DKG for: ${keywords.join(', ')}`);

    if (!this.isInitialized) {
      console.log('⚠️ DKG not initialized, using demo data');
      return this.getMockDKGFacts(claimText);
    }

    try {
      // In production, you would query a DKG-indexed fact database
      // Example: const factAsset = await this.dkg.asset.get('did:dkg:otp/0x.../123');
      // For now, we simulate what the DKG would return
      
      console.log('📊 Using enhanced demo data (production would query indexed UALs)');
      return this.getMockDKGFacts(claimText);
    } catch (error) {
      console.error('❌ DKG query error:', error);
      console.log('📊 Using demo data as fallback');
      return this.getMockDKGFacts(claimText);
    }
  }

  async publishVerification(hash: string, truthScore: number, postText: string): Promise<string | null> {
    if (!this.isInitialized) {
      console.log('⚠️ Cannot publish - DKG not initialized');
      return null;
    }

    try {
      // Simplified asset structure for v8
      const assetData = {
        public: {
          '@context': 'https://schema.org',
          '@type': 'FactCheck',
          name: 'MirrorAI Verification',
          description: postText.substring(0, 200),
          hash: hash,
          score: truthScore,
          timestamp: new Date().toISOString(),
        },
      };

      console.log('📤 Publishing verification to DKG...');
      console.log('📝 Asset data:', JSON.stringify(assetData, null, 2));
      
      const result = await this.dkg.asset.create(assetData, {
        epochsNum: 2,
      });

      console.log('📦 DKG Response:', result);

      if (result && result.UAL) {
        console.log(`✅ Published to DKG! UAL: ${result.UAL}`);
        return result.UAL;
      } else if (result) {
        console.log('⚠️ Result received:', JSON.stringify(result));
        return null;
      } else {
        console.log('⚠️ No result from DKG');
        return null;
      }
    } catch (error: any) {
      console.error('❌ DKG publish error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      
      if (error.message?.includes('ENOTFOUND')) {
        console.log('💡 Network issue: Check your internet connection');
      } else if (error.message?.includes('insufficient') || error.message?.includes('balance')) {
        console.log('💡 Insufficient tokens: Check TRAC/NEURO balance');
        console.log('💡 Wallet:', process.env.PUBLISH_WALLET_PUBLIC_KEY);
      } else if (error.response) {
        console.log('💡 API Error:', error.response.status, error.response.data);
      } else {
        console.log('💡 Publishing skipped - system works without DKG publication');
      }
      
      return null;
    }
  }

  private extractKeywords(text: string): string[] {
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'to', 'in', 'and'];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 3);
  }

  private parseDKGResults(results: any[]): DKGFact[] {
    return results.slice(0, 5).map((row: any) => ({
      subject: row.s?.value || row.subject || 'DKG_Asset',
      predicate: row.p?.value || row.predicate || 'relatesTo',
      object: row.o?.value || row.object || 'Knowledge',
      source: 'OriginTrail DKG Testnet',
      timestamp: new Date().toISOString(),
    }));
  }

  private getMockDKGFacts(claimText: string): DKGFact[] {
    const keywords = this.extractKeywords(claimText);
    
    return [
      {
        subject: `dkg:asset:${keywords[0] || 'verification'}`,
        predicate: 'schema:about',
        object: claimText.substring(0, 60),
        source: 'OriginTrail DKG (Demo Data)',
        timestamp: new Date().toISOString(),
      },
      {
        subject: `dkg:knowledge:${Date.now()}`,
        predicate: 'schema:relatedTo',
        object: keywords.join(', '),
        source: 'DKG Knowledge Graph',
        timestamp: new Date().toISOString(),
      },
    ];
  }
}