// ============================================
// SafePath Ukraine — UI Logic
// ============================================

let selectedVehicle = 'car';
let currentLang = 'en';

// ── TAB SWITCHING ──
function switchTab(tabName, el) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.remove('hidden');
  if (el) el.classList.add('active');
}

// ── POPULATE ZONE LIST ──
function populateZoneList() {
  const list = document.getElementById('zoneList');
  if (!list) return;

  // Show a curated subset in sidebar
  const featured = CITIES.filter(c =>
    ['Kyiv','Lviv','Kharkiv','Zaporizhzhia','Odesa','Dnipro','Kherson'].includes(c.name)
  );

  list.innerHTML = featured.map(city => `
    <div class="zone-card" onclick="focusCity('${city.name}', ${city.lat}, ${city.lng})">
      <div class="zone-card-top">
        <span class="zone-name">${city.name}</span>
        <span class="zbadge ${labelToClass(city.label)}">${city.label}</span>
      </div>
      <div class="zone-meta">Risk: ${city.risk}/100 · ${city.routes} open route${city.routes !== 1 ? 's' : ''}</div>
      <button class="zone-btn" onclick="event.stopPropagation(); zoneAction('${city.name}', '${city.label}')">
        ${city.label === 'Safe' || city.label === 'Low risk' ? 'Set as destination →' : 'View evacuation routes →'}
      </button>
    </div>
  `).join('');
}

// ── POPULATE TRANSPORT LIST ──
function populateTransportList() {
  const list = document.getElementById('transportList');
  if (!list) return;

  list.innerHTML = TRANSPORT_OPTIONS.map(t => `
    <div class="tcard">
      <div class="tcard-top">
        <span class="tcard-name">${t.icon} ${t.name}</span>
        <span class="zbadge ${t.status}">${t.avail}</span>
      </div>
      <div class="tcard-meta">${t.meta}</div>
    </div>
  `).join('');
}

// ── POPULATE TRANSPORT TYPE GRID ──
function populateTransportTypeGrid() {
  const grid = document.getElementById('transportTypeGrid');
  if (!grid) return;

  const types = [
    { id: 'car',     icon: '🚗', label: 'Car' },
    { id: 'bus',     icon: '🚌', label: 'Bus' },
    { id: 'medical', icon: '🚑', label: 'Medical' },
    { id: 'train',   icon: '🚂', label: 'Train' },
  ];

  grid.innerHTML = types.map((t, i) => `
    <div class="ttype-card ${i === 0 ? 'selected' : ''}" onclick="selectTransportType(this, '${t.id}')">
      <div class="ttype-icon">${t.icon}</div>
      <div class="ttype-label">${t.label}</div>
    </div>
  `).join('');
}

// ── POPULATE SOURCES LIST ──
function populateSourcesList() {
  const list = document.getElementById('sourcesList');
  if (!list) return;

  list.innerHTML = DATA_SOURCES.map(s => `
    <div class="src-item">
      <span class="src-dot" style="background:${s.color};"></span>
      ${s.name}
      <span class="src-status" style="color:${s.color};">${s.status}</span>
    </div>
  `).join('');
}

// ── ZONE ACTIONS ──
function focusCity(name, lat, lng) {
  if (!map) return;
  map.panTo({ lat, lng });
  map.setZoom(9);
  const city = CITIES.find(c => c.name === name);
  if (city) showCityTooltip(city);
}

function zoneAction(name, label) {
  if (label === 'Safe' || label === 'Low risk') {
    document.getElementById('toLocation').value = name;
    document.getElementById('ride-to').value = name;
  } else {
    document.getElementById('fromLocation').value = name;
    document.getElementById('ride-from').value = name;
  }
  switchTab('transport', document.querySelector('[data-tab="transport"]'));
}

// ── FIND SAFE ROUTE (sidebar form) ──
function findSafeRoute() {
  const from = document.getElementById('fromLocation').value.trim();
  const to = document.getElementById('toLocation').value.trim();
  if (!from || !to) {
    alert('Please enter both a pickup location and a destination.');
    return;
  }
  requestDirections(from + ', Ukraine', to + ', Ukraine');
  document.getElementById('cityTooltip').classList.add('hidden');
}

// ── VEHICLE SELECTION ──
function selectVehicle(el, type) {
  document.querySelectorAll('.vcard').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedVehicle = type;
}

function selectTransportType(el, type) {
  document.querySelectorAll('.ttype-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedVehicle = type;
}

// ── CONFIRM RIDE ──
function confirmRide() {
  const from = document.getElementById('ride-from').value.trim();
  const to   = document.getElementById('ride-to').value.trim();

  if (!from || !to) {
    alert('Please enter your pickup and destination.');
    return;
  }

  if (map && directionsService) {
    requestDirections(from + ', Ukraine', to);
  }

  document.getElementById('ridePanel').classList.add('hidden');
  showConfirmationToast(`Transport requested: ${from} → ${to}. A driver will contact you shortly.`);
}

// ── TOAST ──
function showConfirmationToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 1000;
      background: #10B981; color: white; border-radius: 8px;
      padding: 12px 18px; font-family: 'IBM Plex Mono', monospace;
      font-size: 12px; max-width: 320px; line-height: 1.5;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      animation: slideInRight 0.2s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { if (toast) toast.style.display = 'none'; }, 5000);
}

// ── REQUEST RIDE (from tooltip) ──
function requestRide() {
  document.getElementById('cityTooltip').classList.add('hidden');
  document.getElementById('ridePanel').classList.remove('hidden');
}

// ── SEARCH ──
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const q = searchInput.value.trim();
    if (!q) return;

    // Match against cities
    const city = CITIES.find(c => c.name.toLowerCase().includes(q.toLowerCase()));
    if (city) {
      focusCity(city.name, city.lat, city.lng);
      searchInput.value = '';
    } else {
      // Fallback: geocode via Places if available
      if (window.google && google.maps.places) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: q + ', Ukraine' }, (results, status) => {
          if (status === 'OK' && results[0]) {
            map.panTo(results[0].geometry.location);
            map.setZoom(9);
          }
        });
      }
    }
  });
});

// ── LANGUAGE TOGGLE (stub) ──
function toggleLang() {
  currentLang = currentLang === 'en' ? 'ua' : 'en';
  showConfirmationToast(currentLang === 'ua' ? 'Мова: Українська (демо)' : 'Language: English (demo)');
}
