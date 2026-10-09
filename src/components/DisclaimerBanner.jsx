import React, { useState } from 'react';
import { Info, AlertCircle, ShieldAlert, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

export function DisclaimerBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900/90 border-b border-amber-500/20 px-4 py-2 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-mono font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
            Synthetic Telemetry Mode
          </span>
          <p className="text-slate-300 text-xs">
            <span className="font-semibold text-slate-200">Demonstration Prototype:</span> Readings are synthetically generated for UI/UX testing. Not connected to real physical mine transducers or life-safety hardware.
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors ml-auto md:ml-0"
        >
          <span>{isExpanded ? 'Hide Architecture Notes' : 'Hardware Simulation Specs'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/50 p-3 rounded-lg">
          <div className="space-y-1">
            <div className="text-slate-200 font-semibold flex items-center gap-1">
              <Terminal className="w-3 h-3 text-amber-400" />
              <span>Simulated Data Pipeline</span>
            </div>
            <p className="text-slate-400">
              Generates stochastic Brownian jitter around calibrated subterranean baselines (CH₄, CO, O₂, PPV, Airflow, Temp).
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-slate-200 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-emerald-400" />
              <span>Rule Engine Distinction</span>
            </div>
            <p className="text-slate-400">
              Recommendations originate from a deterministic Boolean logic matrix (MSHA 30 CFR / OSHA 1926.800), not an external generative LLM.
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-slate-200 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-cyan-400" />
              <span>Safety Disclaimer</span>
            </div>
            <p className="text-slate-400">
              This dashboard is strictly an engineering software prototype for UI evaluation and must not be used for operational life-safety decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
