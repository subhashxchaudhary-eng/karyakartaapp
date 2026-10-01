/* Neta — screens & UI flow. Vanilla JS, one screen mounted at a time inside #app. */
(() => {
  const app = document.getElementById('app');
  const $ = (s, r = app) => r.querySelector(s);
  const $$ = (s, r = app) => [...r.querySelectorAll(s)];
  const fmt = (n) => '₹' + (Math.abs(n) >= 100000 ? (n / 100000).toFixed(1) + 'L' : Math.round(n).toLocaleString('en-IN'));
  const sgn = (n) => (n > 0 ? '+' : '') + (Number.isInteger(n) ? n : n.toFixed(0));
  let tab = 'kshetra';

  // ---------- core helpers ----------
  function mount(html, cls = '') {
    const old = $$('.screen'); old.forEach(o => { o.classList.add('out'); setTimeout(() => o.remove(), 200); });
    const el = document.createElement('div'); el.className = 'screen ' + cls; el.innerHTML = html; app.appendChild(el);
    return el;
  }
  function on(el, sel, ev, fn) { el.querySelectorAll(sel).forEach(n => n.addEventListener(ev, (e) => fn(e, n))); }
  function toast(msg, icon = 'info') {
    let box = $('.toasts'); if (!box) { box = document.createElement('div'); box.className = 'toasts'; app.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = ic(icon, 'sm') + msg; box.appendChild(t);
    setTimeout(() => t.remove(), 2700);
  }
  function floater(text, x, y, color = '#ffb627') {
    const f = document.createElement('div'); f.className = 'floater'; f.textContent = text; f.style.cssText = `left:${x}px;top:${y}px;color:${color}`;
    app.appendChild(f); setTimeout(() => f.remove(), 1300);
  }
  function confetti(n = 70) {
    const c = document.createElement('div'); c.className = 'confetti';
    const cols = ['#ffb627', '#ff7a1a', '#ff5fa2', '#2ecc71', '#fff3b0', '#e8283c'];
    c.innerHTML = Array.from({ length: n }, () => `<i style="left:${Math.random() * 100}%;background:${cols[Math.random() * 6 | 0]};animation-duration:${1.8 + Math.random() * 2}s;animation-delay:${Math.random() * .6}s;transform:scale(${.6 + Math.random()})"></i>`).join('');
    app.appendChild(c); setTimeout(() => c.remove(), 4500);
  }
  function overlay(html, cls = 'ev-back') {
    const o = document.createElement('div'); o.className = cls; o.innerHTML = html; app.appendChild(o); return o;
  }
  const fxChips = (fx) => {
    if (!fx) return '';
    const out = [];
    const P = (v, label, icon, good = v > 0) => out.push(`<span class="fxp ${good ? 'pos' : 'neg'}">${ic(icon)}${label} ${sgn(v)}</span>`);
    if (fx.janAll) P(fx.janAll, 'Samarthan', 'users');
    if (fx.jan) Object.entries(fx.jan).forEach(([t, v]) => P(v, G.tolaName(t), 'map'));
    if (fx.paisa) P(fx.paisa / 1000, '₹k', 'rupee');
    if (fx.kaala) out.push(`<span class="fxp risk">${ic('coins')}Kaala ₹${fx.kaala}</span>`);
    if (fx.josh) P(fx.josh, 'Josh', 'fist');
    if (fx.members) P(fx.members, 'Sadasya', 'users');
    if (fx.vishwas) P(fx.vishwas, 'Vishwas', 'flag');
    ['vikas', 'sevak', 'dabang', 'imaan'].forEach(k => fx[k] && P(fx[k], G.CHHAVI_NAME[k], 'star'));
    if (fx.samay) out.push(`<span class="fxp neu">${ic('clock')}${fx.samay} Samay</span>`);
    if (fx.heat) out.push(`<span class="fxp risk">${ic('thermo')}Jokhim</span>`);
    if (fx.grudge) out.push(`<span class="fxp neu">${ic('eye')}Bunty yaad rakhega</span>`);
    if (fx.solve) out.push(`<span class="fxp pos">${ic('check')}Samasya hal</span>`);
    if (fx.seed) out.push(`<span class="fxp risk">${ic('alert')}Baad mein asar?</span>`);
    return out.join('');
  };

  // global tap sound
  app.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) G.sfx.tap(); });

  // ================= SPLASH =================
  function splash() {
    const has = G.load();
    const el = mount(`<div class="sunburst"></div>
      <div class="logo">
        <div class="garland">${Array(7).fill(ic('flower')).join('')}</div>
        <div class="neta">NETA</div>
        <div class="tag">Booth se PM Tak</div>
        <div class="muted small mt16">Ek booth se poore Bharat tak</div>
      </div>
      <div class="splash-art">${ART.village()}</div>
      <div class="col" style="width:100%;position:relative">
        <div class="loadbar"><div class="bar"><i style="width:0%"></i></div><div class="tiny muted mt8" id="ld">Matdata suchi load ho rahi hai...</div></div>
        <div class="col" id="cta" style="opacity:0;transition:opacity .4s">
          ${has ? `<button class="btn green block pulse" id="cont">${ic('play')} Jaari Rakho</button>` : ''}
          <button class="btn block ${has ? 'ghost' : 'pulse'}" id="new">${ic('flag')} Naya Safar</button>
          <div class="row" style="justify-content:center;gap:14px;margin-top:6px">
            <button class="iconbtn" id="set" aria-label="Settings">${ic('settings')}</button>
          </div>
        </div>
      </div>`, 'splash');
    const bar = $('.bar i', el), ld = $('#ld', el), msgs = ['Matdata suchi load ho rahi hai...', 'Maala pirokar taiyaar...', 'Chaupal saja di gayi...'];
    let p = 0; const iv = setInterval(() => {
      p += 7 + Math.random() * 12; bar.style.width = Math.min(100, p) + '%'; ld.textContent = msgs[Math.min(2, p / 35 | 0)];
      if (p >= 100) { clearInterval(iv); $('.loadbar', el).style.display = 'none'; $('#cta', el).style.opacity = 1; }
    }, 110);
    on(el, '#new', 'click', () => { if (has && !confirm('Purana safar mit jaayega. Naya shuru karein?')) return; G.wipe(); G.sfx.whoosh(); prologue(); });
    on(el, '#cont', 'click', () => { G.sfx.dhol(); home(); });
    on(el, '#set', 'click', settingsSheet);
  }

  // ================= PROLOGUE: "25 saal baad" =================
  function prologue(step = 0) {
    const sc = DATA.PROLOGUE[step];
    const el = mount(`<div class="tvbar"><span class="live">LIVE</span>SANSANI TV · RAJYA MEIN SANKAT<span class="grow"></span><button id="skip" class="tiny" style="opacity:.8">SKIP ${ic('fastfwd', 'sm')}</button></div>
      <div class="cine-stage" id="stage"><div class="bgart">${ART.cmScene(step)}</div><div class="clock">${sc.time}</div>
        <div class="dialog"><div class="who">${ic(sc.icon, 'sm')} ${sc.who}</div><div class="say" id="say"></div><div id="ch" class="col mt12"></div></div></div>`, 'cine');
    G.sfx[step === 0 ? 'sting' : 'tick']();
    typeText($('#say', el), sc.say, () => {
      const ch = $('#ch', el);
      if (sc.choices) {
        ch.innerHTML = sc.choices.map((c, i) => `<button class="btn ghost sm block" data-i="${i}" style="justify-content:flex-start;text-align:left;min-height:46px">${ic(['phone', 'briefcase', 'tv'][i] || 'mic', 'sm')} ${c.t}</button>`).join('');
        on(ch, 'button', 'click', (e, b) => {
          const c = sc.choices[b.dataset.i];
          ch.innerHTML = `<div class="small" style="color:#ffe9b8">${c.r}</div>${c.heat ? `<div class="chip red mt8">${ic('thermo', 'sm')} Heat badhi... ye thermometer yaad rakhna</div>` : ''}<button class="btn sm mt12" id="nx">Aage ${ic('chevR', 'sm')}</button>`;
          if (c.heat) G.sfx.sting();
          on(ch, '#nx', 'click', () => prologue(step + 1));
        });
      } else if (step < DATA.PROLOGUE.length - 1) {
        ch.innerHTML = `<button class="btn sm" id="nx">Aage ${ic('chevR', 'sm')}</button>`; on(ch, '#nx', 'click', () => prologue(step + 1));
      } else {
        setTimeout(() => cut(el), 900);
      }
    });
    on(el, '#skip', 'click', () => create());
  }
  function cut(el) {
    $('#stage', el).classList.add('sepia'); G.sfx.whoosh();
    setTimeout(() => {
      const t = document.createElement('div'); t.className = 'titlecard'; t.innerHTML = `<div><div class="tc">25 saal pehle...</div><div class="muted center mt12 small">Ek gaon. Ek mohalla. Teen dost.</div></div>`;
      el.appendChild(t); G.sfx.dhol();
      setTimeout(create, 2600);
    }, 2000);
  }
  function typeText(node, text, done) {
    let i = 0; const iv = setInterval(() => { node.textContent = text.slice(0, ++i); if (i % 3 === 0) G.sfx.tick(); if (i >= text.length) { clearInterval(iv); done && done(); } }, 22);
    node.parentElement.addEventListener('click', () => { if (i < text.length) { i = text.length - 1; } }, { once: true });
  }

  // ================= CHARACTER CREATION =================
  const draft = { name: '', gender: 'm', bg: 'kisan', state: 'HR' };
  function create(step = 0) {
    const steps = `<div class="steps">${[0, 1, 2, 3].map(i => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>`;
    let body = '';
    if (step === 0) body = `
      <div class="eyebrow">Kadam 1 / 4</div><h1 class="h1 mt8">Aapka naam, <span class="gold-text">Neta ji?</span></h1>
      <div class="paper mt16" style="height:150px;overflow:hidden;border-radius:18px">${ART.village()}</div>
      <input class="field mt16" id="nm" maxlength="18" placeholder="Jaise: Rakesh Kumar" value="${draft.name}" autocomplete="off">
      <div class="seg mt12"><button data-g="m" class="${draft.gender === 'm' ? 'on' : ''}">${ic('user', 'sm')} Purush</button><button data-g="f" class="${draft.gender === 'f' ? 'on' : ''}">${ic('user', 'sm')} Mahila</button></div>
      ${draft.gender === 'f' ? `<div class="tip mt12">${ic('star')}<div>Mahila aarakshit seaton pe chunav lad sakti hain. Kuch anokhe events bhi milenge.</div></div>` : ''}`;
    if (step === 1) body = `
      <div class="eyebrow">Kadam 2 / 4</div><h1 class="h1 mt8">Aapki <span class="gold-text">pehchaan</span></h1>
      <div class="muted small mt8">Background shuruaati taakat deta hai, aur ek kamzori jis pe rival hamla karenge.</div>
      <div class="opt-grid mt16">${DATA.BACKGROUNDS.map(b => `<button class="opt ${draft.bg === b.id ? 'on' : ''}" data-bg="${b.id}">
        <div class="oi">${ic(b.icon, 'lg')}</div><div class="on2">${b.name}</div>
        <div class="plus">${ic('up', 'sm')}${b.plus}</div><div class="minus">${ic('down', 'sm')}${b.minus}</div></button>`).join('')}</div>`;
    if (step === 2) body = `
      <div class="eyebrow">Kadam 3 / 4</div><h1 class="h1 mt8">Gruh <span class="gold-text">Rajya</span></h1>
      <div class="muted small mt8">Rajya map, seaton ki sankhya aur rajneeti tay karta hai.</div>
      <div class="col mt16">${DATA.STATES.map(s => `<button class="opt ${draft.state === s.id ? 'on' : ''}" data-st="${s.id}" style="flex-direction:row;align-items:center;gap:12px">
        <div class="oi">${ic('map', 'lg')}</div><div class="grow"><div class="on2">${s.name}</div><div class="tiny muted">${s.seats} vidhan sabha seat · ${s.tag}</div></div>
        <span class="chip ${s.diff === 'Aasaan' ? 'green' : s.diff === 'Kathin' ? 'red' : 'gold'}">${s.diff}</span></button>`).join('')}</div>`;
    if (step === 3) {
      const b = DATA.BACKGROUNDS.find(x => x.id === draft.bg), s = DATA.STATES.find(x => x.id === draft.state);
      body = `<div class="eyebrow">Kadam 4 / 4</div><h1 class="h1 mt8">Safar <span class="gold-text">shuru</span></h1>
        <div class="panel mt16 center"><div class="portrait">${ART.face({ id: 'player', col: '#ffb627', f: draft.gender === 'f', skin: '#c68a5a', hair: '#1a1a1a' }, 120)}</div>
          <div class="h2 mt8">${draft.name}</div><div class="muted small">Karyakarta · ${s.name} · Umar 21</div>
          <div class="row mt12" style="justify-content:center;flex-wrap:wrap"><span class="chip gold">${ic(b.icon, 'sm')}${b.name}</span><span class="chip">${ic('users', 'sm')}3 dost</span><span class="chip">${ic('rupee', 'sm')}${fmt(b.start.paisa)}</span></div></div>
        <div class="tip mt12">${ic('target')}<div><b>Pehla lakshya:</b> Yuva Mandal banao aur pehle 10 minute mein School Committee chunav jeeto.</div></div>`;
    }
    const el = mount(`<div class="scroll">${steps}<div class="mt16">${body}</div></div>
      <div class="foot row">${step ? `<button class="btn ghost" id="bk" style="flex:none;width:58px;padding:0">${ic('chevL')}</button>` : ''}
      <button class="btn block ${step === 3 ? 'green' : ''}" id="nx">${step === 3 ? ic('flag') + ' Mohalla chalo' : 'Aage ' + ic('chevR')}</button></div>`);
    const nm = $('#nm', el); if (nm) { nm.addEventListener('input', () => draft.name = nm.value.trim()); }
    on(el, '[data-g]', 'click', (e, b) => { draft.gender = b.dataset.g; create(0); });
    on(el, '[data-bg]', 'click', (e, b) => { draft.bg = b.dataset.bg; $$('[data-bg]', el).forEach(x => x.classList.toggle('on', x === b)); G.sfx.card(); });
    on(el, '[data-st]', 'click', (e, b) => { draft.state = b.dataset.st; $$('[data-st]', el).forEach(x => x.classList.toggle('on', x === b)); G.sfx.card(); });
    on(el, '#bk', 'click', () => create(step - 1));
    on(el, '#nx', 'click', () => {
      if (step === 0 && draft.name.length < 2) { toast('Naam likhiye (kam se kam 2 akshar)', 'alert'); nm.focus(); return; }
      if (step < 3) return create(step + 1);
      G.newGame(draft); G.sfx.dhol(); home(); setTimeout(() => intro(), 450);
    });
  }
  function intro() {
    const o = overlay(`<div class="sheet"><div class="grab"></div>
      <div class="row">${'<div class="face" style="width:56px;height:56px">' + ART.face(DATA.PEOPLE.find(p => p.id === 'sitara'), 56) + '</div>'}<div><div class="eyebrow">Sitara</div><div class="h3">"Toh shuru karein, ${G.S.name}?"</div></div></div>
      <div class="small muted mt12" style="line-height:1.5">Har hafte tumhare paas <b style="color:var(--sky)">7 Samay</b> hain. Action cards slots mein daalo, hafta chalao, aur jo drama aaye usse sambhalo. Map pe har tola ka rang batata hai ki wahan log tumhare saath kitne hain.</div>
      <div class="col mt12">
        <div class="tip">${ic('target')}<div><b>Mission board</b> pe hamesha 3 lakshya rahenge: is hafte, is saal, aur bada sapna.</div></div>
        <div class="tip">${ic('thermo')}<div><b>Heat</b> kabhi number mein nahi dikhegi. Thermometer chamke to samjho koi dekh raha hai.</div></div></div>
      <button class="btn block mt16" id="ok">Chalo!</button></div>`);
    on(o, '#ok', 'click', () => o.remove());
  }

  // ================= HUD + NAV =================
  function hud() {
    const S = G.S, hl = G.heatLevel(), avg = G.avgJan();
    const ticker = S.headlines.slice(0, 4).map(h => `${h.s.toUpperCase()}: ${h.t}`).join('   ●   ');
    return `<div class="hud"><div class="hud-top">
        <div class="rank"><div class="avatar">${ic(S.rank ? 'flag' : 'user', 'lg')}<span class="lvl">${S.rank}</span></div>
          <div class="grow"><div class="rank-name">${DATA.RANKS[S.rank]}</div><div class="rank-sub">${S.name} · Jan Samarthan <b style="color:var(--gold)">${avg}%</b></div></div></div>
        <div class="res cal">${ic('calendar', 'sm')}<span>${G.dateLabel()}</span></div>
        <button class="iconbtn" id="hset" aria-label="Settings">${ic('settings')}</button></div>
      <div class="res-row">
        <div class="res money">${ic('rupee')}<span class="val">${fmt(S.paisa)}</span>${S.kaala ? `<span class="res kaala" style="border:0;background:none;padding:0;height:auto">+${fmt(S.kaala)}</span>` : ''}</div>
        <div class="res">${ic('clock', 'sm')}<div class="samay">${Array.from({ length: G.samayMax() }, (_, i) => `<i class="${i < G.samayMax() - (S.samayDebt || 0) ? '' : 'used'}"></i>`).join('')}</div></div>
        <div class="res heat h${hl}" id="heat">${ic('thermo')}<span class="tiny">${['Shaant', 'Garam', 'Tez', 'Khatra'][hl]}</span></div>
      </div>
      <div class="ticker"><b>${ic('tv', 'sm')}KHABAR</b><div class="tk"><span>${ticker}</span></div></div></div>`;
  }
  function nav() {
    const items = [['kshetra', 'map', 'Kshetra'], ['khabar', 'news', 'Khabar'], ['yojana', 'planner', 'Yojana'], ['rishte', 'handshake', 'Rishte'], ['kitab', 'book', 'Kitab']];
    return `<nav class="nav">${items.map(([id, icon, l]) => id === 'yojana'
      ? `<button class="big ${tab === id ? 'on' : ''}" data-tab="${id}"><span class="bub">${ic(icon)}</span>${l}</button>`
      : `<button class="${tab === id ? 'on' : ''}" data-tab="${id}">${ic(icon)}${l}${id === 'khabar' && G.heatLevel() ? '<span class="dot"></span>' : ''}</button>`).join('')}</nav>`;
  }
  function shell(content) {
    const el = mount(`${hud()}<div class="scroll" id="main">${content}</div>${nav()}`);
    on(el, '[data-tab]', 'click', (e, b) => { if (b.dataset.tab === 'yojana') return planner(); tab = b.dataset.tab; home(); });
    on(el, '#hset', 'click', settingsSheet);
    on(el, '#heat', 'click', () => toast(G.heatHint(), 'thermo'));
    return el;
  }

  // ================= HOME =================
  function home() {
    const S = G.S; if (!S) return splash();
    if (S.stageDone && !S.party) return stageEnd();
    if (tab === 'khabar') return khabar();
    if (tab === 'rishte') return rishte();
    if (tab === 'kitab') return kitab();
    const pins = DATA.PROBLEMS.filter(p => S.problems[p.id] < p.need).map(p => { const t = DATA.TOLAS.find(x => x.id === p.tola); return `<div class="pin" style="left:${t.x + 8}%;top:${t.y - 4}%"><div class="b">${ic(p.icon)}</div></div>`; }).join('');
    const labels = DATA.TOLAS.map(t => `<div class="tola-label" style="left:${t.x}%;top:${t.y + 5}%">${t.name}<span class="pct">${Math.round(S.jan[t.id])}%</span></div>`).join('');
    const el_ = S.election;
    const missions = S.missions.map((m, i) => {
      const lab = ['Aaj ka kaam', 'Is saal ka lakshya', 'Kaaryakaal ka sapna'][i];
      if (!m) return `<div class="mission"><div class="mi t${i}">${ic('check')}</div><div class="grow"><div class="lab">${lab}</div><div class="tx muted">Sab poora! Naya lakshya jald.</div></div></div>`;
      const p = Math.min(m.n, G.missionProgress(m));
      return `<div class="mission ${m.done ? 'done' : ''}"><div class="mi t${i}">${ic(['clock', 'target', 'star'][i])}</div><div class="grow"><div class="lab">${lab}</div><div class="tx">${m.t}</div><div class="bar ${['sky', '', 'red'][i]}"><i style="width:${p / m.n * 100}%"></i></div></div><div class="tiny muted">${p}/${m.n}</div></div>`;
    }).join('');
    const el = shell(`
      ${el_ ? `<div class="panel row" style="border-color:rgba(255,182,39,.5);background:linear-gradient(135deg,#5a2a00,#2a1240)"><div class="mi" style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:var(--gold);color:#3a1d00">${ic('ballot', 'lg')}</div>
        <div class="grow"><div class="eyebrow">Chunav ka mausam</div><div class="h3">${el_.name}</div><div class="tiny muted">Matdaan ${el_.left} hafte mein · 40 matdata · Rival: Bunty Bhaiya</div></div><div class="h1 gold-text">${el_.left}</div></div>` : ''}
      <div class="sec" style="margin-top:${el_ ? 14 : 4}px"><div class="h3">${ic('map')} Kshetra: Rampur Gaon</div><span class="chip">${ic('users', 'sm')}${S.members} sadasya</span></div>
      <div class="map-wrap" id="map">${ART.map(S)}${labels}${pins}<div class="legend">Virodh<span class="grad"></span>Samarthan</div></div>
      <div class="sec"><div class="h3">${ic('target')} Mission Board</div></div>
      <div class="missions">${missions}</div>
      <div class="sec"><div class="h3">${ic('flag')} Stage 1: Mohalla se shuruaat</div><span class="chip gold">${G.stageGoals().filter(g => g.ok).length}/6</span></div>
      <div class="panel" style="padding:6px 12px">${G.stageGoals().map(g => `<div class="swing" style="grid-template-columns:auto 1fr auto"><span style="color:${g.ok ? 'var(--green)' : 'var(--text-3)'}">${ic(g.ok ? 'check' : 'target', 'sm')}</span><span class="${g.ok ? 'muted' : ''}" style="${g.ok ? 'text-decoration:line-through' : ''}">${g.t}</span><span class="tiny muted">${g.p || ''}</span></div>`).join('')}</div>
      <div class="sec"><div class="h3">${ic('star')} Chhavi</div><span class="chip">${ic('flower', 'sm')}Maala ${S.maala}</span></div>
      <div class="statgrid">${Object.entries(S.chhavi).map(([k, v]) => `<div class="stat"><div class="k">${ic({ vikas: 'hammer', sevak: 'heart', dabang: 'fist', imaan: 'scales' }[k], 'sm')}${G.CHHAVI_NAME[k]}</div><div class="v">${Math.round(v)}</div><div class="bar"><i style="width:${v}%"></i></div></div>`).join('')}
        <div class="stat"><div class="k">${ic('fist', 'sm')}Karyakarta Josh</div><div class="v">${Math.round(S.josh)}</div><div class="bar green"><i style="width:${S.josh}%"></i></div></div>
        <div class="stat"><div class="k">${ic('flag', 'sm')}Party Vishwas</div><div class="v">${S.vishwas < 30 ? 'Kam' : S.vishwas < 50 ? 'Badh raha' : 'Mazboot'}</div><div class="bar sky"><i style="width:${S.vishwas}%"></i></div></div></div>
      <button class="btn block mt16 pulse" id="go">${ic('planner')} Hafta ${S.turn} ki Yojana</button>`);
    on(el, '.tola', 'click', (e, n) => tolaSheet(n.dataset.tola));
    on(el, '#go', 'click', () => planner());
  }
  function tolaSheet(id) {
    const S = G.S, t = DATA.TOLAS.find(x => x.id === id), pr = G.openProblem(id);
    const o = overlay(`<div class="sheet"><div class="grab"></div>
      <div class="row between"><div><div class="eyebrow">Tola</div><div class="h2">${t.name}</div></div><span class="chip">${ic('users', 'sm')}${t.size} matdata</span></div>
      <div class="col mt12"><div><div class="row between small"><span>Tumhara samarthan</span><b style="color:var(--gold)">${Math.round(S.jan[id])}%</b></div><div class="bar"><i style="width:${S.jan[id]}%"></i></div></div>
      <div><div class="row between small"><span>Bunty Bhaiya</span><b style="color:#ff8b8b">${Math.round(S.rival[id])}%</b></div><div class="bar red"><i style="width:${S.rival[id]}%"></i></div></div></div>
      <div class="row mt12"><span class="chip gold">${ic(DATA.ISSUE_ICON[t.issue], 'sm')} Mudda: ${t.issue}</span></div>
      ${pr ? `<div class="tip mt12">${ic(pr.icon)}<div><b>${pr.name}</b><br>Samasya Hal Karo card se ${pr.need - S.problems[pr.id]} kadam door.</div></div>` : `<div class="tip mt12">${ic('check')}<div>Koi khuli samasya nahi.</div></div>`}
      <button class="btn block mt16" id="pl">${ic('planner')} Yahan kaam karo</button></div>`);
    o.addEventListener('click', (e) => { if (e.target === o) o.remove(); });
    on(o, '#pl', 'click', () => { o.remove(); planner(id); });
  }

  // ================= TURN PLANNER =================
  function planner(focus) {
    if (typeof focus !== 'string') focus = null;
    const S = G.S, max = G.samayMax() - (S.samayDebt || 0);
    let tola = focus || DATA.TOLAS.slice().sort((a, b) => (S.jan[a.id] - S.rival[a.id]) - (S.jan[b.id] - S.rival[b.id]))[0].id;
    const plan = [];
    const used = () => plan.reduce((a, p) => a + DATA.ACTIONS.find(x => x.id === p.id).slots, 0);
    const spend = () => plan.reduce((a, p) => a + (DATA.ACTIONS.find(x => x.id === p.id).cost || 0), 0);
    const el = mount(`<div class="hud"><div class="hud-top"><button class="iconbtn" id="bk">${ic('chevL')}</button><div class="grow"><div class="eyebrow">Hafta ${S.turn} · ${G.dateLabel()}</div><div class="h2">Yojana banao</div></div>
      <div class="res money">${ic('rupee')}<span class="val" id="money"></span></div></div></div>
      <div class="scroll"><div class="row between"><div class="h3">${ic('clock')} Samay slots</div><span class="small muted" id="cnt"></span></div>
      <div class="slots mt8" id="slots"></div>
      ${S.samayDebt ? `<div class="tiny muted mt8">${ic('alert', 'sm')} Pichhle hafte ke drama ne ${S.samayDebt} Samay kha liya.</div>` : ''}
      <div class="sec"><div class="h3">${ic('map')} Kis tola mein?</div></div>
      <div class="tolas" id="tolas"></div>
      <div class="sec"><div class="h3">${ic('planner')} Action cards</div><span class="tiny muted">Tap karke slot mein daalo</span></div>
      <div class="cards" id="cards"></div></div>
      <div class="foot"><button class="btn green block" id="go">${ic('play')} Hafta chalao</button></div>`);
    const colorOf = (id) => DATA.ACTIONS.find(x => x.id === id).c;
    function render() {
      const u = used();
      $('#money', el).textContent = fmt(S.paisa - spend());
      $('#cnt', el).textContent = `${u} / ${max} istemaal`;
      let html = '', k = 0;
      plan.forEach((p, pi) => { const A = DATA.ACTIONS.find(x => x.id === p.id); for (let s = 0; s < A.slots; s++) html += `<button class="slot fill" data-pi="${pi}" style="background:linear-gradient(170deg,${A.c[0]},${A.c[1]})">${s === 0 ? ic(A.icon) : ''}</button>`; k += A.slots; });
      for (; k < G.samayMax(); k++) html += `<div class="slot ${k >= max ? 'lock' : ''}">${k >= max ? ic('lock', 'sm') : k + 1}</div>`;
      $('#slots', el).innerHTML = html;
      $('#tolas', el).innerHTML = DATA.TOLAS.map(t => `<button class="${t.id === tola ? 'on' : ''}" data-t="${t.id}">${ic(DATA.ISSUE_ICON[t.issue], 'sm')}${t.name} <b>${Math.round(S.jan[t.id])}%</b></button>`).join('');
      $('#cards', el).innerHTML = DATA.ACTIONS.filter(A => !(A.once && S.cricketDone)).map(A => {
        const dis = u + A.slots > max || (A.cost || 0) > S.paisa - spend() || (A.once && plan.some(p => p.id === A.id));
        const pr = A.id === 'samasya' ? G.openProblem(tola) : null;
        return `<button class="acard ${dis ? 'dis' : ''} ${A.grey ? 'grey' : ''}" data-a="${A.id}" style="--c1:${A.c[0]};--c2:${A.c[1]}">
          <div class="cost">${Array(A.slots).fill('<i></i>').join('')}</div><div class="ai">${ic(A.icon, 'lg')}</div>
          <div class="nm">${A.name}</div><div class="ds">${pr ? pr.name : A.desc}</div>
          <div class="ft"><span>${A.fx}</span>${A.cost ? `<span>${ic('rupee')}${A.cost}</span>` : ''}${A.tgt ? `<span>${ic('map')}${G.tolaName(tola).split(' ')[0]}</span>` : ''}</div></button>`;
      }).join('');
      $('#go', el).disabled = !plan.length;
      on(el, '[data-t]', 'click', (e, b) => { tola = b.dataset.t; render(); });
      on(el, '[data-a]', 'click', (e, b) => { plan.push({ id: b.dataset.a, tola }); G.sfx.card(); render(); });
      on(el, '[data-pi]', 'click', (e, b) => { plan.splice(+b.dataset.pi, 1); render(); });
    }
    render();
    on(el, '#bk', 'click', home);
    on(el, '#go', 'click', () => {
      if (used() < max && !confirm(`${max - used()} Samay khaali hai. Phir bhi hafta chalayein?`)) return;
      S.samayDebt = 0;
      const out = G.resolveTurn(plan); G.sfx.whoosh();
      runEvents(G.drawEvents(), out, 0);
    });
  }

  // ================= EVENTS =================
  function runEvents(list, out, i) {
    if (i >= list.length) return turnResult(out);
    const ev = list[i]; G.save();
    const rarName = ['AAM', 'KHAAS', 'DURLABH', 'AITIHASIK'][ev.rar];
    const o = overlay(`<div class="ev paper"><div class="ev-art">${ART.eventArt(ev.art)}<span class="chip ev-tag" style="background:#000a;color:#fff">${ic('alert', 'sm')}${ev.cat}</span><span class="rar r${ev.rar}">${rarName}</span></div>
      <div class="ev-body"><div class="tiny" style="color:var(--ink-2);font-weight:700">DRAMA ${i + 1} / ${list.length}</div><div class="ev-title">${ev.title}</div><div class="ev-text">${ev.text}</div>
      <div id="chs">${ev.choices.map((c, k) => `<button class="choice" data-k="${k}"><span class="cn">${'ABCD'[k]}</span><div><div class="ct">${c.t}</div><div class="fx">${fxChips({ ...c.fx, seed: c.seed })}</div></div></button>`).join('')}</div></div></div>`);
    ev.rar >= 1 ? G.sfx.sting() : G.sfx.whoosh();
    on(o, '.choice', 'click', (e, b) => {
      const r = G.chooseEvent(ev, +b.dataset.k);
      Object.entries(r.d).forEach(([k, v]) => out.d[k] = (out.d[k] || 0) + v);
      out.notes.push(...(r.notes || []));
      $('#chs', o).innerHTML = `<div class="tip" style="background:#fff;border-color:#e2d3b0;color:var(--ink)">${ic('chat')}<div><b>${r.say}</b></div></div><button class="btn block mt12" id="nx">Aage ${ic('chevR')}</button>`;
      on(o, '#nx', 'click', () => { o.remove(); runEvents(list, out, i + 1); });
    });
  }

  // ================= TURN RESULT + CLIFFHANGER =================
  function turnResult(out) {
    const S = G.S, snap = S.lastSnap, avg = G.avgJan(), dAvg = avg - snap.avg;
    const rows = [['Jan Samarthan', dAvg + '%', dAvg], ['Paisa', fmt(S.paisa - snap.paisa), S.paisa - snap.paisa], ['Josh', sgn(Math.round(S.josh - snap.josh)), S.josh - snap.josh], ['Sadasya', sgn(S.members - snap.members), S.members - snap.members]];
    const tease = G.teaser();
    const el = mount(`<div class="scroll">
      <div class="center mt16"><div class="eyebrow">Hafta ${S.turn} poora</div><div class="h1 mt8">Hafte ka <span class="gold-text">Hisaab</span></div></div>
      <div class="deltas mt16">${rows.map(([k, v, n]) => `<div class="delta">${k}<span class="n ${n > 0 ? 'pos' : n < 0 ? 'neg' : ''}">${n > 0 && !String(v).startsWith('+') ? '+' : ''}${v}</span></div>`).join('')}</div>
      ${out.missionsDone.length ? `<div class="sec"><div class="h3">${ic('trophy')} Lakshya poore</div></div>${out.missionsDone.map(m => `<div class="mission done"><div class="mi t1">${ic('check')}</div><div class="tx">${m}</div></div>`).join('')}` : ''}
      ${out.notes.length ? `<div class="sec"><div class="h3">${ic('info')} Kya hua</div></div><div class="col">${out.notes.map(n => `<div class="tip">${ic('check')}<div>${n}</div></div>`).join('')}</div>` : ''}
      <div class="sec"><div class="h3">${ic('eye')} Bunty ki chaal</div></div>
      <div class="person"><div class="face">${ART.face(DATA.PEOPLE[0], 50)}</div><div class="small">${out.rival.join(' ')}</div></div>
      <div class="sec"><div class="h3">${ic('news')} Hafte ki surkhi</div></div>
      <div class="paper np"><div class="hl"><small>${S.headlines[0].s}</small>${S.headlines[0].t}</div></div>
      <div class="hook mt16"><div class="eyebrow" style="color:var(--pink)">${ic('alert', 'sm')} Agle hafte...</div><div class="q">"${tease}"</div></div>
      </div><div class="foot"><button class="btn block" id="nx">Agla Hafta ${ic('chevR')}</button></div>`);
    if (out.missionsDone.length) { G.sfx.coin(); confetti(30); }
    on(el, '#nx', 'click', () => {
      const r = G.endTurn();
      if (r.electionDue) return pollingDay();
      tab = 'kshetra'; home();
      if (r.announce) setTimeout(() => announceElection(), 400);
    });
  }
  function announceElection() {
    G.sfx.sting();
    const o = overlay(`<div class="ev paper"><div class="ev-art">${ART.eventArt('election')}<span class="rar r2">PEHLA CHUNAV</span></div>
      <div class="ev-body"><div class="ev-title">School Committee Chunav!</div><div class="ev-text">Masterji ne elaan kiya: School Management Committee ke adhyaksh ka chunav 5 hafte mein. 40 abhibhavak vote denge. Bunty Bhaiya ne naamankan bhar diya hai.</div>
      <div class="tip" style="background:#fff;color:var(--ink);border-color:#e2d3b0">${ic('target')}<div>Kamzor tolon pe dhyaan do. Samasya hal karo, Josh badhao (turnout!), aur Bunty ki chaalon ka jawab do.</div></div>
      <button class="btn block mt12" id="ok">${ic('fist')} Ladenge!</button></div></div>`);
    on(o, '#ok', 'click', () => { o.remove(); home(); });
  }

  // ================= POLLING + COUNTING NIGHT =================
  function pollingDay() {
    const res = G.runElection();
    const el = mount(`<div class="tvbar" style="background:var(--red);color:#fff;font-family:var(--f-head);font-weight:800;padding:8px 12px;display:flex;gap:8px;align-items:center"><span style="background:#fff;color:var(--red);padding:0 6px;border-radius:4px;font-size:11px">LIVE</span>SANSANI TV · MATGANANA</div>
      <div class="scroll"><div class="round" id="rnd">Matdaan khatam · Ginti shuru</div>
      <div class="h2 center mt8">School Committee Chunav</div>
      <div class="wall mt16">
        <div class="cand" id="cp"><div class="face">${ART.face({ id: 'player', col: '#ffb627', f: G.S.gender === 'f' }, 50)}</div><div class="grow"><div class="h3">${G.S.name}</div><div class="tiny muted">Yuva Mandal</div></div><div class="votes" id="vp">0</div><i class="vbar" id="bp" style="background:var(--gold);width:0"></i></div>
        <div class="cand" id="cr"><div class="face">${ART.face(DATA.PEOPLE[0], 50)}</div><div class="grow"><div class="h3">Bunty Bhaiya</div><div class="tiny muted">Pradhan ka bhatija</div></div><div class="votes" id="vr">0</div><i class="vbar" id="br" style="background:var(--red);width:0"></i></div>
        <div class="cand"><div class="face" style="display:grid;place-items:center;color:var(--text-3)">${ic('x', 'lg')}</div><div class="grow"><div class="h3">NOTA / Khaali</div></div><div class="votes" id="vn">0</div></div>
      </div>
      <div class="col mt16" id="log"></div><div id="final" class="mt16"></div></div>
      <div class="foot"><button class="btn block" id="nx" disabled>Kyun jeete, kyun haare ${ic('chevR')}</button></div>`, 'studio');
    let p = 0, r = 0, n = 0, i = 0;
    const step = () => {
      if (i >= res.rounds.length) return finish();
      const rd = res.rounds[i]; p += rd.p; r += rd.r; n += rd.n;
      $('#rnd', el).textContent = `Round ${i + 1} / ${res.rounds.length} · ${rd.name}`;
      $('#vp', el).textContent = p; $('#vr', el).textContent = r; $('#vn', el).textContent = n;
      const tot = Math.max(1, p + r + n); $('#bp', el).style.width = p / tot * 100 + '%'; $('#br', el).style.width = r / tot * 100 + '%';
      $('#cp', el).classList.toggle('lead', p > r); $('#cr', el).classList.toggle('lead', r > p);
      $('#log', el).insertAdjacentHTML('afterbegin', `<div class="tip">${ic(rd.p >= rd.r ? 'up' : 'down')}<div><b>${rd.name}:</b> ${G.S.name} ${rd.p} · Bunty ${rd.r}</div></div>`);
      G.sfx.tick(); G.buzz(15); i++; setTimeout(step, 1300);
    };
    const finish = () => {
      $('#rnd', el).textContent = 'Antim parinaam';
      $('#final', el).innerHTML = res.won
        ? `<div class="bigmsg gold-text">JEET GAYE!</div><div class="center muted mt8">${res.margin} vote se. Maala +12. Naya aide: Niji Sahayak (+1 Samay)</div>`
        : `<div class="bigmsg" style="color:#ff8b8b">HAAR GAYE</div><div class="center muted mt8">${-res.margin} vote se. Ye ant nahi, shuruaat hai.</div>`;
      if (res.won) { G.sfx.win(); confetti(120); garland(); } else G.sfx.lose();
      $('#nx', el).disabled = false;
    };
    setTimeout(step, 1200);
    on(el, '#nx', 'click', () => breakdown(res));
  }
  function garland() {
    const g = document.createElement('div'); g.className = 'confetti';
    g.innerHTML = `<div style="position:absolute;left:50%;top:-140px;transform:translateX(-50%);color:var(--gold);animation:fall 2.2s cubic-bezier(.3,1.4,.5,1) forwards;animation-name:none" id="gar"></div>`;
    const ring = Array.from({ length: 18 }, (_, k) => { const a = Math.PI * (k / 17); return `<g transform="translate(${100 + 80 * Math.cos(a)} ${10 + 90 * Math.sin(a)})"><circle r="11" fill="${k % 2 ? '#ff7a1a' : '#ffb627'}"/><circle r="4" fill="#c0392b"/></g>`; }).join('');
    g.innerHTML = `<svg viewBox="0 0 200 120" style="position:absolute;left:50%;width:220px;transform:translateX(-50%);top:-150px;transition:top 1s cubic-bezier(.3,1.5,.5,1)">${ring}</svg>`;
    app.appendChild(g); requestAnimationFrame(() => requestAnimationFrame(() => g.firstChild.style.top = '52%'));
    setTimeout(() => g.remove(), 3200);
  }

  // ================= "KYUN JEETE, KYUN HAARE" =================
  function breakdown(res) {
    const S = G.S;
    const el = mount(`<div class="scroll">
      <div class="center mt16"><div class="eyebrow">Vishleshan</div><div class="h1 mt8">${res.won ? 'Kyun <span class="gold-text">jeete</span>' : 'Kyun <span style="color:#ff8b8b">haare</span>'}</div>
      <div class="row mt12" style="justify-content:center"><span class="chip gold">${ic('ballot', 'sm')}${res.totP} - ${res.totR}</span><span class="chip">${ic('x', 'sm')}NOTA ${res.totN}</span></div></div>
      <div class="sec"><div class="h3">${ic('map')} Tola-war nateeja</div></div>
      <div class="panel">${res.rounds.map(r => `<div class="swing"><span>${r.name}</span><span class="small" style="color:var(--gold)">${r.p}</span><span class="small" style="color:#ff8b8b">${r.r}</span></div>`).join('')}</div>
      <div class="sec"><div class="h3">${ic('star')} Kya kaam aaya</div></div>
      <div class="statgrid">${Object.entries(S.chhavi).map(([k, v]) => `<div class="stat"><div class="k">${G.CHHAVI_NAME[k]}</div><div class="v" style="color:${v >= 50 ? '#6ff0a1' : '#ff8b8b'}">${Math.round(v)}</div></div>`).join('')}</div>
      <div class="sec"><div class="h3">${ic('target')} 3 chaalein jo farak laatin</div></div>
      <div class="col">${res.analysis.map(t => `<div class="tip">${ic('spark')}<div>${t}</div></div>`).join('')}</div>
      ${res.won ? `<div class="sec"><div class="h3">${ic('trophy')} Inaam</div></div><div class="person"><div class="face" style="display:grid;place-items:center;background:var(--gold);color:#3a1d00">${ic('briefcase', 'lg')}</div><div><div class="h3">Aide Card: Niji Sahayak</div><div class="small muted">Har hafte +1 Samay slot</div></div></div>` : ''}
      </div><div class="foot"><button class="btn block ${res.won ? 'green' : ''}" id="nx">${res.won ? ic('flag') + ' Aage badho' : ic('refresh') + ' Phir se ladenge'}</button></div>`);
    on(el, '#nx', 'click', () => { tab = 'kshetra'; home(); });
  }

  // ================= STAGE END: party offers =================
  function stageEnd() {
    G.sfx.sting();
    const el = mount(`<div class="scroll"><div class="center mt16"><div class="eyebrow">Stage 1 poora</div><div class="h1 mt8">Do party, <span class="gold-text">ek faisla</span></div>
      <div class="small muted mt8">Gaon ab tumhe pehchaanta hai. Do partiyon ne Booth Adhyaksh ka pad offer kiya hai. Ye faisla tay karega kaun se matdata tum pe default bharosa karenge.</div></div>
      <div class="col mt16">
        <button class="opt" data-p="rpm"><div class="row"><div class="oi" style="background:#ff8a1f;color:#fff">${ic('flag', 'lg')}</div><div class="grow"><div class="on2">Rashtriya Pragati Morcha</div><div class="tiny muted">Saanskritik rashtravaad · bazaar-hitaishi · rashtriya</div></div></div>
          <div class="plus">${ic('up', 'sm')}Cadre, paisa, mazboot rashtriya chehra</div><div class="minus">${ic('down', 'sm')}Kuch kshetron aur alpsankhyakon mein kamzor</div></button>
        <button class="opt" data-p="jsp"><div class="row"><div class="oi" style="background:#2a7de1;color:#fff">${ic('flag', 'lg')}</div><div class="grow"><div class="on2">Jan Sangharsh Party</div><div class="tiny muted">Bahulvaad · kalyaan · rashtriya</div></div></div>
          <div class="plus">${ic('up', 'sm')}Har rajya mein purana network</div><div class="minus">${ic('down', 'sm')}Boodhe neta, gutbaazi</div></button>
      </div></div>`);
    on(el, '[data-p]', 'click', (e, b) => {
      G.chooseParty(b.dataset.p); G.sfx.win(); confetti(100); garland();
      const o = overlay(`<div class="sheet center"><div class="grab"></div><div class="avatar" style="margin:0 auto;width:70px;height:70px">${ic('flag', 'xl')}<span class="lvl">1</span></div>
        <div class="h1 mt12 gold-text">Booth Adhyaksh!</div><div class="small muted mt8">Ab ek poore booth ki zimmedari: Matdata suchi, Panna Pramukh, booth committee. Stage 2 agle update mein khulega.</div>
        <button class="btn block mt16" id="ok">Career book dekho</button></div>`);
      on(o, '#ok', 'click', () => { o.remove(); tab = 'kitab'; home(); });
    });
  }

  // ================= KHABAR =================
  function khabar() {
    const S = G.S;
    shell(`<div class="paper np"><div class="mast">Gaon Ki Awaaz</div><div class="date">${G.dateLabel()} · Rampur · Mulya 2 rupaye</div>
        ${S.headlines.slice(0, 6).map(h => `<div class="hl"><small>${h.s} · Hafta ${h.turn}</small>${h.t}</div>`).join('')}</div>
      ${G.heatLevel() ? `<div class="tip mt12" style="border-color:rgba(255,77,77,.4);background:rgba(255,77,77,.08)">${ic('thermo')}<div><b>Heat ka ishaara:</b> ${G.heatHint()}</div></div>` : ''}
      <div class="sec"><div class="h3">${ic('whatsapp')} WhatsApp</div><span class="chip">${ic('users', 'sm')}Rampur Parivaar (247)</span></div>
      <div class="wa"><div class="wa-h"><div class="g">${ic('users')}</div><div><div class="small" style="font-weight:700">Rampur Parivaar</div><div class="tiny muted">Sharma Uncle, Bunty, Masterji, +244</div></div></div>
        ${DATA.FORWARDS.map(f => `<div class="bubble"><div class="s">${f.s}</div>${f.s === 'Sharma Uncle' ? `<div class="fw">${ic('share', 'sm')}Forwarded many times</div>` : ''}${f.t}</div>`).join('')}</div>
      <div class="sec"><div class="h3">${ic('tv')} TV Charcha</div></div>
      ${DATA.HEADLINES.map(h => `<div class="person" style="margin-bottom:8px"><div class="face" style="display:grid;place-items:center;background:var(--red);color:#fff">${ic('tv')}</div><div><div class="tiny" style="color:var(--gold);font-weight:700">${h.s}</div><div class="small">${h.t}</div></div></div>`).join('')}`);
  }

  // ================= RISHTE =================
  function rishte() {
    const S = G.S;
    shell(`<div class="sec" style="margin-top:4px"><div class="h3">${ic('handshake')} Rishte</div><span class="chip">${ic('users', 'sm')}${DATA.PEOPLE.length} log</span></div>
      <div class="col">${DATA.PEOPLE.map(p => { const v = S.rishte[p.id]; return `<div class="person"><div class="face">${ART.face(p, 50)}</div><div class="grow"><div class="row between"><div class="h3">${p.name}</div><b class="small" style="color:${v >= 0 ? '#6ff0a1' : '#ff8b8b'}">${sgn(Math.round(v))}</b></div>
        <div class="tiny muted">${p.role} · ${p.arche}</div><div class="rel"><i style="${v >= 0 ? `left:50%;width:${v / 2}%;background:var(--green)` : `right:50%;width:${-v / 2}%;background:var(--red)`}"></i></div></div></div>`; }).join('')}</div>
      <div class="sec"><div class="h3">${ic('briefcase')} Aide Cards</div><span class="tiny muted">Khel kar kamaaye jaate hain</span></div>
      <div class="cards">${[['pa', 'Niji Sahayak', 'clock', '+1 Samay har hafte'], ['vakil', 'Vakil', 'gavel', 'Court aur raid ka nuksaan kam'], ['it', 'IT Cell Head', 'chat', 'Social media reach'], ['rann', 'Rannitikaar', 'target', 'Sateek survey']].map(([id, n, icn, d]) => {
        const has = S.aides.includes(id); return `<div class="acard ${has ? '' : 'dis'}" style="--c1:${has ? '#ffb627' : '#444'};--c2:${has ? '#c76a00' : '#222'};pointer-events:none"><div class="ai">${ic(has ? icn : 'lock', 'lg')}</div><div class="nm">${n}</div><div class="ds">${d}</div><div class="ft"><span>${has ? 'Level 1' : 'Band'}</span></div></div>`; }).join('')}</div>`);
  }

  // ================= KITAB (career book) =================
  function kitab() {
    const S = G.S;
    const blanks = ['Durlabh: Aadhi raat ka gathbandhan', 'Aitihasik: Ek vote se sarkar', 'Durlabh: Sting operation'];
    shell(`<div class="panel row"><div class="face" style="width:64px;height:64px">${ART.face({ id: 'player', col: '#ffb627', f: S.gender === 'f' }, 64)}</div>
        <div class="grow"><div class="eyebrow">Rajneetik Yatra</div><div class="h2">${S.name}</div><div class="tiny muted">${DATA.RANKS[S.rank]} · Umar ${S.age} · ${DATA.STATES.find(s => s.id === S.state).name}</div></div></div>
      <div class="statgrid mt12"><div class="stat"><div class="k">${ic('trophy', 'sm')}Chunav jeete</div><div class="v">${S.electionsWon}</div></div><div class="stat"><div class="k">${ic('flower', 'sm')}Maala meter</div><div class="v">${S.maala}</div></div>
        <div class="stat"><div class="k">${ic('wrench', 'sm')}Samasya hal</div><div class="v">${S.solved}</div></div><div class="stat"><div class="k">${ic('calendar', 'sm')}Hafte</div><div class="v">${S.turn}</div></div></div>
      <div class="sec"><div class="h3">${ic('news')} Surkhiyaan</div><span class="chip">${S.headlines.length} sangrah</span></div>
      <div class="col gap14">${S.headlines.map((h, i) => `<div class="paper clip" style="--rot:${(i % 2 ? 1 : -1) * (0.4 + (i % 3) * .4)}deg"><div class="src">${h.s} · Hafta ${h.turn}</div><div class="t">${h.t}</div></div>`).join('')}
        ${blanks.map(b => `<div class="paper clip blank"><div class="src">${ic('lock', 'sm')} Khaali frame</div><div class="t" style="font-family:var(--f-body);font-size:13px">${b}</div></div>`).join('')}</div>
      <button class="btn ghost block mt16" id="sh">${ic('share')} Share card</button>`);
    on(app, '#sh', 'click', () => {
      const txt = `${S.name}: ${DATA.RANKS[S.rank]} · ${S.electionsWon} chunav jeete · Maala ${S.maala}. Neta: Booth se PM Tak`;
      if (navigator.share) navigator.share({ text: txt }).catch(() => {}); else { try { navigator.clipboard.writeText(txt); } catch {} toast('Copy ho gaya', 'check'); }
    });
  }

  // ================= SETTINGS =================
  function settingsSheet() {
    const s = G.settings;
    const o = overlay(`<div class="sheet"><div class="grab"></div><div class="h2">Settings</div>
      <div class="col mt16">
        <div class="row between"><div class="row">${ic('volume')} Awaaz</div><button class="toggle ${s.sound ? 'on' : ''}" data-k="sound"></button></div>
        <div class="row between"><div class="row">${ic('phone')} Haptics</div><button class="toggle ${s.haptics ? 'on' : ''}" data-k="haptics"></button></div>
        ${G.S ? `<button class="btn ghost block mt12" id="menu">${ic('exit')} Main menu</button>` : ''}
        <div class="tiny muted center mt8">Neta v0.1 · Sabhi party, neta aur media kaalpanik hain.</div></div></div>`);
    o.addEventListener('click', (e) => { if (e.target === o) o.remove(); });
    on(o, '.toggle', 'click', (e, b) => { s[b.dataset.k] = !s[b.dataset.k]; b.classList.toggle('on'); G.saveSettings(); });
    on(o, '#menu', 'click', () => { o.remove(); G.save(); splash(); });
  }

  // Android back button (Capacitor / PWA history)
  history.pushState(null, '', location.href);
  window.addEventListener('popstate', () => {
    history.pushState(null, '', location.href);
    const ov = $$('.ev-back').find(o => !o.querySelector('.ev')); if (ov) return ov.remove();
    if (G.S && tab !== 'kshetra') { tab = 'kshetra'; home(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) G.save(); });

  splash();
})();
