/* Neta — procedural SVG illustrations (map, faces, event art, scene backdrops). Flat 2D with soft shading. */
window.ART = (() => {
  const supCol = (p) => { // 0..100 support -> red..cream..green
    const t = Math.max(0, Math.min(1, p / 100));
    const a = t < .5 ? [200, 71, 58] : [233, 210, 122], b = t < .5 ? [233, 210, 122] : [47, 191, 113];
    const k = t < .5 ? t * 2 : (t - .5) * 2;
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
  };
  const house = (x, y, s = 1, roof = '#b5482f') =>
    `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-9" y="-6" width="18" height="12" rx="1" fill="#f3e2c0"/><path d="M-11 -5 0 -14 11 -5z" fill="${roof}"/><rect x="-2.5" y="0" width="5" height="6" fill="#6b4a2b"/><rect x="-7" y="-3" width="3" height="3" fill="#6b9bd1"/></g>`;
  const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-1.5" y="0" width="3" height="8" fill="#6b4a2b"/><circle cx="0" cy="-3" r="8" fill="#3f8f3a"/><circle cx="-3" cy="-6" r="4" fill="#58a84d"/></g>`;

  function map(state) {
    const T = DATA.TOLAS, sup = state.jan;
    const blob = { // organic tola shapes on a 400x420 board
      purab: 'M30 40 Q120 10 190 50 Q205 120 170 175 Q90 195 40 160 Q10 100 30 40z',
      pashchim: 'M215 45 Q300 15 375 50 Q392 120 360 170 Q280 190 225 160 Q200 100 215 45z',
      bazaar: 'M130 200 Q210 180 290 205 Q305 255 280 300 Q205 320 140 295 Q115 250 130 200z',
      kisan: 'M20 255 Q80 225 125 260 Q145 330 120 395 Q60 410 20 385 Q5 320 20 255z',
    };
    const houses = {
      purab: [[70, 80], [110, 70], [150, 95], [90, 125], [135, 140]],
      pashchim: [[260, 75], [305, 65], [340, 100], [280, 125], [325, 140]],
      bazaar: [[175, 235], [210, 228], [245, 240], [195, 270], [235, 275]],
      kisan: [[50, 290], [90, 300], [60, 345], [95, 365]],
    };
    let s = `<svg class="map" viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="field" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="14" height="14" fill="#9cc35f"/><rect width="7" height="14" fill="#8fb854"/></pattern>
      <filter id="sh"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".35"/></filter></defs>
      <rect width="400" height="420" fill="#86b25a"/>
      <rect x="160" y="320" width="240" height="100" fill="url(#field)"/><rect x="300" y="200" width="100" height="120" fill="url(#field)"/>
      <path d="M0 200 Q100 190 200 210 T400 190" stroke="#d9bf8a" stroke-width="16" fill="none"/>
      <path d="M200 0 Q195 120 210 210 T220 420" stroke="#d9bf8a" stroke-width="14" fill="none"/>
      <path d="M0 200 Q100 190 200 210 T400 190" stroke="#c8a96c" stroke-width="2" stroke-dasharray="6 8" fill="none"/>
      <path d="M330 330 Q370 360 400 350 L400 420 L300 420 Q310 370 330 330z" fill="#5fa8d8" opacity=".9"/>`;
    T.forEach(t => {
      const p = sup[t.id] ?? 0;
      s += `<path class="tola" data-tola="${t.id}" d="${blob[t.id]}" fill="${supCol(p)}" fill-opacity=".55" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 4" filter="url(#sh)"/>`;
      s += houses[t.id].map(([x, y], i) => house(x, y, 1.15, i % 2 ? '#b5482f' : '#8a5a3a')).join('');
    });
    s += tree(25, 215, 1.2) + tree(380, 260, 1.1) + tree(150, 380, 1.3) + tree(260, 380, 1) + tree(195, 160, 1.4) + tree(370, 20, 1);
    // landmarks: school, chaupal neem, temple & mosque, pump
    s += `<g transform="translate(300 245)" filter="url(#sh)"><rect x="-26" y="-14" width="52" height="28" rx="2" fill="#f7d774"/><path d="M-30 -14 0 -30 30 -14z" fill="#c0392b"/><rect x="-5" y="0" width="10" height="14" fill="#6b4a2b"/><rect x="-6" y="-38" width="1.5" height="12" fill="#333"/><path d="M-4.5 -38h10l-2 3 2 3h-10z" fill="#ff7a1a"/></g>
      <g transform="translate(205 180)"><circle r="20" fill="#3f8f3a"/><circle cx="-7" cy="-6" r="10" fill="#58a84d"/><rect x="-14" y="16" width="28" height="5" rx="2" fill="#a07850"/></g>
      <g transform="translate(160 335)" filter="url(#sh)"><rect x="-10" y="-8" width="20" height="16" fill="#fff3d6"/><path d="M-12 -8 0 -26 12 -8z" fill="#ff8a1f"/></g>
      <g transform="translate(250 345)" filter="url(#sh)"><rect x="-12" y="-6" width="24" height="14" fill="#f1f1ea"/><path d="M-10 -6a10 10 0 0 1 20 0z" fill="#2fae7a"/><rect x="13" y="-18" width="3" height="26" fill="#f1f1ea"/></g>`;
    s += `</svg>`;
    return s;
  }

  // Caricature portrait
  function face(p, size = 60) {
    const skin = p.skin || '#c68a5a', hair = p.hair || '#222', col = p.col || '#ff8a1f';
    return `<svg viewBox="0 0 60 60" width="${size}" height="${size}"><rect width="60" height="60" fill="${col}" opacity=".35"/>
      <circle cx="30" cy="70" r="28" fill="${col}"/><path d="M22 46 30 54 38 46" fill="#fff" opacity=".8"/>
      <rect x="25" y="36" width="10" height="10" fill="${skin}"/>
      <ellipse cx="30" cy="28" rx="13" ry="15" fill="${skin}"/>
      ${p.f ? `<path d="M15 30 Q14 10 30 11 Q46 10 45 30 Q44 20 30 17 Q16 20 15 30z" fill="${hair}"/><circle cx="30" cy="20" r="1.6" fill="#c0392b"/>`
            : `<path d="M17 24 Q18 11 30 12 Q42 11 43 24 Q38 17 30 18 Q22 17 17 24z" fill="${hair}"/>`}
      <circle cx="25" cy="28" r="1.8" fill="#222"/><circle cx="35" cy="28" r="1.8" fill="#222"/>
      ${p.id === 'bunty' ? '<path d="M23 25l4 1.5M37 25l-4 1.5" stroke="#222" stroke-width="1.6"/><path d="M24 35q6-2 12 0" stroke="#222" stroke-width="1.6" fill="none"/><path d="M23 33q7 3 14 0" stroke="#222" stroke-width="2.4" fill="none"/>'
        : '<path d="M25 35q5 4 10 0" stroke="#7a3b2a" stroke-width="1.6" fill="none"/>'}
      ${p.id === 'master' ? '<circle cx="25" cy="28" r="4" fill="none" stroke="#222" stroke-width="1.2"/><circle cx="35" cy="28" r="4" fill="none" stroke="#222" stroke-width="1.2"/><path d="M29 28h2" stroke="#222"/>' : ''}
      ${p.id === 'player' ? `<path d="M15 47 Q30 58 45 47" stroke="#ffb627" stroke-width="4" fill="none" stroke-dasharray="3 2"/>` : ''}
    </svg>`;
  }

  // Event card header art: illustrated scene by theme
  const SCENES = {
    gossip: ['#f2b25c', '#d9773a', 'chat'], poach: ['#7d5ad6', '#3d2a85', 'phone'], kaki: ['#e88bb0', '#a5406b', 'heart'],
    school: ['#7ec4f0', '#2a7de1', 'school'], rain: ['#6d8fb3', '#2c4a6e', 'rain'], party: ['#ffb05c', '#e26a12', 'flag'],
    family: ['#d68a5a', '#7a3b2a', 'users'], viral: ['#ff6b8a', '#7a1030', 'tv'], money: ['#6f6f6f', '#1f1f1f', 'coins'],
    festival: ['#ff7ac0', '#ffb627', 'flower'], election: ['#ffd66b', '#ff7a1a', 'ballot'],
  };
  function eventArt(key) {
    const [a, b, icon] = SCENES[key] || SCENES.gossip;
    const rays = Array.from({ length: 12 }, (_, i) => `<path d="M200 170 L${200 + 400 * Math.cos(i * Math.PI / 6)} ${170 + 400 * Math.sin(i * Math.PI / 6)} L${200 + 400 * Math.cos(i * Math.PI / 6 + .2)} ${170 + 400 * Math.sin(i * Math.PI / 6 + .2)}z" fill="#fff" opacity=".07"/>`).join('');
    return `<svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="eg${key}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect width="400" height="150" fill="url(#eg${key})"/>${rays}
      ${house(40, 130, 2.4, '#00000033')}${house(330, 128, 2.8, '#00000033')}${tree(90, 120, 2)}${tree(290, 118, 1.6)}
      <rect y="132" width="400" height="18" fill="#00000030"/>
      <circle cx="200" cy="72" r="46" fill="#fff" opacity=".18"/><circle cx="200" cy="72" r="34" fill="#fff" opacity=".9"/>
      <g transform="translate(176 48) scale(2)" color="${b}"><use href="#i-${icon}" width="24" height="24"/></g></svg>`;
  }

  function cmScene(step) { // prologue backdrop: CM office at night
    return `<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="lamp" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#5a3a1a"/><stop offset="1" stop-color="#0b0610"/></radialGradient></defs>
      <rect width="400" height="600" fill="url(#lamp)"/>
      <rect x="40" y="60" width="140" height="190" rx="4" fill="#0e1a33"/><rect x="40" y="60" width="140" height="190" rx="4" fill="none" stroke="#6b4a2b" stroke-width="8"/>
      ${Array.from({ length: 20 }, (_, i) => `<circle cx="${55 + (i * 37) % 120}" cy="${80 + (i * 53) % 160}" r="1.3" fill="#ffe9b8" opacity=".7"/>`).join('')}
      <rect x="230" y="70" width="120" height="150" rx="6" fill="#111"/><rect x="236" y="76" width="108" height="100" fill="${step === 0 ? '#c0392b' : '#1d2a4a'}" opacity=".85"/>
      <text x="290" y="132" text-anchor="middle" fill="#fff" font-family="Baloo 2,sans-serif" font-weight="800" font-size="16">${step === 0 ? 'BREAKING' : 'FLOOR TEST'}</text>
      <rect x="0" y="400" width="400" height="200" fill="#2a1608"/><rect x="0" y="400" width="400" height="14" fill="#4a2a10"/>
      <rect x="60" y="370" width="60" height="34" rx="4" fill="#222"/><rect x="70" y="378" width="40" height="18" fill="#ffb627" opacity=".7"/>
      <g transform="translate(270 300)"><ellipse cx="0" cy="110" rx="70" ry="20" fill="#000" opacity=".4"/><path d="M-60 110 Q-55 20 0 15 Q55 20 60 110z" fill="#f5f0e6"/><path d="M-60 110 Q-55 40 -20 30 L-25 110z" fill="#ff8a1f"/>
      <ellipse cx="0" cy="-15" rx="28" ry="32" fill="#c08458"/><path d="M-28 -20 Q-26 -50 0 -50 Q26 -50 28 -20 Q20 -38 0 -38 Q-20 -38 -28 -20z" fill="#bbb"/>
      <path d="M-10 4 Q0 10 10 4" stroke="#5a2a1a" stroke-width="2.5" fill="none"/><circle cx="-10" cy="-14" r="3" fill="#222"/><circle cx="10" cy="-14" r="3" fill="#222"/></g>
      <g transform="translate(140 390) rotate(-10)"><rect x="-14" y="-24" width="28" height="48" rx="5" fill="#111"/><rect x="-11" y="-19" width="22" height="34" fill="#4aa8ff" opacity="${step % 2 ? 1 : .5}"/></g>
    </svg>`;
  }

  function village() { // character-creation & stage backdrop
    return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a52"/><stop offset=".6" stop-color="#ffd38a"/><stop offset="1" stop-color="#fff0c8"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#sky)"/><circle cx="300" cy="120" r="40" fill="#fff4cc"/>
      <path d="M0 200 Q100 160 200 190 T400 175 V300 H0z" fill="#9cc35f"/><path d="M0 230 Q120 210 230 235 T400 225 V300 H0z" fill="#7aa848"/>
      ${house(60, 215, 2)}${house(120, 222, 1.6, '#8a5a3a')}${house(320, 210, 2.2)}${tree(190, 205, 2.4)}${tree(250, 214, 1.6)}
      <g transform="translate(360 190)"><rect x="-1" y="-30" width="2" height="30" fill="#555"/><path d="M1 -30h14l-3 4 3 4H1z" fill="#ff7a1a"/></g>
    </svg>`;
  }

  return { map, face, eventArt, cmScene, village, supCol };
})();
