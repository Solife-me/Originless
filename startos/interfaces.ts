import { i18n } from './i18n'
import { sdk } from './sdk'
import { appPort, peerPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const receipts = []

  const webMulti = sdk.MultiHost.of(effects, 'web')
  const webOrigin = await webMulti.bindPort(appPort, {
    protocol: 'http',
    preferredExternalPort: 80,
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n(
      'Dashboard and demo apps: shared canvas, chat, event stream, and uploads',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const api = sdk.createInterface(effects, {
    name: i18n('REST API'),
    id: 'api',
    description: i18n('Events, live updates, and IPFS upload endpoints'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  receipts.push(await webOrigin.export([ui, api]))

  const peerMulti = sdk.MultiHost.of(effects, 'peer')
  const peerOrigin = await peerMulti.bindPort(peerPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: peerPort,
    secure: { ssl: false },
  })
  const peer = sdk.createInterface(effects, {
    name: i18n('IPFS Peer'),
    id: 'peer',
    description: i18n('Raw TCP peer port for the embedded Kubo node'),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  receipts.push(await peerOrigin.export([peer]))

  return receipts
})
