<p align="center">
  <img src="icon.png" alt="Originless Logo" width="21%">
</p>

# Originless on StartOS

> Everything not listed in this document should behave the same as upstream
> Originless. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Originless](https://github.com/besoeasy/Originless) is a single-container backend for real-time web apps: signed, persistent events with live updates over Server-Sent Events, content-addressed uploads through an embedded Kubo (IPFS) node, and optional federation of events between Originless nodes.

This repository carries the upstream application source (merged from `besoeasy/Originless`) alongside the StartOS packaging in `startos/`. The image is built from the upstream `Dockerfile` unchanged.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The package builds one image from the upstream `Dockerfile` in this repository and runs it in a single subcontainer.

| Item          | Value                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------- |
| Image source  | Built locally from the upstream `Dockerfile` (`dockerBuild`), Alpine with the `kubo` package   |
| Architectures | x86_64, aarch64                                                                               |
| Entrypoint    | Upstream `entry.sh`, unchanged: starts Kubo, waits for its RPC API, then starts Originless     |
| User          | `originless` (the image's `USER`); a root `chown` oneshot runs first                           |
| Subcontainer  | `originless-sub` — runs the `chown` oneshot, the `originless` daemon, and the IPFS health check |

Kubo's RPC API (port 5001) and gateway (port 8080) stay inside the container; Originless talks to Kubo over loopback.

## Volume and Data Layout

Two volumes: `main` holds the application data, and `startos` holds package settings that nothing in the container reads.

| Volume    | Mount point | Contents                                                                                    |
| --------- | ----------- | ------------------------------------------------------------------------------------------- |
| `main`    | `/data`     | `ipfs/` — the Kubo repository (`IPFS_PATH`); `events.db` — the SQLite event store and sync checkpoints |
| `startos` | not mounted | `store.json` — the settings written by **Configure Originless**                             |

Installs that predate the upstream rewrite kept the Kubo repository at the root of `main`. The version migration moves it into `ipfs/` and moves the storage limit from `main/store.json` into the `startos` volume. A leftover `originless.db` from the old application is left in place and is unused.

## File Models

One file model, `store.json` on the `startos` volume, holding `storageMax` and `syncNodes`.

It is written only by **Configure Originless**; nothing seeds it on install, so the defaults apply until the action is saved. The values reach the application as environment variables (`STORAGE_MAX`, `SYNC_NODES`) on every start, and the upstream entrypoint re-applies `STORAGE_MAX` to Kubo's `Datastore.StorageMax` on every start — so a hand edit to Kubo's config for that key does not survive a restart. Other Kubo settings in `/data/ipfs/config` belong to the entrypoint and Kubo; the entrypoint also re-asserts `Routing.Type`, `Datastore.StorageGCWatermark` and `Datastore.GCPeriod` on every start.

## Dependencies

None.

## Network Access and Interfaces

Two hosts: the HTTP host carries the web UI and API on one port, and the peer host exposes Kubo's swarm port.

| Interface id | Type  | Port | Protocol | Purpose                                                             |
| ------------ | ----- | ---- | -------- | ------------------------------------------------------------------- |
| `ui`         | `ui`  | 3232 | HTTP     | Dashboard and demo apps (canvas, chat, event stream, uploads)       |
| `api`        | `api` | 3232 | HTTP     | Same port: `/events`, `/events/stream`, `/up`, `/upf`, `/cid/{cid}`, `/stats`, `/healthz` |
| `peer`       | `p2p` | 4001 | raw TCP  | Kubo swarm port, so other IPFS peers can connect in to fetch uploads |

Upstream Originless has no authentication: anyone who can reach port 3232 can publish events and upload files. Upstream's Docker image keeps the swarm port internal; this package exposes it as the `peer` interface.

## Installation and First-Run Flow

There is no setup step. On first start Kubo initializes a fresh repository in `/data/ipfs` with the `lowpower` profile and Originless creates `/data/events.db`. The service is usable once both health checks pass.

## Actions

One action.

**Configure Originless** — run it to change how much disk the IPFS repository may use, or to federate events with other Originless nodes.

- **What it changes:** `store.json` on the `startos` volume. Saving restarts the service, which re-applies the storage limit to Kubo.
- **Storage limit:** a soft limit for Kubo. Garbage collection runs hourly at a fixed 90% watermark, and stored events are capped at a fifth of this value; beyond that the oldest live events are evicted. Lowering it below what the repository already holds does not delete pinned data.
- **Federation peers:** base URLs (`http://` or `https://`) of other Originless nodes. Only events are exchanged, every 5 seconds; uploaded files stay on the node that accepted them. Each peer must be reachable from this server.
- **Cost:** a service restart (Kubo takes several seconds to come back).
- **Repeat safety:** idempotent.

## Tasks

None. The service is never held on a prompt.

## Health Checks

Two checks, both shown on the service dashboard.

| Check id     | Probes                                       | What a failure means                                                                                                                       |
| ------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `originless` | Port 3232 listening                          | Still starting: the entrypoint starts Originless only after Kubo's API answers, so this stays "waiting" through Kubo's startup. If it never passes, read the logs for `ipfs daemon stopped before becoming ready` or `invalid storage GC configuration` (an invalid storage limit). |
| `ipfs`       | `GET /healthz`, which queries Kubo's repo stats | Originless is up but Kubo is not answering. Usually transient; if it persists, restart the service and check the logs for Kubo errors.      |

## Backups and Restore

Both volumes are copied wholesale (`ofVolumes('main', 'startos')`): the full Kubo repository, the event database, and the package settings. A restored instance needs nothing further. Backups grow with the IPFS repository, up to the storage limit.

## Limitations and Differences

1. `PORT` is not configurable; the service always listens on 3232.
2. Uploads are not pinned (upstream behavior), so content can be garbage-collected once the repository nears the storage limit.
3. Earlier versions of this package had pin-management keys, upload size limits, Nostr media archiving and pin retention. Upstream removed them and they are gone. The old `archive` volume is no longer declared.
4. The Kubo swarm port is exposed as the `peer` interface, unlike upstream's Docker image.

---

## Quick Reference for AI Consumers

```yaml
package_id: originless
image: originless (built from the repository Dockerfile)
architectures: [x86_64, aarch64]
subcontainers: [originless-sub]
volumes:
  main: /data
  startos: (not mounted)
file_models:
  - startos/store.json
startos_managed_env_vars:
  - STORAGE_MAX
  - SYNC_NODES
dependencies: none
interfaces:
  ui: { type: ui, port: 3232 }
  api: { type: api, port: 3232 }
  peer: { type: p2p, port: 4001 }
actions:
  - configure-originless
tasks: []
health_checks:
  - originless
  - ipfs
```
