<script lang="ts">
  // Framework
  import { createGroupContext } from '@vuetify/v0'

  // Composables
  import { usePlaygroundFiles } from '@/composables/usePlaygroundFiles'

  // Types
  import type { ReplStore } from '@vue/repl'
  import type { GroupTicket, GroupTicketInput, GroupContext } from '@vuetify/v0'
  import type { ShallowRef } from 'vue'

  export interface PlaygroundTicketInput extends GroupTicketInput {}

  export interface PlaygroundTicket extends GroupTicket {}

  export interface PlaygroundContext extends GroupContext<PlaygroundTicketInput> {
    store: ReplStore
    isReady: ShallowRef<boolean>
  }

  export const [usePlayground, providePlayground, playgroundContext] = createGroupContext<
    PlaygroundTicketInput,
    PlaygroundTicket,
    PlaygroundContext
  >({
    namespace: 'v0:playground',
  })
</script>

<script setup lang="ts">
  const { store, isReady } = usePlaygroundFiles()

  providePlayground({
    ...playgroundContext,
    store,
    isReady,
  })
</script>

<template>
  <div class="h-screen flex flex-col">
    <slot />
  </div>
</template>
