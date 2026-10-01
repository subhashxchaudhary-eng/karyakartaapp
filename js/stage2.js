/* Neta — Stage 2: Booth Adhyaksh (GDD section 4).
   Voter list, Panna Pramukh, booth committee balance, party orders, poaching, assembly + Ward Panch polls. */
window.G2 = (() => {
  const PAGES_PER_TOLA = 10, PAGE_SIZE = 30, BASELINE = 36, MAX_PAGES_PER_WORKER = 2;
  const S = () => G.S;
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const T = () => DATA.TOLAS;
  let nextId = 1;

  function newWorker(tola, f) {
    const b = S().booth, used = new Set(b.workers.map(w => w.name));
    const pool = DATA.WORKER_NAMES[f ? 'f' : 'm'].filter(n => !used.has(n));
    const name = pool.length ? G.pick(pool) : (f ? 'Didi' : 'Bhaiya') + ' ' + (b.workers.length + 1);
    const w = { id: 'w' + (nextId = Math.max(nextId, b.workers.length + 1) + 1), name, tola, f: !!f, loyal: Math.round(G.rnd(55, 80)) };
    b.workers.push(w); return w;
  }

  function init() {
    const s = S();
    const pages = [];
    T().forEach(t => { for (let i = 0; i < PAGES_PER_TOLA; i++) pages.push({ n: pages.length + 1, tola: t.id, pp: null, missing: Math.round(G.rnd(0, 2)), deleted: Math.random() < .3 ? Math.round(G.rnd(1, 3)) : 0 }); });
    // party vote by tola: player's personal goodwill helps the party a little
    const pv = {}, rv = {};
    T().forEach(t => { pv[t.id] = clamp(BASELINE - 3 + (s.jan[t.id] - 50) / 10 + G.rnd(-2, 2), 25, 45); rv[t.id] = clamp(42 + G.rnd(-3, 3)); });
    s.booth = { no: 117, pages, pv, rv, workers: [], enrolled: 0, suchiUntil: s.turn + 7, order: null, ordersDone: 0, ordersFailed: 0,
      poach: null, assemblyAt: s.turn + 8, assemblyDone: false, lift: null, wardAt: null, wardDone: false, start: s.turn };
    const n = Math.max(6, Math.min(10, Math.round(s.members * .6)));
    newWorker('purab', true); // Sitara
    for (let i = 1; i < n; i++) newWorker(T()[i % 4].id, i % 4 === 0);
    s.booth.workers[0].name = 'Sitara';
    s.seen = s.seen.filter(x => !x.startsWith('mis:'));
    s.missions = [null, null, null]; s.election = null; s.stash = null;
    s.grudge = clamp(s.grudge + 10);
    G.addHeadline('Gaon Ki Awaaz', 'Bunty Bhaiya Jan Sangharsh Party mein shaamil, booth agent bane');
    newOrder(); G.fillMissions(); G.save();
  }

  // ---------- derived ----------
  const pagesOf = (w) => S().booth.pages.filter(p => p.pp === w.id).length;
  const assigned = () => S().booth.pages.filter(p => p.pp).length;
  function coverage(tola) {
    const b = S().booth, ps = b.pages.filter(p => p.tola === tola);
    return ps.reduce((a, p) => { if (!p.pp) return a; const w = b.workers.find(x => x.id === p.pp); return a + (!w ? 0 : (w.tola === tola ? 1 : .6) * (.6 + w.loyal / 250)); }, 0) / ps.length;
  }
  function committee() {
    const b = S().booth, per = {};
    T().forEach(t => per[t.id] = b.workers.filter(w => w.tola === t.id).length);
    const women = b.workers.filter(w => w.f).length, size = b.workers.length;
    const tolaOk = Object.values(per).every(v => v >= 2), womenOk = women * 3 >= size;
    return { per, women, size, tolaOk, womenOk, ok: tolaOk && womenOk && size >= 10 };
  }
  const suchiOpen = () => S().turn <= S().booth.suchiUntil;
  const avgPv = () => Math.round(T().reduce((a, t) => a + S().booth.pv[t.id], 0) / 4);

  // ---------- party orders ----------
  function newOrder() {
    const b = S().booth, o = G.pick(DATA.ORDERS.filter(x => !b.order || x.id !== b.order.id));
    b.order = { ...o, prog: 0, due: S().turn + o.weeks };
  }

  // ---------- actions ----------
  function act(a, out, jb) {
    const s = S(), b = s.booth; if (!b) return;
    switch (a.id) {
      case 'suchi': {
        if (!suchiOpen()) { out.notes.push('Matdata suchi band ho chuki hai. Camp se sirf jaankari mili.'); G.apply({ jan: { [a.tola]: 1 } }, out); break; }
        let add = 0, rest = 0;
        b.pages.filter(p => p.tola === a.tola).forEach(p => { add += p.missing; rest += p.deleted; p.missing = 0; p.deleted = 0; });
        const youth = Math.round(G.rnd(1, 3) * jb); add += youth;
        b.enrolled += add; b.pv[a.tola] = clamp(b.pv[a.tola] + add / 8);
        G.apply({ jan: { [a.tola]: 2 }, sevak: 1 }, out);
        out.notes.push(`${G.tolaName(a.tola)}: ${add} naye naam jode${rest ? `, ${rest} kate naam bachaaye` : ''}.`);
        break;
      }
      case 'bharti': {
        const c = committee();
        if (c.size >= 20) { out.notes.push('Committee poori hai (20). Bharti ki jagah sampark hua.'); G.apply({ jan: { [a.tola]: 2 } }, out); break; }
        const w = newWorker(a.tola, Math.random() < .4);
        G.apply({ josh: 2 }, out); out.notes.push(`${w.name} (${G.tolaName(a.tola)}) booth committee mein shaamil.`);
        break;
      }
      case 'baithak': b.workers.forEach(w => w.loyal = clamp(w.loyal + 8)); G.apply({ josh: 8 }, out); out.notes.push('Baithak mein sabki baat suni gayi. Wafaadari badhi.'); break;
      case 'aadesh': {
        if (!b.order) newOrder();
        b.order.prog++; out.notes.push(`Aadesh "${b.order.t}": ${Math.min(b.order.prog, b.order.need)}/${b.order.need}`);
        if (b.order.prog >= b.order.need) { G.apply({ vishwas: b.order.rw, josh: 3 }, out); b.ordersDone++; out.notes.push('High command khush. Party Vishwas badha.'); G.addHeadline('Rashtriya Darpan', `Booth ${b.no} ne poora kiya party ka "${b.order.id}" lakshya`); newOrder(); }
        break;
      }
      case 'sampark': case 'nukkad': b.pv[a.tola] = clamp(b.pv[a.tola] + (a.id === 'nukkad' ? 2 : 1.2)); break;
    }
  }

  // ---------- weekly ----------
  function weekly(out) {
    const s = S(), b = s.booth, c = committee();
    // unbalanced committee: neglected tolas drift away
    T().forEach(t => { if (c.per[t.id] < 2) b.pv[t.id] = clamp(b.pv[t.id] - .8); });
    if (!c.womenOk) b.pv.purab = clamp(b.pv.purab - .4);
    // loyalty decays; ignored workers leave
    b.workers.forEach(w => w.loyal = clamp(w.loyal - (pagesOf(w) ? 1 : 3)));
    const gone = b.workers.filter(w => w.loyal < 20);
    gone.forEach(w => { b.pages.forEach(p => { if (p.pp === w.id) p.pp = null; }); out.notes.push(`${w.name} naraaz hoke chala gaya. Uske panne khaali.`); });
    b.workers = b.workers.filter(w => w.loyal >= 20);
    // order deadline
    if (b.order && s.turn >= b.order.due && b.order.prog < b.order.need) { G.apply({ vishwas: -5 }, out); b.ordersFailed++; out.notes.push(`Aadesh "${b.order.t}" adhoora. Mandal naraaz.`); newOrder(); }
    if (s.turn === b.suchiUntil) out.notes.push('Is hafte matdata suchi band ho gayi.');
  }
  function rivalAct(out) {
    const s = S(), b = s.booth, msg = [];
    const weak = T().map(t => ({ t: t.id, g: coverage(t.id) })).sort((x, y) => x.g - y.g)[0].t;
    const m = 1 + s.grudge / 120;
    b.rv[weak] = clamp(b.rv[weak] + 1.5 * m);
    msg.push(`Bunty ne ${G.tolaName(weak)} ke khaali panno mein JSP ke parche baante.`);
    if (s.election) { T().forEach(t => b.rv[t.id] = clamp(b.rv[t.id] + 1)); msg.push('Chunav ka mausam: JSP ki gaadiyan gaon mein ghoom rahi hain.'); }
    if (Math.random() < .3) { const w = G.pick(b.workers); if (w) { w.loyal = clamp(w.loyal - 10); msg.push(`${w.name} ko Bunty ne chai pe bulaya.`); } }
    return msg;
  }

  // ---------- events ----------
  function forcedEvents() {
    const s = S(), b = s.booth, out = [];
    if (!b.poach && s.turn >= b.start + 3 && !s.seen.includes('ev:poach2')) { out.push(DATA.EVENTS.find(e => e.id === 'poach2')); s.seen.push('ev:poach2'); }
    return out;
  }
  function fx(f, out) {
    const s = S(), b = s.booth;
    if (f.pv) Object.entries(f.pv).forEach(([t, v]) => b.pv[t] = clamp(b.pv[t] + v));
    if (f.enrol) b.enrolled += f.enrol;
    if (f.women) for (let i = 0; i < f.women; i++) newWorker(G.pick(T()).id, true);
    if (f.restore) { const n = f.restore === 'half' ? 12 : 25; b.enrolled += n; b.pv.kisan = clamp(b.pv.kisan + n / 10); }
    if (f.poach) {
      b.poach = f.poach;
      if (f.poach === 'lose') {
        const victims = [...b.workers].sort((x, y) => x.loyal - y.loyal).slice(0, 3);
        victims.forEach(w => b.pages.forEach(p => { if (p.pp === w.id) p.pp = null; }));
        b.workers = b.workers.filter(w => !victims.includes(w));
        T().forEach(t => b.rv[t.id] = clamp(b.rv[t.id] + 1));
      } else b.workers.forEach(w => w.loyal = clamp(w.loyal + (f.poach === 'keep' ? 10 : 4)));
    }
  }

  // ---------- missions & goals ----------
  function progress(k) {
    const b = S().booth; if (!b) return null;
    if (k === 'pages') return assigned();
    if (k === 'enrolled') return b.enrolled;
    if (k === 'balanced') return committee().ok ? 1 : 0;
    if (k === 'lift') return b.lift == null ? 0 : Math.max(0, Math.round(b.lift));
    return null;
  }
  function goals() {
    const b = S().booth; if (!b) return [];
    return [
      { t: 'Booth pe party vote 10 point badhao', ok: b.lift != null && b.lift >= 10, opt: b.byPending === 'used' && b.assemblyDone, p: b.lift == null ? 'Chunav baaki' : b.byPending === 'used' && b.lift < 10 ? 'Chooke' : `${b.lift >= 0 ? '+' : ''}${Math.round(b.lift)}` },
      { t: '50 naye matdata jodo', ok: b.enrolled >= 50, p: `${Math.min(50, b.enrolled)}/50` },
      { t: 'Karyakarta todne ki koshish naakaam karo', ok: b.poach === 'keep' || b.poach === 'buy', opt: b.poach === 'lose', p: b.poach === 'lose' ? 'Haare' : '' },
      { t: 'Ward Panch jeeto (vaikalpik)', ok: S().rank >= 2, opt: true, p: b.wardDone ? (S().rank >= 2 ? '' : 'Haare') : '' },
    ];
  }

  // ---------- elections ----------
  function schedule() {
    const s = S(), b = s.booth;
    if (s.election) { s.election.left--; return false; }
    if (!b.assemblyDone && s.turn >= b.assemblyAt - 4) {
      s.election = { left: 4, kind: 'assembly', name: b.byElection ? 'Vidhan Sabha Up-chunav' : 'Vidhan Sabha Chunav', spend: 0 };
      G.addHeadline('Sansani TV', 'Vidhan Sabha chunav ka elaan! Aachar Sanhita lagu');
      return true;
    }
    if (b.assemblyDone && b.wardDone && b.lift < 10 && !b.byPending) { // missed the target: a by-election gives one more shot
      b.byPending = true; b.assemblyDone = false; b.assemblyAt = s.turn + 6; b.suchiUntil = s.turn + 3; b.byElection = true;
      G.addHeadline('Sansani TV', 'Vidhayak ki seat khaali: 6 hafte mein up-chunav');
      return false;
    }
    if (b.assemblyDone && !b.wardDone && b.wardAt && s.turn >= b.wardAt) {
      s.election = { left: 3, kind: 'ward', name: 'Ward Panch Chunav', spend: 0 };
      G.addHeadline('Gaon Ki Awaaz', `Panchayat chunav: Ward 4 mein ${s.name} banaam Bunty Bhaiya`);
      return true;
    }
    return false;
  }

  function runElection() {
    const s = S(), b = s.booth, kind = s.election.kind;
    const res = kind === 'assembly' ? assembly() : ward();
    s.election = null; G.checkMissions({ d: {}, missionsDone: [] }); G.fillMissions(); G.save();
    return res;
  }
  function assembly() {
    const s = S(), b = s.booth, rounds = [];
    const party = s.party === 'jsp' ? 'Jan Sangharsh Party' : 'Rashtriya Pragati Morcha';
    let P = 0, R = 0, O = 0;
    const enrolPer = b.enrolled / 4;
    T().forEach(t => {
      const cov = coverage(t.id), voters = PAGES_PER_TOLA * PAGE_SIZE;
      const tp = clamp(.38 + cov * .62 + s.josh / 500 + G.rnd(-.03, .03), .3, .97);
      const p = Math.round(voters * b.pv[t.id] / 100 * tp + enrolPer * .5 * (.5 + cov / 2));
      const r = Math.round(voters * b.rv[t.id] / 100 * (.6 + G.rnd(-.03, .03)));
      const o = Math.round(voters * Math.max(5, 100 - b.pv[t.id] - b.rv[t.id]) / 100 * .5);
      rounds.push({ name: G.tolaName(t.id), v: [p, r, o], cov });
      P += p; R += r; O += o;
    });
    const share = P / (P + R + O) * 100, thisLift = share - BASELINE;
    b.lift = Math.max(b.lift ?? -99, share - BASELINE); b.assemblyDone = true; if (!b.wardDone) b.wardAt = s.turn + 3; b.byPending = b.byElection ? 'used' : b.byPending; s.stageSeenLift = true;
    const won = P > R;
    G.addHeadline('Rashtriya Darpan', `Booth ${b.no}: ${party} ko ${share.toFixed(1)}% vote (${thisLift >= 0 ? '+' : ''}${thisLift.toFixed(1)}). Booth Adhyaksh ${s.name} ki taarif`);
    if (thisLift >= 10) G.apply({ vishwas: 12, josh: 10, maala: 6 });
    else G.apply({ vishwas: thisLift > 0 ? 3 : -5 });
    const tips = [];
    const worst = [...rounds].sort((x, y) => x.cov - y.cov)[0];
    tips.push(`${worst.name} mein sirf ${Math.round(worst.cov * 100)}% panne sambhale gaye. Wahan Panna Pramukh hote to turnout badhta.`);
    if (b.enrolled < 50) tips.push(`Sirf ${b.enrolled} naye matdata jude. Suchi band hone se pehle zyada camp lagte to aur vote milte.`);
    if (!committee().ok) tips.push('Committee santulit nahi thi. Jis tola ka koi apna nahi, wo party se door hota hai.');
    if (b.poach === 'lose') tips.push('Bunty ne jo karyakarta todhe, unke panne polling ke din khaali rahe.');
    if (tips.length < 3) tips.push('Booth Committee Baithak se wafaadari aur Josh dono badhte hain; dono turnout laate hain.');
    return { kind: 'assembly', title: 'Vidhan Sabha · Booth ' + b.no, won: thisLift >= 10, partyWon: won,
      cands: [{ name: party, sub: 'Aapki party', face: 'party', col: s.party === 'jsp' ? '#2a7de1' : '#ff8a1f' }, { name: s.party === 'jsp' ? 'Rashtriya Pragati Morcha' : 'Jan Sangharsh Party', sub: 'Booth agent: Bunty Bhaiya', face: 'bunty' }, { name: 'Anya / NOTA', sub: '', face: 'x' }],
      rounds, totals: [P, R, O], share, lift: thisLift, analysis: tips.slice(0, 3) };
  }
  function ward() {
    const s = S(), b = s.booth, rounds = [];
    const fit = (s.chhavi.sevak + s.chhavi.imaan) / 200 - s.heat / 200;
    let P = 0, R = 0, N = 0;
    ['purab', 'bazaar'].forEach(id => {
      const t = T().find(x => x.id === id), voters = 220, cov = coverage(id);
      const Up = s.jan[id] / 12 + fit + cov * 1.2 + (b.pv[id] - 36) / 15 + G.rnd(-.3, .3);
      const Ur = b.rv[id] / 12 + 1.6 + s.grudge / 200 + G.rnd(-.3, .3);
      const ex = [Math.exp(Up / 2.2), Math.exp(Ur / 2.2), Math.exp(1.2 / 2.2)], z = ex[0] + ex[1] + ex[2];
      const turnout = clamp(.6 + s.josh / 400 + cov * .1, .4, .95), v = Math.round(voters * turnout);
      const p = Math.round(v * ex[0] / z), r = Math.round(v * ex[1] / z), n = Math.max(0, v - p - r);
      rounds.push({ name: t.name, v: [p, r, n], cov }); P += p; R += r; N += n;
    });
    if (P === R) P++;
    const won = P > R; b.wardDone = true;
    if (won) { s.rank = 2; s.electionsWon++; s.maala += 15; G.apply({ vishwas: 8, josh: 10 }); G.addHeadline('Gaon Ki Awaaz', `Ward 4 ke naye Panch ${s.name}; Bunty Bhaiya ${P - R} vote se haare`); }
    else { G.addHeadline('Khabar Fatafat', `Ward Panch chunav: Bunty Bhaiya jeete, ${s.name} bole "booth abhi bhi hamara"`); G.apply({ josh: -8 }); }
    const tips = [];
    const w = [...rounds].sort((x, y) => (x.v[0] - x.v[1]) - (y.v[0] - y.v[1]))[0];
    tips.push(`${w.name} mein antar sabse kam raha (${w.v[0]} banaam ${w.v[1]}).`);
    tips.push(s.chhavi.sevak < 55 ? 'Jan Sevak chhavi badhti to buzurg aur mahilayein zyada saath aate.' : 'Jan Sevak chhavi ne kaam kiya.');
    tips.push(s.heat > 25 ? 'Heat ne kuch matdataon ko NOTA ki taraf dhakela.' : 'Saaf chhavi ne NOTA ko kam rakha.');
    return { kind: 'ward', title: 'Ward Panch · Ward 4', won,
      cands: [{ name: s.name, sub: 'Aap (party samarthit)', face: 'player' }, { name: 'Bunty Bhaiya', sub: 'JSP samarthit', face: 'bunty' }, { name: 'NOTA / Khaali', sub: '', face: 'x' }],
      rounds, totals: [P, R, N], analysis: tips };
  }

  function teaser() {
    const s = S(), b = s.booth; if (!b) return null;
    if (s.election && s.election.left === 1) return s.election.kind === 'assembly' ? 'Kal matdaan. Har Panna Pramukh ko subah 6 baje booth pe hona hai...' : 'Kal Ward 4 ka faisla. Bunty ne raat mein meeting bulayi hai...';
    if (suchiOpen() && b.suchiUntil - s.turn <= 2) return `Matdata suchi ${b.suchiUntil - s.turn + 1} hafte mein band ho jaayegi...`;
    if (b.order && b.order.due - s.turn <= 1 && b.order.prog < b.order.need) return `High command ka aadesh "${b.order.t}" ki deadline sar pe hai...`;
    return Math.random() < .6 ? G.pick(DATA.TEASERS2) : null;
  }

  function estimate() { // deterministic forecast of party share at the booth (shown as "anumaan")
    const s = S(), b = s.booth; let P = 0, R = 0, O = 0;
    T().forEach(t => { const cov = coverage(t.id), v = PAGES_PER_TOLA * PAGE_SIZE;
      P += v * b.pv[t.id] / 100 * clamp(.38 + cov * .62 + s.josh / 500, .3, .97) + b.enrolled / 4 * .5 * (.5 + cov / 2);
      R += v * b.rv[t.id] / 100 * .6; O += v * Math.max(5, 100 - b.pv[t.id] - b.rv[t.id]) / 100 * .5; });
    return P / (P + R + O) * 100;
  }

  // ---------- UI-facing commands ----------
  function assign(pageN, wid) {
    const b = S().booth, p = b.pages.find(x => x.n === pageN);
    if (wid && pagesOf(b.workers.find(w => w.id === wid)) >= MAX_PAGES_PER_WORKER && p.pp !== wid) return false;
    p.pp = wid || null; G.checkMissions({ d: {}, missionsDone: [] }); G.save(); return true;
  }

  return { init, act, weekly, rivalAct, forcedEvents, fx, progress, goals, schedule, runElection, teaser, assign,
    coverage, committee, estimate, pagesOf, assigned, suchiOpen, avgPv, BASELINE, MAX_PAGES_PER_WORKER };
})();
