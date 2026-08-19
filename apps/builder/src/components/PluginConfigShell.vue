<script setup lang="ts">
  import { mdiArrowRight, mdiChevronLeft, mdiClose } from '@mdi/js'

  // Framework
  import { Button } from '@vuetify/v0'

  // Components
  import StepBar from '@/components/app/StepBar.vue'

  // Composables
  import { wizardProgress } from '@/composables/useWizardProgress'

  import { getPluginById, PLUGINS } from '@/data/plugins'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'
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

  const sequence = toRef(() => PLUGINS.filter(p => store.isPluginSelected(p.id)))
  const position = toRef(() => sequence.value.findIndex(p => p.id === pluginId))
  const isFirst = toRef(() => position.value === 0)
  const isLast = toRef(() => position.value === sequence.value.length - 1)

  const total = toRef(() => String(sequence.value.length).padStart(2, '0'))
  const index = toRef(() => String(position.value + 1).padStart(2, '0'))

  const progress = toRef(() => wizardProgress(sequence.value.length, position.value + 2))

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
  <div v-if="meta" class="max-w-3xl mx-auto px-6 pt-5 sm:pt-6 pb-24">
    <header class="mb-9">
      <h2 class="t-title mb-3">{{ meta.title }}</h2>

      <slot name="description">
        <p class="t-body text-on-surface-variant">
          {{ meta.title }} configuration
        </p>
      </slot>
    </header>

    <slot />
  </div>

  <StepBar v-if="meta" :progress="progress.percent" :progress-label="progress.label">
    <p class="t-index text-on-surface-variant">
      {{ index }} <span class="text-on-surface-variant/50">/</span> {{ total }}
    </p>

    <div class="flex flex-wrap items-center justify-end gap-2">
      <Button.Root aria-label="Skip (use defaults)" class="btn-ghost" @click="onSkip">
        <Button.Icon>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
        </Button.Icon>

        <Button.Content>
          <span class="hidden sm:inline">Skip (use defaults)</span>
          <span class="sm:hidden">Skip</span>
        </Button.Content>
      </Button.Root>

      <Button.Root aria-label="Back" class="btn-quiet h-10 w-10 px-0" @click="goToPrev">
        <Button.Icon>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronLeft" fill="currentColor" /></svg>
        </Button.Icon>
      </Button.Root>

      <Button.Root class="btn-primary" @click="onSave">
        <Button.Content>{{ isLast ? 'Save & continue' : 'Save & next' }}</Button.Content>

        <Button.Icon>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
        </Button.Icon>
      </Button.Root>
    </div>
  </StepBar>
</template>
