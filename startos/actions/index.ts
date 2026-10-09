import { sdk } from '../sdk'
import { configureOriginless } from './configureOriginless'

export const actions = sdk.Actions.of().addAction(configureOriginless)
