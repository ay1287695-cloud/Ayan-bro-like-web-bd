/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Trash2, Heart, Search, Check, AlertTriangle, ArrowRight, X, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HistoryItem, SERVER_OPTIONS } from '../types';
import { sfx } from '../utils/audio';

interface RecentInjectionsProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectUid: (uid: string) => void;
}

export const RecentInjections: React.FC<RecentInjectionsProps> = ({
  history,
  onClearHistory,
  onSelectUid,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleSelect = (uid: string) => {
    sfx.playSuccess();
    onSelectUid(uid);
  };

  const handleClearConfirmed = () => {
    sfx.playClick();
    onClearHistory();
    setShowConfirmClear(false);
  };

  const getFlag = (code: string) => {
    return SERVER_OPTIONS.find((s) => s.code === code)?.flag || '🌐';
  };

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-4" id="recent-injections-container">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" />
          <h3 className="text-base font-bold text-slate-200">Recent Injections History</h3>
        </div>
        {history.length > 0 && (
          <div className="flex items-center gap-2">
            {!showConfirmClear ? (
              <button
                onClick={() => {
                  sfx.playClick();
                  setShowConfirmClear(true);
                }}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-red-500/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Logs
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-950/20 border border-red-500/20 px-2 py-1 rounded-xl">
                <span className="text-[10px] text-red-400 font-mono font-bold uppercase">Confirm?</span>
                <button
                  onClick={handleClearConfirmed}
                  className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[9px] font-bold uppercase cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    sfx.playClick();
                    setShowConfirmClear(false);
                  }}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold uppercase cursor-pointer"
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center">
          <History className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <span className="text-xs font-mono text-slate-500 block">No recent injections logged in this browser cache</span>
          <p className="text-[10px] text-slate-600 max-w-xs mx-auto mt-1 font-mono">
            Logs of your query outputs and like requests will populate here.
          </p>
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 transition-all ${
                  item.status === 'success'
                    ? 'bg-emerald-950/5 border-emerald-500/10 hover:border-emerald-500/20'
                    : 'bg-red-950/5 border-red-500/10 hover:border-red-500/20'
                }`}
              >
                {/* Left metadata info */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Status Indicator circle badge */}
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      item.status === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {item.status === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div className="space-y-0.5 truncate flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-200 truncate uppercase tracking-tight">
                        {item.playerNickname}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1 bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                        {getFlag(item.serverName)} {item.serverName.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <span>UID: {item.uid}</span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Right actions and stats info */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-slate-900 sm:border-0">
                  {item.status === 'success' ? (
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-0.5 justify-end font-bold">
                        <Heart className="w-3 h-3 fill-emerald-500" /> +6 Likes
                      </span>
                      <div className="text-[9px] font-mono text-slate-500">
                        {item.likesBefore} → <span className="text-emerald-400">{item.likesAfter}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-red-400 font-bold block">
                        Injection Denied
                      </span>
                      <div className="text-[8px] font-mono text-slate-600 truncate max-w-[120px]" title={item.message}>
                        {item.message || 'Error'}
                      </div>
                    </div>
                  )}

                  {/* Load UID back to search/inspect button */}
                  <button
                    onClick={() => handleSelect(item.uid)}
                    className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono hover:bg-slate-800"
                    title="Load player to inspect & inject"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Load
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
