<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useRouterLinks } from '@/composables/useRouterLinks'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, shallowRef, toRef, useTemplateRef } from 'vue'

  // Components
  import DocsToc from '../docs/DocsToc.vue'
  import DocsPageLogo from '../docs/meta/DocsPageLogo.vue'

  const ask = useAsk()
  const settings = useSettings()
  const page = shallowRef<{ frontmatter?: Record<string, unknown> }>()
  const mainComponent = useTemplateRef<{ $el: HTMLElement }>('main')
  const mainRef = toRef(() => mainComponent.value?.$el)
  const pageTransition = toRef(() => settings.prefersReducedMotion.value ? undefined : 'page')

  function onLeave (_el: Element, done: () => void) {
    done()
  }

  useRouterLinks(mainRef)

  // Extract page metadata from frontmatter
  const pageTitle = toRef(() => page.value?.frontmatter?.title as string | undefined)
  const pageMeta = toRef(() => page.value?.frontmatter?.meta as Array<{ name?: string, content?: string }> | undefined)
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
  <HxAppMain
    id="main-content"
    ref="main"
    :class="[
      'pa-4 pb-6 z-0',
      !settings.prefersReducedMotion.value && 'transition-[padding] duration-200',
      ask.isOpen.value ? 'xl:pe-[calc(clamp(280px,calc(100vw-230px-730px-64px),500px)+32px)]' : 'xl:pe-[232px]',
    ]"
  >
    <div class="max-w-[730px] mx-auto pb-4">
      <DocsPageLogo :frontmatter="page?.frontmatter" />

      <router-view v-slot="{ Component }">
        <Transition
          :css="!!pageTransition"
          :name="pageTransition"
          @leave="onLeave"
        >
          <component :is="Component" :key="$route.path" ref="page" />
        </Transition>
      </router-view>

      <DocsBackmatter :frontmatter="page?.frontmatter" />
    </div>

    <DocsToc />
  </HxAppMain>
</template>

<style>
  /* Enter fade, leave is handled by JS hook (display:none breaks transitionend) */
  .page-enter-active {
    transition: opacity 0.15s ease;
  }

  .page-enter-from {
    opacity: 0;
  }
</style>
