/* Neta — Stage 2 screens: Booth home (Panna Pramukh grid, committee, voter list, party order),
   page assignment sheet, assembly/ward counting night, breakdown, stage end. */
window.UI2 = (() => {
  const { mount, on, overlay, toast, confetti, garland, shell, fmt } = UI;
  const S = () => G.S;
  const initials = (n) => n.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
  const wcol = (w) => ({ purab: '#d6488a', pashchim: '#2a7de1', bazaar: '#c79a12', kisan: '#2fae4f' }[w.tola]);

  function boothHome() {
    const s = S(), b = s.booth, c = G2.committee(), est = G2.estimate(), target = G2.BASELINE + 10;
    const el_ = s.election;
    const missions = s.missions.map((m, i) => {
      const lab = ['Aaj ka kaam', 'Is saal ka lakshya', 'Kaaryakaal ka sapna'][i];
      if (!m) return `<div class="mission"><div class="mi t${i}">${ic('check')}</div><div class="grow"><div class="lab">${lab}</div><div class="tx muted">Sab poora!</div></div></div>`;
      const p = Math.min(m.n, G.missionProgress(m));
      return `<div class="mission ${m.done ? 'done' : ''}"><div class="mi t${i}">${ic(['clock', 'target', 'star'][i])}</div><div class="grow"><div class="lab">${lab}</div><div class="tx">${m.t}</div><div class="bar ${['sky', '', 'red'][i]}"><i style="width:${p / m.n * 100}%"></i></div></div><div class="tiny muted">${p}/${m.n}</div></div>`;
    }).join('');
    const rows = DATA.TOLAS.map(t => `<div class="panna-row"><div class="tl">${t.name}<br><span style="color:${G2.coverage(t.id) > .6 ? '#6ff0a1' : '#ff9b9b'}">${Math.round(G2.coverage(t.id) * 100)}%</span></div>${b.pages.filter(p => p.tola === t.id).map(p => {
      const w = p.pp && b.workers.find(x => x.id === p.pp);
      return `<button class="pg ${w ? 'on' : ''} ${w && w.tola !== p.tola ? 'far' : ''}" data-pg="${p.n}">${w ? initials(w.name) : p.n}${(p.missing || p.deleted) && G2.suchiOpen() ? '<i class="flag"></i>' : ''}</button>`;
    }).join('')}</div>`).join('');
    const suchiLeft = b.suchiUntil - s.turn + 1;
    const el = shell(`
      ${el_ ? `<div class="panel row" style="border-color:rgba(255,182,39,.5);background:linear-gradient(135deg,#5a2a00,#2a1240)"><div style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:var(--gold);color:#3a1d00">${ic('ballot', 'lg')}</div>
        <div class="grow"><div class="eyebrow">Chunav ka mausam</div><div class="h3">${el_.name}</div><div class="tiny muted">${el_.kind === 'assembly' ? 'Aap party ke liye booth sambhal rahe hain' : 'Aap khud ummeedwar · Rival: Bunty Bhaiya'}</div></div><div class="h1 gold-text">${el_.left}</div></div>` : ''}
      <div class="panel ${el_ ? 'mt12' : ''}">
        <div class="row between"><div><div class="eyebrow">Booth ${b.no} · Rampur</div><div class="h2">Party vote anumaan</div></div><div class="h1 gold-text">${est.toFixed(0)}%</div></div>
        <div class="gauge"><i style="width:${Math.min(100, est / 60 * 100)}%"></i><span class="mk base" style="left:${G2.BASELINE / 60 * 100}%"><span>Pichhla ${G2.BASELINE}%</span></span><span class="mk tg" style="left:${target / 60 * 100}%"><span>Lakshya ${target}%</span></span></div>
        <div class="row mt12" style="flex-wrap:wrap;gap:6px"><span class="chip">${ic('users', 'sm')}1,200 matdata</span><span class="chip">${ic('book', 'sm')}${G2.assigned()}/40 panne</span>${b.lift != null ? `<span class="chip ${b.lift >= 10 ? 'green' : 'red'}">${ic('ballot', 'sm')}Nateeja ${b.lift >= 0 ? '+' : ''}${b.lift.toFixed(1)}</span>` : ''}</div></div>
      ${b.order ? `<div class="sec"><div class="h3">${ic('flag')} High command ka aadesh</div><span class="chip ${b.order.due - s.turn <= 1 ? 'red' : 'gold'}">${ic('clock', 'sm')}${Math.max(0, b.order.due - s.turn)} hafte</span></div>
        <div class="order"><div style="width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:var(--saffron);color:#fff;flex:none">${ic(b.order.icon, 'lg')}</div><div class="grow"><div class="small" style="font-weight:700">${b.order.t}</div><div class="bar"><i style="width:${b.order.prog / b.order.need * 100}%"></i></div><div class="tiny muted mt8">"Party ka Aadesh" card khelo · Inaam: Vishwas +${b.order.rw}</div></div></div>` : ''}
      <div class="sec"><div class="h3">${ic('book')} Panna Pramukh</div><span class="tiny muted">Panne pe tap karo</span></div>
      <div class="panel" style="padding:10px">${rows}
        <div class="row mt12 tiny muted" style="flex-wrap:wrap;gap:10px"><span class="row gap6"><i class="pg on" style="width:14px;aspect-ratio:1"></i>Apne tola ka</span><span class="row gap6"><i class="pg on far" style="width:14px;aspect-ratio:1"></i>Doosre tola ka (kam asar)</span><span class="row gap6"><i style="width:8px;height:8px;border-radius:50%;background:var(--red)"></i>Naam chhoote/kate</span></div></div>
      <div class="sec"><div class="h3">${ic('news')} Matdata Suchi</div><span class="chip ${G2.suchiOpen() ? 'gold' : ''}">${G2.suchiOpen() ? `${ic('clock', 'sm')}${suchiLeft} hafte baaki` : ic('lock', 'sm') + 'Band'}</span></div>
      <div class="statgrid"><div class="stat"><div class="k">${ic('up', 'sm')}Naye matdata jude</div><div class="v">${b.enrolled}</div><div class="bar green"><i style="width:${Math.min(100, b.enrolled * 2)}%"></i></div></div>
        <div class="stat"><div class="k">${ic('alert', 'sm')}Chhoote / kate naam</div><div class="v">${b.pages.reduce((a, p) => a + p.missing + p.deleted, 0)}</div><div class="tiny muted">"Matdata Suchi Camp" se jodo</div></div></div>
      <div class="sec"><div class="h3">${ic('users')} Booth Committee</div><span class="chip ${c.ok ? 'green' : 'red'}">${c.ok ? ic('check', 'sm') + 'Santulit' : ic('alert', 'sm') + 'Asantulit'}</span></div>
      <div class="panel"><div class="row" style="flex-wrap:wrap;gap:6px">${DATA.TOLAS.map(t => `<span class="chip ${c.per[t.id] >= 2 ? '' : 'red'}">${t.name.split(' ')[0]} ${c.per[t.id]}</span>`).join('')}<span class="chip ${c.size >= 10 ? '' : 'red'}">${ic('users', 'sm')}${c.size}/20</span></div>
        <div class="row between small mt12"><span>Mahila karyakarta</span><b style="color:${c.womenOk ? '#6ff0a1' : '#ff8b8b'}">${c.women} / ${Math.ceil(c.size / 3)} zaroori</b></div><div class="bar ${c.womenOk ? 'green' : 'red'}"><i style="width:${Math.min(100, c.women / Math.max(1, Math.ceil(c.size / 3)) * 100)}%"></i></div>
        <div class="col mt12" style="gap:6px">${b.workers.map(w => `<div class="wk"><div class="av" style="background:${wcol(w)}">${initials(w.name)}</div><div class="grow"><div class="small" style="font-weight:700">${w.name} ${w.f ? `<span class="chip" style="padding:0 6px;font-size:10px">Mahila</span>` : ''}</div><div class="tiny muted">${G.tolaName(w.tola)} · ${G2.pagesOf(w)}/${G2.MAX_PAGES_PER_WORKER} panne</div></div><div style="width:64px"><div class="tiny muted" style="text-align:right">Wafaadari</div><div class="bar ${w.loyal < 40 ? 'red' : 'green'}"><i style="width:${w.loyal}%"></i></div></div></div>`).join('')}</div></div>
      <div class="sec"><div class="h3">${ic('target')} Mission Board</div></div><div class="missions">${missions}</div>
      <div class="sec"><div class="h3">${ic('flag')} Stage 2: Booth Adhyaksh</div><span class="chip gold">${G.stageGoals().filter(g => g.ok).length}/4</span></div>
      <div class="panel" style="padding:6px 12px">${G.stageGoals().map(g => `<div class="swing" style="grid-template-columns:auto 1fr auto"><span style="color:${g.ok ? 'var(--green)' : 'var(--text-3)'}">${ic(g.ok ? 'check' : 'target', 'sm')}</span><span class="${g.ok ? 'muted' : ''}" style="${g.ok ? 'text-decoration:line-through' : ''}">${g.t}</span><span class="tiny muted">${g.p || ''}</span></div>`).join('')}</div>
      <button class="btn block mt16 pulse" id="go">${ic('planner')} Hafta ${s.turn} ki Yojana</button>`);
    on(el, '[data-pg]', 'click', (e, n) => pageSheet(+n.dataset.pg));
    on(el, '#go', 'click', () => UI.planner());
  }

  function pageSheet(n) {
    const s = S(), b = s.booth, p = b.pages.find(x => x.n === n), t = DATA.TOLAS.find(x => x.id === p.tola);
    const ws = [...b.workers].sort((a, c) => (c.tola === p.tola) - (a.tola === p.tola) || c.loyal - a.loyal);
    const o = overlay(`<div class="sheet"><div class="grab"></div>
      <div class="row between"><div><div class="eyebrow">Panna ${n} · ${t.name}</div><div class="h2">Panna Pramukh chuno</div></div><span class="chip">${ic('users', 'sm')}30 matdata</span></div>
      ${(p.missing || p.deleted) ? `<div class="tip mt12">${ic('alert')}<div>${p.missing} naam chhoote, ${p.deleted} kate. ${G2.suchiOpen() ? 'Matdata Suchi Camp se theek karo.' : 'Suchi band ho chuki.'}</div></div>` : ''}
      <div class="tiny muted mt12">Har karyakarta max ${G2.MAX_PAGES_PER_WORKER} panne. Apne tola ka karyakarta poora asar deta hai.</div>
      <div class="col mt8" style="gap:6px">${p.pp ? `<button class="wk" data-w=""><div class="av" style="background:#444">${ic('x', 'sm')}</div><div class="grow small">Panna khaali karo</div></button>` : ''}
        ${ws.map(w => { const full = G2.pagesOf(w) >= G2.MAX_PAGES_PER_WORKER && p.pp !== w.id; return `<button class="wk ${p.pp === w.id ? 'sel' : ''} ${full ? 'full' : ''}" data-w="${w.id}"><div class="av" style="background:${wcol(w)}">${initials(w.name)}</div><div class="grow"><div class="small" style="font-weight:700">${w.name}</div><div class="tiny muted">${G.tolaName(w.tola)}${w.tola === p.tola ? ' · <span style="color:#6ff0a1">apna tola</span>' : ''} · ${G2.pagesOf(w)}/${G2.MAX_PAGES_PER_WORKER}</div></div>${p.pp === w.id ? ic('check') : ''}</button>`; }).join('')}</div></div>`);
    o.addEventListener('click', (e) => { if (e.target === o) o.remove(); });
    on(o, '[data-w]', 'click', (e, bt) => {
      if (!G2.assign(n, bt.dataset.w)) return toast('Is karyakarta ke paas pehle se 2 panne hain', 'alert');
      G.sfx.card(); o.remove(); boothHome();
    });
  }

  function announce() {
    const s = S(), e = s.election; G.sfx.sting();
    const txt = e.kind === 'assembly'
      ? 'Vidhan Sabha chunav ka elaan! Aachar Sanhita lagu. Aap ummeedwar nahi hain: aapka kaam hai Booth 117 pe party ka vote badhana. Har panne pe Panna Pramukh, aur suchi mein har naam.'
      : 'Panchayat chunav! Ward 4 (Purab Tola aur Bazaar) se Ward Panch ka chunav. Is baar aap khud maidan mein hain. Gaon ke chunav party nishaan pe nahi hote, par party chupchaap saath degi. Saamne: Bunty Bhaiya.';
    const o = overlay(`<div class="ev paper"><div class="ev-art">${ART.eventArt('election')}<span class="rar r2">${e.kind === 'assembly' ? 'VIDHAN SABHA' : 'PANCHAYAT'}</span></div>
      <div class="ev-body"><div class="ev-title">${e.name}!</div><div class="ev-text">${txt}</div>
      <div class="tip" style="background:#fff;color:var(--ink);border-color:#e2d3b0">${ic('target')}<div>Matdaan ${e.left} hafte mein. ${e.kind === 'assembly' ? `Lakshya: ${G2.BASELINE + 10}% party vote.` : 'Jan Samarthan, Panna Pramukh aur Josh se jeet milegi.'}</div></div>
      <button class="btn block mt12" id="ok">${ic('fist')} Taiyaar!</button></div></div>`);
    on(o, '#ok', 'click', () => { o.remove(); UI.home(); });
  }

  const faceOf = (c) => DATA.PEOPLE.find(x => x.id === c.face && c.face !== 'bunty') ? ART.face(DATA.PEOPLE.find(x => x.id === c.face), 50) : c.face === 'player' ? ART.face({ id: 'player', col: '#ffb627', f: S().gender === 'f' }, 50)
    : c.face === 'bunty' ? ART.face(DATA.PEOPLE[0], 50)
    : c.face === 'party' ? `<div style="width:100%;height:100%;display:grid;place-items:center;background:${c.col};color:#fff">${ic('flag', 'lg')}</div>`
    : `<div style="width:100%;height:100%;display:grid;place-items:center;color:var(--text-3)">${ic('x', 'lg')}</div>`;

  function counting(res) {
    const el = mount(`<div style="background:var(--red);color:#fff;font-family:var(--f-head);font-weight:800;padding:8px 12px;display:flex;gap:8px;align-items:center"><span style="background:#fff;color:var(--red);padding:0 6px;border-radius:4px;font-size:11px">LIVE</span>SANSANI TV · MATGANANA</div>
      <div class="scroll"><div class="round" id="rnd">Matdaan khatam · Ginti shuru</div><div class="h2 center mt8">${res.title}</div>
      <div class="wall mt16">${res.cands.map((c, k) => `<div class="cand" id="c${k}"><div class="face">${faceOf(c)}</div><div class="grow"><div class="h3">${c.name}</div><div class="tiny muted">${c.sub}</div></div><div class="votes" id="v${k}">0</div>${k < 2 ? `<i class="vbar" id="b${k}" style="background:${k ? 'var(--red)' : 'var(--gold)'};width:0"></i>` : ''}</div>`).join('')}</div>
      <div class="col mt16" id="log"></div><div id="final" class="mt16"></div></div>
      <div class="foot"><button class="btn block" id="nx" disabled>Kyun jeete, kyun haare ${ic('chevR')}</button></div>`, 'studio');
    const tot = [0, 0, 0]; let i = 0;
    const step = () => {
      if (i >= res.rounds.length) return finish();
      const rd = res.rounds[i]; rd.v.forEach((v, k) => tot[k] += v);
      el.querySelector('#rnd').textContent = `Round ${i + 1} / ${res.rounds.length} · ${rd.name}`;
      tot.forEach((v, k) => el.querySelector('#v' + k).textContent = v);
      const sum = Math.max(1, tot[0] + tot[1] + tot[2]);
      [0, 1].forEach(k => el.querySelector('#b' + k).style.width = tot[k] / sum * 100 + '%');
      el.querySelector('#c0').classList.toggle('lead', tot[0] > tot[1]); el.querySelector('#c1').classList.toggle('lead', tot[1] > tot[0]);
      el.querySelector('#log').insertAdjacentHTML('afterbegin', `<div class="tip">${ic(rd.v[0] >= rd.v[1] ? 'up' : 'down')}<div><b>${rd.name}:</b> ${rd.v[0]} · ${rd.v[1]} · ${rd.v[2]}</div></div>`);
      G.sfx.tick(); G.buzz(15); i++; setTimeout(step, 1300);
    };
    const finish = () => {
      el.querySelector('#rnd').textContent = 'Antim parinaam';
      const f = el.querySelector('#final');
      if (res.kind === 'assembly') f.innerHTML = `<div class="bigmsg ${res.won ? 'gold-text' : ''}" style="${res.won ? '' : 'color:#ff8b8b'}">${res.lift >= 0 ? '+' : ''}${res.lift.toFixed(1)}</div><div class="center muted mt8">Booth pe party vote ${res.share.toFixed(1)}% (pichhla ${G2.BASELINE}%). ${res.won ? 'Lakshya poora!' : 'Lakshya se chooke.'} ${res.partyWon ? 'Booth pe party aage rahi.' : 'Booth pe party peeche rahi.'}</div>`;
      else f.innerHTML = res.won ? `<div class="bigmsg gold-text">${res.winTitle || 'WARD PANCH!'}</div><div class="center muted mt8">${res.winSub || `${res.totals[0] - res.totals[1]} vote se jeet. Pehla nirvachit pad.`}</div>` : `<div class="bigmsg" style="color:#ff8b8b">HAAR GAYE</div><div class="center muted mt8">${res.loseSub || `Bunty ${res.totals[1] - res.totals[0]} vote se aage. Booth abhi bhi aapka hai.`}</div>`;
      if (res.won) { G.sfx.win(); confetti(110); garland(); } else G.sfx.lose();
      el.querySelector('#nx').disabled = false;
    };
    setTimeout(step, 1200);
    on(el, '#nx', 'click', () => breakdown(res));
  }

  function breakdown(res) {
    const el = mount(`<div class="scroll"><div class="center mt16"><div class="eyebrow">Vishleshan</div><div class="h1 mt8">${res.won ? 'Kyun <span class="gold-text">jeete</span>' : 'Kyun <span style="color:#ff8b8b">haare</span>'}</div>
      <div class="row mt12" style="justify-content:center"><span class="chip gold">${ic('ballot', 'sm')}${res.totals[0]} - ${res.totals[1]}</span><span class="chip">${ic('x', 'sm')}${res.cands[2].name.split(' ')[0]} ${res.totals[2]}</span></div></div>
      <div class="sec"><div class="h3">${ic('map')} Tola-war nateeja</div><span class="tiny muted">Panna coverage</span></div>
      <div class="panel">${res.rounds.map(r => `<div class="swing" style="grid-template-columns:1fr auto auto auto"><span>${r.name}</span><span class="small" style="color:var(--gold)">${r.v[0]}</span><span class="small" style="color:#ff8b8b">${r.v[1]}</span><span class="tiny muted">${Math.round(r.cov * 100)}%</span></div>`).join('')}</div>
      <div class="sec"><div class="h3">${ic('target')} 3 chaalein jo farak laatin</div></div>
      <div class="col">${res.analysis.map(t => `<div class="tip">${ic('spark')}<div>${t}</div></div>`).join('')}</div>
      </div><div class="foot"><button class="btn block ${res.won ? 'green' : ''}" id="nx">${res.won ? ic('flag') + ' Aage badho' : ic('refresh') + ' Phir se ladenge'}</button></div>`);
    on(el, '#nx', 'click', () => { UI.setTab('kshetra'); UI.home(); });
  }

  function stageEnd() {
    const s = S(), panch = s.rank >= 2; G.sfx.win(); confetti(90);
    const el = mount(`<div class="scroll"><div class="center mt24"><div class="avatar" style="margin:0 auto;width:80px;height:80px">${ic(panch ? 'ballot' : 'flag', 'xl')}<span class="lvl">${s.rank}</span></div>
      <div class="eyebrow mt16">Stage 2 poora</div><div class="h1 mt8 gold-text">${DATA.RANKS[s.rank]}</div>
      <div class="small muted mt8">${panch ? 'Booth bhi aapka, ward bhi aapka. Ab gaon Pradhan ki kursi ki taraf dekh raha hai.' : 'Booth ka kaam laajawaab raha, par ward haath se gaya. Pradhan ka raasta ab bhi khula hai.'}</div></div>
      <div class="statgrid mt16"><div class="stat"><div class="k">${ic('ballot', 'sm')}Booth lift</div><div class="v">${s.booth.lift >= 0 ? '+' : ''}${s.booth.lift.toFixed(1)}</div></div><div class="stat"><div class="k">${ic('book', 'sm')}Naye matdata</div><div class="v">${s.booth.enrolled}</div></div>
        <div class="stat"><div class="k">${ic('flag', 'sm')}Aadesh poore</div><div class="v">${s.booth.ordersDone}</div></div><div class="stat"><div class="k">${ic('flower', 'sm')}Maala</div><div class="v">${s.maala}</div></div></div>
      <div class="hook mt16"><div class="eyebrow" style="color:var(--pink)">${ic('alert', 'sm')} Aage...</div><div class="q">"Stage 3: Gram Pradhan. Panchayat ka paisa, Gram Sabha, aur Bunty ke chacha ki kursi."</div></div>
      </div><div class="foot col"><button class="btn green block pulse" id="s3">${ic('flag')} Stage 3: Panchayat shuru karo</button><button class="btn ghost block" id="kb">${ic('book')} Career book</button></div>`);
    const ack = (t) => { s.s2ack = true; G.save(); UI.setTab(t); UI.home(); };
    on(el, '#kb', 'click', () => ack('kitab')); on(el, '#s3', 'click', () => { s.s2ack = true; G3.init(); G.sfx.dhol(); UI.setTab('kshetra'); UI.home(); setTimeout(() => UI3.intro(), 400); });
  }

  return { boothHome, pageSheet, announce, counting, breakdown, stageEnd };
})();
