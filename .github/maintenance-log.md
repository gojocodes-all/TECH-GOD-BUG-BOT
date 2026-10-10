# Maintenance log

## 2026-10-10 — Document the repository's incomplete library status

- **Rationale:** The previous README described a ready-to-run WhatsApp bot with a command handler and several application features, while the repository contains only a compiled Baileys library snapshot. It omitted the missing entry point, source, tests, build inputs, lockfile, and the dependency issue that prevents a clean runtime import.
- **Files changed:** `README.md`, `.gitignore`, `.github/maintenance-log.md`
- **Validation:** Cross-checked the guide against the complete repository tree, package manifest, Node.js guard, compiled exports, and recent history; installed production dependencies with `npm install --omit=dev`; reproduced and documented the `libsignal` import failure; checked all 95 library and protocol JavaScript files plus the Node.js guard with `node --check`; parsed `package.json`; verified documented paths and commands; reviewed the complete diff.
- **Risk:** Low. Documentation and ignore rules only; package code, dependencies, generated protocol data, and runtime behavior are unchanged.
- **Rollback:** Revert the pull request's squash commit to restore the previous README and remove the maintenance and ignore files.
