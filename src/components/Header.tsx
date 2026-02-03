'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative py-12 px-4 text-center">
      {/* Decorative glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Vitanova Logo" width={240} height={240} />
          
        </div>
        
        
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
            &ldquo;Come to me, all who are weary and burdened, and I will give you rest.&rdquo;
            <span className="block mt-1 text-gray-500 text-xs">— Matthew 11:28-29</span>
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
