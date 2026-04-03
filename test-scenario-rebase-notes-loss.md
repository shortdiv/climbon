# Test Scenario: Git Notes Lost During Rebase with Conflict Resolution

## Summary

AI attribution stored in `refs/notes/ai` is lost for the rebasing session's commits when a branch is rebased, because rebase rewrites commit SHAs and git notes are keyed by SHA. Session A's notes (pushed to remote) are unaffected since their commits keep their original SHAs — they form the base of the rebase. Only the rebasing session's commits get new SHAs, orphaning their notes.

## Setup

Two Claude Code sessions (A and B) working on the same branch (`feat-boards`), both starting from the same HEAD.

### Preconditions

- A remote repository with branch `feat-boards`
- AI attribution notes are being written to `refs/notes/ai` on commits
- Both sessions have the branch checked out at the same starting point

## Steps to Reproduce

### 1. Session A makes commits and pushes

```bash
# Session A: make changes to shared files (e.g., README.md, App.tsx)
# Claude Code creates commits with AI notes attached via refs/notes/ai
git push origin feat-boards
# Notes are also pushed to refs/notes/ai on the remote
```

Result: Remote `feat-boards` now has Session A's commits (e.g., `93e565d`, `ba5ad8b`, `ed12be4`, `16ee03b`, `c7cc9f8`) with AI notes.

### 2. Session B makes commits to overlapping files (without pulling)

```bash
# Session B: independently edits some of the same files (e.g., README.md)
# Claude Code creates commits with AI notes attached via refs/notes/ai
# e.g., f442a74 "Update README with project name and description"
# e.g., 49602a4 "Remove boilerplate React Compiler section from README"
```

Result: Session B's local branch has diverged from `origin/feat-boards`. Both `git push` and `git pull` (fast-forward) will fail.

### 3. Session B attempts to push

```bash
git push origin feat-boards
# ERROR: rejected — remote contains commits not in local
```

### 4. Session B rebases onto remote

```bash
git fetch origin feat-boards
git rebase origin/feat-boards
# CONFLICT in shared files (e.g., README.md)
```

### 5. Resolve conflicts and continue rebase

```bash
# Manually resolve conflicts in README.md
git add README.md
git rebase --continue
```

Result: Rebase completes. Session B's commits are replayed on top of Session A's commits with **new SHAs**:
- `f442a74` → `29a6f82` (new SHA)
- `49602a4` → `b963856` (new SHA)

Session A's commits (`93e565d`, `ba5ad8b`, etc.) **keep their original SHAs** — they are the rebase base, not replayed.

## Expected vs Actual

### Expected

AI attribution notes should be preserved (or migrated) for the rebasing session's commits.

### Actual

- Session A's commits: **unaffected** — SHAs unchanged, notes intact on remote
- Session B's commits: **notes lost** — new SHAs have no notes, old SHAs still have notes but are orphaned
- `git notes --ref=refs/notes/ai show <new-sha>` returns "no note found" for Session B's rebased commits
- `git notes --ref=refs/notes/ai show <old-sha>` still returns the full attribution data, but the old SHA is no longer reachable from any branch

### What this looks like

```
Commit (current branch)              Notes status
─────────────────────────────────    ────────────────────
b963856 Remove boilerplate...        ❌ NO NOTE (Session B, rebased)
29a6f82 Update README...             ❌ NO NOTE (Session B, rebased)
93e565d Update app header...         ❌ NO NOTE (Session A, never in local notes ref*)
ba5ad8b Improve accessibility...     ❌ NO NOTE (Session A, never in local notes ref*)
ed12be4 Add description field...     ❌ NO NOTE (Session A, never in local notes ref*)
16ee03b Add JSDoc comment...         ❌ NO NOTE (Session A, never in local notes ref*)
c7cc9f8 Update README...             ❌ NO NOTE (Session A, never in local notes ref*)
e6d0ed2 Update board badge...        ✅ HAS NOTE (pre-divergence, untouched)
b422982 Add training boards...       ✅ HAS NOTE (pre-divergence, untouched)

* Session A's notes exist on the remote but were not merged into local refs/notes/ai
```

## Verification

```bash
# 1. List all note entries — these are keyed to commit SHAs
git notes --ref=refs/notes/ai list

# 2. Check current commits for notes (should show "no note found" for rebased ones)
git log --oneline HEAD~7..HEAD --format="%H %s" | while read sha msg; do
  echo "=== $sha ($msg) ==="
  git notes --ref=refs/notes/ai show $sha 2>&1
done

# 3. Prove old notes still exist on pre-rebase SHAs
git notes --ref=refs/notes/ai show 49602a4  # old SHA — has full attribution
git notes --ref=refs/notes/ai show b963856  # new SHA — "no note found"

# 4. Check which notes are orphaned (SHA not reachable from any branch)
git notes --ref=refs/notes/ai list | awk '{print $2}' | while read sha; do
  if git merge-base --is-ancestor $sha HEAD 2>/dev/null; then
    echo "✅ $sha (reachable)"
  else
    echo "❌ $sha (orphaned)"
  fi
done
```

## Root Cause

`git rebase` replays commits, creating new commit objects with new SHAs. Git notes are a mapping of `SHA -> note content` stored as a tree under `refs/notes/ai`. When the SHA changes, the mapping breaks. Git does not automatically rewrite notes references during rebase.

Only the rebasing session's commits are affected — the base commits (from the other session) keep their original SHAs and their notes remain valid.

## Possible Mitigations

1. **`git notes copy`**: After rebase, map old SHAs to new SHAs and run `git notes --ref=refs/notes/ai copy <old-sha> <new-sha>` for each rebased commit.
2. **Post-rebase hook**: Use a `post-rewrite` hook (which receives old-SHA/new-SHA pairs) to automatically copy notes to the new commits.
3. **`notes.rewriteRef` config**: Set `git config notes.rewriteRef refs/notes/ai` — this tells git to automatically copy notes during rebase/amend operations.
4. **Avoid rebase**: Use merge instead of rebase to preserve original commit SHAs (trade-off: messier history).

## Recommended Fix

Option 3 is the simplest and requires no post-rebase manual steps. Adding this to the git config:

```bash
git config notes.rewriteRef refs/notes/ai
```

This causes `git rebase` and `git commit --amend` to automatically copy notes from old SHAs to new SHAs via the `post-rewrite` mechanism. It should be set per-repo or globally before any rebase occurs.
