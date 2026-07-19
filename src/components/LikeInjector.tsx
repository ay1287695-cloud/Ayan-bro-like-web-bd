/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Globe, Cpu, Server, CheckCircle2, XCircle, ChevronDown, Sparkles, X, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVER_OPTIONS, ServerRegion, LikesResponse, HistoryItem } from '../types';
import { sfx } from '../utils/audio';

interface LikeInjectorProps {
  uid: string;
  onUidChange: (uid: string) => void;
  onSuccess: (item: HistoryItem) => void;
}

export const LikeInjector: React.FC<LikeInjectorProps> = ({ uid, onUidChange, onSuccess }) => {
  const [localUid, setLocalUid] = useState(uid);
  const [selectedServer, setSelectedServer] = useState<ServerRegion>('bd');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Injecting state
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectStep, setInjectStep] = useState(0);
  const [injectLogs, setInjectLogs] = useState<string[]>([]);
  
  // Success / Failure Output
  const [response, setResponse] = useState<LikesResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state
  useEffect(() => {
    setLocalUid(uid);
  }, [uid]);

  const currentServerOption = SERVER_OPTIONS.find((s) => s.code === selectedServer) || SERVER_OPTIONS[0];

  const handlePasteUid = async () => {
    sfx.playClick();
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/\D/g, '');
      if (cleaned) {
        setLocalUid(cleaned);
        onUidChange(cleaned);
      }
    } catch (err) {
      console.warn('Failed to read clipboard text:', err);
    }
  };

  const handleClearUid = () => {
    sfx.playClick();
    setLocalUid('');
    onUidChange('');
  };

  const triggerInjection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localUid.trim()) return;

    sfx.playClick();
    sfx.startInjectionSound();
    setIsInjecting(true);
    setResponse(null);
    setErrorMsg(null);
    setInjectStep(0);
    setInjectLogs([]);

    const steps = [
      'Establishing quantum tunnel to Garena Free Fire backend...',
      'Injecting proxy handshake to bypass Cloudflare firewall protection...',
      `Validating UID ${localUid} on regional server database: ${selectedServer.toUpperCase()} region...`,
      'Synchronizing remote packet buffer storage...',
      'Routing VIP high-tier visual reputation packets through API gateway...',
      'Finalizing cryptographic signatures and registering new likes count...'
    ];

    // Simulate cyber-hacking console logs
    for (let i = 0; i < steps.length; i++) {
      setInjectStep(i);
      setInjectLogs((prev) => [...prev, `[PROCESS] ${steps[i]}`]);
      // Progressive beep tones to represent loading sequences
      sfx.playBeep(650 + (i * 120), 0.08);
      await new Promise((resolve) => setTimeout(resolve, 850));
    }

    const apiUrl = `https://ayan-like-ob54.vercel.app/like?uid=${localUid}&server_name=${selectedServer}&key=JMLB`;

    try {
      let data: LikesResponse;
      // Try local server-side proxy first (CORS-free, extremely reliable)
      try {
        const res = await fetch(`/api/like?uid=${localUid}&server_name=${selectedServer}`);
        if (res.ok) {
          data = await res.json();
        } else {
          throw new Error(`Proxy status: ${res.status}`);
        }
      } catch (serverErr) {
        setInjectLogs((prev) => [...prev, '[SYS-WARN] Server proxy failed, trying direct public API...']);
        // Fallback 1: Direct public API fetch
        try {
          const res = await fetch(`https://ayan-like-ob54.vercel.app/like?uid=${localUid}&server_name=${selectedServer}&key=JMLB`, { mode: 'cors' });
          data = await res.json();
        } catch (directError) {
          setInjectLogs((prev) => [...prev, '[SYS-WARN] Direct fetch blocked by CORS. Activating Vercel proxy tunnel...']);
          
          // Fallback 2: AllOrigins CORS proxy bypass
          const targetUrl = `https://ayan-like-ob54.vercel.app/like?uid=${localUid}&server_name=${selectedServer}&key=JMLB`;
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
          const res = await fetch(proxyUrl);
          data = await res.json();
        }
      }

      if (data && (data.status === 1 || data.LikesafterCommand !== undefined)) {
        setResponse(data);
        sfx.playSuccess();
        
        // Create history item
        const historyItem: HistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          uid: localUid,
          serverName: selectedServer,
          playerNickname: data.PlayerNickname || '—͞UNKNOWN PLAYER',
          likesSent: data.LikesGivenByAPI || 6,
          likesBefore: data.LikesbeforeCommand || 0,
          likesAfter: data.LikesafterCommand || 0,
          timestamp: Date.now(),
          status: 'success',
          message: data.remains ? `Remains: ${data.remains}` : 'Injected'
        };
        onSuccess(historyItem);
      } else {
        const errText = data.message || data.error || 'Daily limit reached or account already liked today!';
        setErrorMsg(errText);
        sfx.playError();
        
        const historyItem: HistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          uid: localUid,
          serverName: selectedServer,
          playerNickname: 'Unknown Player',
          likesSent: 0,
          likesBefore: 0,
          likesAfter: 0,
          timestamp: Date.now(),
          status: 'failed',
          message: errText
        };
        onSuccess(historyItem);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('API Gateway Connection timed out. Please try again later.');
      sfx.playError();
    } finally {
      sfx.stopInjectionSound();
      setIsInjecting(false);
    }
  };

  const likesAdded = response
    ? (response.LikesafterCommand && response.LikesbeforeCommand
        ? response.LikesafterCommand - response.LikesbeforeCommand
        : response.LikesGivenByAPI || 6)
    : 6;

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-orange-500/20 p-6 shadow-[0_0_25px_rgba(249,115,22,0.05)] backdrop-blur-md space-y-6" id="like-injector-container">
      {/* Title Header */}
      <div>
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 flex items-center gap-2">
          <Heart className="w-5 h-5 text-orange-400 animate-pulse" />
          VIP Garena Auto-Likes Injector
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Instantly dispatch VIP high-rank game likes to boost player profiles. Safe, fully secure, and OB54 compliant.
        </p>
      </div>

      {/* Main Submission Form */}
      {!isInjecting && !response && !errorMsg && (
        <form onSubmit={triggerInjection} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UID Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Player UID
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  value={localUid}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setLocalUid(cleaned);
                    onUidChange(cleaned);
                  }}
                  placeholder="Enter Player UID"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl pl-4 pr-14 sm:pr-32 py-3 text-sm font-mono tracking-wider outline-none transition-all placeholder-slate-700"
                />
                
                {/* Control buttons inside the input wrapper */}
                <div className="absolute right-2 flex items-center gap-1.5">
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
                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-mono font-bold"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[9px]">PASTE</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Server Dropdown Field */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Regional Server
              </label>
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg leading-none">{currentServerOption.flag}</span>
                  <span>{currentServerOption.name} ({currentServerOption.code.toUpperCase()})</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 mt-1.5 max-h-48 overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-20 scrollbar-thin scrollbar-thumb-slate-800"
                  >
                    {SERVER_OPTIONS.map((srv) => (
                      <button
                        key={srv.code}
                        type="button"
                        onClick={() => {
                          setSelectedServer(srv.code);
                          setDropdownOpen(false);
                          sfx.playClick();
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                          selectedServer === srv.code
                            ? 'bg-orange-500/10 text-orange-400 font-bold'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <span className="text-base">{srv.flag}</span>
                        <span>{srv.name} ({srv.code.toUpperCase()})</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            Inject VIP Likes Packets
          </button>
        </form>
      )}

      {/* Injecting Terminal Console Screen */}
      {isInjecting && (
        <div className="bg-black/95 rounded-3xl p-6 border border-orange-500/40 font-mono text-xs text-orange-400 space-y-6 shadow-[0_0_40px_rgba(249,115,22,0.18)] relative overflow-hidden min-h-[300px]">
          {/* Cyber scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(249,115,22,0.06)_50%)] bg-[size:100%_4px] pointer-events-none z-10 animate-pulse" />
          
          <div className="flex items-center justify-between border-b border-orange-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
              <span className="text-[10px] uppercase tracking-widest font-black text-orange-400">CYBER PACKET TRANSMISSION ACTIVE</span>
            </div>
            <span className="text-[10px] text-orange-500/60 uppercase font-bold">PORT: OB54-SECURE</span>
          </div>

          {/* Grid Layout: Left is typewriter logs, Right is interactive SVG sonar radar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Logs Area */}
            <div className="md:col-span-8 space-y-3 max-h-[180px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-500/20">
              {injectLogs.map((log, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  key={index}
                  className="leading-relaxed flex items-start gap-2 text-[11px]"
                >
                  <span className="text-orange-500/60 font-black select-none shrink-0">&gt;&gt;</span>
                  <span className="flex-1 tracking-wide font-medium">{log}</span>
                </motion.div>
              ))}
              
              <div className="flex items-center gap-2 mt-2 text-orange-400/70 animate-pulse text-[10px] font-bold">
                <span className="inline-block w-2.5 h-4 bg-orange-500 animate-bounce shrink-0" />
                <span className="uppercase tracking-widest">PROPAGATING SIGNAL PACKETS...</span>
              </div>
            </div>

            {/* Radar Sweep Interactive Animation */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-2 relative">
              <div className="w-28 h-28 rounded-full border border-orange-500/30 relative flex items-center justify-center bg-orange-950/10 shadow-[0_0_20px_rgba(249,115,22,0.05)]">
                {/* Sonar sweep rotating line */}
                <div className="absolute inset-0 w-full h-full rounded-full animate-spin [animation-duration:3s] origin-center z-10 pointer-events-none">
                  <div className="w-1/2 h-full bg-gradient-to-r from-orange-500/30 to-transparent" style={{ transform: 'rotate(90deg)', transformOrigin: 'right center' }} />
                </div>
                {/* Nested pulsing circles */}
                <div className="absolute w-20 h-20 rounded-full border border-orange-500/20 animate-ping [animation-duration:1.5s]" />
                <div className="absolute w-12 h-12 rounded-full border border-orange-500/40" />
                <div className="absolute w-4 h-4 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
                {/* Cyber coordinates text */}
                <div className="absolute -bottom-4 text-[9px] font-mono text-orange-500/80 uppercase font-black tracking-widest">
                  SYNCING...
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-orange-500/15">
            <div className="flex justify-between text-[10px] font-black text-orange-400">
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-orange-500" />
                BYPASS GATEWAY: STABLE OB54
              </span>
              <span>{Math.round((injectStep + 1) * 16.6)}% COMPLETED</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-orange-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-amber-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(injectStep + 1) * 16.6}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Output Panel */}
      {response && (
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-b from-slate-950 to-slate-900 border border-emerald-500/50 rounded-3xl p-6 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.22)]"
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-400 font-mono tracking-widest uppercase">REPUTATION DISPATCH COMPLETED</h4>
                <div className="text-xl font-black text-white mt-0.5">UID: {response.UID || localUid}</div>
              </div>
            </div>
            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-black px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Heart className="w-4 h-4 fill-emerald-400" />
                VIP LIKES INJECTED
              </span>
            </div>
          </div>

          {/* User's request: Add Avatar Banner to success view */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-white uppercase tracking-widest block font-bold">
                TARGET IN-GAME AVATAR BANNER
              </span>
              <div className="relative w-full rounded-xl overflow-hidden border border-emerald-500/40 bg-black/80 min-h-[100px] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent bg-[length:100%_4px] pointer-events-none z-10" />
                <img
                  src={`https://nirob-free-fire-baner.vercel.app/profile?uid=${response.UID || localUid}`}
                  alt="Player Banner Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain select-none"
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).classList.add('opacity-100');
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://nirob-free-fire-baner.vercel.app/profile?uid=2279016714`;
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Player details grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block font-bold">Nickname</span>
                  <div className="text-base font-black text-white uppercase flex items-center gap-2 truncate">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                    {response.PlayerNickname || '—͞UNKNOWN'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block font-bold">API Pool</span>
                  <div className="text-[10px] font-black font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg inline-block">
                    {response.remains || '84/90 Left'}
                  </div>
                </div>
              </div>

              {/* Transaction Summary Card */}
              <div className="bg-slate-900/95 border border-emerald-500/20 rounded-2xl p-3 flex flex-row items-center justify-between gap-2 text-left">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Before</span>
                  <div className="text-xl font-black font-mono text-slate-300">
                    {response.LikesbeforeCommand?.toLocaleString() || '0'}
                  </div>
                </div>

                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider mb-0.5">
                    VIP
                  </span>
                  <span className="text-emerald-400 text-lg font-bold">➔</span>
                </div>

                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">After</span>
                  <div className="text-2xl font-black font-mono text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    {response.LikesafterCommand?.toLocaleString() || 'Injected'}
                  </div>
                </div>
              </div>

              {/* Explicit explanation card */}
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[10px] text-slate-200 leading-relaxed font-mono">
                <span className="text-emerald-400 font-extrabold mr-1.5">[✔] SUCCESS:</span>
                Apnar ager like chilo <span className="text-slate-300 font-bold">{response.LikesbeforeCommand || '0'}</span> ti, notun <span className="text-emerald-400 font-black font-mono">VIP</span> like sofolvabe juktto hoyeche, bortomane mot like dariyeche <span className="text-emerald-400 font-bold">{response.LikesafterCommand || 'Injected'}</span> ti!
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              setResponse(null);
            }}
            className="w-full py-4 bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-400 font-black text-xs rounded-xl cursor-pointer transition-all font-mono uppercase tracking-widest text-center shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"
          >
            Clear and Inject likes again
          </button>
        </motion.div>
      )}

      {/* Failure Output Panel */}
      {errorMsg && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-950/20 border border-red-500/40 rounded-2xl p-5 space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
        >
          <div className="flex gap-3">
            <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-400 font-mono">REPUTATION INJECTION DENIED</h4>
              <p className="text-xs text-slate-400 mt-0.5">UID: {localUid}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 font-mono text-xs text-red-400">
            {errorMsg}
          </div>

          <div className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-950/30 p-2.5 rounded-lg border border-slate-900">
            <span className="text-orange-500 font-bold">VIP NOTE:</span> Garena servers enforce a rate limit of <span className="text-slate-300">90 Likes per Day</span> per account. If you received this block, either the day's total quota has finished, or you have already requested likes for this UID. Please wait 24 hours.
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              setErrorMsg(null);
            }}
            className="w-full py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl cursor-pointer transition-colors font-mono uppercase tracking-wider text-center"
          >
            Reset bypass parameters
          </button>
        </motion.div>
      )}
    </div>
  );
};
