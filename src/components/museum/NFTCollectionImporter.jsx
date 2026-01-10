import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { Link2, Loader2, CheckCircle2, Package, AlertCircle } from 'lucide-react';

export default function NFTCollectionImporter({ onImportComplete }) {
  const [collectionUrl, setCollectionUrl] = useState('https://opensea.io/BlockchaintrapperETH');
  const [isImporting, setIsImporting] = useState(false);
  const [importedItems, setImportedItems] = useState([]);
  const [error, setError] = useState(null);

  const parseCollectionUrl = (url) => {
    // Support multiple NFT platforms
    const patterns = [
      // OpenSea: https://opensea.io/collection/azuki or https://opensea.io/assets/ethereum/0x.../1
      { platform: 'opensea', regex: /opensea\.io\/(?:collection\/([^/?]+)|assets\/([^/]+)\/([^/]+))/ },
      // Rarible: https://rarible.com/collection/polygon/0x...
      { platform: 'rarible', regex: /rarible\.com\/(?:collection|token)\/([^/?]+)\/([^/?]+)/ },
      // LooksRare
      { platform: 'looksrare', regex: /looksrare\.org\/collections\/([^/?]+)/ },
      // Foundation
      { platform: 'foundation', regex: /foundation\.app\/([^/]+)\/([^/?]+)/ },
    ];

    for (const { platform, regex } of patterns) {
      const match = url.match(regex);
      if (match) {
        return { platform, identifier: match[1] || match[2] };
      }
    }
    return null;
  };

  const fetchNFTData = async (platform, identifier) => {
    // Use LLM with web search to fetch NFT data from public APIs
    const prompt = `Fetch NFT collection data for ${platform} collection/user: ${identifier}

IMPORTANT: Only extract MUSIC NFTs. Filter for audio files, music tracks, albums, or sound art.
Ignore visual art, PFPs, or non-music NFTs.

Extract:
- Collection name
- Items (up to 10 MUSIC NFTs only)
- For each MUSIC NFT: name, description, image URL, token ID

Use public APIs or web scraping. Return structured JSON with MUSIC NFTs only.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            collection_name: { type: "string" },
            platform: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  image_url: { type: "string" },
                  token_id: { type: "string" }
                }
              }
            }
          }
        }
      });
      return response;
    } catch (error) {
      throw new Error('Failed to fetch NFT data from ' + platform);
    }
  };

  const handleImport = async () => {
    setError(null);
    setIsImporting(true);

    try {
      const parsed = parseCollectionUrl(collectionUrl);
      if (!parsed) {
        throw new Error('Invalid NFT collection URL. Supported: OpenSea, Rarible, LooksRare, Foundation');
      }

      // Fetch NFT data using AI with web search
      const collectionData = await fetchNFTData(parsed.platform, parsed.identifier);

      // Get current user
      const user = await base44.auth.me();

      // Create phygital items from NFT data (music NFTs only)
      const createdItems = [];
      for (const nft of collectionData.items) {
        const item = await base44.entities.PhygitalItem.create({
          user_email: user.email,
          item_name: nft.name || 'Untitled Music NFT',
          item_type: 'vinyl',
          model_url: nft.image_url,
          ar_enabled: true,
          display_position: {
            x: (Math.random() - 0.5) * 8,
            y: 2,
            z: (Math.random() - 0.5) * 8
          },
          metadata: {
            platform: parsed.platform,
            token_id: nft.token_id,
            description: nft.description,
            collection: collectionData.collection_name,
            imported_from_url: true,
            nft_type: 'music'
          }
        });
        createdItems.push(item);
      }

      setImportedItems(createdItems);
      if (onImportComplete) onImportComplete(createdItems);
      setCollectionUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-cyan-400/20 flex items-center justify-center">
          <Link2 className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-light text-white">Import Music NFTs</h2>
          <p className="text-xs text-white/60">Music NFTs only • No wallet required</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/60 mb-2 block">NFT Collection URL</label>
          <div className="flex gap-2">
            <Input
              value={collectionUrl}
              onChange={(e) => setCollectionUrl(e.target.value)}
              placeholder="https://opensea.io/collection/azuki"
              className="bg-white/5 border-cyan-400/30 text-white"
              disabled={isImporting}
            />
            <Button
              onClick={handleImport}
              disabled={isImporting || !collectionUrl.trim()}
              className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Import
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-white/40 space-y-1">
          <p>Supported platforms:</p>
          <ul className="list-disc list-inside pl-2 space-y-0.5">
            <li>OpenSea (opensea.io/collection/...)</li>
            <li>Rarible (rarible.com/collection/...)</li>
            <li>LooksRare (looksrare.org/collections/...)</li>
            <li>Foundation (foundation.app/...)</li>
          </ul>
        </div>

        {importedItems.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-sm text-cyan-400 mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Successfully imported {importedItems.length} NFTs</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {importedItems.map((item, i) => (
                <div key={i} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-2">
                  {item.model_url && (
                    <img 
                      src={item.model_url} 
                      alt={item.item_name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-xs text-white font-medium truncate">{item.item_name}</p>
                  <p className="text-[10px] text-white/40">Token #{item.metadata?.token_id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}