<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useWindowEventListener } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useAsk } from '@/composables/useAsk'

  // Utilities
  import { computed, onMounted, shallowRef, useTemplateRef, nextTick, watch } from 'vue'

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
  const ask = useAsk()

  watch(ask.focusTrigger, () => {
    if (!ask.isOpen.value) {
      nextTick(() => focus())
    }
  })

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
      class="fixed bottom-4 inset-x-0 mx-auto z-40 w-full max-w-sm px-4"
    >
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
