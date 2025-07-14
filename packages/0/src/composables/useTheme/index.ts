// Composables
import { useRegistrar } from '#v0/composables/useRegistrar'
import { useContext } from '#v0/composables/useContext'

// Utilities
import { computed, nextTick, shallowRef, toRef, toValue, watch } from 'vue'

// Adapters
import { V0ThemeAdapter, type ThemeAdapter } from './adapters'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { RegistrarContext, RegistrarItem, RegistrarTicket } from '#v0/composables/useRegistrar'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Ref } from 'vue'

export interface Colors {
  [key: string]: string
}

export interface ThemeItem extends RegistrarItem {
  dark: boolean
  colors: Colors
}

export interface ThemeTicket extends RegistrarTicket {
  dark: boolean
  colors: Colors
  toggle: () => void
}

export interface ThemeContext extends RegistrarContext<ThemeTicket, ThemeItem> {
  styles: ComputedRef<string>
  selectedId: Ref<ID>
  selectedItem: ComputedRef<ThemeItem | undefined>
  selectedColors: ComputedRef<Colors | undefined>
  cycle: (themeArray: ID[]) => void
  select: (name: ID) => void
  toggle: (themeArray: [ID, ID]) => void
}

export interface ThemePluginOptions {
  adapter?: ThemeAdapter
}

export function createTheme<T extends ThemeContext> (namespace: string) {
  const [, provideThemeContext, registrar] = useRegistrar<ThemeTicket, T>(namespace)

  const selectedId = shallowRef()
  let initialValue: unknown = null

  const selectedItem = computed(() => registrar.registeredItems.get(selectedId.value))
  const selectedColors = computed(() => selectedItem.value?.colors)
  const themeNames = computed(() => Array.from(registrar.registeredItems.keys()))

  function select (value: ID) {
    if (!registrar.registeredItems.has(value)) {
      console.warn(`Theme "${value}" is not registered.`)

      return
    }

    selectedId.value = value
  }

  function cycle (themeArray: ID[] = themeNames.value) {
    const currentIndex = themeArray.indexOf(selectedId.value)
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeArray.length

    select(themeArray[nextIndex])
  }

  function toggle (themeArray: [ID, ID]) {
    cycle(themeArray)
  }

  const register: typeof registrar.register = registration => {
    const ticket = registrar.register(registrant => {
      const item = registrar.intake(registrant, registration)

      return {
        isActive: toRef(() => selectedId.value === registrant.id),
        toggle: () => select(registrant.id),
        ...item,
      }
    })

    if (initialValue != null && initialValue === ticket.id) {
      selectedId.value = ticket.id
    }

    return ticket
  }

  const context = {
    ...registrar,
    selectedId,
    selectedItem,
    selectedColors,
    register,
    select,
    cycle,
    toggle,
  } as T

  return [
    function (
      model?: Ref<ID>,
      _context: T = context,
      app?: App,
    ) {
      let isUpdatingModel = false

      if (model) {
        initialValue = toValue(model)

        watch(selectedId, () => {
          if (isUpdatingModel || !selectedItem.value) return

          model.value = selectedItem.value.id
        })

        watch(model, value => {
          if (isUpdatingModel) return

          selectedId.value = value
        })

        watch([model, selectedId], async () => {
          isUpdatingModel = true

          await nextTick()

          isUpdatingModel = false
        })
      }

      provideThemeContext(_context, app)

      return _context
    },
    context,
  ] as const
}

export function useTheme (): ThemeContext {
  return useContext<ThemeContext>('v0:theme')[0]()
}

export function createThemePlugin (options: ThemePluginOptions = {}) {
  return {
    install (app: App) {
      const { adapter = new V0ThemeAdapter() } = options
      const [provideThemeContext, themeContext] = createTheme<ThemeContext>('v0:theme')

      function updateStyles (colors: Colors | undefined) {
        if (!colors) return

        adapter.update(colors)
      }

      if (IN_BROWSER) {
        watch(themeContext.selectedColors, updateStyles, { immediate: true, deep: true })
      } else {
        updateStyles(themeContext.selectedColors.value)
      }

      app.runWithContext(() => {
        provideThemeContext(undefined, undefined, app)
      })
    },
  }
}
