import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { OverviewCards } from './components/OverviewCards';
import { ZoneCards } from './components/ZoneCards';
import { AlertPanel } from './components/AlertPanel';
import { SafetyAdvisorPanel } from './components/SafetyAdvisorPanel';
import { IncidentHistoryTable } from './components/IncidentHistoryTable';
import { HazardSimulatorModal } from './components/HazardSimulatorModal';
import { Footer } from './components/Footer';

import { INITIAL_ZONES, INITIAL_INCIDENTS } from './data/initialData';
import { evaluateZoneSafety, generateSystemSafetyAdvisory } from './data/rulesEngine';
import { soundManager } from './utils/audioAlert';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export function App() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [tickInterval, setTickInterval] = useState(2500); // 2.5s default
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Modal State
  const [isHazardModalOpen, setIsHazardModalOpen] = useState(false);
  const [modalTargetZoneId, setModalTargetZoneId] = useState(null);

  // Derive system safety advisory deterministically
  const systemSafetyAdvisory = generateSystemSafetyAdvisory(zones);
  const criticalCount = zones.filter((z) => z.status === 'critical').length;

  // Format local timestamp
  const getTimestamp = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // Realistic micro-fluctuations (stochastic telemetry simulation)
  const applySensorJitter = useCallback(() => {
    setZones((prevZones) =>
      prevZones.map((zone) => {
        // If zone has an active catastrophic hazard injected, don't jitter it back to normal
        if (zone.activeHazard) {
          return zone;
        }

        const s = zone.sensors;

        // Micro-jitter within realistic baseline ranges
        const ch4Jitter = (Math.random() - 0.49) * 0.02;
        const newCh4 = Math.max(0.04, Math.min(0.75, s.ch4.value + ch4Jitter));

        const coJitter = (Math.random() - 0.5) * 1.5;
        const newCo = Math.max(3, Math.min(22, Math.round(s.co.value + coJitter)));

        const o2Jitter = (Math.random() - 0.5) * 0.04;
        const newO2 = Math.max(20.6, Math.min(21.1, Number((s.o2.value + o2Jitter).toFixed(1))));

        const tempJitter = (Math.random() - 0.5) * 0.15;
        const newTemp = Math.max(20.0, Math.min(29.0, Number((s.temperature.value + tempJitter).toFixed(1))));

        const vibJitter = (Math.random() - 0.5) * 0.2;
        const newVib = Math.max(0.8, Math.min(3.4, Number((s.vibration.value + vibJitter).toFixed(1))));

        const airJitter = (Math.random() - 0.5) * 0.08;
        const newAir = Math.max(1.6, Math.min(2.8, Number((s.airflow.value + airJitter).toFixed(2))));

        const aqiJitter = (Math.random() - 0.5) * 2;
        const newAqi = Math.max(25, Math.min(68, Math.round(s.aqi.value + aqiJitter)));

        const updatedSensors = {
          ...s,
          ch4: { ...s.ch4, value: Number(newCh4.toFixed(2)) },
          co: { ...s.co, value: newCo },
          o2: { ...s.o2, value: newO2 },
          temperature: { ...s.temperature, value: newTemp },
          vibration: { ...s.vibration, value: newVib },
          airflow: { ...s.airflow, value: newAir },
          aqi: { ...s.aqi, value: newAqi },
        };

        const { zoneStatus } = evaluateZoneSafety(updatedSensors);

        return {
          ...zone,
          status: zoneStatus,
          sensors: updatedSensors,
        };
      })
    );
  }, []);

  // Simulation tick loop
  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      applySensorJitter();
    }, tickInterval);

    return () => clearInterval(intervalId);
  }, [isPaused, tickInterval, applySensorJitter]);

  // Uptime clock
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Trigger Hazard Simulation
  const handleApplyHazard = (zoneId, hazardPreset) => {
    const targetZone = zones.find((z) => z.id === zoneId);
    if (!targetZone) return;

    const timestamp = getTimestamp();
    const eventId = `INC-${Date.now().toString().slice(-6)}`;

    // Update the specific zone
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== zoneId) return z;

        const updatedSensors = { ...z.sensors };
        Object.entries(hazardPreset.sensorOverrides).forEach(([key, val]) => {
          if (updatedSensors[key]) {
            updatedSensors[key] = {
              ...updatedSensors[key],
              value: val,
            };
          }
        });

        return {
          ...z,
          status: hazardPreset.severity || 'critical',
          activeHazard: hazardPreset,
          sensors: updatedSensors,
        };
      })
    );

    // Format primary key metric string
    const keyMetricSummary = Object.entries(hazardPreset.sensorOverrides)
      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
      .join(', ');

    // Rule recommendation text
    const recommendationText = `Mandatory Level 3 Interlock: Evacuate ${targetZone.personnel} personnel via ${targetZone.evacuationRoute}. Fallback: ${targetZone.refugeChamber}. Lockout machinery in sector.`;

    // Add to Active Alerts
    const newAlert = {
      id: eventId,
      zoneId: targetZone.id,
      zoneName: targetZone.name,
      hazardType: hazardPreset.title,
      severity: hazardPreset.severity || 'critical',
      timestamp,
      keyMetric: keyMetricSummary,
      description: hazardPreset.description,
    };

    setActiveAlerts((prev) => [newAlert, ...prev.filter((a) => a.zoneId !== zoneId)]);

    // Add to Incident History
    const newIncident = {
      id: eventId,
      timestamp,
      zoneId: targetZone.id,
      zoneName: targetZone.name,
      hazardType: hazardPreset.title,
      severity: hazardPreset.severity || 'critical',
      triggerMode: 'Manual Fault Injection (Simulation)',
      status: 'Active Critical',
      keyMetric: keyMetricSummary,
      recommendation: recommendationText,
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // Play warning sound
    soundManager.playCriticalKlaxon();
  };

  // 2. Open Hazard Modal targeting specific zone
  const handleOpenZoneHazardModal = (zoneId) => {
    setModalTargetZoneId(zoneId);
    setIsHazardModalOpen(true);
  };

  // 3. Resolve / Clear Hazard on a zone
  const handleResolveHazard = (zoneId) => {
    const targetBase = INITIAL_ZONES.find((z) => z.id === zoneId);
    if (!targetBase) return;

    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== zoneId) return z;
        return {
          ...z,
          status: 'safe',
          activeHazard: null,
          sensors: { ...targetBase.sensors },
        };
      })
    );

    setActiveAlerts((prev) => prev.filter((a) => a.zoneId !== zoneId));

    // Update incident status in table
    setIncidents((prev) =>
      prev.map((inc) => (inc.zoneId === zoneId && inc.status !== 'Resolved' ? { ...inc, status: 'Resolved' } : inc))
    );

    soundManager.playNoticeBeep();
  };

  // 4. Reset Entire Demo
  const handleResetDemo = () => {
    setZones(INITIAL_ZONES.map((z) => ({ ...z, activeHazard: null, status: 'safe' })));
    setActiveAlerts([]);
    soundManager.playNoticeBeep();
  };

  // 5. Clear Incident History
  const handleClearHistory = () => {
    setIncidents([]);
  };

  // 6. Audio Mute Toggle
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans tech-grid tech-radial-glow">
      
      {/* 1. Industrial Header & Simulation Controls */}
      <Navbar
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onResetDemo={handleResetDemo}
        onOpenHazardModal={() => {
          setModalTargetZoneId('zone-a');
          setIsHazardModalOpen(true);
        }}
        tickInterval={tickInterval}
        onChangeTickInterval={setTickInterval}
        uptimeSeconds={uptimeSeconds}
        activeCriticalCount={criticalCount}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. Hardware Simulation & Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main SCADA Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 space-y-6 sm:space-y-7">
        
        {/* Critical Emergency Banner if hazards are active */}
        {criticalCount > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-red-950/80 to-rose-950/90 border-2 border-rose-500 shadow-2xl shadow-rose-950/90 flex flex-col sm:flex-row items-center justify-between gap-4 card-bevel animate-emergency-border">
            <div className="flex items-center space-x-3.5 text-rose-200">
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-950 animate-bounce">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-mono font-extrabold text-white tracking-wide flex items-center gap-2">
                  <span>CRITICAL SUBTERRANEAN HAZARD ACTIVE</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-600 text-white font-bold">
                    {criticalCount} Sector{criticalCount > 1 ? 's' : ''} Breached
                  </span>
                </div>
                <p className="text-xs text-rose-200/90 mt-0.5 font-sans">
                  Deterministic Safety Matrix initiated Level 3 evacuation interlocks. Review action protocols below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
              <button
                onClick={handleResetDemo}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900/90 text-rose-200 border border-rose-500/50 hover:bg-rose-950 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset All Sectors</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Overview KPI Cards */}
        <section aria-label="System Overview Metrics">
          <OverviewCards 
            zones={zones} 
            systemSafetyAdvisory={systemSafetyAdvisory} 
          />
        </section>

        {/* 4. Three Main Subterranean Zones */}
        <section aria-label="Subterranean Sector Monitoring">
          <ZoneCards
            zones={zones}
            onTriggerZoneHazard={handleOpenZoneHazardModal}
          />
        </section>

        {/* 5. Split Row: Real-time Alert Panel & Safety Advisor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section aria-label="Active Incident Alerts">
            <AlertPanel
              activeAlerts={activeAlerts}
              onResolveHazard={handleResolveHazard}
              onOpenHazardModal={() => {
                setModalTargetZoneId('zone-a');
                setIsHazardModalOpen(true);
              }}
            />
          </section>

          <section aria-label="Deterministic Rule-Based Safety Advisory">
            <SafetyAdvisorPanel
              safetyAdvisory={systemSafetyAdvisory}
            />
          </section>
        </div>

        {/* 6. Incident History Table with Working CSV Export & Confirmed Clear */}
        <section aria-label="Incident History Audit Logs">
          <IncidentHistoryTable
            incidents={incidents}
            onClearHistory={handleClearHistory}
          />
        </section>

      </main>

      {/* 7. Technical Engineering Footer */}
      <Footer />

      {/* Modal: Hazard Simulator */}
      <HazardSimulatorModal
        isOpen={isHazardModalOpen}
        onClose={() => setIsHazardModalOpen(false)}
        zones={zones}
        onApplyHazard={handleApplyHazard}
        preselectedZoneId={modalTargetZoneId}
      />

    </div>
  );
}

export default App;
