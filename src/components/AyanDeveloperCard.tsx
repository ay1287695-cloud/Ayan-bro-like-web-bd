/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Trophy, Flame, Heart, Users, MessageSquare, Copy, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { sfx } from '../utils/audio';
import { PlayerInfo } from '../types';

interface AyanDeveloperCardProps {
  onLoadUID: (uid: string) => void;
}

export const AyanDeveloperCard: React.FC<AyanDeveloperCardProps> = ({ onLoadUID }) => {
  const ayanUid = '2279016714';
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<PlayerInfo | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchOwnerStats = async () => {
      try {
        let data;
        // Try server-side proxy route first (most robust)
        try {
          const res = await fetch(`/api/info?uid=${ayanUid}`);
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
          console.warn('Server proxy failed, trying direct public API...', serverErr);
          // Fallback 1: Direct Fetch
          try {
            const res = await fetch(`https://nirob-x-info.vercel.app/info?uid=${ayanUid}`);
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
            console.warn('Direct fetch failed, falling back to AllOrigins proxy...', directErr);
            // Fallback 2: Third-party CORS Proxy
            try {
              const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://nirob-x-info.vercel.app/info?uid=${ayanUid}`)}`;
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
              console.error('All fallbacks failed for owner stats fetch:', proxyErr);
            }
          }
        }

        if (data && data.basicInfo) {
          setOwnerInfo(data);
        }
      } catch (err) {
        console.error('Failed to load live owner stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchOwnerStats();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(ayanUid);
    setCopied(true);
    sfx.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickLoad = () => {
    onLoadUID(ayanUid);
    sfx.playSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/45 p-6 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.12)]"
      id="ayan-vip-owner-card"
    >
      {/* Absolute Glow Spots */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Inside Card */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-slate-800/60">
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Shield className="w-4 h-4 text-emerald-400 animate-pulse" />
          VIP FOUNDER & PLATFORM CREATOR
        </div>
        <div className="text-right font-mono text-[10px] text-white flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/35 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          {/* Active Status Light */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
          </span>
          <span className="font-bold tracking-wider text-emerald-300">GATEWAY STATUS: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Banner Card */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            {/* Live Profile Banner Picture preview placed directly here */}
            <div className="relative group w-full rounded-xl overflow-hidden border border-emerald-500/35 bg-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all hover:border-emerald-400/60">
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/2 to-transparent bg-[length:100%_4px] pointer-events-none z-10" />

              <div className="relative aspect-[4.8/1] w-full min-h-[75px] flex items-center justify-center overflow-hidden">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-1.5">
                    <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[9px] text-emerald-500/60 font-mono">LOADING BANNER...</span>
                  </div>
                )}
                <img
                  src={`https://nirob-free-fire-baner.vercel.app/profile?uid=${ayanUid}`}
                  alt="Ayan Live Profile Banner"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-auto object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center pt-2">
            {/* Copy UID Widget */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 pr-3 shadow-inner">
              <div className="bg-emerald-500/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg font-mono mr-2.5">
                {ayanUid}
              </div>
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Owner UID"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Stats & Bio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-[10px] font-mono text-white tracking-widest uppercase bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 font-bold inline-block">
            LIVE METRICS
          </div>

          {/* Real-time stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Likes */}
            <div className="bg-slate-950/60 border border-emerald-500/25 rounded-2xl p-4 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/5 rounded-full blur-md" />
              <div className="text-[10px] font-mono text-slate-200 uppercase flex items-center gap-1.5 font-bold">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Live Likes
              </div>
              <div className="text-xl font-black text-white mt-1.5 font-mono">
                {loadingStats ? '25,347+' : (ownerInfo?.basicInfo?.liked?.toLocaleString() || '25,347')}
              </div>
            </div>

            {/* Battle Royale Ranking Points */}
            <div className="bg-slate-950/60 border border-emerald-500/25 rounded-2xl p-4 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/5 rounded-full blur-md" />
              <div className="text-[10px] font-mono text-slate-200 uppercase flex items-center gap-1.5 font-bold">
                <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                Rank Points
              </div>
              <div className="text-xl font-black text-white mt-1.5 font-mono">
                {loadingStats ? '14,152' : (ownerInfo?.basicInfo?.rankingPoints?.toLocaleString() || '14,152')}
              </div>
            </div>

            {/* Clan members */}
            <div className="bg-slate-950/60 border border-emerald-500/25 rounded-2xl p-4 shadow-sm relative group overflow-hidden col-span-2">
              <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/5 rounded-full blur-md" />
              <div className="text-[10px] font-mono text-slate-200 uppercase flex items-center gap-1.5 font-bold">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Clan Members
              </div>
              <div className="text-xl font-black text-white mt-1.5 font-mono">
                {loadingStats ? '54 / 55' : `${ownerInfo?.clanBasicInfo?.memberNum || 54} / ${ownerInfo?.clanBasicInfo?.capacity || 55}`}
              </div>
            </div>
          </div>

          {/* Social Signature Message */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-slate-200 uppercase tracking-widest block font-bold">Signature (Ukti)</span>
              <p className="text-xs text-white italic font-medium leading-relaxed">
                "{ownerInfo?.socialInfo?.signature || 'Nodir opor akash ure..!  :)'}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

