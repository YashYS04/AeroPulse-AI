// ============================================================
// src/lib/constants/personas.ts
// Persona metadata, vulnerability profiles, and physiology
// ============================================================

import { VulnerabilityPersona } from '@/types/routine';

export interface PersonaMetadata {
  id: VulnerabilityPersona;
  label: string;
  ageBracket: string;
  ventilationRateM3h: number; // Resting/Light respiration
  alveolarSensitivityFactor: number; // 1.0 (baseline) to 3.5 (high risk)
  criticalAqiThreshold: number; // Outdoor restriction limit
  description: string;
  recommendedMask: string;
}

export const PERSONA_PROFILES: Record<VulnerabilityPersona, PersonaMetadata> = {
  [VulnerabilityPersona.AsthmaticChild]: {
    id: VulnerabilityPersona.AsthmaticChild,
    label: 'Asthmatic Child (Ages 4-12)',
    ageBracket: '4 - 12 Years',
    ventilationRateM3h: 0.85,
    alveolarSensitivityFactor: 3.2,
    criticalAqiThreshold: 100,
    description: 'Narrower airways and developing lung alveoli amplify bronchial bronchospasms during fine particulate exposure.',
    recommendedMask: 'Fitted Pediatric KF94 / N95 with silicone seal',
  },
  [VulnerabilityPersona.NewbornInfant]: {
    id: VulnerabilityPersona.NewbornInfant,
    label: 'Newborn Infant (0-2 Years)',
    ageBracket: '0 - 2 Years',
    ventilationRateM3h: 0.35,
    alveolarSensitivityFactor: 3.5,
    criticalAqiThreshold: 75,
    description: 'Extremely rapid respiration rate per kg body mass; immature pulmonary barriers cannot filter sub-micron carbon.',
    recommendedMask: 'Pram HEPA enclosure shield (No tight masks on infants)',
  },
  [VulnerabilityPersona.ElderlyRelative]: {
    id: VulnerabilityPersona.ElderlyRelative,
    label: 'Elderly Relative (65+)',
    ageBracket: '65+ Years',
    ventilationRateM3h: 0.55,
    alveolarSensitivityFactor: 2.8,
    criticalAqiThreshold: 120,
    description: 'Pre-existing cardiovascular hypertension or COPD risk; particulate inhalation can trigger arrhythmia.',
    recommendedMask: 'Valved or low-breathing-resistance N95 respirator',
  },
  [VulnerabilityPersona.SchoolRunParent]: {
    id: VulnerabilityPersona.SchoolRunParent,
    label: 'School-Run Parent / Caregiver',
    ageBracket: '25 - 50 Years',
    ventilationRateM3h: 0.95,
    alveolarSensitivityFactor: 1.5,
    criticalAqiThreshold: 180,
    description: 'Managing transport logistics for children while minimizing in-car traffic fume penetration.',
    recommendedMask: 'N95 or FFP2 respirator during drop-off/pick-up',
  },
  [VulnerabilityPersona.UrbanCommuter]: {
    id: VulnerabilityPersona.UrbanCommuter,
    label: 'Daily Urban Commuter',
    ageBracket: '20 - 60 Years',
    ventilationRateM3h: 1.10,
    alveolarSensitivityFactor: 1.2,
    criticalAqiThreshold: 220,
    description: 'Navigating long multi-modal transits across varying urban microclimates and road exhaust plumes.',
    recommendedMask: 'Reusable N99 or N95 carbon-layer respirator',
  },
  [VulnerabilityPersona.CommunityCoordinator]: {
    id: VulnerabilityPersona.CommunityCoordinator,
    label: 'Neighborhood Community Lead',
    ageBracket: 'Any Age',
    ventilationRateM3h: 0.90,
    alveolarSensitivityFactor: 1.3,
    criticalAqiThreshold: 200,
    description: 'Organizing neighborhood air quality alerts, mutual-aid HEPA loans, and vulnerable resident wellness checks.',
    recommendedMask: 'Standard N95 respirator during outdoor inspections',
  },
};
