/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, User, ExternalLink, RefreshCw, Trophy, Swords, Sparkles, Star, Users, MessageSquare, X, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sfx } from '../utils/audio';
import { PlayerInfo, HistoryItem } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileViewerProps {
  uid: string;
  onUidChange: (uid: string) => void;
  searchedUid: string;
  setSearchedUid: (uid: string) => void;
  loadTrigger?: number;
  history: HistoryItem[];
}

const PRESET_ACCOUNTS = [
  { name: 'Ayan (Dev)', uid: '2279016714', label: 'VIP Owner' },
  { name: 'Niruu (New)', uid: '10966927018', label: 'Moderator' },
];

export const ProfileViewer: React.FC<ProfileViewerProps> = ({
  uid,
  onUidChange,
  searchedUid,
  setSearchedUid,
  loadTrigger,
  history,
}) => {
  const [localUid, setLocalUid] = useState(searchedUid || uid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imgKey, setImgKey] = useState(0);
  
  // Real-time fetched player statistics state
  const [playerStats, setPlayerStats] = useState<PlayerInfo | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const uidHistory = history
    .filter(item => item.uid === (searchedUid || uid))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Sync state initially and on trigger
  useEffect(() => {
    if (searchedUid) {
      setLocalUid(searchedUid);
      setLoading(true);
      setError(false);
      setImgKey((prev) => prev + 1);
      fetchPlayerDetails(searchedUid);
    }
  }, [searchedUid, loadTrigger]);

  const handlePasteUid = async () => {
    sfx.playClick();
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/\D/g, '');
      if (cleaned) {
        setLocalUid(cleaned);
      }
    } catch (err) {
      console.warn('Failed to read clipboard text:', err);
    }
  };

  const handleClearUid = () => {
    sfx.playClick();
    setLocalUid('');
  };

  const fetchPlayerDetails = async (targetUid: string) => {
    if (!targetUid) return;
    setLoadingStats(true);
    try {
      let data;
      // Try server-side proxy route first (most robust)
      try {
        const res = await fetch(`/api/info?uid=${targetUid}`);
        const text = await res.text();
        if (res.ok) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            throw new Error(`Invalid JSON from server proxy: ${text.substring(0, 100)}`);
          }
        } else {
          throw new Error(`Proxy status: ${res.status}. Body: ${text.substring(0, 100)}`);
        }
      } catch (serverErr) {
        console.warn('Server proxy failed for player details, trying direct public API...', serverErr);
        // Fallback 1: Direct Fetch
        try {
          const res = await fetch(`https://nirob-x-info.vercel.app/info?uid=${targetUid}`);
          const text = await res.text();
          if (res.ok) {
            try {
              data = JSON.parse(text);
            } catch (e) {
              throw new Error(`Invalid JSON from direct API: ${text.substring(0, 100)}`);
            }
          } else {
            throw new Error(`Direct API status: ${res.status}. Body: ${text.substring(0, 100)}`);
          }
        } catch (directErr) {
          console.warn('Direct fetch failed for player details, falling back to AllOrigins proxy...', directErr);
          // Fallback 2: Third-party CORS Proxy
          try {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://nirob-x-info.vercel.app/info?uid=${targetUid}`)}`;
            const res = await fetch(proxyUrl);
            const text = await res.text();
            if (res.ok) {
              try {
                data = JSON.parse(text);
              } catch (e) {
                throw new Error(`Invalid JSON from AllOrigins proxy: ${text.substring(0, 100)}`);
              }
            } else {
              throw new Error(`AllOrigins proxy status: ${res.status}. Body: ${text.substring(0, 100)}`);
            }
          } catch (proxyErr) {
            console.error('All fallbacks failed for player details fetch:', proxyErr);
          }
        }
      }

      if (data && data.basicInfo) {
        setPlayerStats(data);
      } else {
        setPlayerStats(null);
      }
    } catch (err) {
      console.error('Failed to fetch player details:', err);
      setPlayerStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleInspect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!localUid.trim()) return;

    sfx.playClick();
    setLoading(true);
    setError(false);
    onUidChange(localUid);
    setSearchedUid(localUid);
    setImgKey((prev) => prev + 1);
    fetchPlayerDetails(localUid);
  };

  const handlePresetClick = (presetUid: string) => {
    sfx.playSuccess();
    setLocalUid(presetUid);
    onUidChange(presetUid);
    setSearchedUid(presetUid);
    setLoading(true);
    setError(false);
    setImgKey((prev) => prev + 1);
    fetchPlayerDetails(presetUid);
  };

  const handleRefresh = () => {
    sfx.playClick();
    setLoading(true);
    setError(false);
    setImgKey((prev) => prev + 1);
    fetchPlayerDetails(searchedUid || uid);
  };

  const currentProfileUrl = `https://nirob-free-fire-baner.vercel.app/profile?uid=${searchedUid || uid}`;

  return (
    <div className="rounded-3xl bg-slate-950/90 border border-cyan-500/30 p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)] backdrop-blur-md space-y-6" id="profile-viewer-container">
      {/* Search Header */}
      <div>
        <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          Live Profile Inspector
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Query any active Free Fire UID to fetch both their official avatar banner image and real-time game statistics.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleInspect} className="relative flex gap-2">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={localUid}
            onChange={(e) => setLocalUid(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter Free Fire UID"
            className="w-full bg-slate-900/90 text-white border border-slate-800 focus:border-cyan-500 rounded-xl pl-11 pr-14 sm:pr-32 py-3.5 text-sm font-mono tracking-wider outline-none transition-all placeholder-slate-600 focus:ring-1 focus:ring-cyan-500/30"
          />
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          
          {/* Action buttons inside input */}
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {localUid && (
              <button
                type="button"
                onClick={handleClearUid}
                className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                title="Clear UID"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handlePasteUid}
              className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-mono font-bold"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[9px]">PASTE</span>
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-sm rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          Inspect
        </button>
      </form>

      {/* Preset Accounts Slider */}
      <div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2.5">
          Quick Preset Profiles
        </span>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_ACCOUNTS.map((acc) => (
            <button
              key={acc.uid}
              onClick={() => handlePresetClick(acc.uid)}
              className={`p-3 rounded-xl border text-left transition-all group relative overflow-hidden cursor-pointer ${
                (searchedUid || uid) === acc.uid
                  ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-black truncate flex items-center gap-1">
                {acc.name}
                {acc.uid === '2279016714' && <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">UID: {acc.uid}</div>
              <div className="text-[9px] font-mono text-cyan-400/80 mt-1 uppercase tracking-wider font-bold">
                {acc.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Profile Output Card */}
      <div className="relative border border-slate-800/80 bg-slate-900/40 rounded-2xl p-4 overflow-hidden shadow-inner space-y-4">
        
        {/* Visualizer header */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
            LIVE AVATAR BANNER PREVIEW
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Stats"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <a
              href={currentProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-all cursor-pointer flex items-center gap-1"
              title="Open Banner Url"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live Banner Crop Image */}
        <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20 bg-black min-h-[90px] flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/2 to-transparent bg-[length:100%_4px] pointer-events-none" />

          {loading && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 z-10">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[9px] text-cyan-500/60 font-mono">RETRIEVING LIVE RENDER...</span>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-3 text-center gap-1.5 z-10">
              <span className="text-xs font-bold text-red-400">PROFILE DECRYPTION BLOCKED</span>
              <p className="text-[9px] text-slate-500 max-w-xs font-mono">
                Ensure active server match records exist on BD or IND regions.
              </p>
            </div>
          )}

          <img
            key={`${searchedUid || uid}-${imgKey}`}
            src={currentProfileUrl}
            alt="Free Fire Live Avatar"
            referrerPolicy="no-referrer"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            className="w-full h-auto object-cover max-h-[140px] select-none"
          />
        </div>

        {/* Dynamic Decrypted Statistics Panels */}
        <AnimatePresence mode="wait">
          {loadingStats ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2 text-slate-500 font-mono text-[10px]">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>DECRYPTING PLAYER METADATA...</span>
            </div>
          ) : playerStats && playerStats.basicInfo ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3.5 pt-2 border-t border-slate-800/60"
            >
              {/* Player Nickname & Region Title */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">IN-GAME NAME</span>
                  <div className="text-base font-black text-white flex items-center gap-1.5">
                    {playerStats.basicInfo.nickname}
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">REGION SERVER</span>
                  <span className="text-xs font-black font-mono text-cyan-400">
                    {playerStats.basicInfo.region === 'BD' ? '🇧🇩 BANGLADESH' : `🌐 ${playerStats.basicInfo.region}`}
                  </span>
                </div>
              </div>

              {/* Grid indicators */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900/60 flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400/10 shrink-0" />
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">Level</span>
                    <span className="text-xs font-bold text-slate-200">{playerStats.basicInfo.level}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900/60 flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">BR Rank Points</span>
                    <span className="text-xs font-bold text-slate-200">{playerStats.basicInfo.rankingPoints}</span>
                  </div>
                </div>

                {playerStats.clanBasicInfo && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900/60 flex items-center gap-2.5 col-span-2">
                    <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-[8px] font-mono text-slate-500 uppercase block">CLAN GUILD</span>
                      <span className="text-xs font-bold text-slate-200 block truncate">
                        {playerStats.clanBasicInfo.clanName} (Lv.{playerStats.clanBasicInfo.clanLevel})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {playerStats.socialInfo?.signature && (
                <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-900/80 flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">Signature (উক্তি)</span>
                    <p className="text-xs text-slate-300 italic">
                      "{playerStats.socialInfo.signature}"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="py-2 text-center">
              <p className="text-[10px] text-slate-500 font-mono">
                Click Inspect to synchronize player guild statistics.
              </p>
            </div>
          )}
        </AnimatePresence>

        {uidHistory.length > 1 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3 mt-4">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" />
              Like Growth History
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={uidHistory.map(h => ({ time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), likes: h.likesAfter }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} itemStyle={{ fontSize: 10, color: '#22d3ee' }} />
                  <Line type="monotone" dataKey="likes" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
