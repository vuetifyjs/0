// Framework
import { useTheme } from '@vuetify/v0'

// Components
import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

// Composables
import { useThemeToggle } from '@/composables/useThemeToggle'

// Utilities
import { shallowRef, toRef, watch } from 'vue'

// Data
import { createMainTs } from '@/data/playground-defaults'

const committed = shallowRef<string>()
const preview = shallowRef<string>()

export function usePlaygroundTheme () {
  const theme = useTheme()
  const toggle = useThemeToggle()
  const playground = usePlayground()
  const store = playground.store

  const names = toRef(() => theme.keys())
  const active = toRef(() => preview.value ?? committed.value ?? toggle.preference.value)
  const hasOverride = toRef(() => !!committed.value)

  const sandboxTheme = toRef(() => {
    if (!committed.value && !preview.value) return theme.isDark.value ? 'dark' : 'light'
    const ticket = theme.get(active.value)
    return ticket?.dark ? 'dark' : 'light'
  })

  watch(active, value => {
    const main = store.files['src/main.ts']
    if (!main) return
    main.code = createMainTs(value)
  })

  function onTheme (name: string) {
    committed.value = committed.value === name ? undefined : name
    preview.value = undefined
  }

  function onReset () {
    committed.value = undefined
    preview.value = undefined
  }

  function onPreview (name: string) {
    preview.value = name
  }

  function onPreviewReset () {
    preview.value = undefined
  }

  return {
    names,
    active,
    committed,
    hasOverride,
    sandboxTheme,
    onTheme,
    onReset,
    onPreview,
    onPreviewReset,
  }
}
