'use client';

export default function Workflow() {
  const steps = [
    {
      number: '01',
      title: 'Connect Account',
      subtitle: 'User-Owned Profile Audit',
      description: 'Authorize read-only sample access or paste writing samples from your target pseudonymous accounts (e.g. GitHub, X/Twitter, Reddit).',
    },
    {
      number: '02',
      title: 'Analyze Data',
      subtitle: 'Multi-Vector Feature Extraction',
      description: 'The Deanonymizer engine extracts stylometric n-grams, punctuation entropy, sentence cadence, and temporal posting distribution.',
    },
    {
      number: '03',
      title: 'View Report',
      subtitle: 'Privacy Score & Mitigation',
      description: 'Review your cross-platform identity linkability score, identified similarity markers, and actionable recommendations to obfuscate your trace.',
    },
  ];

  return (
    <section id="workflow" className="py-20 md:py-32 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Ambient background glow */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-orange/5 blur-[160px] pointer-events-none rounded-full" /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Clean Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Workflow Roadmap
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Understand how Deanonymizer inspects public writing patterns and metadata step by step.
          </p>
        </div>

        {/* Horizontal Timeline Container */}
        <div className="relative">
          {/* Desktop Horizontal Connecting Line */}
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-1 bg-gradient-to-r from-brand-orange via-orange-400 to-slate-200 rounded-full shadow-sm" />

          {/* Grid of 3 Horizontal Roadmap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center group">
                
                {/* Horizontal Step Node */}
                <div className="relative mb-6 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-brand-orange flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="font-mono font-extrabold text-xl text-brand-orange">{step.number}</span>
                  </div>
                </div>

                {/* Modern Minimal Card */}
                <div className="w-full h-full p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 group-hover:border-brand-orange/60 group-hover:bg-white transition-all duration-300 shadow-sm group-hover:shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div>
                    {/* Big Text Heading */}
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-brand-orange transition-colors">
                      {step.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-xs font-mono text-brand-orange font-bold mt-2 tracking-wide uppercase">
                      {step.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mt-5">
                      {step.description}
                    </p>
                  </div>

                  {/* Top Border Glow Accent on Hover */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl" />
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


