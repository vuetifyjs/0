<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useRouterLinks } from '@/composables/useRouterLinks'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, onBeforeUnmount, onMounted, shallowRef, toRef, useTemplateRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Components
  import DocsToc from '../docs/DocsToc.vue'
  import DocsPageLogo from '../docs/meta/DocsPageLogo.vue'

  const ask = useAsk()
  const route = useRoute()
  const settings = useSettings()
  const page = shallowRef<{ frontmatter?: Record<string, unknown> }>()
  const mainRef = useTemplateRef<HTMLElement>('main')
  const pageTransition = toRef(() => settings.prefersReducedMotion.value ? undefined : 'page')

  const TOC_SELECTOR = 'h2[id]:not([data-discovery-title]), h3[id]:not([data-discovery-title]), h4[id]:not([data-discovery-title])'
  const hasToc = shallowRef(false)
  let mutationObserver: MutationObserver | null = null

  function rescanToc () {
    if (!IN_BROWSER) return
    hasToc.value = document.querySelector(TOC_SELECTOR) !== null
  }

  watch(() => route.path, () => {
    hasToc.value = false
    if (!IN_BROWSER) return
    // The page mounts async via <router-view> + Transition. Poll across a few
    // frames to catch headings that arrive after the transition finishes.
    let tries = 0
    function tick () {
      rescanToc()
      tries++
      if (!hasToc.value && tries < 20) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  onMounted(() => {
    rescanToc()
    mutationObserver = new MutationObserver(rescanToc)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    mutationObserver?.disconnect()
    mutationObserver = null
  })

  function onLeave (_el: Element, done: () => void) {
    done()
  }

  useRouterLinks(mainRef)

  // Extract page metadata from frontmatter
  const pageTitle = toRef(() => page.value?.frontmatter?.title as string | undefined)
  const pageMeta = toRef(() => page.value?.frontmatter?.meta as Array<{ name?: string, content?: string }> | undefined)
  const pageDescription = computed(() => pageMeta.value?.find(m => m.name === 'description')?.content)

  // Per-page OG image based on route path
  const ogImage = toRef(() => {
    const path = route.path === '/' ? '/index' : route.path
    return `https://0.vuetifyjs.com/og${path}.png`
  })

  // JSON-LD structured data
  const jsonLd = computed(() => {
    const schemas: Record<string, unknown>[] = []

    if (pageTitle.value) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': pageTitle.value,
        'description': pageDescription.value ?? '',
        'url': `https://0.vuetifyjs.com${route.path}`,
        'author': { '@type': 'Organization', 'name': 'Vuetify' },
        'publisher': { '@type': 'Organization', 'name': 'Vuetify' },
        'image': ogImage.value,
      })
    }

    return schemas
  })

  // Set page-level meta from frontmatter (reactive)
  // InferSeoMetaPlugin auto-generates og:title and og:description
  useHead({
    title: pageTitle,
    meta: toRef(() => {
      const meta: Array<Record<string, string>> = []
      if (pageDescription.value) {
        meta.push({ key: 'description', name: 'description', content: pageDescription.value })
      }
      meta.push({ key: 'og:image', property: 'og:image', content: ogImage.value })
      return meta
    }),
    script: toRef(() => jsonLd.value.map(schema => ({
      key: `jsonld-${schema['@type']}`,
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema),
    }))),
  })
</script>

<template>
  <main
    id="main-content"
    ref="main"
    :class="[
      'pa-6 ms-0 md:ms-[230px] relative z-0',
      !settings.prefersReducedMotion.value && 'transition-[padding] duration-200',
      'data-[has-toc]:xl:pe-[232px]',
      'data-[ask-open]:xl:pe-[calc(clamp(280px,calc(100vw-230px-730px-64px),500px)+32px)]',
    ]"
    :data-ask-open="ask.isOpen.value || undefined"
    :data-has-toc="!ask.isOpen.value && hasToc || undefined"
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
  </main>
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
