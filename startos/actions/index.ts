import { sdk } from '../sdk'
import { configureOriginless } from './configureOriginless'
import { getPinManagementKeys } from './getPinManagementKeys'

export const actions = sdk.Actions.of()
  .addAction(configureOriginless)
  .addAction(getPinManagementKeys)
