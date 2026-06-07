# Study AI Knowledge Graph — Backend Integration Ultragoal Brief

## Aggregate Objective

Evolve the static Vite + React AI knowledge graph in `study_AI/` into a
local-first full-stack system with approved graph data, a human-reviewed
candidate pipeline, git-history mining, web research, and a decoupled
LearningAgent integration. The frontend never imports Python. Approved and
candidate knowledge stay in separate stores. Every write to approved
knowledge flows through human review of a candidate.

## Mode

`codex-goal-mode` = `aggregate`. Intermediate story checkpoints use
`omx ultragoal checkpoint` with a fresh `get_goal` snapshot. The final
clean checkpoint uses `--quality-gate-json` and then
`update_goal({status: "complete"})`.

## Stories

Stories are passed explicitly via `omx ultragoal create-goals --goal ...`,
not inferred from the brief body, to keep the plan crisp and avoid
over-decomposition. Each `## Active Stories` block in earlier drafts has
been collapsed into a single `--goal` invocation per story.
