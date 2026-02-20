export interface SurvivalInfo {
  emergencyNumber: string
  currency: string
  plugType: string
  waterSafety: 'Safe' | 'Unsafe'
  taxiApp: { name: string; url: string }
  tipping: string
}

export const SURVIVAL_DATA: Record<string, SurvivalInfo> = {
  london: {
    emergencyNumber: '999',
    currency: 'GBP (£)',
    plugType: 'Type G',
    waterSafety: 'Safe',
    taxiApp: { name: 'Uber', url: 'https://www.uber.com' },
    tipping: 'Not Expected',
  },
  'new-york': {
    emergencyNumber: '911',
    currency: 'USD ($)',
    plugType: 'Type A/B',
    waterSafety: 'Safe',
    taxiApp: { name: 'Uber', url: 'https://www.uber.com' },
    tipping: '15-20%',
  },
  paris: {
    emergencyNumber: '112',
    currency: 'EUR (€)',
    plugType: 'Type C/E',
    waterSafety: 'Safe',
    taxiApp: { name: 'Uber', url: 'https://www.uber.com' },
    tipping: 'Round up',
  },
  tokyo: {
    emergencyNumber: '110',
    currency: 'JPY (¥)',
    plugType: 'Type A/B',
    waterSafety: 'Safe',
    taxiApp: { name: 'GO', url: 'https://go.mo-t.com' },
    tipping: 'No Tipping',
  },
  chongqing: {
    emergencyNumber: '110',
    currency: 'CNY (¥)',
    plugType: 'Type A/I',
    waterSafety: 'Unsafe',
    taxiApp: { name: 'DiDi', url: 'https://www.didiglobal.com' },
    tipping: 'No Tipping',
  },
  singapore: {
    emergencyNumber: '999',
    currency: 'SGD (S$)',
    plugType: 'Type G',
    waterSafety: 'Safe',
    taxiApp: { name: 'Grab', url: 'https://www.grab.com' },
    tipping: 'Not Expected',
  },
  'hong-kong': {
    emergencyNumber: '999',
    currency: 'HKD (HK$)',
    plugType: 'Type G',
    waterSafety: 'Safe',
    taxiApp: { name: 'Uber', url: 'https://www.uber.com' },
    tipping: '10% or Round up',
  },
  berlin: {
    emergencyNumber: '112',
    currency: 'EUR (€)',
    plugType: 'Type F',
    waterSafety: 'Safe',
    taxiApp: { name: 'FREENOW', url: 'https://www.free-now.com' },
    tipping: '5-10%',
  },
  'los-angeles': {
    emergencyNumber: '911',
    currency: 'USD ($)',
    plugType: 'Type A/B',
    waterSafety: 'Safe',
    taxiApp: { name: 'Uber', url: 'https://www.uber.com' },
    tipping: '15-20%',
  },
  rome: {
    emergencyNumber: '112',
    currency: 'EUR (€)',
    plugType: 'Type C/F/L',
    waterSafety: 'Safe',
    taxiApp: { name: 'FREENOW', url: 'https://www.free-now.com' },
    tipping: 'Round up',
  },
  dubai: {
    emergencyNumber: '999',
    currency: 'AED (dh)',
    plugType: 'Type G',
    waterSafety: 'Safe',
    taxiApp: { name: 'Careem', url: 'https://www.careem.com' },
    tipping: 'Not Expected',
  },
  bangkok: {
    emergencyNumber: '191',
    currency: 'THB (฿)',
    plugType: 'Type A/C',
    waterSafety: 'Unsafe',
    taxiApp: { name: 'Grab', url: 'https://www.grab.com' },
    tipping: 'Round up',
  },
  'rio-de-janeiro': {
    emergencyNumber: '190',
    currency: 'BRL (R$)',
    plugType: 'Type N',
    waterSafety: 'Unsafe',
    taxiApp: { name: 'Uber', url: 'https://www.uber.com' },
    tipping: '10%',
  },
  istanbul: {
    emergencyNumber: '112',
    currency: 'TRY (₺)',
    plugType: 'Type F',
    waterSafety: 'Unsafe',
    taxiApp: { name: 'BiTaksi', url: 'https://www.bitaksi.com' },
    tipping: '5-10%',
  },
};
