import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save, Hand, Volume2, Eye } from 'lucide-react';

export default function GestureMappingEditor({ onClose, onSave }) {
  const [presetName, setPresetName] = useState('');
  const [mappings, setMappings] = useState({
    open_palm: { audio: 'freeze', visual: 'freeze' },
    closed_fist: { audio: 'scatter', visual: 'scatter' },
    point: { audio: 'pitch', visual: 'attract' },
    five_fingers: { audio: 'reverb', visual: 'density' }
  });

  const [audioParams, setAudioParams] = useState({
    pitch_min: 200,
    pitch_max: 1000,
    filter_min: 500,
    filter_max: 2500,
    delay_time: 0.3,
    reverb_mix: 0.4
  });

  const [visualParams, setVisualParams] = useState({
    particle_density: 15000,
    velocity_scale: 1.0,
    color_mode: 'rainbow'
  });

  const gestureOptions = [
    { value: 'open_palm', label: 'Open Palm' },
    { value: 'closed_fist', label: 'Closed Fist' },
    { value: 'point', label: 'Point (Index)' },
    { value: 'five_fingers', label: 'Five Fingers' }
  ];

  const audioActions = [
    { value: 'pitch', label: 'Pitch Control' },
    { value: 'filter', label: 'Filter Cutoff' },
    { value: 'delay', label: 'Delay Time' },
    { value: 'reverb', label: 'Reverb Mix' },
    { value: 'distortion', label: 'Distortion' },
    { value: 'freeze', label: 'Freeze/Hold' },
    { value: 'scatter', label: 'Scatter Burst' }
  ];

  const visualActions = [
    { value: 'attract', label: 'Attract Particles' },
    { value: 'scatter', label: 'Scatter Particles' },
    { value: 'freeze', label: 'Freeze Motion' },
    { value: 'density', label: 'Change Density' },
    { value: 'color', label: 'Change Colors' }
  ];

  const handleSavePreset = async () => {
    if (!presetName.trim()) return;

    try {
      const user = await base44.auth.me();
      const preset = await base44.entities.MappingPreset.create({
        user_email: user.email,
        preset_name: presetName,
        gesture_mappings: mappings,
        effect_routing: audioParams,
        particle_config: visualParams,
        is_public: false
      });

      onSave(preset);
    } catch (error) {
      console.error('Failed to save preset:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-y-auto py-8">
      <div className="backdrop-blur-xl bg-black/90 border border-cyan-400/30 rounded-2xl p-6 max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-white">Gesture Mapping Editor</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Preset Name */}
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Preset Name</label>
            <Input
              placeholder="My Performance Setup"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Gesture Mappings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hand className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-medium">Gesture Mappings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gestureOptions.map((gesture) => (
                <div key={gesture.value} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-white font-medium mb-3">{gesture.label}</div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-4 h-4 text-purple-400" />
                        <label className="text-xs text-white/60">Audio Control</label>
                      </div>
                      <select
                        value={mappings[gesture.value]?.audio || ''}
                        onChange={(e) => setMappings({
                          ...mappings,
                          [gesture.value]: { ...mappings[gesture.value], audio: e.target.value }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                      >
                        {audioActions.map(action => (
                          <option key={action.value} value={action.value}>{action.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <label className="text-xs text-white/60">Visual Effect</label>
                      </div>
                      <select
                        value={mappings[gesture.value]?.visual || ''}
                        onChange={(e) => setMappings({
                          ...mappings,
                          [gesture.value]: { ...mappings[gesture.value], visual: e.target.value }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                      >
                        {visualActions.map(action => (
                          <option key={action.value} value={action.value}>{action.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Parameters */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-medium">Audio Parameters</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(audioParams).map((param) => (
                <div key={param} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                  <label className="text-xs text-white/60 mb-2 block capitalize">
                    {param.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="number"
                    value={audioParams[param]}
                    onChange={(e) => setAudioParams({
                      ...audioParams,
                      [param]: parseFloat(e.target.value)
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Visual Parameters */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-medium">Visual Parameters</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                <label className="text-xs text-white/60 mb-2 block">Particle Density</label>
                <input
                  type="number"
                  value={visualParams.particle_density}
                  onChange={(e) => setVisualParams({
                    ...visualParams,
                    particle_density: parseInt(e.target.value)
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
                />
              </div>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                <label className="text-xs text-white/60 mb-2 block">Velocity Scale</label>
                <input
                  type="number"
                  step="0.1"
                  value={visualParams.velocity_scale}
                  onChange={(e) => setVisualParams({
                    ...visualParams,
                    velocity_scale: parseFloat(e.target.value)
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
                />
              </div>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
                <label className="text-xs text-white/60 mb-2 block">Color Mode</label>
                <select
                  value={visualParams.color_mode}
                  onChange={(e) => setVisualParams({
                    ...visualParams,
                    color_mode: e.target.value
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
                >
                  <option value="rainbow">Rainbow</option>
                  <option value="cyan">Cyan</option>
                  <option value="purple">Purple</option>
                  <option value="fire">Fire</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
              className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}