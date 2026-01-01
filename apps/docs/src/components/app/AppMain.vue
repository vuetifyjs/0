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
    id="main-content"
    :class="[
      'pa-4 pb-6 ml-0 md:ml-[230px] relative z-0 transition-[padding] duration-200',
      isAskOpen ? 'xl:pr-[calc(clamp(280px,calc(100vw-230px-688px-64px),500px)+32px)]' : 'xl:pr-[232px]',
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
