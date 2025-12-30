// Utilities
import * as Vue from 'vue'

export function instanceExists () {
  if (Vue.version.startsWith('3.6.')) {
    // @ts-expect-error type is not defined in 3.6.0-beta.1
    return Vue.currentInstance !== null
  }
  return Vue.getCurrentInstance() !== null
}

export function instanceName () {
  if (Vue.version.startsWith('3.6.')) {
    // @ts-expect-error type is not defined in 3.6.0-beta.1
    return Vue.currentInstance?.type?.name
  }
  return Vue.getCurrentInstance()?.type?.name
}
