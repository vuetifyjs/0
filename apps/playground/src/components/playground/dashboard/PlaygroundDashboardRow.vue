<script setup lang="ts">
  // Framework
  import { Button, useTimer } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'
  import { formatDate } from '@/components/playground/open/types'

  // Composables
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { OnePlayground } from '@/composables/useOnePlaygrounds'

  const { item } = defineProps<{
    item: OnePlayground
  }>()

  const emit = defineEmits<{
    update: [item: OnePlayground]
    remove: [id: string]
  }>()

  const one = useOnePlaygrounds()
  const busy = shallowRef(false)
  const renaming = shallowRef(false)
  const confirmDelete = shallowRef(false)
  const draft = shallowRef('')
  const input = useTemplateRef<HTMLInputElement>('input')

  const canDelete = toRef(() => !item.favorite && !item.locked)
  const visibilityIcon = toRef(() => (
    item.visibility === 'private' ? 'visibility-private' : 'visibility-public'
  ))
  const visibilityHint = toRef(() => (
    item.visibility === 'private' ? 'Make public' : 'Make private'
  ))

  const deleteTimer = useTimer(() => {
    confirmDelete.value = false
  }, { duration: 3000 })

  const actionClass = 'pa-1 inline-flex items-center justify-center rounded border-0 bg-transparent text-on-surface-variant hover:bg-surface-tint hover:text-on-surface cursor-pointer data-[disabled]:opacity-40 data-[disabled]:hover:bg-transparent data-[disabled]:cursor-not-allowed'

  function meta () {
    return {
      title: item.title,
      favorite: item.favorite,
      pinned: item.pinned,
      locked: item.locked,
      visibility: item.visibility,
    }
  }

  async function patch (
    next: Partial<Pick<OnePlayground, 'favorite' | 'pinned' | 'locked' | 'visibility'> & { title?: string }>,
  ) {
    if (busy.value) return
    busy.value = true
    const previous = { ...item }
    const snapshot = meta()
    emit('update', { ...item, ...next })
    try {
      const result = await one.patchMeta(next, previous.id, snapshot)
      emit('update', { ...previous, ...result })
    } catch {
      emit('update', previous)
    } finally {
      busy.value = false
    }
  }

  function onFavorite () {
    void patch({ favorite: !item.favorite })
  }

  function onPin () {
    void patch({ pinned: !item.pinned })
  }

  function onVisibility () {
    void patch({ visibility: item.visibility === 'public' ? 'private' : 'public' })
  }

  async function onRename () {
    if (busy.value || renaming.value) return
    confirmDelete.value = false
    deleteTimer.stop()
    renaming.value = true
    draft.value = item.title || 'Untitled'
    await nextTick()
    input.value?.focus()
    input.value?.select()
  }

  function onRenameCancel () {
    renaming.value = false
  }

  function onRenameSave () {
    if (!renaming.value || busy.value) return
    const title = draft.value.trim() || 'Untitled'
    renaming.value = false
    if (title === (item.title || 'Untitled')) return
    void patch({ title })
  }

  async function onDelete () {
    if (!canDelete.value || busy.value) return

    if (confirmDelete.value) {
      deleteTimer.stop()
      confirmDelete.value = false
      busy.value = true
      try {
        await one.destroy(item.id, item)
        emit('remove', item.id)
      } catch {
        // leave the row if the API rejects
      } finally {
        busy.value = false
      }
    } else {
      confirmDelete.value = true
      deleteTimer.start()
    }
  }
</script>

<template>
  <div
    class="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md hover:bg-surface-tint/60"
    :data-busy="busy || undefined"
  >
    <div class="min-w-0 flex-1 flex items-center gap-2">
      <AppIcon
        v-if="item.locked"
        class="shrink-0 text-on-surface-variant"
        icon="lock"
        :size="14"
      />

      <input
        v-if="renaming"
        ref="input"
        v-model="draft"
        aria-label="Playground title"
        class="flex-1 min-w-0 px-2 py-1 rounded-md border border-divider bg-surface-tint/40 text-sm text-on-surface outline-none focus:border-primary/50"
        maxlength="120"
        type="text"
        @blur="onRenameSave"
        @click.stop
        @keydown.enter.prevent="onRenameSave"
        @keydown.esc.prevent="onRenameCancel"
      >

      <RouterLink
        v-else
        class="text-sm text-on-surface truncate hover:text-primary"
        :to="`/playgrounds/${item.id}`"
      >
        {{ item.title || 'Untitled' }}
      </RouterLink>
    </div>

    <div class="flex items-center gap-1 shrink-0">
      <span class="text-xs text-on-surface-variant tabular-nums me-2">
        {{ formatDate(item.updatedAt || item.createdAt) }}
      </span>

      <AppTooltip
        as="span"
        class="inline-flex"
        :open-delay="200"
        position-area="top"
        :text="visibilityHint"
      >
        <Button.Root
          :aria-label="visibilityHint"
          :class="actionClass"
          :disabled="busy"
          @click.stop="onVisibility"
        >
          <AppIcon :icon="visibilityIcon" :size="16" />
        </Button.Root>
      </AppTooltip>

      <AppTooltip
        as="span"
        class="inline-flex"
        :open-delay="200"
        position-area="top"
        :text="item.pinned ? 'Unpin' : 'Pin'"
      >
        <Button.Root
          :aria-label="item.pinned ? 'Unpin' : 'Pin'"
          :class="actionClass"
          :disabled="busy"
          @click.stop="onPin"
        >
          <AppIcon :icon="item.pinned ? 'pin' : 'pin-outline'" :size="16" />
        </Button.Root>
      </AppTooltip>

      <AppTooltip
        as="span"
        class="inline-flex"
        :open-delay="200"
        position-area="top"
        :text="item.favorite ? 'Unfavorite' : 'Favorite'"
      >
        <Button.Root
          :aria-label="item.favorite ? 'Unfavorite' : 'Favorite'"
          :class="actionClass"
          :disabled="busy"
          @click.stop="onFavorite"
        >
          <AppIcon :icon="item.favorite ? 'star' : 'star-outline'" :size="16" />
        </Button.Root>
      </AppTooltip>

      <AppTooltip
        as="span"
        class="inline-flex"
        :open-delay="200"
        position-area="top"
        text="Rename"
      >
        <Button.Root
          aria-label="Rename"
          :class="actionClass"
          :disabled="busy"
          @click.stop="onRename"
        >
          <AppIcon icon="pencil" :size="16" />
        </Button.Root>
      </AppTooltip>

      <AppTooltip
        as="span"
        class="inline-flex"
        :open-delay="canDelete ? 200 : 0"
        position-area="top"
        :text="canDelete
          ? (confirmDelete ? 'Click to confirm' : 'Delete')
          : 'Remove favorite and unlock first'"
      >
        <Button.Root
          :aria-label="confirmDelete ? 'Click to confirm delete' : 'Delete'"
          :class="[
            actionClass,
            confirmDelete ? 'text-error bg-error/10 hover:bg-error/20 hover:text-error' : '',
          ]"
          :disabled="!canDelete || busy"
          @click.stop="onDelete"
        >
          <AppIcon icon="delete" :size="16" />
        </Button.Root>
      </AppTooltip>
    </div>
  </div>
</template>
