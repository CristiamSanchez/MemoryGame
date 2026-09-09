---
name: coding
description: "Use when: implementing a feature, fixing a bug, refactoring code, or validating a change in a repository. Guides a disciplined coding workflow from understanding the task to verified delivery."
---

# Coding

## Purpose

Use this skill to turn an ambiguous request into a small, correct, and verifiable code change with minimal churn.

## Workflow

### 1. Clarify the task
- Confirm the expected behavior and the user-visible outcome.
- Identify constraints such as browser support, API contracts, performance, accessibility, or security.
- Define completion in concrete terms before editing code.

### 2. Inspect the right scope
- Search only for the relevant symbols, functions, or files.
- Read the smallest necessary sections to understand the existing behavior.
- Prefer the direct source of truth over broad refactors.

### 3. Plan the minimal change
- Choose the smallest fix that satisfies the requirement.
- Decide whether a targeted test, validation script, or manual check is needed.
- If the root cause is unclear, reproduce it before changing code.

### 4. Implement carefully
- Edit only the files needed for the fix or feature.
- Keep changes focused and consistent with the project’s existing style.
- Avoid unrelated cleanup unless it directly supports the task.

### 5. Validate with evidence
- Run the smallest relevant test or command.
- If no automated test exists, validate using a direct script, browser check, or reproducible manual scenario.
- Record the command and its result before claiming the fix works.

### 6. Review before finishing
- Check the diff for accidental edits or debug leftovers.
- Confirm the change matches the original requirement.
- Summarize what changed and what evidence proves it.

## Decision Points

- If the requirement is unclear, ask a clarifying question before coding.
- If the issue is a bug, reproduce it and identify the root cause before patching.
- If multiple approaches exist, choose the simplest one that matches the project’s conventions.
- If behavior is not covered by tests, add or update a focused test when practical.
- If validation is blocked, say so explicitly and provide the next best verification step.

## Quality Bar

A task is only complete when all of the following are true:
- The requested behavior is implemented.
- The change is limited to the relevant scope.
- Validation evidence is captured from a real command or check.
- The final description clearly states the result and remaining risk, if any.

## Example prompts

- Fix the bug where the card flip animation stops before the second click.
- Add a win-state screen with a replay button to the memory game.
- Refactor the game loop to separate rendering and state updates.
- Improve accessibility for keyboard users on the memory cards.

## Related customizations

- Create a debugging skill for reproducing issues and isolating root cause.
- Create a review skill for code-quality checks before a merge.
- Create a testing skill for focused validation and regression coverage.
