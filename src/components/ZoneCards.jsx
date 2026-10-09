import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  AlertOctagon, 
  Flame, 
  Activity, 
  Wind, 
  Thermometer, 
  Users, 
  Compass, 
  Shield, 
  Zap, 
  ChevronRight,
  Gauge,
  Sparkles,
  CloudFog
} from 'lucide-react';

export function ZoneCards({ zones, onTriggerZoneHazard }) {
  const [expandedZoneId, setExpandedZoneId] = useState(null);

  const toggleDetails = (id) => {
    setExpandedZoneId(expandedZoneId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    if (status === 'critical') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-lg shadow-rose-950/60 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          Critical Sev-1
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-950/40">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Warning Alert
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
        Nominal Safe
      </span>
    );
  };

  // Helper for sensor value color
  const getSensorColor = (key, value) => {
    switch (key) {
      case 'ch4':
        return value >= 1.5 ? 'text-rose-400 font-extrabold' : value >= 1.0 ? 'text-amber-400 font-bold' : 'text-slate-100 font-semibold';
      case 'co':
        return value >= 50 ? 'text-rose-400 font-extrabold' : value >= 25 ? 'text-amber-400 font-bold' : 'text-slate-100 font-semibold';
      case 'o2':
        return value < 19.5 ? 'text-rose-400 font-extrabold' : value < 20.2 ? 'text-amber-400 font-bold' : 'text-slate-100 font-semibold';
      case 'temperature':
        return value >= 40.0 ? 'text-rose-400 font-extrabold' : value >= 32.0 ? 'text-amber-400 font-bold' : 'text-slate-100 font-semibold';
      case 'vibration':
        return value >= 8.0 ? 'text-rose-400 font-extrabold' : value >= 4.0 ? 'text-amber-400 font-bold' : 'text-slate-100 font-semibold';
      case 'airflow':
        return value < 0.6 ? 'text-rose-400 font-extrabold' : value < 1.4 ? 'text-amber-400 font-bold' : 'text-slate-100 font-semibold';
      case 'aqi':
        return value >= 150 ? 'text-rose-400 font-extrabold' : value >= 80 ? 'text-amber-400 font-bold' : 'text-slate-100 font-semibold';
      default:
        return 'text-slate-100';
    }
  };

  // Helper for sensor percentage bar
  const getBarPercentage = (key, val) => {
    switch (key) {
      case 'ch4': return Math.min(100, (val / 3.0) * 100);
      case 'co': return Math.min(100, (val / 100) * 100);
      case 'o2': return Math.min(100, Math.max(0, ((val - 17) / (23 - 17)) * 100));
      case 'temperature': return Math.min(100, (val / 55) * 100);
      case 'vibration': return Math.min(100, (val / 16) * 100);
      case 'airflow': return Math.min(100, (val / 4.0) * 100);
      case 'aqi': return Math.min(100, (val / 300) * 100);
      default: return 50;
    }
  };

  const getBarColor = (key, val) => {
    switch (key) {
      case 'ch4': return val >= 1.5 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : val >= 1.0 ? 'bg-amber-500' : 'bg-cyan-500';
      case 'co': return val >= 50 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : val >= 25 ? 'bg-amber-500' : 'bg-teal-500';
      case 'o2': return val < 19.5 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : val < 20.2 ? 'bg-amber-500' : 'bg-emerald-500';
      case 'temperature': return val >= 40.0 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : val >= 32.0 ? 'bg-amber-500' : 'bg-amber-400';
      case 'vibration': return val >= 8.0 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : val >= 4.0 ? 'bg-amber-500' : 'bg-indigo-400';
      case 'airflow': return val < 0.6 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : val < 1.4 ? 'bg-amber-500' : 'bg-cyan-400';
      case 'aqi': return val >= 150 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : val >= 80 ? 'bg-amber-500' : 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800/60">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2.5 font-mono">
            <span>SUBTERRANEAN SECTOR MONITOR</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700 font-semibold tracking-wider">
              3 Primary Zones
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time simulated telemetry with automated threshold violation checks
          </p>
        </div>
      </div>

      {/* Grid of 3 Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {zones.map((zone) => {
          const isCrit = zone.status === 'critical';
          const isWarn = zone.status === 'warning';
          const isExpanded = expandedZoneId === zone.id;

          return (
            <div
              key={zone.id}
              className={`rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between card-bevel ${
                isCrit
                  ? 'bg-gradient-to-b from-[#180c13] to-[#0f080d] border-rose-500/80 shadow-2xl shadow-rose-950/70 ring-1 ring-rose-500/60'
                  : isWarn
                    ? 'bg-gradient-to-b from-[#19140d] to-[#100d08] border-amber-500/70 shadow-xl shadow-amber-950/50 ring-1 ring-amber-500/40'
                    : 'bg-slate-900/85 border-slate-800/90 hover:border-slate-700 shadow-xl shadow-black/40'
              }`}
            >
              {/* Top Hazard Warning Pattern Strip */}
              {isCrit && (
                <div className="hazard-stripe-red h-2.5 w-full absolute top-0 left-0 animate-pulse" />
              )}
              {isWarn && (
                <div className="hazard-stripe-amber h-2 w-full absolute top-0 left-0" />
              )}

              {/* Card Header */}
              <div className="p-4 sm:p-5 pb-3">
                
                {/* Zone Name & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-extrabold font-mono text-white tracking-tight">
                        {zone.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 border border-slate-700/80 font-bold">
                        {zone.depth}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {zone.subTitle}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {getStatusBadge(zone.status)}
                  </div>
                </div>

                {/* Sub-bar tags */}
                <div className="mt-3.5 flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 shadow-inner">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Personnel: <strong className="text-slate-200 tabular-nums">{zone.personnel}</strong></span>
                  </span>
                  <span className="text-slate-700">|</span>
                  <span className="truncate max-w-[150px] text-slate-300 font-medium">
                    {zone.sectorType}
                  </span>
                </div>

                {/* Injected Hazard Banner if Active */}
                {zone.activeHazard && (
                  <div className="mt-3.5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-2.5 animate-pulse shadow-md shadow-rose-950/60">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold font-mono text-rose-300 tracking-wide">ACTIVE CATASTROPHIC BREACH</p>
                      <p className="text-rose-200/90 text-xs leading-relaxed mt-0.5">{zone.activeHazard.title}</p>
                    </div>
                  </div>
                )}

                {/* Sensor Matrix Breakdown */}
                <div className="mt-4 space-y-2.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex justify-between px-0.5">
                    <span>Atmospheric & Ground Streams</span>
                    <span>Safe Limits</span>
                  </div>

                  {/* 1. Methane CH4 Mini-Card */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/70 hover:border-slate-700/80 transition-colors">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        {zone.sensors.ch4.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs tabular-nums ${getSensorColor('ch4', zone.sensors.ch4.value)}`}>
                          {zone.sensors.ch4.value.toFixed(2)} {zone.sensors.ch4.unit}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">(&lt;1.00%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800/40">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getBarColor('ch4', zone.sensors.ch4.value)}`} 
                        style={{ width: `${getBarPercentage('ch4', zone.sensors.ch4.value)}%` }}
                      />
                    </div>
                  </div>

                  {/* 2. Carbon Monoxide CO Mini-Card */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/70 hover:border-slate-700/80 transition-colors">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Wind className="w-3.5 h-3.5 text-teal-400" />
                        {zone.sensors.co.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs tabular-nums ${getSensorColor('co', zone.sensors.co.value)}`}>
                          {zone.sensors.co.value} {zone.sensors.co.unit}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">(&lt;25 ppm)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800/40">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getBarColor('co', zone.sensors.co.value)}`} 
                        style={{ width: `${getBarPercentage('co', zone.sensors.co.value)}%` }}
                      />
                    </div>
                  </div>

                  {/* 3. Seismic Vibration PPV Mini-Card */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/70 hover:border-slate-700/80 transition-colors">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Activity className="w-3.5 h-3.5 text-indigo-400" />
                        {zone.sensors.vibration.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs tabular-nums ${getSensorColor('vibration', zone.sensors.vibration.value)}`}>
                          {zone.sensors.vibration.value.toFixed(1)} {zone.sensors.vibration.unit}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">(&lt;4.0 mm/s)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800/40">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getBarColor('vibration', zone.sensors.vibration.value)}`} 
                        style={{ width: `${getBarPercentage('vibration', zone.sensors.vibration.value)}%` }}
                      />
                    </div>
                  </div>

                  {/* 4. Temperature & Airflow Dual Column Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/70">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-amber-400" /> Temp
                        </span>
                        <span className={`tabular-nums ${getSensorColor('temperature', zone.sensors.temperature.value)}`}>
                          {zone.sensors.temperature.value.toFixed(1)}°C
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-800/40">
                        <div 
                          className={`h-full rounded-full ${getBarColor('temperature', zone.sensors.temperature.value)}`} 
                          style={{ width: `${getBarPercentage('temperature', zone.sensors.temperature.value)}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/70">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Wind className="w-3 h-3 text-cyan-400" /> Airflow
                        </span>
                        <span className={`tabular-nums ${getSensorColor('airflow', zone.sensors.airflow.value)}`}>
                          {zone.sensors.airflow.value.toFixed(2)} m/s
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-800/40">
                        <div 
                          className={`h-full rounded-full ${getBarColor('airflow', zone.sensors.airflow.value)}`} 
                          style={{ width: `${getBarPercentage('airflow', zone.sensors.airflow.value)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Oxygen O2 & Dust AQI Dual Column Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 text-[10px] font-mono flex items-center justify-between">
                      <span className="text-slate-400">Oxygen O₂:</span>
                      <span className={`tabular-nums font-semibold ${getSensorColor('o2', zone.sensors.o2.value)}`}>
                        {zone.sensors.o2.value.toFixed(1)}%
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 text-[10px] font-mono flex items-center justify-between">
                      <span className="text-slate-400">Dust AQI:</span>
                      <span className={`tabular-nums font-semibold ${getSensorColor('aqi', zone.sensors.aqi.value)}`}>
                        {zone.sensors.aqi.value}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Collapsible Egress & Refuge Details */}
                {isExpanded && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2.5 shadow-inner animate-fadeIn">
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">Primary Egress Route:</span>
                      <span className="text-amber-300 flex items-center gap-1.5 mt-1 font-medium">
                        <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {zone.evacuationRoute}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">Hardened Refuge Station:</span>
                      <span className="text-emerald-300 flex items-center gap-1.5 mt-1 font-medium">
                        <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {zone.refugeChamber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/80 pt-2 text-[10px]">
                      <span>Ventilation Split: <strong>60Hz Constant</strong></span>
                      <span>Muster Call: <strong>Active</strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2.5">
                <button
                  onClick={() => toggleDetails(zone.id)}
                  className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-900"
                >
                  <span>{isExpanded ? 'Hide Egress' : 'Egress / Refuge'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                <button
                  onClick={() => onTriggerZoneHazard(zone.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-500/70 transition-all active:scale-95 shadow-sm"
                  title={`Inject critical hazard scenario specifically into ${zone.name}`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Hazard</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
