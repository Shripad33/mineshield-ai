import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  FileText, 
  Compass, 
  Lock, 
  Wind, 
  Info, 
  Cpu, 
  CheckCircle2,
  HardHat
} from 'lucide-react';

export function SafetyAdvisorPanel({ safetyAdvisory }) {
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isCritical = safetyAdvisory.systemStatus === 'critical';
  const isWarning = safetyAdvisory.systemStatus === 'warning';

  return (
    <div className={`rounded-2xl border transition-all card-bevel overflow-hidden ${
      isCritical
        ? 'bg-gradient-to-b from-[#190c13] to-[#0f080d] border-rose-500/70 shadow-xl shadow-rose-950/50'
        : isWarning
          ? 'bg-gradient-to-b from-[#18130c] to-[#0f0c08] border-amber-500/60 shadow-lg shadow-amber-950/40'
          : 'bg-slate-900/85 border-slate-800/90 shadow-xl shadow-black/40'
    }`}>
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/30">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0 ${
            isCritical
              ? 'bg-rose-600 shadow-rose-900/60 ring-2 ring-rose-500/40'
              : isWarning
                ? 'bg-amber-500 text-slate-950 shadow-amber-900/40 ring-1 ring-amber-400/50'
                : 'bg-gradient-to-br from-indigo-600 to-blue-700 shadow-indigo-950/40 border border-indigo-400/30'
          }`}>
            <Cpu className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-extrabold font-mono text-white tracking-tight">
                SAFETY ADVISOR MATRIX
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-cyan-300 border border-cyan-500/40 font-bold uppercase tracking-wider">
                Deterministic Rules
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated compliance directives mapped to MSHA 30 CFR & OSHA 1926.800
            </p>
          </div>
        </div>

        {/* Status Protocol Level Pill */}
        <div className="shrink-0">
          <span className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
            isCritical
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-sm shadow-rose-950 animate-pulse'
              : isWarning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          }`}>
            <HardHat className="w-3.5 h-3.5" />
            <span>{safetyAdvisory.protocolLevel}</span>
          </span>
        </div>
      </div>

      {/* Advisory Content */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Transparent Architecture Note */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-start gap-2.5 shadow-inner">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-300 font-semibold font-sans">Deterministic Engine Guarantee: </span>
            <span className="leading-relaxed">
              All mitigation recommendations are evaluated strictly via deterministic Boolean logic rules. 
              <strong> MindShield AI does not query external AI models or non-verifiable black-box neural networks</strong> for emergency safety protocols.
            </span>
          </div>
        </div>

        {/* Lead Directive Banner */}
        <div className={`p-4 rounded-xl border text-sm font-medium card-bevel ${
          isCritical
            ? 'bg-rose-950/35 border-rose-500/60 text-rose-200'
            : isWarning
              ? 'bg-amber-950/35 border-amber-500/60 text-amber-200'
              : 'bg-slate-950/70 border-slate-800 text-slate-200'
        }`}>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Primary Safety Directive</span>
          </div>
          <p className="leading-relaxed font-sans text-xs sm:text-sm">{safetyAdvisory.leadRecommendation}</p>
        </div>

        {/* Actionable Protocol Checklist */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 font-semibold px-0.5">
            <span>Action Checklist ({safetyAdvisory.protocols.length} Protocols)</span>
            <span>Safety Officer Sign-Off</span>
          </div>

          <div className="space-y-2">
            {safetyAdvisory.protocols.map((protocol, idx) => {
              const isChecked = !!completedSteps[idx];
              const isProtocolCrit = protocol.priority === 'CRITICAL';

              return (
                <div
                  key={protocol.code || idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none card-bevel ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                      : isProtocolCrit
                        ? 'bg-rose-950/25 border-rose-500/50 hover:bg-rose-950/40 hover:border-rose-500/70'
                        : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-slate-400 hover:text-white shrink-0 focus:outline-none"
                    aria-label={isChecked ? "Mark as uncompleted" : "Mark as completed"}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 transition-transform scale-105" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className={`text-xs font-mono font-bold ${
                        isChecked 
                          ? 'line-through text-slate-500' 
                          : isProtocolCrit 
                            ? 'text-rose-300' 
                            : 'text-slate-200'
                      }`}>
                        [{protocol.code}] {protocol.action}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isProtocolCrit ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {protocol.priority}
                      </span>
                    </div>

                    {protocol.evacuationNotice && (
                      <div className="text-xs text-amber-300 flex items-center gap-1.5 font-mono pt-0.5">
                        <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{protocol.evacuationNotice}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 border-t border-slate-900/80">
                      <span>Regulatory: {protocol.regulatoryRef || 'MSHA CFR §75.323'}</span>
                      <span>Assigned: <strong className="text-slate-400">{protocol.responsible}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
