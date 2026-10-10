# TECH-GOD-BUG-BOT

This repository is an incomplete, precompiled snapshot of a modified Baileys
WhatsApp Web library. It is useful for inspecting the generated JavaScript and
TypeScript declarations, but it is **not currently a ready-to-run WhatsApp
bot**.

## Current status

The repository contains the compiled library under `lib/` and generated
WhatsApp protocol definitions under `WAProto/`. It does not contain a bot
entry point, command handler, configuration file, authentication-state setup,
start script, original TypeScript source, tests, a TypeScript configuration, or
a dependency lockfile.

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

The package metadata identifies the module as `@yumenative/baileys` version
`2.0.3` and requires Node.js 20 or newer.

## Inspecting the snapshot

Requirements:

- Git
- Node.js 20 or newer

```bash
git clone https://github.com/gojocodes-all/TECH-GOD-BUG-BOT.git
cd TECH-GOD-BUG-BOT
node engine-requirements.js
node --check lib/index.js
```

The final command checks JavaScript syntax only. It does not prove that the
library can connect to WhatsApp.

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
| `test` | Run Jest | No tests or Jest configuration |
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
└── README.md
```

## Work needed before runtime use

1. Select and verify a maintained, API-compatible Signal implementation.
2. Restore the original TypeScript source and build configuration, or clearly
   establish the compiled files as the maintained source of truth.
3. Add a lockfile and reproducible installation process.
4. Add focused tests for authentication, message parsing, reconnect behavior,
   and credential persistence.
5. Create a separate bot application with an explicit entry point, session
   storage, configuration, and command handling.
6. Add CI that installs dependencies and runs the supported validation suite.

## Contributing

Keep changes narrow and document whether they target the library snapshot or a
future bot application. Before opening a pull request:

1. Confirm that every documented path and command exists.
2. Run `node --check` on changed JavaScript files.
3. Do not commit WhatsApp credentials, session files, environment files, phone
   numbers, or private message data.
4. Update `.github/maintenance-log.md` with the rationale, validation, risk,
   and rollback plan.

Until a working test suite is restored, changes to protocol, encryption, or
session handling require manual review and should not be merged automatically.
