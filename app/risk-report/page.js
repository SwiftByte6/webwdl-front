'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Layers, 
  Clock, 
  Type, 
  FileJson, 
  Sliders, 
  Copy, 
  Check, 
  Info,
  ArrowLeft,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  Lock,
  ChevronRight,
  Mail,
  ExternalLink,
  UserCheck,
  AlertTriangle,
  FileText,
  Database,
  Terminal,
  KeyRound,
  Code
} from 'lucide-react';

// Simplified Results Array with Confidence Scores and Backend Mapping Keys
const INITIAL_RESULTS = [
  {
    id: 'result-1',
    number: 1,
    title: 'Result 1: Cross-Platform Handle Correlation',
    confidenceScore: 92,
    riskLevel: 'High Risk',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    category: 'Stylometric Vocabulary & Handle Matching',
    description: 'Strong correlation detected across Reddit and GitHub profiles based on phrase n-grams and variable naming syntax.',
    evidenceSnippet: '"imho this needs async refactoring before we ship to prod..."',
    source: 'Reddit / GitHub Regex Pass',
    apiKey: 'audit_results[0]'
  },
  {
    id: 'result-2',
    number: 2,
    title: 'Result 2: Email & Direct Identifier Leak',
    confidenceScore: 88,
    riskLevel: 'High Risk',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    category: 'Direct Identifier Unmangling',
    description: 'Un-mangled email address extracted from public GitHub commit payloads (PushEvents).',
    evidenceSnippet: 'aarav.dev[at]gmail[dot]com → aarav.dev@gmail.com',
    source: 'GitHub PushEvent Payload',
    apiKey: 'audit_results[1]'
  },
  {
    id: 'result-3',
    number: 3,
    title: 'Result 3: Temporal Activity & Timezone Overlap',
    confidenceScore: 78,
    riskLevel: 'Moderate Risk',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    category: 'Timestamp Metadata Spikes',
    description: 'Overlapping active posting windows observed during peak IST (UTC+5:30) afternoon hours.',
    evidenceSnippet: 'Active activity window: 14:00 - 19:00 IST across discussion forums',
    source: 'Hacker News / Reddit Timestamps',
    apiKey: 'audit_results[2]'
  },
  {
    id: 'result-4',
    number: 4,
    title: 'Result 4: Location & Affiliation Mentions',
    confidenceScore: 64,
    riskLevel: 'Moderate Risk',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    category: 'Disclosed Demographics',
    description: 'Mention of previous tech company employment and local city transit references.',
    evidenceSnippet: '"stuck in Western Express Highway traffic during peak monsoon..."',
    source: 'Reddit Comments API',
    apiKey: 'audit_results[3]'
  },
  {
    id: 'result-5',
    number: 5,
    title: 'Result 5: Technical Jargon & Code Marker Density',
    confidenceScore: 35,
    riskLevel: 'Low Risk',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    category: 'Syntax Entropy',
    description: 'Standard tech stack vocabulary with high entropy across public repository issue comments.',
    evidenceSnippet: '"Tokio mpsc channel wrappers for websocket relay"',
    source: 'Stack Overflow API',
    apiKey: 'audit_results[4]'
  }
];

// Pure SVG Donut Chart Component
function DonutConfidenceChart({ overallScore }) {
  const strokeDasharray = `${overallScore} ${100 - overallScore}`;
  
  return (
    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth="3.8"
        />
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="transparent"
          stroke="#ff5722"
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="100"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-2xl font-black font-mono text-slate-900 leading-none">
          {overallScore}%
        </span>
        <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider mt-1">
          Overall Risk
        </span>
      </div>
    </div>
  );
}

export default function RiskReportPage() {
  const [handle, setHandle] = useState('aarav_dev');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(INITIAL_RESULTS);

  // Overall Confidence Average
  const overallConfidence = Math.round(
    results.reduce((acc, r) => acc + r.confidenceScore, 0) / results.length
  );

  const handleRunAudit = (e) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      // Dynamic Confidence Update Simulation
      const updated = results.map((r, idx) => {
        const delta = (handle.length * (idx + 3)) % 25;
        const newScore = Math.max(20, Math.min(96, r.confidenceScore + (idx % 2 === 0 ? delta : -delta)));
        return { ...r, confidenceScore: newScore };
      });
      setResults(updated);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-orange/20 selection:text-brand-orange flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Breadcrumb & Page Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-orange transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-mono font-bold text-brand-orange uppercase">Audit Results</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Anonymity Risk Assessment Output
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal leading-relaxed">
                Simple confidence scores and extracted result placeholders ready to bind to your backend API.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-orange-50 text-brand-orange text-xs font-mono font-bold border border-orange-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                Backend API Ready
              </span>
            </div>
          </div>

          {/* SIMPLE SEARCH INPUT BAR */}
          <form onSubmit={handleRunAudit} className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4 text-brand-orange" />
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter handle or username..."
                className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-mono text-slate-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fetching Results...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Audit Handle</span>
                </>
              )}
            </button>
          </form>

          {/* OVERALL EXECUTIVE SCORE CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-brand-orange tracking-wider">Target Handle:</span>
                <span className="text-xs font-mono font-extrabold bg-slate-100 text-slate-900 px-2.5 py-1 rounded-md border border-slate-200">
                  @{handle}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Confidence Risk Breakdown
              </h2>
              <p className="text-xs text-slate-600 max-w-lg leading-relaxed font-normal">
                Extracted results ranked by individual confidence scores. Backend data can be passed directly into these mapped placeholders.
              </p>
            </div>

            {/* Donut Chart */}
            <DonutConfidenceChart overallScore={overallConfidence} />
          </div>

          {/* SIMPLE RESULTS LIST (RESULT 1, RESULT 2, RESULT 3...) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-orange" />
                Audit Results & Confidence Scores ({results.length})
              </h3>
              <span className="text-[11px] font-mono font-bold text-slate-500">
                Sorted by Confidence
              </span>
            </div>

            {results.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                {/* Accent Side Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  item.confidenceScore >= 80 ? 'bg-rose-500' : item.confidenceScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

                {/* Top Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      #{item.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">{item.title}</h4>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{item.category}</span>
                    </div>
                  </div>

                  {/* Prominent Confidence Score Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-slate-500 font-bold">Confidence:</span>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black border ${item.badgeColor} shadow-xs`}>
                      {item.confidenceScore}% Score
                    </span>
                  </div>
                </div>

                {/* Description Body */}
                <p className="text-xs text-slate-700 font-medium leading-relaxed pl-11">
                  {item.description}
                </p>

                {/* Evidence & API Mapping Row */}
                <div className="pl-11 pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-500 gap-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400 font-bold">Snippet:</span>
                    <code className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 truncate max-w-xs sm:max-w-md">
                      {item.evidenceSnippet}
                    </code>
                  </div>

                  {/* Backend Placeholder Mapping Tag */}
                  <div className="flex items-center gap-1.5 text-brand-orange font-bold shrink-0">
                    <Code className="w-3.5 h-3.5" />
                    <span>API Key: <code className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">{item.apiKey}</code></span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
