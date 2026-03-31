
export type RiskLevel = 'Critical' | 'High' | 'Moderate' | 'Safe';

export interface VillageData {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  historicalTrend: number[]; // past 36 months (3 years)
  predictionTrend: number[]; // future 12 months
  depletionRate: number; // meter/year
  extractionScore: number; // 0-100
  cropType: string;
  population: number;
  soilType: string;
}

const STATES = [
  { name: 'Telangana', districts: ['Nalgonda', 'Warangal', 'Nizamabad'], crops: ['Cotton', 'Paddy'], extraction: 85, latRange: [16, 19], lngRange: [77, 81] },
  { name: 'Punjab', districts: ['Ludhiana', 'Amritsar', 'Sangrur'], crops: ['Wheat', 'Rice'], extraction: 95, latRange: [29, 32], lngRange: [74, 76] },
  { name: 'Maharashtra', districts: ['Latur', 'Beed', 'Solapur'], crops: ['Sugarcane', 'Soybean'], extraction: 75, latRange: [16, 20], lngRange: [73, 80] },
  { name: 'Rajasthan', districts: ['Jaisalmer', 'Barmer', 'Jodhpur'], crops: ['Millet', 'Pulses'], extraction: 35, latRange: [24, 29], lngRange: [70, 76] },
  { name: 'Tamil Nadu', districts: ['Erode', 'Vellore', 'Salem'], crops: ['Coconut', 'Paddy'], extraction: 80, latRange: [8, 13], lngRange: [77, 80] },
  { name: 'Uttar Pradesh', districts: ['Meerut', 'Agra', 'Kanpur'], crops: ['Sugarcane', 'Wheat'], extraction: 90, latRange: [24, 29], lngRange: [77, 84] },
  { name: 'Karnataka', districts: ['Mandya', 'Tumakuru', 'Raichur'], crops: ['Paddy', 'Maize'], extraction: 82, latRange: [12, 18], lngRange: [74, 78] },
  { name: 'Bihar', districts: ['Patna', 'Gaya', 'Bhagalpur'], crops: ['Rice', 'Maize'], extraction: 70, latRange: [24, 27], lngRange: [83, 88] },
  { name: 'West Bengal', districts: ['Hooghly', 'Purulia', 'Nadia'], crops: ['Rice', 'Jute'], extraction: 75, latRange: [21, 27], lngRange: [86, 89] },
  { name: 'Madhya Pradesh', districts: ['Hoshangabad', 'Bhind', 'Indore'], crops: ['Soybean', 'Wheat'], extraction: 88, latRange: [21, 26], lngRange: [74, 82] },
  { name: 'Gujarat', districts: ['Banaskantha', 'Kutch', 'Mehsana'], crops: ['Cotton', 'Groundnut'], extraction: 80, latRange: [20, 24], lngRange: [68, 74] },
  { name: 'Kerala', districts: ['Wayand', 'Palakkad', 'Idukki'], crops: ['Rubber', 'Paddy'], extraction: 55, latRange: [8, 12], lngRange: [75, 77] },
  { name: 'Assam', districts: ['Jorhat', 'Dibrugarh', 'Silchar'], crops: ['Tea', 'Rice'], extraction: 40, latRange: [24, 28], lngRange: [90, 96] },
  { name: 'Haryana', districts: ['Karnal', 'Kurukshetra', 'Sonipat'], crops: ['Wheat', 'Rice'], extraction: 92, latRange: [28, 30], lngRange: [75, 77] },
  { name: 'Odisha', districts: ['Ganjam', 'Balasore', 'Kalahandi'], crops: ['Paddy', 'Pulses'], extraction: 65, latRange: [18, 22], lngRange: [82, 87] }
];

const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert'];

// Deterministic random generator based on seed
const seededRandom = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return () => {
    h = Math.imul(h ^ h >>> 16, 0x85ebca6b);
    h = Math.imul(h ^ h >>> 13, 0xc2b2ae35);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

export const generateSingleVillage = (name: string, district: string, state: string, lat: number, lng: number): VillageData => {
  const seed = seededRandom(`${name}-${district}-${state}`);
  const stateObj = STATES.find(s => s.name === state) || STATES[0];
  
  const historicalTrend: number[] = [];
  const predictionTrend: number[] = [];
  
  let currentLevel = 25 + seed() * 20; // depth in meters
  // Smaller depletion rate per month
  const baseMonthlyDepletion = (seed() * 0.1) + 0.05;

  // Generate 36 months of history
  for (let m = 0; m < 36; m++) {
    const month = m % 12;
    const isMonsoon = month >= 5 && month <= 8; // June to Sept
    const monsoonFactor = isMonsoon ? (0.3 + seed() * 0.4) : 0;
    const extractionFactor = (seed() * 0.1) + 0.1;

    currentLevel += (extractionFactor - monsoonFactor);
    historicalTrend.push(parseFloat(currentLevel.toFixed(2)));
  }

  const lastLevel = historicalTrend[historicalTrend.length - 1];
  const depletionRateYearly = (historicalTrend[35] - historicalTrend[23]); // Change in last year

  // Generate 12 months of prediction based on the strict formula:
  // nextValue = previousValue + depletionRate - seasonalFactor + randomNoise
  let predLevel = lastLevel;
  for (let m = 0; m < 12; m++) {
    const month = m % 12;
    const isMonsoon = month >= 5 && month <= 8;
    const seasonalFactor = isMonsoon ? (0.2 + seed() * 0.3) : -(0.1 + seed() * 0.2);
    const noise = (seed() - 0.5) * 0.1;
    
    // Applying the formula: nextValue = previousValue + depletionRate - seasonalFactor + randomNoise
    // Here, depletionRate is added (increasing depth) and seasonalFactor is subtracted (recharge reduces depth)
    predLevel = predLevel + (baseMonthlyDepletion / 2) - seasonalFactor + noise;
    predictionTrend.push(parseFloat(predLevel.toFixed(2)));
  }

  const extractionScore = stateObj.extraction + (seed() * 10 - 5);
  // Risk Score calculation:
  const riskScore = Math.min(100, Math.max(0, 
    (depletionRateYearly * 15) + (extractionScore * 0.6) + (seed() * 10)
  ));

  // Risk Level strictly based on riskScore > 85
  let riskLevel: RiskLevel = 'Safe';
  if (riskScore > 85) riskLevel = 'Critical';
  else if (riskScore > 65) riskLevel = 'High';
  else if (riskScore > 40) riskLevel = 'Moderate';

  return {
    id: `dynamic-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    district,
    state,
    lat,
    lng,
    riskScore: Math.round(riskScore),
    riskLevel,
    historicalTrend,
    predictionTrend,
    depletionRate: parseFloat(depletionRateYearly.toFixed(2)),
    extractionScore: Math.round(extractionScore),
    cropType: stateObj.crops[Math.floor(seed() * stateObj.crops.length)],
    population: 500 + Math.floor(seed() * 5000),
    soilType: SOIL_TYPES[Math.floor(seed() * SOIL_TYPES.length)]
  };
};

export const generateSimulatedData = (count: number = 2500): VillageData[] => {
  const villages: VillageData[] = [];

  for (let i = 0; i < count; i++) {
    const stateObj = STATES[Math.floor(Math.random() * STATES.length)];
    const district = stateObj.districts[Math.floor(Math.random() * stateObj.districts.length)];
    const lat = stateObj.latRange[0] + Math.random() * (stateObj.latRange[1] - stateObj.latRange[0]);
    const lng = stateObj.lngRange[0] + Math.random() * (stateObj.lngRange[1] - stateObj.lngRange[0]);
    
    villages.push(generateSingleVillage(
      `${district} Village ${i + 1}`, 
      district, 
      stateObj.name, 
      lat, 
      lng
    ));
  }

  // Pre-load specific critical regions
  const nalgondaCentral = generateSingleVillage('Nalgonda Central', 'Nalgonda', 'Telangana', 17.05, 79.27);
  nalgondaCentral.id = 'nalgonda-special';
  nalgondaCentral.riskScore = 92;
  nalgondaCentral.riskLevel = 'Critical';
  villages.unshift(nalgondaCentral);

  return villages;
};

export const calculateNationalInsights = (villages: VillageData[]) => {
  const critical = villages.filter(v => v.riskLevel === 'Critical');
  const fastestDepletion = [...villages].sort((a, b) => b.depletionRate - a.depletionRate)[0];
  const avgDepletion = +(villages.reduce((acc, v) => acc + v.depletionRate, 0) / (villages.length || 1)).toFixed(2);
  
  return {
    criticalCount: critical.length,
    fastestDepletionRegion: fastestDepletion ? fastestDepletion.district : 'N/A',
    fastestDepletionRate: fastestDepletion ? fastestDepletion.depletionRate : 0,
    avgDepletion,
    nationalTrend: 'Surge in Central Region'
  };
};
