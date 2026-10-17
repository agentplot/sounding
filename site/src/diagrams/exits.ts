// How it works: the three exits, and the two guards, in one 24 s loop. The
// session asks a question only the operator can answer, which goes on a
// card while it waits; it offers a finding beyond its question, which goes
// to millpond as a capture of its own; it tries to stop with nothing to
// show and the stop check sends it back; and when its timebox runs out it
// concludes with what it knows.
//
// Timeline, percent of the loop:
//   6-24 ask · 28-48 offer · 52-62 the stop check · 76-94 the timebox and conclude
import { Diagram, esc, type Layout } from './kit';

const T = 24;
const NAME = 'take-mise-2027';
const KEY = `sounding/${NAME}/1`;

// The session's log: the line, when it appears, its colour.
const LOG: [string, number, string][] = [
  ['working the question', 1, 'm'],
  ['Linux runners in scope?', 6, 't'],
  ['sounding ask', 8, 'ac'],
  ['answer: test both', 21, 't'],
  ['the docs pin mise 2026.9', 30, 't'],
  ['sounding offer', 33, 'ac'],
  ['done: stop', 53, 'm'],
  ['stop check: sent back', 56, 'bad'],
  ['timebox up', 79, 'warn'],
  ['sounding conclude', 81, 'ac'],
];

// The session's status, in turn.
const STATUS: [string, number, number, string][] = [
  ['working', 0, 9, 'ac'],
  ['waiting on you', 9, 21, 'warn'],
  ['working', 21, 53, 'ac'],
  ['stopping', 53, 57, 'm'],
  ['working', 57, 79, 'ac'],
  ['concluding', 79, 86, 'ac'],
  ['ended', 86, 96, 'm'],
];

// Each exit: its command, when it fires, how long its way stays lit.
const EXITS = [
  { cmd: 'sounding ask', at: 8, until: 21 },
  { cmd: 'sounding offer', at: 33, until: 46 },
  { cmd: 'sounding conclude', at: 81, until: 96 },
];

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function geometry(layout: Layout) {
  if (layout === 'wide') {
    const rowY = (i: number) => 72 + i * 106;
    return {
      W: 720,
      H: 524,
      n: false,
      pane: { x: 16, y: 52, w: 250, h: 330 } as Box,
      logY: (i: number) => 108 + i * 21,
      stop: { x: 16, y: 396, w: 250, h: 46 } as Box,
      exitsHd: { x: 290, y: 60 },
      pill: (i: number) => ({ x: 290, y: rowY(i) + 34, w: 134, h: 24 }),
      dest: (i: number): Box => ({ x: 440, y: rowY(i), w: 264, h: 92 }),
      wire: (i: number) => {
        const y = [146, 217, 288][i];
        const p = rowY(i) + 46;
        return `M266,${y} C278,${y} 278,${p} 290,${p}`;
      },
      link: (i: number) => `M424,${rowY(i) + 46} L440,${rowY(i) + 46}`,
      back: [
        { x: 440, y: 100 },
        { x: 432, y: 100 },
        { x: 432, y: 42 },
        { x: 140, y: 42 },
        { x: 140, y: 52 },
      ],
      caps: (i: number) => ({ x: 16 + (i % 2) * 356, y: 476 + Math.floor(i / 2) * 26 }),
    };
  }
  const rowY = (i: number) => 470 + i * 124;
  return {
    W: 360,
    H: 936,
    n: true,
    pane: { x: 8, y: 60, w: 344, h: 302 } as Box,
    logY: (i: number) => 118 + i * 19,
    stop: { x: 8, y: 374, w: 344, h: 46 } as Box,
    exitsHd: { x: 12, y: 452 },
    pill: (i: number) => ({ x: 8, y: rowY(i), w: 150, h: 24 }),
    dest: (i: number): Box => ({ x: 8, y: rowY(i) + 32, w: 344, h: 84 }),
    wire: () => '',
    link: (i: number) => `M83,${rowY(i) + 24} L83,${rowY(i) + 32}`,
    back: [
      { x: 8, y: 502 + 30 },
      { x: 3, y: 502 + 30 },
      { x: 3, y: 120 },
      { x: 8, y: 120 },
    ],
    caps: (i: number) => ({ x: 8, y: 870 + i * 18 }),
  };
}

export function exits(layout: Layout) {
  const g = geometry(layout);
  const n = g.n;
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);
  add(`<text class="hd" x="${n ? 12 : 16}" y="${n ? 26 : 32}">ONE SESSION</text>`);
  add(`<text class="ac mono xs" x="${n ? 12 : 104}" y="${n ? 46 : 32}">sounding/${NAME}</text>`);

  // ---- the session
  const P = g.pane;
  add(`<rect class="box" x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" rx="8"/>`);
  add(`<text class="t b sm" x="${P.x + 14}" y="${P.y + 24}">round 1</text>`);
  STATUS.forEach(([t, a, b, c], k) => add(`<text class="xs b ${c} ${d.show(`st${k}`, a, b)}" x="${P.x + P.w - 14}" y="${P.y + 24}" text-anchor="end">${t}</text>`));
  add(`<line x1="${P.x}" y1="${P.y + 36}" x2="${P.x + P.w}" y2="${P.y + 36}" style="stroke:var(--dg-rule)"/>`);
  LOG.forEach(([line, at, cls], i) => add(`<text class="mono xs ${cls} ${d.show(`lg${i}`, at, 96)}" x="${P.x + 14}" y="${g.logY(i)}">${esc(line)}</text>`));
  {
    const by = P.y + P.h - 20;
    add(`<text class="m xxs ${d.show('tb0', 0, 79)}" x="${P.x + 14}" y="${by - 9}">timebox · 45 min</text>`);
    add(`<text class="warn xxs b ${d.show('tb1', 79, 96)}" x="${P.x + 14}" y="${by - 9}">${n ? 'timebox up: it concludes with what it knows' : 'up: it concludes with what it knows'}</text>`);
    add(`<rect class="track" x="${P.x + 14}" y="${by}" width="${P.w - 28}" height="6" rx="3"/>`);
    d.kf('tbar', [
      [0, 'transform:scaleX(0);fill:var(--dg-accent)'],
      [1, 'transform:scaleX(0);fill:var(--dg-accent)'],
      [79, 'transform:scaleX(1);fill:var(--dg-accent)'],
      [79.5, 'transform:scaleX(1);fill:var(--dg-warn)'],
      [96, 'transform:scaleX(1);fill:var(--dg-warn)'],
      [97, 'transform:scaleX(0);fill:var(--dg-accent)'],
      [100, 'transform:scaleX(0);fill:var(--dg-accent)'],
    ]);
    add(`<rect class="bar ${d.anim('tbar')}" x="${P.x + 14}" y="${by}" width="${P.w - 28}" height="6" rx="3"/>`);
  }

  // ---- the stop check
  const S = g.stop;
  d.kf('stopb', [
    [0, 'stroke:var(--dg-rule)'],
    [55.5, 'stroke:var(--dg-rule)'],
    [56, 'stroke:var(--dg-bad)'],
    [62, 'stroke:var(--dg-bad)'],
    [62.8, 'stroke:var(--dg-rule)'],
    [100, 'stroke:var(--dg-rule)'],
  ]);
  add(`<rect class="box2 ${d.anim('stopb')}" x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="6" style="stroke-width:1.5"/>`);
  add(`<text class="t b xs" x="${S.x + 14}" y="${S.y + 19}">stop check</text>`);
  add(`<text class="m xxs ${d.show('sc0', 0, 56)}" x="${S.x + 14}" y="${S.y + 35}">${n ? 'ends only on a conclusion, or a note for the next round' : 'a conclusion, or a note for round 2'}</text>`);
  add(`<text class="bad xxs b ${d.show('sc1', 56, 62)}" x="${S.x + 14}" y="${S.y + 35}">${n ? 'no conclusion, no note: sent back to work' : 'no conclusion, no note: sent back'}</text>`);
  add(`<text class="m xxs ${d.show('sc2', 62, 96)}" x="${S.x + 14}" y="${S.y + 35}">${n ? 'ends only on a conclusion, or a note for the next round' : 'a conclusion, or a note for round 2'}</text>`);

  // ---- the three exits
  add(`<text class="hd" x="${g.exitsHd.x}" y="${g.exitsHd.y}">THREE EXITS</text>`);
  EXITS.forEach((e, i) => {
    const pl = g.pill(i);
    if (!n) {
      add(`<path class="edge" d="${g.wire(i)}" style="stroke:var(--dg-rule);stroke-width:1.5"/>`);
      add(`<path class="dash ${d.show(`wl${i}`, e.at, e.until)}" d="${g.wire(i)}"/>`);
    }
    add(`<path class="edge" d="${g.link(i)}" style="stroke:var(--dg-rule);stroke-width:1.5"/>`);
    add(`<rect class="box2" x="${pl.x}" y="${pl.y}" width="${pl.w}" height="${pl.h}" rx="12"/>`);
    add(`<text class="t mono xs" x="${pl.x + pl.w / 2}" y="${pl.y + 16}" text-anchor="middle">${e.cmd}</text>`);
    add(
      `<g class="${d.show(`pl${i}`, e.at, e.until)}"><rect class="chip" x="${pl.x}" y="${pl.y}" width="${pl.w}" height="${pl.h}" rx="12"/>` +
        `<text class="chipt mono xs" x="${pl.x + pl.w / 2}" y="${pl.y + 16}" text-anchor="middle">${e.cmd}</text></g>`,
    );
  });

  // ask: a card for the operator; the session waits; the answer comes back.
  {
    const D = g.dest(0);
    add(`<rect class="box2" x="${D.x}" y="${D.y}" width="${D.w}" height="${D.h}" rx="8" stroke-dasharray="4 3"/>`);
    add(`<text class="m xs ${d.show('a0', 0, 9.5)}" x="${D.x + 14}" y="${D.y + 24}">a card for you</text>`);
    d.kf('cardb', [
      [0, 'stroke:var(--dg-warn)'],
      [17, 'stroke:var(--dg-warn)'],
      [17.6, 'stroke:var(--dg-ok)'],
      [100, 'stroke:var(--dg-ok)'],
    ]);
    add(`<g class="${d.show('acard', 9.5, 96)}">`);
    add(`<rect class="warnbox ${d.anim('cardb')}" x="${D.x}" y="${D.y}" width="${D.w}" height="${D.h}" rx="8"/>`);
    add(`<text class="m xxs" x="${D.x + 14}" y="${D.y + 20}">a card · from sounding ${NAME}</text>`);
    add(`<text class="t b sm" x="${D.x + 14}" y="${D.y + 42}">Do the Linux runners count?</text>`);
    add('</g>');
    add(`<text class="warn xs b ${d.show('a1', 9.5, 17)}" x="${D.x + 14}" y="${D.y + 68}">waiting on you</text>`);
    add(`<text class="ok xs b ${d.show('a2', 17, 96)}" x="${D.x + 14}" y="${D.y + 68}">you: yes, test both</text>`);
    // The answer goes back to the session.
    d.route('ans', g.back, 18, 21, 21.6);
    const end = g.back[g.back.length - 1];
    add(`<circle class="ans" cx="${end.x}" cy="${end.y}" r="5" style="fill:var(--dg-ok)"/>`);
  }

  // offer: a capture of its own, landed by millpond.
  {
    const D = g.dest(1);
    add(`<rect class="pondbox" x="${D.x}" y="${D.y}" width="${D.w}" height="${D.h}" rx="8"/>`);
    add(`<text class="pd b sm" x="${D.x + 14}" y="${D.y + 22}">millpond</text>`);
    add(`<text class="m mono xxs" x="${D.x + D.w - 14}" y="${D.y + 22}" text-anchor="end">millpond land</text>`);
    const cw = KEY.length * 6.4 + 16;
    const cx = D.x + 14;
    const cy = D.y + 32;
    const pl = g.pill(1);
    d.fly('cap', pl.x + 6 - cx, pl.y + 2 - cy, 34, 34.5, 40, 96);
    add(`<g class="cap"><rect class="pdchip" x="${cx}" y="${cy}" width="${cw}" height="20" rx="4"/><text class="chipt mono xxs" x="${cx + 8}" y="${cy + 14}">${KEY}</text></g>`);
    add(`<text class="m xxs ${d.show('o0', 0, 40)}" x="${D.x + 14}" y="${D.y + 74}">the inbox: captures, signals, items</text>`);
    add(`<text class="t xxs ${d.show('o1', 40, 96)}" x="${D.x + 14}" y="${D.y + 74}">its own excerpt, kind ask · 1 signal</text>`);
  }

  // conclude: conclusion.md, for the operator to decide.
  {
    const D = g.dest(2);
    add(`<rect class="box2" x="${D.x}" y="${D.y}" width="${D.w}" height="${D.h}" rx="8" stroke-dasharray="4 3"/>`);
    add(`<text class="m xs ${d.show('c0', 0, 83)}" x="${D.x + 14}" y="${D.y + 24}">conclusion.md, not yet written</text>`);
    const pl = g.pill(2);
    d.fly('cf', pl.x + 6 - (D.x + 14), pl.y + 5 - (D.y + 14), 81, 81.5, 83.5, 84.5);
    add(`<rect class="chip cf" x="${D.x + 14}" y="${D.y + 14}" width="96" height="14" rx="3"/>`);
    add(`<g class="${d.show('cc', 84, 96)}">`);
    add(`<rect class="accbox" x="${D.x}" y="${D.y}" width="${D.w}" height="${D.h}" rx="8"/>`);
    add(`<text class="m mono xxs" x="${D.x + 14}" y="${D.y + 20}">conclusion.md · round 1</text>`);
    const body = n ? ['the answer, its evidence, the work', 'it proposes, and what stays open'] : ['the answer, its evidence, the', 'work it proposes, and what', 'stays open'];
    body.forEach((l, k) => add(`<text class="t b ${n ? 'sm' : 'xs'}" x="${D.x + 14}" y="${D.y + (n ? 42 : 40) + k * (n ? 18 : 16)}">${l}</text>`));
    add('</g>');
    add(`<text class="warn xxs b ${d.show('c1', 87, 96)}" x="${D.x + D.w - 14}" y="${D.y + 20}" text-anchor="end">you decide</text>`);
  }

  // ---- captions
  const caps = n
    ? [
        ['Ask puts a question on your card.', 4, 25],
        ['Offer sends a finding to millpond.', 28, 49],
        ['The stop check sends it back to work.', 51, 64],
        ['It concludes, at the latest on time.', 76, 95],
      ]
    : [
        ['Ask: a question for you, on a card.', 4, 25],
        ['Offer: a finding beyond it, to millpond.', 28, 49],
        ['The stop check sends it back to work.', 51, 64],
        ['Conclude: when it knows, or when time is up.', 76, 95],
      ];
  caps.forEach(([txt, a, b], i) => {
    const c = g.caps(i);
    const cls = d.keep(d.show(`cap${i}`, a as number, b as number, 0.35));
    const lines = (txt as string).split('|');
    add(`<g class="${cls}"><circle class="badge" cx="${c.x + 11}" cy="${c.y - 4}" r="${n ? 8 : 10}"/>`);
    add(`<text class="badget" x="${c.x + 11}" y="${c.y}" text-anchor="middle">${i + 1}</text>`);
    lines.forEach((l, k) => add(`<text class="t ${n ? 'xs' : 'sm'}" x="${c.x + 28}" y="${c.y + k * 17}">${l}</text>`));
    add('</g>');
  });

  return d.render({
    id: n ? 'xn' : 'xw',
    width: g.W,
    height: g.H,
    title: 'The three exits, the stop check and the timebox',
    desc:
      'A session works the question on sounding/take-mise-2027. It needs to know whether the Linux runners are in scope, runs sounding ask, and waits: ' +
      'a card asks the operator, who answers yes, test both, and the answer goes back to the session. It finds that the docs pin mise 2026.9 too, ' +
      'a finding beyond its question, and runs sounding offer: the finding goes to millpond land as a capture of its own under the key sounding/take-mise-2027/1, ' +
      'its own excerpt of kind ask, and becomes one signal. It tries to stop with no conclusion and no note, and the stop check sends it back to work. ' +
      'Its 45 minute timebox runs out, and it runs sounding conclude with what it knows: conclusion.md holds the answer, its evidence, the work it proposes ' +
      'and what stays open, for the operator to decide.',
    still: 92,
  });
}
