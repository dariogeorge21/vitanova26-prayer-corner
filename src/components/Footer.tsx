'use client';

export default function Footer() {
  return (
    <footer className="py-8 px-4 text-center border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Prayer intention */}
        <p className="text-gray-400 text-sm mb-4">
          🙏 Let us continue to pray for the success of Vitanova 2026
        </p>
        
        {/* Links */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <a 
            href="/admin" 
            className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
          >
            Admin
          </a>
          <span className="text-gray-700">•</span>
          <span className="text-xs text-gray-500">
            Jesus Youth SJCET
          </span>
        </div>
        
        {/* Copyright */}
        <p className="text-xs text-gray-600">
          Made with ❤️ for Vitanova 2026
        </p>
      </div>
    </footer>
  );
}
