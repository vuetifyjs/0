<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Components
  import DocsToc from '../docs/DocsToc.vue'
  import DocsPageLogo from '../docs/meta/DocsPageLogo.vue'

  // Composables
  import { useAskSheet } from '@/composables/useAskSheet'
  import { useRouterLinks } from '@/composables/useRouterLinks'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, shallowRef, toRef, useTemplateRef } from 'vue'

  const { isOpen: isAskOpen } = useAskSheet()
  const { prefersReducedMotion } = useSettings()
  const page = shallowRef<{ frontmatter?: Record<string, unknown> }>()
  const mainRef = useTemplateRef<HTMLElement>('main')
  const pageTransition = toRef(() => prefersReducedMotion.value ? undefined : 'page')

  useRouterLinks(mainRef)

  // Extract page metadata from frontmatter
  const pageTitle = computed(() => page.value?.frontmatter?.title as string | undefined)
  const pageMeta = computed(() => page.value?.frontmatter?.meta as Array<{ name?: string, content?: string }> | undefined)
  const pageDescription = computed(() => pageMeta.value?.find(m => m.name === 'description')?.content)

  // Set page-level meta from frontmatter (reactive)
  // InferSeoMetaPlugin auto-generates og:title and og:description
  useHead({
    title: pageTitle,
    meta: computed(() => pageDescription.value
      ? [{ key: 'description', name: 'description', content: pageDescription.value }]
      : [],
    ),
  })
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
      <DocsPageLogo :frontmatter="page?.frontmatter" />

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
