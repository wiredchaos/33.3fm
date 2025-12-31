import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic2, Download, Play, Loader2, Sparkles } from 'lucide-react';

export default function VoiceGenerator() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('21m00Tcm4TlvDq8ikWAM'); // Rachel default
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const voices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel - Calm Female', accent: 'American' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam - Deep Male', accent: 'American' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella - Soft Female', accent: 'American' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni - Well Rounded Male', accent: 'American' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold - Crisp Male', accent: 'American' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli - Emotional Female', accent: 'American' },
  ];

  const generateVoice = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } else {
        alert('Voice generation failed. Check API key.');
      }
    } catch (error) {
      console.error('Voice generation error:', error);
      alert('Error generating voice. See console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'voice_generation.mp3';
    a.click();
  };

  return (
    <div className="backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6 w-full max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-600/20 flex items-center justify-center">
          <Mic2 className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-light text-white">AI Voice Generator</h2>
          <p className="text-sm text-white/60">Powered by ElevenLabs</p>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="mb-4">
        <label className="text-sm text-white/80 mb-2 block">Select Voice</label>
        <Select value={voice} onValueChange={setVoice}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {voices.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name} ({v.accent})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Text Input */}
      <div className="mb-4">
        <label className="text-sm text-white/80 mb-2 block">Text to Speak</label>
        <Textarea
          placeholder="Enter the text you want to convert to speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[120px]"
          maxLength={1000}
        />
        <div className="text-xs text-white/40 mt-1">
          {text.length} / 1000 characters
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateVoice}
        disabled={isGenerating || !text.trim()}
        className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white mb-4"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Voice...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Voice
          </>
        )}
      </Button>

      {/* Audio Player */}
      {audioUrl && (
        <div className="backdrop-blur-md bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">
              <Play className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-white font-medium">Generated Audio</div>
              <div className="text-xs text-white/60">Ready to play or download</div>
            </div>
          </div>
          
          <audio controls className="w-full mb-3" src={audioUrl} />
          
          <Button
            onClick={downloadAudio}
            variant="outline"
            className="w-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download MP3
          </Button>
        </div>
      )}

      <div className="mt-4 text-xs text-white/40 text-center">
        Generate realistic AI voices for intros, announcements, or content
      </div>
    </div>
  );
}