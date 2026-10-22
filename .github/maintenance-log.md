# Maintenance log

## 2026-10-22 — Align the README with focused regression coverage

- **Rationale:** The README still stated that the snapshot contained no tests after a focused Node.js regression test was added for the ordered-dictionary utility. That made the repository status, structure, and available validation guidance inaccurate.
- **Files changed:** Updated `README.md` to describe the existing test, its exact direct command, its limited scope, and the remaining gap between one utility regression and a supported package test suite; updated this maintenance log.
- **Validation:** Cross-checked the documented paths and commands against `package.json`, `test/make-ordered-dictionary.test.js`, the current repository tree, and the 2026-10-15 maintenance entry; ran the documented Node.js version guard, JavaScript syntax check, focused regression test, and Markdown consistency checks.
- **Risk:** Low. Documentation only; compiled library code, package metadata, dependencies, protocol data, and runtime behavior are unchanged.
- **Rollback:** Revert this pull request to restore the previous README wording and remove this log entry.

## 2026-10-15 — Restore ordered-dictionary lookup consistency

- **Rationale:** `fromJSON()` replaced the ordered array without rebuilding the ID lookup map, leaving restored items inaccessible through `get()`, `update()`, and `remove()`. The related `update()` method also declared a boolean result but returned `false` after successful replacements.
- **Files changed:** `lib/Store/make-ordered-dictionary.js`, `test/make-ordered-dictionary.test.js`, `.github/maintenance-log.md`
- **Validation:** Ran `node --check` on the changed JavaScript files and `node --test test/make-ordered-dictionary.test.js` (2 tests passed). The regression tests cover removal of stale lookup entries, restoration of new lookups, order preservation, and accurate `update()` results. Reviewed the complete diff against the declaration contract and repository conventions.
- **Risk:** Low. The change is isolated to the ordered dictionary's existing restoration and return-value behavior; it does not affect protocol, encryption, authentication, dependencies, or public method signatures.
- **Rollback:** Revert the pull request's squash commit to restore the previous compiled utility and remove the focused regression test.

## 2026-10-10 — Document the repository's incomplete library status

- **Rationale:** The previous README described a ready-to-run WhatsApp bot with a command handler and several application features, while the repository contains only a compiled Baileys library snapshot. It omitted the missing entry point, source, tests, build inputs, lockfile, and the dependency issue that prevents a clean runtime import.
- **Files changed:** `README.md`, `.gitignore`, `.github/maintenance-log.md`
- **Validation:** Cross-checked the guide against the complete repository tree, package manifest, Node.js guard, compiled exports, and recent history; installed production dependencies with `npm install --omit=dev`; reproduced and documented the `libsignal` import failure; checked all 95 library and protocol JavaScript files plus the Node.js guard with `node --check`; parsed `package.json`; verified documented paths and commands; reviewed the complete diff.
- **Risk:** Low. Documentation and ignore rules only; package code, dependencies, generated protocol data, and runtime behavior are unchanged.
- **Rollback:** Revert the pull request's squash commit to restore the previous README and remove the maintenance and ignore files.
