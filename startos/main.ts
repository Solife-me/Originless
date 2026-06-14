import { i18n } from './i18n'
import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import {
  appPort,
  combineAllowedUsers,
  defaultFileLimit,
  defaultRemoteFileLimit,
  defaultStorageMax,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  const storageMax =
    (await storeJson.read((s) => s.storageMax).const(effects)) ??
    defaultStorageMax
  const fileLimit =
    (await storeJson.read((s) => s.fileLimit).const(effects)) ??
    defaultFileLimit
  const remoteFileLimit =
    (await storeJson.read((s) => s.remoteFileLimit).const(effects)) ??
    defaultRemoteFileLimit
  const publicKey =
    (await storeJson.read((s) => s.pinManager.publicKey).const(effects)) ?? ''
  const additionalAllowedUsers =
    (await storeJson.read((s) => s.additionalAllowedUsers).const(effects)) ?? []
  const allowedUsers = combineAllowedUsers(publicKey, additionalAllowedUsers)

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
    .addDaemon('originless', {
      subcontainer: appSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          STORAGE_MAX: storageMax,
          FILE_LIMIT: fileLimit,
          REMOTE_FILE_LIMIT: remoteFileLimit,
          ALLOWED_USERS: allowedUsers.join(','),
        },
      },
      ready: {
        display: i18n('Originless API'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, appPort, {
            successMessage: i18n('Originless web interface is listening'),
            errorMessage: i18n('Waiting for Originless to start listening'),
          }),
      },
      requires: [],
    })
    .addHealthCheck('ipfs-network', {
      ready: {
        display: i18n('IPFS Network'),
        fn: async () => {
          const result = await appSub.exec([
            'curl',
            '-fsS',
            `http://127.0.0.1:${appPort}/health`,
          ])

          if (result.exitCode === 0) {
            return {
              result: 'success',
              message: i18n('Originless is connected to the IPFS network'),
            }
          }

          return {
            result: 'loading',
            message: i18n(
              'Waiting for Originless to reach at least one IPFS peer',
            ),
          }
        },
      },
      requires: ['originless'],
    })
})
