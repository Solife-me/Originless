import { i18n } from '../i18n'
import { getPinManagementKeys } from '../actions/getPinManagementKeys'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { generateKeyPair } = require('daku') as {
  generateKeyPair: () => { publicKey: string; privateKey: string }
}

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  await storeJson.merge(effects, {})

  const pinManager = await storeJson.read((s) => s.pinManager).once()
  if (!pinManager?.publicKey || !pinManager?.privateKey) {
    const keys = generateKeyPair()
    await storeJson.merge(effects, {
      pinManager: {
        publicKey: keys.publicKey,
        privateKey: keys.privateKey,
      },
    })
  }

  if (kind !== 'install') return

  await sdk.action.createOwnTask(effects, getPinManagementKeys, 'important', {
    reason: i18n(
      'Retrieve the generated Daku keypair before you need to manage persistent pins.',
    ),
  })
})
