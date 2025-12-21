<script lang="ts" setup>
  // Composables
  import { useBin } from '@/composables/bin'
  import { useClipboard } from '@/composables/useClipboard'
  import { usePlayground } from '@/composables/playground'

  const props = defineProps<{
    code: string
    language?: string
    title?: string
    playground?: boolean
    bin?: boolean
    showCopy?: boolean
  }>()

  const { copied, copy } = useClipboard()

  function copyCode () {
    copy(props.code)
  }

  function openInBin () {
    const url = useBin(props.code, props.language || 'markdown', props.title)
    window.open(url, '_blank')
  }

  function openInPlayground () {
    const url = usePlayground(props.code)
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
      v-if="showCopy"
      :aria-label="!copied ? 'Copy code' : 'Copied'"
      :icon="!copied ? 'copy' : 'success'"
      :title="!copied ? 'Copy code' : 'Copied'"
      type="button"
      @click="copyCode"
    />
  </div>
</template>
