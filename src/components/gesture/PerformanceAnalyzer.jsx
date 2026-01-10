import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X, Sparkles, TrendingUp, Zap, Target } from 'lucide-react';

export default function PerformanceAnalyzer({ sessionId, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePerformance = async () => {
    setIsAnalyzing(true);
    try {
      const session = await base44.entities.GestureSession.filter({ id: sessionId });
      const events = await base44.entities.GestureEvent.filter({ session_id: sessionId });

      const prompt = `Analyze this gesture performance session and provide insights:

Session: ${session[0]?.session_name}
Total Gestures: ${events.length}
Duration: ${session[0]?.duration_seconds || 'unknown'}

Gesture Data:
${events.slice(0, 50).map(e => `- ${e.hand} hand at (${e.position_x.toFixed(2)}, ${e.position_y.toFixed(2)}), velocity: ${e.velocity.toFixed(2)}`).join('\n')}

Provide:
1. Common gesture patterns identified
2. Peak performance moments (high energy/activity)
3. Technical improvement suggestions
4. Recommended mapping preset based on performance style`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            patterns: { type: "array", items: { type: "string" } },
            peak_moments: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            recommended_preset: { type: "string" },
            performance_score: { type: "number" }
          }
        }
      });

      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-black/90 border border-cyan-400/30 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-light text-white">AI Performance Analysis</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!analysis ? (
          <div className="text-center py-12">
            <Button
              onClick={analyzePerformance}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90"
            >
              {isAnalyzing ? 'Analyzing Performance...' : 'Analyze Session'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Performance Score */}
            {analysis.performance_score && (
              <div className="backdrop-blur-md bg-gradient-to-r from-cyan-400/10 to-purple-600/10 border border-cyan-400/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white/60 text-sm">Performance Score</div>
                  <div className="text-3xl font-bold text-cyan-400">{analysis.performance_score}/10</div>
                </div>
              </div>
            )}

            {/* Common Patterns */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-medium">Common Patterns</h3>
              </div>
              <div className="space-y-2">
                {analysis.patterns?.map((pattern, i) => (
                  <div key={i} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="text-white text-sm">{pattern}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Moments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-medium">Peak Moments</h3>
              </div>
              <div className="space-y-2">
                {analysis.peak_moments?.map((moment, i) => (
                  <div key={i} className="backdrop-blur-md bg-purple-400/10 border border-purple-400/20 rounded-lg p-3">
                    <div className="text-white text-sm">{moment}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-medium">Improvement Suggestions</h3>
              </div>
              <div className="space-y-2">
                {analysis.improvements?.map((improvement, i) => (
                  <div key={i} className="backdrop-blur-md bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                    <div className="text-white text-sm">{improvement}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Preset */}
            {analysis.recommended_preset && (
              <div className="backdrop-blur-md bg-gradient-to-r from-cyan-400/10 to-purple-600/10 border border-cyan-400/30 rounded-xl p-4">
                <div className="text-white/60 text-sm mb-2">Recommended Preset</div>
                <div className="text-white font-medium">{analysis.recommended_preset}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}