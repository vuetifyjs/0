<script setup lang="ts">
  // Framework
  import { Dialog, useTimer } from '@vuetify/v0'

  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Composables
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { nextTick, shallowRef, useTemplateRef, watch } from 'vue'

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
  const status = shallowRef<'idle' | 'saving' | 'done' | 'error'>('idle')
  const message = shallowRef('')
  const input = useTemplateRef<HTMLInputElement>('input')

  const { start: clearDone } = useTimer(() => {
    if (status.value === 'done') {
      open.value = false
      status.value = 'idle'
    }
  }, { duration: 900 })

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
    if (status.value === 'saving') return

    const ok = await ensureAuth()
    if (!ok) {
      status.value = 'error'
      message.value = 'Sign in to save to Vuetify One'
      return
    }

    status.value = 'saving'
    message.value = ''
    try {
      const content = playground.snapshotContent()
      await save(content, {
        title: title.value.trim() || 'Untitled',
        asNew: asNew || !currentId.value,
      })
      status.value = 'done'
      message.value = 'Saved to Vuetify One'
      emit('saved')
      clearDone()
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
            {{ asNew || !currentId ? 'Save to Vuetify One' : 'Update Vuetify One' }}
          </Dialog.Title>

          <Dialog.Description class="text-[11px] text-on-surface-variant mt-0.5">
            Stores this playground on your account (File → Open → Vuetify One).
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
            :disabled="status === 'saving'"
            maxlength="120"
            type="text"
          >
        </label>

        <p
          v-if="message"
          class="text-[11px]"
          :class="status === 'error' ? 'text-error' : 'text-on-surface-variant'"
        >
          {{ message }}
        </p>

        <div class="flex justify-end gap-2 pt-1">
          <button
            class="px-3 py-1.5 rounded text-xs text-on-surface-variant hover:bg-surface-tint"
            :disabled="status === 'saving'"
            type="button"
            @click="open = false"
          >
            Cancel
          </button>

          <button
            class="px-3 py-1.5 rounded text-xs font-medium bg-primary text-on-primary disabled:opacity-60"
            :disabled="status === 'saving' || !title.trim()"
            type="submit"
          >
            {{ status === 'saving' ? 'Saving…' : status === 'done' ? 'Saved!' : 'Save' }}
          </button>
        </div>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</template>
