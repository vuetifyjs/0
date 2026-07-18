<script setup lang="ts">
  import { GnActionButton } from '@paper/genesis'

  // Framework
  import { Tooltip } from '@vuetify/v0'

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
    <Tooltip.Root v-if="playground" :close-delay="100" :open-delay="500">
      <Tooltip.Activator renderless>
        <template #default="{ attrs: tooltipAttrs }">
          <GnActionButton
            v-bind="tooltipAttrs"
            aria-label="Open in Vuetify Play"
            @click="openInPlayground"
          >
            <AppIcon icon="vuetify-play" :size="16" />
          </GnActionButton>
        </template>
      </Tooltip.Activator>

      <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
        Open in Vuetify Play
      </Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root v-if="bin" :close-delay="100" :open-delay="500">
      <Tooltip.Activator renderless>
        <template #default="{ attrs: tooltipAttrs }">
          <GnActionButton
            v-bind="tooltipAttrs"
            aria-label="Open in Vuetify Bin"
            @click="openInBin"
          >
            <AppIcon icon="vuetify-bin" :size="16" />
          </GnActionButton>
        </template>
      </Tooltip.Activator>

      <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
        Open in Vuetify Bin
      </Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root v-if="showSize" :close-delay="100" :open-delay="500">
      <Tooltip.Activator renderless>
        <template #default="{ attrs: tooltipAttrs }">
          <GnActionButton
            v-bind="tooltipAttrs"
            :aria-label="`Code size: ${size}. Click to cycle`"
            @click="onSize"
          >
            <AppIcon :icon="`size-${size}`" :size="16" />
          </GnActionButton>
        </template>
      </Tooltip.Activator>

      <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
        Code size: {{ size }}
      </Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root v-if="showWrap" :close-delay="100" :open-delay="500">
      <Tooltip.Activator renderless>
        <template #default="{ attrs: tooltipAttrs }">
          <GnActionButton
            v-bind="tooltipAttrs"
            :aria-label="wrap ? 'Disable line wrap' : 'Enable line wrap'"
            @click="wrap = !wrap"
          >
            <AppIcon :icon="wrap ? 'nowrap' : 'wrap'" :size="16" />
          </GnActionButton>
        </template>
      </Tooltip.Activator>

      <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
        {{ wrap ? 'Disable line wrap' : 'Enable line wrap' }}
      </Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root v-if="showCopy" :close-delay="100" :open-delay="500">
      <Tooltip.Activator renderless>
        <template #default="{ attrs: tooltipAttrs }">
          <GnActionButton
            v-bind="tooltipAttrs"
            :aria-label="!clipboard.copied.value ? 'Copy code' : 'Copied'"
            @click="copyCode"
          >
            <AppIcon :icon="!clipboard.copied.value ? 'copy' : 'success'" :size="16" />
          </GnActionButton>
        </template>
      </Tooltip.Activator>

      <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
        {{ !clipboard.copied.value ? 'Copy code' : 'Copied!' }}
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</template>
