<script lang="ts">
  // Framework
  import { OnyxStyleSheetAdapter, themes } from '@paper/onyx'

  // Context
  import { icons } from './icons'
  import { pages, groups } from './nav'

  // Utilities
  import { defineAsyncComponent } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  // Types
  import type { Component } from 'vue'

  const modules = import.meta.glob<{ default: Component }>('./pages/*.vue')

  function toPascal (slug: string) {
    return slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnyxDocs' })

  // Inject Onyx tokens without fighting the app-wide createThemePlugin.
  if (IN_BROWSER) {
    const adapter = new OnyxStyleSheetAdapter()
    adapter.upsert(adapter.generate({ 'onyx': themes.onyx.colors, 'onyx-light': themes['onyx-light'].colors }))
  }

  const route = useRoute()
  const router = useRouter()

  const activeSlug = toRef(() => (route.params.page as string | undefined) ?? 'introduction')
  const title = toRef(() => pages.find(page => page.slug === activeSlug.value)?.title ?? 'Introduction')

  const component = toRef(() => {
    const loader = modules[`./pages/${toPascal(activeSlug.value)}.vue`]
    return loader ? defineAsyncComponent(loader) : undefined
  })

  function isActive (slug: string) {
    return activeSlug.value === slug
  }

  // Theme — persisted via useStorage, applied to the documentElement dataset.
  const storage = useStorage()
  const theme = storage.get<'onyx' | 'onyx-light'>('onyx-theme', 'onyx')

  watch(theme, value => {
    if (IN_BROWSER) document.documentElement.dataset.theme = value
  }, { immediate: true })

  function onTheme () {
    theme.value = theme.value === 'onyx' ? 'onyx-light' : 'onyx'
  }

  // Mobile drawer — registered as a stack ticket so `Scrim` renders its
  // backdrop and handles dismiss-on-tap; body scroll locks while open.
  const open = shallowRef(false)
  const asideId = useId()

  const stack = useStack()
  const ticket = stack.register({
    onDismiss: () => {
      open.value = false
    },
  })

  watch(open, isOpen => {
    if (isOpen) ticket.select()
    else ticket.unselect()
  }, { immediate: true })

  watch(open, isOpen => {
    if (IN_BROWSER) document.body.style.overflow = isOpen ? 'hidden' : ''
  })

  function onNav (event: MouseEvent, navigate: (event: MouseEvent) => void) {
    navigate(event)
    open.value = false
  }

  watch(activeSlug, slug => {
    if (IN_BROWSER && !pages.some(page => page.slug === slug)) {
      router.replace('/onyx/introduction')
    }
  }, { immediate: true })
</script>

<template>
  <div class="onyx-docs" :style="{ background: 'var(--onyx-background, #ffffff)', color: 'var(--onyx-foreground, #09090b)', minHeight: '100vh' }">
    <div class="onyx-docs__topbar flex items-center gap-3 p-3">
      <OnButton
        :aria-controls="asideId"
        :aria-expanded="open"
        aria-label="Open navigation"
        size="icon"
        variant="ghost"
        @click="open = true"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="18"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="18"
        >
          <path :d="icons.menu" />
        </svg>
      </OnButton>

      <span class="onyx-docs__wordmark" :style="{ color: 'var(--onyx-brand, #3f3f46)' }">Onyx</span>
    </div>

    <aside :id="asideId" class="onyx-docs__aside" :data-open="open || undefined" :style="{ zIndex: open ? ticket.zIndex.value : undefined }">
      <div class="onyx-docs__brand flex items-center gap-2 p-4">
        <svg aria-hidden="true" height="22" viewBox="0 0 24 24" width="22">
          <path d="M21 12 16.5 4.2 7.5 4.2 3 12 7.5 19.8 16.5 19.8Z" :fill="'var(--onyx-brand, #3f3f46)'" />

          <path
            d="M12 12 21 12M12 12 16.5 4.2M12 12 7.5 4.2M12 12 3 12M12 12 7.5 19.8M12 12 16.5 19.8"
            fill="none"
            opacity="0.5"
            :stroke="'var(--onyx-brand-foreground, #ffffff)'"
            stroke-linecap="round"
            stroke-width="0.75"
          />
        </svg>

        <span class="onyx-docs__wordmark" :style="{ color: 'var(--onyx-brand, #3f3f46)' }">Onyx</span>

        <OnButton
          aria-label="Close navigation"
          class="onyx-docs__aside-close"
          size="icon"
          variant="ghost"
          @click="open = false"
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="16"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="16"
          >
            <path :d="icons.x" />
          </svg>
        </OnButton>
      </div>

      <nav class="flex flex-col gap-4 px-3 pb-4">
        <div v-for="group in groups" :key="group.heading">
          <p class="onyx-docs__group-label uppercase" :style="{ color: 'var(--onyx-muted-foreground, #71717a)' }">
            {{ group.heading }}
          </p>

          <OnList>
            <RouterLink
              v-for="page in group.pages"
              :key="page.slug"
              v-slot="{ href, navigate }"
              custom
              :to="`/onyx/${page.slug}`"
            >
              <OnListItem :active="isActive(page.slug)">
                <a :aria-current="isActive(page.slug) ? 'page' : undefined" class="onyx-docs__nav-link" :href @click="onNav($event, navigate)">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path :d="icons[page.icon]" />
                  </svg>

                  <span>{{ page.title }}</span>
                </a>
              </OnListItem>
            </RouterLink>
          </OnList>
        </div>
      </nav>

      <div class="onyx-docs__aside-footer p-3">
        <OnButton aria-label="Toggle theme" size="icon" variant="ghost" @click="onTheme">
          <svg
            aria-hidden="true"
            fill="none"
            height="18"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="18"
          >
            <path :d="theme === 'onyx' ? icons.sun : icons.moon" />
          </svg>
        </OnButton>
      </div>
    </aside>

    <Scrim class="fixed inset-0 bg-black/50" />

    <main class="onyx-docs__main p-6">
      <h1 class="onyx-docs__title">{{ title }}</h1>

      <component :is="component" v-if="component" />

      <OnCard v-else>
        <OnCardContent>
          <p>This page hasn't been written yet.</p>
        </OnCardContent>
      </OnCard>
    </main>

    <OnToaster />
  </div>
</template>

<!-- Unscoped: layout scaffolding only (fixed aside positioning, mobile drawer
     transform, responsive breakpoints) — every visible component is Hb. -->
<style>
  .onyx-docs__topbar {
    display: none;
  }

  .onyx-docs__aside {
    background: var(--onyx-card, #ffffff);
    border-right: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
    bottom: 0;
    display: flex;
    flex-direction: column;
    left: 0;
    overflow-y: auto;
    position: fixed;
    top: 0;
    transform: translateX(-100%);
    transition: transform var(--onyx-motion-base, 200ms) var(--onyx-easing, cubic-bezier(0.16, 1, 0.3, 1));
    width: 280px;
    z-index: 1;
  }

  .onyx-docs__aside[data-open] {
    transform: translateX(0);
  }

  .onyx-docs__aside-close {
    margin-left: auto;
  }

  .onyx-docs__wordmark {
    font-size: var(--onyx-text-md-size, 16px);
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .onyx-docs__group-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    margin: 0 0 4px 8px;
    opacity: 0.75;
  }

  .onyx-docs__aside .onyx-list__item {
    padding: 7px 10px;
  }

  .onyx-docs__nav-link {
    align-items: center;
    color: inherit;
    display: flex;
    font-size: var(--onyx-text-sm-size, 13px);
    gap: var(--onyx-spacing-sm, 12px);
    text-decoration: none;
    width: 100%;
  }

  .onyx-docs__main {
    margin: 0 auto;
    max-width: 1100px;
  }

  .onyx-docs__title {
    font-size: var(--onyx-text-3xl-size, 30px);
    font-weight: 600;
    line-height: var(--onyx-text-3xl-height, 36px);
    margin: 0 0 var(--onyx-spacing-lg, 24px);
  }

  @media (max-width: 767px) {
    .onyx-docs__topbar {
      display: flex;
    }
  }

  @media (min-width: 768px) {
    .onyx-docs__aside {
      transform: none;
    }

    .onyx-docs__aside-close {
      display: none;
    }

    .onyx-docs__main {
      margin-left: 280px;
    }
  }
</style>
