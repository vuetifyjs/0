<script lang="ts" setup>
  // Framework
  import { useBreakpoints, useDocumentEventListener } from '@vuetify/v0'

  // Components
  import DocsDiscoveryStep from '@/components/docs/DocsDiscoveryStep.vue'
  import DocsKbd from '@/components/docs/DocsKbd.vue'

  // Composables
  import { useAskSheet } from '@/composables/useAskSheet'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  const breakpoints = useBreakpoints()
  const search = useSearch()
  const settings = useSettings()
  const sheet = useAskSheet()

  function nextOnEnter (next: () => void) {
    return useDocumentEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') next()
    })
  }

  function nextOnEnterWithBlock (next: () => void) {
    return useDocumentEventListener('keydown', (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'Escape'].includes(event.key)) {
        event.preventDefault()
        event.stopPropagation()
      }
      if (event.key === 'Enter') next()
    })
  }

  function nextOnCloseKeys (next: () => void) {
    return useDocumentEventListener('keydown', (event: KeyboardEvent) => {
      if (['Escape', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        sheet.close()
        next()
      }
    })
  }
</script>

<template>
  <!-- Step 1 -->
  <DocsDiscoveryStep
    :enter="() => {
      search.close()
      settings.close()
    }"
    hint="Look for the search icon in the top navigation bar"
    :next-when="search.isOpen"
    step="open-search"
    title="Open the Search"
  >
    Press <DocsKbd>Ctrl+K</DocsKbd> (or <DocsKbd>Cmd+K</DocsKbd> on Mac) to open the search dialog. You can also click the search button in the header.
  </DocsDiscoveryStep>

  <!-- Step 2 -->
  <DocsDiscoveryStep
    :enter="() => {
      search.open()
      search.focus()
    }"
    hint="The search uses fuzzy matching, so partial words work too"
    :leave="() => search.close()"
    :next-on="nextOnEnterWithBlock"
    step="search-tabs"
    title="Search for something"
  >
    Type <DocsKbd>Tabs</DocsKbd> in the search box to find the Tabs component documentation and then press <DocsKbd>Enter</DocsKbd>.
  </DocsDiscoveryStep>

  <!-- Step 3 -->
  <DocsDiscoveryStep
    hint="Ask AI knows the content of the current page and can answer questions about it"
    :next-on="nextOnEnter"
    :next-when="() => sheet.isOpen.value"
    placement="top"
    step="ask-ai"
    title="Open Ask AI"
  >
    Press <DocsKbd>Ctrl+/</DocsKbd> (or <DocsKbd>Cmd+/</DocsKbd> on Mac) to open Ask AI, or click the input at the bottom of the page
  </DocsDiscoveryStep>

  <!-- Step 4 -->
  <DocsDiscoveryStep
    :enter="() => sheet.open()"
    :leave="() => sheet.close()"
    :next-when="() => !sheet.isOpen.value"
    :offset="[-32, 0]"
    placement="x-start"
    step="ask-ai-close"
    text="Click the close button to dismiss the Ask AI panel."
    title="Close Ask AI"
  />

  <!-- Step 5 -->
  <DocsDiscoveryStep
    hint="Your conversation persists until you clear it or refresh the page"
    :next-when="sheet.isOpen"
    placement="top"
    step="ask-ai-reopen"
    text="Click the Ask AI input at the bottom to bring back your conversation. Notice it remembers what you discussed!"
    title="Reopen Ask AI"
  />

  <!-- Step 6 -->
  <DocsDiscoveryStep
    :enter="() => sheet.open()"
    hint="Vuetify Bin creates a shareable link to your conversation"
    :leave="() => sheet.close()"
    :next-on="nextOnCloseKeys"
    :next-when="() => !sheet.isOpen.value"
    placement="x-start"
    step="ask-ai-options"
    text="Notice the toolbar buttons: save to Vuetify Bin for sharing, copy the conversation, or reset to start fresh. Click the close button to dismiss the Ask AI panel."
    title="Explore save options"
  />

  <!-- Step 7 -->
  <DocsDiscoveryStep
    hint="Skill filters change the visible navigation items"
    :next-when="() => settings.isOpen.value"
    :offset="[-32, 0]"
    placement="bottom left"
    step="open-settings"
    text="Click the settings button in the header to open the Settings panel."
    title="Open Settings"
  />

  <!-- Step 8 -->
  <DocsDiscoveryStep
    :enter="() => settings.open()"
    hint="Try toggling levels to see how navigation updates"
    :leave="() => settings.close()"
    :placement="breakpoints.mdAndUp.value ? 'left' : 'top'"
    step="skill-level"
    text="Select one or more skill levels to filter documentation by complexity. Beginner shows fundamentals, Advanced reveals in-depth content."
    title="Adjust your skill level"
  />
</template>
