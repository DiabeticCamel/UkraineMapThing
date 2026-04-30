// ============================================
// SafePath Ukraine — Static Data & Config
// ============================================

const UKRAINE_CENTER = { lat: 48.3794, lng: 31.1656 };
const UKRAINE_ZOOM = 6;

// Risk zones: each has center coords, radius (meters), and risk 0-100
const RISK_ZONES = [
  // Active conflict / critical
  { name: 'Donetsk Oblast',    lat: 48.0159, lng: 37.8028, radius: 120000, risk: 95, label: 'Active conflict' },
  { name: 'Luhansk Oblast',    lat: 48.5740, lng: 39.3078, radius: 110000, risk: 92, label: 'Active conflict' },
  { name: 'Kherson Oblast',    lat: 46.6354, lng: 32.6169, radius: 90000,  risk: 88, label: 'Active conflict' },
  { name: 'Zaporizhzhia',      lat: 47.8388, lng: 35.1396, radius: 80000,  risk: 82, label: 'High risk' },
  { name: 'Kharkiv',          lat: 49.9935, lng: 36.2304, radius: 75000,  risk: 78, label: 'High risk' },

  // High risk
  { name: 'Mykolaiv',         lat: 46.9750, lng: 32.0000, radius: 70000,  risk: 62, label: 'High risk' },
  { name: 'Sumy Oblast',      lat: 50.9077, lng: 34.7981, radius: 65000,  risk: 58, label: 'Moderate' },
  { name: 'Dnipropetrovsk',   lat: 48.4647, lng: 35.0462, radius: 70000,  risk: 50, label: 'Moderate' },

  // Moderate
  { name: 'Kyiv',             lat: 50.4501, lng: 30.5234, radius: 60000,  risk: 41, label: 'Moderate' },
  { name: 'Odesa',            lat: 46.4825, lng: 30.7233, radius: 55000,  risk: 38, label: 'Moderate' },
  { name: 'Poltava',          lat: 49.5883, lng: 34.5514, radius: 50000,  risk: 22, label: 'Low risk' },

  // Safe western regions — minimal gradient
  { name: 'Lviv Oblast',      lat: 49.8397, lng: 24.0297, radius: 80000,  risk: 4,  label: 'Safe' },
  { name: 'Ivano-Frankivsk',  lat: 48.9226, lng: 24.7111, radius: 60000,  risk: 6,  label: 'Safe' },
  { name: 'Ternopil',         lat: 49.5535, lng: 25.5948, radius: 55000,  risk: 7,  label: 'Safe' },
  { name: 'Zakarpattia',      lat: 48.6208, lng: 22.2879, radius: 60000,  risk: 3,  label: 'Safe' },
  { name: 'Chernivtsi',       lat: 48.2921, lng: 25.9310, radius: 50000,  risk: 5,  label: 'Safe' },
];

// City markers shown on map
const CITIES = [
  { name: 'Kyiv',            lat: 50.4501, lng: 30.5234, risk: 41, routes: 2, displaced: '~340k',  label: 'Moderate' },
  { name: 'Lviv',            lat: 49.8397, lng: 24.0297, risk: 4,  routes: 3, displaced: '~12k',   label: 'Safe' },
  { name: 'Kharkiv',         lat: 49.9935, lng: 36.2304, risk: 78, routes: 1, displaced: '~620k',  label: 'High risk' },
  { name: 'Zaporizhzhia',    lat: 47.8388, lng: 35.1396, risk: 82, routes: 0, displaced: '~290k',  label: 'High risk' },
  { name: 'Dnipro',          lat: 48.4647, lng: 35.0462, risk: 50, routes: 2, displaced: '~180k',  label: 'Moderate' },
  { name: 'Odesa',           lat: 46.4825, lng: 30.7233, risk: 38, routes: 1, displaced: '~95k',   label: 'Moderate' },
  { name: 'Mykolaiv',        lat: 46.9750, lng: 32.0000, risk: 62, routes: 1, displaced: '~210k',  label: 'High risk' },
  { name: 'Kherson',         lat: 46.6354, lng: 32.6169, risk: 91, routes: 0, displaced: '~310k',  label: 'Active conflict' },
  { name: 'Poltava',         lat: 49.5883, lng: 34.5514, risk: 22, routes: 2, displaced: '~45k',   label: 'Low risk' },
  { name: 'Ivano-Frankivsk', lat: 48.9226, lng: 24.7111, risk: 6,  routes: 3, displaced: '~8k',    label: 'Safe' },
  { name: 'Ternopil',        lat: 49.5535, lng: 25.5948, risk: 7,  routes: 3, displaced: '~6k',    label: 'Safe' },
  { name: 'Sumy',            lat: 50.9077, lng: 34.7981, risk: 58, routes: 1, displaced: '~155k',  label: 'Moderate' },
];

// Safe evacuation corridors [from, to, waypoints]
const SAFE_CORRIDORS = [
  {
    id: 'corridor-1',
    name: 'Kyiv → Lviv (M06 highway)',
    from: { lat: 50.4501, lng: 30.5234 },
    to:   { lat: 49.8397, lng: 24.0297 },
    waypoints: [
      { lat: 50.3500, lng: 28.6500 },
      { lat: 50.0800, lng: 26.2500 },
    ],
    status: 'open',
    color: '#10B981',
  },
  {
    id: 'corridor-2',
    name: 'Kyiv → Polish border via Zhytomyr',
    from: { lat: 50.4501, lng: 30.5234 },
    to:   { lat: 50.3326, lng: 22.1397 },
    waypoints: [
      { lat: 50.2548, lng: 28.6580 },
      { lat: 49.8397, lng: 24.0297 },
    ],
    status: 'open',
    color: '#10B981',
  },
  {
    id: 'corridor-3',
    name: 'Dnipro → Kyiv (M04)',
    from: { lat: 48.4647, lng: 35.0462 },
    to:   { lat: 50.4501, lng: 30.5234 },
    waypoints: [],
    status: 'caution',
    color: '#F59E0B',
  },
  {
    id: 'corridor-4',
    name: 'Odesa → Lviv via Uman',
    from: { lat: 46.4825, lng: 30.7233 },
    to:   { lat: 49.8397, lng: 24.0297 },
    waypoints: [
      { lat: 48.7482, lng: 30.2142 },
      { lat: 49.3000, lng: 26.8500 },
    ],
    status: 'caution',
    color: '#F59E0B',
  },
];

const TRANSPORT_OPTIONS = [
  { icon: '🚗', name: 'Volunteer cars', meta: 'Next pickup: ~12 min · All regions', avail: '38 online', status: 'safe' },
  { icon: '🚌', name: 'Bus convoy',      meta: 'Next departure: 45 min · Lviv bound', avail: '14 avail', status: 'safe' },
  { icon: '🚂', name: 'Ukrzaliznytsia', meta: 'Platform 3 · Running ~90min late', avail: 'Delayed', status: 'moderate' },
  { icon: '✈️', name: 'Humanitarian flight', meta: 'Boryspil Airport · Registration req.', avail: 'Limited', status: 'moderate' },
  { icon: '🚑', name: 'Medical convoy', meta: 'Priority: wounded + elderly', avail: '6 avail', status: 'safe' },
];

const DATA_SOURCES = [
  { name: 'Google Maps Routes API', status: 'live', color: '#10B981' },
  { name: 'ACLED Conflict Data',    status: 'live', color: '#10B981' },
  { name: 'UN OCHA ReliefWeb',      status: 'live', color: '#10B981' },
  { name: 'Ukrzaliznytsia API',     status: 'live', color: '#10B981' },
  { name: 'ISW Daily Maps',         status: '15m delay', color: '#F59E0B' },
  { name: 'UNHCR Displacement',     status: 'live', color: '#10B981' },
  { name: 'Liveuamap Alerts',       status: 'live', color: '#10B981' },
  { name: 'NASA FIRMS Fire/Smoke',  status: '15m delay', color: '#F59E0B' },
];

// Google Maps dark style
const DARK_MAP_STYLE = [
  { elementType: 'geometry',         stylers: [{ color: '#1a2433' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b949e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
  { featureType: 'administrative',   elementType: 'geometry.stroke', stylers: [{ color: '#3d5166' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'poi',              elementType: 'geometry',        stylers: [{ color: '#1e2d3d' }] },
  { featureType: 'poi',              elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'poi.park',         elementType: 'geometry',        stylers: [{ color: '#162030' }] },
  { featureType: 'road',             elementType: 'geometry',        stylers: [{ color: '#2d3f52' }] },
  { featureType: 'road',             elementType: 'geometry.stroke', stylers: [{ color: '#1a2433' }] },
  { featureType: 'road',             elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'road.highway',     elementType: 'geometry',        stylers: [{ color: '#3d5166' }] },
  { featureType: 'road.highway',     elementType: 'geometry.stroke', stylers: [{ color: '#243448' }] },
  { featureType: 'road.highway',     elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'transit',          elementType: 'geometry',        stylers: [{ color: '#1e2d3d' }] },
  { featureType: 'transit.station',  elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'water',            elementType: 'geometry',        stylers: [{ color: '#0d1f2d' }] },
  { featureType: 'water',            elementType: 'labels.text.fill', stylers: [{ color: '#4a6880' }] },
  { featureType: 'water',            elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
];
