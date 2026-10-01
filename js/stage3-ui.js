/* Neta — Stage 3 screens: Panchayat home, term-goal picker, build menu + project sliders,
   Gram Sabha mini-game, reservation rotation, BDC seat, member-gathering contest (Block / Zila), stage end. */
window.UI3 = (() => {
  const { mount, on, overlay, toast, confetti, garland, shell, fmt } = UI;
  const S = () => G.S, P = () => G.S.p;
  const lakh = (n) => '₹' + (n / 100000).toFixed(n >= 1000000 ? 0 : 1) + 'L';

  const missionsHtml = () => S().missions.map((m, i) => {
    const lab = ['Aaj ka kaam', 'Is saal ka lakshya', 'Kaaryakaal ka sapna'][i];
    if (!m) return `<div class="mission"><div class="mi t${i}">${ic('check')}</div><div class="grow"><div class="lab">${lab}</div><div class="tx muted">Sab poora!</div></div></div>`;
    const p = Math.min(m.n, G.missionProgress(m));
    return `<div class="mission ${m.done ? 'done' : ''}"><div class="mi t${i}">${ic(['clock', 'target', 'star'][i])}</div><div class="grow"><div class="lab">${lab}</div><div class="tx">${m.t}</div><div class="bar ${['sky', '', 'red'][i]}"><i style="width:${p / m.n * 100}%"></i></div></div><div class="tiny muted">${p}/${m.n}</div></div>`;
  }).join('');
  const goalsHtml = () => `<div class="sec"><div class="h3">${ic('flag')} Stage 3: Panchayati Raj</div><span class="chip gold">${G.stageGoals().filter(g => g.ok).length}/4</span></div>
    <div class="panel" style="padding:6px 12px">${G.stageGoals().map(g => `<div class="swing" style="grid-template-columns:auto 1fr auto"><span style="color:${g.ok ? 'var(--green)' : 'var(--text-3)'}">${ic(g.ok ? 'check' : 'target', 'sm')}</span><span class="${g.ok ? 'muted' : ''}" style="${g.ok ? 'text-decoration:line-through' : ''}">${g.t}</span><span class="tiny muted">${g.p || ''}</span></div>`).join('')}</div>`;
  const mapHtml = (pins = '') => `<div class="map-wrap" id="map">${ART.map(S())}${DATA.TOLAS.map(t => `<div class="tola-label" style="left:${t.x}%;top:${t.y + 5}%">${t.name}<span class="pct">${Math.round(S().jan[t.id])}%</span></div>`).join('')}${pins}<div class="legend">Virodh<span class="grad"></span>Samarthan</div></div>`;

  // ================= ROUTER =================
  function home() {
    const p = P();
    if (p.phase === 'govern' && p.goals.length < 4) return goalPicker();
    if (p.phase === 'rotation') return rotationScreen();
    if (p.phase === 'bdc') return bdcScreen();
    if (p.phase === 'block' || p.phase === 'zila') return memberGame();
    if (p.phase === 'done') return S().s3ack ? panchayatHome() : stageEnd();
    if (p.phase === 'campaign') return campaignHome();
    return panchayatHome();
  }
  function intro() {
    const o = overlay(`<div class="sheet"><div class="grab"></div><div class="row"><div class="face" style="width:56px;height:56px">${ART.face(DATA.PEOPLE.find(x => x.id === 'ramdhan'), 56)}</div><div><div class="eyebrow">Ramdhan ji, purv Pradhan</div><div class="h3">"Pradhani bachchon ka khel nahi, beta."</div></div></div>
      <div class="small muted mt12" style="line-height:1.5">Stage 3 mein pehli baar <b style="color:var(--gold)">asli satta</b> milegi, seedhe Samvidhan ke Bhaag IX (73va Sanshodhan) se. Pehle 2,800 matdataon ka Pradhan chunav jeeto. Phir har mahina ek turn: panchayat nidhi, vikas kaam, Gram Sabha, aur 5 saal ka kaaryakaal.</div>
      <div class="col mt12"><div class="tip">${ic('scales')}<div><b>Anuchchhed 243A:</b> Gram Sabha mein gaon ka har matdaata. Yojana wahin paas hogi.</div></div>
      <div class="tip">${ic('hammer')}<div><b>11vi Anusuchi:</b> 29 vishay. Kuch pe poora adhikaar, kuch pe BDO ki manzoori.</div></div></div>
      <button class="btn block mt16" id="ok">Chunav ladenge!</button></div>`);
    on(o, '#ok', 'click', () => o.remove());
  }
  function onAnnounce(kind) {
    if (kind === 'sabha') return gramSabha();
    if (kind === 'rotation') return rotationScreen();
    UI.home();
  }

  // ================= CAMPAIGN =================
  function campaignHome() {
    const s = S(), e = s.election;
    const el = shell(`${e ? `<div class="panel row" style="border-color:rgba(255,182,39,.5);background:linear-gradient(135deg,#5a2a00,#2a1240)"><div style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:var(--gold);color:#3a1d00">${ic('ballot', 'lg')}</div>
        <div class="grow"><div class="eyebrow">Panchayat chunav · Rajya Nirvachan Aayog (243K)</div><div class="h3">${e.name}</div><div class="tiny muted">2,800 matdata · Ramdhan ji (purv Pradhan) aur Kamla Devi (nirdaliya)</div></div><div class="h1 gold-text">${e.left}</div></div>` : ''}
      <div class="sec"><div class="h3">${ic('map')} Rampur Gram Panchayat</div><span class="chip">${ic('handshake', 'sm')}Ehsaan ${P().ehsaan}</span></div>
      ${mapHtml()}
      <div class="tip mt12">${ic('info')}<div>Gaon ke chunav party nishaan pe nahi hote. Party ka saath asli hai par dikhta nahi. Jan Sampark, Nukkad Sabha aur Josh se jeeto.</div></div>
      <div class="sec"><div class="h3">${ic('target')} Mission Board</div></div><div class="missions">${missionsHtml()}</div>
      ${goalsHtml()}
      <button class="btn block mt16 pulse" id="go">${ic('planner')} Hafte ki Yojana</button>`);
    on(el, '#go', 'click', () => UI.planner());
  }

  // ================= TERM GOALS PICKER =================
  function goalPicker() {
    const sel = new Set();
    const el = mount(`<div class="scroll"><div class="center mt16"><div class="eyebrow">Kaaryakaal ka sapna</div><div class="h1 mt8">5 saal, <span class="gold-text">4 vaade</span></div>
      <div class="small muted mt8">8 mein se 4 lakshya chuno. Har ek Jan Samarthan dega aur Block tak raasta banayega.</div></div>
      <div class="col mt16" id="gl">${G3.TERM_GOALS.map(g => `<button class="opt" data-g="${g.id}" style="flex-direction:row;align-items:center;gap:12px"><div class="oi">${ic(g.icon, 'lg')}</div><div class="on2 grow" style="font-size:14.5px">${g.t}</div></button>`).join('')}</div></div>
      <div class="foot"><button class="btn green block" id="ok" disabled>${ic('check')} <span id="cnt">0/4 chune</span></button></div>`);
    on(el, '[data-g]', 'click', (e, b) => {
      const id = b.dataset.g;
      if (sel.has(id)) sel.delete(id); else if (sel.size < 4) sel.add(id); else return toast('Sirf 4 chun sakte ho', 'alert');
      b.classList.toggle('on', sel.has(id)); G.sfx.card();
      el.querySelector('#cnt').textContent = sel.size === 4 ? 'Shapath lo' : `${sel.size}/4 chune`; el.querySelector('#ok').disabled = sel.size !== 4;
    });
    on(el, '#ok', 'click', () => { G3.chooseGoals([...sel]); G.sfx.dhol(); confetti(40); UI.home(); });
  }

  // ================= PANCHAYAT HOME (governance) =================
  function panchayatHome() {
    const s = S(), p = P();
    const monthsIn = s.turn - p.termStart, nextSabha = nextSabhaLabel();
    const pinFor = (pr) => { const t = pr.tola ? DATA.TOLAS.find(x => x.id === pr.tola) : { x: 52, y: 44 }; const k = p.projects.filter(x => x.tola === pr.tola).indexOf(pr);
      return `<div class="pin" style="left:${t.x - 6 + (k % 3) * 7}%;top:${t.y - 4}%"><div class="b" style="background:${pr.status === 'done' ? 'var(--green)' : pr.status === 'broken' ? 'var(--red)' : 'var(--gold-2)'}">${ic(pr.status === 'done' ? 'check' : pr.status === 'broken' ? 'alert' : 'hammer')}</div></div>`; };
    const active = p.projects.filter(x => x.status !== 'done' || x === p.projects[p.projects.length - 1]);
    const projs = p.projects.slice().reverse().slice(0, 8).map(pr => { const d = G3.defOf(pr);
      return `<div class="person" style="margin-bottom:8px"><div class="face" style="display:grid;place-items:center;background:${pr.status === 'done' ? 'var(--green-dk)' : pr.status === 'broken' ? 'var(--red-dk)' : 'var(--panel-hi)'};color:#fff">${ic(d.icon, 'lg')}</div>
        <div class="grow"><div class="row between"><div class="h3" style="font-size:15px">${d.name}</div><span class="tiny muted">${pr.tola ? G.tolaName(pr.tola) : 'Poora gaon'}</span></div>
        ${pr.status === 'build' ? `<div class="bar"><i style="width:${(1 - pr.left / pr.total) * 100}%"></i></div><div class="tiny muted mt8">${pr.left} mahine baaki · ${G3.QUALITY.find(q => q.id === pr.q).name} · ${G3.CONTRACTOR.find(c => c.id === pr.con).name} thekedar</div>`
          : pr.status === 'broken' ? `<div class="row between mt8"><span class="tiny" style="color:#ff8b8b">Toot gaya! Video viral.</span><button class="btn red sm" data-rep="${pr.uid}">${ic('wrench', 'sm')} Marammat ${lakh(pr.cost * .4)}</button></div>`
          : `<div class="tiny" style="color:#6ff0a1">Poora · ${G3.QUALITY.find(q => q.id === pr.q).name}</div>`}</div></div>`; }).join('');
    const el = shell(`
      ${p.freeze ? `<div class="tip" style="border-color:rgba(255,77,77,.5);background:rgba(255,77,77,.1)">${ic('lock')}<div><b>Vittiya adhikaar ruke:</b> ${p.freeze} mahine. Koi bhugtaan nahi.</div></div>` : ''}
      <div class="panel ${p.freeze ? 'mt12' : ''}"><div class="row between"><div><div class="eyebrow">Gram Pradhan · Rampur</div><div class="h2">Kaaryakaal ${Math.min(G3.TERM, monthsIn + 1)}/${G3.TERM}</div></div><span class="chip ${p.planPassed ? 'green' : 'red'}">${ic(p.planPassed ? 'check' : 'lock', 'sm')}${p.planPassed ? 'Yojana paas' : 'Yojana atki'}</span></div>
        <div class="bar mt8"><i style="width:${monthsIn / G3.TERM * 100}%"></i></div>
        <div class="statgrid mt12"><div class="stat"><div class="k">${ic('rupee', 'sm')}Untied nidhi</div><div class="v">${lakh(p.fund)}</div></div><div class="stat"><div class="k">${ic('drop', 'sm')}Paani-safai (tied)</div><div class="v">${lakh(p.tied)}</div></div>
          <div class="stat"><div class="k">${ic('coins', 'sm')}Apni aamdani</div><div class="v">${fmt(p.ownRev)}</div></div><div class="stat"><div class="k">${ic('calendar', 'sm')}Agli Gram Sabha</div><div class="v" style="font-size:15px">${nextSabha}</div></div></div></div>
      <button class="btn block mt12" id="build">${ic('hammer')} Sarkar: Naya kaam shuru</button>
      <div class="sec"><div class="h3">${ic('map')} Gaon</div><span class="chip">${ic('handshake', 'sm')}Ehsaan ${p.ehsaan}</span></div>
      ${mapHtml(p.projects.filter(x => x.status !== 'done' || true).slice(-10).map(pinFor).join(''))}
      ${p.projects.length ? `<div class="sec"><div class="h3">${ic('hammer')} Vikas kaam</div><span class="chip">${p.done} poore</span></div>${projs}` : ''}
      <div class="sec"><div class="h3">${ic('star')} Kaaryakaal ke sapne</div></div>
      <div class="col">${p.goals.map(id => { const g = G3.TERM_GOALS.find(x => x.id === id), [a, b] = G3.goalProg(id), ok = G3.goalDone(id);
        return `<div class="mission ${ok ? 'done' : ''}"><div class="mi t2">${ic(ok ? 'check' : g.icon)}</div><div class="grow"><div class="tx">${g.t}</div><div class="bar ${ok ? 'green' : 'red'}"><i style="width:${Math.min(100, a / b * 100)}%"></i></div></div><div class="tiny muted">${a}/${b}</div></div>`; }).join('')}</div>
      <div class="sec"><div class="h3">${ic('users')} Daftar</div></div>
      <div class="col">${['sachiv', 'bdo', 'mla'].map(id => { const x = DATA.PEOPLE.find(q => q.id === id), v = s.rishte[id];
        return `<div class="person"><div class="face">${ART.face(x, 50)}</div><div class="grow"><div class="row between"><div class="h3" style="font-size:15px">${x.name}</div><b class="small" style="color:${v >= 0 ? '#6ff0a1' : '#ff8b8b'}">${v > 0 ? '+' : ''}${Math.round(v)}</b></div><div class="tiny muted">${x.role} · ${{ sachiv: 'har bhugtaan pe dastkhat', bdo: '20+ ho to BDO manzoori turant', mla: '15+ ho to saal mein ₹2L nidhi' }[id]}</div></div></div>`; }).join('')}</div>
      <div class="sec"><div class="h3">${ic('target')} Mission Board</div></div><div class="missions">${missionsHtml()}</div>
      ${goalsHtml()}
      <button class="btn block mt16 pulse" id="go">${ic('planner')} ${G.dateLabel()} ki Yojana</button>`);
    on(el, '#build', 'click', buildMenu);
    on(el, '#go', 'click', () => UI.planner());
    on(el, '[data-rep]', 'click', (e, b) => { const err = G3.repair(+b.dataset.rep); if (err) return toast(err, 'alert'); G.sfx.coin(); toast('Marammat shuru', 'wrench'); panchayatHome(); });
  }
  function nextSabhaLabel() {
    const m = G.month(), order = [0, 4, 7, 9], names = { 0: '26 Jan', 4: '1 May', 7: '15 Aug', 9: '2 Oct' };
    const n = order.find(x => x > m); return names[n ?? 0];
  }

  // ================= BUILD MENU =================
  function buildMenu() {
    const s = S(), p = P();
    const el = mount(`<div class="hud"><div class="hud-top"><button class="iconbtn" id="bk">${ic('chevL')}</button><div class="grow"><div class="eyebrow">11vi Anusuchi · 29 vishay</div><div class="h2">Naya kaam</div></div>
      <div class="res money">${ic('rupee')}<span class="val">${lakh(p.fund)}</span></div></div></div>
      <div class="scroll">${!p.planPassed ? `<div class="tip" style="border-color:rgba(255,77,77,.5)">${ic('lock')}<div>Pichhli Gram Sabha ne Gram Panchayat Vikas Yojana paas nahi ki. Agli Gram Sabha tak naye kaam nahi.</div></div>` : ''}
      ${G3.GROUPS.map(g => `<div class="sec"><div class="h3">${ic(g.icon)} ${g.name}</div><span class="chip ${g.power === 'full' ? 'green' : 'gold'}">${g.power === 'full' ? 'Poora adhikaar' : 'BDO manzoori'}</span></div>
        <div class="tiny muted" style="margin:-4px 2px 8px">${g.items}</div>
        <div class="cards">${G3.PROJECTS.filter(d => d.g === g.id).map(d => { const done = G3.builtIn(d.id).length;
          return `<button class="acard" data-d="${d.id}" style="--c1:${g.power === 'full' ? '#2fae7a' : '#2a7de1'};--c2:${g.power === 'full' ? '#156b48' : '#1749a8'};min-height:118px"><div class="ai">${ic(d.icon, 'lg')}</div><div class="nm">${d.name}</div><div class="ds">${d.desc}</div>
            <div class="ft"><span>${ic('rupee')}${lakh(d.cost)}</span><span>${ic('clock')}${d.months} mah</span>${d.tied ? `<span>${ic('drop')}Tied</span>` : ''}${done ? `<span>${ic('check')}${done}</span>` : ''}</div></button>`; }).join('')}</div>`).join('')}</div>`);
    on(el, '#bk', 'click', () => UI.home());
    on(el, '[data-d]', 'click', (e, b) => projectSheet(b.dataset.d));
  }
  function projectSheet(defId) {
    const s = S(), p = P(), d = G3.PROJECTS.find(x => x.id === defId);
    const st = { tola: d.village ? null : DATA.TOLAS.slice().sort((a, b) => G3.builtIn(defId).includes(a.id) - G3.builtIn(defId).includes(b.id) || s.jan[a.id] - s.jan[b.id])[0].id, q: 'mid', con: 'honest', cred: 'self' };
    const o = overlay(`<div class="sheet" id="ps"></div>`);
    o.addEventListener('click', (e) => { if (e.target === o) o.remove(); });
    const seg = (key, opts) => `<div class="seg" style="grid-template-columns:repeat(${opts.length},1fr)">${opts.map(x => `<button data-k="${key}" data-v="${x.id}" class="${st[key] === x.id ? 'on' : ''}" style="flex-direction:column;height:auto;padding:7px 4px;gap:1px"><span>${x.name}</span>${x.desc ? `<span class="tiny" style="opacity:.75;font-weight:500;line-height:1.15">${x.desc}</span>` : ''}</button>`).join('')}</div>`;
    function render() {
      const qu = G3.quote(defId, st.q, st.con), err = G3.canStart(defId, st.tola), avail = d.tied ? p.tied + p.fund : p.fund;
      o.querySelector('#ps').innerHTML = `<div class="grab"></div>
        <div class="row"><div style="width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:var(--gold);color:#3a1d00">${ic(d.icon, 'lg')}</div><div class="grow"><div class="eyebrow">${G3.GROUPS.find(g => g.id === d.g).name}</div><div class="h2">${d.name}</div></div></div>
        ${d.village ? '' : `<div class="sec" style="margin-top:12px"><div class="h3" style="font-size:14px">${ic('map', 'sm')} Kahan?</div></div><div class="tolas">${DATA.TOLAS.map(t => `<button class="${st.tola === t.id ? 'on' : ''}" data-t="${t.id}">${t.name}${G3.builtIn(defId).includes(t.id) ? ' ' + ic('check', 'sm') : ''}</button>`).join('')}</div>`}
        <div class="sec" style="margin-top:12px"><div class="h3" style="font-size:14px">${ic('star', 'sm')} Quality</div><span class="tiny muted">Sasta kaam mansoon mein behta hai</span></div>${seg('q', G3.QUALITY.map(q => ({ ...q, desc: `Toot ${Math.round(q.brk * 100)}%` })))}
        <div class="sec" style="margin-top:12px"><div class="h3" style="font-size:14px">${ic('briefcase', 'sm')} Thekedar</div></div>${seg('con', G3.CONTRACTOR)}
        <div class="sec" style="margin-top:12px"><div class="h3" style="font-size:14px">${ic('flag', 'sm')} Shrey kisko?</div></div>${seg('cred', G3.CREDIT)}
        <div class="statgrid mt12"><div class="stat"><div class="k">${ic('rupee', 'sm')}Laagat</div><div class="v" style="color:${qu.cost > avail ? '#ff8b8b' : ''}">${lakh(qu.cost)}</div><div class="tiny muted">${d.tied ? 'Tied nidhi pehle' : 'Untied nidhi'}: ${lakh(avail)}</div></div>
          <div class="stat"><div class="k">${ic('clock', 'sm')}Samay</div><div class="v">${qu.months} mahine</div>${qu.bdoDelay ? `<div class="tiny" style="color:#ffb36b">+${qu.bdoDelay} BDO manzoori</div>` : qu.shared ? '<div class="tiny" style="color:#6ff0a1">BDO ne turant manzoori di</div>' : ''}</div></div>
        ${st.con === 'connected' ? `<div class="tip mt8">${ic('thermo')}<div>10% cut (${fmt(qu.cost * .1)}) kaale paise mein. Heat badhegi aur social audit pe asar.</div></div>` : ''}
        ${err ? `<div class="tip mt8" style="border-color:rgba(255,77,77,.5)">${ic('lock')}<div>${err}</div></div>` : ''}
        <button class="btn green block mt16" id="start" ${err || qu.cost > avail ? 'disabled' : ''}>${ic('hammer')} Kaam shuru karo</button>`;
      on(o, '[data-t]', 'click', (e, b) => { st.tola = b.dataset.t; G.sfx.tap(); render(); });
      on(o, '[data-k]', 'click', (e, b) => { st[b.dataset.k] = b.dataset.v; render(); });
      on(o, '#start', 'click', () => {
        const e2 = G3.startProject(defId, st.tola, st.q, st.con, st.cred);
        if (e2) return toast(e2, 'alert');
        o.remove(); toast(`${d.name}: kaam shuru!`, 'hammer'); UI.home();
      });
    }
    render();
  }

  // ================= GRAM SABHA =================
  function gramSabha() {
    const s = S(), r = G3.sabhaStart();
    r.mobilise = 'none'; r.answers = r.demands.map(() => null); r.heckle = null; r.list = null;
    const el = mount(`<div style="background:linear-gradient(90deg,#1a8a4a,#2fae7a);color:#fff;font-family:var(--f-head);font-weight:800;padding:8px 12px;display:flex;gap:8px;align-items:center">${ic('users', 'sm')} GRAM SABHA · ${r.when.toUpperCase()} · ANUCHCHHED 243A</div>
      <div class="scroll" id="gs"></div><div class="foot"><button class="btn green block" id="go" disabled>${ic('scales')} Prastav pe vote</button></div>`);
    const body = el.querySelector('#gs'), est = () => r.base + (r.mobilise === 'munadi' ? 80 : r.mobilise === 'workers' ? 60 : 0);
    function render() {
      const att = est();
      body.innerHTML = `<div class="paper" style="height:120px;overflow:hidden;border-radius:18px;position:relative">${sabhaArt(att)}</div>
        <div class="sec"><div class="h3">${ic('users')} 1. Upasthiti</div><span class="chip ${att >= r.quorum ? 'green' : 'red'}">~${att} / ${r.quorum} quorum</span></div>
        <div class="bar ${att >= r.quorum ? 'green' : 'red'}"><i style="width:${Math.min(100, att / r.quorum * 100)}%"></i></div>
        <div class="seg mt8" style="grid-template-columns:1fr 1fr 1fr">${[['none', 'Jo aaye', ''], ['munadi', 'Munadi', '₹2,000'], ['workers', 'Karyakarta', '1 Samay']].map(([id, n, c]) => `<button data-mob="${id}" class="${r.mobilise === id ? 'on' : ''}" style="flex-direction:column;height:auto;padding:7px 4px"><span>${n}</span><span class="tiny" style="opacity:.75">${c}</span></button>`).join('')}</div>
        <div class="sec"><div class="h3">${ic('chat')} 2. Janta ki maang</div></div>
        ${r.demands.map((d, i) => `<div class="panel" style="margin-bottom:8px;padding:12px"><div class="row"><div class="face" style="width:38px;height:38px">${ART.face({ col: '#8a52e8', skin: '#b5784c', hair: '#333', f: i === 1 }, 38)}</div><div class="small grow"><b>${G.tolaName(d.tola)}:</b> ${d.say}</div></div>
          <div class="seg mt8" style="grid-template-columns:1fr 1fr 1fr">${[['promise', 'Vaada', '4 mah mein'], ['truth', 'Sach batao', 'Paisa kam'], ['delay', 'Taal do', '']].map(([id, n, c]) => `<button data-a="${i}" data-v="${id}" class="${r.answers[i] === id ? 'on' : ''}" style="flex-direction:column;height:auto;padding:6px 4px"><span>${n}</span><span class="tiny" style="opacity:.75">${c}</span></button>`).join('')}</div></div>`).join('')}
        <div class="sec"><div class="h3">${ic('alert')} 3. Ramdhan ji khade hue</div></div>
        <div class="panel" style="padding:12px"><div class="row"><div class="face" style="width:38px;height:38px">${ART.face(DATA.PEOPLE.find(x => x.id === 'ramdhan'), 38)}</div><div class="small grow">"Pradhan ji, pichhle mahino ka hisaab do! Kitna paisa kahan gaya?"</div></div>
          <div class="seg mt8" style="grid-template-columns:1fr 1fr 1fr">${[['records', 'Register dikhao'], ['shout', 'Palat ke bolo'], ['ignore', 'Nazarandaaz']].map(([id, n]) => `<button data-h="${id}" class="${r.heckle === id ? 'on' : ''}" style="height:auto;padding:9px 4px">${n}</button>`).join('')}</div></div>
        <div class="sec"><div class="h3">${ic('book')} 4. Labharthi suchi (awaas, pension)</div></div>
        <div class="seg" style="grid-template-columns:1fr 1fr">${[['fair', 'Nishpaksh suchi', 'Zarooratmand pehle'], ['favour', 'Apne vote bank ko', 'Heat +']].map(([id, n, c]) => `<button data-l="${id}" class="${r.list === id ? 'on' : ''}" style="flex-direction:column;height:auto;padding:8px 4px"><span>${n}</span><span class="tiny" style="opacity:.75">${c}</span></button>`).join('')}</div>`;
      on(body, '[data-mob]', 'click', (e, b) => { r.mobilise = b.dataset.mob; render(); });
      on(body, '[data-a]', 'click', (e, b) => { r.answers[+b.dataset.a] = b.dataset.v; render(); });
      on(body, '[data-h]', 'click', (e, b) => { r.heckle = b.dataset.h; render(); });
      on(body, '[data-l]', 'click', (e, b) => { r.list = b.dataset.l; render(); });
      el.querySelector('#go').disabled = !(r.answers.every(Boolean) && r.heckle && r.list);
    }
    render();
    on(el, '#go', 'click', () => {
      const res = G3.sabhaFinish(r);
      res.passed ? (G.sfx.win(), confetti(50)) : G.sfx.lose();
      const o = overlay(`<div class="sheet center"><div class="grab"></div><div class="eyebrow">${r.when} ki Gram Sabha</div>
        <div class="bigmsg mt12 ${res.passed ? 'gold-text' : ''}" style="font-size:36px;${res.passed ? '' : 'color:#ff8b8b'}">${!res.quorum ? 'QUORUM NAHI' : res.passed ? 'YOJANA PAAS!' : 'YOJANA ATKI'}</div>
        <div class="small muted mt8">${res.att} log aaye (quorum ${r.quorum}). ${!res.quorum ? 'Baithak sthagit. Agli Gram Sabha tak naye kaam band.' : res.passed ? 'Gram Panchayat Vikas Yojana aur labharthi suchi paas. Naye kaam shuru kar sakte ho.' : 'Bhari sabha ne yojana rok di. Agli Gram Sabha tak naye kaam band.'}</div>
        ${r.answers.includes('promise') ? `<div class="tip mt12" style="text-align:left">${ic('clock')}<div>Vaade 4 mahine mein poore karo: us tola mein matching kaam shuru karo, warna naraazgi.</div></div>` : ''}
        <button class="btn block mt16" id="ok">Theek hai</button></div>`);
      on(o, '#ok', 'click', () => { o.remove(); UI.home(); });
    });
  }
  function sabhaArt(att) {
    const n = Math.min(60, Math.round(att / 8));
    const ppl = Array.from({ length: n }, (_, i) => { const x = 20 + (i % 15) * 25 + (Math.floor(i / 15) % 2) * 12, y = 70 + Math.floor(i / 15) * 13; const c = ['#d6488a', '#2a7de1', '#c79a12', '#2fae4f', '#8a52e8'][i % 5];
      return `<g transform="translate(${x} ${y})"><circle r="5" cy="-6" fill="#b5784c"/><path d="M-7 8 Q0 -4 7 8z" fill="${c}"/></g>`; }).join('');
    return `<svg viewBox="0 0 400 130" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%"><rect width="400" height="130" fill="#ffd38a"/><rect y="0" width="400" height="40" fill="#ff9a52" opacity=".5"/>
      <g transform="translate(200 32)"><circle r="28" fill="#3f8f3a"/><circle cx="-12" cy="-8" r="14" fill="#58a84d"/></g><rect x="150" y="45" width="100" height="16" rx="3" fill="#a07850"/><rect x="185" y="30" width="30" height="16" fill="#fff3d6"/>
      ${ppl}</svg>`;
  }

  // ================= ROTATION =================
  function rotationScreen() {
    const s = S(), rot = G3.rotation();
    const reserved = rot !== 'none';
    const el = mount(`<div class="scroll"><div class="center mt16"><div class="eyebrow">Kaaryakaal poora · Anuchchhed 243D</div><div class="h1 mt8">Aarakshan ki <span class="gold-text">nayi suchi</span></div></div>
      <div class="paper ev-body mt16" style="border-radius:var(--r)"><div class="ev-title" style="font-size:20px">Rajya Nirvachan Aayog: Rampur Pradhan seat</div>
        <div class="ev-text">${reserved ? `Rotation ke baad Rampur ki Pradhan seat ab <b>${rot}</b> ke liye aarakshit hai. Aap is baar khud nahi lad sakte.` : 'Seat saamanya rahi. Par 5 saal ki Pradhani ke baad Block ki raajneeti bula rahi hai.'}</div></div>
      <div class="col mt16">
        ${reserved ? `<button class="opt" data-c="ally"><div class="row"><div class="oi">${ic('handshake', 'lg')}</div><div class="grow"><div class="on2">Sitara ko samarthan do</div><div class="tiny muted">Wafaadar rahegi... ya mahatvakanshi ban jaayegi</div></div></div><div class="plus">${ic('up', 'sm')}Ehsaan +2, Sitara se rishta</div></button>
        <button class="opt" data-c="family"><div class="row"><div class="oi">${ic('users', 'lg')}</div><div class="grow"><div class="on2">Parivaar se kisi ko utaaro</div><div class="tiny muted">"Pradhan-pati" kahani shuru</div></div></div><div class="minus">${ic('down', 'sm')}Heat +8, media mazaak</div></button>` : `<button class="opt" data-c="ally"><div class="row"><div class="oi">${ic('handshake', 'lg')}</div><div class="grow"><div class="on2">Sitara ko gaon saunpo</div><div class="tiny muted">Apna aadmi Pradhan, aap upar</div></div></div><div class="plus">${ic('up', 'sm')}Ehsaan +2</div></button>`}
        <button class="opt" data-c="up"><div class="row"><div class="oi">${ic('up', 'lg')}</div><div class="grow"><div class="on2">Seedhe upar: Block ki taraf</div><div class="tiny muted">BDC seat, phir Block Pramukh</div></div></div></button>
      </div></div>`);
    G.sfx.sting();
    on(el, '[data-c]', 'click', (e, b) => { G3.rotationChoose(b.dataset.c); G.sfx.dhol(); UI.home(); });
  }

  // ================= BDC SEAT =================
  function bdcScreen() {
    const el = mount(`<div class="scroll"><div class="center mt24"><div class="eyebrow">Kshetra Panchayat (Anuchchhed 243C)</div><div class="h1 mt8">BDC <span class="gold-text">sadasya</span> chunav</div>
      <div class="small muted mt8">Block Pramukh janta nahi chunti. Pehle khud BDC sadasya bano, phir 80 BDC sadasyon mein se 41 ka samarthan jutao.</div></div>
      <div class="panel mt16 center"><div class="h3">Aapka aadhaar</div><div class="statgrid mt12"><div class="stat"><div class="k">Jan Samarthan</div><div class="v">${G.avgJan()}%</div></div><div class="stat"><div class="k">Ehsaan</div><div class="v">${P().ehsaan}</div></div></div></div></div>
      <div class="foot"><button class="btn block pulse" id="go">${ic('ballot')} BDC chunav ladho</button></div>`);
    on(el, '#go', 'click', () => {
      const r = G3.bdcSeat();
      r.won ? (G.sfx.win(), confetti(60)) : G.sfx.lose();
      const o = overlay(`<div class="sheet center"><div class="grab"></div><div class="bigmsg ${r.won ? 'gold-text' : ''}" style="font-size:38px;${r.won ? '' : 'color:#ff8b8b'}">${r.won ? 'BDC SADASYA!' : 'HAAR GAYE'}</div>
        <div class="small muted mt8">${r.won ? 'Ab asli khel: Block Pramukh ke liye sadasyon ka samarthan.' : '5 saal baad dobara koshish. Umar badh rahi hai.'}</div><button class="btn block mt16" id="ok">Aage</button></div>`);
      on(o, '#ok', 'click', () => { o.remove(); UI.home(); });
    });
  }

  // ================= MEMBER CONTEST (Block Pramukh / Zila Adhyaksh) =================
  function memberGame() {
    const s = S(), p = P();
    const mg = p.mg && p.mg.level === p.phase ? p.mg : G3.mgStart(p.phase);
    const mine = mg.members.filter(m => m.side === 'me').length, theirs = mg.members.filter(m => m.side === 'rival').length;
    const title = mg.level === 'block' ? 'Block Pramukh' : 'Zila Panchayat Adhyaksh';
    const last = mg.round === mg.rounds;
    const open = mg.members.filter(m => m.side !== 'me').sort((a, b) => (a.side === 'open' ? 0 : 1) - (b.side === 'open' ? 0 : 1) || a.loyal - b.loyal).slice(0, 14);
    const weakMine = mg.members.filter(m => m.side === 'me' && m.loyal < 55).length;
    const el = mount(`<div class="hud"><div class="hud-top"><div class="grow"><div class="eyebrow">${title} · Hafta ${mg.round}/${mg.rounds}${last ? ' · AAKHRI' : ''}</div><div class="h2">Sadasya jodo</div></div>
        <div class="res">${ic('clock', 'sm')}<div class="samay">${Array.from({ length: 8 }, (_, i) => i < mg.samay ? '<i></i>' : '').join('')}</div></div>
        <div class="res money">${ic('rupee')}<span class="val">${fmt(s.paisa + s.kaala)}</span></div></div></div>
      <div class="scroll">
        <div class="panel"><div class="row between"><div class="h1 gold-text">${mine}</div><div class="center"><div class="tiny muted">Bahumat</div><div class="h2">${mg.need}</div></div><div class="h1" style="color:#ff8b8b">${theirs}</div></div>
          <div class="row tiny muted between"><span>Aap</span><span>${mg.n - mine - theirs} anirnit</span><span>Ramdhan gut</span></div>
          <div style="display:grid;grid-template-columns:repeat(${mg.n === 80 ? 16 : 15},1fr);gap:3px;margin-top:10px">${mg.members.map(m => `<i style="aspect-ratio:1;border-radius:50%;background:${m.side === 'me' ? 'var(--gold)' : m.side === 'rival' ? 'var(--red)' : 'rgba(255,255,255,.18)'};${m.side === 'me' && m.loyal < 55 ? 'opacity:.55' : ''}"></i>`).join('')}</div>
          ${mg.level === 'zila' && !p.ruling ? `<div class="tip mt12">${ic('alert')}<div>Rajya mein virodhi dal ki sarkar hai. Sarkari dabaav Ramdhan gut ke saath hai.</div></div>` : ''}
          ${weakMine ? `<div class="tiny muted mt8">${weakMine} sadasya kamzor wafaadari (halke) waale: inhe todha ja sakta hai.</div>` : ''}</div>
        ${mg.log.length ? `<div class="sec"><div class="h3">${ic('eye')} Khabar</div></div><div class="col">${mg.log.slice(0, 3).map(l => `<div class="tip">${ic('info')}<div>${l}</div></div>`).join('')}</div>` : ''}
        <div class="sec"><div class="h3">${ic('users')} Sadasyon se milo</div><span class="tiny muted">1 Samay har mulaqat</span></div>
        <div class="row tiny muted" style="flex-wrap:wrap;gap:6px;margin-bottom:8px"><span class="chip">${ic('crown', 'sm')}Pad baaki ${mg.posts}</span><span class="chip">${ic('handshake', 'sm')}Ehsaan ${p.ehsaan}</span><span class="chip">${ic('thermo', 'sm')}Nakad = Heat</span></div>
        <div class="col" style="gap:8px">${open.map(m => `<div class="panel" style="padding:10px 12px"><div class="row"><div class="av" style="width:36px;height:36px;border-radius:11px;display:grid;place-items:center;font-weight:800;color:#fff;background:${m.side === 'open' ? '#4b4f6b' : 'var(--red-dk)'}">${m.name[0]}</div>
            <div class="grow"><div class="small" style="font-weight:700">${m.name} <span class="tiny muted">#${m.i + 1}</span></div><div class="tiny muted">${m.side === 'open' ? 'Anirnit' : 'Ramdhan gut (wafaadari ' + m.loyal + ')'} · Maang: <b style="color:var(--gold)">${G3.DEMANDS.find(d => d.id === m.want).name}</b> · Bhaav ${'₹'.repeat(m.price)}</div></div></div>
            <div class="seg mt8" style="grid-template-columns:repeat(4,1fr)">${G3.DEMANDS.map(d => `<button data-m="${m.i}" data-o="${d.id}" style="flex-direction:column;height:auto;padding:6px 2px;gap:2px;font-size:11.5px;${m.want === d.id ? 'color:var(--gold)' : ''}">${ic(d.icon, 'sm')}<span>${d.id === 'nakad' ? fmt(m.price * 25000) : d.name.split(' ')[0]}</span></button>`).join('')}</div></div>`).join('')}</div>
      </div>
      <div class="foot col">${last ? `<button class="btn red block" id="resort">${ic('lock')} Resort le jao (₹1.5L, Heat +12)</button>` : ''}<button class="btn block" id="end">${last ? ic('ballot') + ' Matdaan karao' : ic('fastfwd') + ' Hafta khatam'}</button></div>`);
    on(el, '[data-o]', 'click', (e, b) => {
      const r = G3.mgOffer(+b.dataset.m, b.dataset.o);
      if (!r.ok) return toast(r.msg, 'alert');
      r.won ? G.sfx.coin() : G.sfx.tick(); toast(r.msg, r.won ? 'check' : 'chat'); memberGame();
    });
    const go = (resort) => {
      if (last) { G3.mgEndRound(resort); const res = G3.mgVote(); return UI2.counting(res); }
      const log = G3.mgEndRound(false); G.sfx.whoosh(); memberGame(); if (log.length) toast(log[0], 'eye');
    };
    on(el, '#end', 'click', () => go(false));
    on(el, '#resort', 'click', () => go(true));
  }

  // ================= STAGE END =================
  function stageEnd() {
    const s = S(), p = P(); G.sfx.win(); confetti(60);
    const el = mount(`<div class="scroll"><div class="center mt24"><div class="avatar" style="margin:0 auto;width:80px;height:80px">${ic('crown', 'xl')}<span class="lvl">${s.rank}</span></div>
      <div class="eyebrow mt16">Stage 3 poora</div><div class="h1 mt8 gold-text">${DATA.RANKS[s.rank]}</div>
      <div class="small muted mt8">Gaon se zile tak. Ab District Magistrate aapse barabari se baat karta hai. Agla padaav: Vidhan Sabha ka ticket.</div></div>
      <div class="statgrid mt16"><div class="stat"><div class="k">${ic('hammer', 'sm')}Vikas kaam</div><div class="v">${p.done}</div></div><div class="stat"><div class="k">${ic('star', 'sm')}Sapne poore</div><div class="v">${p.goals.filter(G3.goalDone).length}/4</div></div>
        <div class="stat"><div class="k">${ic('users', 'sm')}Gram Sabha paas</div><div class="v">${p.sabhaPassed}</div></div><div class="stat"><div class="k">${ic('calendar', 'sm')}Umar</div><div class="v">${s.age}</div></div></div>
      <div class="hook mt16"><div class="eyebrow" style="color:var(--pink)">${ic('alert', 'sm')} Aage...</div><div class="q">"Stage 4: MLA. Ticket ki ladai, 3 lakh matdata, aur apni hi party ke dushman." Agle update mein.</div></div></div>
      <div class="foot col"><button class="btn block" id="kb">${ic('book')} Career book</button></div>`);
    on(el, '#kb', 'click', () => { s.s3ack = true; G.save(); UI.setTab('kitab'); UI.home(); });
  }

  return { home, intro, onAnnounce, gramSabha, buildMenu, projectSheet, rotationScreen, memberGame, stageEnd };
})();
