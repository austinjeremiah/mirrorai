'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:3000/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Verification failed. Make sure the backend server is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🪞 MirrorAI
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Truth Verification using DKG
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🤖 Agent Layer
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              🧠 Knowledge Layer
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              🔗 Trust Layer
            </span>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <label className="block text-gray-700 font-semibold mb-3">
            Enter text to verify:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: Ethereum transitioned to proof-of-stake in September 2022. Bitcoin remains on proof-of-work."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none text-gray-800"
          />
          
          <button
            onClick={verify}
            disabled={loading || !text.trim()}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? '🔍 Verifying...' : '✨ Verify Truth Score'}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Score Badge */}
            <div className="text-center mb-8">
              <div className={`inline-block px-8 py-4 rounded-full text-4xl font-bold ${
                result.truthScore.overallScore >= 80 ? 'bg-green-100 text-green-700' :
                result.truthScore.overallScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {result.truthScore.overallScore}/100
              </div>
              <p className="text-gray-600 mt-2">Truth Score</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {result.claims.length}
                </div>
                <div className="text-sm text-gray-600">Claims Found</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {result.truthScore.dkgFactsUsed}
                </div>
                <div className="text-sm text-gray-600">DKG Facts</div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-700">
                  {result.truthScore.claimScores.length}
                </div>
                <div className="text-sm text-gray-600">Analyzed</div>
              </div>
            </div>

            {/* Claims Breakdown */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                📋 Claim Analysis:
              </h3>
              
              {result.truthScore.claimScores.map((cs: any, idx: number) => (
                <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-2 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-800 font-medium flex-1">
                      {cs.claim.text}
                    </p>
                    <span className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      cs.score >= 80 ? 'bg-green-100 text-green-700' :
                      cs.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {cs.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    {cs.reasoning}
                  </p>
                </div>
              ))}
            </div>

            {/* Technical Details */}
            <details className="border-t pt-4">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-indigo-600">
                🔐 View Technical Details
              </summary>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pipeline Hash:</span>
                  <code className="text-gray-800 font-mono text-xs">
                    {result.pipelineHash.substring(0, 32)}...
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DKG Asset UAL:</span>
                  <span className="text-gray-500 text-xs">
                    {result.dkgAssetUAL || 'Demo mode'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="text-gray-800">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by ASI-1 AI + OriginTrail DKG</p>
          <p className="mt-2 text-xs">Agent • Knowledge • Trust Architecture</p>
        </div>
      </div>
    </main>
  );
}
