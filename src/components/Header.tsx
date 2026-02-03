'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative pt-16 pb-12 px-4 overflow-hidden">
      {/* --- LAYERED BACKGROUND GLOWS --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Primary Purple Glow */}
        <div className="w-[500px] h-[300px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        {/* Secondary Amber Glow for Warmth */}
        <div className="absolute top-0 w-[300px] h-[200px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        
        {/* LOGO with Floating Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group mb-8"
        >
          {/* Subtle back-glow for logo */}
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Image 
              src="/logo.png" 
              alt="Vitanova Logo" 
              width={260} 
              height={260} 
              className="drop-shadow-[0_0_30px_rgba(168,85,247,0.4)] brightness-110"
              priority
            />
          </motion.div>
        </motion.div>

        {/* TITLES & SUBTITLES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-purple-300 font-bold">
              Vitanova 2026
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Prayer Repository
          </h1>
          
          <p className="text-sm text-slate-400 tracking-wide font-light">
            An initiative by <span className="text-slate-200 font-normal">Jesus Youth SJCET</span>
          </p>
        </motion.div>

        {/* BIBLE VERSE - Styled as a premium callout */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 max-w-xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm" />
          <blockquote className="relative px-8 py-4">
            <p className="text-slate-300/90 text-sm md:text-base leading-relaxed italic font-light">
              &ldquo;Come to me, all who are weary and burdened, and I will give you rest.&rdquo;
            </p>
            <cite className="not-italic block mt-3 text-[10px] tracking-[0.2em] uppercase text-slate-500 font-medium">
              — Matthew 11:28-29
            </cite>
          </blockquote>
        </motion.div>
        
        {/* DECORATIVE DIVIDER */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 blur-sm animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" />
          </div>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        </div>
      </div>
    </header>
  );
}