# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

- **This repo is a fork of `besoeasy/Originless` with `startos/` added**, and upstream updates arrive by `git fetch upstream && git merge upstream/main`. Everything outside `startos/` and the packaging files (`package.json`, `Makefile`, `tsconfig.json`, `.prettierrc`, `instructions.md`, `AGENTS.md`) is upstream's; don't edit it here, or the next merge conflicts.
- **`README.md` is the package README, not upstream's.** When a merge conflicts on it, keep ours (`git checkout --ours README.md`) and fold any user-visible upstream change into it by hand.
- **The `.gitignore` and `.dockerignore` carry a packaging block appended below upstream's lines.** Keep it at the end so upstream edits merge cleanly; dropping `startos`/`node_modules`/`*.s9pk` from `.dockerignore` sends hundreds of MB of build context to Docker.
- **Upstream release = package version.** `git describe --tags upstream/main` names the upstream release; bump `startos/versions/current.ts` to it, and the `VERSION` build arg in `startos/manifest/index.ts` with it (it is what the app reports as its version).
