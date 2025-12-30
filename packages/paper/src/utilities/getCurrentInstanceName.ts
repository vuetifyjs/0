// Utilities
import { instanceName } from '#v0/utilities'
import { toKebabCase } from './helpers'

export function getCurrentInstanceName () {
  const name = instanceName()
  if (!name) return ''
  return toKebabCase(name?.replace('V0', ''))
}
