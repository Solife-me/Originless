import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'originless',
  title: 'Originless',
  license: 'ISC',
  packageRepo: 'https://github.com/besoeasy/Originless',
  upstreamRepo: 'https://github.com/besoeasy/Originless',
  marketingUrl: 'https://originless.besoeasy.com',
  donationUrl: null,
  docsUrls: [
    'https://github.com/besoeasy/Originless/blob/main/README.md',
    'https://github.com/besoeasy/Originless/blob/main/api.md',
  ],
  description: { short, long },
  volumes: ['main'],
  images: {
    originless: {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
