/**
 * Exports incident history data to a RFC-4180 compliant CSV file.
 * Automatically triggers browser download.
 */
export function exportIncidentsToCSV(incidents) {
  if (!incidents || incidents.length === 0) {
    alert('No incident records to export.');
    return false;
  }

  const headers = [
    'Incident ID',
    'Timestamp',
    'Zone ID',
    'Zone Name',
    'Severity',
    'Hazard Type',
    'Trigger Mode',
    'Key Metric Observed',
    'Status',
    'Safety Recommendation'
  ];

  // Helper to escape CSV cell contents
  const escapeCell = (str) => {
    if (str === null || str === undefined) return '""';
    const cell = String(str).replace(/"/g, '""');
    return `"${cell}"`;
  };

  const rows = incidents.map((item) => [
    escapeCell(item.id),
    escapeCell(item.timestamp),
    escapeCell(item.zoneId || ''),
    escapeCell(item.zoneName || ''),
    escapeCell(item.severity?.toUpperCase() || 'UNKNOWN'),
    escapeCell(item.hazardType || ''),
    escapeCell(item.triggerMode || 'Manual / Telemetry'),
    escapeCell(item.keyMetric || ''),
    escapeCell(item.status || 'Active'),
    escapeCell(item.recommendation || '')
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `mindshield_incident_log_${dateStr}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}
