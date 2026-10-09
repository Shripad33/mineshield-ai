import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export function ClearHistoryConfirmModal({ isOpen, onClose, onConfirm, count }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0d131f] border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white">
                CONFIRM AUDIT LOG PURGE
              </h3>
              <p className="text-xs text-slate-400">
                Action requires safety officer authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-sm space-y-3">
          <p className="text-slate-300">
            Are you sure you want to permanently clear all <strong className="text-amber-400 font-mono">{count}</strong> incident log records from this session?
          </p>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono">
            ⚠️ <strong>Notice:</strong> This action clears simulated telemetry incident records from local application memory. You can still export to CSV prior to clearing if you need an audit trail.
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 shadow-lg shadow-rose-950 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Clear History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
