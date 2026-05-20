<script lang="ts">
  // Framework
  import { Atom, createContext } from '@vuetify/v0'

  // Utilities
  import { useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmUploadProps extends AtomProps {
    accept?: string
    multiple?: boolean
    disabled?: boolean
  }

  export interface EmUploadContext {
    accept: () => string | undefined
    multiple: () => boolean
    disabled: () => boolean
    open: () => void
    append: (files: File[]) => void
  }

  export const [useEmUpload, provideEmUpload] = createContext<EmUploadContext | null>('emerald:upload', null)
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmUpload' })

  // TODO(emerald): flesh out vs createQueue for upload progress/list when v0 primitive lands
  const {
    accept,
    multiple = false,
    disabled = false,
    as = 'div',
    renderless = false,
  } = defineProps<EmUploadProps>()

  const model = defineModel<File[]>({ default: () => [] })

  const input = useTemplateRef<HTMLInputElement>('input')

  function open () {
    if (disabled) return
    input.value?.click()
  }

  function append (files: File[]) {
    if (disabled || files.length === 0) return
    model.value = multiple ? [...model.value, ...files] : files.slice(0, 1)
  }

  function onChange (e: Event) {
    const target = e.target as HTMLInputElement
    append(Array.from(target.files ?? []))
    target.value = ''
  }

  provideEmUpload({
    accept: () => accept,
    multiple: () => multiple,
    disabled: () => disabled,
    open,
    append,
  })
</script>

<template>
  <Atom
    :as
    class="emerald-upload"
    :data-disabled="disabled || undefined"
    :renderless
  >
    <input
      ref="input"
      :accept
      class="emerald-upload__hidden-input"
      :disabled
      :multiple
      tabindex="-1"
      type="file"
      @change="onChange"
    >

    <slot
      :accept
      :disabled
      :files="model"
      :multiple
      :open
    />
  </Atom>
</template>

<style>
.emerald-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: var(--emerald-on-background);
}

.emerald-upload[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}

.emerald-upload__hidden-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
