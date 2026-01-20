<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useWindowEventListener } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { computed, onMounted, shallowRef, useTemplateRef } from 'vue'

  // Stores
  import { useAppStore } from '@/stores/app'

  const props = defineProps<{
    hasMessages?: boolean
  }>()

  const emit = defineEmits<{
    submit: [question: string]
    reopen: []
  }>()

  const app = useAppStore()
  const discovery = useDiscovery()

  const formRef = useTemplateRef<{ focus: () => void }>('form')
  const isNearBottom = shallowRef(false)
  const isMobile = shallowRef(true)

  // Hide when near bottom, or when drawer is open on mobile (< 768px)
  const isHidden = computed(() => isNearBottom.value || (app.drawer && isMobile.value))

  function onSubmit (question: string) {
    emit('submit', question)
  }

  function onFocus () {
    if (!props.hasMessages) return
    emit('reopen')
  }

  function focus () {
    formRef.value?.focus()
  }

  function onScroll () {
    if (!IN_BROWSER) return
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    const distanceFromBottom = docHeight - (scrollTop + windowHeight)
    isNearBottom.value = distanceFromBottom < 200
  }

  function updateMobile () {
    if (!IN_BROWSER) return
    isMobile.value = window.innerWidth < 768
  }

  discovery.on('start:ask-ai', () => {})

  discovery.on('back:ask-ai', () => {})

  discovery.on('complete:ask-ai', () => {})

  useWindowEventListener('scroll', onScroll, { passive: true })
  useWindowEventListener('resize', updateMobile, { passive: true })

  onMounted(() => {
    onScroll()
    updateMobile()
  })

  defineExpose({ focus })
</script>

<template>
  <Transition name="fade">
    <div
      v-show="!isHidden"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4"
    >
      <Discovery.Root step="ask-ai">
        <Discovery.Activator class="rounded-2xl" step="ask-ai">
          <DocsAskForm
            ref="form"
            aria-label="Ask a question about this page"
            class="shadow-lg"
            show-keyboard-hint
            @focus="onFocus"
            @submit="onSubmit"
          />
        </Discovery.Activator>

        <Discovery.Content class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs z-[60] translate-x--48" placement="top">
          <div class="flex justify-between items-center">
            <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">Ask the AI</Discovery.Title>
            <Discovery.Progress class="text-xs text-on-surface-variant mb-2" />
          </div>

          <Discovery.Description class="text-sm text-on-surface-variant mb-4">
            Type <kbd class="px-1.5 py-0.5 rounded bg-surface-tint text-on-surface-tint text-xs font-mono">Tabs</kbd> and press Enter to navigate to the Tabs component.
          </Discovery.Description>

          <div class="flex justify-end">
            <Discovery.Prev class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface">
              Back
            </Discovery.Prev>

            <Discovery.Skip class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface">
              Skip tour
            </Discovery.Skip>
          </div>
        </Discovery.Content>
      </Discovery.Root>
    </div>
  </Transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
