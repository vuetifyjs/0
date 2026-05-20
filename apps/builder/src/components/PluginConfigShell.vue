<script setup lang="ts">
  import { mdiArrowLeft, mdiArrowRight, mdiClose } from '@mdi/js'

  import { getPluginById, PLUGINS } from '@/data/plugins'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { computed, toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const { pluginId } = defineProps<{
    pluginId: string
  }>()

  const emit = defineEmits<{
    save: []
  }>()

  const store = useBuilderStore()
  const router = useRouter()

  const meta = toRef(() => getPluginById(pluginId))

  const sequence = computed(() => PLUGINS.filter(p => store.isPluginSelected(p.id)))
  const position = computed(() => sequence.value.findIndex(p => p.id === pluginId))
  const isFirst = computed(() => position.value === 0)
  const isLast = computed(() => position.value === sequence.value.length - 1)

  function goToPrev () {
    if (isFirst.value) {
      router.push('/builder')
      return
    }
    router.push(`/builder/${sequence.value[position.value - 1].slug}`)
  }

  function goToNext () {
    if (isLast.value) {
      router.push('/builder/components')
      return
    }
    router.push(`/builder/${sequence.value[position.value + 1].slug}`)
  }

  function onSkip () {
    goToNext()
  }

  function onSave () {
    emit('save')
    goToNext()
  }
</script>

<template>
  <div v-if="meta" class="max-w-4xl mx-auto px-6 py-12">
    <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
      Configuring {{ meta.title }} ({{ position + 1 }} of {{ sequence.length }})
    </p>

    <h2 class="text-2xl font-bold mb-2">{{ meta.title }}</h2>

    <slot name="description">
      <p class="text-on-surface-variant mb-8">
        {{ meta.title }} configuration
      </p>
    </slot>

    <div class="mb-8">
      <slot />
    </div>

    <div class="flex items-center justify-between border-t pt-6">
      <button
        class="text-sm text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1"
        @click="goToPrev"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
        {{ isFirst ? 'Back to plugin selection' : 'Prev' }}
      </button>

      <div class="flex items-center gap-3">
        <button
          class="text-sm text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1"
          @click="onSkip"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
          Skip (use defaults)
        </button>

        <button
          class="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          @click="onSave"
        >
          {{ isLast ? 'Save & Continue to Components' : 'Save & Next' }}
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
