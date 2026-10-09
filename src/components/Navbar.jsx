import React from 'react';
import { 
  ShieldAlert, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Clock, 
  Activity,
  Cpu,
  Radio
} from 'lucide-react';

export function Navbar({
  isPaused,
  onTogglePause,
  onResetDemo,
  onOpenHazardModal,
  tickInterval,
  onChangeTickInterval,
  uptimeSeconds,
  activeCriticalCount,
  isMuted,
  onToggleMute
}) {
  const formatUptime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hrs = Math.floor(mins / 60);
    return `${hrs.toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080d17]/95 border-b border-slate-800/90 backdrop-blur-md px-3.5 sm:px-6 py-2.5 transition-colors card-bevel">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand & Mode Identification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-md ${
                activeCriticalCount > 0 
                  ? 'bg-rose-600 shadow-rose-600/40 ring-2 ring-rose-500/50 animate-pulse' 
                  : 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-950/40 border border-emerald-400/30'
              }`}>
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#080d17] ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
              }`} />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-mono">
                  MINDSHIELD <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">AI</span>
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold uppercase tracking-wider">
                  Testbench Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-normal">
                Subterranean Atmospheric & Geotechnical Telemetry Monitor
              </p>
            </div>
          </div>

          {/* Mobile Status Tag */}
          <div className="md:hidden flex items-center space-x-2">
            <span className={`text-[10px] px-2 py-1 rounded font-mono font-bold uppercase tracking-wider ${
              activeCriticalCount > 0
                ? 'bg-rose-950 text-rose-300 border border-rose-600 animate-pulse'
                : isPaused 
                  ? 'bg-amber-950/90 text-amber-300 border border-amber-700' 
                  : 'bg-emerald-950/90 text-emerald-300 border border-emerald-700'
            }`}>
              {activeCriticalCount > 0 ? 'CRITICAL' : isPaused ? 'PAUSED' : 'LIVE'}
            </span>
          </div>
        </div>

        {/* Center / Right Controls: Simulation Ticker, Audio, Reset & Hazard Trigger */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          
          {/* Uptime and Cycle Selector */}
          <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-inner">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="tabular-nums">Uptime: {formatUptime(uptimeSeconds)}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-amber-400" />
              <span className="text-slate-400">Cycle:</span>
              <select 
                value={tickInterval} 
                onChange={(e) => onChangeTickInterval(Number(e.target.value))}
                aria-label="Simulation update cycle interval"
                className="bg-transparent text-amber-400 font-mono text-[11px] focus:outline-none cursor-pointer"
              >
                <option value={1000} className="bg-slate-900 text-slate-200">1.0s (Fast)</option>
                <option value={2500} className="bg-slate-900 text-slate-200">2.5s (Normal)</option>
                <option value={5000} className="bg-slate-900 text-slate-200">5.0s (Slow)</option>
              </select>
            </span>
          </div>

          {/* Pause / Resume Button */}
          <button
            onClick={onTogglePause}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
              isPaused
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 hover:bg-amber-500/25 shadow-sm shadow-amber-950/40'
                : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
            }`}
            title={isPaused ? "Resume real-time simulated telemetry" : "Pause simulated data updates"}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-400" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono bg-slate-900 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-colors"
            title="Restore all sensors to nominal baseline values"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset Demo</span>
            <span className="sm:hidden">Reset</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 transition-colors"
            title={isMuted ? "Unmute audio alerts" : "Mute audio alerts"}
            aria-label="Toggle alert sound"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* Hazard Simulation Button (High-visibility action) */}
          <button
            onClick={onOpenHazardModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-red-500/70 shadow-md shadow-red-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Inject a critical hazard scenario into an underground zone"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>Simulate Hazard</span>
          </button>

        </div>

      </div>
    </header>
  );
}
