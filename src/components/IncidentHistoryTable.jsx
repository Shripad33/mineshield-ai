import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Trash2, 
  Search, 
  X, 
  FileSpreadsheet, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert
} from 'lucide-react';
import { exportIncidentsToCSV } from '../utils/csvExporter';
import { ClearHistoryConfirmModal } from './ClearHistoryConfirmModal';

export function IncidentHistoryTable({ incidents, onClearHistory }) {
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all' | 'critical' | 'warning' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Filter and search logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      // Severity filter
      if (filterSeverity === 'critical' && item.severity !== 'critical') return false;
      if (filterSeverity === 'warning' && item.severity !== 'warning') return false;
      if (filterSeverity === 'resolved' && item.status !== 'Resolved') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = item.id.toLowerCase().includes(q);
        const matchZone = item.zoneName.toLowerCase().includes(q);
        const matchHazard = (item.hazardType || '').toLowerCase().includes(q);
        const matchRec = (item.recommendation || '').toLowerCase().includes(q);
        const matchMetric = (item.keyMetric || '').toLowerCase().includes(q);
        return matchId || matchZone || matchHazard || matchRec || matchMetric;
      }
      return true;
    });
  }, [incidents, filterSeverity, searchQuery]);

  // Handle Export to CSV
  const handleExport = () => {
    const success = exportIncidentsToCSV(filteredIncidents.length > 0 ? filteredIncidents : incidents);
    if (success) {
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 4000);
    }
  };

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-950">
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50">
            Warning
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            {sev?.toUpperCase() || 'INFO'}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/85 shadow-xl shadow-black/40 overflow-hidden card-bevel">
      
      {/* Table Header and Toolbars */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>INCIDENT & TELEMETRY AUDIT LOG</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700 font-bold">
              {incidents.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit log of subterranean breaches, fault injections, and safety advisor mitigation directives
          </p>
        </div>

        {/* Action Controls: Export CSV & Clear Log */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExport}
            disabled={incidents.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              incidents.length === 0
                ? 'bg-slate-800/30 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30 hover:border-emerald-500 shadow-md shadow-emerald-950/40 active:scale-95'
            }`}
            title="Download CSV spreadsheet of all logged incident telemetry"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsClearModalOpen(true)}
            disabled={incidents.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all border ${
              incidents.length === 0
                ? 'bg-slate-800/30 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-slate-900 text-rose-300 border-slate-700/80 hover:bg-rose-950/50 hover:border-rose-500/50 active:scale-95'
            }`}
            title="Purge session incident history with safety confirmation"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* CSV Export Success Toast */}
      {exportNotice && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2.5 text-xs font-mono text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Incident CSV export generated successfully. Browser download initiated.</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-semibold uppercase">RFC-4180 UTF-8</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-3 sm:px-5 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, sector, hazard, key metric..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-8 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/70 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono py-0.5">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'all'
                ? 'bg-slate-800 text-amber-300 border border-slate-700 font-bold shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            All ({incidents.length})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'critical'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 font-bold shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Critical ({incidents.filter((i) => i.severity === 'critical').length})
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'warning'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Warning ({incidents.filter((i) => i.severity === 'warning').length})
          </button>
          <button
            onClick={() => setFilterSeverity('resolved')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'resolved'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-bold shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Resolved ({incidents.filter((i) => i.status === 'Resolved').length})
          </button>
        </div>
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4 font-semibold">Event ID & Time</th>
              <th className="py-3 px-4 font-semibold">Sector Zone</th>
              <th className="py-3 px-4 font-semibold">Severity</th>
              <th className="py-3 px-4 font-semibold">Hazard Anomaly</th>
              <th className="py-3 px-4 font-semibold">Telemetry Reading</th>
              <th className="py-3 px-4 font-semibold">Deterministic Recommendation</th>
              <th className="py-3 px-4 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-sans">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 px-4 text-center text-slate-500 font-mono">
                  No incident records matching the selected search query or filter criteria.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((incident) => {
                const isExpanded = expandedRowId === incident.id;
                const isCrit = incident.severity === 'critical';

                return (
                  <React.Fragment key={incident.id}>
                    <tr 
                      onClick={() => toggleRow(incident.id)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isCrit ? 'bg-rose-950/15' : ''
                      }`}
                    >
                      {/* ID and Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-200">{incident.id}</div>
                        <div className="font-mono text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 tabular-nums">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{incident.timestamp}</span>
                        </div>
                      </td>

                      {/* Zone */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-200">{incident.zoneName}</span>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getSeverityBadge(incident.severity)}
                      </td>

                      {/* Hazard */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{incident.hazardType}</span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Mode: {incident.triggerMode || 'Automated Telemetry'}
                        </div>
                      </td>

                      {/* Key Metric */}
                      <td className="py-3.5 px-4 font-mono text-amber-300 font-semibold whitespace-nowrap tabular-nums">
                        {incident.keyMetric || 'N/A'}
                      </td>

                      {/* Recommendation Summary */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-300 font-medium">
                        {incident.recommendation}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          incident.status === 'Resolved'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-500/40 animate-pulse'
                        }`}>
                          {incident.status || 'Active'}
                        </span>
                      </td>
                    </tr>

                    {/* Expandable row detail */}
                    {isExpanded && (
                      <tr className="bg-slate-950/95 text-slate-300 text-xs font-mono">
                        <td colSpan="7" className="p-4 border-t border-b border-slate-800 shadow-inner">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Full Safety Recommendation:</span>
                              <p className="text-amber-200 leading-relaxed font-sans text-xs sm:text-sm">{incident.recommendation}</p>
                            </div>
                            <div className="space-y-1.5 text-[11px] text-slate-400">
                              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Audit Metadata:</span>
                              <div>Trigger Mechanism: <strong className="text-slate-300 font-mono">{incident.triggerMode}</strong></div>
                              <div>Event Audit Hash: <strong className="text-slate-300 font-mono">{incident.id}</strong></div>
                              <div>Timestamp Recorded: <strong className="text-slate-300 font-mono">{incident.timestamp}</strong></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View for small screens (<640px) */}
      <div className="sm:hidden divide-y divide-slate-800/70">
        {filteredIncidents.length === 0 ? (
          <div className="py-10 px-4 text-center text-slate-500 font-mono text-xs">
            No incident records matching the selected search query or filter.
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isExpanded = expandedRowId === incident.id;
            const isCrit = incident.severity === 'critical';

            return (
              <div 
                key={incident.id}
                onClick={() => toggleRow(incident.id)}
                className={`p-4 transition-colors cursor-pointer ${
                  isCrit ? 'bg-rose-950/20' : 'bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono font-bold text-xs text-slate-200">{incident.id}</span>
                  <div className="flex items-center gap-1.5">
                    {getSeverityBadge(incident.severity)}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      incident.status === 'Resolved' ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-white">{incident.zoneName}</div>
                <div className="text-xs text-rose-200/90 mt-0.5">{incident.hazardType}</div>

                <div className="mt-2 text-[11px] font-mono text-amber-300 bg-slate-950/80 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 font-sans">Metric: </span>
                  {incident.keyMetric}
                </div>

                <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {incident.timestamp}
                  </span>
                  <span className="text-cyan-400">{isExpanded ? 'Hide Details' : 'View Details'}</span>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold block">Directive:</span>
                      <p className="text-amber-200 mt-0.5 leading-relaxed">{incident.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      <ClearHistoryConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={onClearHistory}
        count={incidents.length}
      />

    </div>
  );
}
