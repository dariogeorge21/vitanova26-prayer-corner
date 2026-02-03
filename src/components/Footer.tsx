'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pb-12 px-4">
      {/* --- DECORATIVE TOP BORDER --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative pt-12">
        {/* Subtle Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/5 blur-[80px] -z-10" />

        <div className="flex flex-col items-center gap-8 text-center">
          
          {/* PRAYER INTENTION SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
          >
            <Sparkles size={14} className="text-purple-400 group-hover:scale-110 transition-transform" />
            <p className="text-slate-400 text-xs md:text-sm font-light tracking-wide">
              Standing together in intercession for <span className="text-slate-200 font-medium">Vitanova 2026</span>
            </p>
          </motion.div>
          
          {/* LINKS & BRANDING */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            {/* Branding */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
                Jesus Youth SJCET
              </span>
            </div>

            {/* Admin Link */}
            <Link 
              href="/admin" 
              className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-purple-400 transition-all duration-300"
            >
              <Shield size={12} className="opacity-50 group-hover:opacity-100" />
              <span>Admin Access</span>
            </Link>
          </div>
          
          {/* COPYRIGHT / CREDITS */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={10} className="fill-purple-500/50 text-purple-500" />
              </motion.div>
              <span>for the Kingdom</span>
            </div>
            
            <p className="text-[10px] text-slate-700 font-light">
              &copy; {currentYear} Vitanova Repository • All spiritual fruits reserved
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}