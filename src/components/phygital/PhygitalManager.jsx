import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Link2, Sparkles, Scan, ExternalLink, Eye } from 'lucide-react';

export default function PhygitalManager({ onItemAdded }) {
  const queryClient = useQueryClient();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: '',
    item_type: 'merch',
    nfc_id: '',
    model_url: ''
  });

  const { data: items = [] } = useQuery({
    queryKey: ['phygitalItems'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.PhygitalItem.filter({ user_email: user.email });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (itemData) => {
      const user = await base44.auth.me();
      
      // Simulate blockchain inscription
      const blockchainHash = `0xPHYG${Math.random().toString(36).substring(2, 15)}`;
      
      return base44.entities.PhygitalItem.create({
        user_email: user.email,
        ...itemData,
        blockchain_hash: blockchainHash,
        ar_enabled: true,
        display_position: {
          x: Math.random() * 4 - 2,
          y: 1 + Math.random() * 2,
          z: -3 - Math.random() * 2
        }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['phygitalItems'] });
      setIsAddingItem(false);
      setNewItem({ item_name: '', item_type: 'merch', nfc_id: '', model_url: '' });
      if (onItemAdded) onItemAdded(data);
    },
  });

  const simulateNFCScan = () => {
    const mockNFCId = `NFC${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setNewItem({ ...newItem, nfc_id: mockNFCId });
    alert(`✅ NFC Chip Detected: ${mockNFCId}`);
  };

  return (
    <div className="backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-600/20 flex items-center justify-center">
            <Package className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-light text-white">Phygital Collection</h2>
            <p className="text-sm text-white/60">Link physical items to your 3D space</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddingItem(!isAddingItem)}
          className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Link Item
        </Button>
      </div>

      {/* Add Item Form */}
      {isAddingItem && (
        <div className="backdrop-blur-md bg-white/5 border border-cyan-400/30 rounded-xl p-4 mb-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-white/80 mb-1 block">Item Name</label>
              <Input
                placeholder="e.g., Limited Edition Vinyl"
                value={newItem.item_name}
                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-white/80 mb-1 block">Item Type</label>
              <Select value={newItem.item_type} onValueChange={(value) => setNewItem({ ...newItem, item_type: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merch">Merchandise</SelectItem>
                  <SelectItem value="vinyl">Vinyl Record</SelectItem>
                  <SelectItem value="artwork">Artwork</SelectItem>
                  <SelectItem value="collectible">Collectible</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/80 mb-1 block">NFC Authentication</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Scan NFC chip..."
                  value={newItem.nfc_id}
                  onChange={(e) => setNewItem({ ...newItem, nfc_id: e.target.value })}
                  className="bg-white/5 border-white/10 text-white flex-1"
                  readOnly
                />
                <Button
                  onClick={simulateNFCScan}
                  variant="outline"
                  className="border-cyan-400/30 text-cyan-400"
                >
                  <Scan className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm text-white/80 mb-1 block">3D Model URL (Optional)</label>
              <Input
                placeholder="https://..."
                value={newItem.model_url}
                onChange={(e) => setNewItem({ ...newItem, model_url: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <Button
              onClick={() => addItemMutation.mutate(newItem)}
              disabled={!newItem.item_name || !newItem.nfc_id || addItemMutation.isPending}
              className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {addItemMutation.isPending ? 'Linking...' : 'Link to Profile'}
            </Button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-cyan-400/50 rounded-xl p-4 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{item.item_name}</h3>
                <div className="text-xs text-white/60 capitalize">{item.item_type}</div>
              </div>
              {item.ar_enabled && (
                <div className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-xs">
                  AR Ready
                </div>
              )}
            </div>

            {item.blockchain_hash && (
              <div className="mb-3 p-2 rounded-lg bg-black/40 border border-cyan-400/20">
                <div className="text-xs text-white/60 mb-1">Blockchain Certificate</div>
                <div className="font-mono text-xs text-cyan-400 truncate">
                  {item.blockchain_hash}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-cyan-400/30 text-cyan-400 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                View in 3D
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 text-white/60 text-xs"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !isAddingItem && (
        <div className="text-center py-8 text-white/40">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No phygital items linked yet</p>
          <p className="text-xs mt-1">Connect physical merchandise to your virtual space</p>
        </div>
      )}
    </div>
  );
}