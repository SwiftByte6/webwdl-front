'use client';

import { ShieldCheck, Award, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const teamMembers = [
    { name: 'Piyush Gupta', role: 'Lead Developer & ML Engineer' },
    { name: 'Rohit Soneji', role: 'Stylometric Algorithm Research' },
    { name: 'Sukumar Sawant', role: 'Metadata & Privacy Systems' },
  ];

  return (
    <footer 
      id="team" 
      className="min-h-[50vh] md:min-h-[60vh]  text-black relative overflow-hidden flex flex-col justify-between pt-16 md:pt-20 pb-8"
    >
    
    <div 
    className="absolute inset-0 h-full w-full"
    >

      <Image/>
    </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-between space-y-12">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Department Info */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 border border-brand-orange/40 flex items-center justify-center text-brand-orange shadow-[0_0_20px_rgba(255,87,34,0.3)]">
                <ShieldCheck className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <span className="font-extrabold text-2xl text-white tracking-tight block">Deanonymizer</span>
                <span className="text-[11px] font-mono text-orange-400 font-bold uppercase tracking-wider">
                  Academic Anonymity Audit Tool
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-orange-200/80 max-w-md leading-relaxed font-normal">
              An academic privacy risk assessment platform built to quantify cross-platform identity linkability using stylometric NLP feature extraction and timestamp metadata correlation.
            </p>

            <div className="p-4 rounded-2xl bg-darkorange-900/90 border border-darkorange-800 max-w-md space-y-1 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Vidyalankar Institute of Technology (VIT), Mumbai</span>
              </div>
              <p className="text-[11px] text-orange-300/70 font-mono pl-6">
                Department of Computer Engineering • Final Year Capstone Project
              </p>
            </div>
          </div>

          {/* Column 2: Team Members List */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">
              Capstone Engineering Team
            </h4>
            <ul className="space-y-2.5">
              {teamMembers.map((member, idx) => (
                <li 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-2xl bg-darkorange-900/80 border border-darkorange-800 hover:border-brand-orange/50 transition-colors text-xs shadow-sm group"
                >
                  <span className="font-bold text-white group-hover:text-orange-300 transition-colors">{member.name}</span>
                  <span className="text-[11px] font-mono text-orange-400/80 font-medium">{member.role}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-orange-200/80 font-medium">
              <li>
                <a href="#hero" className="hover:text-white transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Project Overview
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  3-Step Execution Roadmap
                </a>
              </li>
              <li>
                <a href="#analyzer" className="hover:text-white transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Risk Assessment Demo
                </a>
              </li>
              <li>
                <a href="#research" className="hover:text-white transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Academic Research Paper
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Large Decorative Footer Brand Watermark Accent */}
        <div className="py-4 border-t border-b border-darkorange-800/80 my-auto">
          <div className="flex items-center justify-between text-xs font-mono text-orange-400/60 uppercase tracking-widest flex-wrap gap-4">
            <span>VIT Mumbai • Dept. of Computer Engineering</span>
            <span>Stylometric NLP & Metadata Engine</span>
            <span>Capstone Research 2026</span>
          </div>
        </div>

        {/* Bottom Pinned Copyright Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-orange-300/80 font-medium gap-4">
          <div>
            © 2026 <strong className="text-white font-bold">Deanonymizer Project</strong>. Vidyalankar Institute of Technology.
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-orange-400">
            <span>Piyush Gupta</span>
            <span>/</span>
            <span>Rohit Soneji</span>
            <span>/</span>
            <span>Sukumar Sawant</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
