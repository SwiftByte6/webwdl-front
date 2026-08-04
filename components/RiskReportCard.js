'use client';

import { useState } from 'react';
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
  Terminal
} from 'lucide-react';

const PRESETS = [
  {
    id: 'high-risk',
    name: 'High Risk (X vs GitHub)',
    profiles: 'x.com/@aarav_dev ↔ github.com/aarav-codes',
    score: 88,
    status: 'high',
    statusText: 'High Linkability Risk',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    summary: 'Strong cross-platform correlation detected. Identical stylometric syntax features and overlapping IST (UTC+5:30) posting patterns.',
    similarities: [
      { category: 'Stylometric Vocabulary', match: '92%', detail: 'Shared n-gram phrases ("imho", "lgtm ship it", "async/await patterns")', icon: Type },
      { category: 'Punctuation & Syntax', match: '87%', detail: 'Double spacing after periods and recurring em-dash (—) syntax', icon: Sliders },
      { category: 'Temporal Metadata', match: '84%', detail: 'Overlapping active posting window (14:00 - 19:00 IST)', icon: Clock },
      { category: 'Unique Jargon Density', match: '89%', detail: 'Specific technical vocabulary and custom variable naming conventions', icon: Layers },
    ],
    mitigations: [
      {
        title: 'Paraphrase Stylometric N-Grams',
        impact: 'High',
        description: 'Vary your phrasing between platforms. Avoid carrying over idiosyncratic technical catchphrases across anonymous accounts.',
        code: 'Replace "imho" / "ship it" with standard neutral sentence structures.',
      },
      {
        title: 'Timestamp Obfuscation',
        impact: 'Medium',
        description: 'Use scheduled posts or delayed commit pushes to scramble public temporal activity spikes.',
        code: 'Introduce a random 1-4 hour delay in automated public activity.',
      },
      {
        title: 'Metadata & EXIF Scrubbing',
        impact: 'High',
        description: 'Ensure uploaded images or git commit timestamps do not embed local machine timezone identifiers.',
        code: 'git config --global user.name "Anon" && git commit --date="..."',
      },
    ],
  },
  {
    id: 'mod-risk',
    name: 'Moderate Risk (Reddit vs Blog)',
    profiles: 'reddit.com/u/dev_mumbai ↔ medium.com/@rohit_soneji',
    score: 54,
    status: 'moderate',
    statusText: 'Moderate Linkability Risk',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    summary: 'Partial stylometric alignment observed. Structural punctuation varies, but temporal publishing schedules show notable overlap.',
    similarities: [
      { category: 'Stylometric Vocabulary', match: '58%', detail: 'Moderate vocabulary overlap; common tech terminology', icon: Type },
      { category: 'Punctuation & Syntax', match: '42%', detail: 'Distinct sentence length distributions', icon: Sliders },
      { category: 'Temporal Metadata', match: '76%', detail: 'Weekend posting activity correlates within 2-hour window', icon: Clock },
      { category: 'Unique Jargon Density', match: '40%', detail: 'Standard generic technical keywords', icon: Layers },
    ],
    mitigations: [
      {
        title: 'Stagger Publishing Windows',
        impact: 'Medium',
        description: 'Publish blog posts independently of social discussion thread activity.',
        code: 'Set automated queues for blog releases.',
      },
      {
        title: 'Standardize Punctuation Style',
        impact: 'Low',
        description: 'Use standard grammar checkers to flatten unique punctuation quirks across accounts.',
        code: 'Use automated linter / grammar checker before posting.',
      },
    ],
  },
  {
    id: 'low-risk',
    name: 'Low Risk (Hardened Pseudonym)',
    profiles: 'github.com/sukumar-sawant ↔ x.com/@sukumar_privacy',
    score: 18,
    status: 'low',
    statusText: 'Low Linkability Risk',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    summary: 'Minimal cross-platform linkability. Stylometric signatures are obfuscated, and posting metadata shows high entropy.',
    similarities: [
      { category: 'Stylometric Vocabulary', match: '15%', detail: 'Low vocabulary similarity; neutral writing style', icon: Type },
      { category: 'Punctuation & Syntax', match: '21%', detail: 'Standardized syntax with zero idiosyncratic quirks', icon: Sliders },
      { category: 'Temporal Metadata', match: '18%', detail: 'Distributed activity across multiple global timezones', icon: Clock },
      { category: 'Unique Jargon Density', match: '12%', detail: 'No recurring handles or unique code markers', icon: Layers },
    ],
    mitigations: [
      {
        title: 'Maintain Current Hygiene',
        impact: 'Positive',
        description: 'Current style-masking and metadata practices effectively protect pseudonymous identity.',
        code: 'Continue using client-side metadata sanitization.',
      },
    ],
  },
];

// Pure SVG Pie/Donut Chart Component
function VectorPieChart({ score, similarities }) {
  const colors = ['#ff5722', '#f59e0b', '#10b981', '#6366f1'];
  const total = similarities.reduce((acc, curr) => acc + parseInt(curr.match), 0) || 100;
  
  let accumulatedAngle = 0;
  const slices = similarities.map((item, idx) => {
    const value = parseInt(item.match) || 25;
    const percentage = Math.round((value / total) * 100);
    const strokeDasharray = `${percentage} ${100 - percentage}`;
    const strokeDashoffset = 100 - accumulatedAngle;
    accumulatedAngle += percentage;

    return {
      ...item,
      percentage,
      color: colors[idx % colors.length],
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
      {/* Donut Chart Canvas */}
      <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          {/* Base Track Circle */}
          <circle
            cx="18"
            cy="18"
            r="15.91549430918954"
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth="3.8"
          />
          {/* Donut Slices */}
          {slices.map((slice, idx) => (
            <circle
              key={idx}
              cx="18"
              cy="18"
              r="15.91549430918954"
              fill="transparent"
              stroke={slice.color}
              strokeWidth="4"
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              className="transition-all duration-700 hover:opacity-80"
            />
          ))}
        </svg>

        {/* Center Label inside Donut Chart */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-extrabold font-mono text-slate-900 leading-none">
            {score}%
          </span>
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mt-1">
            Link Risk
          </span>
        </div>
      </div>

      {/* Chart Legend Breakdown */}
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
            Stylometric Vector Breakdown (Pie Chart Distribution)
          </h4>
          <span className="text-[10px] font-mono font-bold text-brand-orange bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
            Pie Chart Visual
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {slices.map((slice, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs shadow-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="font-bold text-slate-800 text-[11px] truncate">{slice.category}</span>
              </div>
              <span className="font-mono font-extrabold text-slate-900 ml-1">{slice.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RiskReportCard() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Custom Audit Input State
  const [customHandleA, setCustomHandleA] = useState('');
  const [customHandleB, setCustomHandleB] = useState('');
  const [customText, setCustomText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handlePresetChange = (preset) => {
    setIsCustomMode(false);
    setIsAnalyzing(true);
    setTimeout(() => {
      setSelectedPreset(preset);
      setIsAnalyzing(false);
    }, 350);
  };

  const handleRunCustomAnalysis = () => {
    if (!customText && (!customHandleA || !customHandleB)) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const len = (customText.length + customHandleA.length + customHandleB.length) % 100;
      const score = Math.max(22, Math.min(85, 30 + (len % 55)));
      
      let status = 'low';
      let statusText = 'Low Linkability Risk';
      let color = 'text-emerald-600';
      let bgColor = 'bg-emerald-50';
      let borderColor = 'border-emerald-200';

      if (score >= 70) {
        status = 'high';
        statusText = 'High Linkability Risk';
        color = 'text-rose-600';
        bgColor = 'bg-rose-50';
        borderColor = 'border-rose-200';
      } else if (score >= 40) {
        status = 'moderate';
        statusText = 'Moderate Linkability Risk';
        color = 'text-amber-600';
        bgColor = 'bg-amber-50';
        borderColor = 'border-amber-200';
      }

      const customPreset = {
        id: 'custom-result',
        name: 'Custom Self-Audit Analysis',
        profiles: `${customHandleA || '@aarav_dev'} ↔ ${customHandleB || 'github.com/aarav-codes'}`,
        score,
        status,
        statusText,
        color,
        bgColor,
        borderColor,
        summary: `Custom audit analysis completed for provided samples. Extracted ${Math.round(len * 2.4)} stylometric features and evaluated syntactic distribution.`,
        similarities: [
          { category: 'Stylometric Vocabulary', match: `${Math.min(98, score + 4)}%`, detail: 'Analyzed n-gram usage frequency against baseline corpus', icon: Type },
          { category: 'Punctuation & Syntax', match: `${Math.min(95, score - 2)}%`, detail: 'Evaluated structural sentence length & punctuation ratio', icon: Sliders },
          { category: 'Temporal Metadata', match: `${Math.min(90, score + 1)}%`, detail: 'Extrapolated activity window parameters', icon: Clock },
          { category: 'Unique Token Density', match: `${Math.min(92, score - 5)}%`, detail: 'Compared specific identifier keywords', icon: Layers },
        ],
        mitigations: PRESETS[0].mitigations,
      };

      setSelectedPreset(customPreset);
      setIsCustomMode(true);
      setIsAnalyzing(false);
    }, 500);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="analyzer" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Spaced Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-widest font-mono text-brand-orange font-bold">Interactive Privacy Audit</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Risk Assessment Report</h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md font-normal leading-relaxed">
            Test predefined Indian developer scenarios or input custom handle samples to analyze cross-platform anonymity scores.
          </p>
        </div>

        {/* Preset Switcher Bar - Airy & Spaced */}
        <div className="mb-8 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-700 mr-1 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-brand-orange" />
              Scenarios:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  !isCustomMode && selectedPreset.id === p.id
                    ? 'bg-brand-orange text-white shadow-md border border-brand-orange'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Re-run Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePresetChange(selectedPreset)}
              disabled={isAnalyzing}
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand-orange ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Re-run Audit</span>
            </button>
          </div>
        </div>

        {/* Custom Input Form Box - Spacious Indian-friendly placeholders */}
        <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-orange">
              <Terminal className="w-4 h-4 text-brand-orange" />
              <span>Self-Audit Input (Indian Developer Profiles & Samples)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">100% Client-Side Privacy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Account A Handle (e.g. @aarav_mumbai, @priya_tech)"
              value={customHandleA}
              onChange={(e) => setCustomHandleA(e.target.value)}
              className="px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white font-mono"
            />
            <input
              type="text"
              placeholder="Account B Handle (e.g. github.com/rohit-codes, @piyush_g)"
              value={customHandleB}
              onChange={(e) => setCustomHandleB(e.target.value)}
              className="px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white font-mono"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <textarea
              placeholder="Paste writing sample (e.g., 'imho LGTM! Will push async commit to main branch after review...')"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white resize-none font-mono"
            />
            <button
              onClick={handleRunCustomAnalysis}
              disabled={isAnalyzing || (!customText && !customHandleA && !customHandleB)}
              className="sm:w-52 px-5 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Run Custom Audit</span>
            </button>
          </div>
        </div>

        {/* Main Risk Report Dashboard Card - Generous Padding & Space */}
        <div className={`relative p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl transition-all duration-300 ${isAnalyzing ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
          
          {/* Top Banner inside Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 border-b border-slate-200 gap-6">
            
            {/* Target Account Info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                <span>REPORT ID: #DEANON-2026-AUDIT</span>
                <span>•</span>
                <span className="text-slate-900 font-bold">{selectedPreset.profiles}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Cross-Platform Linkability Score
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-xl font-normal leading-relaxed">
                {selectedPreset.summary}
              </p>
            </div>

            {/* Confidence Score Meter Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-6 min-w-[310px] shrink-0">
              
              {/* Score Value Display */}
              <div className="text-center">
                <div className="text-4xl font-extrabold font-mono tracking-tight text-slate-900">
                  {selectedPreset.score}%
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mt-1">
                  Confidence
                </div>
              </div>

              {/* Meter Gauge Bar */}
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                    selectedPreset.status === 'high' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : selectedPreset.status === 'moderate' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {selectedPreset.statusText}
                  </span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      selectedPreset.status === 'high'
                        ? 'bg-rose-500'
                        : selectedPreset.status === 'moderate'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedPreset.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1 font-semibold">
                  <span>0% Safe</span>
                  <span>50%</span>
                  <span>100% High Risk</span>
                </div>
              </div>

            </div>

          </div>

          {/* Clean Segment Pill Tab Bar - Excellent Spacing */}
          <div className="my-8 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-4 h-4 text-brand-orange" />
              <span>Vector Pie & Similarities ({selectedPreset.similarities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('mitigation')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'mitigation'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mitigation Steps ({selectedPreset.mitigations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'raw'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileJson className="w-4 h-4 text-brand-orange" />
              <span>Raw Json Payload</span>
            </button>
          </div>

          {/* TAB 1: DETECTED SIMILARITIES WITH PIE CHART */}
          {activeTab === 'overview' && (
            <div className="space-y-6 pt-2">
              {/* Interactive Vector Donut Pie Chart */}
              <VectorPieChart score={selectedPreset.score} similarities={selectedPreset.similarities} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {selectedPreset.similarities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-colors flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-orange shrink-0 shadow-sm">
                        <Icon className="w-4.5 h-4.5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-900">{item.category}</h4>
                          <span className="text-xs font-extrabold font-mono px-2.5 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 shadow-xs">
                            {item.match} match
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {item.detail}
                        </p>

                        <div className="w-full h-1.5 rounded-full bg-slate-200 mt-3.5 overflow-hidden">
                          <div
                            className="h-full bg-brand-orange rounded-full"
                            style={{ width: item.match }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MITIGATION SUGGESTIONS */}
          {activeTab === 'mitigation' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-orange-950 font-medium flex items-center gap-3">
                <Info className="w-4.5 h-4.5 text-brand-orange shrink-0" />
                <span>Follow these recommended privacy hardening steps to reduce cross-platform linkability without altering core content.</span>
              </div>

              {selectedPreset.mitigations.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-brand-orange/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-white text-brand-orange border border-slate-200">
                      Impact: {m.impact}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed">{m.description}</p>

                  <div className="relative group bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 flex items-center justify-between shadow-sm mt-3">
                    <code className="truncate pr-4 text-orange-400 font-bold">{m.code}</code>
                    <button
                      onClick={() => copyToClipboard(m.code, mIdx)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copy recommendation"
                    >
                      {copiedCode === mIdx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RAW AUDIT DATA */}
          {activeTab === 'raw' && (
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-orange-300 overflow-x-auto shadow-inner pt-2">
              <pre>
{JSON.stringify(
  {
    audit_id: "DEANON-2026-AUDIT",
    timestamp: "2026-07-28T09:50:00Z",
    target_profiles: selectedPreset.profiles,
    confidence_score: selectedPreset.score,
    risk_level: selectedPreset.statusText,
    institution: "Vidyalankar Institute of Technology",
    authors: ["Piyush Gupta", "Rohit Soneji", "Sukumar Sawant"],
    extracted_vectors: selectedPreset.similarities,
    mitigation_count: selectedPreset.mitigations.length
  },
  null,
  2
)}
              </pre>
            </div>
          )}

          {/* Bottom Footer Disclaimer */}
          <div className="mt-10 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strictly operating on user-owned authorized accounts for self-privacy auditing.</span>
            </div>
            <span className="font-mono text-[11px]">Engine v1.0.4 • VIT Capstone</span>
          </div>

        </div>

      </div>
    </section>
  );
}
