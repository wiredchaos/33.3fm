import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Sparkles, Package, Palette, Zap } from 'lucide-react';

export default function VirtualStore() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: Package },
    { id: 'decor', name: 'Decor', icon: Sparkles },
    { id: 'equipment', name: 'Equipment', icon: Zap },
    { id: 'visual_effect', name: 'Effects', icon: Palette },
  ];

  const { data: items = [] } = useQuery({
    queryKey: ['virtualItems'],
    queryFn: () => base44.entities.VirtualItem.list(),
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Purchase.filter({ user_email: user.email });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (item) => {
      const user = await base44.auth.me();
      return base44.entities.Purchase.create({
        user_email: user.email,
        item_id: item.id,
        item_name: item.name,
        amount_paid: item.price,
        is_equipped: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const isPurchased = (itemId) => purchases.some(p => p.item_id === itemId);

  const rarityColors = {
    common: 'from-white/10 to-white/5',
    rare: 'from-cyan-400/20 to-cyan-600/10',
    epic: 'from-red-500/20 to-red-700/10',
    legendary: 'from-red-500/30 via-cyan-400/20 to-red-500/30'
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-red-500 to-cyan-400 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`relative backdrop-blur-xl bg-gradient-to-br ${rarityColors[item.rarity]} border border-white/10 rounded-2xl p-4 hover:border-cyan-400/50 transition-all`}
          >
            {/* Rarity Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 text-xs uppercase tracking-wider text-white/80">
              {item.rarity}
            </div>

            {/* Item Preview */}
            <div className="w-full aspect-square rounded-xl bg-black/40 mb-4 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-cyan-400" />
            </div>

            {/* Item Info */}
            <h3 className="text-lg font-medium text-white mb-1">{item.name}</h3>
            <p className="text-sm text-white/60 mb-4 line-clamp-2">{item.description}</p>

            {/* Price & Purchase */}
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">${item.price}</div>
              {isPurchased(item.id) ? (
                <Button
                  disabled
                  className="bg-white/10 text-white/60 cursor-not-allowed"
                >
                  Owned
                </Button>
              ) : (
                <Button
                  onClick={() => purchaseMutation.mutate(item)}
                  disabled={purchaseMutation.isPending}
                  className="bg-gradient-to-r from-red-500 to-cyan-400 hover:from-red-600 hover:to-cyan-500 text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <Package className="w-12 h-12 mx-auto mb-4" />
          <p>No items in this category yet</p>
        </div>
      )}
    </div>
  );
}