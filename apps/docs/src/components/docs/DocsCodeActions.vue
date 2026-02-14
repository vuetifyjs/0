<script setup lang="ts">
  // Composables
  import { getBinUrl } from '@/composables/bin'
  import { useEditorLink } from '@/composables/editorLink'
  import { useClipboard } from '@/composables/useClipboard'

  const props = defineProps<{
    code: string
    language?: string
    fileName?: string
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

  function openInEditor () {
    let name = props.fileName
    // Ensure the file has a proper extension (e.g. "Anatomy" → "Anatomy.vue")
    if (name && !/\.\w+$/.test(name)) {
      name = `${name}.${props.language || 'vue'}`
    }
    const url = useEditorLink(props.code, name)
    window.open(url, '_blank')
  }
</script>

<template>
  <div class="flex gap-1">
    <AppIconButton
      v-if="playground"
      aria-label="Open in Editor"
      icon="vuetify-play"
      title="Open in Editor"
      type="button"
      @click="openInEditor"
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
