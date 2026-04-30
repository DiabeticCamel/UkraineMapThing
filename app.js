// ============================================
// SafePath Ukraine — App Entry Point
// ============================================

// Polyfill: initMap is called by the Google Maps script tag callback
// It's defined in map.js. This file wires up any remaining global init.

document.addEventListener('DOMContentLoaded', () => {

  // Route info bar (injected dynamically when a route is calculated)
  const routeBar = document.createElement('div');
  routeBar.id = 'routeInfo';
  routeBar.style.cssText = `
    display: none;
    position: fixed;
    bottom: 16px;
    left: calc(260px + 16px);
    background: #1c2330;
    border: 1px solid rgba(16,185,129,0.4);
    border-radius: 8px;
    padding: 8px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #34d399;
    z-index: 50;
  `;
  document.body.appendChild(routeBar);

  // Simulate live alert rotation
  const alerts = [
    'Increased shelling reported near Zaporizhzhia corridor — avoid E105 highway. Route recalculated.',
    'Safe corridor Kyiv → Lviv via M06 confirmed open. Estimated travel: 6h.',
    'Train service Kyiv–Lviv operating with delays. Platform 3. Check Ukrzaliznytsia app.',
    'UNHCR checkpoint open at Shehyni border crossing (Poland). No queue reported.',
  ];
  let alertIdx = 0;
  const alertBar = document.getElementById('alertBar');

  setInterval(() => {
    if (!alertBar || alertBar.style.display === 'none') return;
    alertIdx = (alertIdx + 1) % alerts.length;
    const textNode = alertBar.childNodes[2];
    if (textNode) textNode.textContent = alerts[alertIdx];
  }, 12000);

  console.log('[SafePath] App initialized. Waiting for Google Maps...');
});
