import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ShieldAlert, 
  RotateCcw, 
  Radio, 
  ArrowRight,
  Activity
} from 'lucide-react';

export function AlertPanel({ 
  activeAlerts, 
  onResolveHazard, 
  onOpenHazardModal 
}) {
  const hasAlerts = activeAlerts && activeAlerts.length > 0;
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className={`rounded-2xl border transition-all duration-300 card-bevel overflow-hidden ${
      hasAlerts && criticalCount > 0
        ? 'bg-gradient-to-b from-[#200d14] via-[#14080e] to-[#0c0509] border-rose-500/80 shadow-2xl shadow-rose-950/70 ring-1 ring-rose-500/60 animate-emergency-border'
        : hasAlerts
          ? 'bg-gradient-to-b from-[#1e150a] via-[#140e06] to-[#0c0904] border-amber-500/80 shadow-xl shadow-amber-950/50 ring-1 ring-amber-500/50'
          : 'bg-slate-900/85 border-slate-800/90 shadow-xl shadow-black/40'
    }`}>
      
      {/* Alert Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/30">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0 transition-transform ${
            criticalCount > 0
              ? 'bg-rose-600 shadow-rose-900/80 ring-2 ring-rose-400/50 animate-bounce'
              : hasAlerts
                ? 'bg-amber-500 text-slate-950 shadow-amber-900/40 ring-1 ring-amber-400/60'
                : 'bg-emerald-600/25 text-emerald-400 border border-emerald-500/40'
          }`}>
            {criticalCount > 0 ? (
              <AlertOctagon className="w-5 h-5" />
            ) : hasAlerts ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
                <span>ACTIVE ALARM DISPATCH</span>
              </h3>
              {hasAlerts ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse font-bold tracking-wider uppercase">
                  {criticalCount} Critical | {activeAlerts.length} Active
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold tracking-wider">
                  ALL SAFE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Subterranean telemetry supervisory alerts & immediate dispatch actions
            </p>
          </div>
        </div>

        {/* Header Right Action */}
        <div className="shrink-0">
          {hasAlerts ? (
            <div className="flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-ping" />
              <span className="font-semibold text-[11px]">DISPATCH BROADCAST LIVE</span>
            </div>
          ) : (
            <button
              onClick={onOpenHazardModal}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-sm"
            >
              <span>Test Hazard Alarm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Alert Body */}
      <div className="p-4 sm:p-5">
        {!hasAlerts ? (
          /* Nominal State View */
          <div className="py-7 px-4 text-center rounded-xl bg-slate-950/50 border border-slate-800/70 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold font-mono text-emerald-400">
              All Underground Sectors Operating In Nominal Safety Envelopes
            </h4>
            <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
              Atmospheric gas concentrations, ground seismic vibrations, ventilation velocity, and particulate dust are all within legally permitted MSHA/OSHA thresholds.
            </p>
          </div>
        ) : (
          /* Active Alerts List */
          <div className="space-y-3.5">
            {activeAlerts.map((alert) => {
              const isCrit = alert.severity === 'critical';
              return (
                <div
                  key={alert.id || alert.zoneId}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all card-bevel ${
                    isCrit
                      ? 'bg-rose-950/40 border-rose-500/70 shadow-lg shadow-rose-950/50'
                      : 'bg-amber-950/40 border-amber-500/60 shadow-md shadow-amber-950/40'
                  }`}
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isCrit
                          ? 'bg-rose-600 text-white border-rose-400 shadow-sm shadow-rose-950 animate-pulse'
                          : 'bg-amber-500 text-slate-950 border-amber-400'
                      }`}>
                        {alert.severity?.toUpperCase()} SEV-1
                      </span>

                      <span className="text-sm font-extrabold font-mono text-white">
                        {alert.zoneName}
                      </span>

                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 tabular-nums ml-auto sm:ml-0">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-rose-200 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{alert.hazardType || alert.title}</span>
                    </div>

                    <div className="text-xs font-mono text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 shadow-inner">
                      <span className="text-slate-400 font-sans">Trigger Telemetry: </span>
                      <strong className="text-amber-300 tracking-wide font-mono">{alert.keyMetric || alert.description}</strong>
                    </div>
                  </div>

                  {/* Actions for this alert */}
                  <div className="flex sm:flex-col md:flex-row items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    <button
                      onClick={() => onResolveHazard(alert.zoneId)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-200 bg-slate-900 hover:bg-emerald-700/60 hover:text-emerald-200 border border-slate-700 hover:border-emerald-500 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                      title="De-escalate hazard condition back to safe baseline"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Resolve & Clear</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
