<script setup lang="ts">
  import { mdiArrowLeft, mdiArrowRight, mdiClose } from '@mdi/js'

  // Framework
  import { Button } from '@vuetify/v0'

  // Components
  import StepBar from '@/components/app/StepBar.vue'

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
      <div class="flex items-baseline justify-between gap-4 mb-3">
        <p class="t-eyebrow text-primary">Step 2 · Configure</p>

        <p class="t-index text-on-surface-variant">
          {{ index }} <span class="text-on-surface-variant/50">/</span> {{ total }}
        </p>
      </div>

      <!-- Position in the sequence, at a glance. The counter above already states it for
           assistive tech, so the rail itself is decorative. -->
      <div aria-hidden="true" class="flex items-center gap-1 mb-7">
        <span
          v-for="(step, at) in sequence"
          :key="step.id"
          class="flex-1 rounded-full transition-colors duration-150"
          :class="[
            at === position ? 'h-1.5 bg-primary' : 'h-1',
            at < position ? 'bg-primary/45' : '',
            at > position ? 'bg-divider' : '',
          ]"
        />
      </div>

      <h2 class="t-title mb-3">{{ meta.title }}</h2>

      <slot name="description">
        <p class="t-body text-on-surface-variant">
          {{ meta.title }} configuration
        </p>
      </slot>
    </header>

    <slot />
  </div>

  <StepBar v-if="meta">
    <!-- The short label below sm is display:none'd out of the a11y tree, so the full
         destination stays on the button itself. -->
    <Button.Root
      :aria-label="isFirst ? 'Back to plugin selection' : undefined"
      class="btn-quiet"
      @click="goToPrev"
    >
      <Button.Icon>
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      </Button.Icon>

      <!-- Short forms below sm keep the bar one row tall on a phone, where every pixel it
           takes is a pixel of form the user cannot see. -->
      <Button.Content>
        <span v-if="!isFirst">Prev</span>

        <template v-else>
          <span class="hidden sm:inline">Back to plugin selection</span>
          <span class="sm:hidden">Back</span>
        </template>
      </Button.Content>
    </Button.Root>

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

      <Button.Root class="btn-primary" @click="onSave">
        <Button.Content>{{ isLast ? 'Save & continue' : 'Save & next' }}</Button.Content>

        <Button.Icon>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
        </Button.Icon>
      </Button.Root>
    </div>
  </StepBar>
</template>
