# Core conventions

Project-wide rules that don't fit into release / compact / language-specific files.

## Scope discipline
- Don't add features, refactors, or abstractions beyond what the task asked for.
- A bug fix doesn't drag in surrounding cleanup. A one-shot script doesn't need a helper module.
- Three similar lines is fine — premature abstraction is worse.
- No half-finished implementations. Either ship a working slice or don't touch it.

## Trust boundaries
- Validate at system boundaries (user input, external API responses, file parsing).
- Don't add defensive checks for impossible internal states. Trust the type system and framework guarantees.
- No backwards-compat shims for code we control — change the call sites instead.

## Comments
- Default: write none. Names should explain the what.
- Add a comment only when the WHY is non-obvious: a hidden constraint, a workaround for a known bug, behavior that would surprise a future reader.
- Don't reference current PRs, tasks, or "added for X flow" — that rots fast and belongs in commit messages.

## Reuse before invention
- Before writing a new helper / type / hook, search the codebase. If something close exists, extend it.
- Mirror existing patterns even if you'd start fresh differently. Consistency > local optimum.

## Verification before declaring done
- Run the Verification steps from `CLAUDE.md` before saying a task is complete.
- For UI work: actually open the page in a browser and test the golden path.
- Type-check / test pass ≠ feature works. They're necessary, not sufficient.
