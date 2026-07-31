import { useHotkey, useToggleScope } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'
import { computed, shallowRef, watch } from 'vue'

import type { InjectionKey } from 'vue'

export interface Command {
  id: string
  label: string
  icon: string
  hotkey: string
  action: () => void
}

const isMac = IN_BROWSER && navigator.userAgent.includes('Mac')

export function useCommandPalette () {
  const isOpen = shallowRef(false)
  const query = shallowRef('')
  const selectedIndex = shallowRef(0)
  const lastAction = shallowRef('')

  const modKey = isMac ? '⌘' : 'Ctrl'

  function run (label: string) {
    lastAction.value = label
    isOpen.value = false
  }

  const commands: Command[] = [
    { id: 'theme', label: 'Toggle theme', icon: 'i-mdi-brightness-6', hotkey: 'l', action: () => run('Toggled theme') },
    { id: 'search', label: 'Search docs', icon: 'i-mdi-magnify', hotkey: 's', action: () => run('Opened search') },
    { id: 'home', label: 'Go to home', icon: 'i-mdi-home', hotkey: 'h', action: () => run('Navigated home') },
    { id: 'github', label: 'View on GitHub', icon: 'i-mdi-github', hotkey: 'g', action: () => run('Opened GitHub') },
    { id: 'copy', label: 'Copy link', icon: 'i-mdi-link', hotkey: 'c', action: () => run('Copied link') },
    { id: 'feedback', label: 'Send feedback', icon: 'i-mdi-message-outline', hotkey: 'f', action: () => run('Opened feedback') },
  ]

  const filtered = computed(() =>
    commands.filter(command => command.label.toLowerCase().includes(query.value.toLowerCase())),
  )

  // Global combination — open the palette from anywhere.
  useHotkey('cmd+j', () => {
    isOpen.value = true
  })

  // Global sequences — press the keys in order (GitHub-style) without opening the palette.
  useHotkey('g-h', () => run('Navigated home'))
  useHotkey('g-s', () => run('Opened search'))

  // Scoped shortcuts — registered only while the palette is open, torn down on close.
  useToggleScope(isOpen, () => {
    for (const command of commands) {
      useHotkey(`cmd+${command.hotkey}`, command.action, { inputs: true })
    }

    useHotkey('arrowdown', () => {
      selectedIndex.value = (selectedIndex.value + 1) % filtered.value.length
    }, { inputs: true })

    useHotkey('arrowup', () => {
      selectedIndex.value = (selectedIndex.value - 1 + filtered.value.length) % filtered.value.length
    }, { inputs: true })

    useHotkey('enter', () => filtered.value[selectedIndex.value]?.action(), { inputs: true })
  })

  watch(isOpen, open => {
    if (!open) return
    query.value = ''
    selectedIndex.value = 0
  })

  watch(filtered, () => {
    selectedIndex.value = 0
  })

  return { isOpen, query, selectedIndex, lastAction, modKey, commands, filtered }
}

export type CommandPalette = ReturnType<typeof useCommandPalette>

export const PALETTE_KEY: InjectionKey<CommandPalette> = Symbol('command-palette')
