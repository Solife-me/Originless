import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'originless',
  title: 'Originless',
  license: 'ISC',
  packageRepo: 'https://github.com/Solife-me/Originless',
  upstreamRepo: 'https://github.com/besoeasy/Originless',
  marketingUrl: 'https://github.com/besoeasy/Originless',
  donationUrl: null,
  preDownloadAlert: {
    message: {
      en_US:
        'Originless 1.0.7 is a rewrite. **Pin management keys, upload size limits, Nostr archiving, and pin retention are removed**, and new uploads are not pinned, so they can be garbage-collected. Your IPFS repository and storage limit are kept. Back up this service before updating.',
    },
    when: { sourceVersion: '<1.0.7:0' },
  },
  description: { short, long },
  volumes: ['main', 'startos'],
  images: {
    originless: {
      source: {
        // Keep VERSION in step with startos/versions/current.ts.
        dockerBuild: { buildArgs: { VERSION: '1.0.7' } },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
