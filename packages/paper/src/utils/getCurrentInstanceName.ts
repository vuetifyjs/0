import { getCurrentInstance } from 'vue'
import { toKebabCase } from './helpers'

export function getCurrentInstanceName () {
  const vm = getCurrentInstance()?.type

  return toKebabCase(vm?.name?.replace('V0', '') ?? '')
}
