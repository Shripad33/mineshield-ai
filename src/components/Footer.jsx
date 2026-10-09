import React from 'react';
import { Shield, HardHat, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-[#080d17] text-slate-400 text-xs font-mono py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1: System Identification */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-200">
              <HardHat className="w-4 h-4 text-amber-400" />
              <span className="font-bold tracking-tight text-white">MINDSHIELD AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                PROTOTYPE v1.0
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Mining safety monitoring dashboard prototype engineered for high-risk subterranean environments.
            </p>
          </div>

          {/* Col 2: Regulatory Compliance References */}
          <div className="space-y-1 text-[11px]">
            <div className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Safety Standards Referenced</span>
            </div>
            <p className="text-slate-400">MSHA 30 CFR Part 75 (Mandatory Safety Standards for Underground Coal Mines)</p>
            <p className="text-slate-400">OSHA 29 CFR 1926.800 (Underground Construction Regulations)</p>
            <p className="text-slate-400">NIOSH Mining Program Gas Hazard Alert Guidelines</p>
          </div>

          {/* Col 3: Hardware & AI Disclaimers */}
          <div className="space-y-1 text-[11px]">
            <div className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulated Architecture Notice</span>
            </div>
            <p className="text-slate-400">
              Telemetry is simulated. The application is not connected to real mine equipment or life-safety hardware.
            </p>
            <p className="text-slate-400">
              Safety Advisor operates via deterministic Boolean logic rules. No external AI API is called.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} MindShield AI Engineering Prototype. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <span>Synthetic Telemetry Engine v4.2</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> System Stable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
