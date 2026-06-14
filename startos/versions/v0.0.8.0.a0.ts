import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_0_0_8_0_a0 = VersionInfo.of({
  version: '0.0.8:0-alpha.0',
  releaseNotes: {
    en_US: 'Initial StartOS package for Originless',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
