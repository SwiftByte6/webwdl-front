'use client';
import Image from 'next/image';

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
      className="min-h-[50vh] md:min-h-[60vh] text-black relative overflow-hidden flex flex-col justify-between pt-16 md:pt-20 pb-8"
    >
    
    <div 
      className="absolute inset-0 h-full w-full"
    >
      <Image
        src="/footerbg.png"
        height={100}
        width={100}
        className='w-full h-full'
        alt="Footer background"
      />
    </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-between space-y-12">
        
        {/* Main 4-Column Footer Grid */}
        <div className="flex justify-between  gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Department Info */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              
              <div>
                <span className="font-extrabold text-2xl text-slate tracking-tight block">Deanonymizer</span>
                <span className="text-[11px] font-mono text-orange-400 font-bold uppercase tracking-wider">
                  Academic Anonymity Audit Tool
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-orange-900/80 max-w-md leading-relaxed font-normal">
              An academic privacy risk assessment platform built to quantify cross-platform identity linkability using stylometric NLP feature extraction and timestamp metadata correlation.
            </p>

            <div className="p-4 rounded-2xl bg-white/40   max-w-md space-y-1 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-black/80 font-bold">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Vidyalankar Institute of Technology (VIT), Mumbai</span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono pl-6">
                Department of Computer Engineering • Final Year Capstone Project
              </p>
            </div>
          </div>

          {/* Column 2: Team Members List */}
          {/* <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">
              Capstone Engineering Team
            </h4>
            <ul className="space-y-2.5">
              {teamMembers.map((member, idx) => (
                <li 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-2xl b  transition-colors text-xs  group"
                >
                  <span className="font-bold text-stone-900/80 group-hover:text-orange-300 transition-colors">{member.name}</span>
                  <span className="text-[11px] font-mono text-stone-900/80 font-medium">{member.role}</span>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Column 3: Quick Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-900/80 font-medium">
              <li>
                <a href="#hero" className="hover:text- transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Project Overview
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-orange transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  3-Step Execution Roadmap
                </a>
              </li>
              <li>
                <a href="#analyzer" className="hover:text-orange transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Risk Assessment Demo
                </a>
              </li>
              <li>
                <a href="#research" className="hover:text-orange transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />
                  Academic Research Paper
                </a>
              </li>
            </ul>
          </div>

        </div>

        

        {/* Bottom Copyright Bar */}
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
