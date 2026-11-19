// ============================================================
// src/lib/constants/iaq.ts
// Open-source DIY purification hacks & window schedule
// ============================================================

import { DIYAirHack, WindowScheduleSlot } from '@/types/iaq';

export const DIY_AIR_HACKS: DIYAirHack[] = [
  {
    id: 'corsi-rosenthal-cube',
    title: 'Corsi-Rosenthal Box (4-Filter Cube)',
    estimatedCostUsd: 45,
    deliveryCADRm3h: 380,
    efficiencyRating: '99% for PM2.5 (Equivalent to $400 HEPA unit)',
    buildTimeMinutes: 25,
    description: 'Gold-standard open-source particulate clearance cube built using a 20-inch box fan and 4 MERV-13 pleated HVAC filters.',
    materialsNeeded: [
      '1x 20-inch 3-speed Box Fan (120V / 230V)',
      '4x 20x20x2 inch MERV-13 (or F7) Pleated Furnace Filters',
      '1x 20x20 inch Cardboard base panel & shroud cutout',
      'Duct tape or Heavy-duty gaffer tape (2-inch width)',
    ],
    stepByStepGuide: [
      'Position cardboard base flat on the floor.',
      'Tape 4 MERV-13 filters vertically around the perimeter facing airflow arrows inward.',
      'Place the 20-inch box fan on top blowing air UPWARD into the room.',
      'Seal all corner edges hermetically with heavy-duty duct tape.',
      'Add a cardboard donut shroud on top of the fan to eliminate blade-corner backdraft.',
    ],
  },
  {
    id: 'desktop-mini-hepa',
    title: 'Personal Study Desk Micro-Filter',
    estimatedCostUsd: 18,
    deliveryCADRm3h: 95,
    efficiencyRating: '85% PM2.5 in near-field personal breathing zone',
    buildTimeMinutes: 15,
    description: 'Compact 12V USB-powered radial clean air shield for bedside tables and children study desks.',
    materialsNeeded: [
      '1x 120mm High-Static Pressure PC Fan (PWM or USB 5V-12V booster)',
      '1x Cylindrical HEPA H11 vacuum replacement cartridge',
      'Silicone sealing ring or adhesive foam strip',
    ],
    stepByStepGuide: [
      'Seat the 120mm fan flush against the top circular lip of the cylindrical HEPA filter.',
      'Ensure airtight compression using the silicone gasket.',
      'Connect to any 5V phone charger brick or 12V DC barrel jack.',
      'Orient output toward child face at 0.5m distance while studying.',
    ],
  },
  {
    id: 'phytoremediation-bio-filter',
    title: 'Bio-Phytoremediation Air Scrubber',
    estimatedCostUsd: 22,
    deliveryCADRm3h: 45,
    efficiencyRating: 'Assists VOC, NO2, and formaldehyde absorption',
    buildTimeMinutes: 30,
    description: 'Active rhizosphere aeration setup utilizing Boston Fern, Snake Plant, and activated carbon substrate.',
    materialsNeeded: [
      '2x Snake Plants (Sansevieria trifasciata)',
      '1x Boston Fern (Nephrolepis exaltata)',
      'Activated granular charcoal layer (500g)',
      'Small 5V aerator fan drawing air through soil root zone',
    ],
    stepByStepGuide: [
      'Layer planter base with washed pea gravel and activated charcoal.',
      'Plant root systems in porous vermiculite-rich soil mix.',
      'Mount low-speed whisper fan below porous drainage pot to pull air through rhizosphere microbes.',
    ],
  },
];

export const WINDOW_VENTILATION_TIMETABLE: WindowScheduleSlot[] = [
  {
    timeWindow: '00:00 - 06:00',
    status: 'Strictly Closed',
    ambientSmogRisk: 'Extreme',
    rationale: 'Thermal inversion ceiling is lowest. Smog and industrial emissions are trapped tightly at ground level.',
  },
  {
    timeWindow: '06:00 - 10:30',
    status: 'Strictly Closed',
    ambientSmogRisk: 'Extreme',
    rationale: 'Peak diesel morning rush hour combines with cold boundary layer stagnation. Infiltration hazard is maximum.',
  },
  {
    timeWindow: '10:30 - 12:30',
    status: 'Cautionary Brief',
    ambientSmogRisk: 'High',
    rationale: 'Solar radiation begins heating surface air. Brief 5-minute crack acceptable only if indoor CO2 exceeds 1500 ppm.',
  },
  {
    timeWindow: '12:30 - 16:00',
    status: 'Safe Full Flush',
    ambientSmogRisk: 'Low',
    rationale: 'Optimal solar thermal convection breaks the inversion cap! Boundary layer expands to 1200m+. Safe for 20-min cross-ventilation.',
  },
  {
    timeWindow: '16:00 - 20:00',
    status: 'Cautionary Brief',
    ambientSmogRisk: 'High',
    rationale: 'Evening sunset radiation cooling begins; inversion layer re-forms while evening vehicular traffic surges.',
  },
  {
    timeWindow: '20:00 - 23:59',
    status: 'Strictly Closed',
    ambientSmogRisk: 'Extreme',
    rationale: 'Ground temperature plummets below upper boundary layer. High nocturnal particulate accumulation.',
  },
];
