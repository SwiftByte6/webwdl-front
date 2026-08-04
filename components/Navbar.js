'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, FileText, ArrowRight, Activity, Cpu } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-3 shadow-md text-slate-900'
          : 'bg-darkorange-950/40 backdrop-blur-sm py-4 border-b border-transparent text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-lg tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                  Deanonymizer
                </span>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-badge font-semibold ${
                  scrolled 
                    ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                    : 'bg-darkorange-900 text-orange-300 border border-orange-800'
                }`}>
                  Academic v1.0
                </span>
              </div>
              <p className={`text-[11px] hidden sm:block font-medium ${scrolled ? 'text-slate-500' : 'text-orange-200/70'}`}>
                Vidyalankar Institute of Technology
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className={`hidden md:flex items-center gap-6 text-xs font-semibold ${scrolled ? 'text-slate-700' : 'text-orange-100/90'}`}>
            <button
              onClick={() => scrollToSection('workflow')}
              className="hover:text-brand-orange transition-colors py-1"
            >
              Workflow
            </button>
            <button
              onClick={() => scrollToSection('analyzer')}
              className="hover:text-brand-orange transition-colors py-1 flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-brand-orange" />
              Risk Analyzer
            </button>
            <button
              onClick={() => scrollToSection('research')}
              className="hover:text-brand-orange transition-colors py-1 flex items-center gap-1.5"
            >
              <FileText className={`w-3.5 h-3.5 ${scrolled ? 'text-slate-400' : 'text-orange-300/70'}`} />
              Research Paper
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="hover:text-brand-orange transition-colors py-1"
            >
              Team & Info
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                scrolled 
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900' 
                  : 'border-orange-500/40 text-orange-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Sign In
            </a>
            <a
              href="#analyzer"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('analyzer');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white transition-all shadow-glow hover:shadow-glow-lg border border-brand-orange/60"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
