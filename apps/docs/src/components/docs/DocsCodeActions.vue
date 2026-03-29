<script setup lang="ts">
  // Composables
  import { getBinUrl } from '@/composables/bin'
  import { useClipboard } from '@/composables/useClipboard'
  import { usePlayground } from '@/composables/usePlayground'

  const props = defineProps<{
    code: string
    language?: string
    title?: string
    binTitle?: string
    playground?: boolean
    bin?: boolean
    showCopy?: boolean
    showWrap?: boolean
  }>()

  const wrap = defineModel<boolean>('wrap', { default: false })

  const clipboard = useClipboard()

  function copyCode () {
    clipboard.copy(props.code)
  }

  function openInBin () {
    const url = getBinUrl(props.code, props.language || 'markdown', props.binTitle || props.title)
    window.open(url, '_blank')
  }

  async function openInPlayground () {
    const url = await usePlayground([{ name: props.title ?? 'Example.vue', code: props.code }])
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
