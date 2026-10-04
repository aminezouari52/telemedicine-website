---
name: create-issue
description: Draft and post GitHub issues for this repo in its house format (Difficulty, Problem, Proposed fix, Tips). Use when the user says "create this issue", "open an issue", "file an issue", "add an issue for ...", or gives one or more feature ideas or bugs to turn into issues.
---

# Create GitHub issues

Turn a short idea ("issue: join early", "multi-language support") into an issue a contributor can pick up without asking questions, then post it with `gh`.

## 1. Ground it in the code

Before writing, find where the change lives:

- Search for the files, functions and constants involved. Read them; don't guess from names.
- Read `AGENTS.md` and the relevant `docs/*.md` for constraints (React 19, Clerk Core 3, JavaScript only, no test runner).
- Run `gh issue list --state all --limit 30` and check that the issue doesn't already exist. If one overlaps, link it (`#16`) or tell the user.
- Read the bodies of two or three recent issues (`gh issue view <n> --json body -q .body`) and match their tone.

## 2. Write the issue

Title: one plain sentence in sentence case that says the outcome or the bug ("Let patients join the consultation room a few minutes early"). No `feat:` prefix, no trailing period.

Body, exactly these four parts and nothing else:

```markdown
**Difficulty:** Easy · Full stack

## Problem

## Proposed fix

## Tips
```

- **Difficulty**: `Easy`, `Medium` or `Hard`, then `Backend`, `Frontend` or `Full stack`.
  - Easy: a few files, one area, no new concepts.
  - Medium: several files or both apps, some design decisions.
  - Hard: touches much of the app or needs a new library or architecture choice.
- **Problem**: what is wrong or missing today, and who it affects. Point at the code that causes it (`isJoinable` in `services/livekit.service.js`). A few sentences or a short list.
- **Proposed fix**: what to change, as short bullets. Say what, not every line of how. When one decision belongs to the maintainer (which languages, how many minutes), propose a default and say it's adjustable.
- **Tips**: the non-obvious things a contributor would trip over: edge cases, code that must stay in sync, existing helpers to reuse, how to split a large change into PRs. Don't repeat the proposed fix.

Style:

- Short sentences, plain words, no marketing tone, no emoji.
- File paths in backticks, relative to the app's `src/` (`services/payment.service.js`, `utils/consultationJoinable.js`). Use `apps/frontend/...` or `apps/backend/...` when it isn't obvious which app.
- Every file, function and constant you name must exist. Check before citing it.

Labels: pick from the repo's labels (`gh label list`). Usually one of `bug` or `enhancement`, plus `good first issue` when the difficulty is Easy.

## 3. Post it

Post each issue as soon as it's written. Don't show a draft or ask for approval first. The only exception: if step 1 found an existing issue that covers the same thing, don't post. Link the existing issue and ask the user what to do.

Write each body to a temporary file and pass it with `--body-file`, so Markdown, backticks and quotes survive the shell:

```bash
gh issue create --title "<title>" --body-file "<temp dir>/issue-1.md" --label enhancement --label "good first issue"
```

Reply with each issue's URL, title and labels. If the user then asks for changes, edit the posted issue rather than opening a new one:

```bash
gh issue edit <number> --title "<title>" --body-file "<temp dir>/issue-1.md"
```
