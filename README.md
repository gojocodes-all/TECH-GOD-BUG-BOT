# TECH-GOD-BUG-BOT

This repository is an incomplete, precompiled snapshot of a modified Baileys
WhatsApp Web library. It is useful for inspecting the generated JavaScript and
TypeScript declarations, but it is **not currently a ready-to-run WhatsApp
bot**.

## Current status

The repository contains the compiled library under `lib/` and generated
WhatsApp protocol definitions under `WAProto/`. It does not contain a bot
entry point, command handler, configuration file, authentication-state setup,
start script, original TypeScript source, a TypeScript configuration, a
dependency lockfile, or a complete test suite.

The package cannot currently be imported after a clean production dependency
install. Its `libsignal` dependency resolves to
`@shennmine/libsignal-node@0.0.1-security`, a placeholder package without the
module expected by `lib/Signal/libsignal.js`. Importing `lib/index.js`
therefore fails with `Cannot find module 'libsignal'`.

Do not use this repository as a production bot or publish it as a working
package until that dependency and the missing development inputs are restored
and validated.

## What is included

- Compiled CommonJS modules and matching declarations in `lib/`
- Generated protocol definitions in `WAProto/index.js`
- A Node.js version guard in `engine-requirements.js`
- Package metadata and historical scripts in `package.json`
- Dependency-free syntax validation and built-in Node.js regression tests
- Read-only GitHub Actions validation for pull requests and `master`

The package metadata identifies the module as `@yumenative/baileys` version
`2.0.3` and requires Node.js 20 or newer.

## Inspecting the snapshot

Requirements:

- Git
- Node.js 20 or newer

```bash
git clone https://github.com/gojocodes-all/TECH-GOD-BUG-BOT.git
cd TECH-GOD-BUG-BOT
npm run validate
```

The dependency-free validation gate enforces Node.js 20+, syntax-checks every
committed JavaScript file, and runs the supported built-in tests. It does not
install dependencies or prove that the library can be imported, connect to
WhatsApp, or support a complete bot workflow.

Use `npm run check:syntax` or `npm test` when only one part of that gate is
needed. Pull requests and pushes to `master` run the same `npm run validate`
command with read-only repository permissions.

### Dependency installation

The manifest declares Yarn 1.22.19, but the repository has no Yarn lockfile.
For investigation on a conventional Linux development machine, the runtime
dependency graph can be installed without development dependencies:

```bash
npm install --omit=dev
```

This command completed during the 2026-10-10 maintenance review, but the
subsequent library import failed because of the unresolved `libsignal`
dependency described above.

Android and Termux are not verified development targets for this snapshot. The
development dependency graph includes native packages such as `sharp`, so a
full `npm install` may additionally require platform-specific binaries or a
native build toolchain. A successful dependency install would still not make
this repository a runnable bot because no bot entry point exists.

## Package scripts

The scripts below are present in `package.json`, but most cannot be used with
the files currently committed:

| Script | Intended purpose | Current limitation |
| --- | --- | --- |
| `build:tsc` | Compile TypeScript | No source tree or `tsconfig.json` |
| `build:docs` | Generate TypeDoc documentation | No TypeScript source or TypeDoc configuration |
| `lint` | Lint `src/` | No `src/` directory |
| `check:syntax` | Syntax-check every committed JavaScript file | Does not load dependencies or exercise runtime behavior |
| `test` | Run the supported built-in Node.js tests | Covers repository validation and the ordered-dictionary utility, not the full library |
| `validate` | Run the shared Node.js guard, syntax, and test gate | Dependency-free by design while the runtime dependency is unresolved |
| `gen:protobuf` | Regenerate protocol files | `WAProto/GenerateStatics.sh` is absent |

There is no `start` script.

## Repository structure

```text
.
├── lib/                    # Compiled library modules and .d.ts files
├── WAProto/
│   └── index.js            # Generated WhatsApp protocol definitions
├── engine-requirements.js  # Enforces Node.js 20+
├── package.json            # Package metadata and historical scripts
├── scripts/
│   └── validate.js         # Shared dependency-free validation entry point
├── test/
│   ├── make-ordered-dictionary.test.js  # Focused utility regression test
│   └── validate-repository.test.js      # Validation discovery and mode tests
├── .github/workflows/ci.yml             # Read-only hosted validation
└── README.md
```

## Work needed before runtime use

1. Select and verify a maintained, API-compatible Signal implementation.
2. Restore the original TypeScript source and build configuration, or clearly
   establish the compiled files as the maintained source of truth.
3. Add a lockfile and reproducible installation process.
4. Expand the current utility regression coverage into a supported test suite
   for authentication, message parsing, reconnect behavior, and credential
   persistence.
5. Create a separate bot application with an explicit entry point, session
   storage, configuration, and command handling.
6. After restoring the runtime dependency, extend CI with clean-install,
   package-import, and integration coverage.

## Contributing

Keep changes narrow and document whether they target the library snapshot or a
future bot application. Before opening a pull request:

1. Confirm that every documented path and command exists.
2. Run `npm run validate`, which checks every committed JavaScript file and all
   currently supported Node.js tests without installing dependencies.
3. Do not commit WhatsApp credentials, session files, environment files, phone
   numbers, or private message data.
4. Update `.github/maintenance-log.md` with the rationale, validation, risk,
   and rollback plan.

Until a working test suite is restored, changes to protocol, encryption, or
session handling require manual review and should not be merged automatically.
