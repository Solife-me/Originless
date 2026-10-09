import { i18n } from './i18n'
import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { appPort, defaultStorageMax } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  const settings = await storeJson.read().const(effects)
  const storageMax = settings?.storageMax ?? defaultStorageMax
  const syncNodes = settings?.syncNodes ?? []

  console.info(i18n('Starting Originless'))

  const appSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'originless' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/data',
      readonly: false,
    }),
    'originless-sub',
  )

  return sdk.Daemons.of(effects)
    .addOneshot('chown', {
      subcontainer: appSub,
      exec: {
        // The image runs as `originless`; StartOS mounts the volume root-owned.
        command: [
          'sh',
          '-c',
          'mkdir -p /data/ipfs && find /data ! -user originless -exec chown -h originless:originless {} +',
        ],
        user: 'root',
      },
      requires: [],
    })
    .addOneshot('ipfs-migrate', {
      subcontainer: appSub,
      exec: {
        // Kubo refuses to start on a repository an older Kubo wrote, and the
        // upstream entrypoint does not pass --migrate. No-op when current.
        command: [
          'sh',
          '-c',
          '[ ! -f "$IPFS_PATH/config" ] || ipfs repo migrate',
        ],
        env: { IPFS_PATH: '/data/ipfs' },
      },
      requires: ['chown'],
    })
    .addDaemon('originless', {
      subcontainer: appSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          STORAGE_MAX: storageMax,
          SYNC_NODES: syncNodes.join(','),
        },
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, appPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('Waiting for the IPFS node and web interface'),
          }),
      },
      requires: ['ipfs-migrate'],
    })
    .addHealthCheck('ipfs', {
      ready: {
        display: i18n('IPFS Node'),
        fn: async () => {
          const result = await appSub.exec([
            'curl',
            '-fsS',
            `http://127.0.0.1:${appPort}/healthz`,
          ])

          if (result.exitCode === 0) {
            return {
              result: 'success',
              message: i18n('The embedded IPFS node is responding'),
            }
          }

          return {
            result: 'failure',
            message: i18n('The embedded IPFS node is not responding'),
          }
        },
      },
      requires: ['originless'],
    })
})
