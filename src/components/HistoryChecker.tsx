/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Search, Heart, Clock, ArrowUpRight, ShieldCheck, Sparkles, Image, Trophy, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HistoryItem, SERVER_OPTIONS } from '../types';
import { sfx } from '../utils/audio';

interface HistoryCheckerProps {
  history: HistoryItem[];
  onSelectUid: (uid: string) => void;
}

export const HistoryChecker: React.FC<HistoryCheckerProps> = ({ history, onSelectUid }) => {
  // Extract all unique UIDs from history
  const uniqueUids: string[] = Array.from(new Set(history.map((item) => item.uid)));
  
  // Default selected UID to the first one available, or empty
  const [selectedUid, setSelectedUid] = useState<string>(uniqueUids[0] || '');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Filter history for the selected UID
  const playerLogs = history.filter((item) => item.uid === selectedUid);
  
  // Find player nickname if available in success logs
  const lastSuccessLog = playerLogs.find((item) => item.status === 'success');
  const playerNickname = lastSuccessLog ? lastSuccessLog.playerNickname : (playerLogs[0]?.playerNickname || 'UNKNOWN PLAYER');
  
  // Calculate aggregate VIP likes injected
  const totalLikesGained = playerLogs
    .filter((item) => item.status === 'success')
    .reduce((sum, item) => sum + (item.likesSent || 6), 0);

  const handleUidChange = (uid: string) => {
    sfx.playClick();
    setSelectedUid(uid);
    setImageLoaded(false);
  };

  const handleLoadToInspector = () => {
    sfx.playSuccess();
    onSelectUid(selectedUid);
  };

  const getFlag = (code: string) => {
    return SERVER_OPTIONS.find((s) => s.code === code)?.flag || '🌐';
  };

  return (
    <div className="rounded-3xl bg-slate-950/90 border border-amber-500/30 p-6 shadow-[0_0_40px_rgba(245,158,11,0.08)] backdrop-blur-md space-y-6" id="history-checker-container">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Premium VIP History Checker
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Analyze historical like dispatches, track increments, and verify saved player database records.
          </p>
        </div>
        <span className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest animate-pulse">
          DATABASE ONLINE
        </span>
      </div>

      {uniqueUids.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <History className="w-10 h-10 text-slate-700 mx-auto" />
          <span className="text-sm font-mono text-slate-400 block font-bold">No historical dispatches found</span>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Please run the VIP Likes Injector on at least one player UID to generate active database records.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selector bar */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              Select Player UID from database:
            </label>
            <div className="flex flex-wrap gap-2">
              {uniqueUids.map((uid) => {
                const isSelected = selectedUid === uid;
                const log = history.find((h) => h.uid === uid);
                return (
                  <button
                    key={uid}
                    onClick={() => handleUidChange(uid)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {uid} ({log?.playerNickname.substring(0, 10) || 'Player'})
                  </button>
                );
              })}
            </div>
          </div>

          {selectedUid && (
            <div className="space-y-6">
              {/* Massive crop of the Garena live banner image */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  DATABASE LIVE AVATAR PREVIEW
                </span>
                <div className="relative w-full rounded-xl overflow-hidden border border-amber-500/25 bg-black/90 aspect-[4.8/1] min-h-[75px] flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/2 to-transparent bg-[length:100%_4px] pointer-events-none z-10" />
                  
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-1.5 z-10">
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[8px] text-amber-500/60 font-mono">RETRIEVING ENCRYPTED ASSET...</span>
                    </div>
                  )}

                  <img
                    src={`https://nirob-free-fire-baner.vercel.app/profile?uid=${selectedUid}`}
                    alt="Player Database Banner"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-auto object-cover max-h-[140px] select-none transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-20'}`}
                  />
                </div>
              </div>

              {/* Player snapshot header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">TARGET PROFILE NAME</span>
                  <div className="text-base font-black text-white uppercase truncate flex items-center gap-1.5 mt-1">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                    {playerNickname}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold font-mono">TOTAL LIKES DELIVERED</span>
                  <div className="text-base font-black text-emerald-400 font-mono flex items-center gap-1.5 mt-1">
                    <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500 animate-pulse" />
                    +{totalLikesGained} VIP LIKES
                  </div>
                </div>

                <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-center">
                  <button
                    onClick={handleLoadToInspector}
                    className="w-full py-2 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/25 hover:border-amber-400/40 text-amber-400 hover:text-amber-200 text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Load to Inspector
                  </button>
                </div>
              </div>

              {/* Transaction list block */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  TRANSACTION LOGS ({playerLogs.length})
                </span>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-900">
                  {playerLogs.map((log) => {
                    const isSuccess = log.status === 'success';
                    return (
                      <div
                        key={log.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs ${
                          isSuccess
                            ? 'bg-emerald-950/5 border-emerald-500/15'
                            : 'bg-red-950/5 border-red-500/15'
                        }`}
                      >
                        {/* Left metadata */}
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg shrink-0 ${isSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {isSuccess ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-black text-xs ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isSuccess ? `+${log.likesSent} LIKES INJECTED` : 'DISPATCH BLOCKED'}
                              </span>
                              <span className="text-[9px] text-slate-500 bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                                {getFlag(log.serverName)} {log.serverName.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-600" />
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right values */}
                        <div className="sm:text-right pt-2 sm:pt-0 border-t border-slate-900 sm:border-0 w-full sm:w-auto">
                          {isSuccess ? (
                            <div className="text-[11px] text-slate-300">
                              Ager Like: <span className="text-slate-400">{log.likesBefore}</span> ➔ Bortoman Like: <span className="text-emerald-400 font-black">{log.likesAfter}</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-red-400 truncate max-w-[250px]" title={log.message}>
                              Karon (Reason): {log.message}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
