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
      question: 'আমি কীভাবে আমার গ্যারেনা ফ্রি ফায়ার UID খুঁজে পাবো?',
      answer: (
        <p className="text-xs leading-relaxed text-slate-400">
          ফ্রি ফায়ার গেমটি ওপেন করুন, লবির বাম কোণে থাকা আপনার প্লেয়ার প্রোফাইল ব্যানারে ট্যাপ করুন। 
          সেখানে আপনার নম্বর আইডি (যেমন: <code>2279016714</code>) দেখতে পাবেন এবং আইডি-টি কপি করার জন্য ডান পাশের কপি বাটনে চাপুন।
        </p>
      )
    },
    {
      question: 'এই লাইক ইঞ্জেক্টর সিস্টেমটি ব্যবহার করা কি সম্পূর্ণ নিরাপদ?',
      answer: (
        <p className="text-xs leading-relaxed text-slate-400">
          হ্যাঁ, এটি ১০০% নিরাপদ। আমাদের সিস্টেমে প্রোফাইল লাইক আপডেট করতে গ্যারেনা আঞ্চলিক বাইপাস গেটওয়ে ব্যবহার করা হয়। 
          এখানে আপনার কোনো অ্যাকাউন্ট লগইন, ইমেইল বা ফেসবুক পাসওয়ার্ডের প্রয়োজন হয় না। তাই আইডি সাসপেন্ড বা ব্যান হওয়ার কোনো ঝুঁকি নেই।
        </p>
      )
    },
    {
      question: 'প্রতিদিনের লাইক লিমিট (Like Limit) কত?',
      answer: (
        <p className="text-xs leading-relaxed text-slate-400">
          গ্যারেনা সার্ভার অনুযায়ী প্রতিটি ইউআইডিতে (UID) ২৪ ঘণ্টায় সর্বোচ্চ ৯০টি পর্যন্ত লাইক যুক্ত করা সম্ভব। 
          যদি কোনো কারণে আপনার ইনজেকশন ব্লক দেখায়, তাহলে বুঝতে হবে আপনার আজকের কোটা শেষ হয়ে গেছে অথবা পরের দিন পর্যন্ত অপেক্ষা করতে হবে।
        </p>
      )
    },
    {
      question: 'কেন প্লেয়ার কার্ড ব্যানার ইমেজ লোড হতে সমস্যা হচ্ছে?',
      answer: (
        <p className="text-xs leading-relaxed text-slate-400">
          প্লেয়ার ব্যানার সরাসরি গ্যারেনা রিয়েল-টাইম ডেটাবেস থেকে রেন্ডার হয়। যদি লোড হতে সমস্যা হয়, তাহলে আপনার UID-টি সঠিক আছে কি না এবং প্লেয়ারটি বিডি (BD) বা ইন্ডিয়া (IND) সার্ভারে সক্রিয় আছে কি না তা যাচাই করুন। সার্ভার ট্রাফিকের কারণেও সাময়িক দেরি হতে পারে।
        </p>
      )
    }
  ];

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-4" id="faq-accordion-container">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-slate-400" />
        <h3 className="text-base font-bold text-slate-200">হেল্প এবং সার্ভারের নিয়মাবলী (Help & Rules)</h3>
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
            <span className="text-[10px] font-bold text-amber-500 font-mono uppercase">ভিআইপি গ্র্যান্ডমাস্টার সুবিধা</span>
            <p className="text-[9px] text-slate-500 font-mono">বিডি (BD) এবং ইন্ডিয়া (IND) সার্ভারে ইনস্ট্যান্ট বুস্ট সুবিধা সক্রিয়।</p>
          </div>
        </div>
        <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-start gap-2">
          <Cpu className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-cyan-500 font-mono uppercase">এপিআই স্থায়িত্ব মনিটর</span>
            <p className="text-[9px] text-slate-500 font-mono">আমাদের বাইপাস গেটওয়ে ৯৯.৮% সচল রয়েছে।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
