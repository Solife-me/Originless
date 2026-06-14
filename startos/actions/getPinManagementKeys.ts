import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const getPinManagementKeys = sdk.Action.withoutInput(
  'get-pin-management-keys',
  {
    name: i18n('Get Pin Management Keys'),
    description: i18n(
      'Retrieve the persistent Daku keypair used to authenticate pin management requests.',
    ),
    warning: i18n('Anyone with the private key can add or remove pins.'),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  async ({ effects }) => {
    const store = await storeJson.read().once()

    return {
      version: '1',
      title: 'Originless Pin Management',
      message:
        'Use this Daku keypair to authenticate requests to /pin/add, /pin/list, and /pin/remove.',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Public Key',
            description: 'Configure additional clients with this public key.',
            value: store?.pinManager?.publicKey ?? 'UNAVAILABLE',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Private Key',
            description:
              'Store this somewhere safe. It signs Daku auth tokens.',
            value: store?.pinManager?.privateKey ?? 'UNAVAILABLE',
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
