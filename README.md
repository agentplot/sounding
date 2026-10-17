# sounding

**Designed, not built.** The design is settled in
[agentplot/blueprints](https://github.com/agentplot/blueprints); no code
exists yet.

sounding works one question at a time. One agent session takes the
question into a worktree of its own, on the branch `sounding/<name>`.
It leaves by one of three exits: a conclusion, an offer of something it
found beyond the question, or a question only you can answer. You decide
each conclusion: accept it, send it back for another round, or drop it.

<p align="center"><img src="docs/diagrams/sounding.svg" alt="A question opened from a session or a millpond item goes to a worktree on sounding/<name>; the session works it, offers one finding back to millpond as a capture, and concludes; the conclusion card waits on accept, go on or drop." width="900"></p>

- **The site:** https://agentplot.github.io/sounding
- **The design book:** https://agentplot.github.io/blueprints/sounding/
- **The statement**, sounding's invariants as numbered clauses, comes
  next, as `design/sounding/requirements.md` in agentplot/blueprints.

## What it does

- **One question, one session, one place.** `sounding open` writes the
  question and its sources into a worktree on `sounding/<name>`. The
  session may write prototype code there to test an answer; that code
  never lands from the sounding's branch.
- **Three exits.** `sounding conclude` writes `conclusion.md`. `sounding
  offer` hands a finding beyond the question to millpond as a capture of
  its own. `sounding ask` puts a question for you on a card and waits.
- **A stop check and a timebox.** The session cannot end with no
  conclusion and no note of where the next round starts, and each round
  ends on time with what it knows.
- **You decide.** Accept settles the question, and the work the
  conclusion proposes becomes items of its own. Go on starts the next
  round in the same worktree with your notes. Drop records why and
  removes the worktree.
- **A conclusion is never a signal.** An accepted conclusion is the
  item's record in millpond, and only offers come back as signals.

sounding is one of a family. headwater reports releases, eddy lists
meetings, millpond keeps the inbox and sluice lands changes. sounding
stands alone and works the same with millpond, with crew, or under
Flywheel, whose elaborations each run as a sounding.

## This repository

| path | what |
|---|---|
| `site/` | the site, Astro with Starlight; its diagrams are drawn at build time (`site/README.md`) |
| `docs/diagrams/` | the README's diagram, generated from the site's |
| `devenv.nix` | the shell: moon through proto, Vale, bun, and Playwright with its Chromium |
| `.config/kit.toml` | the kit standard's profile this repository follows |

```sh
devenv shell -- site-build   # the site, through moon
devenv shell -- prose        # the prose, through Vale
```

## License

MIT
