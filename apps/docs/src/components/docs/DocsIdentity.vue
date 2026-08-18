<script setup lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  export interface DocsIdentityProps {
    name: string
    title: string
    description: string
    src?: string
    dense?: boolean
  }

  defineOptions({ name: 'DocsIdentity' })

  const { name, title, description, src, dense = false } = defineProps<DocsIdentityProps>()

  const open = shallowRef(false)

  const nameClip = useClipboard()
  const titleClip = useClipboard()
  const { copied: descriptionCopied, copy: copyDescription } = useClipboard()
  const { copied: allCopied, copy: copyAll } = useClipboard()

  const bundle = toRef(() => {
    const lines = [
      `Name\n${name}`,
      `Title\n${title}`,
    ]

    if (src) {
      lines.push(`Avatar\n${src}`)
    }

    lines.push(`Description\n${description}`)

    return lines.join('\n\n')
  })

  const initial = toRef(() => name.charAt(0).toUpperCase() || '?')

  const singles = toRef(() => [
    {
      key: 'name',
      label: 'Name',
      value: name,
      copied: nameClip.copied.value,
      copy: () => nameClip.copy(name),
    },
    {
      key: 'title',
      label: 'Title',
      value: title,
      copied: titleClip.copied.value,
      copy: () => titleClip.copy(title),
    },
  ])
</script>

<template>
  <div class="not-prose my-4 border border-divider rounded-lg bg-surface overflow-hidden">
    <div
      class="relative flex items-center justify-between gap-4 overflow-hidden"
      :class="dense ? 'px-3 py-2' : 'px-4 py-3'"
    >
      <AppDotGrid :coverage="55" origin="bottom left" />

      <div
        v-if="dense"
        class="relative z-10 min-w-0 flex-1 flex flex-col items-start gap-0.5"
      >
        <button
          :aria-label="nameClip.copied.value ? 'Copied name' : 'Copy name'"
          class="inline-flex items-center gap-1.5 bg-transparent border-none p-0 font-inherit text-sm font-medium text-inherit cursor-pointer hover:text-primary focus-visible:text-primary focus-visible:outline-none"
          :class="nameClip.copied.value && 'text-success'"
          type="button"
          @click="nameClip.copy(name)"
        >
          {{ name }}
          <AppIcon class="opacity-50" :icon="nameClip.copied.value ? 'check' : 'copy'" :size="14" />
        </button>

        <button
          :aria-label="titleClip.copied.value ? 'Copied title' : 'Copy title'"
          class="inline-flex items-center gap-1.5 bg-transparent border-none p-0 font-inherit text-xs opacity-70 text-inherit cursor-pointer hover:text-primary hover:opacity-100 focus-visible:text-primary focus-visible:outline-none"
          :class="titleClip.copied.value && 'text-success opacity-100'"
          type="button"
          @click="titleClip.copy(title)"
        >
          {{ title }}
          <AppIcon class="opacity-50" :icon="titleClip.copied.value ? 'check' : 'copy'" :size="12" />
        </button>
      </div>

      <div
        v-else
        class="relative z-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 min-w-0"
      >
        <div
          v-for="field in singles"
          :key="field.key"
          class="min-w-0"
        >
          <p class="text-xs font-medium tracking-wide uppercase opacity-60 my-0">
            {{ field.label }}
          </p>

          <button
            :aria-label="field.copied ? `Copied ${field.label.toLowerCase()}` : `Copy ${field.label.toLowerCase()}`"
            class="mt-1 inline-flex items-center gap-1.5 bg-transparent border-none p-0 font-inherit text-sm font-medium text-inherit cursor-pointer hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            :class="field.copied && 'text-success'"
            type="button"
            @click="field.copy()"
          >
            {{ field.value }}
            <AppIcon class="opacity-50" :icon="field.copied ? 'check' : 'copy'" :size="14" />
          </button>
        </div>
      </div>

      <button
        :aria-label="allCopied ? 'Copied identity' : 'Copy identity'"
        class="relative z-10 size-10 rounded-full p-0 border-0 bg-transparent cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        :class="allCopied && 'ring-2 ring-success'"
        type="button"
        @click="copyAll(bundle)"
      >
        <Avatar.Root class="size-10 rounded-full overflow-hidden">
          <Avatar.Image
            v-if="src"
            :alt="name"
            class="size-10 rounded-full object-cover"
            :src
          />

          <Avatar.Fallback class="size-10 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-medium">
            {{ initial }}
          </Avatar.Fallback>
        </Avatar.Root>
      </button>
    </div>

    <button
      v-if="dense && !open"
      :aria-expanded="false"
      class="w-full m-0 px-3 pt-2 pb-2 bg-transparent border-none border-t border-divider text-left cursor-pointer hover:bg-surface-tint/50 focus-visible:bg-surface-tint focus-visible:outline-none"
      type="button"
      @click="open = true"
    >
      <p class="m-0 !mb-0 p-0 line-clamp-2 text-sm leading-relaxed opacity-60">
        {{ description }}
      </p>
    </button>

    <div v-if="!dense || open" class="px-4 py-3 border-t border-divider">
      <button
        :aria-label="descriptionCopied ? 'Copied description' : 'Copy description'"
        class="inline-flex items-center gap-1.5 bg-transparent border-none p-0 font-inherit text-xs font-medium tracking-wide uppercase opacity-60 text-inherit cursor-pointer hover:opacity-100 hover:text-primary focus-visible:opacity-100 focus-visible:text-primary focus-visible:outline-none"
        :class="descriptionCopied && 'text-success opacity-100'"
        type="button"
        @click="copyDescription(description)"
      >
        Description
        <AppIcon :icon="descriptionCopied ? 'check' : 'copy'" :size="12" />
      </button>

      <pre class="mt-2 mb-0 p-3 max-h-80 overflow-auto rounded bg-surface-tint text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">{{ description }}</pre>
    </div>
  </div>
</template>
