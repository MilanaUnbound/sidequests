import { useState, useEffect } from 'react';

// ── Types ───────────────────────────────────────────────────────────────────
type Status = 'idea' | 'started' | 'stalled' | 'finished';

interface MediaItem {
  id: string;
  type: 'youtube' | 'image';
  url: string;
  caption: string;
}

interface SideQuest {
  id: string;
  title: string;
  description: string;
  status: Status;
  progress: number;
  startDate: string;
  tags: string[];
  media: MediaItem[];
  createdAt: string;
}

// ── Config ──────────────────────────────────────────────────────────────────
// Add a new sidequest here, then commit and push to main.
// GitHub Actions rebuilds and redeploys automatically.
const SEED_QUESTS: SideQuest[] = [
  {
    id: 'q1',
    title: 'Design the perfect underwear',
    description: 'Wanted one simple, flattering piece for everyday, made from fabric that actually breathes and holds up. Had no idea how deep that rabbit hole went: elasticity, breathability, durability, how the dye affects your skin and your health, and whether the gusset should be sewn on one side or both (it matters more than you\'d think). Learned to draft patterns and to sew from scratch along the way. Yes yes, there is so much to consider, I would never have imagined.',
    status: 'finished',
    progress: 100,
    startDate: '2025-05',
    tags: ['research', 'textile', 'sewing'],
    media: [],
    createdAt: '2025-05-01',
  },
  {
    id: 'q2',
    title: 'Gentille Fille — my own underwear brand',
    description: 'After all that research I started looking at what\'s actually on the market and noticed the split: underwear made for the male gaze, beautiful but cut from plastic that digs into your skin after a few hours, or the pieces that respect your health and the planet\'s, which mostly look like something out of your grandma\'s drawer (no offense to grandmas, just to the undies). So I figured, I already did all this work, why not try it myself. That became Gentille Fille. Being a teeny tiny creator meant I couldn\'t compete on low cost, especially manufacturing in Europe, so I went high end instead. Found a manufacturer, a packaging supplier, a label maker, got the website running, everything is perfect. The one thing I still don\'t know how to do is build a brand. Currently stuck on that part.',
    status: 'stalled',
    progress: 65,
    startDate: '2025-09',
    tags: ['fashion', 'entrepreneurship', 'brand'],
    media: [],
    createdAt: '2025-09-13',
  },
  {
    id: 'q3',
    title: 'Build this website',
    description: 'Saw a reel of a girl saying you can host a website for free on GitHub, and it\'s been living rent free in my head ever since. So I built this one with Claude, Figma and Cursor, hosted on GitHub. You\'re looking at it right now.',
    status: 'started',
    progress: 85,
    startDate: '2026-08',
    tags: ['coding', 'web'],
    media: [],
    createdAt: '2026-08-30',
  },
  {
    id: 'q4',
    title: 'Sourdough bread',
    description: 'Grew my own levain, about a year old now. Tried more flours than I can count. If only you knew. A friend told me the bio flour from Coop was the best option for bread, and they were right. I can make ok beginner loaves now, they taste good, but timing is still the enemy: I\'ve shaped dough at midnight and skipped the gym more than once just to stop it from overfermenting. Shaping is still not where I want it either, mine never looks as fluffy as sourdoughtok promises. Now I\'m also learning to make little flowers on the loaves.',
    status: 'finished',
    progress: 100,
    startDate: '2024-12',
    tags: ['baking', 'food'],
    media: [
      { id: 'sd1', type: 'image', url: `${import.meta.env.BASE_URL}sourdough/01-dough.jpg`, caption: 'Dough on the counter, more still rising under the towels' },
      { id: 'sd2', type: 'image', url: `${import.meta.env.BASE_URL}sourdough/02-scoring.jpg`, caption: 'Wheat-stalk scoring, ready for the oven' },
      { id: 'sd3', type: 'image', url: `${import.meta.env.BASE_URL}sourdough/03-baked-boule.jpg`, caption: 'Out of the oven' },
      { id: 'sd4', type: 'image', url: `${import.meta.env.BASE_URL}sourdough/04-spiral.jpg`, caption: 'The spiral actually opened' },
      { id: 'sd5', type: 'image', url: `${import.meta.env.BASE_URL}sourdough/05-sesame-rolls.jpg`, caption: 'Sesame rolls' },
      { id: 'sd6', type: 'image', url: `${import.meta.env.BASE_URL}sourdough/06-butter-and-jam.jpg`, caption: 'Butter and jam, the real test' },
      { id: 'sd7', type: 'image', url: `${import.meta.env.BASE_URL}sourdough/07-breakfast.jpg`, caption: 'Breakfast. Obviously.' },
    ],
    createdAt: '2024-12-17',
  },
  {
    id: 'q5',
    title: 'Homemade kimchi',
    description: 'A friend told me it wasn\'t as hard as it looks, so I watched a pile of videos, tried a recipe, and it actually worked. The internet had me scared about botulism the whole time, but as long as it stays acidic you\'re fine. Tastes great, some batches better than others, and way cheaper than buying it. Won\'t beat a traditional Korean kimchi, but it\'s good enough for me and the people I feed it to.',
    status: 'finished',
    progress: 100,
    startDate: '2025-11',
    tags: ['fermentation', 'food'],
    media: [],
    createdAt: '2025-11-01',
  },
  {
    id: 'q6',
    title: 'Actually enjoy running',
    description: 'Tried to enjoy this one more times than I can count. Finally in a good place with it: one day I ran 6km and actually enjoyed it. Calling it a run is generous, it was very very slow, but I moved and I was happy. What worked was telling myself 10 minutes beats zero minutes and nobody gets to judge my pace or how red my face gets. And the people who do judge are usually the ones not doing any sport themselves.',
    status: 'started',
    progress: 40,
    startDate: '2025-05',
    tags: ['running', 'fitness'],
    media: [],
    createdAt: '2025-05-01',
  },
  {
    id: 'q7',
    title: 'Land a pull up',
    description: 'This isn\'t really a sidequest at this point, more just part of who I am, I became a full gym rat. Not the kind deadlifting 100kg, my max was 95kg once, a long long time ago, so close but not quite. Still can\'t do a single pull up, and that\'s the actual quest hiding inside this one. I will have it. I will unlock it.',
    status: 'started',
    progress: 55,
    startDate: '2024-03',
    tags: ['fitness', 'strength'],
    media: [],
    createdAt: '2024-03-09',
  },
  {
    id: 'q8',
    title: 'Try the Instagram (and YouTube) game',
    description: 'I struggle a lot to figure out what I actually want to bring to the table here. So many ideas, and every time I try to put one out it just doesn\'t work. Maybe it\'s fear. Still working on this one. Same story on YouTube.',
    status: 'stalled',
    progress: 20,
    startDate: '2024-09',
    tags: ['content', 'creativity'],
    media: [],
    createdAt: '2024-09-01',
  },
  {
    id: 'q9',
    title: 'Clay',
    description: 'Someone gifted me a kit to try out clay. Made a few things, and now I have this idea stuck in my head for a cute little ashtray for when friends might need one. Just haven\'t gotten back to actually making it yet.',
    status: 'stalled',
    progress: 15,
    startDate: '2026-03',
    tags: ['craft', 'clay'],
    media: [],
    createdAt: '2026-03-01',
  },
  {
    id: 'q10',
    title: 'Balcony potatoes',
    description: 'Tried planting potatoes on my balcony. At the moment it looks like a jungle up there, not sure there\'s enough soil left in the box for anything to actually form. Will keep you updated.',
    status: 'started',
    progress: 35,
    startDate: '2026-05',
    tags: ['gardening'],
    media: [],
    createdAt: '2026-05-01',
  },
  {
    id: 'q11',
    title: 'Journaling',
    description: 'Set up a journal with goals and visualisations to read every morning, then a page to write after. Kept it up for a few weeks, forgot about it completely, and now I\'m back at it again.',
    status: 'finished',
    progress: 100,
    startDate: '2026-05',
    tags: ['journaling', 'mindfulness'],
    media: [],
    createdAt: '2026-05-03',
  },
  {
    id: 'q12',
    title: 'Three weeks off the grid in Mongolia',
    description: 'Slept in yurts for three weeks, no grid, no schedule. Milked cows at 4am with a grandma who only spoke Mongolian, chased yaks on horseback across the steppe, drank fermented horse milk. Stocked up on treats from mother Russia since they import most of it out there. Showered in rivers, washed clothes in rivers too. Played cards with our guide and driver, who beat us every single time. One night a huge storm rolled in so we threw a tiny rave inside the yurt just to let off steam. The best part was the sky and the land that never seemed to end, and the wind.',
    status: 'finished',
    progress: 100,
    startDate: '2025-07',
    tags: ['travel', 'adventure'],
    media: [
      { id: 'mn1', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/01-dunes.jpg`, caption: 'Sand, sunglasses, the gaiters' },
      { id: 'mn2', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/02-camels.jpg`, caption: 'Camel line at the edge of the dunes' },
      { id: 'mn3', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/03-yaks.jpg`, caption: 'Yaks and sheep, as far as you can see' },
      { id: 'mn4', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/04-stones.jpg`, caption: 'Standing stones on the steppe' },
      { id: 'mn5', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/05-steppe.jpg`, caption: 'The land that never seemed to end' },
      { id: 'mn6', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/06-cliff.jpg`, caption: 'Sitting on the rim' },
      { id: 'mn7', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/07-monastery.jpg`, caption: 'Monastery in the cliff' },
      { id: 'mn8', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/08-deel.jpg`, caption: 'Gold deel, ger, solar panel' },
      { id: 'mn9', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/09-ger-sunset.jpg`, caption: 'One ger, the whole sky' },
      { id: 'mn10', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/10-ger-storm.jpg`, caption: 'Storm light over the ger' },
      { id: 'mn11', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/11-ger-cat.jpg`, caption: 'Ger cat' },
      { id: 'mn12', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/12-breakfast.jpg`, caption: 'Breakfast in the ger' },
      { id: 'mn13', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/13-essentuki.jpg`, caption: 'Essentuki 17, treats from mother Russia' },
      { id: 'mn14', type: 'image', url: `${import.meta.env.BASE_URL}mongolia/14-metal-cup.jpg`, caption: 'Metal cup, blue sky' },
    ],
    createdAt: '2025-07-01',
  },
  {
    id: 'q13',
    title: 'A week in China',
    description: 'One week and I was hooked, fully in my very Chinese era now. Beijing was amazing, beautiful, and everyone we met was so cool and welcoming. Everything was such high quality, and finding good gifts to bring home was almost too easy. And the spices, guys, the spices. So grateful to see all these marvels with my own eyes, everything I\'d only ever read about, suddenly I could travel to it and see it and feel it and touch it and taste it. Mongolia and China back to back, so powerful and so different from each other, I was in awe the whole time. And the food, oh my god. Fell completely in love with cucumber salad of all things, such a simple dish, if you know, you know.',
    status: 'finished',
    progress: 100,
    startDate: '2026-01',
    tags: ['travel', 'adventure', 'food'],
    media: [
      { id: 'cn1', type: 'image', url: `${import.meta.env.BASE_URL}china/01-lotus.jpg`, caption: 'Lotus leaves against the red wall' },
      { id: 'cn2', type: 'image', url: `${import.meta.env.BASE_URL}china/02-giant-egg.jpg`, caption: 'The Giant Egg' },
      { id: 'cn3', type: 'image', url: `${import.meta.env.BASE_URL}china/03-skyscrapers.jpg`, caption: 'Looking up' },
      { id: 'cn4', type: 'image', url: `${import.meta.env.BASE_URL}china/04-hutong.jpg`, caption: 'Hutong traffic' },
      { id: 'cn5', type: 'image', url: `${import.meta.env.BASE_URL}china/05-rain-neon.jpg`, caption: 'Rain, neon, the whole street glowing' },
      { id: 'cn6', type: 'image', url: `${import.meta.env.BASE_URL}china/06-sunset.jpg`, caption: 'That sunset' },
      { id: 'cn7', type: 'image', url: `${import.meta.env.BASE_URL}china/07-market.jpg`, caption: 'Market stall, pink neon, QR codes everywhere' },
      { id: 'cn8', type: 'image', url: `${import.meta.env.BASE_URL}china/08-street-food.jpg`, caption: 'Street food on a stick' },
      { id: 'cn9', type: 'image', url: `${import.meta.env.BASE_URL}china/09-peking-duck.jpg`, caption: 'Peking duck. And yes, the cucumber' },
      { id: 'cn10', type: 'image', url: `${import.meta.env.BASE_URL}china/10-tea.jpg`, caption: 'Jasmine tea, weighed out in front of you' },
      { id: 'cn11', type: 'image', url: `${import.meta.env.BASE_URL}china/11-bookstore.jpg`, caption: 'Wangfujing Bookstore' },
      { id: 'cn12', type: 'image', url: `${import.meta.env.BASE_URL}china/12-qipao.jpg`, caption: 'The Adidas qipao moment' },
    ],
    createdAt: '2026-01-01',
  },
  {
    id: 'q14',
    title: 'Build Tadah, a to do app from scratch',
    description: 'Always wrote my to dos on flying pieces of paper, or in a notes app, and then forgot about them completely. Back when I had a corpo job I had a dedicated notebook just for this, kept track of everything I did. But since I got laid off I lost that structure, and none of the apps out there felt like me. So I decided to just build my own, called it Tadah. Made it with Figma, Claude and Cursor. Still a few bugs to iron out, but it\'s running!',
    status: 'started',
    progress: 80,
    startDate: '2026-06',
    tags: ['coding', 'productivity'],
    media: [],
    createdAt: '2026-06-01',
  },
  {
    id: 'q15',
    title: 'Solo backpacking a month in Australia',
    description: 'After a burnout, I needed some fresh air, and I\'d always dreamt of seeing Whitehaven Beach. So one Monday I decided to book a flight leaving the following Tuesday. Oupsyyy. Best decision I ever made, it brought me back to life. I needed that, to feel like I was actually in charge of my own life, to do whatever I needed to do, to see how beautiful the world is and how lucky I am to even get to have an adventure like this. Gratitude came back, and that sense of bliss with it. Looking back, this is the trip that started everything. Every sidequest on this site exists because of the decision I made that Monday, it\'s where I learned I could just decide something and do it, and that\'s stayed with me since.',
    status: 'finished',
    progress: 100,
    startDate: '2025-04',
    tags: ['travel', 'solo', 'adventure', 'origin story'],
    media: [],
    createdAt: '2025-04-01',
  },
];

const STATUS_LABEL: Record<Status, string> = {
  idea: 'Idea',
  started: 'In progress',
  stalled: 'Stalled',
  finished: 'Finished',
};

const STATUS_DOT: Record<Status, string> = {
  idea:     '#C0C0C0',
  started:  '#0A0A0A',
  stalled:  '#888888',
  finished: '#0A0A0A',
};

const PROGRESS_COLOR: Record<Status, string> = {
  idea:     '#C0C0C0',
  started:  '#2A2A2A',
  stalled:  '#888888',
  finished: '#0A0A0A',
};

// ── Utils ────────────────────────────────────────────────────────────────────
function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ── ArrowCursor ───────────────────────────────────────────────────────────────
function ArrowCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const hide = () => setVisible(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', hide);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', hide);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: 'translate(0, 0)',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: visible ? 1 : 0,
        willChange: 'transform',
      }}
    >
      <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
        <path
          d="M2 2 L2 19 L6 14.5 L9 21 L11.5 20 L8.5 13.5 L15 13.5 Z"
          fill="#B83232"
          stroke="white"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#666]">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: STATUS_DOT[status] }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
function ProgressBar({ value, status }: { value: number; status: Status }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-medium text-[#999] uppercase tracking-wider">Progress</span>
        <span className="text-[11px] font-semibold text-[#444]">{value}%</span>
      </div>
      <div className="h-[3px] bg-[#E8E8E8] rounded-full overflow-hidden">
        <div
          className="progress-fill h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: PROGRESS_COLOR[status] }}
        />
      </div>
    </div>
  );
}

// ── MediaModal ────────────────────────────────────────────────────────────────
function MediaModal({ quest, onClose }: { quest: SideQuest; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const item = quest.media[idx];

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIdx(i => Math.min(quest.media.length - 1, i + 1));
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose, quest.media.length]);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="md:w-72 flex-shrink-0 flex flex-col p-8 border-b md:border-b-0 md:border-r border-[#E8E8E8] overflow-y-auto bg-[#F8F8F8]">
          <StatusBadge status={quest.status} />
          <h2 className="mt-3 text-xl font-semibold leading-snug text-[#0A0A0A]">
            {quest.title}
          </h2>
          <p className="mt-3 text-sm text-[#666] leading-relaxed flex-1">
            {quest.description}
          </p>
          <div className="mt-6">
            <ProgressBar value={quest.progress} status={quest.status} />
          </div>
          {quest.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {quest.tags.map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 bg-[#ECECEC] text-[#666] rounded-sm">
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-4 text-[11px] text-[#AAAAAA]">{quest.startDate}</p>
        </div>

        {/* Media viewer */}
        <div className="flex-1 flex flex-col bg-[#0A0A0A] overflow-hidden">
          {quest.media.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[#444] text-sm">
              No media attached yet.
            </div>
          ) : (
            <>
              <div className="flex-1 flex items-center justify-center relative min-h-64 overflow-hidden">
                {item.type === 'youtube' ? (
                  (() => {
                    const vid = getYouTubeId(item.url);
                    return vid ? (
                      <iframe
                        className="w-full h-full min-h-64"
                        src={`https://www.youtube.com/embed/${vid}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#999] text-sm underline">{item.url}</a>
                    );
                  })()
                ) : (
                  <img src={item.url} alt={item.caption} className="w-full h-full object-contain max-h-[420px]" />
                )}

                {quest.media.length > 1 && (
                  <>
                    <button
                      onClick={() => setIdx(i => Math.max(0, i - 1))}
                      disabled={idx === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-20 transition-colors text-lg"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setIdx(i => Math.min(quest.media.length - 1, i + 1))}
                      disabled={idx === quest.media.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-20 transition-colors text-lg"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {item.caption && (
                <div className="px-6 py-3 text-xs text-[#888] border-t border-white/5">
                  {item.caption}
                </div>
              )}

              {quest.media.length > 1 && (
                <div className="flex gap-2 px-4 pb-4 pt-2 border-t border-white/5 overflow-x-auto">
                  {quest.media.map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => setIdx(i)}
                      className={`w-11 h-11 flex-shrink-0 overflow-hidden transition-all ${i === idx ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'}`}
                    >
                      {m.type === 'youtube'
                        ? <div className="w-full h-full bg-[#222] flex items-center justify-center text-white text-xs">YT</div>
                        : <img src={m.url} alt="" className="w-full h-full object-cover" />
                      }
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-xl leading-none"
          style={{ zIndex: 10 }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ── SidequestCard ─────────────────────────────────────────────────────────────
function SidequestCard({ quest, onExpand }: { quest: SideQuest; onExpand: (q: SideQuest) => void }) {
  const canExpand = quest.status !== 'idea';

  return (
    <div
      className={`quest-card bg-white border border-[#E8E8E8] p-6 flex flex-col gap-4 ${canExpand ? 'group' : ''}`}
      onClick={() => canExpand && onExpand(quest)}
      style={canExpand ? { cursor: 'none' } : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={quest.status} />
        <span className="text-[11px] text-[#BBBBBB] flex-shrink-0">{quest.startDate}</span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold leading-snug text-[#0A0A0A]">
        {quest.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[#666] leading-relaxed flex-1">
        {quest.description}
      </p>

      {/* Tags */}
      {quest.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {quest.tags.map(t => (
            <span key={t} className="text-[11px] px-2 py-0.5 bg-[#F0F0F0] text-[#888] rounded-sm">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Progress */}
      <ProgressBar value={quest.progress} status={quest.status} />

      {/* Expand cue */}
      {canExpand && quest.media.length > 0 && (
        <div className="text-[11px] font-medium text-[#BBBBBB] group-hover:text-[#0A0A0A] transition-colors flex items-center gap-1.5">
          <span>View {quest.media.length} {quest.media.length === 1 ? 'photo' : 'photos/videos'}</span>
          <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
        </div>
      )}
      {canExpand && quest.media.length === 0 && (
        <div className="text-[11px] font-medium text-[#BBBBBB] group-hover:text-[#0A0A0A] transition-colors flex items-center gap-1.5">
          <span>Read more</span>
          <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
        </div>
      )}
    </div>
  );
}

// ── IdeaBox ───────────────────────────────────────────────────────────────────
function IdeaBox() {
  return (
    <div className="bg-[#0A0A0A] p-8 md:p-12">
      <div className="max-w-xl">
        <p className="text-[11px] font-medium text-[#555] uppercase tracking-widest mb-4">Idea box</p>
        <h3 className="text-2xl font-semibold text-white mb-2">
          Got a sidequest idea?
        </h3>
        <p className="text-sm text-[#888] leading-relaxed mb-8">
          Something you think I should try. Something you've been too scared to do yourself. No promises — but I read everything. DM me on Instagram.
        </p>

        <a
          href="https://www.instagram.com/milanaunbound/"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0A0A0A] text-sm font-semibold hover:bg-[#F0F0F0] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          DM me on Instagram
        </a>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const quests = SEED_QUESTS;
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [expandedQuest, setExpandedQuest] = useState<SideQuest | null>(null);

  const filtered = filter === 'all' ? quests : quests.filter(q => q.status === filter);
  const stats = {
    total:    quests.length,
    started:  quests.filter(q => q.status === 'started').length,
    stalled:  quests.filter(q => q.status === 'stalled').length,
    finished: quests.filter(q => q.status === 'finished').length,
    idea:     quests.filter(q => q.status === 'idea').length,
  };

  const FILTERS: { key: Status | 'all'; label: string }[] = [
    { key: 'all',      label: `All  ${stats.total}` },
    { key: 'started',  label: `In progress  ${stats.started}` },
    { key: 'stalled',  label: `Stalled  ${stats.stalled}` },
    { key: 'finished', label: `Finished  ${stats.finished}` },
    { key: 'idea',     label: `Ideas  ${stats.idea}` },
  ];

  return (
    <div className="min-h-full bg-[#F5F5F5] text-[#0A0A0A]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <ArrowCursor />

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-[#F5F5F5]/95 backdrop-blur-sm border-b border-[#E8E8E8] px-6 md:px-10 py-4 flex items-center justify-between gap-6">
        <span className="text-sm font-semibold tracking-tight text-[#0A0A0A]">Milana</span>
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/milanaunbound/"
            target="_blank" rel="noopener noreferrer"
            className="text-xs font-medium text-[#888] hover:text-[#0A0A0A] transition-colors tracking-wide uppercase"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/@milanaunbound"
            target="_blank" rel="noopener noreferrer"
            className="text-xs font-medium text-[#888] hover:text-[#0A0A0A] transition-colors tracking-wide uppercase"
          >
            YouTube
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-16 pb-14 max-w-5xl">
        <p className="text-[11px] font-medium text-[#AAAAAA] uppercase tracking-[0.2em] mb-6">
          Professional sidequester
        </p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-[#0A0A0A] mb-8 max-w-3xl">
          Every side project<br />I've ever started.
        </h1>
        <p className="text-base text-[#666] leading-relaxed max-w-xl mb-10">
          I'm Milana. This is where I track every side project I start, from the ones that took off to the ones that stalled halfway through because I think the mess of trying things is more useful to look at than the highlight reel. If you've ever had ten ideas going at once and wondered if that was a problem, it's not, and this site is proof.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-8">
          {[
            { n: stats.total,    label: 'total' },
            { n: stats.started,  label: 'in progress' },
            { n: stats.stalled,  label: 'stalled' },
            { n: stats.finished, label: 'finished' },
          ].map(({ n, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-[#0A0A0A]">{n}</div>
              <div className="text-xs text-[#AAAAAA] mt-0.5 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#E8E8E8] mx-6 md:mx-10" />

      {/* ── Sidequests ──────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-12">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-xs font-medium border rounded-sm transition-colors ${
                filter === f.key
                  ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                  : 'bg-white text-[#666] border-[#E0E0E0] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-sm text-[#BBBBBB]">Nothing here yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(q => (
              <SidequestCard key={q.id} quest={q} onExpand={setExpandedQuest} />
            ))}
          </div>
        )}
      </section>

      {/* ── Idea Box ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-16">
        <IdeaBox />
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E8E8E8] bg-white px-6 md:px-10 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#0A0A0A]">Milana</span>
            <span className="text-xs text-[#AAAAAA]">Professional sidequester</span>
          </div>

          {/* Social links — prominent in footer */}
          <div className="flex items-center gap-8">
            <a
              href="https://www.instagram.com/milanaunbound/"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-[#444] hover:text-[#0A0A0A] transition-colors group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#AAAAAA] group-hover:text-[#0A0A0A] transition-colors">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @milanaunbound
            </a>
            <a
              href="https://www.youtube.com/@milanaunbound"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-[#444] hover:text-[#0A0A0A] transition-colors group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#AAAAAA] group-hover:text-[#0A0A0A] transition-colors">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              @milanaunbound
            </a>
          </div>
        </div>
      </footer>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {expandedQuest && <MediaModal quest={expandedQuest} onClose={() => setExpandedQuest(null)} />}
    </div>
  );
}
