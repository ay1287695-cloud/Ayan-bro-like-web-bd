/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Award, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sfx } from '../utils/audio';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    sfx.playClick();
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData: FAQItem[] = [
    {
      question: 'Ami kivabe amar Garena Free Fire UID khuje pabo?',
      answer: (
        <p className="text-xs leading-relaxed text-slate-400">
          Free Fire game-ti open korun, lobby-r bam kone thaka apnar player profile banner-e tap korun. 
          Sekhane apnar number ID (Jemon: <code>2279016714</code>) dekhte paben ebong ID-ti copy korar jonno dan pasher copy button-e chapun.
        </p>
      )
    },
    {
      question: 'Ei Like Injector system-ti byabohar kora ki sompurno nirapod?',
      answer: (
        <p className="text-xs leading-relaxed text-slate-400">
          Hya, eti 100% nirapod. Amader system-e profile like update korte Garena regional bypass gateway byabohar kora hoy. 
          Ekhane apnar kono account login, email ba Facebook password-er proyojon hoy na. Tai ID suspend ba ban hoar kono jhunki nei.
        </p>
      )
    },
    {
      question: 'Protidiner Like Limit koto?',
      answer: (
        <p className="text-xs leading-relaxed text-slate-400">
          Garena server onujayi protiti UID-te 24 ghantay sorbochcho 90-ti porjonto like juktto kora somvob. 
          Jodi kono karone apnar injection block dekhay, tahole bujhte hobe apnar ajker quota shesh hoye geche othoba porer din porjonto opekkha korte hobe.
        </p>
      )
    },
    {
      question: 'Keno player card banner image load hote somossya hochche?',
      answer: (
        <p className="text-xs leading-relaxed text-slate-400">
          Player banner shorasori Garena real-time database theke render hoy. Jodi load hote somossya hoy, tahole apnar UID-ti sothik ache ki na ebong player-ti BD ba IND server-e sokriyo ache ki na ta jachai korun. Server traffic-er karoneo samoyik deri hote pare.
        </p>
      )
    }
  ];

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-4" id="faq-accordion-container">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-slate-400" />
        <h3 className="text-base font-bold text-slate-200">Help ebong Server-er Niyomaboli (Help & Rules)</h3>
      </div>

      <div className="space-y-2.5">
        {faqData.map((item, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/10 transition-colors"
            >
              <button
                type="button"
                onClick={() => handleToggle(idx)}
                className="w-full text-left px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-300 hover:bg-slate-900/40 cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-3.5 pt-0.5 border-t border-slate-900 bg-slate-950/40">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Decorative Specs Alert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2">
          <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-amber-500 font-mono uppercase">VIP Grandmaster Subidha</span>
            <p className="text-[9px] text-slate-500 font-mono">BD ebong IND server-e instant boost subidha sokriyo.</p>
          </div>
        </div>
        <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-start gap-2">
          <Cpu className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-cyan-500 font-mono uppercase">API Sthayitto Monitor</span>
            <p className="text-[9px] text-slate-500 font-mono">Amader bypass gateway 99.8% shochol royeche.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
