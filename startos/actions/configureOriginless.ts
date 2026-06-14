import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import {
  defaultFileLimit,
  defaultRemoteFileLimit,
  defaultStorageMax,
  normalizeAllowedUsers,
  normalizeSizeString,
} from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  storageMax: Value.text({
    name: i18n('Storage Limit'),
    description: i18n(
      'Maximum size of the embedded IPFS repository. Example: 200GB',
    ),
    default: defaultStorageMax,
    required: true,
  }),
  fileLimit: Value.text({
    name: i18n('Upload Limit'),
    description: i18n('Maximum size accepted by /upload. Example: 5GB'),
    default: defaultFileLimit,
    required: true,
  }),
  remoteFileLimit: Value.text({
    name: i18n('Remote Upload Limit'),
    description: i18n('Maximum size accepted by /remoteupload. Example: 2GB'),
    default: defaultRemoteFileLimit,
    required: true,
  }),
  additionalAllowedUsers: Value.text({
    name: i18n('Additional Authorized Public Keys'),
    description: i18n(
      'Optional comma or newline separated Daku public keys that may manage pins in addition to the generated keypair.',
    ),
    default: '',
    required: false,
  }),
})

export const configureOriginless = sdk.Action.withInput(
  'configure-originless',
  {
    name: i18n('Configure Originless'),
    description: i18n(
      'Adjust storage limits and add extra Daku pin-management keys',
    ),
    warning: i18n('Saving this action restarts the Originless service.'),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async ({ effects }) => {
    const store = await storeJson.read().once()

    return {
      storageMax: store?.storageMax ?? defaultStorageMax,
      fileLimit: store?.fileLimit ?? defaultFileLimit,
      remoteFileLimit: store?.remoteFileLimit ?? defaultRemoteFileLimit,
      additionalAllowedUsers: store?.additionalAllowedUsers?.join('\n') ?? '',
    }
  },
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      storageMax: normalizeSizeString(input.storageMax),
      fileLimit: normalizeSizeString(input.fileLimit),
      remoteFileLimit: normalizeSizeString(input.remoteFileLimit),
      additionalAllowedUsers: normalizeAllowedUsers(
        input.additionalAllowedUsers ?? '',
      ),
    })
  },
)
