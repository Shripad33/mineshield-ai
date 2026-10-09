import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Flame, 
  Activity, 
  Wind, 
  Users, 
  Gauge 
} from 'lucide-react';

export function OverviewCards({ zones, systemSafetyAdvisory }) {
  // Aggregate system statistics
  let totalPersonnel = 0;
  let maxCh4 = 0;
  let maxCo = 0;
  let maxVibration = 0;
  let minAirflow = 999;
  let criticalCount = 0;
  let warningCount = 0;

  zones.forEach((zone) => {
    totalPersonnel += zone.personnel || 0;
    if (zone.status === 'critical') criticalCount++;
    else if (zone.status === 'warning') warningCount++;

    if (zone.sensors.ch4.value > maxCh4) maxCh4 = zone.sensors.ch4.value;
    if (zone.sensors.co.value > maxCo) maxCo = zone.sensors.co.value;
    if (zone.sensors.vibration.value > maxVibration) maxVibration = zone.sensors.vibration.value;
    if (zone.sensors.airflow.value < minAirflow) minAirflow = zone.sensors.airflow.value;
  });

  const isCritical = criticalCount > 0;
  const isWarning = warningCount > 0 && !isCritical;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      
      {/* 1. Overall Mine Condition */}
      <div className={`p-4 rounded-xl border transition-all sm:col-span-2 lg:col-span-1 card-bevel ${
        isCritical 
          ? 'bg-gradient-to-b from-rose-950/60 to-rose-950/30 border-rose-500/70 shadow-lg shadow-rose-950/50 ring-1 ring-rose-500/40 animate-emergency-border' 
          : isWarning 
            ? 'bg-gradient-to-b from-amber-950/50 to-amber-950/20 border-amber-500/60 shadow-md shadow-amber-950/40' 
            : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700/80'
      }`}>
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-wider">
          <span className="font-semibold uppercase">Mine Integrity</span>
          {isCritical ? (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          ) : isWarning ? (
            <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className={`text-lg sm:text-xl font-extrabold font-mono tracking-tight ${
            isCritical ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' : isWarning ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {isCritical ? 'CRITICAL ALERT' : isWarning ? 'ELEVATED RISK' : 'NOMINAL SAFE'}
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Sectors: <strong>3 Active</strong></span>
          <span className={isCritical ? 'text-rose-400 font-bold' : isWarning ? 'text-amber-400 font-bold' : 'text-slate-400'}>
            {criticalCount} Crit | {warningCount} Warn
          </span>
        </div>
      </div>

      {/* 2. Atmospheric Gas Risk Index */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 transition-all hover:border-slate-700/80 card-bevel">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-wider">
          <span className="font-semibold uppercase">Atmospheric Gas</span>
          <Flame className={`w-4 h-4 ${maxCh4 >= 1.5 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`} />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className={`text-xl font-extrabold font-mono tabular-nums ${
            maxCh4 >= 1.5 ? 'text-rose-400' : maxCh4 >= 1.0 ? 'text-amber-400' : 'text-slate-100'
          }`}>
            {maxCh4.toFixed(2)}%
          </span>
          <span className="text-xs text-slate-400 font-mono">LEL Peak CH₄</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Peak CO:</span>
          <span className={`font-semibold tabular-nums ${maxCo >= 50 ? 'text-rose-400 font-bold' : maxCo >= 25 ? 'text-amber-400' : 'text-slate-300'}`}>
            {maxCo} ppm
          </span>
        </div>
      </div>

      {/* 3. Seismic Ground Stability */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 transition-all hover:border-slate-700/80 card-bevel">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-wider">
          <span className="font-semibold uppercase">Seismic Ground</span>
          <Activity className={`w-4 h-4 ${maxVibration >= 8.0 ? 'text-rose-500 animate-pulse' : 'text-indigo-400'}`} />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className={`text-xl font-extrabold font-mono tabular-nums ${
            maxVibration >= 8.0 ? 'text-rose-400' : maxVibration >= 4.0 ? 'text-amber-400' : 'text-slate-100'
          }`}>
            {maxVibration.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 font-mono">mm/s PPV</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Strata:</span>
          <span className={`font-semibold ${maxVibration >= 8.0 ? 'text-rose-400 font-bold' : maxVibration >= 4.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {maxVibration >= 8.0 ? 'Rockburst Risk' : maxVibration >= 4.0 ? 'Micro-Seismic' : 'Bedrock Stable'}
          </span>
        </div>
      </div>

      {/* 4. Primary Ventilation */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 transition-all hover:border-slate-700/80 card-bevel">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-wider">
          <span className="font-semibold uppercase">Ventilation Split</span>
          <Wind className={`w-4 h-4 ${minAirflow < 0.6 ? 'text-rose-500 animate-pulse' : 'text-teal-400'}`} />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className={`text-xl font-extrabold font-mono tabular-nums ${
            minAirflow < 0.6 ? 'text-rose-400' : minAirflow < 1.4 ? 'text-amber-400' : 'text-slate-100'
          }`}>
            {minAirflow.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 font-mono">m/s Min Flow</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Fan Circuit:</span>
          <span className={`font-semibold ${minAirflow < 0.6 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
            {minAirflow < 0.6 ? 'Air Stagnation' : '60 Hz Dual Intake'}
          </span>
        </div>
      </div>

      {/* 5. Active Personnel Tracking */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 transition-all hover:border-slate-700/80 card-bevel">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-wider">
          <span className="font-semibold uppercase">Personnel</span>
          <Users className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-xl font-extrabold font-mono tabular-nums text-slate-100">
            {totalPersonnel}
          </span>
          <span className="text-xs text-slate-400 font-mono">Miners On-Shift</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Refuge Units:</span>
          <span className="text-emerald-400 font-semibold">3/3 Ready (100%)</span>
        </div>
      </div>

    </div>
  );
}
