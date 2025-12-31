<script setup lang="ts">
  // Components
  import DocsToc from '../docs/DocsToc.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'

  // Utilities
  import { shallowRef } from 'vue'

  const { isOpen: isAskOpen } = useAsk()
  const page = shallowRef<{ frontmatter?: Record<string, unknown> }>()
</script>

<template>
  <main
    :class="[
      'pa-4 pb-6 ml-0 md:ml-[230px] relative z-0',
      isAskOpen ? 'md:pr-[382px]' : 'xl:pr-[232px]',
    ]"
  >
    <div class="max-w-[688px] mx-auto pb-4">
      <router-view v-slot="{ Component }">
        <component :is="Component" ref="page" />
      </router-view>

      <DocsBackmatter :frontmatter="page?.frontmatter" />
    </div>

    <DocsToc />
  </main>
</template>
