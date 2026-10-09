# Originless

## Documentation

- [Originless README](https://github.com/besoeasy/Originless/blob/main/README.md) — the upstream overview: events, uploads, federation, and configuration
- [Originless API reference](https://github.com/besoeasy/Originless/blob/main/docs/api.md) — every endpoint with request and response formats

## What you get on StartOS

- **Web UI** — the Originless dashboard, with live demos (a shared canvas, chat, an event stream) and an upload page.
- **REST API** — the same address your apps call to publish and stream signed events and to upload files and folders to IPFS.
- **IPFS Peer** — the embedded IPFS node's peer port, so other IPFS nodes can connect in and fetch what you upload.

Your IPFS data and event history are kept on the server and included in backups.

## Getting set up

1. Start the service and wait for both health checks to turn green. The IPFS node takes a few seconds to start.
2. Open the **Web UI** interface to see the dashboard.
3. Optional: run **Configure Originless** to change the storage limit or add federation peers.

## Using Originless

### Access

Originless has no accounts, passwords, or API keys. Anyone who can reach the Web UI or REST API address can publish events and upload files, so only share that address with people and apps you trust.

### Uploads

Uploads are not pinned. When the IPFS storage nears its limit, older content can be cleared out, so treat uploaded files as temporary unless you pin them elsewhere.

### Configure Originless

- **Storage Limit** — how much disk the IPFS storage may use. Stored events can use up to a fifth of it; past that, the oldest events are removed.
- **Federation Peers** — addresses of other Originless nodes. Your node and each peer exchange events every few seconds. Uploaded files are not shared between nodes.

Saving restarts the service.
