// Framework
import { instanceName } from '@vuetify/v0/utilities'

// Utilities
import { toKebabCase } from './helpers'

export function getCurrentInstanceName () {
  const name = instanceName()
  if (!name) return ''
  return toKebabCase(name?.replace('V0', ''))
}
