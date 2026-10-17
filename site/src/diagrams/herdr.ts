// How it works: sounding's herdr plugin, as a small mock, in one 24 s loop.
// The sidebar lists the open soundings, each with its round and its state:
// working, waiting on you, or parked. A key starts a sounding and another
// opens its workspace, the session's pane with its conclusion beside it.
// The conclusion opens in plannotator for notes; go on starts round 2 with
// them; accept settles it and it leaves the list; open moves to another
// sounding, and drop removes a parked one.
//
// Timeline, percent of the loop:
//   3-10 start, open · 10-40 round 1, notes · 40-70 round 2, accept · 74-90 open, drop
import { Diagram, esc, type Layout } from './kit';

const T = 24;

// The keys, each with when it is pressed.
const KEYS: [string, number[]][] = [
  ['start', [3]],
  ['open', [7, 75]],
  ['notes', [29]],
  ['go on', [39]],
  ['accept', [66]],
  ['drop', [83]],
];

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function geometry(layout: Layout) {
  if (layout === 'wide') {
    return {
      W: 720,
      H: 372,
      n: false,
      win: { x: 16, y: 16, w: 688, h: 340 } as Box,
      side: { x: 16, y: 44, w: 196, h: 264 } as Box,
      slot: (i: number) => ({ x: 24, y: 82 + i * 52, w: 180, h: 44 }),
      ws: { x: 212, y: 44, w: 492, h: 264 } as Box,
      wsTitle: { x: 226, y: 70 },
      paneA: { x: 224, y: 84, w: 226, h: 210 } as Box,
      paneB: { x: 460, y: 84, w: 234, h: 210 } as Box,
      keysY: 318,
      keysX: 76,
      keyGap: 8,
    };
  }
  return {
    W: 360,
    H: 640,
    n: true,
    win: { x: 8, y: 16, w: 344, h: 612 } as Box,
    side: { x: 8, y: 44, w: 344, h: 190 } as Box,
    slot: (i: number) => ({ x: 16, y: 74 + i * 52, w: 328, h: 44 }),
    ws: { x: 8, y: 234, w: 344, h: 290 } as Box,
    wsTitle: { x: 20, y: 258 },
    paneA: { x: 16, y: 270, w: 328, h: 104 } as Box,
    paneB: { x: 16, y: 382, w: 328, h: 134 } as Box,
    keysY: 548,
    keysX: 16,
    keyGap: 8,
  };
}

export function herdr(layout: Layout) {
  const g = geometry(layout);
  const n = g.n;
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);
  const W = g.win;
  add(`<rect class="box" x="${W.x}" y="${W.y}" width="${W.w}" height="${W.h}" rx="10"/>`);
  [0, 1, 2].forEach((i) => add(`<circle class="dot" cx="${W.x + 16 + i * 14}" cy="${W.y + 14}" r="4"/>`));
  add(`<text class="m xs" x="${W.x + W.w / 2}" y="${W.y + 18}" text-anchor="middle">herdr · sounding's plugin</text>`);
  add(`<line x1="${W.x}" y1="${W.y + 28}" x2="${W.x + W.w}" y2="${W.y + 28}" style="stroke:var(--dg-rule)"/>`);

  // ---- the sidebar
  const SB = g.side;
  add(`<rect class="panel" x="${SB.x + 1}" y="${SB.y}" width="${SB.w - 1}" height="${SB.h}"/>`);
  add(`<text class="hd" x="${SB.x + 14}" y="${SB.y + 22}">SOUNDINGS</text>`);
  if (!n) add(`<line x1="${SB.x + SB.w}" y1="${SB.y}" x2="${SB.x + SB.w}" y2="${SB.y + SB.h}" style="stroke:var(--dg-rule)"/>`);
  else add(`<line x1="${SB.x}" y1="${SB.y + SB.h}" x2="${SB.x + SB.w}" y2="${SB.y + SB.h}" style="stroke:var(--dg-rule)"/>`);

  // A row moves between slots: [percent, slot] steps, each move taking 2%.
  const slotY = (i: number) => g.slot(i).y;
  const moves = (cls: string, home: number, steps: [number, number][]) => {
    const at = (s: number) => `transform:translate(0px,${slotY(s) - slotY(home)}px)`;
    const fr: [number, string][] = [[0, at(steps[0][1])]];
    for (let k = 1; k < steps.length; k++) {
      const [p, s] = steps[k];
      fr.push([p - 2, at(steps[k - 1][1])], [p, at(s)]);
    }
    fr.push([100, at(steps[steps.length - 1][1])]);
    d.kf(cls, fr);
    return d.anim(cls);
  };

  // One row: its name, its round and state over time, its selection.
  const row = (
    id: string,
    name: string,
    home: number,
    steps: [number, number][],
    shown: [number, number],
    states: [string, string, number, number][],
    selected: [number, number][],
  ) => {
    const s = g.slot(home);
    add(`<g class="${moves(`mv${id}`, home, steps)}">`);
    add(`<g class="${shown[1] >= 100 ? '' : d.show(`vis${id}`, shown[0], shown[1])}">`);
    selected.forEach(([a, b], k) => {
      add(`<g class="${d.show(`sel${id}${k}`, a, b)}"><rect class="accbox" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="6" style="stroke-width:0"/>`);
      add(`<rect class="chip" x="${s.x}" y="${s.y + 6}" width="3" height="${s.h - 12}" rx="1.5"/></g>`);
    });
    add(`<text class="t b mono xs" x="${s.x + 12}" y="${s.y + 18}">${esc(name)}</text>`);
    states.forEach(([txt, cls, a, b], k) => {
      const dot = cls === 'm' ? `<circle cx="${s.x + 16}" cy="${s.y + 32}" r="4" style="fill:none;stroke:var(--dg-muted);stroke-width:1.5"/>` : `<circle class="${cls}" cx="${s.x + 16}" cy="${s.y + 32}" r="4"/>`;
      add(`<g class="${b >= 100 ? '' : d.show(`rs${id}${k}`, a, b)}">${dot}<text class="xxs ${cls === 't' ? 'm' : cls}" x="${s.x + 26}" y="${s.y + 36}">${txt}</text></g>`);
    });
    add('</g></g>');
  };

  // take-mise-2027: started, worked, sent back once, accepted.
  row(
    'a',
    'take-mise-2027',
    0,
    [[0, 0]],
    [5, 74],
    [
      ['round 1 · working', 'ac', 5, 24],
      ['round 1 · waiting on you', 'warn', 24, 40],
      ['round 2 · working', 'ac', 40, 58],
      ['round 2 · waiting on you', 'warn', 58, 67],
      ['accepted', 'ok', 67, 74],
    ],
    [[8, 74]],
  );
  row(
    'b',
    'ci-on-linux',
    0,
    [
      [0, 0],
      [7, 1],
      [76, 0],
      [100, 0],
    ],
    [-1, 100],
    [['round 2 · waiting on you', 'warn', -1, 100]],
    [[76, 82]],
  );
  row(
    'c',
    'docs-search',
    1,
    [
      [0, 1],
      [7, 2],
      [76, 1],
      [100, 1],
    ],
    [-1, 89],
    [
      ['round 1 · parked', 'm', -1, 84],
      ['dropped · worktree removed', 'bad', 84, 89],
    ],
    [[82, 89]],
  );
  // The dropped row's strike.
  {
    const s = g.slot(1);
    add(`<line class="strike ${d.show('strike', 84, 89)}" x1="${s.x + 10}" y1="${s.y + 14}" x2="${s.x + 112}" y2="${s.y + 14}"/>`);
  }

  // ---- the workspace
  const P1 = g.paneA;
  const P2 = g.paneB;
  const ttl = (txt: string, a: number, b: number, k: string) =>
    add(`<text class="t b mono xs ${d.show(`wt${k}`, a, b)}" x="${g.wsTitle.x}" y="${g.wsTitle.y}">${esc(txt)}</text>`);
  add(`<text class="m xs ${d.show('wt0', 0, 8)}" x="${g.wsTitle.x}" y="${g.wsTitle.y}">no sounding open</text>`);
  ttl('take-mise-2027 · round 1', 8, 40, '1');
  ttl('take-mise-2027 · round 2', 40, 74, '2');
  ttl('ci-on-linux · round 2', 76, 82, '3');
  ttl('docs-search · parked', 82, 96, '4');
  add(`<rect class="box2" x="${P1.x}" y="${P1.y}" width="${P1.w}" height="${P1.h}" rx="6"/>`);
  add(`<rect class="box2" x="${P2.x}" y="${P2.y}" width="${P2.w}" height="${P2.h}" rx="6"/>`);
  add(`<text class="m xxs" x="${P1.x + 10}" y="${P1.y + 16}">the session</text>`);

  // The session's pane, by phase.
  const lineH = n ? 17 : 20;
  const sess = (lines: [string, string, number][], until: number, k: string) =>
    lines.forEach(([t, c, at], i) =>
      add(`<text class="mono xxs ${c} ${d.show(`sl${k}${i}`, at, until)}" x="${P1.x + 10}" y="${P1.y + 36 + i * lineH}">${esc(t)}</text>`),
    );
  sess(
    [
      ['read question.md', 't', 10],
      ['ran CI on mise 2027.1', 't', 15],
      ['sounding conclude', 'ac', 21],
      ['ended · conclusion ready', 'warn', 24],
    ],
    40,
    'a',
  );
  sess(
    [
      ['question.md + your note', 't', 41],
      ['ran CI on Linux too', 't', 47],
      ['sounding conclude', 'ac', 54],
      ['ended · conclusion ready', 'warn', 58],
    ],
    74,
    'b',
  );
  sess([['ended · conclusion ready', 'warn', 76]], 82, 'c');
  sess([['no session running', 'm', 82]], 96, 'd');

  // The pane beside it: the conclusion, plannotator, the archive.
  const bx = P2.x + 10;
  const by = P2.y + 16;
  const pane = (head: string, lines: [string, string][], a: number, b: number, k: string) => {
    add(`<g class="${d.show(`pb${k}`, a, b)}">`);
    add(`<text class="m xxs" x="${bx}" y="${by}">${esc(head)}</text>`);
    lines.forEach(([t, c], i) => {
      const y = by + 22 + i * (n ? 17 : 19);
      const [a, b] = t.split('\t');
      add(`<text class="${c}" x="${bx}" y="${y}">${esc(a)}</text>`);
      if (b) add(`<text class="m xxs" x="${bx + 96}" y="${y}">${esc(b)}</text>`);
    });
    add('</g>');
  };
  pane('conclusion.md', [['not written yet', 'm xs']], 8, 24, '0');
  pane(
    'conclusion.md · round 1',
    [
      [n ? 'Take 2027.1 once CI passes --locked.' : 'Take 2027.1 once CI passes', 't b xs'],
      [n ? '' : '--locked.', 't b xs'],
      ['proposes: the scripts, the bump', 't xxs'],
      ['open: the Linux runners', 't xxs'],
    ],
    24,
    30,
    '1',
  );
  // plannotator: the open line marked, and a note typed against it.
  {
    add(`<g class="${d.show('pn', 30, 40)}">`);
    add(`<text class="ac xxs b" x="${bx}" y="${by}">plannotator · conclusion.md</text>`);
    add(`<text class="t b xs" x="${bx}" y="${by + 22}">${n ? 'Take 2027.1 once CI passes --locked.' : 'Take 2027.1 once CI passes'}</text>`);
    if (!n) add(`<text class="t b xs" x="${bx}" y="${by + 41}">--locked.</text>`);
    const oy = by + (n ? 42 : 64);
    add(`<rect class="accbox" x="${bx - 4}" y="${oy - 13}" width="${n ? 150 : 150}" height="18" rx="3" style="stroke-width:0"/>`);
    add(`<text class="t xxs" x="${bx}" y="${oy}">open: the Linux runners</text>`);
    const ny = oy + 14;
    add(`<rect class="warnbox" x="${bx}" y="${ny}" width="${n ? 300 : 212}" height="${n ? 40 : 50}" rx="6"/>`);
    add(`<text class="warn xxs b" x="${bx + 10}" y="${ny + 16}">your note</text>`);
    const note = 'check the Linux runners too';
    add(`<text class="t xs" x="${bx + 10}" y="${ny + (n ? 32 : 36)}">${note}</text>`);
    d.kf('ntype', [
      [0, 'transform:scaleX(1)'],
      [31, 'transform:scaleX(1)'],
      [36, 'transform:scaleX(0)'],
      [100, 'transform:scaleX(0)'],
    ]);
    add(`<rect class="cover ${d.anim('ntype')}" x="${bx + 8}" y="${ny + (n ? 20 : 24)}" width="${note.length * 7 + 6}" height="16"/>`);
    d.rule(`.ntype{animation-timing-function:steps(${note.length},end)}`);
    add('</g>');
  }
  pane(
    'go on: round 2 in the same worktree',
    [
      ['rounds/1.md\tthe conclusion, kept', 't mono xxs'],
      ['question.md\tand your note', 't mono xxs'],
    ],
    40,
    58,
    '2',
  );
  pane(
    'conclusion.md · round 2',
    [
      [n ? 'Take 2027.1; Linux passes too.' : 'Take 2027.1 once CI passes', 't b xs'],
      [n ? '' : '--locked; Linux passes too.', 't b xs'],
      ['proposes: the scripts, the bump', 't xxs'],
    ],
    58,
    67,
    '3',
  );
  pane(
    'accepted',
    [
      [n ? 'the item settled, and its work' : 'the item settled; the work it', 'ok b xs'],
      [n ? 'sent to millpond as new items' : 'proposes goes on as new items', 'ok b xs'],
    ],
    67,
    74,
    '4',
  );
  pane(
    'conclusion.md · round 2',
    [
      ['Run CI on Linux and macOS.', 't b xs'],
      ['proposes: one workflow change', 't xxs'],
    ],
    76,
    82,
    '5',
  );
  pane(
    'rounds/1.md · a note for round 2',
    [['start from the search index', 't xxs']],
    82,
    84,
    '6',
  );
  pane('dropped', n ? [['reason recorded; worktree removed', 'bad xs b']] : [['reason recorded,', 'bad xs b'], ['worktree removed', 'bad xs b']], 84, 96, '7');

  // ---- the keys
  add(`<text class="hd" x="${n ? g.keysX : W.x + 16}" y="${g.keysY + (n ? -6 : 16)}">KEYS</text>`);
  let kx = n ? g.keysX : g.keysX + 10;
  let ky = n ? g.keysY + 4 : g.keysY;
  KEYS.forEach(([label, at], i) => {
    const w = label.length * 7 + 22;
    if (n && i === 3) {
      kx = g.keysX;
      ky += 32;
    }
    add(`<rect class="box2" x="${kx}" y="${ky}" width="${w}" height="24" rx="5"/>`);
    add(`<text class="t xs" x="${kx + w / 2}" y="${ky + 16}" text-anchor="middle">${label}</text>`);
    const fr: [number, number][] = [[0, 0]];
    at.forEach((p) => fr.push([p, 1], [p + 3, 0]));
    add(
      `<g class="${d.levels(`k${i}`, fr)}"><rect class="chip" x="${kx}" y="${ky}" width="${w}" height="24" rx="5"/>` +
        `<text class="chipt xs" x="${kx + w / 2}" y="${ky + 16}" text-anchor="middle">${label}</text></g>`,
    );
    kx += w + g.keyGap;
  });
  if (!n) add(`<text class="m xxs" x="${W.x + W.w - 16}" y="${g.keysY + 16}" text-anchor="end">conclusion in plannotator, for notes</text>`);

  return d.render({
    id: n ? 'rn' : 'rw',
    width: g.W,
    height: g.H,
    title: "sounding's herdr plugin: the sidebar, a workspace and the keys",
    desc:
      'A herdr window. Its sidebar lists the open soundings, each with its round and its state: ci-on-linux, round 2, waiting on you; docs-search, round 1, parked. ' +
      'The start key adds take-mise-2027, round 1, working, and the open key shows its workspace: the session in one pane, its conclusion beside it. ' +
      'The session concludes and the sounding waits on you. The notes key opens the conclusion in plannotator, where a note is typed against what stays open. ' +
      'The go on key starts round 2 in the same worktree: the conclusion is kept as rounds/1.md and the note joins the question. Round 2 concludes, ' +
      'the accept key settles it, and it leaves the list. The open key moves to ci-on-linux; then the drop key drops docs-search, recording the reason and removing its worktree.',
    still: 22,
  });
}
