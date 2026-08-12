<script setup lang="ts">
  // Framework
  import { Button, Dialog } from '@vuetify/v0'

  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Composables
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  /** Floor so Button.Loading is visible even when the API returns in <50ms. */
  const MIN_LOADING_MS = 500

  const open = defineModel<boolean>({ default: false })

  const {
    asNew = false,
  } = defineProps<{
    /** Force create a new One playground (Save as). */
    asNew?: boolean
  }>()

  const emit = defineEmits<{
    saved: []
  }>()

  const auth = useAuthStore()
  const playground = usePlayground()
  const {
    currentId,
    currentTitle,
    save,
  } = useOnePlaygrounds()

  const title = shallowRef(currentTitle.value)
  const status = shallowRef<'idle' | 'saving' | 'error'>('idle')
  const message = shallowRef('')
  const input = useTemplateRef<HTMLInputElement>('input')

  const isCreate = toRef(() => asNew || !currentId.value)
  const actionLabel = toRef(() => isCreate.value ? 'Save' : 'Rename')
  const isSaving = toRef(() => status.value === 'saving')

  watch(open, async value => {
    if (!value) {
      status.value = 'idle'
      message.value = ''
      return
    }
    title.value = currentTitle.value || 'Untitled'
    await nextTick()
    input.value?.focus()
    input.value?.select()
  })

  function delay (ms: number) {
    return new Promise<void>(resolve => {
      window.setTimeout(resolve, ms)
    })
  }

  async function ensureAuth (): Promise<boolean> {
    if (auth.user) return true
    await auth.verify()
    if (auth.user) return true

    auth.dialog = true
    return new Promise(resolve => {
      const stop = auth.$subscribe(() => {
        if (auth.user) {
          auth.dialog = false
          stop()
          resolve(true)
          return
        }
        if (!auth.dialog) {
          stop()
          resolve(false)
        }
      })
    })
  }

  async function onSave () {
    if (status.value === 'saving' || !title.value.trim()) return

    // Lock before any await so double-submit cannot create two playgrounds.
    status.value = 'saving'
    message.value = ''

    const ok = await ensureAuth()
    if (!open.value) {
      status.value = 'idle'
      return
    }
    if (!ok) {
      status.value = 'error'
      message.value = 'Sign in to save to Vuetify One'
      return
    }

    try {
      const content = playground.snapshotContent()
      await Promise.all([
        save(content, {
          title: title.value.trim() || 'Untitled',
          asNew: isCreate.value,
        }),
        delay(MIN_LOADING_MS),
      ])
      if (!open.value) {
        status.value = 'idle'
        return
      }
      emit('saved')
      open.value = false
      status.value = 'idle'
    } catch (error) {
      status.value = 'error'
      message.value = error instanceof Error ? error.message : 'Save failed'
    }
  }
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Content
      class="m-auto rounded-lg bg-surface border border-divider w-[min(24rem,calc(100vw-2rem))] p-0 shadow-xl"
    >
      <div class="flex items-start justify-between gap-3 px-4 py-3 border-b border-divider">
        <div class="min-w-0">
          <Dialog.Title as="h2" class="text-sm font-medium text-on-surface">
            {{ isCreate ? 'Save to Vuetify One' : 'Rename' }}
          </Dialog.Title>

          <Dialog.Description class="text-[11px] text-on-surface-variant mt-0.5">
            {{ isCreate
              ? 'Creates a playground on your account. Edits auto-save after that.'
              : 'Content already auto-saves. Change the title here.' }}
          </Dialog.Description>
        </div>

        <AppCloseButton @click="open = false" />
      </div>

      <form class="px-4 py-3 flex flex-col gap-3" @submit.prevent="onSave">
        <label class="flex flex-col gap-1">
          <span class="text-[11px] text-on-surface-variant">Title</span>

          <input
            ref="input"
            v-model="title"
            class="w-full px-2.5 py-1.5 rounded-md border border-divider bg-surface-tint/40 text-sm text-on-surface outline-none focus:border-primary/50"
            :disabled="isSaving"
            maxlength="120"
            type="text"
          >
        </label>

        <!-- Fixed-height slot so errors never grow the dialog -->
        <p
          :aria-hidden="status !== 'error' || !message"
          class="text-[11px] min-h-4 leading-4 truncate"
          :class="status === 'error' && message ? 'text-error' : 'text-transparent'"
        >
          {{ status === 'error' && message ? message : '\u00a0' }}
        </p>

        <div class="flex justify-end gap-2">
          <button
            class="px-2.5 py-1 rounded text-xs text-on-surface-variant hover:bg-surface-tint disabled:opacity-50"
            :disabled="isSaving"
            type="button"
            @click="open = false"
          >
            Cancel
          </button>

          <!--
            Fixed min-width for "Rename" so spinner doesn't reflow; keep compact py-1 like Cancel.
          -->
          <Button.Root
            class="relative min-w-14 px-2.5 py-1 rounded text-xs font-medium bg-primary text-on-primary inline-flex items-center justify-center data-[loading]:cursor-wait data-[disabled]:opacity-60"
            :disabled="!title.trim()"
            :grace="0"
            :loading="isSaving"
            type="button"
            @click="onSave"
          >
            <Button.Loading>
              <span
                aria-hidden="true"
                class="absolute inset-0 flex items-center justify-center rounded bg-primary"
              >
                <span class="inline-block size-3 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              </span>
            </Button.Loading>

            <Button.Content>
              <span class="block w-full text-center">{{ actionLabel }}</span>
            </Button.Content>
          </Button.Root>
        </div>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</template>
