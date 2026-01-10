import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save } from 'lucide-react';

export default function GestureControls({ onClose }) {
  const [presets, setPresets] = useState([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [selectedScale, setSelectedScale] = useState('pentatonic');

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const user = await base44.auth.me();
      const userPresets = await base44.entities.MappingPreset.filter({ user_email: user.email });
      setPresets(userPresets);
    } catch (error) {
      console.error('Failed to load presets');
    }
  };

  const savePreset = async () => {
    if (!newPresetName.trim()) return;

    try {
      const user = await base44.auth.me();
      await base44.entities.MappingPreset.create({
        user_email: user.email,
        preset_name: newPresetName,
        scale_tuning: selectedScale,
        gesture_mappings: {
          right_hand: { param: 'pitch', range: [200, 1000] },
          left_hand: { param: 'mode', actions: ['freeze', 'scatter', 'attract'] }
        },
        effect_routing: {
          filter: true,
          delay: true,
          reverb: false
        },
        particle_config: {
          count: 15000,
          blending: 'additive'
        }
      });

      setNewPresetName('');
      loadPresets();
    } catch (error) {
      console.error('Failed to save preset');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-black/90 border border-cyan-400/30 rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-white">Mapping Presets</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Scale</label>
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              <option value="chromatic">Chromatic</option>
              <option value="pentatonic">Pentatonic</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="dorian">Dorian</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">New Preset Name</label>
            <div className="flex gap-2">
              <Input
                placeholder="My Performance Setup"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <Button
                onClick={savePreset}
                className="bg-gradient-to-r from-cyan-400 to-purple-600"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-white/60 uppercase tracking-wider mb-2">Saved Presets</div>
          {presets.length === 0 ? (
            <div className="text-white/40 text-sm text-center py-4">No presets saved yet</div>
          ) : (
            presets.map((preset) => (
              <div
                key={preset.id}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 hover:border-cyan-400/30 transition-all cursor-pointer"
              >
                <div className="text-white text-sm">{preset.preset_name}</div>
                <div className="text-cyan-400 text-xs mt-1">{preset.scale_tuning}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}