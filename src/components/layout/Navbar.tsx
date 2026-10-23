import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (defaultRole?: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigateSection }) => {
  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 transition-all">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_24px_rgba(20,60,40,0.07)] border border-[#E3EDE5] flex items-center justify-between gap-4">
        {/* Brand: Circular green badge with serif wordmark */}
        <button
          onClick={() => onNavigateSection('top')}
          className="flex items-center gap-3 text-left shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#185339] flex items-center justify-center text-white shadow-sm shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-serif font-bold text-sm tracking-wide text-[#11231A] leading-none">
              APAAR
            </div>
            <div className="text-[9px] font-mono tracking-widest text-[#5A7063] uppercase mt-0.5 font-medium">
              SMARTVERIFY AI
            </div>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#405347]">
          <button
            onClick={() => onNavigateSection('how-it-works')}
            className="hover:text-[#185339] transition-colors whitespace-nowrap cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => onNavigateSection('platform')}
            className="hover:text-[#185339] transition-colors whitespace-nowrap cursor-pointer"
          >
            Platform
          </button>
          <button
            onClick={() => onNavigateSection('analytics')}
            className="hover:text-[#185339] transition-colors whitespace-nowrap cursor-pointer"
          >
            Analytics
          </button>
          <button
            onClick={() => onNavigateSection('trust-security')}
            className="hover:text-[#185339] transition-colors whitespace-nowrap cursor-pointer"
          >
            Trust & security
          </button>
        </nav>

        {/* Right Actions: Sign in + Explore the platform button */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onOpenAuth()}
            className="text-xs font-semibold text-[#11231A] hover:text-[#185339] transition-colors cursor-pointer px-1 py-1"
          >
            Sign in
          </button>
          <button
            onClick={() => onOpenAuth('institution_admin')}
            className="px-4 sm:px-5 py-2 bg-[#185339] hover:bg-[#12422D] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Explore the platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
