import { INITIAL_ZONES, HAZARD_PRESETS, INITIAL_INCIDENTS } from './src/data/initialData.js';
import { evaluateZoneSafety, generateSystemSafetyAdvisory } from './src/data/rulesEngine.js';
import fs from 'fs';
import path from 'path';

console.log('=== MindShield AI Test Suite ===\n');

let testsPassed = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Initial Zones Verification
assert(INITIAL_ZONES.length === 3, 'Initial zones count is exactly 3');
assert(INITIAL_ZONES.every(z => z.sensors.ch4 && z.sensors.co && z.sensors.o2 && z.sensors.temperature && z.sensors.vibration && z.sensors.airflow && z.sensors.aqi), 'All 3 zones contain complete 7 sensor streams (CH4, CO, O2, Temp, Vibration, Airflow, AQI)');
assert(INITIAL_ZONES.every(z => z.status === 'safe'), 'All 3 zones start in verified "safe" status');

// 2. Deterministic Rule Engine Test - Baseline Safe
const baselineAdvisory = generateSystemSafetyAdvisory(INITIAL_ZONES);
assert(baselineAdvisory.systemStatus === 'safe', 'Deterministic safety advisor evaluates baseline zones as safe');
assert(baselineAdvisory.protocols.length >= 3, 'Baseline safety protocols generated for routine monitoring');

// 3. Catastrophic Hazard Simulation Test - Methane Flare
const ch4Preset = HAZARD_PRESETS.find(h => h.id === 'ch4-breach');
assert(!!ch4Preset, 'Methane hazard preset exists');

const simulatedCritSensors = {
  ...INITIAL_ZONES[0].sensors,
  ch4: { ...INITIAL_ZONES[0].sensors.ch4, value: ch4Preset.sensorOverrides.ch4 },
};
const critEvaluation = evaluateZoneSafety(simulatedCritSensors);
assert(critEvaluation.zoneStatus === 'critical', 'Critical evaluation triggers when CH4 >= 1.50% LEL');
assert(critEvaluation.violations.some(v => v.ruleId === 'RULE-CH4-01-CRIT'), 'Rule RULE-CH4-01-CRIT properly triggered with MSHA citation');

// 4. Catastrophic Hazard Simulation Test - Seismic Rockburst
const seismicPreset = HAZARD_PRESETS.find(h => h.id === 'seismic-rockburst');
const seismicSensors = {
  ...INITIAL_ZONES[1].sensors,
  vibration: { ...INITIAL_ZONES[1].sensors.vibration, value: seismicPreset.sensorOverrides.vibration },
};
const seismicEval = evaluateZoneSafety(seismicSensors);
assert(seismicEval.zoneStatus === 'critical', 'Seismic rockburst triggers critical status when vibration >= 8.0 mm/s PPV');

// 5. System Safety Advisory - Escalation to Level 3
const mockZonesWithHazard = INITIAL_ZONES.map((z, idx) => {
  if (idx === 0) {
    return { ...z, status: 'critical', sensors: simulatedCritSensors };
  }
  return z;
});
const escalatedAdvisory = generateSystemSafetyAdvisory(mockZonesWithHazard);
assert(escalatedAdvisory.systemStatus === 'critical', 'System advisory upgrades to critical when any zone is critical');
assert(escalatedAdvisory.protocolLevel.includes('LEVEL 3'), 'System protocol escalates to LEVEL 3 emergency interlocks');
assert(escalatedAdvisory.protocols.some(p => p.priority === 'CRITICAL'), 'Critical priority evacuation protocols generated');

// 6. Production Build Dist Artifacts Verification
const distHtml = path.resolve('dist/index.html');
const distAssets = path.resolve('dist/assets');
assert(fs.existsSync(distHtml), 'Production dist/index.html exists');
assert(fs.existsSync(distAssets), 'Production dist/assets directory exists');

const assetFiles = fs.readdirSync(distAssets);
assert(assetFiles.some(f => f.endsWith('.js')), 'Production JavaScript bundle file generated');
assert(assetFiles.some(f => f.endsWith('.css')), 'Production CSS bundle file generated');

console.log(`\n=== Verification Summary: ${testsPassed} of ${totalTests} tests passed ===`);
if (testsPassed === totalTests) {
  console.log('ALL VERIFICATIONS SUCCESSFUL.');
}
