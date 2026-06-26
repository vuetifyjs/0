import { shallowRef, watch } from 'vue'

export function useToastDemo () {
  const open = shallowRef(false)
  const lazy = shallowRef(false)
  const mounts = shallowRef(0)

  function show () {
    open.value = true
  }

  function onEnter () {
    mounts.value++
  }

  // Switching strategy recreates the Presence instance, so restart the demo
  watch(lazy, () => {
    open.value = false
    mounts.value = 0
  })

  return { open, lazy, mounts, show, onEnter }
}
