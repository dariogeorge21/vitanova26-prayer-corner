'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: {
    type: 'text' | 'links' | 'modal-links';
    english?: string;
    malayalam?: string;
    links?: {
      english?: string;
      malayalam?: string;
    };
  };
}

export default function PrayerModal({ isOpen, onClose, title, content }: PrayerModalProps) {
  const [language, setLanguage] = useState<'english' | 'malayalam'>('english');

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasEnglish = content.english || content.links?.english;
  const hasMalayalam = content.malayalam || content.links?.malayalam;
  const showLanguageToggle = hasEnglish && hasMalayalam;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-b border-white/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              
              {/* Language Toggle */}
              {showLanguageToggle && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setLanguage('english')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      language === 'english'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('malayalam')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      language === 'malayalam'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    മലയാളം
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(80vh-120px)] px-6 py-6">
              {content.type === 'text' && (
                <motion.div
                  key={language}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-invert max-w-none"
                >
                  <p className="text-white/90 whitespace-pre-line leading-relaxed text-lg">
                    {language === 'english' ? content.english : content.malayalam}
                  </p>
                </motion.div>
              )}

              {(content.type === 'links' || content.type === 'modal-links') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {content.type === 'modal-links' && showLanguageToggle && (
                    <div className="space-y-3">
                      {language === 'english' && content.links?.english && (
                        <button
                          onClick={() => openLink(content.links!.english!)}
                          className="w-full px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-white/20 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:shadow-purple-500/20"
                        >
                          Open English Prayer Guide
                        </button>
                      )}
                      {language === 'malayalam' && content.links?.malayalam && (
                        <button
                          onClick={() => openLink(content.links!.malayalam!)}
                          className="w-full px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-white/20 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:shadow-purple-500/20"
                        >
                          മലയാളം പ്രാർത്ഥന ഗൈഡ് തുറക്കുക
                        </button>
                      )}
                    </div>
                  )}

                  {content.type === 'links' && (
                    <div className="space-y-3">
                      {content.links?.english && (
                        <button
                          onClick={() => openLink(content.links!.english!)}
                          className="w-full px-6 py-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-white/20 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:shadow-amber-500/20"
                        >
                          Open Prayer Resource
                        </button>
                      )}
                      {content.links?.malayalam && (
                        <button
                          onClick={() => openLink(content.links!.malayalam!)}
                          className="w-full px-6 py-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-white/20 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:shadow-amber-500/20"
                        >
                          മലയാളം റിസോഴ്സ് തുറക്കുക
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
