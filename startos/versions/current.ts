import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { mkdir, readdir, readFile, rename, rm } from 'node:fs/promises'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

// Entries in the main volume that are not part of a pre-1.0.7 Kubo repository,
// which lived at the volume root.
const notIpfsRepo = new Set([
  'ipfs',
  'events.db',
  'events.db-wal',
  'events.db-shm',
  'store.json',
  'originless.db',
  'originless.db-wal',
  'originless.db-shm',
  '.originless-user-v1',
])

export const current = VersionInfo.of({
  version: '1.0.7:0',
  releaseNotes: {
    en_US:
      'Updates Originless to 1.0.7, a rewrite of the service as a backend for real-time web apps: signed, persistent events with live updates, IPFS file and folder uploads, and optional federation with other Originless nodes. Pin management keys, upload size limits, Nostr archiving, and pin retention are gone, and uploads are no longer pinned. The existing IPFS repository and storage limit are kept. Built with Start SDK 3.0.3 and requires StartOS 0.4.0.2 or later.',
  },
  migrations: {
    up: async ({ effects }) => {
      const main = sdk.volumes.main

      // Package settings moved from the data volume to the `startos` volume.
      // Only the storage limit still applies; the rest (including the old pin
      // management keypair) is dropped.
      const legacyStore = await readFile(main.subpath('store.json'), 'utf8')
        .then((raw) => JSON.parse(raw) as { storageMax?: unknown })
        .catch(() => null)
      if (legacyStore) {
        if (typeof legacyStore.storageMax === 'string') {
          await storeJson.merge(effects, {
            storageMax: legacyStore.storageMax,
          })
        }
        await rm(main.subpath('store.json'), { force: true })
      }
      await rm(main.subpath('.originless-user-v1'), { force: true })

      // Originless 1.0.7 keeps the Kubo repository in /data/ipfs (IPFS_PATH)
      // rather than at the volume root.
      const entries = await readdir(main.path)
      const relocated = await readdir(main.subpath('ipfs'))
        .then((inner) => inner.includes('config'))
        .catch(() => false)
      if (entries.includes('config') && !relocated) {
        await mkdir(main.subpath('ipfs'), { recursive: true })
        for (const entry of entries) {
          if (notIpfsRepo.has(entry)) continue
          await rename(main.subpath(entry), main.subpath(`ipfs/${entry}`))
        }
      }
    },
    down: IMPOSSIBLE,
  },
})
