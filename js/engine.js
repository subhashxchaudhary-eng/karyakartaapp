/* Neta — game state, simulation, election engine, audio & haptics. */
window.G = (() => {
  const SAVE_KEY = 'neta.save.v1', SET_KEY = 'neta.settings.v1';
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ELECTION_ANNOUNCE = 3, ELECTION_LEN = 5;

  let S = null;
  const settings = Object.assign({ sound: true, haptics: true }, safeGet(SET_KEY) || {});

  function safeGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } }

  function newGame(p) {
    const bg = DATA.BACKGROUNDS.find(b => b.id === p.bg), st = bg.start;
    const jan = {}, rival = {};
    DATA.TOLAS.forEach(t => { jan[t.id] = clamp(t.base + (st.jan[t.id] || 0)); rival[t.id] = t.rival; });
    S = {
      v: 1, name: p.name, gender: p.gender, bg: p.bg, state: p.state, age: 21,
      turn: 1, year: 2001, week: 22, rank: 0, stage: 1,
      paisa: st.paisa, kaala: 0, heat: st.heat || 0, vishwas: st.vishwas, josh: st.josh, members: st.members,
      chhavi: { vikas: st.vikas, sevak: st.sevak, dabang: st.dabang, imaan: st.imaan },
      jan, rival, grudge: 10, maala: 0, samayMax: 7,
      rishte: Object.fromEntries(DATA.PEOPLE.map(x => [x.id, x.rel])),
      problems: Object.fromEntries(DATA.PROBLEMS.map(x => [x.id, 0])), solved: 0,
      missions: [null, null, null], counters: {}, seeds: [], seen: [],
      headlines: [{ s: 'Gaon Ki Awaaz', t: `${p.name} ne banaya Yuva Mandal, 3 doston ke saath shuruaat`, turn: 1 }],
      election: null, electionsWon: 0, aides: [], intel: null, cricketDone: false, history: [],
      lastSnap: null, stageDone: false, party: null,
    };
    fillMissions(); save();
    return S;
  }

  function load() { S = safeGet(SAVE_KEY); return S; }
  function save() { if (S) safeSet(SAVE_KEY, S); }
  function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch {} S = null; }
  function saveSettings() { safeSet(SET_KEY, settings); }

  // ---------- derived ----------
  const avgJan = () => Math.round(DATA.TOLAS.reduce((a, t) => a + S.jan[t.id] * t.size, 0) / DATA.TOLAS.reduce((a, t) => a + t.size, 0));
  const dateLabel = () => { const m = Math.min(11, Math.floor((S.week - 1) / 4.35)); return `${MONTHS[m]} ${S.year}`; };
  const heatLevel = () => S.heat < 25 ? 0 : S.heat < 50 ? 1 : S.heat < 75 ? 2 : 3;
  const heatHint = () => ['Sab shaant hai.', 'Ek patrakar tumhare baare mein pooch raha tha...', 'Block office mein tumhari file khuli hai.', 'Thane ka munshi keh raha tha: "Sambhal ke."'][heatLevel()];
  const samayMax = () => S.samayMax + (S.aides.includes('pa') ? 1 : 0);

  // ---------- missions ----------
  function fillMissions() {
    if (S.election && !(S.missions[1] && S.missions[1].elec)) {
      if (S.missions[1] && !S.missions[1].done) S.stash = S.missions[1];
      S.missions[1] = { id: 'elec', elec: true, t: S.stage === 2 ? `${S.election.name}: booth sambhalo` : 'School Committee chunav jeeto', k: 'elec', n: 1, p: 0, rw: { maala: 1 } };
    }
    if (!S.election && S.missions[1] && S.missions[1].elec) { S.missions[1] = S.stash || null; S.stash = null; }
    for (let slot = 0; slot < 3; slot++) {
      if (S.missions[slot] && !S.missions[slot].done) continue;
      const pool = (S.stage === 2 ? DATA.MISSION_POOL2 : DATA.MISSION_POOL)[slot].filter(m => !(S.missions[slot] && S.missions[slot].id === m.id) && !S.seen.includes('mis:' + m.id));
      const m = pool.length ? pick(pool) : null;
      S.missions[slot] = m ? { ...m, p: 0, done: false, base: slot === 0 ? 0 : undefined } : null;
      if (m && slot > 0) S.seen.push('mis:' + m.id);
    }
  }
  function missionProgress(m) {
    if (!m) return 0;
    if (m.k.startsWith('act:')) return S.counters[m.k] || 0;
    if (m.k === 'members') return S.members;
    if (m.k === 'solved') return S.solved;
    if (m.k === 'vishwas') return S.vishwas;
    if (m.k === 'elec') return S.stage === 2 ? 0 : (S.electionsWon ? 1 : 0);
    if (window.G2 && S.booth) { const v = G2.progress(m.k); if (v != null) return v; }
    return 0;
  }
  function checkMissions(out) {
    S.missions.forEach((m, i) => {
      if (!m || m.done) return;
      m.p = missionProgress(m);
      if (m.p >= m.n) {
        m.done = true;
        apply(m.rw, out);
        out.missionsDone.push(m.t);
      }
    });
    if (stageGoals().every(g => g.ok || g.opt)) S.stageDone = S.stage === 2 ? !!(S.booth && S.booth.wardDone) : true;
  }
  // Stage 1 checklist (GDD section 4)
  function stageGoals() {
    if (S.stage === 2 && window.G2) return G2.goals();
    return [
      { t: 'Yuva Mandal banao', ok: true },
      { t: '15 sadasya tak badhao', ok: S.members >= 15, p: `${Math.min(S.members, 15)}/15` },
      { t: 'Gaon ki 3 samasyaein hal karo', ok: S.solved >= 3, p: `${Math.min(S.solved, 3)}/3` },
      { t: 'Ek saarvajanik aayojan (Cricket ya Tyohaar)', ok: S.cricketDone || S.history.some(h => h.ev === 'holi' && h.c === 0) },
      { t: 'School Committee chunav jeeto', ok: S.electionsWon > 0 },
      { t: 'Mandal Adhyaksh ki nazar (Vishwas 50)', ok: S.vishwas >= 50 },
    ];
  }

  // ---------- effects ----------
  function apply(fx, out = { d: {} }) {
    if (!fx) return out;
    const d = out.d || (out.d = {});
    const add = (k, v) => d[k] = (d[k] || 0) + v;
    if (fx.paisa) { S.paisa = Math.max(0, S.paisa + fx.paisa); add('Paisa', fx.paisa); }
    if (fx.kaala) { S.kaala += fx.kaala; add('Kaala Paisa', fx.kaala); }
    if (fx.heat) { S.heat = clamp(S.heat + fx.heat); add('Heat', fx.heat); }
    if (fx.josh) { S.josh = clamp(S.josh + fx.josh); add('Josh', fx.josh); }
    if (fx.members) { S.members = Math.max(1, S.members + fx.members); add('Sadasya', fx.members); }
    if (fx.vishwas) { S.vishwas = clamp(S.vishwas + fx.vishwas); add('Party Vishwas', fx.vishwas); }
    if (fx.maala) { S.maala += fx.maala; add('Maala', fx.maala); }
    if (fx.grudge) S.grudge = clamp(S.grudge + fx.grudge);
    if (fx.samay) out.samayDelta = (out.samayDelta || 0) + fx.samay;
    ['vikas', 'sevak', 'dabang', 'imaan'].forEach(k => { if (fx[k]) { S.chhavi[k] = clamp(S.chhavi[k] + fx[k]); add(CHHAVI_NAME[k], fx[k]); } });
    if (fx.janAll) { DATA.TOLAS.forEach(t => S.jan[t.id] = clamp(S.jan[t.id] + fx.janAll)); add('Jan Samarthan', fx.janAll); }
    if (fx.jan) Object.entries(fx.jan).forEach(([t, v]) => { S.jan[t] = clamp(S.jan[t] + v); add('Jan Samarthan', Math.round(v * tolaWeight(t))); });
    if (fx.rishte) Object.entries(fx.rishte).forEach(([p, v]) => S.rishte[p] = clamp(S.rishte[p] + v, -100, 100));
    if (fx.solve) solveProblem(fx.solve, out);
    if (fx.seed) S.seeds.push({ id: fx.seed, at: S.turn + 2 });
    return out;
  }
  const CHHAVI_NAME = { vikas: 'Vikas Purush', sevak: 'Jan Sevak', dabang: 'Dabang', imaan: 'Imaandar' };
  const tolaWeight = (id) => DATA.TOLAS.find(t => t.id === id).size / 10;

  function solveProblem(id, out) {
    const pr = DATA.PROBLEMS.find(p => p.id === id);
    if (!pr || S.problems[id] >= pr.need) return;
    S.problems[id] = pr.need; S.solved++;
    S.jan[pr.tola] = clamp(S.jan[pr.tola] + 10); S.chhavi.sevak = clamp(S.chhavi.sevak + 4);
    const t = DATA.TOLAS.find(x => x.id === pr.tola).name;
    addHeadline('Gaon Ki Awaaz', `${pr.name}: ${t} ki samasya hal, shrey ${S.name} ko`);
    (out.notes || (out.notes = [])).push(`${pr.name} — hal ho gaya! ${t} khush.`);
  }
  function addHeadline(s, t) { S.headlines.unshift({ s, t, turn: S.turn }); }
  const openProblem = (tola) => DATA.PROBLEMS.find(p => p.tola === tola && S.problems[p.id] < p.need);

  // ---------- turn resolution ----------
  function resolveTurn(plan) { // plan: [{id, tola}]
    S.lastSnap = { jan: { ...S.jan }, paisa: S.paisa, josh: S.josh, members: S.members, vishwas: S.vishwas, avg: avgJan() };
    const out = { d: {}, notes: [], missionsDone: [] };
    plan.forEach(a => {
      const A = DATA.ACTIONS.find(x => x.id === a.id);
      S.counters['act:' + a.id] = (S.counters['act:' + a.id] || 0) + 1;
      if (A.cost) apply({ paisa: -A.cost }, out);
      const jb = 1 + (S.josh - 50) / 200; // josh multiplies ground work
      switch (a.id) {
        case 'sampark': apply({ jan: { [a.tola]: Math.round(rnd(3, 5) * jb) }, sevak: 1 }, out); break;
        case 'nukkad': apply({ jan: { [a.tola]: Math.round(rnd(5, 8) * jb) }, josh: 4, dabang: 1 }, out); break;
        case 'samasya': {
          const pr = openProblem(a.tola);
          if (pr) {
            S.problems[pr.id]++;
            if (S.problems[pr.id] >= pr.need) { S.problems[pr.id] = pr.need - 1; solveProblem(pr.id, out); }
            else { apply({ jan: { [a.tola]: 3 }, sevak: 2 }, out); out.notes.push(`${pr.name}: kaam shuru, ek kadam aur.`); }
          } else apply({ jan: { [a.tola]: 2 }, sevak: 1 }, out);
          break;
        }
        case 'group': apply({ members: Math.round(rnd(1, 3) + (S.josh > 60 ? 1 : 0)), josh: 2 }, out); break;
        case 'chai': apply({ vishwas: Math.round(rnd(4, 7)), rishte: { dinesh: 5 } }, out); break;
        case 'chanda': apply({ paisa: Math.round(rnd(800, 1600) + S.jan.bazaar * 15) }, out); break;
        case 'jaasoos': S.intel = rivalPlan(); out.notes.push(`Khabar mili: Bunty agle hafte ${tolaName(S.intel.tola)} mein ${S.intel.what}.`); break;
        case 'cricket': S.cricketDone = true; apply({ janAll: 6, josh: 10, members: 3, maala: 2 }, out); addHeadline('Gaon Ki Awaaz', 'Yuva Mandal Cup: 8 teamein, poora gaon maidan mein'); break;
        default: if (window.G2) G2.act(a, out, jb); break;
        case 'parcha': DATA.TOLAS.forEach(t => S.rival[t.id] = clamp(S.rival[t.id] - 3)); apply({ heat: 8, imaan: -4, grudge: 15 }, out); break;
      }
    });
    // monthly upkeep & chanda trickle
    apply({ paisa: Math.round(S.members * 40 - 300) }, out);
    // rival bot acts
    out.rival = S.stage === 2 && window.G2 ? G2.rivalAct(out) : rivalAct();
    if (S.stage === 2 && window.G2) G2.weekly(out);
    // natural decay
    S.josh = clamp(S.josh - 2); S.heat = clamp(S.heat - 1);
    checkMissions(out);
    return out;
  }

  function rivalPlan() {
    const gaps = DATA.TOLAS.map(t => ({ t: t.id, g: S.jan[t.id] - S.rival[t.id] })).sort((a, b) => b.g - a.g);
    const aggressive = S.grudge > 40 || Math.random() < .35;
    return aggressive ? { tola: gaps[0].t, what: 'tumhare khilaaf afwaah phailayega', kind: 'attack' }
                      : { tola: gaps[0].t, what: 'daawat dega', kind: 'build' };
  }
  function rivalAct() {
    const plan = S.intel || rivalPlan(); S.intel = null;
    const mult = 1 + S.grudge / 100;
    const msg = [];
    if (plan.kind === 'attack') { S.jan[plan.tola] = clamp(S.jan[plan.tola] - Math.round(3 * mult)); msg.push(`Bunty ne ${tolaName(plan.tola)} mein tumhare khilaaf afwaah phailayi.`); }
    else { S.rival[plan.tola] = clamp(S.rival[plan.tola] + Math.round(4 * mult)); msg.push(`Bunty ne ${tolaName(plan.tola)} mein daawat di.`); }
    const other = pick(DATA.TOLAS).id; S.rival[other] = clamp(S.rival[other] + 2);
    if (S.election) { DATA.TOLAS.forEach(t => S.rival[t.id] = clamp(S.rival[t.id] + 2)); msg.push('Chunav ke liye Bunty ki team ghar-ghar ghoom rahi hai.'); }
    return msg;
  }
  const tolaName = (id) => DATA.TOLAS.find(t => t.id === id).name;

  // ---------- events ----------
  function drawEvents() {
    const due = S.seeds.filter(s => s.at <= S.turn);
    S.seeds = S.seeds.filter(s => s.at > S.turn);
    const out = due.map(s => DATA.EVENTS.find(e => e.id === s.id)).filter(Boolean);
    const n = out.length ? 1 : (Math.random() < .45 ? 2 : 1);
    const stOk = (e) => (e.stage || [1]).includes(S.stage);
    let pool = DATA.EVENTS.filter(e => stOk(e) && !(e.onceEver && (S.once || []).includes(e.id)) && !e.seedOnly && !e.forced && !S.seen.includes('ev:' + e.id));
    if (!S.election) pool = pool.filter(e => e.id !== 'rivalpoll');
    if (!pool.length) { S.seen = S.seen.filter(x => !x.startsWith('ev:')); pool = DATA.EVENTS.filter(e => stOk(e) && !(e.onceEver && (S.once || []).includes(e.id)) && !e.seedOnly && !e.forced && e.id !== 'rivalpoll'); }
    // weight: rarity + heat makes grey/rival events likelier
    for (let i = 0; i < n && pool.length; i++) {
      const w = pool.map(e => (e.rar === 0 ? 7 : e.rar === 1 ? 3 : 1) * (e.cat === 'Grey' || e.cat === 'Rival' ? 1 + S.heat / 50 + S.grudge / 80 : 1));
      let r = Math.random() * w.reduce((a, b) => a + b, 0), k = 0;
      while (r > w[k]) { r -= w[k]; k++; }
      const e = pool.splice(k, 1)[0]; out.push(e); S.seen.push('ev:' + e.id); if (e.onceEver) (S.once || (S.once = [])).push(e.id);
    }
    if (S.stage === 2 && window.G2) out.push(...G2.forcedEvents());
    if (S.stage === 1 && S.election && S.election.left === 3 && !S.seen.includes('ev:rivalpoll')) { out.push(DATA.EVENTS.find(e => e.id === 'rivalpoll')); S.seen.push('ev:rivalpoll'); }
    return out;
  }
  function chooseEvent(ev, i) {
    const c = ev.choices[i]; const out = apply(c.fx, { d: {}, notes: [] });
    if (window.G2 && S.booth) G2.fx(c.fx, out);
    if (c.head) addHeadline('Gaon Ki Awaaz', c.head);
    if (c.seed) S.seeds.push({ id: c.seed, at: S.turn + 2 });
    if (out.samayDelta) S.samayDebt = (S.samayDebt || 0) - out.samayDelta;
    S.history.push({ turn: S.turn, ev: ev.id, c: i });
    return { say: c.say, d: out.d, notes: out.notes };
  }

  // ---------- end turn ----------
  function endTurn() {
    S.turn++; S.week++; if (S.week > 52) { S.week = 1; S.year++; S.age++; }
    S.counters = Object.fromEntries(Object.entries(S.counters).filter(([k]) => !k.startsWith('act:')));
    let announce = false;
    if (S.stage === 2 && window.G2) announce = G2.schedule();
    else if (!S.election && !S.electionsWon && S.turn >= (S.nextElection || ELECTION_ANNOUNCE)) {
      S.election = { left: ELECTION_LEN, name: 'School Management Committee', spend: 0 }; announce = true;
      addHeadline('Gaon Ki Awaaz', `School committee chunav ka elaan: ${S.name} banaam Bunty Bhaiya`);
    } else if (S.election) S.election.left--;
    S.missions.forEach((m, i) => { if (i === 0 && m) m.done = true; });
    fillMissions(); save();
    return { announce, electionDue: S.election && S.election.left <= 0 };
  }
  function teaser() {
    if (S.stage === 2 && window.G2) { const t = G2.teaser(); if (t) return t; }
    if (S.election && S.election.left === 1) return 'Kal matdaan hai. Bunty ki team raat bhar ghoom rahi hai...';
    if (S.seeds.length) return 'Woh purana maamla... abhi khatam nahi hua.';
    if (S.intel) return `Tumhe pata hai: Bunty ${tolaName(S.intel.tola)} mein ${S.intel.what}.`;
    return pick(DATA.TEASERS);
  }

  // ---------- election engine (softmax over segments, GDD section 8) ----------
  function runElection() {
    const T = 2.4, rounds = [];
    const fitP = (S.chhavi.sevak * .5 + S.chhavi.vikas * .3 + S.chhavi.imaan * .3 - S.heat * .3) / 60;
    const fitR = (40 * .5 + 35 * .3 + 30 * .3) / 60 + S.grudge / 200;
    let totP = 0, totR = 0, totN = 0;
    DATA.TOLAS.forEach(t => {
      const Up = S.jan[t.id] / 10 + fitP + Math.log(1 + S.election.spend / 1000) * .3 + rnd(-.25, .25);
      const Ur = S.rival[t.id] / 10 + fitR + .35 + rnd(-.25, .25); // rival has money edge
      const Un = 2.6 + (S.heat > 50 ? 1 : 0); // NOTA / abstain-protest
      const e = [Up, Ur, Un].map(u => Math.exp(u / T)), z = e[0] + e[1] + e[2];
      const turnout = clamp(.62 + S.josh / 300 + rnd(-.05, .05), .4, .95);
      const voters = Math.round(t.size * turnout);
      let vp = Math.round(voters * e[0] / z), vr = Math.round(voters * e[1] / z);
      const vn = Math.max(0, voters - vp - vr);
      rounds.push({ tola: t.id, name: t.name, p: vp, r: vr, n: vn, size: t.size });
      totP += vp; totR += vr; totN += vn;
    });
    if (totP === totR) { totP++; rounds[0].p++; } // lottery-style tie-break in favour of the challenger's recount
    const won = totP > totR;
    const res = { rounds, totP, totR, totN, won, margin: totP - totR, snapshot: { ...S.jan }, rivalSnap: { ...S.rival } };
    res.analysis = analyse(res);
    if (won) {
      S.electionsWon++; S.maala += 12; S.aides.push('pa');
      addHeadline('Gaon Ki Awaaz', `School committee chunav: ${S.name} ${res.margin} vote se jeete, Bunty Bhaiya chup`);
      S.vishwas = clamp(S.vishwas + 10); S.josh = clamp(S.josh + 15); S.grudge = clamp(S.grudge + 20);
    } else {
      addHeadline('Khabar Fatafat', `Bunty Bhaiya ki jeet; ${S.name} bole "phir se ladenge"`);
      S.josh = clamp(S.josh - 10); S.nextElection = S.turn + 3;
    }
    S.lastElection = res; S.election = null;
    checkMissions({ d: {}, missionsDone: [] }); fillMissions(); save();
    return res;
  }
  function analyse(res) {
    const tips = [];
    const worst = [...res.rounds].sort((a, b) => (a.p - a.r) - (b.p - b.r))[0];
    const iss = DATA.TOLAS.find(t => t.id === worst.tola).issue;
    tips.push(`${worst.name} mein ${worst.r - worst.p > 0 ? (worst.r - worst.p) + ' vote se peeche' : 'kaante ki takkar'}. Wahan ki ${iss} samasya pe pehle kaam karte to 2-3 vote aur milte.`);
    if (S.heat > 25) tips.push('Heat ne Imaandar matdaataon ko door kiya. Grey raste kam lo.');
    if (S.josh < 55) tips.push('Kam Josh ka matlab kam turnout. Group Meeting aur Nukkad Sabha se karyakarta jagao.');
    if (!S.cricketDone) tips.push('Cricket Tournament se sab tolon mein ek saath samarthan badhta.');
    if (S.chhavi.sevak < 50) tips.push('Jan Sevak chhavi kamzor rahi. Samasya Hal Karo cards zyada khelo.');
    if (tips.length < 3) tips.push('Rival pe Nazar card se Bunty ka akhri hafte ka hamla pehle hi pakad sakte the.');
    return tips.slice(0, 3);
  }

  function chooseParty(id) {
    S.party = id; S.rank = 1; S.stage = 2; S.stageDone = false;
    if (window.G2) G2.init();
    addHeadline('Rashtriya Darpan', `${S.name} bane Booth Adhyaksh; ${id === 'rpm' ? 'Rashtriya Pragati Morcha' : 'Jan Sangharsh Party'} ne di zimmedari`);
    save();
  }

  // ---------- audio (WebAudio synth: dhol, coin, whoosh, harmonium) ----------
  let ac = null;
  function ctx() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { ac = null; } } if (ac && ac.state === 'suspended') ac.resume(); return ac; }
  function tone(f, d, type = 'sine', vol = .15, slide = 0, delay = 0) {
    const a = ctx(); if (!a || !settings.sound) return;
    const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + .02);
  }
  function noise(d, vol = .12, freq = 1200) {
    const a = ctx(); if (!a || !settings.sound) return;
    const b = a.createBuffer(1, a.sampleRate * d, a.sampleRate), ch = b.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    f.type = 'bandpass'; f.frequency.value = freq; g.gain.value = vol; s.buffer = b; s.connect(f).connect(g).connect(a.destination); s.start();
  }
  const sfx = {
    tap: () => { tone(620, .05, 'triangle', .08); buzz(8); },
    card: () => { tone(420, .08, 'triangle', .1, 300); buzz(12); },
    coin: () => { tone(988, .08, 'square', .06); tone(1319, .18, 'square', .06, 0, .07); },
    dhol: () => { tone(110, .25, 'sine', .4, -60); noise(.08, .1, 300); tone(160, .2, 'sine', .3, -80, .18); noise(.06, .08, 400); },
    whoosh: () => noise(.4, .15, 900),
    win: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, 'triangle', .12, 0, i * .11)); sfx.dhol(); buzz([30, 40, 60]); },
    lose: () => { [392, 349, 311, 262].forEach((f, i) => tone(f, .35, 'sawtooth', .05, 0, i * .16)); },
    sting: () => { [220, 277, 330].forEach(f => tone(f, .9, 'sawtooth', .04)); buzz(40); },
    tick: () => tone(1500, .03, 'square', .04),
  };
  function buzz(p) { if (settings.haptics && navigator.vibrate) try { navigator.vibrate(p); } catch {} }

  return {
    get S() { return S; }, settings, saveSettings, newGame, load, save, wipe, sfx, buzz,
    avgJan, dateLabel, heatLevel, heatHint, samayMax, resolveTurn, drawEvents, chooseEvent, endTurn, teaser,
    runElection, openProblem, stageGoals, apply, addHeadline, fillMissions, checkMissions, rnd, pick, MONTHS, missionProgress, chooseParty, tolaName, CHHAVI_NAME, clamp,
  };
})();
