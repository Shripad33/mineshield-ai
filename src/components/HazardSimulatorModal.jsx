import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Flame, 
  Activity, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  PlayCircle, 
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { HAZARD_PRESETS } from '../data/initialData';

export function HazardSimulatorModal({
  isOpen,
  onClose,
  zones,
  onApplyHazard,
  preselectedZoneId = null
}) {
  const [selectedZoneId, setSelectedZoneId] = useState(preselectedZoneId || 'zone-a');
  const [selectedHazardId, setSelectedHazardId] = useState('ch4-breach');

  if (!isOpen) return null;

  const currentPreset = HAZARD_PRESETS.find((h) => h.id === selectedHazardId) || HAZARD_PRESETS[0];
  const targetZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  const handleExecute = () => {
    onApplyHazard(selectedZoneId, currentPreset);
    onClose();
  };

  const getHazardIcon = (id) => {
    switch (id) {
      case 'ch4-breach': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'co-toxic': return <Wind className="w-5 h-5 text-teal-400" />;
      case 'seismic-rockburst': return <Activity className="w-5 h-5 text-rose-400" />;
      case 'thermal-conveyor': return <Thermometer className="w-5 h-5 text-red-400" />;
      case 'ventilation-failure': return <Wind className="w-5 h-5 text-cyan-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0a0f1b] border border-rose-500/60 rounded-2xl shadow-2xl shadow-rose-950/80 overflow-hidden flex flex-col max-h-[92vh] card-bevel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-500/60 flex items-center justify-center text-rose-400 shadow-md shadow-rose-900/50 shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold font-mono text-white flex items-center gap-2">
                <span>SIMULATE CRITICAL HAZARD</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold">
                  Fault Injection
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Trigger catastrophic sensor spikes across subterranean mining sectors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 text-sm">
          
          {/* 1. Zone Target Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
              1. Select Target Subterranean Sector:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {zones.map((zone) => {
                const isSelected = selectedZoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-950/50 border-rose-500 text-white ring-2 ring-rose-500/40 shadow-lg shadow-rose-950/50'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs">{zone.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-semibold">
                        {zone.depth}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{zone.subTitle}</p>
                    <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                      <span>Miners: <strong className="text-slate-300">{zone.personnel}</strong></span>
                      <span className={`uppercase font-bold ${
                        zone.status === 'critical' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {zone.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Hazard Scenario Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
              2. Select Emergency Hazard Preset:
            </label>
            <div className="space-y-2.5">
              {HAZARD_PRESETS.map((preset) => {
                const isSelected = selectedHazardId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedHazardId(preset.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 card-bevel ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/60 shadow-lg shadow-rose-950/40'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      {getHazardIcon(preset.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm font-mono text-slate-100">
                          {preset.title}
                        </span>
                        <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          CRITICAL SEV-1
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                      
                      {/* Affected Sensor Overrides Preview */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] font-mono">
                        {Object.entries(preset.sensorOverrides).map(([sensorKey, val]) => (
                          <span key={sensorKey} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-rose-300 font-bold tabular-nums">
                            {sensorKey.toUpperCase()}: {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Impact Warning Notice */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-2.5 shadow-inner">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Clicking <strong>Trigger Hazard Now</strong> will immediately inject these extreme sensor spikes into <strong>{targetZone.name}</strong>, trip emergency interlocks, and log an audit record.
            </span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecute}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-red-500 shadow-xl shadow-red-950/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlayCircle className="w-4 h-4 text-white" />
            <span>Trigger Hazard on {targetZone.name}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
