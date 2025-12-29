import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

export default function ChatPoll({ question, options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'] }) {
  const [votes, setVotes] = useState(options.map(() => 0));
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (index) => {
    if (hasVoted) return;
    const newVotes = [...votes];
    newVotes[index]++;
    setVotes(newVotes);
    setHasVoted(true);
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-red-500/20 to-cyan-400/20 border-2 border-red-500/50">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <h4 className="text-white font-bold text-sm">{question}</h4>
      </div>

      <div className="space-y-2">
        {options.map((option, i) => {
          const percentage = totalVotes > 0 ? Math.round((votes[i] / totalVotes) * 100) : 0;
          return (
            <button
              key={i}
              onClick={() => handleVote(i)}
              disabled={hasVoted}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                hasVoted
                  ? 'bg-white/5 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm">{option}</span>
                {hasVoted && <span className="text-cyan-400 text-xs font-bold">{percentage}%</span>}
              </div>
              {hasVoted && (
                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {hasVoted && (
        <div className="mt-3 text-center text-xs text-white/60">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </div>
      )}
    </div>
  );
}