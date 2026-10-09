import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { defaultStorageMax, normalizeSizeString } from '../utils'

const { InputSpec, Value, List } = sdk

const inputSpec = InputSpec.of({
  storageMax: Value.text({
    name: i18n('Storage Limit'),
    description: i18n(
      'Soft limit for the embedded IPFS repository. Stored events are capped at a fifth of this value. Example: 20GB',
    ),
    default: defaultStorageMax,
    required: true,
    patterns: [
      {
        regex: '\\s*\\d+(\\.\\d+)?\\s*[KkMmGgTt]?[Bb]\\s*',
        description: i18n('A size such as 500MB, 20GB, or 1TB'),
      },
    ],
  }),
  syncNodes: Value.list(
    List.text(
      {
        name: i18n('Federation Peers'),
        description: i18n(
          'Base URLs of other Originless nodes to exchange events with. Only events are synced; uploaded files stay on the node that accepted them.',
        ),
        default: [],
      },
      {
        placeholder: 'https://originless.example.com',
        patterns: [
          {
            regex: 'https?://\\S+',
            description: i18n('Must start with http:// or https://'),
          },
        ],
      },
    ),
  ),
})

export const configureOriginless = sdk.Action.withInput(
  'configure-originless',
  {
    name: i18n('Configure Originless'),
    description: i18n('Set the storage limit and federation peers'),
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
      syncNodes: store?.syncNodes ?? [],
    }
  },
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      storageMax: normalizeSizeString(input.storageMax),
      syncNodes: [
        ...new Set(input.syncNodes.map((node) => node.trim()).filter(Boolean)),
      ],
    })
  },
)
