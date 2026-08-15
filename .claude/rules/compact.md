# /compact priorities

When `/compact` runs, preserve in priority order:
0. **`V2_PLAN.md` — источник правды по архитектуре v2**, `HANDOFF.md` — по состоянию репозитория.
   §0 «проверенные факты» в V2_PLAN не пересказывать своими словами — отсылать к файлу.
   Ключевое решение 2026-08-14: **δ, единый стек React 19 + TS + Tailwind v4 и в админке, и в TMA**;
   Svelte отменён, α/β/γ закрыт.
1. **Architecture decisions** — NEVER summarize away. Naming, layering, contracts, "we chose X over Y because Z".
2. **Modified files and their key changes** — what each diff actually does.
3. **Current verification status** — pass/fail of last test/typecheck/build run.
4. **Open TODOs and rollback notes** — anything left unfinished or that needs reverting.
5. **User feedback / corrections** from this session — preferences, "don't do X", confirmations of unusual approaches.

Drop:
- Tool stdout/stderr — keep only pass/fail signal.
- Repeated reads of the same file.
- Directory listings (re-grep when needed).
- Verbose API responses once their conclusion is captured.

These rules are mirrored in `.claude/settings.json` (`compactCustomInstructions`) and in the global `~/.claude/settings.json`.
