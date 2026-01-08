<script setup lang="ts">
  // Components
  import DocsToc from '../docs/DocsToc.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useRouterLinks } from '@/composables/useRouterLinks'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const { isOpen: isAskOpen } = useAsk()
  const { prefersReducedMotion } = useSettings()
  const page = shallowRef<{ frontmatter?: Record<string, unknown> }>()
  const mainRef = useTemplateRef<HTMLElement>('main')
  const pageTransition = toRef(() => prefersReducedMotion.value ? undefined : 'page')

  useRouterLinks(mainRef)
</script>

<template>
  <main
    id="main-content"
    ref="main"
    :class="[
      'pa-4 pb-6 ml-0 md:ml-[230px] relative z-0',
      !prefersReducedMotion && 'transition-[padding] duration-200',
      isAskOpen ? 'xl:pr-[calc(clamp(280px,calc(100vw-230px-688px-64px),500px)+32px)]' : 'xl:pr-[232px]',
    ]"
  >
    <div class="max-w-[688px] mx-auto pb-4">
      <router-view v-slot="{ Component }">
        <Transition :name="pageTransition">
          <component :is="Component" :key="$route.path" ref="page" />
        </Transition>
      </router-view>

      <DocsBackmatter :frontmatter="page?.frontmatter" />
    </div>

    <DocsToc />
  </main>
</template>

<style>
  /* Hide-on-leave: leaving element disappears instantly, entering fades in */
  .page-enter-active {
    transition: opacity 0.15s ease;
  }

  .page-enter-from {
    opacity: 0;
  }

  .page-leave-active {
    display: none;
  }
</style>
