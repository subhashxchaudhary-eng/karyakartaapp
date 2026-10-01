# Neta — HQ Theme: screen design

Portrait-first (max 460px frame, 100dvh), one-thumb play, native Android game feel.
All glyphs are custom SVG line icons from `js/icons.js`; no emoji anywhere.

## Theme tokens (`css/style.css :root`)
| Token | Use |
| --- | --- |
| Night indigo `--bg-0/1/2`, `--panel` | Game chrome, HUD, nav, panels |
| Paper cream `--paper` + ink `--ink` | Story surfaces: event cards, newspapers, career-book clippings |
| Marigold `--gold` → `--saffron` | Primary 3D buttons, rank, highlights, garlands |
| Red / amber | Only danger, Heat and "BREAKING" |
| Baloo 2 (banner lettering) + Poppins | Headings / body |

Game feel: chunky 3D buttons with press-down, spring screen transitions, slide-up event cards,
confetti + garland drop on wins, floating news ticker, WebAudio dhol/coin/whoosh/harmonium-sting,
vibration haptics, Android back-button handling, portrait lock + rotate notice.

## Screens (GDD section 17)
| # | Screen | GDD source | File |
| --- | --- | --- | --- |
| 1 | Splash / main menu | — | `screens/splash.png` |
| 2 | Prologue "25 saal baad" CM floor-test crisis → sepia cut → "25 saal pehle..." | §4 | `screens/prologue.png` |
| 3 | Character creation (name+gender, background, home state, confirm) | §4 | `screens/create-bg.png` |
| 4 | Kshetra home: HUD (rank, saaf/kaala Paisa, Samay dots, Heat thermometer hint, calendar), news ticker, illustrated village map coloured by support with problem pins, Mission Board (3 time scales), Stage checklist, Chhavi axes | §2, §3, §17 | `screens/home.png` |
| 5 | Tola sheet (tap a hamlet) | §17 | `screens/tola-sheet.png` |
| 6 | Turn planner: 7 Samay slots, tola target chips, action-card hand (grey cards marked) | §2 | `screens/planner-full.png` |
| 7 | Event card: illustrated header, rarity tag, 2–4 choices with effect chips and hidden-seed warning | §11 | `screens/event.png` |
| 8 | Turn result + rival move + headline + cliffhanger teaser | §2 | `screens/turn-result.png` |
| 9 | Counting night, TV-studio round-by-round | §8 | `screens/counting-final.png` |
| 10 | "Kyun jeete, kyun haare" breakdown + rematch | §8 | `screens/breakdown.png` |
| 11 | Stage end: two party offers → Booth Adhyaksh | §4 | `screens/stage-end.png` |
| 12 | Khabar: parody newspaper, WhatsApp group, TV debates, Heat hints | §14 | `screens/khabar.png` |
| 13 | Rishte: relationship bars + aide cards | §9, §15 | `screens/rishte.png` |
| 14 | Kitab (career book): stats, headline clippings, blank rare frames, share card | §15 | `screens/kitab.png` |

## Built in this vertical slice
Prologue → character creation → Stage 1 (Mohalla se shuruaat): weekly turns, 9 action cards,
12-event deck with seeds/chains and rarity, Bunty Bhaiya nemesis bot (reads your weakest tola,
remembers grudges, campaigns harder in election weeks), School Committee election on the
segment softmax engine with NOTA and turnout from Josh, PA aide card reward, 6-goal stage
checklist, party choice → Booth Adhyaksh. Autosave in localStorage.

## Stage 2: Booth Adhyaksh (GDD §4)
| Screen | What it shows | File |
| --- | --- | --- |
| Booth home | Party-vote forecast gauge (last 36% → target 46%), high-command order with deadline, 40-page Panna Pramukh grid by tola with coverage %, voter-list status, committee balance (tola counts, women ≥ 1/3, size /20), worker loyalty, missions, stage checklist | `screens/s2-booth-home.png`, `s2-booth-grid.png`, `s2-booth-committee.png` |
| Page sheet | Assign a worker to a page (max 2 each; same-tola worker counts fully, other tola at 60%) | `screens/s2-page-sheet.png` |
| Planner | Stage-2 cards: Matdata Suchi Camp, Karyakarta Bharti, Booth Committee Baithak, Party ka Aadesh | `screens/s2-planner2.png` |
| Election announce / counting / breakdown | Vidhan Sabha (party vote at your booth), Ward Panch (you vs Bunty), by-election retry | `screens/s2-announce2.png`, `s2-counting2.png`, `s2-breakdown2.png` |
| Stage end | Rank, booth lift, voters enrolled, orders done; Stage 3 teaser | `screens/s2-stage2-end.png` |

Systems: voter list closes after 7 weeks (missing/deleted names per page, Form 7 event); unbalanced committee bleeds
support every week; neglected workers lose loyalty and quit; Bunty (now the rival party's booth agent) targets your
least-covered tola and poaches workers; party orders raise or cut Party Vishwas. Goals: +10 party vote, 50 voters enrolled,
survive poaching, Ward Panch (optional). Missing +10 triggers one by-election.
Balance (200 simulated runs each): a player who fills pages reaches +10 about 60% of the time; one who ignores pages gets about 0.

Next: Stage 3 (Gram Pradhan, Gram Sabha mini-game), polling-day booth mini-game.
