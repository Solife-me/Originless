import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_0_0_8_4 = VersionInfo.of({
  version: '0.0.8:4',
  releaseNotes: {
    en_US: 'Repackage Originless for the StartOS 0.4.0 beta SDK.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
