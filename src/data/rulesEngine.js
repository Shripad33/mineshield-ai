/**
 * MindShield AI - Deterministic Rule-Based Safety Engine
 * 
 * DISCLAIMER:
 * This safety advisor executes pure deterministic Boolean logic and threshold-matrix
 * evaluations based on standardized mining safety guidelines (e.g., MSHA 30 CFR Part 75
 * & OSHA 1926.800 Underground Safety Standards).
 * It does NOT utilize an external LLM, machine learning cloud endpoint, or non-deterministic AI model.
 */

export function evaluateZoneSafety(sensors) {
  const { ch4, co, o2, temperature, vibration, airflow, aqi } = sensors;

  const violations = [];
  let worstSeverity = 'safe'; // 'safe' | 'warning' | 'critical'

  // Helper to upgrade severity
  const setSeverity = (s) => {
    if (s === 'critical') worstSeverity = 'critical';
    else if (s === 'warning' && worstSeverity !== 'critical') worstSeverity = 'warning';
  };

  // 1. Methane (CH4 in % LEL)
  if (ch4.value >= 1.50) {
    setSeverity('critical');
    violations.push({
      ruleId: 'RULE-CH4-01-CRIT',
      sensorKey: 'ch4',
      name: 'Methane Explosive Threshold Exceeded',
      severity: 'critical',
      observed: `${ch4.value.toFixed(2)}% LEL`,
      threshold: '≥ 1.50% LEL',
      regulatoryRef: 'MSHA 30 CFR §75.323(b) (Mandatory Power Cut & Evacuation)',
      action: 'De-energize all electric extraction equipment immediately. Order personnel withdrawal from affected return air split. Divert ventilation fan to purge air split.'
    });
  } else if (ch4.value >= 1.00) {
    setSeverity('warning');
    violations.push({
      ruleId: 'RULE-CH4-02-WARN',
      sensorKey: 'ch4',
      name: 'Methane Elevated Level Detected',
      severity: 'warning',
      observed: `${ch4.value.toFixed(2)}% LEL`,
      threshold: '≥ 1.00% LEL',
      regulatoryRef: 'MSHA 30 CFR §75.323(a) (Continuous Face Monitoring)',
      action: 'Halt cutting equipment. Adjust ventilation line brattice curtains. Verify air velocity until CH₄ recedes below 0.80% LEL.'
    });
  }

  // 2. Carbon Monoxide (CO in ppm)
  if (co.value >= 50) {
    setSeverity('critical');
    violations.push({
      ruleId: 'RULE-CO-01-CRIT',
      sensorKey: 'co',
      name: 'Toxic Carbon Monoxide Spillage / Fire Combustion',
      severity: 'critical',
      observed: `${co.value} ppm`,
      threshold: '≥ 50 ppm (Immediate Toxic Threat)',
      regulatoryRef: 'OSHA PEL 50 ppm / NIOSH REL 35 ppm Ceiling Alert',
      action: 'Order immediate donning of Self-Contained Self-Rescuers (SCSRs). Initiate primary escapeway egress. Dispatch Mine Rescue Team with handheld thermal/gas probes.'
    });
  } else if (co.value >= 25) {
    setSeverity('warning');
    violations.push({
      ruleId: 'RULE-CO-02-WARN',
      sensorKey: 'co',
      name: 'Elevated Carbon Monoxide (Diesel/Friction)',
      severity: 'warning',
      observed: `${co.value} ppm`,
      threshold: '≥ 25 ppm',
      regulatoryRef: 'MSHA Early Fire Detection Criterion',
      action: 'Inspect diesel particulate filters, conveyor rollers, and belt tensioners for friction smoldering. Increase auxiliary intake airflow by 25%.'
    });
  }

  // 3. Oxygen (O2 in %)
  if (o2.value < 19.5) {
    setSeverity('critical');
    violations.push({
      ruleId: 'RULE-O2-01-CRIT',
      sensorKey: 'o2',
      name: 'Hypoxic / Oxygen Deficient Atmosphere',
      severity: 'critical',
      observed: `${o2.value.toFixed(1)}%`,
      threshold: '< 19.5% (Oxygen Deficient)',
      regulatoryRef: 'MSHA 30 CFR §75.321 / OSHA 1910.134',
      action: 'Atmosphere is immediately dangerous to life or health (IDLH). Prohibit unassisted entry. Direct all staff to nearest sealed Refuge Station.'
    });
  } else if (o2.value < 20.2) {
    setSeverity('warning');
    violations.push({
      ruleId: 'RULE-O2-02-WARN',
      sensorKey: 'o2',
      name: 'Reduced Oxygen Partial Pressure',
      severity: 'warning',
      observed: `${o2.value.toFixed(1)}%`,
      threshold: '< 20.2%',
      regulatoryRef: 'Atmospheric Air Quality Monitoring Standard',
      action: 'Verify return air regulators and check for stagnant pockets in unventilated headings.'
    });
  }

  // 4. Ground Vibration (Seismic PPV in mm/s)
  if (vibration.value >= 8.0) {
    setSeverity('critical');
    violations.push({
      ruleId: 'RULE-SEIS-01-CRIT',
      sensorKey: 'vibration',
      name: 'Severe Seismic Shock / Imminent Rockburst Risk',
      severity: 'critical',
      observed: `${vibration.value.toFixed(1)} mm/s`,
      threshold: '≥ 8.0 mm/s PPV',
      regulatoryRef: 'Underground Geotechnical Ground Control Standard',
      action: 'Immediate withdrawal of workers under active unbolted roof spans. Suspend all heavy haulage and jumbo drilling. Inspect rib and roof bolt load cells.'
    });
  } else if (vibration.value >= 4.0) {
    setSeverity('warning');
    violations.push({
      ruleId: 'RULE-SEIS-02-WARN',
      sensorKey: 'vibration',
      name: 'Elevated Micro-Seismic Activity',
      severity: 'warning',
      observed: `${vibration.value.toFixed(1)} mm/s`,
      threshold: '≥ 4.0 mm/s PPV',
      regulatoryRef: 'Strata Stability Monitoring Protocol',
      action: 'Activate acoustic emission ground listening geophones. Post safety sentinels at active drive intersections.'
    });
  }

  // 5. Temperature (°C)
  if (temperature.value >= 40.0) {
    setSeverity('critical');
    violations.push({
      ruleId: 'RULE-TEMP-01-CRIT',
      sensorKey: 'temperature',
      name: 'Thermal Runaway / Active Fire Hazard',
      severity: 'critical',
      observed: `${temperature.value.toFixed(1)}°C`,
      threshold: '≥ 40.0°C (Critical Heat Influx)',
      regulatoryRef: 'Mine Fire Protection & Suppression Standard §75.1100',
      action: 'Trigger automatic deluge water spray on conveyor belts and motor windings. De-energize sub-station transformers in sector. Activate fire suppression foam.'
    });
  } else if (temperature.value >= 32.0) {
    setSeverity('warning');
    violations.push({
      ruleId: 'RULE-TEMP-02-WARN',
      sensorKey: 'temperature',
      name: 'Heat Stress & Machine Overheating Warning',
      severity: 'warning',
      observed: `${temperature.value.toFixed(1)}°C`,
      threshold: '≥ 32.0°C',
      regulatoryRef: 'Workplace Heat Stress Ergonomics Guideline',
      action: 'Enforce mandatory 15-minute hydration rest intervals. Increase chilled brine ventilation chiller throughput.'
    });
  }

  // 6. Airflow Velocity (m/s)
  if (airflow.value < 0.6) {
    setSeverity('critical');
    violations.push({
      ruleId: 'RULE-AIR-01-CRIT',
      sensorKey: 'airflow',
      name: 'Critical Airway Stagnation / Fan Failure',
      severity: 'critical',
      observed: `${airflow.value.toFixed(2)} m/s`,
      threshold: '< 0.60 m/s (Minimum Legal Velocity Breached)',
      regulatoryRef: 'MSHA 30 CFR §75.325 Minimum Air Quantity',
      action: 'Immediately switch to secondary auxiliary backup surface fans. Inspect ventilation doors for blowout or air short-circuiting.'
    });
  } else if (airflow.value < 1.4) {
    setSeverity('warning');
    violations.push({
      ruleId: 'RULE-AIR-02-WARN',
      sensorKey: 'airflow',
      name: 'Sub-Optimal Air Split Velocity',
      severity: 'warning',
      observed: `${airflow.value.toFixed(2)} m/s`,
      threshold: '< 1.40 m/s',
      regulatoryRef: 'Mine Ventilation Management Plan',
      action: 'Inspect line curtains and ventilation ducting for tears or partial constriction.'
    });
  }

  // 7. Particulate Dust / Smoke AQI
  if (aqi.value >= 150) {
    setSeverity('critical');
    violations.push({
      ruleId: 'RULE-AQI-01-CRIT',
      sensorKey: 'aqi',
      name: 'Dense Smoke / Explosive Coal-Silica Dust Cloud',
      severity: 'critical',
      observed: `${aqi.value} AQI`,
      threshold: '≥ 150 AQI (Hazardous Atmosphere)',
      regulatoryRef: 'Respirable Dust & Explosion Suppression Standard §75.372',
      action: 'Activate high-pressure mist dust scrubbers. Verify stone dust inertization barrier across haulways. Wear P100 PAPR respirators.'
    });
  } else if (aqi.value >= 80) {
    setSeverity('warning');
    violations.push({
      ruleId: 'RULE-AQI-02-WARN',
      sensorKey: 'aqi',
      name: 'Elevated Respirable Dust Count',
      severity: 'warning',
      observed: `${aqi.value} AQI`,
      threshold: '≥ 80 AQI',
      regulatoryRef: 'Occupational Silica Protection Plan',
      action: 'Increase water spray pressure on shearer picks and feeder hoppers.'
    });
  }

  return {
    zoneStatus: worstSeverity,
    violations,
  };
}

/**
 * Generate high-level deterministic safety advisory action checklist
 * based on all active violations across zones.
 */
export function generateSystemSafetyAdvisory(zones) {
  const allViolations = [];
  let worstSystemStatus = 'safe';

  zones.forEach((zone) => {
    const { zoneStatus, violations } = evaluateZoneSafety(zone.sensors);
    if (zoneStatus === 'critical') worstSystemStatus = 'critical';
    else if (zoneStatus === 'warning' && worstSystemStatus !== 'critical') worstSystemStatus = 'warning';

    violations.forEach((v) => {
      allViolations.push({
        ...v,
        zoneId: zone.id,
        zoneName: zone.name,
        evacuationRoute: zone.evacuationRoute,
        refugeChamber: zone.refugeChamber,
        personnel: zone.personnel,
      });
    });
  });

  // Deterministic protocol priority synthesis
  const actionableProtocols = [];

  if (allViolations.length === 0) {
    return {
      systemStatus: 'safe',
      activeViolationsCount: 0,
      protocolLevel: 'LEVEL 1: NORMAL ROUTINE MONITORING',
      leadRecommendation: 'All subterranean sectors operating within OSHA/MSHA legal safety envelopes.',
      protocols: [
        {
          priority: 'NORMAL',
          code: 'SOP-001',
          action: 'Maintain regular 30-minute automated telemetry scan loop and atmospheric logging.',
          responsible: 'Control Room SCADA Operator',
        },
        {
          priority: 'NORMAL',
          code: 'SOP-002',
          action: 'Ensure primary shaft intake and return fans operate at nominal 60Hz frequency.',
          responsible: 'Ventilation Engineering Staff',
        },
        {
          priority: 'NORMAL',
          code: 'SOP-003',
          action: 'Confirm refuge chambers A-04, B-02, and C-01 life-support oxygen banks are fully charged at 3,000 PSI.',
          responsible: 'Mine Safety Warden',
        },
      ],
      engineType: 'MindShield Deterministic Safety Matrix (Deterministic Rules Engine v4.2)',
    };
  }

  // Critical conditions exist
  if (worstSystemStatus === 'critical') {
    const criticalViolations = allViolations.filter((v) => v.severity === 'critical');
    const affectedZoneNames = [...new Set(criticalViolations.map((v) => v.zoneName))].join(', ');

    return {
      systemStatus: 'critical',
      activeViolationsCount: allViolations.length,
      protocolLevel: 'LEVEL 3: CRITICAL HAZARD EMERGENCY INTERLOCK ACTIVATED',
      leadRecommendation: `IMMEDIATE ACTION REQUIRED in ${affectedZoneNames}. Deterministic rules mandate immediate personnel protection and engineering lockouts.`,
      protocols: criticalViolations.map((v, idx) => ({
        priority: 'CRITICAL',
        code: `EMERG-${v.ruleId}`,
        action: `[${v.zoneName}] ${v.name}: ${v.action}`,
        evacuationNotice: `Reroute ${v.personnel} personnel via: ${v.evacuationRoute}. Fallback: ${v.refugeChamber}.`,
        regulatoryRef: v.regulatoryRef,
        responsible: idx === 0 ? 'Mine Superintendent & Central Dispatch' : 'Emergency Egress Officer',
      })),
      engineType: 'MindShield Deterministic Safety Matrix (Deterministic Rules Engine v4.2)',
    };
  }

  // Warning conditions
  const warningViolations = allViolations.filter((v) => v.severity === 'warning');
  return {
    systemStatus: 'warning',
    activeViolationsCount: allViolations.length,
    protocolLevel: 'LEVEL 2: PREVENTATIVE HAZARD MITIGATION & CAUTION',
    leadRecommendation: 'Environmental parameters are outside baseline nominal tolerances. Mitigate promptly before escalation.',
    protocols: warningViolations.map((v) => ({
      priority: 'WARNING',
      code: `WARN-${v.ruleId}`,
      action: `[${v.zoneName}] ${v.name}: ${v.action}`,
      regulatoryRef: v.regulatoryRef,
      responsible: 'Sector Shift Boss & Maintenance Team',
    })),
    engineType: 'MindShield Deterministic Safety Matrix (Deterministic Rules Engine v4.2)',
  };
}
