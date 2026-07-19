/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Sparkles, Trophy, X, Wrench, Cpu, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ayanAvatarImg from './assets/images/ayan_game_avatar_1784459798703.jpg';
import { HistoryItem } from './types';
import { AyanDeveloperCard } from './components/AyanDeveloperCard';
import { ProfileViewer } from './components/ProfileViewer';
import { LikeInjector } from './components/LikeInjector';
import { RecentInjections } from './components/RecentInjections';
import { HistoryChecker } from './components/HistoryChecker';
import { FAQ } from './components/FAQ';
import { sfx } from './utils/audio';
import { CONFIG } from './config';

export default function App() {
  const [activeUid, setActiveUid] = useState<string>('2279016714');
  const [searchedUid, setSearchedUid] = useState<string>('2279016714');
  const [loadTrigger, setLoadTrigger] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // Enable sound by default so users get instant dynamic feedback
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Sync Audio system state on mount & add global tactical tap sound listeners
  useEffect(() => {
    sfx.toggle(soundEnabled);

    const handleFirstInteraction = () => {
      // Resume AudioContext on first tap/click to bypass browser auto-play blocks
      sfx.toggle(true);
      // Play girl's welcome voice greeting Ayan and users to the website!
      sfx.playWelcomeVoice();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    // Dynamic global listener for tactile tap sounds on all buttons/clickable elements
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('a'))
      ) {
        sfx.playClick();
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Monitor soundEnabled changes
  useEffect(() => {
    sfx.toggle(soundEnabled);
  }, [soundEnabled]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ayan_ff_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load local history log:', e);
    }
  }, []);

  // Save history to localStorage
  const handleAddHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 50); // Keep max 50 logs
    setHistory(updated);
    try {
      localStorage.setItem('ayan_ff_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history log:', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('ayan_ff_history');
    } catch (e) {
      console.error('Failed to clear history log:', e);
    }
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      sfx.playSuccess();
    }
  };

  const handleLoadUid = (uid: string) => {
    setActiveUid(uid);
    setSearchedUid(uid);
    setLoadTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-orange-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* High-end Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      
      {/* Premium Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Modern, Clean & Centered Header Navbar */}
      <header className="relative bg-slate-950/40 border-b border-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {CONFIG.HEADER_LOGO_URL ? (
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                {/* Outer spinning neon glow ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 rounded-full animate-spin [animation-duration:3s]" />
                {/* Pulsing background soft glow shadow */}
                <div className="absolute -inset-1 sm:-inset-1.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 rounded-full opacity-70 blur-md animate-pulse" />
                {/* Secondary opposite spinning ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  className="absolute inset-0.5 rounded-full border border-dashed border-emerald-300/60"
                />
                {/* Inner image container masking */}
                <div className="relative w-[34px] h-[34px] sm:w-[48px] sm:h-[48px] rounded-full p-[1.5px] bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={CONFIG.HEADER_LOGO_URL}
                    alt="Custom Header Logo"
                    referrerPolicy="no-referrer"
                    className={
                      CONFIG.HEADER_LOGO_URL.includes('nirob-free-fire-baner')
                        ? "absolute left-0 top-0 h-full w-[480%] max-w-none object-cover object-left rounded-full select-none"
                        : "w-full h-full object-cover rounded-full select-none"
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="p-1.5 sm:p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 uppercase whitespace-nowrap truncate">
                AYAN'S FF VIP HUB
              </h1>
              <p className="text-[7px] sm:text-[9px] font-mono text-slate-500 tracking-wider uppercase whitespace-nowrap truncate">
                PREMIUM REPUTATION & PROFILE DISPATCH
              </p>
            </div>
          </div>

          {/* Clean Sound Controller toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sfx.playClick();
                setIsHistoryOpen(true);
              }}
              className="px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border bg-slate-900 border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-extrabold text-[8px] sm:text-xs tracking-widest uppercase flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
              title="Open VIP History Checker Database"
            >
              <Trophy className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span>
                <span className="hidden sm:inline">HISTORY CHECKER</span>
                <span className="sm:hidden">HISTORY</span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border text-[8px] sm:text-xs font-extrabold tracking-widest uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
                soundEnabled
                  ? 'bg-slate-900 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:border-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 animate-pulse text-emerald-400 shrink-0" />
                  <span>
                    <span className="hidden sm:inline">SOUNDS: ACTIVE</span>
                    <span className="sm:hidden">SOUND: ON</span>
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-slate-500 shrink-0" />
                  <span>
                    <span className="hidden sm:inline">SOUNDS: MUTED</span>
                    <span className="sm:hidden">SOUND: OFF</span>
                  </span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content Arena (Strictly organized, "Pori Pati" & spacious layout) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8 z-10">
        
        {/* Dynamic Owner Card (Now dynamic, fetching real owner level, nickname, likes and signature) */}
        <AyanDeveloperCard onLoadUID={handleLoadUid} />

        {/* Unified Two-Column Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Card Inspector */}
          <div className="lg:col-span-5 space-y-6">
            <ProfileViewer
              uid={activeUid}
              onUidChange={setActiveUid}
              searchedUid={searchedUid}
              setSearchedUid={setSearchedUid}
              loadTrigger={loadTrigger}
              history={history}
            />
          </div>

          {/* Right Column: Auto-Likes Packets and Logs history */}
          <div className="lg:col-span-7 space-y-6">
            <LikeInjector
              uid={activeUid}
              onUidChange={setActiveUid}
              onSuccess={handleAddHistory}
            />
            
            <RecentInjections
              history={history}
              onClearHistory={handleClearHistory}
              onSelectUid={handleLoadUid}
            />
            
            <FAQ />
          </div>

        </div>

        {/* AYAN'S OFFICIAL IN-GAME CHARACTER & SECURE MASTER SERVICE */}
        <section className="bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.08)] relative overflow-hidden" id="ayan-master-service">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Master Service Details */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-black px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full uppercase tracking-widest inline-block mb-3 animate-pulse">
                  🛡️ 24/7 VIP MASTER SERVICE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                  AYAN FF SECURE MASTER SERVICE
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Jodi kono somossya ba ghatti thake, amader <span className="text-emerald-400 font-bold">VIP Master Service Engine</span> sorbodai sokriyo. Eti real-time OB54 packet delivery o server bypassing nishchit kore apnar ID-ke rakhe shotovag surokhito.
                </p>
              </div>

              {/* Bullet Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/80 border border-slate-900 rounded-2xl flex items-start gap-3 hover:border-emerald-500/20 transition-all group">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">OB54 Packet Sync</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">BD o IND server somuhe soyongkriovabe sothik packet sync kore like boost kore.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/80 border border-slate-900 rounded-2xl flex items-start gap-3 hover:border-emerald-500/20 transition-all group">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">Fail-Safe Tunnel</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Kono server line-e blockage ba spike dekha dile soyongkrio proxy bypass sokrio hoy.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/80 border border-slate-900 rounded-2xl flex items-start gap-3 hover:border-emerald-500/20 transition-all group">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">Anti-Ban Bypass</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Garena security filter ediye sompurno safe upaye apnar reputation bridhhi kore.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/80 border border-slate-900 rounded-2xl flex items-start gap-3 hover:border-emerald-500/20 transition-all group">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">24H Cooldown Check</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Protiti ID-te 24 ghanta por por sofolvabe punoray like neoyar jonno refresh hoy.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Custom Character Image Circular Spinning Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-[500px] flex items-center justify-center group">
                {/* Glowing pulse effect shadow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 rounded-3xl opacity-20 blur-2xl animate-pulse" />
                
                {/* Image Mask container */}
                <div className="relative w-full aspect-[21/9] rounded-3xl p-1.5 bg-slate-950 overflow-hidden flex items-center justify-center border-4 border-slate-900 shadow-2xl z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    src={ayanAvatarImg}
                    alt="Ayan Official FF Character Avatar"
                    className="w-full h-full object-cover rounded-2xl select-none"
                  />
                  {/* Cyber grid glass glare overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-extrabold tracking-widest uppercase mt-4 text-center block">
                —AYAN 友 OFFICIAL GAME AVATAR
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* Premium History Checker Overlay Modal */}
      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurred background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            
            {/* Modal Card wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-950/95 border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] z-10 scrollbar-thin scrollbar-thumb-slate-900"
            >
              {/* Close Button inside the modal card */}
              <button
                onClick={() => {
                  sfx.playClick();
                  setIsHistoryOpen(false);
                }}
                className="absolute top-5 right-5 p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer z-20"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Render the HistoryChecker directly inside the modal with custom callbacks */}
              <div className="pt-2">
                <HistoryChecker
                  history={history}
                  onSelectUid={(uid) => {
                    handleLoadUid(uid);
                    setIsHistoryOpen(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Classy Footer */}
      <footer className="relative bg-slate-950 border-t border-slate-900 mt-16 py-12 text-xs text-slate-500 font-mono z-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Status grid section inside footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/60 border border-slate-900 rounded-2xl p-5 shadow-inner">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">API GATEWAY</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[11px] text-slate-300 font-bold">100% OPERATIONAL</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">CORS BYPASS TUNNEL</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[11px] text-slate-300 font-bold">ACTIVE & LOADED</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">BYPASS LATENCY</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[11px] text-slate-300 font-bold">142ms (STABLE)</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">OB54 INTEGRITY</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[11px] text-slate-300 font-bold">VERIFIED SECURE</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-900">
            <div className="text-center md:text-left space-y-1">
              <p className="text-slate-200 font-extrabold uppercase tracking-widest text-sm flex items-center justify-center md:justify-start gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
                © 2026 AYAN FF VIP SYSTEM
              </p>
              <p className="text-[10px] text-slate-500 max-w-xl">
                This secure portal is engineered for high-performance Garena Free Fire reputation tracking and visual avatar verification. Created with clean visual patterns.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-bold">
                CLUSTER: VERCEL-BD-01
              </span>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] text-amber-400 font-extrabold">
                DESIGNED BY AYAN
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
