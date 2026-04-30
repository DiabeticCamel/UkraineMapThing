// ============================================
// SafePath Ukraine — Google Maps Core
// ============================================

let map = null;
let circles = [];
let corridorLines = [];
let cityMarkers = [];
let directionsService = null;
let directionsRenderer = null;
let heatmapVisible = true;
let routesVisible = true;
let activeRoute = null;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: UKRAINE_CENTER,
    zoom: UKRAINE_ZOOM,
    minZoom: 5,
    maxZoom: 14,
    styles: DARK_MAP_STYLE,
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    restriction: {
      latLngBounds: {
        north: 52.5,
        south: 44.0,
        west: 20.0,
        east: 41.0,
      },
      strictBounds: false,
    },
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#10B981',
      strokeWeight: 4,
      strokeOpacity: 0.9,
    },
  });
  directionsRenderer.setMap(map);

  // Render all layers
  renderRiskZones();
  renderCityMarkers();
  renderCorridors();

  // Populate sidebar UI
  populateZoneList();
  populateTransportList();
  populateTransportTypeGrid();
  populateSourcesList();

  // Start update ticker
  startUpdateTicker();

  console.log('[SafePath] Map initialized.');
}

// ── RISK ZONE CIRCLES (white → red gradient) ──
function riskToColor(risk) {
  // 0 = white, 100 = deep crimson
  if (risk <= 10) return { fill: '#ffffff', opacity: 0.0 };
  if (risk <= 25) return { fill: '#FFCDD2', opacity: 0.25 };
  if (risk <= 45) return { fill: '#EF9A9A', opacity: 0.35 };
  if (risk <= 65) return { fill: '#E53935', opacity: 0.45 };
  if (risk <= 80) return { fill: '#C62828', opacity: 0.55 };
  return { fill: '#7F0000', opacity: 0.65 };
}

function renderRiskZones() {
  circles.forEach(c => c.setMap(null));
  circles = [];

  RISK_ZONES.forEach(zone => {
    const { fill, opacity } = riskToColor(zone.risk);

    // Outer glow
    if (zone.risk > 30) {
      const glow = new google.maps.Circle({
        map,
        center: { lat: zone.lat, lng: zone.lng },
        radius: zone.radius * 1.6,
        fillColor: fill,
        fillOpacity: opacity * 0.25,
        strokeWeight: 0,
        clickable: false,
      });
      circles.push(glow);
    }

    // Main zone
    const circle = new google.maps.Circle({
      map,
      center: { lat: zone.lat, lng: zone.lng },
      radius: zone.radius,
      fillColor: fill,
      fillOpacity: opacity,
      strokeColor: fill,
      strokeWeight: zone.risk > 60 ? 1 : 0,
      strokeOpacity: 0.4,
      clickable: false,
    });
    circles.push(circle);
  });
}

// ── CITY MARKERS ──
function riskToMarkerColor(risk, label) {
  if (label === 'Safe' || risk <= 15)           return '#10B981';
  if (label === 'Low risk' || risk <= 30)       return '#34d399';
  if (label === 'Moderate' || risk <= 55)       return '#F59E0B';
  if (label === 'High risk' || risk <= 80)      return '#EF4444';
  return '#7F0000';
}

function renderCityMarkers() {
  cityMarkers.forEach(m => m.setMap(null));
  cityMarkers = [];

  CITIES.forEach(city => {
    const color = riskToMarkerColor(city.risk, city.label);

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
        <filter id="shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.5"/>
        </filter>
        <path d="M14 2C8.48 2 4 6.48 4 12c0 7.5 10 22 10 22S24 19.5 24 12c0-5.52-4.48-10-10-10z"
          fill="${color}" filter="url(#shadow)"/>
        <circle cx="14" cy="12" r="4" fill="white" opacity="0.9"/>
      </svg>`;

    const marker = new google.maps.Marker({
      position: { lat: city.lat, lng: city.lng },
      map,
      title: city.name,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(28, 36),
        anchor: new google.maps.Point(14, 36),
      },
      zIndex: 100 + city.risk,
    });

    marker.addListener('click', () => showCityTooltip(city));
    cityMarkers.push(marker);
  });
}

// ── EVACUATION CORRIDORS ──
function renderCorridors() {
  corridorLines.forEach(l => l.setMap(null));
  corridorLines = [];

  SAFE_CORRIDORS.forEach(corridor => {
    const path = [corridor.from, ...corridor.waypoints, corridor.to];

    // Glow beneath
    const glow = new google.maps.Polyline({
      path,
      map,
      strokeColor: corridor.color,
      strokeWeight: 10,
      strokeOpacity: 0.12,
      icons: [],
    });
    corridorLines.push(glow);

    // Main line (dashed)
    const line = new google.maps.Polyline({
      path,
      map,
      strokeColor: corridor.color,
      strokeWeight: 2.5,
      strokeOpacity: 0,
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 0.85,
          strokeWeight: 2.5,
          scale: 4,
        },
        offset: '0',
        repeat: '16px',
      }],
    });
    corridorLines.push(line);
  });
}

// ── DIRECTIONS API (safe route request) ──
function requestDirections(from, to) {
  if (!directionsService) return;

  const request = {
    origin: from,
    destination: to,
    travelMode: google.maps.TravelMode.DRIVING,
    avoidHighways: false,
    avoidTolls: false,
    region: 'UA',
  };

  directionsRenderer.setOptions({
    polylineOptions: {
      strokeColor: '#10B981',
      strokeWeight: 5,
      strokeOpacity: 0.9,
    },
  });

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      const leg = result.routes[0].legs[0];
      showRouteInfo(leg.distance.text, leg.duration.text);
    } else {
      console.warn('[SafePath] Directions failed:', status);
      alert('Could not calculate route. Please check the locations and try again.');
    }
  });
}

function showRouteInfo(distance, duration) {
  const info = document.getElementById('routeInfo');
  if (info) {
    info.textContent = `Route: ${distance} · Est. time: ${duration}`;
    info.style.display = 'block';
  }
}

// ── MAP CONTROLS ──
function resetMapView() {
  map.setCenter(UKRAINE_CENTER);
  map.setZoom(UKRAINE_ZOOM);
}

function toggleHeatmap() {
  heatmapVisible = !heatmapVisible;
  circles.forEach(c => c.setMap(heatmapVisible ? map : null));
}

function toggleRoutes() {
  routesVisible = !routesVisible;
  corridorLines.forEach(l => l.setMap(routesVisible ? map : null));
}

// ── CITY TOOLTIP ──
function showCityTooltip(city) {
  document.getElementById('ct-name').textContent = city.name;
  document.getElementById('ct-score').textContent = city.risk + ' / 100';
  document.getElementById('ct-routes').textContent = city.routes + ' open';
  document.getElementById('ct-displaced').textContent = city.displaced;

  const badge = document.getElementById('ct-badge');
  badge.textContent = city.label;
  badge.className = 'ct-badge zbadge ' + labelToClass(city.label);

  document.getElementById('cityTooltip').classList.remove('hidden');

  // Set prefill for ride panel
  document.getElementById('ride-from').value = city.name;
  document.getElementById('fromLocation').value = city.name;
}

function labelToClass(label) {
  if (label === 'Safe' || label === 'Low risk') return 'safe';
  if (label === 'Moderate') return 'moderate';
  if (label === 'High risk') return 'danger';
  return 'critical';
}

// ── TICKER ──
function startUpdateTicker() {
  let seconds = 0;
  setInterval(() => {
    seconds++;
    const el = document.getElementById('lastUpdate');
    if (!el) return;
    if (seconds < 60) el.textContent = seconds + 's ago';
    else if (seconds < 3600) el.textContent = Math.floor(seconds / 60) + 'm ago';
    else { seconds = 0; el.textContent = 'just now'; }
  }, 1000);
}
