<script setup lang="ts">
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
    <AppIconButton
      v-if="playground"
      aria-label="Open in Vuetify Play"
      icon="vuetify-play"
      title="Open in Vuetify Play"
      type="button"
      @click="openInPlayground"
    />

    <AppIconButton
      v-if="bin"
      aria-label="Open in Vuetify Bin"
      icon="vuetify-bin"
      title="Open in Vuetify Bin"
      type="button"
      @click="openInBin"
    />

    <AppIconButton
      v-if="showSize"
      :aria-label="`Code size: ${size}. Click to cycle`"
      :icon="`size-${size}`"
      :title="`Code size: ${size}`"
      type="button"
      @click="onSize"
    />

    <AppIconButton
      v-if="showWrap"
      :aria-label="wrap ? 'Disable line wrap' : 'Enable line wrap'"
      :icon="wrap ? 'nowrap' : 'wrap'"
      :title="wrap ? 'Disable line wrap' : 'Enable line wrap'"
      type="button"
      @click="wrap = !wrap"
    />

    <AppIconButton
      v-if="showCopy"
      :aria-label="!clipboard.copied.value ? 'Copy code' : 'Copied'"
      :icon="!clipboard.copied.value ? 'copy' : 'success'"
      :title="!clipboard.copied.value ? 'Copy code' : 'Copied'"
      type="button"
      @click="copyCode"
    />
  </div>
</template>
