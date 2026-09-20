'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  ArrowLeft,
  Sparkles,
  BarChart3,
  Mail,
  ExternalLink,
  Code,
  AlertCircle
} from 'lucide-react';

const INITIAL_RESULTS = [
  {
    id: 'result-1',
    number: 1,
    title: 'Result 1: Un-mangled Email Address Exposure',
    confidenceScore: 94,
    riskLevel: 'High Risk',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    category: 'Direct Identifier Unmangling',
    description: 'Un-mangled email address extracted from public commits or discussion comments.',
    evidenceSnippet: 'aarav.dev[at]gmail[dot]com → aarav.dev@gmail.com',
    source: 'Regex Extractor Pass',
    apiKey: 'directIdentifiers.emails'
  },
  {
    id: 'result-2',
    number: 2,
    title: 'Result 2: Cross-Platform Handle Correlation',
    confidenceScore: 88,
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
  }
];

// Pure SVG Donut Chart Component
function DonutConfidenceChart({ overallScore }) {
  const score = Math.max(0, Math.min(100, overallScore || 0));
  const strokeDasharray = `${score} ${100 - score}`;
  
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
          {score}%
        </span>
        <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider mt-1">
          Overall Risk
        </span>
      </div>
    </div>
  );
}

function RiskReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialHandle = searchParams.get('handle') || searchParams.get('username') || 'aarav_dev';

  const [handle, setHandle] = useState(initialHandle);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(INITIAL_RESULTS);
  const [overallScore, setOverallScore] = useState(85);
  const [summaryText, setSummaryText] = useState('');
  const [directIdentifiers, setDirectIdentifiers] = useState({ emails: [], socialHandles: [] });
  const [identityInfo, setIdentityInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemCount, setItemCount] = useState(0);

  const fetchAuditData = useCallback(async (targetHandle) => {
    if (!targetHandle || !targetHandle.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/audit?handle=${encodeURIComponent(targetHandle.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to perform anonymity audit');
      }

      setResults(data.findings || []);
      setOverallScore(data.overallScore ?? 75);
      setSummaryText(data.summary || '');
      setDirectIdentifiers(data.directIdentifiers || { emails: [], socialHandles: [] });
      setIdentityInfo(data.identity || null);
      setItemCount(data.itemCount || 0);

      if (data.fetchError) {
        setErrorMessage(`Note: ${data.fetchError}`);
      }
    } catch (err) {
      console.error('Audit API error:', err);
      setErrorMessage(err.message || 'Error fetching audit results. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  useEffect(() => {
    if (initialHandle) {
      setHandle(initialHandle);
      fetchAuditData(initialHandle);
    }
  }, [initialHandle, fetchAuditData]);

  const handleRunAudit = (e) => {
    e.preventDefault();
    if (!handle.trim()) return;

    router.push(`/risk-report?handle=${encodeURIComponent(handle.trim())}`);
    fetchAuditData(handle.trim());
  };

  return (
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
              <span className="text-xs font-mono font-bold text-brand-orange uppercase">Live Audit Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Anonymity Risk Assessment Output
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal leading-relaxed">
              Real-time stylometric correlation, email un-mangling, and exposure findings connected directly to the backend engine.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-orange-50 text-brand-orange text-xs font-mono font-bold border border-orange-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              Connected to Backend
            </span>
          </div>
        </div>

        {/* SEARCH INPUT BAR */}
        <form onSubmit={handleRunAudit} className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4 text-brand-orange" />
            </div>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter username or handle (e.g. u/spez, tech_wanderer)..."
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
                <span>Auditing Footprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Audit Handle</span>
              </>
            )}
          </button>
        </form>

        {/* ERROR / WARNING ALERT */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* OVERALL EXECUTIVE SCORE CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-brand-orange tracking-wider">Audited Handle:</span>
              <span className="text-xs font-mono font-extrabold bg-slate-100 text-slate-900 px-2.5 py-1 rounded-md border border-slate-200">
                @{handle}
              </span>
              {itemCount > 0 && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold">
                  {itemCount} Items Scanned
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Anonymity Exposure Summary
            </h2>
            
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed font-normal">
              {summaryText || `Live footprint evaluation complete. Ranked risk exposure findings extracted from public author history.`}
            </p>

            {identityInfo?.rationale && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                <span className="font-bold text-slate-900">Identity Linking Note: </span>
                {identityInfo.rationale}
              </div>
            )}
          </div>

          {/* Donut Chart */}
          <DonutConfidenceChart overallScore={overallScore} />
        </div>

        {/* DIRECT IDENTIFIERS EXPOSURE BANNER */}
        {((directIdentifiers?.emails && directIdentifiers.emails.length > 0) ||
          (directIdentifiers?.socialHandles && directIdentifiers.socialHandles.length > 0)) && (
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider font-mono">
              <Mail className="w-4 h-4 text-rose-600" />
              <span>Extracted Direct Identifiers & External Profiles</span>
            </div>

            {directIdentifiers.emails && directIdentifiers.emails.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-600 font-mono font-semibold">Exposed Email(s):</span>
                {directIdentifiers.emails.map((email, idx) => (
                  <span key={`email-${idx}`} className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-mono font-bold border border-rose-300">
                    {email}
                  </span>
                ))}
              </div>
            )}

            {directIdentifiers.socialHandles && directIdentifiers.socialHandles.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="text-slate-600 font-mono font-semibold">Cross-Platform Handles:</span>
                {directIdentifiers.socialHandles.map((sh, idx) => (
                  <a
                    key={`sh-${idx}`}
                    href={sh.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-900 font-mono text-[11px] font-bold border border-slate-300 hover:border-brand-orange transition-colors"
                  >
                    <span>{sh.platform}: @{sh.handle}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESULTS LIST (RESULT 1, RESULT 2, RESULT 3...) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-orange" />
              Detailed Audit Findings ({results.length})
            </h3>
            <span className="text-[11px] font-mono font-bold text-slate-500">
              Ranked by Confidence
            </span>
          </div>

          {isAnalyzing ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
              <p className="text-xs font-mono font-bold text-slate-700">Connecting to Backend & Fetching Footprint...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 text-xs text-slate-500 font-mono">
              No specific exposure findings detected for this handle.
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                {/* Accent Side Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  item.confidenceScore >= 80 ? 'bg-rose-500' : item.confidenceScore >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
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
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black border ${item.badgeColor || 'bg-rose-100 text-rose-800 border-rose-200'} shadow-xs`}>
                      {item.confidenceScore}% Score
                    </span>
                  </div>
                </div>

                {/* Description Body */}
                <p className="text-xs text-slate-700 font-medium leading-relaxed pl-11">
                  {item.description}
                </p>

                {/* Remediation Tip if provided */}
                {item.remediation && (
                  <div className="ml-11 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
                    <strong className="text-slate-900 font-mono">Remediation Action: </strong>
                    {item.remediation}
                  </div>
                )}

                {/* Evidence & API Mapping Row */}
                <div className="pl-11 pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-500 gap-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400 font-bold">Evidence:</span>
                    <code className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 truncate max-w-xs sm:max-w-md">
                      {item.evidenceSnippet}
                    </code>
                  </div>

                  {/* Backend Placeholder Mapping Tag */}
                  <div className="flex items-center gap-1.5 text-brand-orange font-bold shrink-0">
                    <Code className="w-3.5 h-3.5" />
                    <span>Source: <code className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">{item.source || item.apiKey}</code></span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}

export default function RiskReportPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-orange/20 selection:text-brand-orange flex flex-col justify-between">
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Content Area with Suspense for SearchParams */}
      <Suspense fallback={
        <div className="flex-grow pt-36 text-center text-slate-500 font-mono text-xs">
          Loading Risk Assessment Engine...
        </div>
      }>
        <RiskReportContent />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
