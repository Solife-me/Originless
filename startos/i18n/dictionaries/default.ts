export const DEFAULT_LANG = 'en_US'

const dict = {
  // actions/configureOriginless.ts
  'Storage Limit': 0,
  'Soft limit for the embedded IPFS repository. Stored events are capped at a fifth of this value. Example: 20GB': 1,
  'A size such as 500MB, 20GB, or 1TB': 2,
  'Federation Peers': 3,
  'Base URLs of other Originless nodes to exchange events with. Only events are synced; uploaded files stay on the node that accepted them.': 4,
  'Must start with http:// or https://': 5,
  'Configure Originless': 6,
  'Set the storage limit and federation peers': 7,
  'Saving this action restarts the Originless service.': 8,

  // interfaces.ts
  'Web UI': 9,
  'Dashboard and demo apps: shared canvas, chat, event stream, and uploads': 10,
  'REST API': 11,
  'Events, live updates, and IPFS upload endpoints': 12,
  'IPFS Peer': 13,
  'Raw TCP peer port for the embedded Kubo node': 14,

  // main.ts
  'Starting Originless': 15,
  'Web Interface': 16,
  'The web interface is ready': 17,
  'Waiting for the IPFS node and web interface': 18,
  'IPFS Node': 19,
  'The embedded IPFS node is responding': 20,
  'The embedded IPFS node is not responding': 21,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
