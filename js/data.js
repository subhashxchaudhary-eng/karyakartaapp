/* Neta — content data for the vertical slice (Prologue + Stage 1). All people, parties and media are fictional. */
window.DATA = (() => {
  const BACKGROUNDS = [
    { id: 'kisan', name: 'Kisan Parivaar', icon: 'sprout', plus: 'Kisan ka bharosa', minus: 'Paisa kam',
      start: { paisa: 2000, sevak: 55, vikas: 35, dabang: 35, imaan: 50, members: 3, josh: 60, vishwas: 20, jan: { kisan: 12 } } },
    { id: 'chhatra', name: 'Chhatra Neta', icon: 'megaphone', plus: 'Yuva + Josh', minus: 'Garam mizaaj',
      start: { paisa: 1500, sevak: 40, vikas: 35, dabang: 55, imaan: 45, members: 5, josh: 80, vishwas: 20, heat: 8, jan: { bazaar: 8 } } },
    { id: 'vyapari', name: 'Vyapari Parivaar', icon: 'coins', plus: 'Paisa + Bazaar', minus: '"Seth ka aadmi"',
      start: { paisa: 9000, sevak: 30, vikas: 45, dabang: 35, imaan: 40, members: 3, josh: 55, vishwas: 22, jan: { bazaar: 14, purab: -4 } } },
    { id: 'netaji', name: 'Netaji ki Santaan', icon: 'crown', plus: 'Party Vishwas', minus: '"Parivaarvaad"',
      start: { paisa: 7000, sevak: 25, vikas: 40, dabang: 45, imaan: 35, members: 4, josh: 50, vishwas: 45, jan: {} } },
    { id: 'samajik', name: 'Samajik Karyakarta', icon: 'heart', plus: 'Jan Sevak, mahila', minus: 'Paisa nahi',
      start: { paisa: 800, sevak: 65, vikas: 35, dabang: 25, imaan: 60, members: 4, josh: 65, vishwas: 15, jan: { purab: 10, pashchim: 6 } } },
    { id: 'sainik', name: 'Poorv Sainik', icon: 'shield', plus: 'Imaandar, izzat', minus: 'Jaati ganit kamzor',
      start: { paisa: 4000, sevak: 40, vikas: 40, dabang: 55, imaan: 70, members: 3, josh: 60, vishwas: 15, jan: { pashchim: 6, kisan: 4 } } },
  ];

  const STATES = [
    { id: 'HR', name: 'Haryana', seats: 90, diff: 'Aasaan', tag: 'Tutorial state' },
    { id: 'UP', name: 'Uttar Pradesh', seats: 403, diff: 'Kathin', tag: '4 kshetra, bahukoniya ladai' },
    { id: 'BR', name: 'Bihar', seats: 243, diff: 'Kathin', tag: 'Gathbandhan ki rajneeti' },
    { id: 'RJ', name: 'Rajasthan', seats: 200, diff: 'Madhyam', tag: 'Har baar palat' },
  ];

  // Village voter segments (tolas) for Stage 1. size = school-committee voters (parents) in that tola.
  const TOLAS = [
    { id: 'purab', name: 'Purab Tola', size: 11, issue: 'paani', base: 28, rival: 38, x: 27, y: 30 },
    { id: 'pashchim', name: 'Pashchim Tola', size: 9, issue: 'bijli', base: 30, rival: 34, x: 74, y: 27 },
    { id: 'bazaar', name: 'Bazaar', size: 8, issue: 'sadak', base: 32, rival: 42, x: 52, y: 58 },
    { id: 'kisan', name: 'Kisan Basti', size: 12, issue: 'kisan', base: 30, rival: 36, x: 22, y: 78 },
  ];
  const ISSUE_ICON = { paani: 'drop', bijli: 'zap', sadak: 'road', kisan: 'sprout', shiksha: 'school', ration: 'briefcase' };

  const PROBLEMS = [
    { id: 'pump', tola: 'purab', name: 'Hand pump kharab', icon: 'pump', need: 2, cost: 800 },
    { id: 'trafo', tola: 'pashchim', name: 'Transformer jal gaya', icon: 'zap', need: 2, cost: 1500 },
    { id: 'ration', tola: 'kisan', name: 'Ration card gayab', icon: 'briefcase', need: 2, cost: 200 },
    { id: 'naali', tola: 'bazaar', name: 'Naali jam, sadak pe paani', icon: 'road', need: 2, cost: 600 },
  ];

  // Action cards. slots = Samay cost. tgt = needs a tola target.
  const ACTIONS = [
    { id: 'sampark', name: 'Jan Sampark', icon: 'door', slots: 1, tgt: true, c: ['#2a7de1', '#1749a8'], desc: 'Ghar ghar jaakar milo', fx: '+Samarthan' },
    { id: 'nukkad', name: 'Nukkad Sabha', icon: 'megaphone', slots: 2, tgt: true, cost: 500, c: ['#ff8a1f', '#d4520b'], desc: 'Chaurahe pe bhashan, josh badhao', fx: '+Samarthan +Josh' },
    { id: 'samasya', st: [1], name: 'Samasya Hal Karo', icon: 'wrench', slots: 2, tgt: true, c: ['#19b59b', '#0d7a69'], desc: 'Tola ki samasya pe kaam karo', fx: '+Jan Sevak' },
    { id: 'group', st: [1], name: 'Group Meeting', icon: 'users', slots: 1, c: ['#8a52e8', '#5a2bb0'], desc: 'Naye sadasya jodo', fx: '+Sadasya' },
    { id: 'chai', name: 'Chai pe Charcha', icon: 'handshake', slots: 1, cost: 200, c: ['#d6488a', '#9b1f5c'], desc: 'Mandal Adhyaksh ke saath', fx: '+Party Vishwas' },
    { id: 'chanda', name: 'Chanda Ikattha', icon: 'coins', slots: 1, c: ['#c79a12', '#8a6400'], desc: 'Dukaandaron se sahyog', fx: '+Paisa' },
    { id: 'jaasoos', name: 'Rival pe Nazar', icon: 'eye', slots: 1, c: ['#4b4f6b', '#262838'], desc: 'Bunty ki agli chaal pata karo', fx: 'Intel' },
    { id: 'cricket', st: [1], name: 'Cricket Tournament', icon: 'bat', slots: 3, cost: 3000, c: ['#2fae4f', '#17702f'], desc: 'Poore gaon ka utsav', fx: '+Sab tola', once: 'event' },
    { id: 'parcha', st: [1], name: 'Jhootha Parcha', icon: 'news', slots: 1, cost: 300, grey: true, c: ['#5c2a2a', '#2c1010'], desc: 'Bunty ke khilaaf afwaah', fx: 'Rival − / Heat +' },
  ];

  // Prologue: CM crisis, 25 years later
  const PROLOGUE = [
    { who: 'Sansani TV', icon: 'tv', time: '00:12', say: 'BREAKING: Do sahyogi dal sarkar se bahar! Rajyapal ne kal subah 11 baje floor test bulaya.' },
    { who: 'Pandey ji, Niji Sahayak', icon: 'user', time: '00:31', say: 'Sir... 9 MLA resort mein hain. Phone band. Aapke paas 11 baje tak ka samay hai.',
      choices: [
        { t: 'Purane dost Yadav ji ko phone karo', r: 'Yadav ji: "Aapne 25 saal pehle mera saath diya tha. Main 4 MLA laata hoon."' },
        { t: 'Ek MLA ko mantri pad ki peshkash', r: 'Pandey ji: "Sir, 3 aur tayyar hain. Par ye kharcha yaad rakhiyega." Heat ka thermometer chamka.', heat: true },
        { t: 'Seedha TV pe live jao', r: 'Sansani TV: "CM ne kaha: janta mere saath hai. Resort waale MLA dabav mein."' },
      ] },
    { who: 'Pandey ji, Niji Sahayak', icon: 'phone', time: '03:47', say: 'Sir, ginti shuru hone waali hai. Kaun saath hai, kaun nahi... ab aapki 25 saal ki kamaai ka imtihaan hai.',
      choices: [
        { t: 'Sadan mein jaakar bhashan do', r: '"Main booth se yahan tak aaya hoon. Ek-ek vote kamaaya hai."' },
        { t: 'Aakhri ghante mein ek aur phone', r: 'Phone ki ghanti... aur fir khamoshi.' },
      ] },
    { who: 'Speaker', icon: 'gavel', time: '11:00', say: 'Matdaan shuru. Jo prastav ke paksh mein hain, khade ho jaayein...' },
  ];

  const MISSION_POOL = {
    0: [
      { id: 'm_sampark2', t: 'Is hafte 2 baar Jan Sampark karo', k: 'act:sampark', n: 2, rw: { jan: 3 } },
      { id: 'm_group1', t: 'Ek Group Meeting rakho', k: 'act:group', n: 1, rw: { josh: 5 } },
      { id: 'm_samasya', t: 'Ek samasya pe kaam karo', k: 'act:samasya', n: 1, rw: { sevak: 3 } },
      { id: 'm_chanda', t: 'Chanda ikattha karo', k: 'act:chanda', n: 1, rw: { paisa: 500 } },
      { id: 'm_nukkad', t: 'Ek Nukkad Sabha karo', k: 'act:nukkad', n: 1, rw: { jan: 3 } },
    ],
    1: [
      { id: 's_members', t: 'Yuva Mandal ko 15 sadasya tak badhao', k: 'members', n: 15, rw: { vishwas: 6 } },
      { id: 's_solve3', t: 'Gaon ki 3 samasyaein hal karo', k: 'solved', n: 3, rw: { sevak: 8, jan: 5 } },
    ],
    2: [
      { id: 'd_notice', t: 'Mandal Adhyaksh ki nazar mein aao (Vishwas 50)', k: 'vishwas', n: 50, rw: { vishwas: 0, maala: 2 } },
    ],
  };

  // Event deck. Each choice: t (text), fx (effects), say (outcome line), head (headline added), seed (future event id)
  const EVENTS = [
    { id: 'gossip', cat: 'Rival', rar: 0, art: 'gossip', title: 'Chaupal pe afwaah',
      text: 'Bunty Bhaiya chaupal pe keh raha hai ki tumhara Yuva Mandal "sirf photo khinchwane" ke liye hai. Kuch log has rahe hain.',
      choices: [
        { t: 'Kaam dikhao: agle hafte ka plan sabke saamne rakho', fx: { sevak: 3, janAll: 2, samay: -1 }, say: 'Logon ne plan suna. Kuch sar hilaye.' },
        { t: 'Bunty ko seedhe jawab do, sabke saamne', fx: { dabang: 5, janAll: 1, grudge: 10 }, say: 'Chaupal mein taaliyan. Bunty ka chehra laal.' },
        { t: 'Ignore karo', fx: { janAll: -2 }, say: 'Afwaah thodi aur phail gayi.' },
      ] },
    { id: 'poach', cat: 'Rival', rar: 1, art: 'poach', title: 'Golu ko lalach',
      text: 'Bunty ne tumhare dost Golu ko naya phone aur "group ka secretary" pad offer kiya hai. Golu duvidha mein hai.',
      choices: [
        { t: 'Golu ko Yuva Mandal ka upadhyaksh banao', fx: { josh: 6, rishte: { golu: 15 } }, say: 'Golu: "Bhai, main kahin nahi ja raha."' },
        { t: 'Usse bhi bada gift do (₹1,500)', fx: { paisa: -1500, rishte: { golu: 8 }, imaan: -3 }, say: 'Golu ruk gaya, par baaki sab ne dekha.' },
        { t: 'Jaane do, jo jaana chahe jaaye', fx: { members: -2, josh: -8, rishte: { golu: -40 } }, say: 'Golu Bunty ke saath chala gaya, 1 aur sadasya ke saath.' },
      ] },
    { id: 'kaki', stage: [1, 2, 3], cat: 'Samaj', rar: 0, art: 'kaki', title: 'Ramvati Kaki ki pension',
      text: 'Purab Tola ki Ramvati Kaki ki vidhwa pension 6 mahine se ruki hai. Block office mein koi nahi sunta.',
      choices: [
        { t: 'Khud Block office le jaao (1 Samay)', fx: { samay: -1, jan: { purab: 6 }, sevak: 5, rishte: { kaki: 20 } }, say: 'BDO office mein 4 ghante. Pension chalu.', head: 'Gaon ke yuva ne vidhwa ki ruki pension chalu karwayi' },
        { t: 'Babu ko ₹500 "chai-paani"', fx: { paisa: -500, jan: { purab: 4 }, heat: 4, imaan: -4 }, say: 'Kaam ho gaya. Babu ne muskura ke file aage badhayi.' },
        { t: 'Agle hafte dekhenge', fx: { jan: { purab: -3 }, rishte: { kaki: -10 } }, say: 'Kaki ne kuch nahi kaha. Purab Tola ne sab dekha.' },
      ] },
    { id: 'masterji', cat: 'Shiksha', rar: 0, art: 'school', title: 'Masterji ka nyota',
      text: 'Masterji chahte hain ki Yuva Mandal school ki toot-footi boundary ke liye shramdaan kare. School committee chunav bhi aane wala hai.',
      choices: [
        { t: 'Ravivaar ko poora group shramdaan karega', fx: { samay: -1, josh: 4, janAll: 3, rishte: { master: 20 }, vikas: 3 }, say: 'Diwar khadi. Bachche taali bajaate rahe.', head: 'Yuva Mandal ne ek din mein school ki diwar khadi ki' },
        { t: 'Paise de do (₹1,000), shramdaan nahi', fx: { paisa: -1000, rishte: { master: 8 } }, say: 'Masterji ne dhanyavaad kaha, thoda thanda.' },
        { t: 'Abhi samay nahi hai', fx: { rishte: { master: -15 } }, say: 'Masterji ne chashma utaar ke dekha.' },
      ] },
    { id: 'rain', stage: [1, 2, 3], cat: 'Mausam', rar: 0, art: 'rain', title: 'Bazaar mein paani',
      text: 'Pehli baarish mein Bazaar ki naali jam gayi. Dukaandaar gusse mein hain aur Bunty wahan pehle pahunch gaya.',
      choices: [
        { t: 'Phawda uthao, khud naali saaf karo', fx: { samay: -1, jan: { bazaar: 7 }, sevak: 4 }, say: 'Kichad mein sane kurte ki photo WhatsApp pe viral.', head: 'Kichad mein utra yuva neta, khud saaf ki naali' },
        { t: 'Pradhan ji ko shikayat patra', fx: { jan: { bazaar: 2 }, vishwas: 2 }, say: 'Patra gaya. Jawab ka intezaar.' },
        { t: 'Bunty ka video banao jo kuch nahi kar raha', fx: { jan: { bazaar: 3 }, grudge: 12, heat: 2 }, say: 'Video chal gaya. Bunty ne kasam khaayi.' },
      ] },
    { id: 'dinesh', cat: 'Party', rar: 1, art: 'party', title: 'Mandal Adhyaksh ka phone',
      text: 'Dinesh ji (Rashtriya Pragati Morcha) ne bulaya hai: "Suna hai tum gaon mein kaam kar rahe ho. Rally ke liye 20 log la sakte ho?"',
      choices: [
        { t: 'Haan, 20 log le jaayenge (₹1,200 transport)', fx: { paisa: -1200, vishwas: 10, josh: -3, rishte: { dinesh: 15 } }, say: 'Rally mein Dinesh ji ne tumhe manch pe bulaya.' },
        { t: 'Abhi kisi party se nahi judna', fx: { vishwas: -4, imaan: 3 }, say: 'Dinesh ji: "Theek hai. Darwaza khula hai."' },
        { t: 'Badle mein gaon ke liye transformer maango', fx: { vishwas: 4, rishte: { dinesh: 5 }, solve: 'trafo' }, say: 'Dinesh ji has pade: "Neta ban rahe ho!"' },
      ] },
    { id: 'thar', stage: [1, 2, 3], cat: 'Ghar-parivaar', rar: 1, art: 'family', title: 'Chachera bhai aur bike',
      text: 'Tumhare chachera bhai ne mandi mein bike se ek thele wale ko takkar maar di. Bheed jama hai, video ban raha hai.',
      choices: [
        { t: 'Thele wale ka ilaaj karwao, bhai se maafi mangwao', fx: { paisa: -800, imaan: 6, rishte: { family: -15 }, jan: { bazaar: 4 } }, say: 'Bheed shaant. Ghar mein khamoshi.' },
        { t: 'Chupchaap ₹2,000 de ke maamla khatam', fx: { paisa: -2000, heat: 6 }, say: 'Video delete... shayad.', seed: 'video_back' },
        { t: '"Video fake hai" bol do', fx: { dabang: 4, sevak: -6, heat: 3 }, say: 'Kuch ne maana. Kuch ne nahi.' },
      ] },
    { id: 'video_back', stage: [1, 2, 3], cat: 'Media', rar: 2, art: 'viral', title: 'Video wapas aaya!', seedOnly: true,
      text: 'Woh purana bike waala video ab "Gaon Ki Awaaz" WhatsApp group mein ghoom raha hai, chunav se theek pehle. Bunty ne forward kiya.',
      choices: [
        { t: 'Sach maan lo, thele wale ke saath video banao', fx: { imaan: 6, janAll: -1 }, say: 'Imaandari ki taarif. Nuksaan kam.' },
        { t: 'Bunty pe ulta aarop lagao', fx: { dabang: 4, janAll: -4, grudge: 10 }, say: 'Jhagda badha. Matdata pareshaan.' },
      ] },
    { id: 'contractor', stage: [1, 2, 3], cat: 'Grey', rar: 1, art: 'money', title: 'Thekedar ki peshkash',
      text: 'Ek thekedar kehta hai: "Hand pump ka kaam mujhe dilwa do, ₹2,000 tumhare. Koi nahi jaanega."',
      choices: [
        { t: 'Mana karo', fx: { imaan: 6 }, say: 'Thekedar chala gaya, naraaz.' },
        { t: 'Le lo (kaala paisa)', fx: { kaala: 2000, heat: 9, imaan: -5 }, say: 'Jeb bhaari. Thermometer garam.' },
        { t: 'Shart rakho: kaam achha, paisa nahi', fx: { vikas: 4, solve: 'pump', rishte: { thek: 5 } }, say: 'Pump lag gaya, mazboot.' },
      ] },
    { id: 'holi', stage: [1, 2, 3], cat: 'Tyohaar', rar: 0, art: 'festival', title: 'Tyohaar Milan',
      text: 'Gaon mein tyohaar aa raha hai. Yuva Mandal sab tolon ka saanjha milan karwa sakta hai.',
      choices: [
        { t: 'Sab tolon ka saanjha milan (₹1,500)', fx: { paisa: -1500, janAll: 4, josh: 6 }, say: 'Dhol, gulal, laddoo. Sab ek saath.', head: 'Yuva Mandal ka tyohaar milan: chaaron tole ek manch pe' },
        { t: 'Sirf apne tola mein', fx: { paisa: -500, jan: { kisan: 4 } }, say: 'Achha raha, par chhota.' },
      ] },
    { id: 'sting', cat: 'Rival', rar: 2, art: 'viral', title: 'Bunty ka parcha',
      text: 'Raat mein gaon ki deewaron pe parche chipke: "Yuva Mandal ka chanda kahan gaya?" Koi hisaab maang raha hai.',
      choices: [
        { t: 'Hisaab chaupal pe saarvajanik karo', fx: { imaan: 8, janAll: 3, samay: -1 }, say: 'Har rupaye ka hisaab. Bunty chup.', head: 'Yuva Mandal ne saarvajanik kiya poora hisaab' },
        { t: 'Parche faad do, kuch mat bolo', fx: { janAll: -3 }, say: 'Sawaal bane rahe.' },
      ] },
    { id: 'rivalpoll', cat: 'Chunav', rar: 0, art: 'school', title: 'Bunty ka vaada',
      text: 'School committee chunav ke liye Bunty ne har parent ko "naye school bag" ka vaada kiya hai.',
      choices: [
        { t: 'Hum library banayenge, vaada likh ke do', fx: { vikas: 5, janAll: 2 }, say: 'Masterji ne vaada sabko padh ke sunaya.' },
        { t: 'Hum bhi bag denge (₹2,500)', fx: { paisa: -2500, janAll: 4, imaan: -3, heat: 3 }, say: 'Bag bant gaye. Kuch ne dono se le liye.' },
        { t: 'Bunty ke bag ki quality pe sawaal', fx: { janAll: 1, grudge: 6 }, say: 'Thodi hasi. Bunty chidh gaya.' },
      ] },
  ];

  const TEASERS = [
    'Kal subah Bunty Bhaiya chaupal pe kuch bada elaan karne wala hai...',
    'Bazaar mein afwaah hai ki Pradhan ji ka bhatija tumhare dost se mila...',
    'Mandal Adhyaksh Dinesh ji is hafte gaon aa sakte hain...',
    'Masterji ne kaha hai, "Chunav ki taareekh jaldi aayegi."',
    'Purab Tola mein koi tumhare baare mein sawaal pooch raha tha...',
    'Mausam vibhaag: agle hafte bhaari baarish.',
  ];

  const HEADLINES = [
    { s: 'Sansani TV', t: 'BREAKING: Gaon ke hand pump ne phir dhokha diya, log bole "ab kya karein"' },
    { s: 'Khabar Fatafat', t: 'Bunty Bhaiya ka daava: "Agla Pradhan main hi"; survey kisne karaya? Bunty Bhaiya ne' },
    { s: 'Gaon Ki Awaaz', t: 'Chaupal pe nayi charcha: Yuva Mandal ya Bunty Group?' },
    { s: 'Rashtriya Darpan', t: 'Panchayat chunav se pehle gaon-gaon mein yuva sangathan sakriya' },
  ];

  const FORWARDS = [
    { s: 'Sharma Uncle', t: 'Good Morning! Is message ko 10 logon ko bhejo, nahi to transformer phir jalega.' },
    { s: 'Bunty Group', t: 'Asli vikas sirf Bunty Bhaiya karenge. Baaki sab photo-op!' },
    { s: 'Masterji', t: 'Ravivaar ko school committee ki baithak. Sab abhibhavak aayein.' },
  ];

  const PEOPLE = [
    { id: 'bunty', name: 'Bunty Bhaiya', role: 'Pradhan ka bhatija · Nemesis', arche: 'Rajkumar + Bahubali', rel: -30, col: '#c0392b', hair: '#1a1a1a', skin: '#c68a5a' },
    { id: 'dinesh', name: 'Dinesh ji', role: 'Mandal Adhyaksh, RPM', arche: 'Purana Khiladi', rel: 0, col: '#ff8a1f', hair: '#888', skin: '#b97b4d' },
    { id: 'master', name: 'Masterji', role: 'Pradhanacharya, school', arche: 'Gaon ki izzat', rel: 10, col: '#2a7de1', hair: '#ddd', skin: '#c28b5c' },
    { id: 'kaki', name: 'Ramvati Kaki', role: 'Purab Tola ki buzurg', arche: 'Mahila samooh', rel: 5, col: '#d6488a', hair: '#cfcfcf', skin: '#a8714a', f: true },
    { id: 'golu', name: 'Golu', role: 'Dost, Yuva Mandal', arche: 'Wafaadar?', rel: 40, col: '#2fae4f', hair: '#222', skin: '#c99064' },
    { id: 'sitara', name: 'Sitara', role: 'Dost, Mahila Samooh', arche: 'Teekhi soch', rel: 45, col: '#8a52e8', hair: '#111', skin: '#b5784c', f: true },
  ];

  const RANKS = ['Karyakarta', 'Booth Adhyaksh', 'Ward Panch', 'Gram Pradhan', 'Block Pramukh', 'Zila Adhyaksh', 'MLA', 'Mantri', 'Mukhyamantri', 'Saansad', 'Kendriya Mantri', 'Pradhan Mantri'];

  // ================= STAGE 2: Booth Adhyaksh =================
  const ACTIONS2 = [
    { id: 'suchi', st: [2], name: 'Matdata Suchi Camp', icon: 'book', slots: 2, tgt: true, c: ['#2a9dd6', '#155f8f'], desc: 'Chhoote naam jodo, kate naam bachao', fx: '+Naye matdata' },
    { id: 'bharti', st: [2], name: 'Karyakarta Bharti', icon: 'users', slots: 1, tgt: true, c: ['#8a52e8', '#5a2bb0'], desc: 'Is tola se naya karyakarta', fx: '+Karyakarta' },
    { id: 'baithak', st: [2], name: 'Booth Committee Baithak', icon: 'handshake', slots: 1, cost: 300, c: ['#d6488a', '#9b1f5c'], desc: 'Chai, samosa aur izzat', fx: '+Wafaadari +Josh' },
    { id: 'aadesh', st: [2], name: 'Party ka Aadesh', icon: 'flag', slots: 2, c: ['#ff8a1f', '#b84a00'], desc: 'High command ka kaam poora karo', fx: '+Aadesh' },
  ];
  ACTIONS.push(...ACTIONS2);

  const WORKER_NAMES = {
    m: ['Golu', 'Imran', 'Pappu', 'Raju', 'Sonu', 'Mukesh', 'Arif', 'Deepak', 'Lalit', 'Harish', 'Naveen', 'Sajid', 'Ravi', 'Kallu', 'Jagdish', 'Tinku', 'Bablu', 'Sunil'],
    f: ['Sitara', 'Geeta', 'Rubina', 'Meena', 'Kamla', 'Pooja', 'Shabnam', 'Anita', 'Lakshmi', 'Savita', 'Nazma', 'Rekha'],
  };

  const ORDERS = [
    { id: 'sadasyata', t: 'Sadasyata abhiyaan: 3 hafte mein 3 baar Aadesh', need: 3, weeks: 3, rw: 8, icon: 'users' },
    { id: 'yojana', t: 'Yojana jaagrukta: har tola mein parcha baanto', need: 2, weeks: 3, rw: 6, icon: 'news' },
    { id: 'rally', t: 'Zila rally ke liye bheed: 2 baar Aadesh', need: 2, weeks: 2, rw: 7, icon: 'megaphone' },
    { id: 'survey', t: 'Booth survey bharke Mandal bhejo', need: 1, weeks: 2, rw: 5, icon: 'target' },
  ];

  const MISSION_POOL2 = {
    0: [
      { id: 'b_suchi1', t: 'Ek Matdata Suchi Camp lagao', k: 'act:suchi', n: 1, rw: { vishwas: 2 } },
      { id: 'b_bharti1', t: 'Ek karyakarta bharti karo', k: 'act:bharti', n: 1, rw: { josh: 4 } },
      { id: 'b_baithak', t: 'Booth committee ki baithak rakho', k: 'act:baithak', n: 1, rw: { josh: 4 } },
      { id: 'b_aadesh', t: 'Party ka ek aadesh poora karo', k: 'act:aadesh', n: 1, rw: { vishwas: 3 } },
      { id: 'b_sampark', t: '2 baar Jan Sampark karo', k: 'act:sampark', n: 2, rw: { jan: 3 } },
    ],
    1: [
      { id: 'b_pages', t: '30 panne pe Panna Pramukh lagao', k: 'pages', n: 30, rw: { vishwas: 6, josh: 6 } },
      { id: 'b_enrol', t: '50 naye matdata jodo', k: 'enrolled', n: 50, rw: { vishwas: 6 } },
      { id: 'b_comm', t: 'Santulit committee: har tola 2+, ek-tihaai mahila', k: 'balanced', n: 1, rw: { janAll: 3 } },
    ],
    2: [
      { id: 'b_lift', t: 'Booth pe party ka vote 10 point badhao', k: 'lift', n: 10, rw: { vishwas: 10, maala: 5 } },
    ],
  };

  const EVENTS2 = [
    { id: 'poach2', stage: [2], forced: true, cat: 'Rival', rar: 1, art: 'poach', title: 'Bunty ka naya khel',
      text: 'Bunty Bhaiya ab Jan Sangharsh Party ka booth agent hai. Usne tumhare 3 karyakartaon ko naye phone aur "Mandal mein pad" ka lalach diya hai.',
      choices: [
        { t: 'Teeno ko booth committee mein pad aur izzat do', fx: { josh: 6, poach: 'keep' }, say: '"Bhaiya, hum kahin nahi jaayenge." Bunty khaali haath laut gaya.' },
        { t: 'Unse bada inaam do (₹2,000)', fx: { paisa: -2000, heat: 3, poach: 'buy' }, say: 'Ruk gaye. Par baaki karyakarta bhi ab "inaam" ki ummeed karenge.' },
        { t: 'Jaane do, wafaadar hi rahenge', fx: { josh: -8, poach: 'lose' }, say: 'Teen karyakarta Bunty ke paas chale gaye. Unke panne khaali.' },
      ] },
    { id: 'form7', stage: [2], onceEver: true, cat: 'Matdata Suchi', rar: 1, art: 'school', title: 'Form 7 ka khel',
      text: 'Kisan Basti ke 25 matdataon ke naam katne ke liye kisi ne Form 7 aapattiyan daal di hain. Suchi band hone mein kuch hi din bache hain.',
      choices: [
        { t: 'Har parivaar ke saath BLO ke paas jao (1 Samay)', fx: { samay: -1, restore: 'kisan', vishwas: 3, sevak: 3 }, say: 'Sab naam bach gaye. Kisan Basti ne dekha kaun saath khada tha.' },
        { t: 'ERO ko likhit shikayat', fx: { restore: 'half', imaan: 2 }, say: 'Aadhe naam bache. Jaanch chal rahi hai.' },
        { t: 'Chhodo, chhota maamla hai', fx: { pv: { kisan: -4 } }, say: 'Polling ke din 25 log line se lautaaye gaye.' },
      ] },
    { id: 'blo', stage: [2], onceEver: true, cat: 'Grey', rar: 0, art: 'money', title: 'BLO ki chai',
      text: 'Booth Level Officer kehta hai: "Naye form jaldi chahiye to ₹1,000 chai-paani. Warna line mein lagiye."',
      choices: [
        { t: 'Mana karo, niyam se form jama karo', fx: { imaan: 4, samay: -1 }, say: 'Der lagi, par sab form saaf.' },
        { t: 'Chai-paani de do', fx: { paisa: -1000, heat: 6, enrol: 8 }, say: '8 form ek din mein. Thermometer thoda garam.' },
        { t: 'SDM se shikayat ki dhamki', fx: { dabang: 4, rishte: { bunty: -5 } }, say: 'BLO ne chupchaap form le liye. Naraaz zaroor hai.' },
      ] },
    { id: 'parachute', stage: [2], cat: 'Party', rar: 1, art: 'party', title: 'Bahar ka umeedwar',
      text: 'High command ne vidhan sabha ka ticket Lucknow ke ek vyapari ko de diya. Tumhare karyakarta naraaz hain: "Hum dari bichhayein, ticket bahar waale ko?"',
      choices: [
        { t: 'Karyakartaon ko samjhao: party pehle', fx: { vishwas: 6, josh: -6 }, say: 'Kaam chalta raha, josh thoda kam.' },
        { t: 'Mandal Adhyaksh ko virodh patra', fx: { josh: 6, vishwas: -6, dabang: 3 }, say: 'Karyakarta khush. Dinesh ji ki bhauhein tani.' },
        { t: 'Umeedwar ko booth pe bulao, karyakartaon se milwao', fx: { samay: -1, josh: 3, vishwas: 3, paisa: 1500 }, say: 'Umeedwar ne sabse haath milaya aur booth kharch bheja.' },
      ] },
    { id: 'mahila', stage: [2], cat: 'Samaj', rar: 0, art: 'kaki', title: 'Sitara ka sawaal',
      text: 'Sitara poochti hai: "Committee mein auratein kitni hain? Purab Tola ki auratein tabhi niklengi jab koi apni unhe bulayega."',
      choices: [
        { t: 'Sitara ko Mahila Pramukh banao, 2 mahila karyakarta jodo', fx: { women: 2, sevak: 3, rishte: { sitara: 15 } }, say: 'Purab Tola ki auraton ki baithak mein 40 log aaye.' },
        { t: 'Baad mein dekhenge', fx: { rishte: { sitara: -15 }, pv: { purab: -2 } }, say: 'Sitara ne kuch nahi kaha. Agli baithak mein nahi aayi.' },
      ] },
    { id: 'order_call', stage: [2], cat: 'Party', rar: 0, art: 'party', title: 'Mandal se phone',
      text: 'Dinesh ji: "Booth ka hisaab do. Kitne panne pe Panna Pramukh hain? Zila Adhyaksh khud dekh rahe hain."',
      choices: [
        { t: 'Sach bata do', fx: { imaan: 3, vishwas: 2 }, say: '"Theek hai, kaam chalu rakho."' },
        { t: 'Thoda badha chadha ke bata do', fx: { vishwas: 5, heat: 2, seed: 'audit' }, say: 'Dinesh ji khush. Abhi ke liye.' },
      ] },
    { id: 'audit', stage: [2], seedOnly: true, cat: 'Party', rar: 2, art: 'viral', title: 'Zila ki jaanch',
      text: 'Zila team achanak booth pe aa gayi aur panne gin rahi hai. Tumhare bataye number aur asli number alag hain.',
      choices: [
        { t: 'Galti maan lo, maafi maango', fx: { vishwas: -6, imaan: 4 }, say: 'Daant padi, par izzat bachi.' },
        { t: 'Karyakartaon pe ilzaam daal do', fx: { vishwas: -2, josh: -10 }, say: 'Karyakarta ek doosre ko dekhne lage.' },
      ] },
  ];
  EVENTS.push(...EVENTS2);

  const TEASERS2 = [
    'Bunty Bhaiya Jan Sangharsh Party ke Zila Adhyaksh se mila hai...',
    'BLO ne kaha hai ki suchi jaldi band hogi.',
    'Kuch karyakarta keh rahe hain ki unhe koi poochta nahi...',
    'Dinesh ji ne kaha: "Is baar booth ka number dekhna hai."',
  ];

  return { ACTIONS2, WORKER_NAMES, ORDERS, MISSION_POOL2, TEASERS2, BACKGROUNDS, STATES, TOLAS, ISSUE_ICON, PROBLEMS, ACTIONS, PROLOGUE, MISSION_POOL, EVENTS, TEASERS, HEADLINES, FORWARDS, PEOPLE, RANKS };
})();
