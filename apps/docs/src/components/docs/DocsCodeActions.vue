<script setup lang="ts">
  // Framework
  import { GnActionButton } from '@paper/genesis'

  // Composables
  import { getBinUrl } from '@/composables/bin'
  import { useClipboard } from '@/composables/useClipboard'
  import { usePlayground } from '@/composables/usePlayground'
  import { CODE_SIZES } from '@/composables/useSettings'

  // Types
  import type { CodeSize } from '@/composables/useSettings'

  const props = defineProps<{
    code: string
    playgroundCode?: string
    language?: string
    title?: string
    binTitle?: string
    playground?: boolean
    bin?: boolean
    showCopy?: boolean
    showWrap?: boolean
    showSize?: boolean
  }>()

  const wrap = defineModel<boolean>('wrap', { default: false })
  const size = defineModel<CodeSize>('size', { default: 'small' })

  function onSize () {
    const index = CODE_SIZES.indexOf(size.value)
    size.value = CODE_SIZES[(index + 1) % CODE_SIZES.length]!
  }

  const clipboard = useClipboard()

  function copyCode () {
    clipboard.copy(props.code)
  }

  async function openInBin () {
    const url = await getBinUrl(props.code, props.language || 'markdown', props.binTitle || props.title)
    window.open(url, '_blank')
  }

  async function openInPlayground () {
    const url = await usePlayground([{ name: props.title ?? 'Example.vue', code: props.playgroundCode ?? props.code }])
    window.open(url, '_blank')
  }
</script>

<template>
  <div class="flex gap-1">
    <GnActionButton
      v-if="playground"
      aria-label="Open in Vuetify Play"
      title="Open in Vuetify Play"
      @click="openInPlayground"
    >
      <AppIcon icon="vuetify-play" :size="16" />
    </GnActionButton>

    <GnActionButton
      v-if="bin"
      aria-label="Open in Vuetify Bin"
      title="Open in Vuetify Bin"
      @click="openInBin"
    >
      <AppIcon icon="vuetify-bin" :size="16" />
    </GnActionButton>

    <GnActionButton
      v-if="showSize"
      :aria-label="`Code size: ${size}. Click to cycle`"
      :title="`Code size: ${size}`"
      @click="onSize"
    >
      <AppIcon :icon="`size-${size}`" :size="16" />
    </GnActionButton>

    <GnActionButton
      v-if="showWrap"
      :aria-label="wrap ? 'Disable line wrap' : 'Enable line wrap'"
      :title="wrap ? 'Disable line wrap' : 'Enable line wrap'"
      @click="wrap = !wrap"
    >
      <AppIcon :icon="wrap ? 'nowrap' : 'wrap'" :size="16" />
    </GnActionButton>

    <GnActionButton
      v-if="showCopy"
      :aria-label="!clipboard.copied.value ? 'Copy code' : 'Copied'"
      :title="!clipboard.copied.value ? 'Copy code' : 'Copied'"
      @click="copyCode"
    >
      <AppIcon :icon="!clipboard.copied.value ? 'copy' : 'success'" :size="16" />
    </GnActionButton>
  </div>
</template>
