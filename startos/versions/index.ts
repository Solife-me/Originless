import { VersionGraph } from '@start9labs/start-sdk'
import { v_0_0_8_0_a0 } from './v0.0.8.0.a0'
import { v_0_0_8_4 } from './v0.0.8.4'

export const versionGraph = VersionGraph.of({
  current: v_0_0_8_4,
  other: [v_0_0_8_0_a0],
})
