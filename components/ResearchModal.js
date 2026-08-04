'use client';

import { useState } from 'react';
import { X, FileText, Download, Copy, Check, ExternalLink, ShieldCheck, BookOpen, Cpu, Award } from 'lucide-react';

export default function ResearchModal({ isOpen, onClose }) {
  const [copiedBib, setCopiedBib] = useState(false);

  if (!isOpen) return null;

  const bibtex = `@inproceedings{deanon2026,
  title={De-anonymizing Cross-Platform Identities via Stylometric Feature Extraction and Metadata Correlation},
  author={Gupta, Piyush and Soneji, Rohit and Sawant, Sukumar},
  booktitle={Vidyalankar Institute of Technology Capstone Research Proceedings},
  year={2026},
  organization={Department of Computer Engineering, VIT Mumbai}
}`;

  const handleCopyBib = () => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-orange">
            <BookOpen className="w-4 h-4 text-brand-orange" />
            <span>Academic Research Paper • VIT Mumbai</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-sm">
          
          {/* Paper Title Header */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200 mb-3">
              Peer-Reviewed Student Research
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              De-anonymizing Cross-Platform Identities via Stylometric Feature Extraction and Metadata Correlation
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
              <span><strong>Authors:</strong> Piyush Gupta, Rohit Soneji, Sukumar Sawant</span>
              <span>•</span>
              <span><strong>Advisor:</strong> Dept. of Computer Engineering</span>
              <span>•</span>
              <span className="text-brand-orange font-bold">Vidyalankar Institute of Technology</span>
            </div>
          </div>

          {/* Abstract Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-mono uppercase tracking-wider text-brand-orange font-bold mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Abstract
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Pseudonymity on the modern web relies heavily on isolated user handles across distinct online platforms. However, individuals unconsciously exhibit distinct stylometric writing habits—such as idiosyncratic n-gram preferences, sentence length variance, and structural punctuation patterns—alongside localized activity timestamps. In this paper, we propose a lightweight multi-vector feature extraction framework that quantifies cross-platform linkability without requiring unconsented private data access. By evaluating stylometric cosine similarity alongside temporal metadata overlay, our methodology achieves up to 88% confidence in identifying shared authorship across user-owned pseudonymous accounts. Finally, we implement client-side obfuscation recommendations designed for proactive self-privacy auditing.
            </p>
          </div>

          {/* Methodology Formula & Architecture */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-orange" />
              Mathematical Formulation & Feature Correlation Model
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-orange-400 font-bold text-center">
                Score(A, B) = α · Cosine(S_A, S_B) + β · Jaccard(M_A, M_B) + γ · Temporal(T_A, T_B)
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px] font-sans font-medium">
                <li><strong>S_A, S_B:</strong> Stylometric character and word n-gram feature vectors for profiles A and B.</li>
                <li><strong>M_A, M_B:</strong> Unique technical vocabulary and jargon token sets.</li>
                <li><strong>T_A, T_B:</strong> Normalized posting frequency distribution over 24-hour UTC intervals.</li>
                <li><strong>Weights (α, β, γ):</strong> Empirical weights tuned to minimize false-positive cross-matches.</li>
              </ul>
            </div>
          </div>

          {/* Ethical Research Disclaimer */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-700 font-bold block mb-0.5">Ethical & Self-Audit Guarantee</strong>
              <span className="font-medium text-emerald-800">
                This research project strictly mandates consent-based evaluation. The tool is engineered exclusively for self-privacy auditing on user-owned accounts to help individuals identify and mitigate their own unintended digital footprints.
              </span>
            </div>
          </div>

          {/* BibTeX Citation Copy Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-700">BibTeX Citation</span>
              <button
                onClick={handleCopyBib}
                className="text-xs font-bold text-brand-orange hover:text-orange-600 flex items-center gap-1 transition-colors"
              >
                {copiedBib ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBib ? 'Copied!' : 'Copy Citation'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-900 text-orange-300 text-[11px] font-mono overflow-x-auto border border-slate-800">
              {bibtex}
            </pre>
          </div>

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Award className="w-4 h-4 text-amber-500" />
            <span>VIT Department of Computer Engineering • 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-sm"
            >
              Close
            </button>
            <a
              href="#analyzer"
              onClick={() => {
                onClose();
                const el = document.getElementById('analyzer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-xl transition-colors shadow-md flex items-center gap-1.5"
            >
              <span>Test Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
