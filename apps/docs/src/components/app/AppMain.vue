<script lang="ts" setup>
  // Components
  import DocsToc from '../docs/DocsToc.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const page = shallowRef<{ frontmatter?: Record<string, unknown> }>()
</script>

<template>
  <main class="pa-4 pb-6 ml-0 md:ml-[230px] xl:pr-[232px] relative z-0">
    <div class="max-w-[688px] mx-auto pb-4">
      <router-view v-slot="{ Component }">
        <component :is="Component" ref="page" />
      </router-view>

      <DocsBackmatter :frontmatter="page?.frontmatter" />
    </div>

    <DocsToc />
  </main>
</template>
