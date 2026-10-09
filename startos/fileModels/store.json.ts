import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { defaultStorageMax } from '../utils'

const shape = z.looseObject({
  storageMax: z.string().catch(defaultStorageMax),
  syncNodes: z.array(z.string()).catch([]),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: 'store.json' },
  shape,
)
