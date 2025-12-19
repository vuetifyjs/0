import { useStorage, useTheme } from '@vuetify/v0'
import { toRef, watch } from 'vue'

export function useThemeToggle () {
  const theme = useTheme()
  const storage = useStorage()

  const icon = toRef(() => theme.isDark.value ? 'theme-light' : 'theme-dark')

  function toggle () {
    theme.cycle(['light', 'dark'])
  }

  watch(() => theme.selectedId.value, id => {
    storage.set('theme', id)
  })

  return {
    theme,
    icon,
    toggle,
    isDark: theme.isDark,
  }
}
