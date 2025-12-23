// Utilities
import { toKebabCase } from './helpers'
import { getCurrentInstance } from 'vue'

export function getCurrentInstanceName () {
  const vm = getCurrentInstance()?.type

  return toKebabCase(vm?.name?.replace('V0', '') ?? '')
}
