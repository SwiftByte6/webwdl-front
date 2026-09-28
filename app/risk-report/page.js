'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GithubIcon from '@/components/GithubIcon';
import {
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Code,
  UserCheck,
  RefreshCw,
  Globe,
  Layers,
  Activity
} from 'lucide-react';

export default function RiskReportPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('github'); // 'github' | 'reddit'

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load audit data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between pt-20">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-brand-orange rounded-full animate-spin"></div>
            <ShieldAlert className="w-8 h-8 text-brand-orange absolute" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Analyzing Independent Platform Footprints...</h2>
          <p className="text-slate-600 max-w-md text-sm font-medium">
            Fetching independent findings separately for GitHub and Reddit without cross-engine fusion...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const { user, connectionStatus, githubAudit, redditAudit } = data;

  const currentAudit = selectedPlatform === 'github' ? githubAudit : redditAudit;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 selection:bg-brand-orange/20 selection:text-brand-orange">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url || `https://github.com/${user.github_username}.png`}
              alt={user.name}
              className="w-16 h-16 rounded-2xl border-2 border-brand-orange object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
                <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1 font-mono">
                  <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
                  Authenticated User
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-1 font-medium">
                Independent Platform Privacy Auditor (Separate GitHub & Reddit Analysis)
              </p>
            </div>
          </div>

          {/* Re-run Audit Button */}
          <button
            onClick={fetchAuditData}
            className="bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-glow hover:shadow-glow-lg text-xs tracking-wide"
          >
            <RefreshCw className="w-4 h-4" />
            Re-Run Independent Audit
          </button>
        </div>

        {/* --- PROMINENT INDEPENDENT PLATFORM SELECTOR TABS --- */}
        <div className="flex justify-center">
          <div className="bg-slate-200/80 p-1.5 rounded-full border border-slate-300 inline-flex items-center gap-2 shadow-inner">
            <button
              onClick={() => setSelectedPlatform('github')}
              className={`px-8 py-3.5 rounded-full text-sm font-extrabold transition-all flex items-center gap-2.5 ${
                selectedPlatform === 'github'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <GithubIcon className="w-5 h-5 fill-current" />
              <span>GitHub Audit</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-orange-300">
                @{connectionStatus.github.username}
              </span>
            </button>

            <button
              onClick={() => setSelectedPlatform('reddit')}
              className={`px-8 py-3.5 rounded-full text-sm font-extrabold transition-all flex items-center gap-2.5 ${
                selectedPlatform === 'reddit'
                  ? 'bg-brand-orange text-white shadow-glow font-black'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z" />
              </svg>
              <span>Reddit Audit</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-orange-700 text-white">
                u/{connectionStatus.reddit.username}
              </span>
            </button>
          </div>
        </div>

        {/* --- PLATFORM SPECIFIC AUDIT SCORE & PREDICTIONS --- */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-brand-orange tracking-wider block">
                Independent Platform Scope
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-3">
                {selectedPlatform === 'github' ? (
                  <>
                    <GithubIcon className="w-8 h-8 fill-current text-slate-900" />
                    GitHub Platform Audit
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 fill-current text-orange-600" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z" />
                    </svg>
                    Reddit Platform Audit
                  </>
                )}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-500 uppercase">Platform Risk Score</div>
                <div className="text-3xl font-black text-slate-900">{currentAudit.score} / 100</div>
              </div>
            </div>
          </div>

          {/* Predictions Cards for Selected Platform */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Predicted State / Location */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-brand-orange font-mono font-bold text-xs uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                Predicted State / Location
              </div>
              <div className="text-lg font-extrabold text-slate-900 mt-1">
                {currentAudit.predictedState}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Derived strictly from {selectedPlatform === 'github' ? 'GitHub profile location metadata' : 'Reddit comment text mentions & subreddits'}.
              </p>
            </div>

            {/* Language Stack / Community */}
            {selectedPlatform === 'github' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-brand-orange font-mono font-bold text-xs uppercase tracking-wider mb-2">
                  <Code className="w-4 h-4" />
                  Primary Repository Languages
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentAudit.languages?.map((lang, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-900 px-3.5 py-1 rounded-full text-xs font-extrabold font-mono shadow-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-brand-orange font-mono font-bold text-xs uppercase tracking-wider mb-2">
                  <Activity className="w-4 h-4" />
                  Active Subreddits & Communities
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentAudit.subreddits?.map((sub, idx) => (
                    <span key={idx} className="bg-orange-50 border border-orange-200 text-brand-orange px-3.5 py-1 rounded-full text-xs font-bold font-mono shadow-xs">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Revealed Identity / Email */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-brand-orange font-mono font-bold text-xs uppercase tracking-wider mb-2">
                <Globe className="w-4 h-4" />
                Revealed Identity / Email
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1 font-mono">
                {selectedPlatform === 'github' ? currentAudit.email : currentAudit.revealedEmail}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {selectedPlatform === 'github' ? 'Public email listed in profile or commit log' : 'Obfuscated or plain-text email extracted from comments'}.
              </p>
            </div>
          </div>
        </div>

        {/* --- PLATFORM SPECIFIC EXPOSURE FINDINGS --- */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="pb-6 border-b border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
              {selectedPlatform === 'github' ? 'GitHub Specific Leaks' : 'Reddit Specific Leaks'}
            </h3>
            <p className="text-slate-600 text-sm mt-1 font-medium">
              Deterministic findings extracted strictly from {selectedPlatform === 'github' ? 'GitHub profile metadata and repos' : 'Reddit comment text and subreddits'}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {currentAudit.findings?.map((finding, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 hover:border-brand-orange/60 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      finding.severity === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {finding.severity} Severity
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">{finding.source}</span>
                  </div>

                  <h4 className="text-lg font-extrabold text-slate-900 mt-3">{finding.type}</h4>
                  <div className="text-xs font-mono text-brand-orange font-bold mt-1 bg-orange-50 px-3 py-1 rounded-md border border-orange-200 inline-block">
                    {finding.value}
                  </div>

                  <p className="text-slate-600 text-xs mt-3 leading-relaxed font-medium">
                    {finding.description}
                  </p>

                  <div className="mt-4 bg-white border border-slate-200 p-3 rounded-xl shadow-inner">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">Evidence Snippet</span>
                    <p className="text-xs text-slate-700 font-mono italic">"{finding.evidenceSnippet}"</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Confidence Score: <span className="text-slate-900 font-extrabold">{finding.confidence}%</span></span>
                  {finding.evidence_url && (
                    <a
                      href={finding.evidence_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1.5"
                    >
                      View Source
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
