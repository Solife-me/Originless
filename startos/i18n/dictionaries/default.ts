export const DEFAULT_LANG = 'en_US'

const dict = {
  // actions/configureOriginless.ts
  'Storage Limit': 0,
  'Maximum size of the embedded IPFS repository. Example: 200GB': 1,
  'Upload Limit': 2,
  'Maximum size accepted by /upload. Example: 5GB': 3,
  'Remote Upload Limit': 4,
  'Maximum size accepted by /remoteupload. Example: 2GB': 5,
  'Additional Authorized Public Keys': 6,
  'Optional comma or newline separated Daku public keys that may manage pins in addition to the generated keypair.': 7,
  'Configure Originless': 8,
  'Adjust storage limits and add extra Daku pin-management keys': 9,
  'Saving this action restarts the Originless service.': 10,

  // actions/getPinManagementKeys.ts
  'Get Pin Management Keys': 11,
  'Retrieve the persistent Daku keypair used to authenticate pin management requests.': 12,
  'Anyone with the private key can add or remove pins.': 13,

  // init/initializeService.ts
  'Retrieve the generated Daku keypair before you need to manage persistent pins.': 14,

  // interfaces.ts
  'Web UI': 15,
  'Browser interface for Originless uploads, examples, and status views': 16,
  'REST API': 17,
  'Programmatic Originless API endpoint': 18,
  'IPFS Peer': 19,
  'Raw TCP peer port for the embedded Kubo node': 20,

  // main.ts
  'Starting Originless': 21,
  'Originless API': 22,
  'Originless web interface is listening': 23,
  'Waiting for Originless to start listening': 24,
  'IPFS Network': 25,
  'Originless is connected to the IPFS network': 26,
  'Waiting for Originless to reach at least one IPFS peer': 27,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
