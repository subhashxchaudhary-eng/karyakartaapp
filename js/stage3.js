/* Neta — Stage 3: Panchayati Raj (GDD section 5, 73rd Amendment, Articles 243–243-O).
   3a Gram Pradhan: direct election, monthly governance, funds, Eleventh Schedule build menu with
   quality / contractor / credit sliders, Gram Sabha, term goals, threats, reservation rotation.
   3b Block Pramukh and 3c Zila Panchayat Adhyaksh: indirect elections won by gathering members. */
window.G3 = (() => {
  const S = () => G.S, P = () => G.S.p;
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const T = () => DATA.TOLAS;
  const L = 100000; // one lakh
  const TERM = 60, SABHA_MONTHS = { 0: '26 January', 4: '1 May', 7: '15 August', 9: '2 October' };

  // ---------------- content ----------------
  // Eleventh Schedule groups (GDD table). power: full | shared (needs BDO sign-off)
  const GROUPS = [
    { id: 'kheti', name: 'Kheti', icon: 'sprout', power: 'full', items: 'Krishi, laghu sinchai, pashupalan, matsya' },
    { id: 'paani', name: 'Paani aur Safai', icon: 'drop', power: 'full', items: 'Peyjal, swasthya aur swachhta' },
    { id: 'sadak', name: 'Sadak aur Bijli', icon: 'road', power: 'shared', items: 'Sadak, pulia, gramin vidyutikaran' },
    { id: 'shiksha', name: 'Shiksha', icon: 'school', power: 'shared', items: 'Shiksha, praudh shiksha, pustakalay' },
    { id: 'kalyan', name: 'Swasthya aur Kalyan', icon: 'heart', power: 'shared', items: 'Mahila-baal vikas, samaj kalyan' },
    { id: 'rozgar', name: 'Rozgar aur Bazaar', icon: 'coins', power: 'full', items: 'Laghu udyog, haat aur mele' },
    { id: 'samaj', name: 'Samaj', icon: 'users', power: 'full', items: 'Saanskritik gatividhi, saamudayik sampatti' },
  ];
  const PROJECTS = [
    { id: 'nal', g: 'paani', name: 'Nal se Jal', icon: 'drop', cost: 6 * L, months: 5, tied: true, issue: 'paani', goal: 'tap', desc: 'Har ghar nal connection' },
    { id: 'naali', g: 'paani', name: 'Pakki Naali', icon: 'road', cost: 2 * L, months: 2, tied: true, issue: 'paani', desc: 'Gali mein paani nahi rukega' },
    { id: 'shauch', g: 'paani', name: 'Samudayik Shauchalay', icon: 'door', cost: 2.5 * L, months: 3, tied: true, issue: 'paani', goal: 'odf', desc: 'Khule mein shauch se mukti' },
    { id: 'sadak', g: 'sadak', name: 'Kharanja Sadak', icon: 'road', cost: 4 * L, months: 4, issue: 'sadak', goal: 'road', desc: 'Har mausam waali int ki sadak' },
    { id: 'solar', g: 'sadak', name: 'Solar Street Light', icon: 'sun', cost: 1.5 * L, months: 2, issue: 'bijli', desc: 'Raat mein roshni, mahilaon ki suraksha' },
    { id: 'checkdam', g: 'kheti', name: 'Check Dam', icon: 'drop', cost: 5 * L, months: 5, issue: 'kisan', desc: 'Barsaat ka paani roko, sinchai badhao' },
    { id: 'gaushala', g: 'kheti', name: 'Pashu Ashray', icon: 'sprout', cost: 2 * L, months: 3, issue: 'kisan', desc: 'Awara pashuon se faslein bachao' },
    { id: 'school', g: 'shiksha', name: 'School Kamra + Library', icon: 'school', cost: 3.5 * L, months: 4, issue: 'shiksha', goal: 'school', desc: 'Bachche school mein tikenge' },
    { id: 'anganwadi', g: 'kalyan', name: 'Anganwadi Bhawan', icon: 'heart', cost: 4 * L, months: 5, issue: 'shiksha', desc: 'Maa aur bachchon ki dekhbhaal' },
    { id: 'haat', g: 'rozgar', name: 'Haat + SHG Shed', icon: 'coins', cost: 2 * L, months: 3, issue: 'kisan', shg: 2, desc: 'Mahila samooh ka bazaar' },
    { id: 'bhawan', g: 'samaj', name: 'Panchayat Bhawan', icon: 'temple', cost: 5 * L, months: 6, village: true, issue: 'sadak', desc: 'Gaon ka daftar, Gram Sabha ka hall' },
    { id: 'maidan', g: 'samaj', name: 'Khel Maidan', icon: 'bat', cost: 1.5 * L, months: 2, issue: 'shiksha', desc: 'Yuvaon ke liye maidan' },
  ];
  const QUALITY = [{ id: 'low', name: 'Sasta', mult: .75, brk: .35 }, { id: 'mid', name: 'Theek', mult: 1, brk: .08 }, { id: 'high', name: 'Mazboot', mult: 1.3, brk: .01 }];
  const CONTRACTOR = [
    { id: 'honest', name: 'Imaandar', mult: 1.1, dm: 1, desc: 'Dheema, mehenga, saaf' },
    { id: 'connected', name: 'Pahunch waala', mult: 1, dm: -1, desc: 'Tez, 10% cut tumhe, Heat' },
    { id: 'relative', name: 'Apna rishtedaar', mult: .85, dm: 0, desc: 'Sasta, "bhai-bhatijavaad"' },
  ];
  const CREDIT = [
    { id: 'self', name: 'Apna naam', desc: 'Board pe tumhara naam' },
    { id: 'mla', name: 'MLA ke saath', desc: 'Vidhayak se rishta' },
    { id: 'sabha', name: 'Gram Sabha ko', desc: 'Jan Sevak chhavi' },
  ];
  const TERM_GOALS = [
    { id: 'tap', t: 'Har ghar nal (chaaron tolon mein Nal se Jal)', icon: 'drop' },
    { id: 'road', t: 'Har tola tak pakki sadak', icon: 'road' },
    { id: 'school', t: 'Zero dropout: 2 tolon mein school kamra', icon: 'school' },
    { id: 'shg', t: '10 sakriya mahila SHG', icon: 'users' },
    { id: 'pension', t: 'Har buzurg pension suchi mein (40 naam)', icon: 'heart' },
    { id: 'odf', t: 'Khule mein shauch mukt gaon', icon: 'door' },
    { id: 'audit', t: 'MGNREGA ka saaf social audit', icon: 'scales' },
    { id: 'rev', t: 'Apni aamdani 50% badhao', icon: 'coins' },
  ];

  const ACTIONS3 = [
    { id: 'darbar', st: [3], name: 'Janta Darbar', icon: 'users', slots: 1, tgt: true, c: ['#19b59b', '#0d7a69'], desc: 'Arziyan suno: pension, ration, zameen', fx: '+Jan Sevak +Ehsaan' },
    { id: 'blockdaura', st: [3], name: 'Block Office Daura', icon: 'briefcase', slots: 2, c: ['#2a7de1', '#1749a8'], desc: 'BDO se manzoori aur SFC lobbying', fx: '+BDO rishta' },
    { id: 'sachiv', st: [3], name: 'Sachiv se Baithak', icon: 'handshake', slots: 1, cost: 200, c: ['#8a52e8', '#5a2bb0'], desc: 'Bina Sachiv ke dastkhat bhugtaan nahi', fx: '+Sachiv rishta' },
    { id: 'kar', st: [3], name: 'Kar Vasooli', icon: 'rupee', slots: 1, tgt: true, c: ['#c79a12', '#8a6400'], desc: 'Grih kar, bazaar shulk, talaab patta', fx: '+Apni aamdani' },
    { id: 'nirikshan', st: [3], name: 'Kaam ka Nirikshan', icon: 'eye', slots: 1, c: ['#4b4f6b', '#262838'], desc: 'Chal rahe kaam ki quality jaancho', fx: 'Quality +' },
    { id: 'shgmeet', st: [3], name: 'Mahila SHG Baithak', icon: 'heart', slots: 1, tgt: true, c: ['#d6488a', '#9b1f5c'], desc: 'Naya swayam sahayta samooh', fx: '+SHG' },
    { id: 'vidhayak', st: [3], name: 'Vidhayak se Milo', icon: 'flag', slots: 2, cost: 500, c: ['#ff8a1f', '#b84a00'], desc: 'MLA nidhi se kaam maango', fx: '+MLA nidhi' },
  ];
  DATA.ACTIONS.push(...ACTIONS3);
  DATA.PEOPLE.push(
    { id: 'ramdhan', name: 'Ramdhan ji', role: 'Purv Pradhan · Bunty ke chacha', arche: 'Purana Khiladi', rel: -20, col: '#7a3b2a', hair: '#ddd', skin: '#b5784c' },
    { id: 'sachiv', name: 'Sachiv Ramesh', role: 'Panchayat Sachiv', arche: 'Har file ka maalik', rel: 0, col: '#4b4f6b', hair: '#333', skin: '#c28b5c' },
    { id: 'bdo', name: 'BDO Anjali Rao', role: 'Khand Vikas Adhikari', arche: 'Niyam se chalne waali', rel: 0, col: '#2a7de1', hair: '#111', skin: '#c99064', f: true },
    { id: 'mla', name: 'MLA Mahesh Chandra', role: 'Kshetriya Vidhayak', arche: 'Shrey ka bhookha', rel: 5, col: '#ff8a1f', hair: '#999', skin: '#b97b4d' },
  );

  DATA.MISSION_POOL3 = {
    0: [
      { id: 'p_darbar', t: 'Janta Darbar lagao', k: 'act:darbar', n: 1, rw: { sevak: 2 } },
      { id: 'p_sachiv', t: 'Sachiv se baithak karo', k: 'act:sachiv', n: 1, rw: { josh: 3 } },
      { id: 'p_kar', t: 'Kar vasooli karo', k: 'act:kar', n: 1, rw: { paisa: 500 } },
      { id: 'p_shg', t: 'Ek SHG baithak karo', k: 'act:shgmeet', n: 1, rw: { sevak: 2 } },
      { id: 'p_nir', t: 'Ek kaam ka nirikshan karo', k: 'act:nirikshan', n: 1, rw: { imaan: 2 } },
    ],
    1: [
      { id: 'p_proj3', t: '3 vikas kaam poore karo', k: 'projDone', n: 3, rw: { vikas: 5, maala: 3 } },
      { id: 'p_sabha2', t: '2 Gram Sabha mein yojana paas karao', k: 'sabhaPassed', n: 2, rw: { sevak: 4 } },
      { id: 'p_proj6', t: '6 vikas kaam poore karo', k: 'projDone', n: 6, rw: { vikas: 6, vishwas: 4 } },
    ],
    2: [{ id: 'p_term', t: 'Kaaryakaal ke 4 sapne poore karo', k: 'termGoals', n: 4, rw: { maala: 10, vishwas: 8 } }],
  };

  const EVENTS3 = [
    { id: 'noconf', stage: [3], forced: true, cat: 'Avishwas', rar: 2, art: 'party', title: 'Avishwas prastav!',
      text: 'Ramdhan ji ke kehne pe 6 ward panchon ne tumhare khilaaf avishwas prastav de diya hai. 10 din mein vote hoga. Gaon mein naraazgi hai.',
      choices: [
        { t: 'Har ward panch ke ghar jao, unke ward ka kaam pehle karo', fx: { samay: -2, noconf: 'woo' }, say: 'Kuch maane, kuch nahi. Vote ka din aaya...' },
        { t: 'Gram Sabha bulao, janta ke saamne hisaab do', fx: { noconf: 'sabha', imaan: 3 }, say: 'Janta ki bheed ne ward panchon ko soch mein daal diya.' },
        { t: 'Panchon ko "manao" (₹50,000 kaala)', fx: { noconf: 'trade', heat: 12, imaan: -6 }, say: 'Prastav gir gaya. Par baat bahar jaayegi.' },
      ] },
    { id: 'dmfreeze', stage: [3], forced: true, cat: 'Kanoon', rar: 2, art: 'viral', title: 'DM ne adhikaar rok diye',
      text: 'Ramdhan ji ki shikayat pe District Magistrate ne jaanch tak tumhare vittiya adhikaar rok diye hain (rajya Panchayat Raj kanoon ke tahat). Koi bhugtaan nahi hoga.',
      choices: [
        { t: 'Jaanch mein poora sahyog do', fx: { freeze: 3, imaan: 5 }, say: 'Teen mahine kaam ruka. Jaanch mein kuch nahi mila.' },
        { t: 'High Court jao (₹20,000)', fx: { paisa: -20000, freeze: 1, dabang: 3 }, say: 'Court ne DM ke aadesh pe rok lagayi.' },
        { t: 'MLA se DM pe dabaav dalwao', fx: { freeze: 'mla', rishte: { mla: -10 } }, say: 'Phone gaye. Natija MLA ke rishte pe tika hai.' },
      ] },
    { id: 'baadh', stage: [3], govern: true, cat: 'Aapda', rar: 1, art: 'rain', title: 'Baadh ka paani',
      text: 'Nadi ka paani Kisan Basti mein ghus aaya hai. 40 ghar doobe, fasal barbaad.',
      choices: [
        { t: 'Raat bhar raahat camp, khud maujood raho', fx: { samay: -2, jan: { kisan: 10 }, sevak: 6, paisa: -3000 }, say: 'Subah tak sab surakshit. Tasveer akhbaar mein.', head: 'Pradhan raat bhar baadh peediton ke beech' },
        { t: 'Panchayat nidhi se raahat (₹50,000)', fx: { fund: -50000, jan: { kisan: 6 } }, say: 'Raashan aur tirpal bante.' },
        { t: 'Block se madad ka intezaar', fx: { jan: { kisan: -6 } }, say: 'Madad 5 din baad aayi.' },
      ] },
    { id: 'sukha', stage: [3], govern: true, cat: 'Aapda', rar: 1, art: 'money', title: 'Sookha',
      text: 'Is saal baarish nahi hui. Handpump sookh rahe hain, kisan pareshaan.',
      choices: [
        { t: 'MGNREGA se talaab khudai shuru', fx: { janAll: 3, vikas: 3 }, say: 'Kaam bhi mila, talaab bhi gehra hua.' },
        { t: 'Tanker se paani (₹30,000 nidhi)', fx: { fund: -30000, jan: { purab: 4, kisan: 4 } }, say: 'Tanker roz aaya.' },
      ] },
    { id: 'zameen', stage: [3], govern: true, cat: 'Samaj', rar: 1, art: 'family', title: 'Talaab ka jhagda',
      text: 'Purab Tola aur Kisan Basti ke log gaon ke talaab ke patte pe bhid gaye hain. Dono tumhari taraf dekh rahe hain.',
      choices: [
        { t: 'Dono ki baithak, barabar patta', fx: { samay: -1, jan: { purab: 3, kisan: 3 }, sevak: 3 }, say: 'Samjhauta likha gaya, dono ne dastkhat kiye.' },
        { t: 'Zyada voton waale tola ka saath do', fx: { jan: { kisan: 7, purab: -9 }, heat: 4 }, say: 'Kisan Basti khush. Purab Tola ne yaad rakha.' },
        { t: 'Neelami karo, jo zyada de', fx: { ownrev: 15000, jan: { purab: -2, kisan: -2 } }, say: 'Panchayat ki aamdani badhi, dono naraaz.' },
      ] },
    { id: 'sachivchai', stage: [3], govern: true, cat: 'Grey', rar: 0, art: 'money', title: 'Sachiv ki file',
      text: 'Sachiv Ramesh: "Pradhan ji, bhugtaan ki file pe dastkhat ho jaayenge... bas thoda chai-paani."',
      choices: [
        { t: 'Mana karo, BDO ko bata do', fx: { imaan: 4, rishte: { sachiv: -20, bdo: 8 } }, say: 'Sachiv naraaz. BDO ne note kar liya.' },
        { t: 'De do (₹5,000)', fx: { paisa: -5000, heat: 5, rishte: { sachiv: 15 } }, say: 'Fileein ab tez chalti hain.' },
        { t: 'Samjhao: kaam hoga to sabka naam hoga', fx: { samay: -1, rishte: { sachiv: 6 } }, say: 'Sachiv ne sar hilaya. Abhi ke liye.' },
      ] },
    { id: 'muster', stage: [3], govern: true, cat: 'Grey', rar: 1, art: 'money', title: 'Farzi muster roll',
      text: 'Rozgar Sevak keh raha hai: "Talaab khudai mein 30 farzi naam daal dete hain. ₹40,000 bachenge, aadha aapka."',
      choices: [
        { t: 'Bilkul nahi', fx: { imaan: 6 }, say: 'Rozgar Sevak chup ho gaya.' },
        { t: 'Theek hai', fx: { kaala: 20000, heat: 14, seed: 'auditfail' }, say: 'Paisa aaya. Muster roll mein naye naam.' },
      ] },
    { id: 'auditfail', stage: [3], seedOnly: true, cat: 'Jaanch', rar: 2, art: 'viral', title: 'Social audit mein pol khuli',
      text: 'Social audit team ne muster roll ke 30 naam gaon mein dhoondhe. Koi nahi mila. Gram Sabha mein hungama.',
      choices: [
        { t: 'Rozgar Sevak ko barkhast karo', fx: { janAll: -3, heat: 4, audit: 'fail' }, say: 'Kuch log maane. Kuch ne kaha "upar tak paisa gaya".' },
        { t: 'Galti maano, paisa lautao', fx: { kaala: -20000, imaan: 5, janAll: -2, audit: 'fail' }, say: 'Imaandari ki thodi taarif. Audit fir bhi fail.' },
      ] },
    { id: 'socialaudit', stage: [3], forced: true, cat: 'Jaanch', rar: 1, art: 'school', title: 'MGNREGA Social Audit',
      text: 'Rajya ki social audit team gaon aayi hai. Har kaam, har muster roll Gram Sabha ke saamne padha jaayega.',
      choices: [
        { t: 'Saare record khule rakho, team ka swagat', fx: { audit: 'check', imaan: 3 }, say: 'Team ne din bhar record dekhe.' },
        { t: 'Team ko "achha" khana aur thoda kuch', fx: { audit: 'bribe', heat: 10, paisa: -10000 }, say: 'Team jaldi chali gayi. Report "theek" aayi.' },
      ] },
    { id: 'mlacredit', stage: [3], govern: true, cat: 'Party', rar: 0, art: 'party', title: 'MLA ka photo',
      text: 'MLA Mahesh Chandra tumhari nayi sadak ka udghatan khud karna chahte hain, bina tumhe bulaye.',
      choices: [
        { t: 'Saath mein udghatan ka prastav', fx: { rishte: { mla: 10 }, janAll: 1 }, say: 'Dono ka naam patthar pe.' },
        { t: 'Mana karo: kaam panchayat ka hai', fx: { rishte: { mla: -15 }, dabang: 4, janAll: 2 }, say: 'Gaon ne taali bajayi. MLA ka chehra utra.' },
        { t: 'Chup raho, unhe karne do', fx: { rishte: { mla: 5 }, janAll: -2 }, say: 'Akhbaar mein sirf MLA ki photo.' },
      ] },
    { id: 'rishtedaar', stage: [3], seedOnly: true, cat: 'Media', rar: 1, art: 'viral', title: 'Bhai-bhatijavaad!',
      text: '"Gaon Ki Awaaz": Pradhan ke saale ki company ko panchayat ka theka. Bunty ne WhatsApp pe kagaz daal diye.',
      choices: [
        { t: 'Theka radd, nayi niviada', fx: { fund: -50000, imaan: 4, janAll: -1 }, say: 'Nuksaan hua, par baat dab gayi.' },
        { t: '"Kaam achha hai, rishta nahi dekha jaata"', fx: { janAll: -3, dabang: 2, heat: 3 }, say: 'Bahas chalti rahi.' },
      ] },
  ];
  DATA.EVENTS.push(...EVENTS3);
  const TEASERS3 = [
    'Ramdhan ji ward panchon ke saath raat ko baithak kar rahe hain...',
    'BDO office mein tumhari file "dekh rahe hain"...',
    'Mausam vibhaag: is saal mansoon tez rahega.',
    'Sachiv Ramesh kuch dino se kam baat kar raha hai...',
    'MLA sahab agle mahine gaon aa sakte hain.',
  ];

  // ---------------- state ----------------
  function init() {
    const s = S();
    s.stage = 3; s.stageDone = false; s.monthly = false;
    ['ramdhan', 'sachiv', 'bdo', 'mla'].forEach(id => { if (s.rishte[id] == null) s.rishte[id] = DATA.PEOPLE.find(p => p.id === id).rel; });
    T().forEach(t => s.rival[t.id] = clamp(Math.max(s.rival[t.id], 45) + G.rnd(-4, 4)));
    s.p = { phase: 'campaign', fund: 0, tied: 0, ownRev: 0, ownRevBase: 40000, ownRevYear: 0, projects: [], built: {}, done: 0,
      goals: [], pensions: 8, shg: 1, audit: null, freeze: 0, planPassed: true, sabhaPassed: 0, sabhaSeen: [], promises: [],
      noconfAt: -99, freezeAt: -99, auditAt: null, termStart: null, termEnd: null, attempts: 0, mlaFundYear: null,
      ruling: Math.random() < .5, mg: null, ehsaan: s.p ? s.p.ehsaan : 3 };
    s.missions = [null, null, null]; s.seen = s.seen.filter(x => !x.startsWith('mis:')); s.election = null;
    startCampaign();
    G.addHeadline('Gaon Ki Awaaz', `Panchayat chunav: Pradhan pad ke liye ${s.name} ka naamankan, saamne Ramdhan ji`);
    G.fillMissions(); G.save();
  }
  function startCampaign() {
    const s = S(), p = P();
    p.phase = 'campaign'; s.monthly = false; p.attempts++;
    T().forEach(t => s.rival[t.id] = clamp(46 + G.rnd(-4, 4)));
    s.election = { left: 5, kind: 'pradhan', name: 'Gram Pradhan Chunav', mission: 'Gram Pradhan chunav jeeto', spend: 0 };
  }
  const janAvg = () => G.avgJan();
  const builtIn = (pid) => P().built[pid] || [];

  // ---------------- term goals ----------------
  function goalDone(id) {
    const p = P();
    switch (id) {
      case 'tap': return builtIn('nal').length >= 4;
      case 'road': return builtIn('sadak').length >= 4;
      case 'school': return builtIn('school').length >= 2;
      case 'shg': return p.shg >= 10;
      case 'pension': return p.pensions >= 40;
      case 'odf': return builtIn('shauch').length >= 4;
      case 'audit': return p.audit === 'pass';
      case 'rev': return Math.max(p.ownRevYear, p.ownRev) >= p.ownRevBase * 1.5;
    }
    return false;
  }
  function goalProg(id) {
    const p = P();
    return { tap: [builtIn('nal').length, 4], road: [builtIn('sadak').length, 4], school: [builtIn('school').length, 2], shg: [p.shg, 10],
      pension: [p.pensions, 40], odf: [builtIn('shauch').length, 4], audit: [p.audit === 'pass' ? 1 : 0, 1], rev: [Math.round(Math.max(p.ownRevYear, p.ownRev) / 1000), Math.round(p.ownRevBase * 1.5 / 1000)] }[id];
  }
  function chooseGoals(ids) { P().goals = ids.slice(0, 4); G.save(); }

  // ---------------- actions ----------------
  function act(a, out, jb) {
    const s = S(), p = P(); if (!p) return;
    switch (a.id) {
      case 'darbar': {
        const kind = G.pick(['pension', 'pension', 'ration', 'zameen', 'school']);
        if (kind === 'pension') p.pensions += Math.round(G.rnd(3, 6));
        p.ehsaan++;
        G.apply({ jan: { [a.tola]: Math.round(3 * jb) }, sevak: 2 }, out);
        out.notes.push({ pension: `Darbar mein ${G.tolaName(a.tola)} ke buzurgon ke pension form bharwaaye.`, ration: 'Ration card ki 5 arziyan nipti.', zameen: 'Khet ki med ka jhagda suljhaya.', school: 'Do bachchon ka school mein daakhila karwaya.' }[kind] + ' (Ehsaan +1)');
        break;
      }
      case 'blockdaura': G.apply({ rishte: { bdo: 10 } }, out); p.sfcLobby = (p.sfcLobby || 0) + 1; out.notes.push('BDO ne kaha: "Aapki filein dekh leti hoon." SFC ke liye bhi baat hui.'); break;
      case 'sachiv': G.apply({ rishte: { sachiv: 10 } }, out); out.notes.push('Sachiv Ramesh ke saath chai. Fileein ab atkengi nahi.'); break;
      case 'kar': { const amt = Math.round(G.rnd(6000, 11000) * (1 + s.chhavi.dabang / 200)); p.ownRev += amt; p.fund += amt; G.apply({ jan: { [a.tola]: -2 } }, out); out.notes.push(`${G.tolaName(a.tola)} se ₹${amt.toLocaleString('en-IN')} kar vasool. Kuch log naraaz.`); break; }
      case 'nirikshan': {
        const pr = p.projects.find(x => x.status === 'build' && x.q !== 'high');
        if (pr) { pr.inspected = true; out.notes.push(`${defOf(pr).name} (${pr.tola ? G.tolaName(pr.tola) : 'gaon'}) ka nirikshan: thekedar ne cement badhaya. Toot ka khatra kam.`); G.apply({ imaan: 1, vikas: 1 }, out); }
        else out.notes.push('Koi chalta kaam nahi mila jiska nirikshan ho.');
        break;
      }
      case 'shgmeet': p.shg++; G.apply({ jan: { [a.tola]: 2 }, sevak: 1 }, out); out.notes.push(`${G.tolaName(a.tola)} mein naya mahila SHG bana (kul ${p.shg}).`); break;
      case 'vidhayak': {
        const yr = s.year;
        if (s.rishte.mla >= 15 && p.mlaFundYear !== yr) { p.mlaFundYear = yr; p.fund += 2 * L; out.notes.push('MLA nidhi se ₹2 lakh manzoor!'); G.apply({ rishte: { mla: -5 } }, out); }
        else { G.apply({ rishte: { mla: 8 } }, out); out.notes.push(p.mlaFundYear === yr ? 'Is saal ki MLA nidhi mil chuki. Rishta badha.' : 'MLA sahab ne kaha "dekhenge". (MLA rishta 15+ chahiye)'); }
        break;
      }
    }
  }

  // ---------------- projects ----------------
  const defOf = (pr) => PROJECTS.find(d => d.id === pr.def);
  function quote(defId, q, con) {
    const d = PROJECTS.find(x => x.id === defId), Q = QUALITY.find(x => x.id === q), C = CONTRACTOR.find(x => x.id === con);
    const shared = GROUPS.find(g => g.id === d.g).power === 'shared';
    const bdoDelay = shared && S().rishte.bdo < 20 ? 2 : 0;
    return { cost: Math.round(d.cost * Q.mult * C.mult), months: Math.max(1, d.months + C.dm) + bdoDelay, bdoDelay, shared };
  }
  function canStart(defId, tola) {
    const s = S(), p = P(), d = PROJECTS.find(x => x.id === defId);
    if (p.phase !== 'govern') return 'Pehle Pradhan bano';
    if (p.freeze > 0) return 'Vittiya adhikaar ruke hue hain';
    if (!p.planPassed) return 'Gram Sabha ne yojana paas nahi ki';
    if (!d.village && builtIn(defId).includes(tola)) return 'Is tola mein pehle se bana hai';
    if (p.projects.some(x => x.status === 'build' && x.def === defId && x.tola === tola)) return 'Ye kaam chal raha hai';
    if (d.village && builtIn(defId).length) return 'Pehle se bana hai';
    return null;
  }
  function startProject(defId, tola, q, con, cred) {
    const p = P(), d = PROJECTS.find(x => x.id === defId), qu = quote(defId, q, con);
    const err = canStart(defId, tola); if (err) return err;
    const avail = d.tied ? p.tied + p.fund : p.fund;
    if (qu.cost > avail) return 'Nidhi kam hai';
    if (d.tied) { const fromTied = Math.min(p.tied, qu.cost); p.tied -= fromTied; p.fund -= qu.cost - fromTied; } else p.fund -= qu.cost;
    const pr = { uid: Date.now() % 1e7 + Math.round(Math.random() * 999), def: defId, tola: d.village ? null : tola, q, con, cred, cost: qu.cost, total: qu.months, left: qu.months, status: 'build' };
    p.projects.push(pr);
    if (con === 'connected') { G.apply({ kaala: Math.round(qu.cost * .1), heat: 6, imaan: -2 }); }
    if (con === 'relative') { G.apply({ heat: 4 }); if (Math.random() < .5) S().seeds.push({ id: 'rishtedaar', at: S().turn + 3 }); }
    if (con === 'honest') G.apply({ imaan: 1 });
    p.usedConnected = p.usedConnected || con === 'connected';
    p.promises = p.promises.filter(pm => !(pm.tola === pr.tola && (pm.issue === d.issue)));
    G.sfx.coin(); G.save(); return null;
  }
  function repair(uid) {
    const p = P(), pr = p.projects.find(x => x.uid === uid), cost = Math.round(pr.cost * .4);
    if (p.fund < cost) return 'Nidhi kam hai';
    p.fund -= cost; pr.status = 'build'; pr.left = 1; pr.total = 1; pr.q = 'mid'; G.save(); return null;
  }
  function finish(pr, out) {
    const s = S(), p = P(), d = defOf(pr);
    pr.status = 'done'; p.done++;
    (p.built[d.id] || (p.built[d.id] = [])).push(pr.tola || 'gaon');
    const tolas = pr.tola ? [pr.tola] : T().map(t => t.id);
    const big = pr.tola ? 1 : .4;
    const dim = (t, v) => Math.round(v * big);
    if (pr.cred === 'self') G.apply({ jan: Object.fromEntries(tolas.map(t => [t, dim(t, 9)])), vikas: 3 }, out);
    if (pr.cred === 'mla') G.apply({ jan: Object.fromEntries(tolas.map(t => [t, dim(t, 6)])), rishte: { mla: 10 }, vikas: 2 }, out);
    if (pr.cred === 'sabha') G.apply({ jan: Object.fromEntries(tolas.map(t => [t, dim(t, 6)])), sevak: 4 }, out);
    if (d.shg) p.shg += d.shg;
    G.addHeadline('Gaon Ki Awaaz', `${d.name} ${pr.tola ? G.tolaName(pr.tola) + ' mein' : 'gaon mein'} taiyaar; ${pr.cred === 'mla' ? 'Pradhan aur MLA ne' : pr.cred === 'sabha' ? 'Gram Sabha ne' : 'Pradhan ' + s.name + ' ne'} kiya udghatan`);
    out.notes.push(`${d.name} poora hua!`);
  }

  // ---------------- weekly / monthly ----------------
  function weekly(out) {
    const s = S(), p = P();
    if (p.phase !== 'govern') return;
    const m = G.month();
    // projects
    p.projects.filter(x => x.status === 'build').forEach(pr => {
      if (p.freeze > 0) return;
      if (s.rishte.sachiv < -10 && Math.random() < .35) { out.notes.push(`Sachiv ne ${defOf(pr).name} ka bhugtaan roka. Ek mahina deri.`); return; }
      pr.left--; if (pr.left <= 0) finish(pr, out);
    });
    // monsoon breaks low quality
    if (m >= 6 && m <= 8) p.projects.filter(x => x.status === 'done' && !x.monsoonChecked?.includes(s.year)).forEach(pr => {
      (pr.monsoonChecked || (pr.monsoonChecked = [])).push(s.year);
      const Q = QUALITY.find(q => q.id === pr.q), brk = Q.brk * (pr.inspected ? .4 : 1);
      if (Math.random() < brk) {
        pr.status = 'broken'; const d = defOf(pr);
        G.apply({ jan: pr.tola ? { [pr.tola]: -8 } : { purab: -3, pashchim: -3, bazaar: -3, kisan: -3 }, vikas: -4 }, out);
        G.addHeadline('Sansani TV', `VIRAL: Pradhan ji ka ${d.name} pehli baarish mein beh gaya; Pradhan ji bole "baarish zyada thi"`);
        out.notes.push(`${d.name} baarish mein toot gaya! Marammat karwao.`);
      }
    });
    if (p.freeze > 0) { p.freeze--; if (!p.freeze) out.notes.push('Vittiya adhikaar bahaal.'); }
    // fiscal year: April transfers (Union FC grant half tied, SFC share, own revenue cycle)
    if (m === 3 && p.fyDone !== s.year) {
      p.fyDone = s.year; p.ehsaan = Math.round(p.ehsaan * .7); // old favours fade
      const sfc = Math.round((3 + Math.min(3, (p.sfcLobby || 0) * .5)) * L);
      p.fund += 4 * L + sfc; p.tied += 4 * L; p.sfcLobby = 0;
      p.ownRevYear = Math.max(p.ownRevYear, p.ownRev); p.ownRev = 0;
      out.notes.push(`Naya vittiya varsh: Kendriya Vitt Aayog ₹8 lakh (aadha bandha hua), Rajya Vitt Aayog ₹${(sfc / L).toFixed(1)} lakh.`);
      G.addHeadline('Gaon Ki Awaaz', `Panchayat ko mila ₹${((8 * L + sfc) / L).toFixed(0)} lakh ka saalana anudaan`);
    }
    // broken promises from Gram Sabha
    p.promises.filter(pm => s.turn > pm.due).forEach(pm => { G.apply({ jan: { [pm.tola]: -6 } }, out); out.notes.push(`${G.tolaName(pm.tola)} se kiya vaada (${pm.issue}) poora nahi hua. Log naraaz.`); });
    p.promises = p.promises.filter(pm => s.turn <= pm.due);
    // anti-incumbency drift
    T().forEach(t => s.jan[t.id] = clamp(s.jan[t.id] - .6 - Math.max(0, s.jan[t.id] - 60) / 40)); // anti-incumbency bites harder at the top
  }
  function rivalAct(out) {
    const s = S(), p = P();
    if (p.phase === 'campaign') return G.rivalAct();
    const msg = [];
    const t = G.pick(T()).id;
    if (Math.random() < .5) { s.jan[t] = clamp(s.jan[t] - 2); msg.push(`Ramdhan ji ne ${G.tolaName(t)} mein kaha: "Pradhan sirf apno ka kaam karta hai."`); }
    else { s.rishte.sachiv = clamp(s.rishte.sachiv - 4, -100, 100); msg.push('Bunty ko Sachiv ke saath chai peete dekha gaya.'); }
    if (s.heat > 30 && Math.random() < .4) { G.apply({ heat: 2 }); msg.push('Ramdhan ji ne BDO ko ek aur shikayat bheji.'); }
    return msg;
  }

  // ---------------- events ----------------
  function forcedEvents() {
    const s = S(), p = P(), out = [];
    if (p.phase !== 'govern') return out;
    if (janAvg() < 38 && s.turn - p.noconfAt > 12) { p.noconfAt = s.turn; out.push(DATA.EVENTS.find(e => e.id === 'noconf')); }
    else if (s.heat >= 50 && !p.freeze && s.turn - p.freezeAt > 12) { p.freezeAt = s.turn; out.push(DATA.EVENTS.find(e => e.id === 'dmfreeze')); }
    else if (p.auditAt && s.turn >= p.auditAt && !p.audit) { p.auditAt = null; out.push(DATA.EVENTS.find(e => e.id === 'socialaudit')); }
    return out;
  }
  function fx(f, out) {
    const s = S(), p = P(); if (!p) return;
    if (f.fund) p.fund = Math.max(0, p.fund + f.fund);
    if (f.ownrev) { p.ownRev += f.ownrev; p.fund += f.ownrev; }
    if (f.freeze) { p.freeze = f.freeze === 'mla' ? (s.rishte.mla > 20 ? 0 : 3) : f.freeze; out.notes.push(p.freeze ? `${p.freeze} mahine tak koi bhugtaan nahi.` : 'MLA ke phone se DM ne aadesh waapas liya.'); }
    if (f.audit) {
      if (f.audit === 'check') p.audit = (p.usedConnected || s.heat > 40) ? 'fail' : 'pass';
      else if (f.audit === 'bribe') p.audit = 'pass';
      else p.audit = f.audit;
      out.notes.push(p.audit === 'pass' ? 'Social audit saaf! Report Gram Sabha mein padhi gayi.' : 'Social audit mein gadbad mili. Report jila bheji gayi.');
      if (p.audit === 'pass' && f.audit === 'check') G.addHeadline('Rashtriya Darpan', `${s.name} ki panchayat ka social audit bilkul saaf`);
    }
    if (f.noconf) {
      const chance = { woo: .45 + janAvg() / 200 + p.ehsaan * .03, sabha: .35 + janAvg() / 150, trade: .9 }[f.noconf];
      if (f.noconf === 'trade') G.apply({ kaala: -50000 });
      if (Math.random() < chance) { out.notes.push('Avishwas prastav gir gaya! Kursi bachi.'); G.addHeadline('Gaon Ki Awaaz', `Avishwas prastav gira; Pradhan ${s.name} ki kursi salaamat`); G.apply({ janAll: 2 }, out); }
      else removed(out);
    }
  }
  function removed(out) {
    const s = S(), p = P();
    out.notes.push('Avishwas prastav paas. Tumhe Pradhan pad se hata diya gaya. 6 hafte mein up-chunav.');
    G.addHeadline('Sansani TV', `BREAKING: Pradhan ${s.name} avishwas prastav mein haare; gaon mein up-chunav`);
    s.rank = 2; p.phase = 'campaign'; s.monthly = false;
    s.election = { left: 6, kind: 'pradhan', name: 'Pradhan Up-chunav', mission: 'Up-chunav jeeto, kursi wapas lo', spend: 0 };
  }

  // ---------------- schedule (end of turn) ----------------
  function schedule() {
    const s = S(), p = P();
    if (s.election) { s.election.left--; return false; }
    if (p.phase !== 'govern') return false;
    const m = G.month(), key = s.year + '-' + m;
    if (SABHA_MONTHS[m] && !p.sabhaSeen.includes(key)) { p.sabhaSeen.push(key); p.sabhaDue = SABHA_MONTHS[m]; return 'sabha'; }
    if (s.turn >= p.termEnd) { p.phase = 'rotation'; s.monthly = false; return 'rotation'; }
    return false;
  }

  // ---------------- Pradhan election ----------------
  function runElection() {
    const s = S(), p = P(), rounds = [];
    const fit = (s.chhavi.sevak * .4 + s.chhavi.vikas * .3 + s.chhavi.imaan * .3) / 100 - s.heat / 150;
    const incumbentEdge = p.attempts > 1 && p.wasPradhan ? .5 : 0;
    let tot = [0, 0, 0];
    T().forEach(t => {
      const voters = 700;
      const Up = s.jan[t.id] / 12 + fit + incumbentEdge + .3 + G.rnd(-.3, .3);
      const Ur = s.rival[t.id] / 12 + s.grudge / 300 + G.rnd(-.3, .3);
      const Uk = 2.2 + G.rnd(-.3, .3); // Kamla Devi, independent
      const e = [Up, Ur, Uk].map(u => Math.exp(u / 1.6)), z = e[0] + e[1] + e[2];
      const turnout = clamp(.62 + s.josh / 400, .45, .9), v = Math.round(voters * turnout);
      const pv = Math.round(v * e[0] / z), rv = Math.round(v * e[1] / z), kv = v - pv - rv;
      rounds.push({ name: t.name, v: [pv, rv, kv], cov: s.jan[t.id] / 100 });
      tot = [tot[0] + pv, tot[1] + rv, tot[2] + kv];
    });
    const won = tot[0] > tot[1] && tot[0] > tot[2];
    s.election = null;
    const tips = [];
    const w = [...rounds].sort((a, b) => (a.v[0] - a.v[1]) - (b.v[0] - b.v[1]))[0];
    tips.push(`${w.name} sabse kamzor kadi raha (${w.v[0]} banaam ${w.v[1]}).`);
    tips.push(s.josh < 60 ? 'Josh kam tha, isliye turnout kam. Nukkad Sabha se karyakarta jagao.' : 'Karyakartaon ke josh ne turnout badhaya.');
    tips.push(s.heat > 25 ? 'Heat ki wajah se Imaandar matdaata kategaye.' : 'Saaf chhavi ne Kamla Devi ki taraf jaane wale vote roke.');
    if (won) {
      s.rank = 3; s.electionsWon++; s.maala += 25; p.phase = 'govern'; s.monthly = true; p.wasPradhan = true;
      if (p.termStart == null) { p.termStart = s.turn; p.termEnd = s.turn + TERM; p.auditAt = s.turn + 30; p.fund += 4 * L; p.tied += 3 * L; }
      p.planPassed = true; G.apply({ vishwas: 8, josh: 12 });
      G.addHeadline('Gaon Ki Awaaz', `Naye Gram Pradhan ${s.name}: ${tot[0] - tot[1]} vote se Ramdhan ji ko haraya`);
    } else {
      s.age += 5; s.year += 5; T().forEach(t => s.jan[t.id] = clamp(s.jan[t.id] + 4));
      G.addHeadline('Khabar Fatafat', `Ramdhan ji phir Pradhan; ${s.name} bole "paanch saal baad milenge"`);
      startCampaign();
      tips.unshift('Haar ka matlab 5 saal ka intezaar. Umar ki ghadi chal rahi hai.');
    }
    G.checkMissions({ d: {}, missionsDone: [] }); G.fillMissions(); G.save();
    return { kind: 'pradhan', title: 'Gram Pradhan · Rampur', won, winTitle: 'PRADHAN JI!', winSub: `${tot[0] - tot[1]} vote se jeet. Panchayat ki chaabi ab aapke haath.`,
      loseSub: `Ramdhan ji ${tot[1] - tot[0]} vote se aage. 5 saal baad dobara.`,
      cands: [{ name: s.name, sub: 'Aap', face: 'player' }, { name: 'Ramdhan ji', sub: 'Purv Pradhan · Bunty ke chacha', face: 'ramdhan' }, { name: 'Kamla Devi', sub: 'Nirdaliya', face: 'x' }],
      rounds, totals: tot, analysis: tips.slice(0, 3) };
  }

  // ---------------- Gram Sabha ----------------
  function sabhaStart() {
    const s = S(), p = P();
    const base = 140 + janAvg() * 2 + s.josh * 1.2 + (builtIn('bhawan').length ? 40 : 0);
    const demands = G.pick([0, 1]) ? T().slice(0, 3) : T().slice(1, 4);
    return { when: p.sabhaDue, base: Math.round(base), quorum: 280, mob: 0,
      demands: demands.map(t => ({ tola: t.id, issue: t.issue, say: DEMAND_TEXT[t.issue](t.name) })) };
  }
  const DEMAND_TEXT = {
    paani: (n) => `"${n} mein nal kab aayega? Auratein 2 km se paani laati hain."`,
    bijli: (n) => `"${n} ki galiyon mein andhera hai. Solar light chahiye."`,
    sadak: (n) => `"${n} ki sadak kichad ban jaati hai. Pakki sadak do."`,
    kisan: (n) => `"${n} ke khet sookhe hain. Check dam banwao."`,
  };
  const ISSUE_PROJECTS = { paani: ['nal', 'naali', 'shauch'], bijli: ['solar'], sadak: ['sadak', 'bhawan'], kisan: ['checkdam', 'gaushala', 'haat'], shiksha: ['school', 'anganwadi', 'maidan'] };
  function sabhaFinish(r) { // r: { mobilise, answers:[...], heckle, list }
    const s = S(), p = P(), out = { d: {}, notes: [] };
    let att = r.base + (r.mobilise === 'munadi' ? 80 : r.mobilise === 'workers' ? 60 : 0);
    if (r.mobilise === 'munadi') G.apply({ paisa: -2000 }, out);
    if (r.mobilise === 'workers') s.samayDebt = (s.samayDebt || 0) + 1;
    att = Math.round(att + G.rnd(-20, 20));
    const quorum = att >= r.quorum;
    r.answers.forEach((a, i) => {
      const d = r.demands[i];
      if (a === 'promise') { p.promises.push({ tola: d.tola, issue: d.issue, due: s.turn + 4 }); G.apply({ jan: { [d.tola]: 3 } }, out); }
      if (a === 'truth') G.apply({ jan: { [d.tola]: -1 }, imaan: 2 }, out);
      if (a === 'delay') G.apply({ jan: { [d.tola]: -3 } }, out);
    });
    if (r.heckle === 'records') G.apply(s.heat < 30 ? { imaan: 3, janAll: 1 } : { heat: 3, janAll: -1 }, out);
    if (r.heckle === 'shout') G.apply({ dabang: 3, janAll: -1, grudge: 5 }, out);
    let passed = false;
    if (quorum) {
      const support = janAvg() + r.answers.filter(a => a === 'promise').length * 3 + (r.list === 'fair' ? 4 : -2);
      passed = support + G.rnd(-8, 8) > 50;
      if (r.list === 'fair') G.apply({ sevak: 3, janAll: 2 }, out);
      if (r.list === 'favour') { const top = T().slice().sort((a, b) => s.jan[b.id] - s.jan[a.id])[0].id; G.apply({ jan: Object.fromEntries(T().map(t => [t.id, t.id === top ? 5 : -3])), heat: 5 }, out); }
    } else G.apply({ janAll: -1 }, out);
    p.planPassed = passed; if (passed) p.sabhaPassed++;
    G.addHeadline('Gaon Ki Awaaz', quorum ? (passed ? `${r.when} ki Gram Sabha: ${att} log, Gram Panchayat Vikas Yojana paas` : `${r.when} ki Gram Sabha mein hungama, yojana atki`) : `${r.when} ki Gram Sabha: quorum poora nahi, baithak sthagit`);
    p.sabhaDue = null; G.checkMissions({ d: {}, missionsDone: [] }); G.save();
    return { att, quorum, passed, d: out.d };
  }

  // ---------------- rotation & member elections (3b/3c) ----------------
  function rotation() {
    const s = S();
    if (!P().rot) P().rot = Math.random() < .55 ? (s.gender === 'f' ? 'SC' : 'Mahila') : 'none';
    return P().rot;
  }
  function rotationChoose(c) {
    const s = S(), p = P();
    p.rotChoice = c;
    if (c === 'ally') { G.apply({ rishte: { sitara: 20 } }); p.ehsaan += 2; G.addHeadline('Gaon Ki Awaaz', `Sitara nayi Pradhan; ${s.name} ka samarthan`); }
    if (c === 'family') { G.apply({ heat: 8 }); G.addHeadline('Khabar Fatafat', `"Pradhan-pati" raaj? ${s.name} ke parivaar se nayi Pradhan`); }
    p.phase = 'bdc'; G.save();
  }
  function bdcSeat() {
    const s = S(), p = P();
    const score = janAvg() + s.chhavi.sevak / 5 + p.ehsaan * 2 + G.rnd(-10, 10);
    const won = score > 45;
    if (won) { p.phase = 'block'; G.addHeadline('Gaon Ki Awaaz', `${s.name} Kshetra Panchayat (BDC) sadasya chune gaye`); }
    else { s.age += 5; s.year += 5; G.addHeadline('Gaon Ki Awaaz', `BDC seat haare ${s.name}; 5 saal baad phir koshish`); }
    G.save(); return { won, score: Math.round(score) };
  }
  const MEMBER_NAMES = ['Shivpal', 'Rukmini', 'Asgar', 'Jagannath', 'Phoolmati', 'Rafiq', 'Kailash', 'Sundari', 'Bhola', 'Chameli', 'Iqbal', 'Ramvilas', 'Kusum', 'Haroon', 'Lalmani', 'Saroj', 'Mahavir', 'Nirmala', 'Yusuf', 'Gendalal'];
  const VILLAGES = ['Sonpur', 'Bhitari', 'Kamalpur', 'Rasoolpur', 'Devgarh', 'Nayagaon'];
  const DEMANDS = [
    { id: 'vikas', name: 'Vikas vaada', icon: 'road' },
    { id: 'pad', name: 'Pad', icon: 'crown' },
    { id: 'nakad', name: 'Nakad', icon: 'coins' },
    { id: 'ehsaan', name: 'Purana ehsaan', icon: 'handshake' },
  ];
  function mgStart(level) {
    const s = S(), p = P(), n = level === 'block' ? 80 : 60;
    const mine = Math.round(n * (.2 + janAvg() / 500 + (p.rotChoice === 'ally' ? .03 : 0) + (level === 'zila' && s.rank >= 4 ? .08 : 0))); // a sitting Block Pramukh brings his block's members
    const rivalShare = level === 'zila' && !p.ruling ? .38 : .3;
    const theirs = Math.round(n * rivalShare);
    const members = [];
    for (let i = 0; i < n; i++) {
      const side = i < mine ? 'me' : i < mine + theirs ? 'rival' : 'open';
      members.push({ i, name: `${MEMBER_NAMES[i % MEMBER_NAMES.length]} · ${VILLAGES[Math.floor(i / MEMBER_NAMES.length) % VILLAGES.length]}`, side, want: G.pick(DEMANDS).id, price: Math.round(G.rnd(1, 3)), loyal: side === 'open' ? 0 : Math.round(G.rnd(30, 70)) });
    }
    p.mg = { level, n, need: Math.floor(n / 2) + 1, round: 1, rounds: 4, samay: 7, posts: 3, members, log: [], resort: false, rivalResort: false };
    G.save(); return p.mg;
  }
  function mgOffer(i, kind) {
    const s = S(), p = P(), mg = p.mg, m = mg.members[i];
    if (mg.samay < 1) return { ok: false, msg: 'Is hafte ka Samay khatam' };
    if (kind === 'pad' && mg.posts < 1) return { ok: false, msg: 'Dene ko koi pad nahi bacha' };
    if (kind === 'ehsaan' && p.ehsaan < 1) return { ok: false, msg: 'Koi ehsaan baaki nahi' };
    if (kind === 'nakad' && s.paisa + s.kaala < m.price * 25000) return { ok: false, msg: 'Itna paisa nahi' };
    mg.samay--;
    let chance = { vikas: .45, pad: .7, nakad: .8, ehsaan: .9 }[kind] + (m.want === kind ? .2 : 0) - (m.side === 'rival' ? .35 : 0) - (m.side === 'rival' ? m.loyal / 300 : 0);
    if (kind === 'vikas') chance += s.chhavi.vikas / 400;
    if (kind === 'pad') mg.posts--;
    if (kind === 'ehsaan') p.ehsaan--;
    if (kind === 'nakad') { const c = m.price * 25000; const fromK = Math.min(s.kaala, c); s.kaala -= fromK; s.paisa -= c - fromK; G.apply({ heat: 3 + m.price, imaan: -1 }); }
    const ok = Math.random() < chance;
    if (ok) { m.side = 'me'; m.loyal = kind === 'ehsaan' ? 80 : kind === 'pad' ? 70 : kind === 'nakad' ? 45 : 55; }
    G.save();
    return { ok: true, won: ok, msg: ok ? `${m.name} aapke saath!` : `${m.name}: "Soch ke bataunga..."` };
  }
  function mgEndRound(resort) {
    const s = S(), p = P(), mg = p.mg, log = [];
    if (mg.round === mg.rounds && resort) { mg.resort = true; G.apply({ kaala: -Math.min(s.kaala, 150000), paisa: -Math.max(0, 150000 - s.kaala), heat: 12 }); log.push('Aapke sadasya resort mein. Koi phone nahi, koi mulaqat nahi.'); }
    // rival bot: buys open members, poaches weakly-held ones
    const rivalPower = (mg.level === 'zila' ? (p.ruling ? 5 : 7) : 8) + Math.round(s.grudge / 40);
    let bought = 0, poached = 0;
    for (let k = 0; k < rivalPower; k++) {
      const open = mg.members.filter(m => m.side === 'open');
      const weak = mg.resort ? [] : mg.members.filter(m => m.side === 'me' && m.loyal < 55);
      if (open.length && (Math.random() < .7 || !weak.length)) { const m = G.pick(open); if (Math.random() < .6) { m.side = 'rival'; m.loyal = 50; bought++; } }
      else if (weak.length) { const m = G.pick(weak); if (Math.random() < .35) { m.side = 'rival'; m.loyal = 50; poached++; } }
    }
    if (bought) log.push(`Ramdhan gut ne ${bought} anirnit sadasya kheench liye.`);
    if (poached) log.push(`${poached} sadasya aapka saath chhod gaye. Kamzor wafaadari ka nateeja.`);
    if (mg.round === mg.rounds - 1 && Math.random() < .6) { mg.rivalResort = true; log.push('Khabar: Ramdhan gut apne sadasyon ko Nainital le gaya.'); }
    mg.log = log.concat(mg.log).slice(0, 8);
    mg.round++; mg.samay = 7 + (s.aides.includes('pa') ? 1 : 0);
    S().turn++; S().week += 1; if (S().week >= 53) { S().week -= 52; S().year++; S().age++; }
    G.save(); return log;
  }
  function mgVote() {
    const s = S(), p = P(), mg = p.mg;
    // undecided split; un-resorted rival-side members with low loyalty may cross-vote
    mg.members.forEach(m => {
      if (m.side === 'open') m.vote = Math.random() < .45 ? 'me' : 'rival';
      else if (m.side === 'rival' && !mg.rivalResort && m.loyal < 45 && Math.random() < .15) m.vote = 'me';
      else m.vote = m.side;
    });
    const groups = 4, size = Math.ceil(mg.n / groups), rounds = [];
    for (let g = 0; g < groups; g++) {
      const ms = mg.members.slice(g * size, (g + 1) * size);
      rounds.push({ name: `Matpatr ${g * size + 1}-${Math.min(mg.n, (g + 1) * size)}`, v: [ms.filter(m => m.vote === 'me').length, ms.filter(m => m.vote === 'rival').length, 0], cov: 0 });
    }
    const tot = [rounds.reduce((a, r) => a + r.v[0], 0), rounds.reduce((a, r) => a + r.v[1], 0), 0];
    const won = tot[0] >= mg.need, lvl = mg.level;
    const title = lvl === 'block' ? 'Block Pramukh' : 'Zila Panchayat Adhyaksh';
    if (won) {
      s.rank = lvl === 'block' ? 4 : 5; s.electionsWon++; s.maala += 30; G.apply({ vishwas: 10, josh: 10 });
      G.addHeadline('Rashtriya Darpan', `${s.name} bane ${title}; ${tot[0]} sadasyon ka samarthan`);
      p.phase = lvl === 'block' ? 'zila' : 'done'; p.mg = null;
    } else {
      s.age += 5; s.year += 5;
      G.addHeadline('Khabar Fatafat', `${title} chunav mein ${s.name} ko ${tot[0]} vote; 5 saal baad phir`);
      p.mg = null; // retry the same level next cycle
    }
    if (p.phase === 'done') s.stageDone = true;
    G.save();
    const tips = [`Majority ke liye ${mg.need} chahiye the; aapko ${tot[0]} mile.`,
      mg.resort ? 'Resort ne aapke sadasya bachaaye, par Heat badhi.' : 'Aakhri hafte resort ke bina kamzor sadasya toot sakte the.',
      lvl === 'zila' && !p.ruling ? 'Rajya mein virodhi party ki sarkar hone se Zila Adhyaksh ka chunav sabse kathin tha.' : 'Purane ehsaan sabse pakka sauda hote hain: Janta Darbar se ehsaan kamaao.'];
    return { kind: lvl, title: `${title} · Sadasya matdaan`, won, winTitle: title.toUpperCase() + '!', winSub: `${tot[0]} / ${mg.n} sadasya aapke saath.`, loseSub: `Sirf ${tot[0]} sadasya. ${mg.need} chahiye the. 5 saal baad phir.`,
      cands: [{ name: s.name, sub: 'Aap', face: 'player' }, { name: 'Ramdhan gut', sub: 'Bunty ka khema', face: 'ramdhan' }, { name: '—', sub: '', face: 'x' }],
      rounds, totals: tot, analysis: tips };
  }

  // ---------------- missions / goals / misc ----------------
  function progress(k) {
    const p = P(); if (!p) return null;
    if (k === 'projDone') return p.done;
    if (k === 'sabhaPassed') return p.sabhaPassed;
    if (k === 'termGoals') return p.goals.filter(goalDone).length;
    return null;
  }
  function goals() {
    const s = S(), p = P(); if (!p) return [];
    return [
      { t: 'Gram Pradhan bano', ok: s.rank >= 3 || !!p.termStart },
      { t: 'Kaaryakaal ke 4 sapne', ok: p.goals.length === 4 && p.goals.every(goalDone), opt: ['rotation', 'bdc', 'block', 'zila', 'done'].includes(p.phase), p: p.goals.length ? `${p.goals.filter(goalDone).length}/4` : 'Chuno' },
      { t: 'Block Pramukh bano', ok: s.rank >= 4, p: p.phase === 'block' ? 'Ab' : '' },
      { t: 'Zila Panchayat Adhyaksh bano', ok: s.rank >= 5, p: p.phase === 'zila' ? 'Ab' : '' },
    ];
  }
  const stageDone = () => P() && P().phase === 'done';
  function teaser() {
    const s = S(), p = P(); if (!p) return null;
    if (s.election && s.election.left === 1) return 'Kal matdaan. Ramdhan ji ki gaadiyan raat bhar chal rahi hain...';
    if (p.phase === 'govern') {
      const nm = G.month() + 1; const next = SABHA_MONTHS[nm % 12];
      if (next) return `Agle mahine ${next} ki Gram Sabha. Ramdhan ji sawaal taiyaar kar rahe hain...`;
      if (G.month() === 5) return 'Mansoon aa raha hai. Kaun sa kaam tikega, kaun sa bahega?';
      if (p.termEnd - s.turn <= 3) return 'Kaaryakaal khatam hone ko hai. Aarakshan ki nayi suchi aane waali hai...';
    }
    return Math.random() < .5 ? G.pick(TEASERS3) : null;
  }

  return { init, act, weekly, rivalAct, forcedEvents, fx, schedule, runElection, progress, goals, stageDone, teaser,
    GROUPS, PROJECTS, QUALITY, CONTRACTOR, CREDIT, TERM_GOALS, TERM, quote, canStart, startProject, repair, defOf, builtIn,
    goalDone, goalProg, chooseGoals, sabhaStart, sabhaFinish, rotation, rotationChoose, bdcSeat, mgStart, mgOffer, mgEndRound, mgVote, DEMANDS, ISSUE_PROJECTS };
})();
