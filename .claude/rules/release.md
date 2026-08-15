# Release / branch policy

Branching, merging, pushing — anything that changes shared history. Enforced by `~/.claude/hooks/git-guard.sh`.

## Branches
- All changes go to a feature branch: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`, `docs/<short-name>`.
- Never commit directly on `main` or `master`. The git-guard hook blocks this (except for the very first commit in a fresh repo).
- If the user asks for a change while you're on main/master → first create a feature branch, then commit.

## Merging
- Never merge a feature branch into `main`/`master` without an explicit instruction containing "merge", "ship", "сливай", "влей", or equivalent.
- Default merge command from main/master: `git merge --no-ff <branch>`.
- The git-guard hook prompts (`permissionDecision: ask`) before any merge or commit while on main/master.

## Pushing
- Never `git push` without explicit user instruction.
- Never `git push --force` / `-f` / `--force-with-lease` without an explicit "force push" instruction.
- Never force-push to `main`/`master` even with permission — surface a warning instead.

## Destructive operations require explicit approval
- `git reset --hard`
- `git checkout -- .` / `git checkout -- <path>`
- `git clean -f` / `-fd` / `-df`
- `git branch -D`
- `git rebase -i` (also: never use `-i` because it requires interactive input)

## Always free
- `git status`, `git log`, `git diff`, `git show`, `git branch`, `git cat-file`, `git worktree list`, `git stash list` — no approval needed.

## When the user says "commit and push"
- Commit on the feature branch is fine.
- Push prompts the user via the hook — that's expected. Don't try to bypass.
