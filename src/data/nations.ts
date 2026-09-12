import type { Nation } from './types';

// Transcribed from "The Army Maker" v1.22, the free Army Creation booklet for
// Lasalle Second Edition by Sam A. Mustafa. Page references are approximate.
//
// A note on Sapeur / ADC / Partisans: these appear throughout the booklet's
// Army Assets boxes in bold italic (meaning: advanced-rules only) but no page
// in this booklet ever prints a points cost for them. Their cost is presumed
// to live in the core Lasalle rulebook (which this booklet doesn't include).
// We model their cost as `null` and let the builder ask the user for a value
// (defaulting to 0) rather than guess a number that isn't in the source.

export const nations: Nation[] = [
  // ======================================================================
  // MAJOR POWERS
  // ======================================================================
  {
    id: 'austria',
    name: 'Austria',
    powerType: 'major',
    hasEliteLineSplit: true,
    historicalParameters: {
      atWar: '1805, 1809, 1812-15',
      allies: 'Britain (1805, 1809, 1813-15), Russia (1805 and 1813-15), Prussia (1813-15), Sweden (1805 and 1813-15), France (1812)',
      enemies: 'France (1805-9 and 1813-15), Russia (1809-12)',
      clients: 'Brunswick (1809), Bavaria (1814), Württemberg (1814)',
      eliteCorps: 'Reserve Korps (1809-15)',
      notes: 'Linear Doctrine prior to 1809. Regimental Guns from 1805-8.',
    },
    units: [
      { name: 'Grenadier', kind: 'infantry', cost: 20 },
      { name: 'Grenz', kind: 'infantry', cost: 17 },
      { name: 'Musketeer (veteran)', kind: 'infantry', cost: 16 },
      { name: 'Musketeer (conscript)', kind: 'infantry', cost: 14 },
      { name: 'Landwehr', kind: 'infantry', cost: 7 },
      { name: 'Jäger', kind: 'infantry', cost: 19 },
      { name: 'Cuirassier', kind: 'cavalry', cost: 23 },
      { name: 'Dragoon & Cheveauleger', kind: 'cavalry', cost: 17 },
      { name: 'Uhlan', kind: 'cavalry', cost: 18 },
      { name: 'Hussar', kind: 'cavalry', cost: 20 },
      { name: 'Insurrection Cavalry', kind: 'cavalry', cost: 11 },
      { name: 'Light Brigade Battery', kind: 'artillery', cost: 10 },
      { name: 'Brigade Battery', kind: 'artillery', cost: 12 },
      { name: 'Heavy Position Battery', kind: 'artillery', cost: 12 },
      { name: 'Position Battery', kind: 'artillery', cost: 10 },
      { name: 'Cavalry Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'at-inf-1805', name: 'Infantry Bde', category: 'organic', corps: 'line', essential: true, dates: '1805',
        lines: [
          { min: 3, max: 6, options: ['Musketeer (veteran)', 'Musketeer (conscript)'] },
          { min: 0, max: 1, options: ['Brigade Battery'] },
        ],
      },
      {
        id: 'at-inf-1809', name: 'Infantry Bde', category: 'organic', corps: 'line', essential: true, dates: '1809-15',
        lines: [
          { min: 3, max: 6, options: ['Musketeer (veteran)', 'Musketeer (conscript)'] },
          { min: 0, max: 2, options: ['Landwehr'] },
          { min: 0, max: 1, options: ['Brigade Battery'] },
          { min: 0, max: 1, options: ['Position Battery'] },
        ],
      },
      {
        id: 'at-avant-garde', name: 'Avant-Garde Bde', category: 'organic', corps: 'line', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Musketeer (veteran)', 'Musketeer (conscript)'] },
          { min: 1, max: 3, options: ['Grenz'] },
          { min: 0, max: 1, options: ['Jäger'] },
          { min: 0, max: 1, options: ['Landwehr'] },
          { min: 1, max: 2, options: ['Hussar', 'Uhlan', 'Dragoon & Cheveauleger'] },
          { min: 0, max: 1, options: ['Cavalry Battery'] },
          { min: 0, max: 1, options: ['Light Brigade Battery'] },
        ],
      },
      {
        id: 'at-grenadier-1805', name: 'Grenadier Bde', category: 'reserve', corps: 'line', armyMax: 1, dates: '1805-8',
        lines: [
          { min: 3, max: 6, options: ['Grenadier'] },
          { min: 0, max: 2, options: ['Brigade Battery'] },
        ],
      },
      {
        id: 'at-grenadier-1809', name: 'Grenadier Bde', category: 'organic', corps: 'elite', essential: true, armyMax: 4, dates: '1809-15',
        lines: [
          { min: 3, max: 6, options: ['Grenadier'] },
          { min: 0, max: 2, options: ['Brigade Battery'] },
        ],
      },
      {
        id: 'at-light-cav', name: 'Light Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Hussar', 'Uhlan', 'Dragoon & Cheveauleger'] },
          { min: 0, max: 1, options: ['Cavalry Battery'] },
        ],
      },
      {
        id: 'at-dragoon', name: 'Dragoon Bde', category: 'reserve', corps: 'either', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Dragoon & Cheveauleger'] },
          { min: 0, max: 1, options: ['Cavalry Battery'] },
        ],
      },
      {
        id: 'at-cuirassier', name: 'Cuirassier Bde', category: 'reserve', corps: 'either', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Cuirassier'] },
          { min: 0, max: 1, options: ['Cavalry Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 2,
      assets: [
        { name: 'Insurrection Cavalry', min: 0, max: 1, cost: 11, kind: 'cavalry' },
        { name: 'Landwehr', min: 0, max: 4, cost: 7, kind: 'infantry' },
        { name: 'Hvy. Position BTY', min: 0, max: 2, cost: 12, kind: 'artillery' },
        { name: 'Position BTY', min: 0, max: 2, cost: 10, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 2, cost: null, kind: 'special', advanced: true },
        { name: 'Partisans', min: 0, max: 3, cost: null, kind: 'special', advanced: true },
        { name: 'ADC', min: 0, max: 1, cost: null, kind: 'special', advanced: true, dates: '1809-15' },
      ],
    }],
  },

  {
    id: 'britain',
    name: 'Britain',
    powerType: 'major',
    historicalParameters: {
      atWar: '1805-15',
      allies: 'Prussia (1806-7 and 1813-15), Russia (1805-7 and 1812-15), Austria (1805, 1809, and 1813-15), Sweden (1805-7 and 1813-15), Spain (1808-14)',
      enemies: 'France (1805-15), Spain (1805-7)',
      clients: 'Portugal (1808-14), Brunswick (1809-15), Dutch-Belgian (1815)',
      notes: 'Linear Doctrine prior to 1812. KGL/Hanoverian units are treated as "British" except the Landwehr (militia) units in 1815.',
    },
    units: [
      { name: 'Foot Guard', kind: 'infantry', cost: 24 },
      { name: 'Rifle Regiment', kind: 'infantry', cost: 23 },
      { name: 'Foot Regiment (elite)', kind: 'infantry', cost: 22 },
      { name: 'Foot Regiment (veteran)', kind: 'infantry', cost: 20 },
      { name: 'Foot Regiment (conscript)', kind: 'infantry', cost: 17 },
      { name: 'Hanoverian Militia', kind: 'infantry', cost: 10, dates: '1815' },
      { name: 'Guard & Dragoons', kind: 'cavalry', cost: 23 },
      { name: 'Lt. Dragoon & Hussar', kind: 'cavalry', cost: 17 },
      { name: 'Foot Artillery', kind: 'artillery', cost: 10 },
      { name: 'Horse Artillery', kind: 'artillery', cost: 12 },
      { name: 'Rocket Troop', kind: 'artillery', cost: 5, advanced: true },
    ],
    brigades: [
      {
        id: 'gb-guards', name: 'Guards Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 2, options: ['Foot Guard'] },
          { min: 0, max: 2, options: ['Foot Regiment (elite)', 'Foot Regiment (veteran)', 'Foot Regiment (conscript)'] },
          { min: 0, max: 1, options: ['Foot Artillery'] },
        ],
      },
      {
        id: 'gb-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true,
        lines: [
          { min: 3, max: 6, options: ['Foot Regiment (elite)', 'Foot Regiment (veteran)', 'Foot Regiment (conscript)'] },
          { min: 0, max: 1, options: ['Foot Artillery'] },
        ],
      },
      {
        id: 'gb-hanoverian', name: 'Hanoverian Bde', category: 'organic', corps: 'either', armyMax: 1, dates: '1815',
        lines: [
          { min: 3, max: 6, options: ['Hanoverian Militia'] },
          { min: 0, max: 1, options: ['Foot Artillery'] },
        ],
      },
      {
        id: 'gb-heavy-cav', name: 'Heavy Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Guard & Dragoons'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
      {
        id: 'gb-light-cav', name: 'Light Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Lt. Dragoon & Hussar'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 3,
      assets: [
        { name: 'Rifle regiment', min: 0, max: 1, cost: 23, kind: 'infantry' },
        { name: 'Brunswick Infantry', min: 0, max: 1, cost: 17, kind: 'infantry', dates: '1809-14' },
        { name: 'Brunswick Cavalry', min: 0, max: 1, cost: 17, kind: 'cavalry' },
        { name: 'Portuguese Cavalry', min: 0, max: 1, cost: 10, kind: 'cavalry' },
        { name: 'Portuguese Caçadore', min: 0, max: 1, cost: 17, kind: 'infantry' },
        { name: 'Foot Artillery', min: 0, max: 1, cost: 10, kind: 'artillery' },
        { name: 'Horse Artillery', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 2, cost: null, kind: 'special', advanced: true },
        { name: 'Rocket Troop', min: 0, max: 1, cost: 5, kind: 'artillery', advanced: true },
        { name: 'ADC', min: 0, max: 3, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'france',
    name: 'France',
    powerType: 'major',
    hasEliteLineSplit: true,
    historicalParameters: {
      atWar: '1805-15',
      allies: 'Prussia (1812), Russia (1809), Austria (1812), Spain (1805-7)',
      enemies: 'Britain (1805-15), Prussia (1806-7 and 1813-15), Austria (1805-9 and 1813-15), Russia (1805-7 and 1812-15), Spain (1808-15), Sweden (1805-7 and 1813-15)',
      clients: '(1805-13): Bavaria, Confederation, N. Italy, Württemberg. (1807-13): Denmark, Naples, Saxony, Westphalia, Duchy of Warsaw.',
      eliteCorps: 'Imperial Guard (1805-15)',
      notes: 'Regimental Guns in 1812. Aside from the Old Guard, all French infantry are simply "infantry" — choose your mixture of elite/veteran/conscript per brigade.',
    },
    units: [
      { name: 'Old Guard Infantry', kind: 'infantry', cost: 23 },
      { name: 'Infantry (elite)', kind: 'infantry', cost: 20 },
      { name: 'Infantry (veteran)', kind: 'infantry', cost: 18 },
      { name: 'Infantry (conscript)', kind: 'infantry', cost: 16 },
      { name: 'Old Guard Cavalry', kind: 'cavalry', cost: 24 },
      { name: 'Old Guard Cavalry (lancer)', kind: 'cavalry', cost: 25 },
      { name: 'Cuirassier or Carabinier', kind: 'cavalry', cost: 23 },
      { name: 'Dragoon', kind: 'cavalry', cost: 20 },
      { name: 'Lancer', kind: 'cavalry', cost: 18, dates: '1811-15' },
      { name: 'Hussar or Chasseur', kind: 'cavalry', cost: 17 },
      { name: 'Heavy Cavalry (1813-14)', kind: 'cavalry', cost: 17, dates: '1813-14', notes: 'Dragoons, Cuirassiers, and Carabiniers' },
      { name: 'Light Cavalry (1813-14)', kind: 'cavalry', cost: 15, dates: '1813-14', notes: 'Hussars and Chasseurs' },
      { name: 'Light Cavalry (1813-14, Lancer)', kind: 'cavalry', cost: 16, dates: '1813-14', notes: 'Add Lance trait, +1 point' },
      { name: 'Young Gd. Cavalry (1813-14)', kind: 'cavalry', cost: 17, dates: '1813-14' },
      { name: 'Field Artillery', kind: 'artillery', cost: 12 },
      { name: 'Reserve Artillery', kind: 'artillery', cost: 14 },
      { name: 'Horse Artillery', kind: 'artillery', cost: 12 },
      { name: 'Old Gd. Reserve Artillery', kind: 'artillery', cost: 17 },
      { name: 'Old Gd. Horse Artillery', kind: 'artillery', cost: 14 },
    ],
    brigades: [
      {
        id: 'fr-infantry', name: 'Infantry Bde', category: 'organic', corps: 'line', essential: true,
        lines: [
          { min: 3, max: 6, options: ['Infantry (elite)', 'Infantry (veteran)', 'Infantry (conscript)'] },
          { min: 0, max: 1, options: ['Field Artillery'] },
        ],
      },
      {
        id: 'fr-light-cav', name: 'Light Cavalry Bde', category: 'reserve', corps: 'line', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Hussar or Chasseur'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
      {
        id: 'fr-dragoon-lancer', name: 'Dragoon or Lancer Bde', category: 'reserve', corps: 'line', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Lancer', 'Dragoon'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
      {
        id: 'fr-cuirassier', name: 'Cuirassier Bde', category: 'reserve', corps: 'line', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Cuirassier or Carabinier'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
      {
        id: 'fr-young-mid-guard', name: 'Young or Middle Gd Inf Bde', category: 'organic', corps: 'elite', armyMax: 4, dates: '1809-12 and 1815',
        lines: [
          { min: 3, max: 6, options: ['Infantry (elite)'] },
          { min: 0, max: 1, options: ['Field Artillery'] },
        ],
      },
      {
        id: 'fr-young-guard-1813', name: 'Young Guard Inf Bde', category: 'organic', corps: 'elite', armyMax: 4, dates: '1813-14',
        lines: [
          { min: 3, max: 6, options: ['Infantry (veteran)'] },
          { min: 0, max: 2, options: ['Field Artillery'] },
        ],
      },
      {
        id: 'fr-old-guard-inf', name: 'Old Guard Inf Bde', category: 'organic', corps: 'elite', essential: true, armyMax: 1,
        lines: [
          { min: 2, max: 4, options: ['Old Guard Infantry'] },
          { min: 0, max: 1, options: ['Field Artillery'] },
        ],
      },
      {
        id: 'fr-guard-cav', name: 'Guard Cavalry Bde', category: 'reserve', corps: 'elite', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Old Guard Cavalry', 'Old Guard Cavalry (lancer)'] },
          { min: 0, max: 1, options: ['Young Gd. Cavalry (1813-14)'] },
          { min: 0, max: 1, options: ['Old Gd. Horse Artillery'] },
        ],
      },
    ],
    assetGroups: [
      {
        corps: 'line', maxAttachPerBrigade: 2,
        assets: [
          { name: 'Reserve Art', min: 0, max: 2, cost: 14, kind: 'artillery' },
          { name: 'Field Art', min: 0, max: 1, cost: 12, kind: 'artillery' },
          { name: 'Horse Art', min: 0, max: 1, cost: 12, kind: 'artillery' },
          { name: 'Sapeur', min: 0, max: 2, cost: null, kind: 'special', advanced: true },
          { name: 'ADC', min: 0, max: 2, cost: null, kind: 'special', advanced: true },
        ],
      },
      {
        corps: 'elite', maxAttachPerBrigade: 4,
        assets: [
          { name: 'Old Guard Horse Art', min: 0, max: 4, cost: 14, kind: 'artillery' },
          { name: 'Old Guard Reserve Art', min: 0, max: 4, cost: 17, kind: 'artillery' },
          { name: 'Sapeur', min: 0, max: 4, cost: null, kind: 'special', advanced: true },
          { name: 'ADC', min: 0, max: 3, cost: null, kind: 'special', advanced: true },
        ],
      },
    ],
  },

  {
    id: 'prussia-early',
    name: 'Prussia (Early War, to 1807)',
    powerType: 'major',
    historicalParameters: {
      atWar: '1806-7, 1812-15',
      allies: 'Russia (1806-7 and 1813-15), France (1812), Austria (1813-15), Britain (1806-7 and 1813-15)',
      enemies: 'France (1806-7 and 1813-15), Russia (1812)',
      clients: 'Saxony (1806)',
      notes: 'Linear Doctrine prior to 1808. Regimental Guns prior to 1808. Prussian units may not be mixed between the Early and Late War lists.',
    },
    units: [
      { name: 'Grenadier & Garde zu Fuß', kind: 'infantry', cost: 21 },
      { name: 'Musketeer', kind: 'infantry', cost: 17 },
      { name: 'Fusilier', kind: 'infantry', cost: 18 },
      { name: 'Schützen', kind: 'infantry', cost: 19 },
      { name: 'Cuirassier', kind: 'cavalry', cost: 23 },
      { name: 'Dragoon', kind: 'cavalry', cost: 20 },
      { name: 'Hussar', kind: 'cavalry', cost: 20 },
      { name: 'Uhlan', kind: 'cavalry', cost: 18 },
      { name: 'Field Artillery', kind: 'artillery', cost: 12 },
      { name: 'Heavy Artillery', kind: 'artillery', cost: 14 },
      { name: 'Horse Artillery', kind: 'artillery', cost: 14 },
    ],
    brigades: [
      {
        id: 'pe-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, dates: '1806-7',
        lines: [
          { min: 0, max: 2, options: ['Grenadier & Garde zu Fuß'] },
          { min: 3, max: 6, options: ['Musketeer'] },
          { min: 0, max: 1, options: ['Field Artillery'] },
        ],
      },
      {
        id: 'pe-avant-garde', name: 'Avant-Garde Bde', category: 'organic', corps: 'either', armyMax: 1, dates: '1806-7',
        lines: [
          { min: 1, max: 2, options: ['Musketeer'] },
          { min: 2, max: 3, options: ['Fusilier'] },
          { min: 0, max: 1, options: ['Hussar', 'Dragoon', 'Uhlan'] },
          { min: 0, max: 1, options: ['Field Artillery'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
      {
        id: 'pe-light-cav', name: 'Light Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 2, dates: '1806-7',
        lines: [
          { min: 2, max: 3, options: ['Hussar', 'Uhlan'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
      {
        id: 'pe-heavy-cav', name: 'Heavy Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 2, dates: '1806-7',
        lines: [
          { min: 2, max: 3, options: ['Dragoon', 'Cuirassier'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Schützen', min: 0, max: 1, cost: 19, kind: 'infantry' },
        { name: 'Heavy Art', min: 0, max: 2, cost: 14, kind: 'artillery' },
        { name: 'Field Art', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Horse Art', min: 0, max: 1, cost: 14, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'prussia-late',
    name: 'Prussia (Late War, 1808-15)',
    powerType: 'major',
    historicalParameters: {
      atWar: '1806-7, 1812-15',
      allies: 'Russia (1806-7 and 1813-15), France (1812), Austria (1813-15), Britain (1806-7 and 1813-15)',
      enemies: 'France (1806-7 and 1813-15), Russia (1812)',
      clients: 'Saxony (1806)',
      notes: 'Linear Doctrine prior to 1808. Regimental Guns prior to 1808. Prussian units may not be mixed between the Early and Late War lists.',
    },
    units: [
      { name: 'Grenadiers & Garde zu Fuß', kind: 'infantry', cost: 19 },
      { name: 'Fusilier', kind: 'infantry', cost: 18 },
      { name: 'Musketeers & Reserve INF', kind: 'infantry', cost: 18 },
      { name: 'Schützen', kind: 'infantry', cost: 19 },
      { name: 'Landwehr (veteran)', kind: 'infantry', cost: 15 },
      { name: 'Landwehr (conscript)', kind: 'infantry', cost: 12 },
      { name: 'Cuirassier', kind: 'cavalry', cost: 23 },
      { name: 'Dragoon or Hussar', kind: 'cavalry', cost: 17 },
      { name: 'Uhlan', kind: 'cavalry', cost: 18 },
      { name: 'Landwehr Cavalry', kind: 'cavalry', cost: 13 },
      { name: 'Field Artillery', kind: 'artillery', cost: 12 },
      { name: 'Horse Artillery', kind: 'artillery', cost: 14 },
      { name: 'Heavy Artillery', kind: 'artillery', cost: 14 },
      { name: 'Howitzer', kind: 'artillery', cost: 10, advanced: true },
    ],
    brigades: [
      {
        id: 'pl-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, dates: '1809-15',
        lines: [
          { min: 3, max: 6, options: ['Musketeers & Reserve INF', 'Fusilier'] },
          { min: 0, max: 3, options: ['Landwehr (veteran)', 'Landwehr (conscript)'] },
          { min: 0, max: 1, options: ['Hussar', 'Dragoon or Hussar', 'Uhlan', 'Landwehr Cavalry'].filter((v, i, a) => a.indexOf(v) === i) },
          { min: 0, max: 2, options: ['Field Artillery'] },
        ],
      },
      {
        id: 'pl-cuirassier', name: 'Cuirassier Bde', category: 'reserve', corps: 'either', armyMax: 1, dates: '1809-15',
        lines: [
          { min: 2, max: 2, options: ['Cuirassier'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
      {
        id: 'pl-light-cav', name: 'Light Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 2, dates: '1809-15',
        lines: [
          { min: 2, max: 3, options: ['Dragoon or Hussar', 'Uhlan', 'Landwehr Cavalry'] },
          { min: 0, max: 1, options: ['Horse Artillery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 2,
      assets: [
        { name: 'Schützen', min: 0, max: 1, cost: 19, kind: 'infantry' },
        { name: 'Grenadier', min: 0, max: 2, cost: 19, kind: 'infantry' },
        { name: 'Heavy Art', min: 0, max: 2, cost: 14, kind: 'artillery' },
        { name: 'Field Art', min: 0, max: 2, cost: 12, kind: 'artillery' },
        { name: 'Horse Art', min: 0, max: 2, cost: 14, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 2, cost: null, kind: 'special', advanced: true },
        { name: 'Howitzer BTY', min: 0, max: 1, cost: 10, kind: 'artillery', advanced: true },
        { name: 'Partisans', min: 0, max: 3, cost: null, kind: 'special', advanced: true },
        { name: 'ADC', min: 0, max: 2, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'russia',
    name: 'Russia',
    powerType: 'major',
    hasEliteLineSplit: true,
    historicalParameters: {
      atWar: '1805-1815',
      allies: 'Britain (1805-7 and 1812-15), Austria (1805 and 1813-15), Prussia (1806-7 and 1813-15), France (1809)',
      enemies: 'Sweden (1808-9), Austria (1809-12), Prussia (1812), Turkey (1806-1812), France (1805-7 and 1812-15)',
      clients: 'None',
      eliteCorps: 'Guards (V Corps) - 1810-15',
      notes: 'Linear Doctrine prior to 1810. Regimental Guns in 1805. In 1805-9 max 6 grenadier units and max 8 jäger units total in the army, regardless of brigade distribution. Earthworks: up to 3 sections of 4BW, 4 pts each, within 1BW of a Russian infantry/artillery unit.',
    },
    units: [
      { name: 'Guard Infantry', kind: 'infantry', cost: 21, dates: '1805-9 as army asset; own corps 1810-15' },
      { name: 'Grenadier', kind: 'infantry', cost: 19 },
      { name: 'Musketeer (veteran)', kind: 'infantry', cost: 17 },
      { name: 'Musketeer (conscript)', kind: 'infantry', cost: 15 },
      { name: 'Jäger', kind: 'infantry', cost: 15 },
      { name: 'Opolchenie', kind: 'infantry', cost: 6 },
      { name: 'Cuirassier, Guard Cavalry', kind: 'cavalry', cost: 23 },
      { name: 'Dragoon, Mtd. Jäger', kind: 'cavalry', cost: 17 },
      { name: 'Hussar', kind: 'cavalry', cost: 20 },
      { name: 'Uhlan', kind: 'cavalry', cost: 18 },
      { name: 'Cossack', kind: 'cavalry', cost: 11 },
      { name: 'Foot Battery', kind: 'artillery', cost: 15 },
      { name: 'Horse Battery', kind: 'artillery', cost: 17 },
      { name: 'Heavy Battery', kind: 'artillery', cost: 17 },
    ],
    brigades: [
      {
        id: 'ru-infantry-1805', name: 'Infantry Bde', category: 'organic', corps: 'line', essential: true, dates: '1805-9',
        lines: [
          { min: 3, max: 6, options: ['Musketeer (veteran)', 'Musketeer (conscript)', 'Jäger', 'Grenadier'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
          { min: 0, max: 1, options: ['Heavy Battery'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
      {
        id: 'ru-cavalry-1805', name: 'Cavalry Brigade', category: 'reserve', corps: 'line', armyMax: 2, dates: '1805-9',
        lines: [
          { min: 2, max: 5, options: ['Cuirassier, Guard Cavalry', 'Dragoon, Mtd. Jäger', 'Hussar', 'Uhlan'], note: 'Any type except Cossacks' },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
      {
        id: 'ru-musketeer-1810', name: 'Musketeer Brigade', category: 'organic', corps: 'line', essential: true, dates: '1810-15',
        lines: [
          { min: 3, max: 4, options: ['Musketeer (veteran)', 'Musketeer (conscript)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
          { min: 0, max: 1, options: ['Heavy Battery'] },
        ],
      },
      {
        id: 'ru-jager-1810', name: 'Jäger Brigade', category: 'organic', corps: 'line', armyMax: 2, dates: '1810-15',
        lines: [
          { min: 3, max: 4, options: ['Jäger'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
          { min: 0, max: 1, options: ['Heavy Battery'] },
        ],
      },
      {
        id: 'ru-grenadier-1810', name: 'Grenadier Brigade', category: 'organic', corps: 'line', armyMax: 2, dates: '1810-15',
        lines: [
          { min: 2, max: 4, options: ['Grenadier'] },
          { min: 0, max: 2, options: ['Foot Battery'] },
          { min: 0, max: 1, options: ['Heavy Battery'] },
        ],
      },
      {
        id: 'ru-guards-1810', name: 'Guards Brigade', category: 'organic', corps: 'elite', essential: true, armyMax: 2, dates: '1810-15',
        lines: [
          { min: 3, max: 4, options: ['Guard Infantry'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
          { min: 0, max: 1, options: ['Heavy Battery'] },
        ],
      },
      {
        id: 'ru-guards-cav-1810', name: 'Guards Cavalry Bde', category: 'reserve', corps: 'elite', armyMax: 1, dates: '1810-15',
        lines: [
          { min: 2, max: 3, options: ['Cuirassier, Guard Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
      {
        id: 'ru-cuirassier-1810', name: 'Cuirassier Bde', category: 'reserve', corps: 'line', armyMax: 2, dates: '1810-15',
        lines: [
          { min: 2, max: 2, options: ['Cuirassier, Guard Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
      {
        id: 'ru-dragoon-1810', name: 'Dragoon Bde', category: 'reserve', corps: 'line', armyMax: 2, dates: '1810-15',
        lines: [
          { min: 2, max: 3, options: ['Dragoon, Mtd. Jäger'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
      {
        id: 'ru-lt-cav-1810', name: 'Lt. Cavalry Bde', category: 'reserve', corps: 'line', armyMax: 2, dates: '1810-15',
        lines: [
          { min: 2, max: 4, options: ['Hussar', 'Uhlan'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 3,
      assets: [
        { name: 'Guard Infantry', min: 0, max: 2, cost: 21, kind: 'infantry', dates: '1805-9' },
        { name: 'Opolchenie', min: 0, max: 4, cost: 6, kind: 'infantry', dates: '1810-15' },
        { name: 'Cossack', min: 0, max: 2, cost: 11, kind: 'cavalry' },
        { name: 'Heavy BTY', min: 0, max: 2, cost: 17, kind: 'artillery' },
        { name: 'Foot BTY', min: 0, max: 2, cost: 15, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 2, cost: null, kind: 'special', advanced: true },
        { name: 'Partisans', min: 0, max: 4, cost: null, kind: 'special', advanced: true },
        { name: 'ADC', min: 0, max: 1, cost: null, kind: 'special', advanced: true, dates: '1810-15' },
      ],
    }],
    earthworks: { maxSections: 3, costPerSection: 4 },
  },

  {
    id: 'spain',
    name: 'Spain',
    powerType: 'major',
    historicalParameters: {
      atWar: '1805-15',
      allies: 'France (1805-7), Britain (1808-15)',
      enemies: 'Britain (1805-7), France (1808-15)',
      clients: 'None',
      notes: 'Linear Doctrine prior to 1812. Earthworks: up to 6 sections of 4BW, 4 pts each, within 1BW of a Spanish infantry/artillery unit.',
    },
    units: [
      { name: 'Elite Regiment', kind: 'infantry', cost: 16 },
      { name: 'Infantry (regular)', kind: 'infantry', cost: 12 },
      { name: 'Grenadier', kind: 'infantry', cost: 15 },
      { name: 'Infantry (provincial)', kind: 'infantry', cost: 9 },
      { name: 'Infantry (militia)', kind: 'infantry', cost: 6 },
      { name: 'Guard or Elite Cavalry', kind: 'cavalry', cost: 15 },
      { name: 'Dragoons or Hussars', kind: 'cavalry', cost: 12 },
      { name: 'Guerilla Cavalry', kind: 'cavalry', cost: 11 },
      { name: 'Heavy Battery', kind: 'artillery', cost: 12 },
      { name: 'Foot Battery', kind: 'artillery', cost: 8 },
    ],
    brigades: [
      {
        id: 'es-inf-1805', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, dates: '1805-7',
        lines: [
          { min: 3, max: 6, options: ['Infantry (regular)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'es-inf-1808', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, dates: '1808-15',
        lines: [
          { min: 3, max: 6, options: ['Infantry (regular)', 'Infantry (provincial)', 'Infantry (militia)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'es-elite-inf', name: 'Elite Infantry Bde', category: 'organic', corps: 'either', armyMax: 2,
        lines: [
          { min: 3, max: 4, options: ['Grenadier', 'Elite Regiment'] },
        ],
      },
      {
        id: 'es-elite-cav', name: 'Elite Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Guard or Elite Cavalry'] },
        ],
      },
      {
        id: 'es-cavalry', name: 'Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Dragoons or Hussars'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Guerilla Cavalry', min: 0, max: 2, cost: 11, kind: 'cavalry' },
        { name: 'Heavy BTY', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Foot BTY', min: 0, max: 2, cost: 8, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
        { name: 'Partisans', min: 0, max: 6, cost: null, kind: 'special', advanced: true },
      ],
    }],
    earthworks: { maxSections: 6, costPerSection: 4 },
  },

  {
    id: 'turkey',
    name: 'Turkey (Ottoman Empire)',
    powerType: 'major',
    historicalParameters: {
      atWar: '1806-12',
      allies: 'None',
      enemies: 'Russia (1806-12)',
      clients: 'None',
      notes: 'Earthworks: up to 6 sections of 4BW, 4 pts each, within 1BW of a Turkish infantry/artillery unit. Optional house rule: forbid Janissary and Nizam i Çedid together in the same order of battle.',
    },
    units: [
      { name: 'Nizam i Çedid', kind: 'infantry', cost: 15, dates: '1805-7' },
      { name: 'Janissary (veteran)', kind: 'infantry', cost: 12 },
      { name: 'Militia', kind: 'infantry', cost: 6 },
      { name: 'Janissary (conscript)', kind: 'infantry', cost: 10 },
      { name: 'Household Cavalry', kind: 'cavalry', cost: 20 },
      { name: 'Kapikulu Cavalry', kind: 'cavalry', cost: 15 },
      { name: 'Sipahis', kind: 'cavalry', cost: 12 },
      { name: 'Mobile Battery', kind: 'artillery', cost: 12 },
      { name: 'Heavy Artillery', kind: 'artillery', cost: 12 },
      { name: 'Field Battery', kind: 'artillery', cost: 10 },
    ],
    brigades: [
      {
        id: 'tr-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', dates: '1805-12',
        lines: [{ min: 3, max: 6, options: ['Militia'] }],
      },
      {
        id: 'tr-janissary', name: 'Janissary Bde', category: 'organic', corps: 'either', essential: true, dates: '1805-12',
        lines: [{ min: 3, max: 6, options: ['Janissary (veteran)', 'Janissary (conscript)'] }],
      },
      {
        id: 'tr-nizam', name: 'Nizam i Çedid Bde', category: 'organic', corps: 'either', armyMax: 2, dates: '1805-7',
        lines: [
          { min: 3, max: 4, options: ['Nizam i Çedid'] },
          { min: 0, max: 1, options: ['Field Battery'] },
        ],
      },
      {
        id: 'tr-household', name: 'Household Bde', category: 'reserve', corps: 'either', armyMax: 1,
        lines: [{ min: 2, max: 4, options: ['Household Cavalry'] }],
      },
      {
        id: 'tr-cavalry', name: 'Cavalry Bde', category: 'reserve', corps: 'either',
        lines: [{ min: 2, max: 3, options: ['Kapikulu Cavalry'] }],
      },
      {
        id: 'tr-light-cav', name: 'Light Cavalry Bde', category: 'organic', corps: 'either',
        lines: [{ min: 2, max: 4, options: ['Sipahis'] }],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Mobile Battery', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Heavy BTY', min: 0, max: 3, cost: 12, kind: 'artillery' },
        { name: 'Field BTY', min: 0, max: 1, cost: 10, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 2, cost: null, kind: 'special', advanced: true },
        { name: 'Partisans', min: 0, max: 6, cost: null, kind: 'special', advanced: true },
      ],
    }],
    earthworks: { maxSections: 6, costPerSection: 4 },
  },

  // ======================================================================
  // MINOR POWERS
  // ======================================================================
  {
    id: 'bavaria',
    name: 'Bavaria',
    powerType: 'minor',
    historicalParameters: { clientOf: '(1805-13): France. (1813-15): Austria, Britain, Prussia, Russia.' },
    units: [
      { name: 'Infantry (veteran)', kind: 'infantry', cost: 16 },
      { name: 'Infantry (conscript)', kind: 'infantry', cost: 14 },
      { name: 'All Infantry (1813)', kind: 'infantry', cost: 12, dates: '1813' },
      { name: 'Light Battalion', kind: 'infantry', cost: 17 },
      { name: 'Cavalry', kind: 'cavalry', cost: 17 },
      { name: 'Foot Battery', kind: 'artillery', cost: 10 },
      { name: 'Heavy Battery', kind: 'artillery', cost: 12 },
      { name: '"Light" Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'bv-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 3,
        lines: [
          { min: 3, max: 6, options: ['Infantry (veteran)', 'Infantry (conscript)', 'All Infantry (1813)'] },
          { min: 0, max: 1, options: ['Light Battalion'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'bv-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Cavalry'] },
          { min: 0, max: 1, options: ['"Light" Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Heavy BTY', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Foot BTY', min: 0, max: 1, cost: 10, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
        { name: 'ADC', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'brunswick',
    name: 'Brunswick',
    powerType: 'minor',
    noIndependentArmy: true,
    historicalParameters: {
      clientOf: '(1806): Prussia (technically neutral). (1809): Austria. (1809-14): Britain (British army assets). (1815): British client.',
      notes: 'To represent the Brunswickers in Spain, use the Brunswick units (army assets) on the British army list.',
    },
    units: [
      { name: '1806 Light Battalion', kind: 'infantry', cost: 17, dates: '1806' },
      { name: '1806 Infantry', kind: 'infantry', cost: 15, dates: '1806' },
      { name: '1815 Infantry (veteran)', kind: 'infantry', cost: 17, dates: '1815' },
      { name: '1815 Infantry (conscript)', kind: 'infantry', cost: 15, dates: '1815' },
      { name: 'Infantry (1809-1814)', kind: 'infantry', cost: 17 },
      { name: 'Light Cavalry', kind: 'cavalry', cost: 17 },
      { name: 'Foot Battery', kind: 'artillery', cost: 10 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'bw-1806', name: 'Infantry Bde', category: 'organic', corps: 'either', armyMax: 2, dates: '1806',
        lines: [
          { min: 2, max: 4, options: ['1806 Infantry'] },
          { min: 0, max: 1, options: ['1806 Light Battalion'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'bw-black-band', name: 'The Black Band', category: 'organic', corps: 'either', armyMax: 1, dates: '1809',
        lines: [
          { min: 1, max: 3, options: ['Infantry (1809-1814)'] },
          { min: 1, max: 2, options: ['Light Cavalry'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'bw-corps-1815', name: 'Brunswick Corps', category: 'organic', corps: 'either', armyMax: 1, dates: '1815',
        lines: [
          { min: 3, max: 6, options: ['1815 Infantry (veteran)', '1815 Infantry (conscript)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'bw-cavalry-1815', name: 'Brunswick Cavalry', category: 'organic', corps: 'either', armyMax: 1, dates: '1815',
        lines: [
          { min: 1, max: 2, options: ['Light Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [],
  },

  {
    id: 'confederation',
    name: 'Confederation of the Rhine',
    powerType: 'minor',
    noIndependentArmy: true,
    historicalParameters: {
      clientOf: '(1806-13): France.',
      notes: 'Covers Baden, Berg, Hesse-Darmstadt, Nassau, Mecklenburg, and the smallest German states.',
    },
    units: [
      { name: 'Infantry (elite)', kind: 'infantry', cost: 18 },
      { name: 'Infantry (veteran)', kind: 'infantry', cost: 16 },
      { name: 'Infantry (conscript)', kind: 'infantry', cost: 14 },
      { name: 'Light Battalion', kind: 'infantry', cost: 17 },
      { name: 'Cavalry', kind: 'cavalry', cost: 17 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'cr-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 0, max: 1, options: ['Infantry (elite)'] },
          { min: 3, max: 4, options: ['Infantry (veteran)', 'Infantry (conscript)'] },
          { min: 0, max: 1, options: ['Light Battalion'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'cr-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [],
  },

  {
    id: 'denmark',
    name: 'Denmark',
    powerType: 'minor',
    historicalParameters: { clientOf: '(1807-13): France.', notes: 'Danish forces rarely fought corps-sized independently, but were frequently attached to French/imperial forces 1809-13.' },
    units: [
      { name: 'Jäger', kind: 'infantry', cost: 17 },
      { name: 'Infantry', kind: 'infantry', cost: 14 },
      { name: 'Militia', kind: 'infantry', cost: 9 },
      { name: 'Ryterre', kind: 'cavalry', cost: 17 },
      { name: 'Hussar or Lt. Dragoon', kind: 'cavalry', cost: 15 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 14 },
    ],
    brigades: [
      {
        id: 'dk-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', armyMax: 2,
        lines: [
          { min: 3, max: 4, options: ['Infantry'] },
          { min: 0, max: 1, options: ['Jäger'] },
          { min: 0, max: 3, options: ['Militia'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'dk-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Ryterre', 'Hussar or Lt. Dragoon'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [],
  },

  {
    id: 'holland',
    name: 'Kingdom of Holland',
    powerType: 'minor',
    noIndependentArmy: true,
    historicalParameters: { clientOf: '(1806-10): France.' },
    units: [
      { name: 'Infantry (veteran)', kind: 'infantry', cost: 17 },
      { name: 'Infantry (conscript)', kind: 'infantry', cost: 14 },
      { name: 'Light Cavalry', kind: 'cavalry', cost: 17 },
      { name: 'Cuirassier', kind: 'cavalry', cost: 23 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'nl1806-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 2,
        lines: [
          { min: 3, max: 6, options: ['Infantry (veteran)', 'Infantry (conscript)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'nl1806-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 1, max: 2, options: ['Light Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [],
  },

  {
    id: 'italy',
    name: 'Kingdom of Italy',
    powerType: 'minor',
    historicalParameters: { clientOf: '(1805-14): France.' },
    units: [
      { name: 'Infantry (guard)', kind: 'infantry', cost: 19 },
      { name: 'Infantry (veteran or light)', kind: 'infantry', cost: 17 },
      { name: 'Infantry (conscript)', kind: 'infantry', cost: 14 },
      { name: 'Guard Cavalry', kind: 'cavalry', cost: 20 },
      { name: 'Dragoons & Lt. Cav', kind: 'cavalry', cost: 17 },
      { name: 'Reserve Battery', kind: 'artillery', cost: 14 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'it-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 3,
        lines: [
          { min: 3, max: 6, options: ['Infantry (guard)', 'Infantry (veteran or light)', 'Infantry (conscript)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'it-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 4, options: ['Dragoons & Lt. Cav'] },
          { min: 0, max: 1, options: ['Guard Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Foot BTY', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Reserve BTY', min: 0, max: 1, cost: 14, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
        { name: 'ADC', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'naples',
    name: 'Kingdom of Naples',
    powerType: 'minor',
    historicalParameters: { clientOf: '(1806-14): France.' },
    units: [
      { name: 'Infantry (guard)', kind: 'infantry', cost: 14 },
      { name: 'Infantry (line or light)', kind: 'infantry', cost: 12 },
      { name: 'All Infantry (1813-15)', kind: 'infantry', cost: 10, dates: '1813-15' },
      { name: 'Guard Cavalry', kind: 'cavalry', cost: 15 },
      { name: 'Cavalry', kind: 'cavalry', cost: 12 },
      { name: 'Reserve Battery', kind: 'artillery', cost: 14 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'na-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 2,
        lines: [
          { min: 3, max: 6, options: ['Infantry (guard)', 'Infantry (line or light)', 'All Infantry (1813-15)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'na-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Cavalry'] },
          { min: 0, max: 2, options: ['Guard Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Foot BTY', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Reserve BTY', min: 0, max: 1, cost: 14, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'netherlands1815',
    name: 'Kingdom of the Netherlands (1815)',
    powerType: 'minor',
    historicalParameters: { clientOf: '(1815): Britain.' },
    units: [
      { name: 'Infantry', kind: 'infantry', cost: 15 },
      { name: 'Militia', kind: 'infantry', cost: 12 },
      { name: 'Cavalry', kind: 'cavalry', cost: 15 },
      { name: 'Foot Battery', kind: 'artillery', cost: 10 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'nl1815-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 3,
        lines: [
          { min: 2, max: 3, options: ['Infantry'] },
          { min: 1, max: 3, options: ['Militia'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'nl1815-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [],
  },

  {
    id: 'portugal',
    name: 'Kingdom of Portugal',
    powerType: 'minor',
    noIndependentArmy: true,
    historicalParameters: { clientOf: '(1808-14): Britain.' },
    units: [
      { name: 'Infantry (veteran)', kind: 'infantry', cost: 17 },
      { name: 'Infantry (conscript)', kind: 'infantry', cost: 15 },
      { name: 'Caçadores', kind: 'infantry', cost: 17 },
      { name: 'Cavalry', kind: 'cavalry', cost: 10 },
      { name: 'Foot Artillery', kind: 'artillery', cost: 10 },
    ],
    brigades: [
      {
        id: 'pt-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', armyMax: 2,
        lines: [
          { min: 1, max: 3, options: ['Infantry (veteran)', 'Infantry (conscript)'] },
          { min: 0, max: 1, options: ['Caçadores'] },
          { min: 0, max: 1, options: ['Foot Artillery'] },
        ],
      },
    ],
    assetGroups: [],
  },

  {
    id: 'poland',
    name: 'Poland (Duchy of Warsaw)',
    powerType: 'minor',
    historicalParameters: {
      clientOf: '(1807-13): France.',
      notes: 'Covers the Duchy of Warsaw only, not Polish units serving with the French army. "Light Cavalry" = hussar/chasseur regiments.',
    },
    units: [
      { name: 'Infantry (veteran)', kind: 'infantry', cost: 18 },
      { name: 'Infantry (conscript)', kind: 'infantry', cost: 16 },
      { name: 'Light Cavalry', kind: 'cavalry', cost: 17 },
      { name: 'Cuirassier', kind: 'cavalry', cost: 20 },
      { name: 'Lancer', kind: 'cavalry', cost: 21 },
      { name: 'Reserve Battery', kind: 'artillery', cost: 14 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'pl-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 3,
        lines: [
          { min: 3, max: 6, options: ['Infantry (veteran)', 'Infantry (conscript)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'pl-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 2,
        lines: [
          { min: 2, max: 3, options: ['Lancer'] },
          { min: 0, max: 1, options: ['Light Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Cuirassier', min: 0, max: 1, cost: 20, kind: 'cavalry', restriction: 'Attach to Cavalry Bde only' },
        { name: 'Foot BTY', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Reserve BTY', min: 0, max: 1, cost: 14, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
        { name: 'ADC', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'saxony',
    name: 'Saxony',
    powerType: 'minor',
    historicalParameters: { clientOf: '(1805-6): Prussia. (1806-13): France.', notes: 'Linear Doctrine prior to 1810.' },
    units: [
      { name: 'Guard or Grenadier', kind: 'infantry', cost: 15 },
      { name: 'Light Battalion', kind: 'infantry', cost: 17 },
      { name: 'Infantry (1805-7)', kind: 'infantry', cost: 13 },
      { name: 'Infantry (1808-12)', kind: 'infantry', cost: 14 },
      { name: 'All Infantry (1813)', kind: 'infantry', cost: 12, dates: '1813' },
      { name: 'Light Cavalry', kind: 'cavalry', cost: 17 },
      { name: 'Heavy Cavalry', kind: 'cavalry', cost: 23 },
      { name: 'Foot Battery', kind: 'artillery', cost: 10 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
      { name: 'Heavy Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'sx-inf-1806', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 2, dates: '1806',
        lines: [
          { min: 3, max: 4, options: ['Infantry (1805-7)'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'sx-grenadier-1806', name: 'Grenadier Bde', category: 'reserve', corps: 'either', armyMax: 1, dates: '1806',
        lines: [
          { min: 3, max: 6, options: ['Guard or Grenadier'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'sx-cavalry-1806', name: 'Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 2, dates: '1806',
        lines: [
          { min: 1, max: 2, options: ['Light Cavalry'] },
          { min: 0, max: 2, options: ['Heavy Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
      {
        id: 'sx-inf-1807', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 3, dates: '1807-13',
        lines: [
          { min: 3, max: 6, options: ['Infantry (1808-12)', 'All Infantry (1813)'] },
          { min: 0, max: 1, options: ['Light Battalion'] },
          { min: 0, max: 2, options: ['Guard or Grenadier'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'sx-light-cav-1807', name: 'Light Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 1, dates: '1807-13',
        lines: [
          { min: 1, max: 2, options: ['Light Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
      {
        id: 'sx-heavy-cav-1807', name: 'Heavy Cavalry Bde', category: 'reserve', corps: 'either', armyMax: 1, dates: '1807-13',
        lines: [
          { min: 1, max: 2, options: ['Heavy Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Foot BTY', min: 0, max: 1, cost: 10, kind: 'artillery' },
        { name: 'Heavy BTY', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'sweden',
    name: 'Sweden',
    powerType: 'minor',
    historicalParameters: { clientOf: '(1805-7): Britain. (1813-15): Austria, Prussia, Russia.', notes: 'Linear Doctrine prior to 1810.' },
    units: [
      { name: 'Guard Infantry', kind: 'infantry', cost: 16 },
      { name: 'Värvade', kind: 'infantry', cost: 14 },
      { name: 'Indelta Infantry', kind: 'infantry', cost: 12 },
      { name: 'Life Guards', kind: 'cavalry', cost: 15 },
      { name: 'Indelta Cavalry', kind: 'cavalry', cost: 15 },
      { name: 'Reserve Battery', kind: 'artillery', cost: 14 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'se-guards', name: 'Guards Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 4, options: ['Guard Infantry'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'se-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 3,
        lines: [
          { min: 2, max: 4, options: ['Indelta Infantry'] },
          { min: 0, max: 2, options: ['Värvade'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'se-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Indelta Cavalry'] },
          { min: 0, max: 1, options: ['Life Guards'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Foot BTY', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'westphalia',
    name: 'Westphalia',
    powerType: 'minor',
    historicalParameters: {
      clientOf: '(1808-13): France.',
      notes: '"Guard Infantry" = the grenadier battalion and guard jäger battalion. All 1813 Guard/Light units are identical to "All Infantry (1813)".',
    },
    units: [
      { name: 'Guard Infantry', kind: 'infantry', cost: 16, dates: '1808-12' },
      { name: 'Jäger Carabinier BN', kind: 'infantry', cost: 17, dates: '1808-12' },
      { name: 'Line Infantry', kind: 'infantry', cost: 14, dates: '1808-12' },
      { name: 'Light Battalion', kind: 'infantry', cost: 15, dates: '1808-12' },
      { name: 'All Infantry (1813)', kind: 'infantry', cost: 12, dates: '1813' },
      { name: 'Cuirassier', kind: 'cavalry', cost: 23 },
      { name: 'Cheveauleger', kind: 'cavalry', cost: 16 },
      { name: 'Hussar', kind: 'cavalry', cost: 15 },
      { name: 'Reserve Battery', kind: 'artillery', cost: 14 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'wf-guard', name: 'Guard Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 1, max: 2, options: ['Guard Infantry'] },
          { min: 1, max: 1, options: ['Jäger Carabinier BN'] },
          { min: 0, max: 1, options: ['Light Battalion'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'wf-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', essential: true, armyMax: 2,
        lines: [
          { min: 3, max: 5, options: ['Line Infantry', 'All Infantry (1813)'] },
          { min: 0, max: 1, options: ['Light Battalion'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'wf-cuirassier', name: 'Cuirassier Bde', category: 'reserve', corps: 'either', armyMax: 1,
        lines: [
          { min: 1, max: 2, options: ['Cuirassier'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
      {
        id: 'wf-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 0, max: 1, options: ['Cheveauleger'] },
          { min: 1, max: 2, options: ['Hussar'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Reserve BTY', min: 0, max: 1, cost: 14, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
        { name: 'ADC', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },

  {
    id: 'wurttemberg',
    name: 'Württemberg',
    powerType: 'minor',
    historicalParameters: { clientOf: '(1806-13): France. (1814): Austria, Russia, Prussia.' },
    units: [
      { name: 'Infantry', kind: 'infantry', cost: 16 },
      { name: 'Light Battalion', kind: 'infantry', cost: 17 },
      { name: 'Infantry (1813)', kind: 'infantry', cost: 12, dates: '1813' },
      { name: 'Cavalry', kind: 'cavalry', cost: 17 },
      { name: 'Foot Battery', kind: 'artillery', cost: 12 },
      { name: 'Horse Battery', kind: 'artillery', cost: 12 },
    ],
    brigades: [
      {
        id: 'wt-infantry', name: 'Infantry Bde', category: 'organic', corps: 'either', armyMax: 2,
        lines: [
          { min: 3, max: 6, options: ['Infantry', 'Infantry (1813)'] },
          { min: 0, max: 1, options: ['Light Battalion'] },
          { min: 0, max: 1, options: ['Foot Battery'] },
        ],
      },
      {
        id: 'wt-cavalry', name: 'Cavalry Bde', category: 'organic', corps: 'either', armyMax: 1,
        lines: [
          { min: 2, max: 3, options: ['Cavalry'] },
          { min: 0, max: 1, options: ['Horse Battery'] },
        ],
      },
    ],
    assetGroups: [{
      maxAttachPerBrigade: 1,
      assets: [
        { name: 'Foot BTY', min: 0, max: 1, cost: 12, kind: 'artillery' },
        { name: 'Sapeur', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
        { name: 'ADC', min: 0, max: 1, cost: null, kind: 'special', advanced: true },
      ],
    }],
  },
];

export function getNation(id: string): Nation | undefined {
  return nations.find((n) => n.id === id);
}

export function findUnit(nation: Nation, name: string) {
  return nation.units.find((u) => u.name === name);
}
