// The start page's diagram: one sounding whole, in one 20 s loop. A session
// types /sound and goes on with its own work; millpond's door, an item that
// asks a question, stands beside it. sounding opens a worktree on
// sounding/<name> and writes question.md; one session works the question
// there, writing prototype code, against its timebox; it concludes, and the
// conclusion card waits on the operator, who accepts it.
//
// Timeline, percent of the loop:
//   2-16 open · 16-64 work · 64-78 conclude · 78-94 decide
import { Diagram, esc, type Layout } from './kit';

const T = 20;
const QUESTION = 'take mise 2027.1?';
const TYPED = `/sound ${QUESTION}`;
const BRANCH = 'sounding/take-mise-2027';

// The session's log, each line with when it appears.
const LOG: [string, number, string][] = [
  ['read question.md', 17, 't'],
  ["read mise 2027.1's notes", 23, 't'],
  ['ran CI on 2027.1', 30, 't'],
  ['wrote try/bump.patch', 38, 't'],
  ['2 scripts fail: --frozen', 45, 'warn'],
  ['2027.1 calls it --locked', 52, 't'],
  ['sounding conclude', 60, 'ac'],
];

const FILES: [string, number, string][] = [
  ['question.md', 14, 'the question, its sources'],
  ['try/bump.patch', 39, 'prototype code'],
  ['conclusion.md', 63, 'the answer'],
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
      W: 900,
      H: 470,
      n: false,
      door: { x: 20, y: 74, w: 200, h: 100 },
      door2: { x: 20, y: 214, w: 200, h: 74 },
      orAt: { x: 120, y: 200 },
      panel: { x: 244, y: 44, w: 392, h: 306 },
      branchAt: { x: 626, y: 62, anchor: 'end' },
      filesHd: { x: 256, y: 90 },
      file: (i: number): Box => ({ x: 256, y: 98 + i * 52, w: 136, h: 44 }),
      pane: { x: 404, y: 76, w: 222, h: 262 },
      logY: (i: number) => 124 + i * 19,
      note: { x: 256, y: 292 },
      cardHd: { x: 660, y: 62 },
      card: { x: 660, y: 74, w: 220, h: 272 },
      status: { x: 660, y: 368 },
      wire: 'M220,124 C232,124 232,124 244,124',
      wire2: 'M220,251 C232,251 232,251 244,251',
      caps: (i: number) => ({ x: 20 + i * 222, y: 418 }),
    };
  }
  return {
    W: 360,
    H: 990,
    n: true,
    door: { x: 8, y: 86, w: 212, h: 100 },
    door2: { x: 240, y: 86, w: 112, h: 100 },
    orAt: { x: 230, y: 140 },
    panel: { x: 8, y: 204, w: 344, h: 432 },
    branchAt: { x: 18, y: 242, anchor: 'start' },
    filesHd: { x: 18, y: 266 },
    file: (i: number): Box => ({ x: 18, y: 274 + i * 32, w: 324, h: 26 }),
    pane: { x: 18, y: 380, w: 324, h: 206 },
    logY: (i: number) => 430 + i * 18,
    note: { x: 18, y: 608 },
    cardHd: { x: 12, y: 664 },
    card: { x: 8, y: 674, w: 344, h: 196 },
    status: { x: 12, y: 894 },
    wire: '',
    wire2: '',
    caps: (i: number) => ({ x: 8, y: 926 + i * 18 }),
  };
}

export function hero(layout: Layout, opts: { id?: string; standalone?: boolean } = {}) {
  const g = geometry(layout);
  const n = g.n;
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);
  if (n) {
    add(`<text class="h" x="12" y="30">sounding</text>`);
    add(`<text class="m xs" x="12" y="50">one question, one session, one conclusion</text>`);
    add(`<text class="hd" x="12" y="76">OPENED FROM</text>`);
  } else {
    add(`<text class="h" x="20" y="32">sounding</text>`);
    add(`<text class="m sm" x="110" y="32">one question, one session, one conclusion</text>`);
    add(`<text class="hd" x="20" y="62">OPENED FROM</text>`);
  }

  // ---- the doors: a session's /sound, and millpond's send
  const D1 = g.door;
  d.kf('d1b', [
    [0, 'stroke:var(--dg-rule)'],
    [1.5, 'stroke:var(--dg-rule)'],
    [2.2, 'stroke:var(--dg-accent)'],
    [13, 'stroke:var(--dg-accent)'],
    [14, 'stroke:var(--dg-rule)'],
    [100, 'stroke:var(--dg-rule)'],
  ]);
  add(`<rect class="box ${d.anim('d1b')}" x="${D1.x}" y="${D1.y}" width="${D1.w}" height="${D1.h}" rx="6"/>`);
  const tx = D1.x + 12;
  add(`<text class="t b sm" x="${tx}" y="${D1.y + 22}">your session</text>`);
  // The command, typed: a cover the colour of the box slides off it.
  const cmdY = D1.y + 44;
  add(`<text class="ac mono ${n ? 'xxs' : 'xs'}" x="${tx}" y="${cmdY}">${esc(TYPED)}</text>`);
  const cmdW = TYPED.length * (n ? 6.4 : 7) + 4;
  d.kf('type', [
    [0, 'transform:scaleX(1)'],
    [2, 'transform:scaleX(1)'],
    [10, 'transform:scaleX(0)'],
    [96, 'transform:scaleX(0)'],
    [97.5, 'transform:scaleX(1)'],
    [100, 'transform:scaleX(1)'],
  ]);
  add(`<rect class="cover ${d.anim('type')}" x="${tx - 1}" y="${cmdY - 12}" width="${cmdW}" height="16"/>`);
  d.rule(`.type{animation-timing-function:steps(${TYPED.length},end)}`);
  add(`<text class="m xxs ${d.show('dst0', 0, 11)}" x="${tx}" y="${D1.y + 64}">its own work, going on</text>`);
  add(`<text class="ok xxs ${d.show('dst1', 11, 96)}" x="${tx}" y="${D1.y + 64}">${n ? 'opened · work goes on' : 'sounding opened · work goes on'}</text>`);
  // The session's own work never stops: its bar fills through the loop.
  const tr = { x: tx, y: D1.y + D1.h - 22, w: D1.w - 24 };
  add(`<rect class="track" x="${tr.x}" y="${tr.y}" width="${tr.w}" height="6" rx="3"/>`);
  d.kf('own', [
    [0, 'transform:scaleX(0.08)'],
    [96, 'transform:scaleX(0.92)'],
    [100, 'transform:scaleX(0.08)'],
  ]);
  add(`<rect class="bar ${d.anim('own')}" x="${tr.x}" y="${tr.y}" width="${tr.w}" height="6" rx="3"/>`);

  const D2 = g.door2;
  add(`<text class="m xs" x="${g.orAt.x}" y="${g.orAt.y}" text-anchor="middle">or</text>`);
  add(`<rect class="box2" x="${D2.x}" y="${D2.y}" width="${D2.w}" height="${D2.h}" rx="6" stroke-dasharray="4 3"/>`);
  if (n) {
    add(`<text class="pd b sm" x="${D2.x + 10}" y="${D2.y + 22}">millpond</text>`);
    add(`<text class="m xxs" x="${D2.x + 10}" y="${D2.y + 42}">sends an item</text>`);
    add(`<text class="m xxs" x="${D2.x + 10}" y="${D2.y + 58}">that asks a</text>`);
    add(`<text class="m xxs" x="${D2.x + 10}" y="${D2.y + 74}">question</text>`);
  } else {
    add(`<text class="pd b sm" x="${D2.x + 12}" y="${D2.y + 22}">millpond</text>`);
    add(`<text class="m xs" x="${D2.x + 12}" y="${D2.y + 41}">sends an item that asks</text>`);
    add(`<text class="m xs" x="${D2.x + 12}" y="${D2.y + 58}">a question, its signals as sources</text>`);
  }
  if (!n) {
    add(`<path class="edge" d="${g.wire}"/>`);
    add(`<path class="dash" d="${g.wire2}" style="stroke:var(--dg-muted)"/>`);
  }

  // ---- the worktree
  const P = g.panel;
  add(`<rect class="panel" x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" rx="8"/>`);
  d.kf('pring', [
    [0, 'opacity:0'],
    [13.5, 'opacity:0'],
    [14.5, 'opacity:1'],
    [96, 'opacity:1'],
    [96.8, 'opacity:0'],
    [100, 'opacity:0'],
  ]);
  add(`<rect class="pring ${d.anim('pring')}" x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" rx="8"/>`);
  d.rule('.pring{fill:none;stroke:var(--dg-accent);stroke-width:1.5}');
  add(`<text class="hd" x="${P.x + 12}" y="${P.y + 18}">A WORKTREE OF ITS OWN</text>`);
  add(
    `<text class="mono xs ${d.levels('br', [[0, 0.35], [14, 1], [96, 0.35]])}" x="${g.branchAt.x}" y="${g.branchAt.y}" text-anchor="${g.branchAt.anchor}" style="fill:var(--dg-accent)">${BRANCH}</text>`,
  );
  add(`<text class="hd" x="${g.filesHd.x}" y="${g.filesHd.y}">FILES</text>`);
  FILES.forEach(([name, at, what], i) => {
    const f = g.file(i);
    const last = i === FILES.length - 1;
    add(`<g class="${d.show(`f${i}`, at, 96)}">`);
    add(`<rect class="${last ? 'accbox' : 'file'}" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="5"/>`);
    if (n) {
      add(`<text class="t mono xs" x="${f.x + 10}" y="${f.y + 17}">${name}</text>`);
      add(`<text class="m xxs" x="${f.x + f.w - 10}" y="${f.y + 17}" text-anchor="end">${what}</text>`);
    } else {
      add(`<text class="t mono xs" x="${f.x + 10}" y="${f.y + 19}">${name}</text>`);
      add(`<text class="m xxs" x="${f.x + 10}" y="${f.y + 35}">${what}</text>`);
    }
    add('</g>');
  });
  {
    const nx = g.note.x;
    const ny = g.note.y;
    add(`<text class="m xxs" x="${nx}" y="${ny}">${n ? 'Prototype code stays on this branch: a' : 'Prototype code stays'}</text>`);
    add(`<text class="m xxs" x="${nx}" y="${ny + 15}">${n ? 'sluice submission from sounding/* is refused.' : 'on this branch: a sluice'}</text>`);
    if (!n) {
      add(`<text class="m xxs" x="${nx}" y="${ny + 30}">submission from</text>`);
      add(`<text class="m xxs" x="${nx}" y="${ny + 45}">sounding/* is refused.</text>`);
    }
  }

  // The question flies from the session into question.md.
  {
    const f = g.file(0);
    const cw = QUESTION.length * 6.6 + 16;
    const cx = f.x + 6;
    const cy = f.y + (n ? 3 : 12);
    const fromX = n ? D1.x + 12 : D1.x + D1.w - 10;
    const fromY = n ? D1.y + D1.h - 10 : cmdY - 12;
    d.fly('q', fromX - cx, fromY - cy, 10, 10, 14, 15.5);
    add(`<g class="q"><rect class="chip" x="${cx}" y="${cy}" width="${cw}" height="20" rx="4"/><text class="chipt mono xxs" x="${cx + 8}" y="${cy + 14}">${esc(QUESTION)}</text></g>`);
  }

  // The session pane: its log, its status and its timebox.
  const S = g.pane;
  add(`<rect class="box2" x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="6"/>`);
  add(`<text class="t b xs" x="${S.x + 10}" y="${S.y + 20}">one session · round 1</text>`);
  const st: [string, number, number, string][] = [
    ['waiting', 0, 14.5, 'm'],
    ['working', 14.5, 60, 'ac'],
    ['concluding', 60, 66, 'ac'],
    ['ended', 66, 96, 'm'],
  ];
  st.forEach(([t, a, b, c], k) => add(`<text class="xxs ${c} ${d.show(`ss${k}`, a, b)}" x="${S.x + S.w - 10}" y="${S.y + 20}" text-anchor="end">${t}</text>`));
  add(`<line class="strike" x1="${S.x}" y1="${S.y + 30}" x2="${S.x + S.w}" y2="${S.y + 30}" style="stroke:var(--dg-rule)"/>`);
  LOG.forEach(([line, at, cls], i) => {
    add(`<text class="mono xxs ${cls} ${d.show(`lg${i}`, at, 96)}" x="${S.x + 10}" y="${g.logY(i)}">${esc(line)}</text>`);
  });
  {
    const by = S.y + S.h - 18;
    add(`<text class="m xxs" x="${S.x + 10}" y="${by - 8}">timebox</text>`);
    add(`<text class="m xxs ${d.show('tb0', 0, 60)}" x="${S.x + S.w - 10}" y="${by - 8}" text-anchor="end">45 min</text>`);
    add(`<text class="ac xxs ${d.show('tb1', 60, 96)}" x="${S.x + S.w - 10}" y="${by - 8}" text-anchor="end">done at 31 of 45 min</text>`);
    add(`<rect class="track" x="${S.x + 10}" y="${by}" width="${S.w - 20}" height="6" rx="3"/>`);
    d.kf('tbar', [
      [0, 'transform:scaleX(0)'],
      [14.5, 'transform:scaleX(0)'],
      [62, 'transform:scaleX(0.69)'],
      [96, 'transform:scaleX(0.69)'],
      [97, 'transform:scaleX(0)'],
      [100, 'transform:scaleX(0)'],
    ]);
    add(`<rect class="bar ${d.anim('tbar')}" x="${S.x + 10}" y="${by}" width="${S.w - 20}" height="6" rx="3"/>`);
  }

  // ---- the conclusion card
  add(`<text class="hd" x="${g.cardHd.x}" y="${g.cardHd.y}">THE CONCLUSION</text>`);
  const C = g.card;
  {
    // conclusion.md travels from the worktree to the card.
    const f = g.file(2);
    d.fly('cf', f.x + 6 - (C.x + 12), f.y + 6 - (C.y + 12), 64, 64.5, 69, 70.5);
    add(`<rect class="chip cf" x="${C.x + 12}" y="${C.y + 12}" width="96" height="14" rx="3"/>`);
  }
  add(`<rect class="box2" x="${C.x}" y="${C.y}" width="${C.w}" height="${C.h}" rx="8" stroke-dasharray="4 3"/>`);
  add(`<text class="m xs ${d.show('cwait', 0, 69)}" x="${C.x + C.w / 2}" y="${C.y + C.h / 2}" text-anchor="middle">${n ? 'not yet' : 'not yet written'}</text>`);
  d.kf('cardb', [
    [0, 'stroke:var(--dg-accent)'],
    [86, 'stroke:var(--dg-accent)'],
    [86.8, 'stroke:var(--dg-ok)'],
    [100, 'stroke:var(--dg-ok)'],
  ]);
  add(`<g class="${d.show('card', 69, 96)}">`);
  add(`<rect class="accbox ${d.anim('cardb')}" x="${C.x}" y="${C.y}" width="${C.w}" height="${C.h}" rx="8"/>`);
  const cx = C.x + 12;
  const rows: [string, string[]][] = n
    ? [
        ['answer', ['Take mise 2027.1 once two CI scripts', 'pass --locked in place of --frozen.']],
        ['evidence', ['both scripts ran on 2027.1 with --locked']],
        ['proposes', ['2 pieces of work: the scripts, the bump']],
        ['open', ['the Linux runners are untried']],
      ]
    : [
        ['answer', ['Take mise 2027.1 once two', 'CI scripts pass --locked.']],
        ['evidence', ['both scripts ran on 2027.1']],
        ['proposes', ['the scripts, then the bump']],
        ['open', ['Linux runners untried']],
      ];
  add(`<text class="m mono xxs" x="${cx}" y="${C.y + 22}">conclusion.md · round 1</text>`);
  let y = C.y + 44;
  rows.forEach(([k, lines], i) => {
    add(`<text class="m xxs" x="${cx}" y="${y}">${k}</text>`);
    lines.forEach((l, j) => {
      const cls = i === 0 ? 't b sm' : 't xs';
      add(`<text class="${cls}" x="${n ? cx + 70 : cx}" y="${n ? y + j * 17 : y + 16 + j * 17}">${esc(l)}</text>`);
    });
    y += n ? (lines.length > 1 ? 40 : 24) : 16 + lines.length * 17 + 8;
  });
  add('</g>');
  // The three choices, the accepted one lit.
  const btnY = C.y + C.h - 32;
  const btns: [string, number][] = [
    ['accept', 60],
    ['go on', 56],
    ['drop', 50],
  ];
  let bx = cx;
  btns.forEach(([label, w], i) => {
    add(`<g class="${d.show(`btn${i}`, 72, 96)}">`);
    add(`<rect class="tag" x="${bx}" y="${btnY}" width="${w}" height="22" rx="11"/>`);
    add(`<text class="t xxs" x="${bx + w / 2}" y="${btnY + 15}" text-anchor="middle">${label}</text>`);
    add('</g>');
    if (i === 0) {
      add(`<g class="${d.show('acc', 86, 96)}"><rect class="tagj" x="${bx}" y="${btnY}" width="${w}" height="22" rx="11" style="fill:var(--dg-ok)"/>`);
      add(`<text class="tagjt xxs" x="${bx + w / 2}" y="${btnY + 15}" text-anchor="middle">${label}</text></g>`);
    }
    bx += w + 8;
  });
  add(`<text class="warn xxs b ${d.show('cs0', 72, 86)}" x="${g.status.x}" y="${g.status.y}">waiting on you: a card, or herdr</text>`);
  add(`<text class="ok xxs b ${d.show('cs1', 86, 96)}" x="${g.status.x}" y="${g.status.y}">accepted · its work becomes items</text>`);

  // ---- captions
  const caps = n
    ? [
        ['Ask from a session, or from an item.', 2, 16],
        ['One session works it in its own worktree.', 16, 64],
        ['It ends on a conclusion.', 64, 78],
        ['You decide: accept, go on or drop.', 78, 94],
      ]
    : [
        ['Ask from any session, or|from an item millpond sends.', 2, 16],
        ['One session works it in a|worktree of its own.', 16, 64],
        ['It ends on a conclusion: the|answer, evidence, the work.', 64, 78],
        ['You decide it: accept,|go on, or drop.', 78, 94],
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
    id: opts.id ?? (n ? 'hn' : 'hw'),
    width: g.W,
    height: g.H,
    title: 'sounding: one question, one session, one conclusion',
    desc:
      'A session types /sound take mise 2027.1? and goes on with its own work, its progress bar never stopping; beside it, millpond can send an item that asks a question. ' +
      'sounding opens a worktree on the branch sounding/take-mise-2027 and writes question.md. One session works the question there against a 45 minute timebox: ' +
      'it reads the question and the release notes, runs CI on the new version, writes prototype code to try/bump.patch, finds two scripts failing on a renamed flag, and concludes. ' +
      'conclusion.md holds the answer, take mise 2027.1 once two CI scripts pass --locked, its evidence, the work it proposes and what stays open. ' +
      'The card waits on the operator, who accepts it. Prototype code stays on the branch: a sluice submission from sounding/* is refused.',
    still: 93,
    standalone: opts.standalone,
  });
}
