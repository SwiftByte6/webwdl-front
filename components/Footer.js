'use client';

import { Award, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const teamMembers = [
    { name: 'Piyush Gupta', role: 'Lead Developer & ML Engineer' },
    { name: 'Rohit Soneji', role: 'Stylometric Algorithm Research' },
    { name: 'Sukumar Sawant', role: 'Metadata & Privacy Systems' },
  ];

  return (
    <footer
      id="team"
      className="bg-slate-900 text-slate-100 border-t border-slate-800 relative py-12 md:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Department Info */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <span className="font-extrabold text-2xl text-white tracking-tight block">Deanonymizer</span>
              <span className="text-[11px] font-mono text-brand-orange font-bold uppercase tracking-wider">
                Academic Anonymity Audit Tool
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-medium">
              An academic privacy risk assessment platform built to quantify privacy exposure using feature extraction and metadata correlation.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md space-y-1 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-200 font-bold">
                <Award className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Vidyalankar Institute of Technology (VIT), Mumbai</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono pl-6">
                Department of Computer Engineering • Final Year Capstone Project
              </p>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div className="md:col-span-6 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">
              Quick Navigation
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-300">
              <li>
                <a href="#hero" className="hover:text-brand-orange transition-colors flex items-center gap-1.5 py-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Project Overview
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-brand-orange transition-colors flex items-center gap-1.5 py-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  3-Step Execution Roadmap
                </a>
              </li>
              <li>
                <a href="/risk-report" className="hover:text-brand-orange transition-colors flex items-center gap-1.5 py-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Risk Assessment Engine
                </a>
              </li>
              <li>
                <a href="#research" className="hover:text-brand-orange transition-colors flex items-center gap-1.5 py-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Academic Research Paper
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-4">
          <div>
            © 2026 <strong className="text-white font-bold">Deanonymizer Project</strong>. Vidyalankar Institute of Technology.
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-slate-300">
            {teamMembers.map((m, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span>{m.name}</span>
                {idx < teamMembers.length - 1 && <span className="text-slate-600">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
