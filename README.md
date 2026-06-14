# Originless for StartOS 0.4.0 Beta

This repository contains the Originless application and a StartOS `0.4.0`
beta package wrapper built with the TypeScript Start SDK.

Originless is a self-hosted anonymous upload service backed by an embedded
Kubo/IPFS node. The StartOS package exposes the web UI and REST API, persists
the IPFS repository on the package volume, and provides actions for upload
limits and Daku pin-management keys.

## Build

Install the StartOS 0.4 packaging dependencies:

- Docker with `buildx`
- Node.js and npm
- `start-cli`

Then build the universal x86_64/aarch64 package:

```bash
make
```

Architecture-specific builds are also available:

```bash
make x86
make arm
```

The default build produces `originless.s9pk`.

## StartOS Package Layout

- `startos/` contains the 0.4 TypeScript package definition.
- `startos/manifest/index.ts` defines package metadata and image builds.
- `startos/main.ts` starts Originless and wires runtime configuration into the
  container.
- `startos/interfaces.ts` exports the web/API and IPFS peer interfaces.
- `startos/actions/` contains configuration and pin-key actions.
- `s9pk.mk` contains the shared `start-cli s9pk pack` build plumbing.
