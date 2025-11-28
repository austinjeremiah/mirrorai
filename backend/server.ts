import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { MirrorAI } from './src/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mirrorAI = new MirrorAI();

app.post('/api/verify', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await mirrorAI.verifyPost(text);
    res.json(result);
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MirrorAI' });
});

app.listen(PORT, () => {
  console.log(`🚀 MirrorAI server running on http://localhost:${PORT}`);
});
