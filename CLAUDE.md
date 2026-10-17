# sounding

One question, worked by one agent session in a worktree of its own on
`sounding/<name>`, left by one of three exits (conclude, offer, ask),
guarded by a stop check and a timebox, and decided by the operator:
accept, go on or drop. Designed, not built.

The design is in agentplot/blueprints: the capture design,
`design/capture/design.md`, section "Questions: sounding", and its plan,
`plan.md` beside it (decision 11, steps Q1 to Q5 and C6); sounding's
statement, `design/sounding/requirements.md`, is written from them next
(plan step Q1). This repository cites the statement's clauses by number
and never restates them. Where the site and the design disagree, the
design wins.

## Rules

sounding's rules are written after its statement, into
`docs/architecture/` with the decisions behind them in `docs/adr/`, and
then imported here. Until then the kit standard binds as its `code`
profile says (`.config/kit.toml`).

## Checks

Every tool runs through the shell, one command at a time:
`devenv shell -- <command>`. moon runs the checks, tagged by layer:

| layer | what | how long |
|---|---|---|
| `check-fast` | the site's prose (Vale) and its build | seconds |

`devenv shell -- moon run :#check-fast` runs them; `site-build` and
`prose` run one each. The site's own notes are `site/README.md`.

## Commits

Stage by pathspec and commit the paths you wrote: `git add <paths>`, then
`git commit -m "<subject>" -- <paths>`. Never `-a`, never `add .`.
Conventional Commits subjects, scope the part of the tree touched; the
commit-msg hook refuses any other.
