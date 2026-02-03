'use client';

import { Cross } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative py-12 px-4 text-center">
      {/* Decorative glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Cross icon */}
        <div className="flex justify-center mb-4">
          <div className="float-animation p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-white/10">
            <Cross className="w-10 h-10 text-amber-400" />
          </div>
        </div>
        
        {/* Main title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-300 to-amber-400 bg-clip-text text-transparent">
          Vitanova 2026
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-purple-300/80 font-medium mb-2">
          Prayer Repository
        </p>
        
        {/* Organization */}
        <p className="text-sm text-gray-400 mb-6">
          by Jesus Youth SJCET
        </p>
        
        {/* Tagline */}
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-300/70 text-sm md:text-base leading-relaxed italic">
            &ldquo;Where two or three gather in my name, there am I with them.&rdquo;
            <span className="block mt-1 text-gray-500 text-xs">— Matthew 18:20</span>
          </p>
        </div>
        
        {/* Decorative line */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-400/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>
      </div>
    </header>
  );
}
