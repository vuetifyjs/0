<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useWindowEventListener } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useAsk } from '@/composables/useAsk'

  // Utilities
  import { onMounted, shallowRef, toRef, useTemplateRef, nextTick, watch } from 'vue'
  import { useRoute } from 'vue-router'

  const props = defineProps<{
    hasMessages?: boolean
  }>()

  const emit = defineEmits<{
    submit: [question: string]
    reopen: []
  }>()

  const ask = useAsk()
  const route = useRoute()

  // Hide on skillz pages (they have their own focused UI)
  const isVisible = toRef(() => !route.path.startsWith('/skillz'))

  watch(ask.focusTrigger, () => {
    if (!ask.isOpen.value) {
      nextTick(() => focus())
    }
  })

  const formRef = useTemplateRef<{ focus: () => void }>('form')
  const isNearBottom = shallowRef(false)

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

  useWindowEventListener('scroll', onScroll, { passive: true })

  onMounted(() => {
    onScroll()
  })

  defineExpose({ focus })
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      v-show="!isNearBottom"
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
