<script setup lang="ts">
  // Framework
  import { Button, Checkbox, useTimer } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppJdenticon from '@/components/app/AppJdenticon.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'

  // Composables
  import {
    canAssignTeam,
    isPlaygroundOwner,
    nextTeamId,
    playgroundTeamId,
    readUserTeam,
    settledTeamId,
  } from '@/composables/teamPlaygrounds'
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Local
  import { formatDate } from './types'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef } from 'vue'

  // Types
  import type { VuetifyPlayground } from './types'
  import type { PlaygroundScope } from '@/composables/teamPlaygrounds'

  const {
    item,
    selecting = false,
    selected = false,
    scope = 'personal',
  } = defineProps<{
    item: VuetifyPlayground
    selecting?: boolean
    selected?: boolean
    scope?: PlaygroundScope
  }>()

  const emit = defineEmits<{
    open: [item: VuetifyPlayground]
    update: [item: VuetifyPlayground]
    remove: [id: string]
    toggle: [id: string]
  }>()

  const auth = useAuthStore()
  const one = useOnePlaygrounds()
  const busy = shallowRef(false)
  const renaming = shallowRef(false)
  const confirmDelete = shallowRef(false)
  const draft = shallowRef('')
  const input = useTemplateRef<HTMLInputElement>('input')

  const canDelete = toRef(() => !item.favorite && !item.locked)
  const isOwner = toRef(() => isPlaygroundOwner(auth.user?.id, item.owner?.id))
  const userTeam = toRef(() => readUserTeam(auth.user))
  const canTeam = toRef(() => canAssignTeam(auth.user?.id, item.owner?.id, userTeam.value?.id))
  const teamLabel = toRef(() => (
    playgroundTeamId(item) ? 'Switch to Personal Playground' : 'Switch to Team Playground'
  ))
  const visibilityIcon = toRef(() => (
    (item.visibility ?? 'public') === 'private' ? 'visibility-private' : 'visibility-public'
  ))
  const visibilityHint = toRef(() => (
    (item.visibility ?? 'public') === 'private' ? 'Make public' : 'Make private'
  ))

  const deleteTimer = useTimer(() => {
    confirmDelete.value = false
  }, { duration: 3000 })

  const actionClass = 'pa-1 inline-flex items-center justify-center rounded border-0 bg-transparent text-on-surface-variant hover:bg-surface-tint hover:text-on-surface cursor-pointer data-[disabled]:opacity-40 data-[disabled]:hover:bg-transparent data-[disabled]:cursor-not-allowed'
  const boxClass = 'size-4 shrink-0 inline-flex items-center justify-center rounded-sm border border-on-surface-variant/40 bg-surface data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=indeterminate]:border-primary'

  function snapshot () {
    return {
      title: item.title,
      favorite: item.favorite ?? false,
      pinned: item.pinned ?? false,
      locked: item.locked ?? false,
      visibility: item.visibility ?? 'public',
      teamId: playgroundTeamId(item),
    }
  }

  async function patch (
    next: Partial<Pick<VuetifyPlayground, 'favorite' | 'pinned' | 'locked' | 'visibility' | 'teamId'> & { title?: string }>,
  ) {
    if (busy.value) return
    busy.value = true
    const previous = { ...item }
    const source = snapshot()
    const sent = Object.hasOwn(next, 'teamId')
    emit('update', { ...item, ...next })
    try {
      const result = await one.patchMeta(next, previous.id, source)
      const teamId = settledTeamId(playgroundTeamId(previous), result, sent)
      emit('update', { ...previous, ...result, teamId })
    } catch {
      emit('update', previous)
    } finally {
      busy.value = false
    }
  }

  function onTeam () {
    const team = userTeam.value
    if (!team) return
    void patch({ teamId: nextTeamId(playgroundTeamId(item), team.id) })
  }

  function onFavorite () {
    void patch({ favorite: !item.favorite })
  }

  function onPin () {
    void patch({ pinned: !(item.pinned ?? false) })
  }

  function onVisibility () {
    void patch({
      visibility: (item.visibility ?? 'public') === 'public' ? 'private' : 'public',
    })
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
        await one.destroy(item.id, snapshot())
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
    class="h-12 box-border flex items-center justify-between gap-3 px-3 rounded-md hover:bg-surface-tint/60"
    :class="selected ? 'bg-primary/5' : ''"
    :data-busy="busy || undefined"
    @click="selecting ? emit('toggle', item.id) : undefined"
  >
    <div class="min-w-0 flex-1 flex items-center gap-2">
      <Checkbox.Root
        v-if="selecting"
        :class="boxClass"
        :label="`Select ${item.title || 'Untitled'}`"
        :model-value="selected"
        @click.stop
        @update:model-value="emit('toggle', item.id)"
      >
        <Checkbox.Indicator class="text-primary text-[10px] leading-none">✓</Checkbox.Indicator>
      </Checkbox.Root>

      <AppJdenticon :value="item.id" />

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

      <Button.Root
        v-else-if="!selecting"
        class="min-w-0 text-sm text-on-surface truncate hover:text-primary border-0 bg-transparent cursor-pointer text-left p-0"
        @click="emit('open', item)"
      >
        {{ item.title || 'Untitled' }}
      </Button.Root>

      <span
        v-else
        class="min-w-0 text-sm text-on-surface truncate"
      >
        {{ item.title || 'Untitled' }}
      </span>

      <span
        v-if="scope === 'team' && item.owner?.name"
        class="shrink-0 max-w-24 text-xs text-on-surface-variant truncate"
      >
        {{ item.owner.name }}
      </span>
    </div>

    <div v-if="!selecting" class="flex items-center gap-1 shrink-0">
      <span class="text-xs text-on-surface-variant tabular-nums me-2">
        {{ formatDate(item.updatedAt || item.createdAt) }}
      </span>

      <AppTooltip
        v-if="isOwner"
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
        v-if="canTeam"
        as="span"
        class="inline-flex"
        :open-delay="200"
        position-area="top"
        :text="teamLabel"
      >
        <Button.Root
          :aria-label="teamLabel"
          :class="actionClass"
          :disabled="busy"
          @click.stop="onTeam"
        >
          <AppIcon
            :class="playgroundTeamId(item) ? 'text-warning' : ''"
            :icon="playgroundTeamId(item) ? 'account-outline' : 'account-group'"
            :size="16"
          />
        </Button.Root>
      </AppTooltip>

      <AppTooltip
        v-if="isOwner"
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
        v-if="isOwner"
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
