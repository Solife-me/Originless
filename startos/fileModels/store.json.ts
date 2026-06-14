import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import {
  defaultFileLimit,
  defaultRemoteFileLimit,
  defaultStorageMax,
} from '../utils'

const pinManagerShape = z.object({
  publicKey: z.string().catch(''),
  privateKey: z.string().catch(''),
})

const shape = z.object({
  storageMax: z.string().catch(defaultStorageMax),
  fileLimit: z.string().catch(defaultFileLimit),
  remoteFileLimit: z.string().catch(defaultRemoteFileLimit),
  additionalAllowedUsers: z.array(z.string()).catch([]),
  pinManager: pinManagerShape.catch(() => pinManagerShape.parse({})),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
