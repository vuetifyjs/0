<script setup lang="ts">
  import { HxIconButton } from '@paper/helix'

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
    <HxIconButton
      v-if="playground"
      aria-label="Open in Vuetify Play"
      class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none max-md:opacity-80 max-md:bg-surface/50"
      icon="vuetify-play"
      title="Open in Vuetify Play"
      @click="openInPlayground"
    >
      <template #icon="{ icon, size }">
        <AppIcon aria-hidden="true" :icon :size />
      </template>
    </HxIconButton>

    <HxIconButton
      v-if="bin"
      aria-label="Open in Vuetify Bin"
      class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none max-md:opacity-80 max-md:bg-surface/50"
      icon="vuetify-bin"
      title="Open in Vuetify Bin"
      @click="openInBin"
    >
      <template #icon="{ icon, size }">
        <AppIcon aria-hidden="true" :icon :size />
      </template>
    </HxIconButton>

    <HxIconButton
      v-if="showWrap"
      :aria-label="wrap ? 'Disable line wrap' : 'Enable line wrap'"
      class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none max-md:opacity-80 max-md:bg-surface/50"
      :icon="wrap ? 'nowrap' : 'wrap'"
      :title="wrap ? 'Disable line wrap' : 'Enable line wrap'"
      @click="wrap = !wrap"
    >
      <template #icon="{ icon, size }">
        <AppIcon aria-hidden="true" :icon :size />
      </template>
    </HxIconButton>

    <HxIconButton
      v-if="showCopy"
      :aria-label="!clipboard.copied.value ? 'Copy code' : 'Copied'"
      class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none max-md:opacity-80 max-md:bg-surface/50"
      :icon="!clipboard.copied.value ? 'copy' : 'success'"
      :title="!clipboard.copied.value ? 'Copy code' : 'Copied'"
      @click="copyCode"
    >
      <template #icon="{ icon, size }">
        <AppIcon aria-hidden="true" :icon :size />
      </template>
    </HxIconButton>
  </div>
</template>
