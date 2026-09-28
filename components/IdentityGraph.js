'use client';

import { useState } from 'react';
import { ShieldAlert, ExternalLink, Link2, CheckCircle2 } from 'lucide-react';

export default function IdentityGraph({ links = [], user }) {
  const [selectedLink, setSelectedLink] = useState(links[0] || null);

  const ghUser = user?.github_username || 'aarav_dev';
  const rdUser = user?.reddit_username || 'aarav_dev';

  return (
    <div className="bg-darkorange-900 border border-orange-900/60 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-orange-800/60">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Link2 className="w-6 h-6 text-brand-orange" />
            Identity Exposure Graph
          </h3>
          <p className="text-orange-200/80 text-sm mt-1 font-medium">
            Visual correlation connecting authenticated GitHub & Reddit footprints via probabilistic evidence signals.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-darkorange-950/80 px-4 py-2 rounded-full border border-orange-700/60 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
          Authenticated Scope: <span className="text-brand-orange font-bold">@{ghUser}</span>
        </div>
      </div>

      {/* Visual Canvas Diagram */}
      <div className="my-8 relative min-h-[320px] flex flex-col items-center justify-center bg-darkorange-950/90 rounded-2xl p-6 border border-orange-800/60 overflow-hidden shadow-inner">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ff5722_1px,transparent_1px)] [background-size:20px_20px]"></div>

        {/* Node Connection Lines */}
        <div className="w-full max-w-2xl flex items-center justify-between relative z-10">
          {/* Node 1: GitHub */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl bg-darkorange-850 border-2 border-orange-700/80 shadow-lg flex items-center justify-center p-3 text-white hover:border-brand-orange transition-colors cursor-pointer group">
              <svg className="w-10 h-10 fill-current text-orange-100 group-hover:text-brand-orange transition-colors" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <span className="text-xs font-extrabold text-white">GitHub Account</span>
            <span className="text-[10px] text-orange-300/70 font-mono">@{ghUser}</span>
          </div>

          {/* Center Identity Hub */}
          <div className="flex-1 px-4 relative flex items-center justify-center">
            {/* Connecting pulses */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-1 bg-gradient-to-r from-orange-800 via-brand-orange to-orange-800 rounded-full shadow-glow"></div>
            </div>

            <div className="relative z-10 bg-darkorange-950 border-2 border-brand-orange rounded-full p-4 flex flex-col items-center justify-center text-center shadow-glow">
              <ShieldAlert className="w-8 h-8 text-brand-orange mb-1 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Identity Core</span>
              <span className="text-[10px] text-brand-orange font-mono font-bold mt-0.5">{links.length} Linkage Signals</span>
            </div>
          </div>

          {/* Node 2: Reddit */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl bg-darkorange-850 border-2 border-orange-700/80 shadow-lg flex items-center justify-center p-3 text-white hover:border-brand-orange transition-colors cursor-pointer group">
              <svg className="w-10 h-10 fill-current text-brand-orange group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.562-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
              </svg>
            </div>
            <span className="text-xs font-extrabold text-white">Reddit Account</span>
            <span className="text-[10px] text-orange-300/70 font-mono">u/{rdUser}</span>
          </div>
        </div>

        {/* Signal Pills Bar */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-2xl z-10">
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedLink(link)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
                selectedLink === link
                  ? 'bg-brand-orange text-white border-brand-orange shadow-glow font-extrabold'
                  : 'bg-darkorange-850 text-orange-200 border-orange-800 hover:border-orange-600 hover:bg-darkorange-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${link.confidence === 'High' ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
              {link.signal}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Connection Evidence Detail Card */}
      {selectedLink && (
        <div className="bg-darkorange-950 border border-orange-800/80 rounded-2xl p-6 relative transition-all shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-orange-900/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                  selectedLink.confidence === 'High'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {selectedLink.confidence} Confidence Link
                </span>
                <span className="text-xs text-orange-300/80 font-mono">
                  {selectedLink.source_a} ↔ {selectedLink.source_b}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-white mt-2">{selectedLink.signal}</h4>
            </div>
            {selectedLink.evidence_url && (
              <a
                href={selectedLink.evidence_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:text-white bg-darkorange-850 border border-orange-700/60 px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                Inspect Evidence URL
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">Ground Truth Evidence</span>
              <p className="mt-1.5 text-sm text-orange-100 bg-darkorange-900 border border-orange-800/80 p-4 rounded-xl font-mono leading-relaxed shadow-inner">
                "{selectedLink.evidence}"
              </p>
            </div>

            {selectedLink.supporting_signals?.length > 0 && (
              <div>
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">Supporting Signals</span>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selectedLink.supporting_signals.map((sig, sIdx) => (
                    <li key={sIdx} className="text-xs bg-darkorange-850 text-orange-200 border border-orange-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {sig}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
