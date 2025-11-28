# 🪞 MirrorAI - Truth Verification System

AI-powered truth verification using ASI-1 and OriginTrail DKG

## 🏗️ Architecture

**Agent Layer:** ASI-1 AI extracts factual claims from text  
**Knowledge Layer:** Queries OriginTrail DKG for verification data  
**Trust Layer:** Calculates truth score + generates tamper-proof hash  

**Privacy:** Only hash published, not raw data  
**Verifiable:** Hash proves integrity of analysis pipeline

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
1. Get your ASI API key from: https://asi1.ai/dashboard/api-keys
2. Copy `.env.example` to `.env`
3. Add your API key to `.env`:
```
ASI_API_KEY=your_actual_api_key_here
ASI_BASE_URL=https://api.asi1.ai/v1
PORT=3000
```

### 3. Test the System
```bash
npm run test
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/verify -H "Content-Type: application/json" -d "{\"text\": \"Ethereum uses proof-of-stake since 2022\"}"
```

## 📊 How It Works

1. **Claim Extraction**: ASI-1 AI extracts verifiable claims from input text
2. **DKG Query**: Queries OriginTrail DKG for related facts
3. **Truth Scoring**: AI analyzes claims against DKG facts (0-100 score)
4. **Hash Generation**: Creates cryptographic proof of the verification pipeline

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development
- **Express** - API server
- **OpenAI SDK** - ASI-1 integration
- **DKG.js** - OriginTrail integration
- **Node Crypto** - Hash generation

## 📁 Project Structure

```
mirrorai/
├── src/
│   ├── types.ts           # TypeScript interfaces
│   ├── claim-extractor.ts # ASI-1 claim extraction
│   ├── dkg-query.ts       # DKG fact retrieval
│   ├── truth-scorer.ts    # AI-powered scoring
│   ├── hash-generator.ts  # Cryptographic proofs
│   └── index.ts           # Main MirrorAI class
├── server.ts              # Express API server
├── package.json
└── tsconfig.json
```

## 🎯 API Endpoints

### POST `/api/verify`
Verify text for truthfulness

**Request:**
```json
{
  "text": "Your text to verify here"
}
```

**Response:**
```json
{
  "postText": "...",
  "claims": [...],
  "truthScore": {
    "overallScore": 85,
    "claimScores": [...],
    "dkgFactsUsed": 5
  },
  "pipelineHash": "abc123...",
  "timestamp": "2025-11-28T..."
}
```

### GET `/health`
Health check endpoint

## 📝 Next Steps

- [ ] Get ASI API key and add to `.env`
- [ ] Run `npm run test` to verify setup
- [ ] Start server with `npm run dev`
- [ ] Test API with sample data
- [ ] Record demo video
- [ ] Push to GitHub

## 🏆 Hackathon Submission

This project demonstrates:
- **AI Agent Integration**: ASI-1 for intelligent claim extraction
- **Decentralized Knowledge**: OriginTrail DKG for fact verification
- **Verifiable Truth**: Cryptographic proofs of verification pipeline
- **Privacy-First**: Only hashes published, not raw data

---

Built for [Hackathon Name] - Truth verification powered by AI and decentralized knowledge
