<script setup lang="ts">
  // Framework
  import { Popover, Switch, useBreakpoints, useStorage, useTimer } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'
  import PlaygroundAuthDialog from '@/components/playground/app/PlaygroundAuthDialog.vue'
  import PlaygroundMenuItem from '@/components/playground/app/PlaygroundMenuItem.vue'
  import PlaygroundSaveDialog from '@/components/playground/app/PlaygroundSaveDialog.vue'
  import PlaygroundOpenDialog from '@/components/playground/open/PlaygroundOpenDialog.vue'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'

  // Composables
  import { formatActiveFile } from '@/composables/formatActiveFile'
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  const auth = useAuthStore()
  const playground = usePlayground()
  const {
    currentId: oneId,
    currentTitle: oneTitle,
    currentMeta,
    isOwner,
    saving: oneSaving,
    autosaveEnabled,
    setAutosave,
    patchMeta,
    destroy,
    fork,
  } = useOnePlaygrounds()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const sidePref = storage.get('playground-preview-right', false)

  const menu = shallowRef(false)
  const file = shallowRef(false)
  const view = shallowRef(false)
  const confirming = shallowRef(false)
  const confirmDelete = shallowRef(false)
  const dialog = shallowRef(false)
  const saveOpen = shallowRef(false)
  const saveAs = shallowRef(false)
  const lifecycleStatus = shallowRef<'idle' | 'busy'>('idle')

  const canDelete = toRef(() => !currentMeta.value.favorite && !currentMeta.value.locked)

  const resetTimer = useTimer(() => {
    confirming.value = false
  }, { duration: 3000 })

  const deleteTimer = useTimer(() => {
    confirmDelete.value = false
  }, { duration: 3000 })

  watch(menu, open => {
    if (!open) {
      resetTimer.stop()
      deleteTimer.stop()
      confirming.value = false
      confirmDelete.value = false
    }
  })

  function onSubmenu (target: 'file' | 'view') {
    file.value = target === 'file'
    view.value = target === 'view'
  }

  function onOpen () {
    menu.value = false
    dialog.value = true
  }

  function onSave (asNew = false) {
    menu.value = false
    file.value = false
    saveAs.value = asNew
    saveOpen.value = true
  }

  function onReset () {
    if (confirming.value) {
      resetTimer.stop()
      confirming.value = false
      menu.value = false
      playground.applyPreset(playground.activePreset.value)
    } else {
      confirming.value = true
      resetTimer.start()
    }
  }

  function onTree () {
    menu.value = false
    playground.tree.value = !playground.tree.value
  }

  function onFormat () {
    menu.value = false
    file.value = false
    void formatActiveFile()
  }

  function onCheatsheet () {
    menu.value = false
    view.value = false
    playground.cheatsheet.value = true
  }

  function onSide () {
    menu.value = false
    playground.side.value = !playground.side.value
    playground.bottom.value = !playground.bottom.value
    sidePref.value = playground.side.value
  }

  function onIntro () {
    menu.value = false
    playground.left.value = !playground.left.value
    const open = playground.left.value

    if (open && !breakpoints.isMobile.value && playground.side.value) {
      playground.side.value = false
      playground.bottom.value = true
    } else if (!open && !breakpoints.isMobile.value && sidePref.value && !playground.side.value) {
      playground.side.value = true
      playground.bottom.value = false
    }
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

  async function onToggleFavorite () {
    if (lifecycleStatus.value === 'busy') return
    lifecycleStatus.value = 'busy'
    try {
      await patchMeta({ favorite: !currentMeta.value.favorite })
    } catch {
      // Ignore — user can retry
    } finally {
      lifecycleStatus.value = 'idle'
    }
  }

  async function onTogglePinned () {
    if (lifecycleStatus.value === 'busy') return
    lifecycleStatus.value = 'busy'
    try {
      await patchMeta({ pinned: !currentMeta.value.pinned })
    } catch {
      // Ignore
    } finally {
      lifecycleStatus.value = 'idle'
    }
  }

  async function onToggleLocked () {
    if (lifecycleStatus.value === 'busy') return
    lifecycleStatus.value = 'busy'
    try {
      await patchMeta({ locked: !currentMeta.value.locked })
    } catch {
      // Ignore
    } finally {
      lifecycleStatus.value = 'idle'
    }
  }

  async function onToggleVisibility () {
    if (lifecycleStatus.value === 'busy') return
    lifecycleStatus.value = 'busy'
    try {
      const newVisibility = currentMeta.value.visibility === 'public' ? 'private' : 'public'
      await patchMeta({ visibility: newVisibility })
    } catch {
      // Ignore
    } finally {
      lifecycleStatus.value = 'idle'
    }
  }

  async function onDelete () {
    if (!canDelete.value) return

    if (confirmDelete.value) {
      deleteTimer.stop()
      confirmDelete.value = false
      lifecycleStatus.value = 'busy'
      try {
        await destroy()
        menu.value = false
        file.value = false
      } catch {
        // Ignore
      } finally {
        lifecycleStatus.value = 'idle'
      }
    } else {
      confirmDelete.value = true
      deleteTimer.start()
    }
  }

  async function onFork () {
    if (lifecycleStatus.value === 'busy') return

    const ok = await ensureAuth()
    if (!ok) return

    lifecycleStatus.value = 'busy'
    try {
      await fork(() => playground.snapshotContent())
      menu.value = false
      file.value = false
    } catch {
      // Ignore
    } finally {
      lifecycleStatus.value = 'idle'
    }
  }
</script>

<template>
  <Popover.Root v-model="menu">
    <Popover.Activator
      class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
      :class="menu ? 'opacity-80' : 'opacity-50'"
      target="playground-menu"
      title="Menu"
    >
      <AppIcon icon="menu" />
    </Popover.Activator>

    <Popover.Content
      id="playground-menu"
      class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-40"
      position-area="bottom span-right"
    >
      <!-- File submenu -->
      <Popover.Root v-model="file">
        <Popover.Activator
          class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors cursor-pointer text-left"
          target="playground-menu-file"
          @focus="onSubmenu('file')"
          @mouseenter="onSubmenu('file')"
        >
          <span>File</span>
          <AppIcon icon="chevron-right" :size="14" />
        </Popover.Activator>

        <Popover.Content
          id="playground-menu-file"
          class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-48"
          style="position-area: unset; inset-area: unset; top: anchor(top); left: anchor(right); position-try-fallbacks: flip-block;"
        >
          <PlaygroundMenuItem @click="onOpen">
            Open
          </PlaygroundMenuItem>

          <div class="border-t border-divider my-1" />

          <!--
            Linked: always One# identity + autosave switch (toggle only gates API writes).
            Unlinked: Save to Vuetify One.
          -->
          <div
            v-if="oneId"
            class="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs"
          >
            <span class="min-w-0 flex-1 truncate tabular-nums text-on-surface-variant">
              One#{{ oneId }}
            </span>

            <AppTooltip
              as="span"
              class="inline-flex shrink-0 text-on-surface-variant opacity-80"
              :open-delay="200"
              position-area="top"
              :text="oneSaving
                ? 'Syncing…'
                : autosaveEnabled
                  ? `Auto-saving to Vuetify One (${oneTitle})`
                  : 'Auto-save off'"
            >
              <AppIcon
                :class="!autosaveEnabled && !oneSaving ? 'opacity-40' : ''"
                :icon="oneSaving ? 'cloud-sync' : 'cloud-check'"
                :size="14"
              />
            </AppTooltip>

            <Switch.Root
              aria-label="Auto-save"
              class="shrink-0 inline-flex items-center border-none bg-transparent p-0 outline-none"
              :model-value="autosaveEnabled"
              @update:model-value="setAutosave"
            >
              <Switch.Track class="relative inline-flex items-center rounded-full transition-colors h-4 w-7 bg-surface-variant data-[state=checked]:bg-primary">
                <Switch.Thumb class="block size-3 rounded-full bg-on-surface-variant shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:bg-on-primary" />
              </Switch.Track>
            </Switch.Root>
          </div>

          <PlaygroundMenuItem
            v-else
            @click="onSave(false)"
          >
            Save to Vuetify One
          </PlaygroundMenuItem>

          <PlaygroundMenuItem
            v-if="oneId"
            @click="onSave(false)"
          >
            Rename
          </PlaygroundMenuItem>

          <PlaygroundMenuItem
            v-if="oneId"
            @click="onSave(true)"
          >
            Save as new
          </PlaygroundMenuItem>

          <!-- Lifecycle actions for linked playgrounds -->
          <template v-if="oneId">
            <div class="border-t border-divider my-1" />

            <!-- Owner actions -->
            <template v-if="isOwner">
              <PlaygroundMenuItem
                :disabled="lifecycleStatus === 'busy'"
                @click="onToggleVisibility"
              >
                <AppIcon
                  :icon="currentMeta.visibility === 'public' ? 'visibility-public' : 'visibility-private'"
                  :size="14"
                />

                <span class="flex-1">{{ currentMeta.visibility === 'public' ? 'Make Private' : 'Make Public' }}</span>
              </PlaygroundMenuItem>

              <PlaygroundMenuItem
                :disabled="lifecycleStatus === 'busy'"
                @click="onToggleFavorite"
              >
                <AppIcon
                  :icon="currentMeta.favorite ? 'star' : 'star-outline'"
                  :size="14"
                />

                <span class="flex-1">{{ currentMeta.favorite ? 'Unfavorite' : 'Favorite' }}</span>
              </PlaygroundMenuItem>

              <PlaygroundMenuItem
                :disabled="lifecycleStatus === 'busy'"
                @click="onTogglePinned"
              >
                <AppIcon
                  :icon="currentMeta.pinned ? 'pin' : 'pin-outline'"
                  :size="14"
                />

                <span class="flex-1">{{ currentMeta.pinned ? 'Unpin' : 'Pin' }}</span>
              </PlaygroundMenuItem>

              <PlaygroundMenuItem
                :disabled="lifecycleStatus === 'busy'"
                @click="onToggleLocked"
              >
                <AppIcon
                  :icon="currentMeta.locked ? 'lock' : 'lock-open'"
                  :size="14"
                />

                <span class="flex-1">{{ currentMeta.locked ? 'Unlock' : 'Lock' }}</span>
              </PlaygroundMenuItem>

              <div class="border-t border-divider my-1" />

              <AppTooltip
                as="span"
                class="block w-full"
                :open-delay="canDelete ? undefined : 0"
                position-area="right"
                :text="canDelete ? undefined : 'Remove favorite and unlock first'"
              >
                <PlaygroundMenuItem
                  :confirm="confirmDelete"
                  :disabled="!canDelete || lifecycleStatus === 'busy'"
                  @click="onDelete"
                >
                  <AppIcon icon="delete" :size="14" />
                  <span class="flex-1">{{ confirmDelete ? 'Click to confirm' : 'Delete' }}</span>
                </PlaygroundMenuItem>
              </AppTooltip>
            </template>

            <!-- Non-owner: Fork action -->
            <PlaygroundMenuItem
              v-else
              :disabled="lifecycleStatus === 'busy'"
              @click="onFork"
            >
              <AppIcon icon="fork" :size="14" />
              <span class="flex-1">Fork</span>
            </PlaygroundMenuItem>
          </template>

          <div class="border-t border-divider my-1" />

          <PlaygroundMenuItem @click="onFormat">
            <span class="flex-1">Format</span>
            <span class="text-on-surface/40 text-2.5">Ctrl+S</span>
          </PlaygroundMenuItem>

          <div class="border-t border-divider my-1" />

          <PlaygroundMenuItem
            :confirm="confirming"
            @click="onReset"
          >
            {{ confirming ? 'Click to confirm' : 'Reset Playground' }}
          </PlaygroundMenuItem>
        </Popover.Content>
      </Popover.Root>

      <!-- View submenu -->
      <Popover.Root v-model="view">
        <Popover.Activator
          class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors cursor-pointer text-left"
          target="playground-menu-view"
          @focus="onSubmenu('view')"
          @mouseenter="onSubmenu('view')"
        >
          <span>View</span>
          <AppIcon icon="chevron-right" :size="14" />
        </Popover.Activator>

        <Popover.Content
          id="playground-menu-view"
          class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-48"
          style="position-area: unset; inset-area: unset; top: anchor(top); left: anchor(right); position-try-fallbacks: flip-block;"
        >
          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onTree"
          >
            <AppIcon :icon="playground.tree.value ? 'folder-open' : 'folder'" :size="14" />
            <span class="flex-1">File Tree</span>
            <span class="text-on-surface/40 text-2.5">Ctrl+B</span>
          </button>

          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors text-left"
            :class="playground.left.value ? 'text-on-surface/40 cursor-not-allowed' : 'text-on-surface hover:bg-surface-tint'"
            type="button"
            @click="!playground.left.value && onSide()"
          >
            <AppIcon :icon="playground.side.value ? 'layout-vertical' : 'layout-horizontal'" :size="14" />
            {{ playground.side.value ? 'Preview Bottom' : 'Preview Right' }}
          </button>

          <div class="border-t border-divider my-1" />

          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onIntro"
          >
            <AppIcon :icon="playground.left.value ? 'book-open' : 'book-closed'" :size="14" />
            Intro Panel
          </button>

          <div class="border-t border-divider my-1" />

          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onCheatsheet"
          >
            <AppIcon icon="keyboard" :size="14" />
            <span class="flex-1">Keyboard shortcuts</span>
            <span class="text-on-surface/40 text-2.5">?</span>
          </button>
        </Popover.Content>
      </Popover.Root>
    </Popover.Content>
  </Popover.Root>

  <PlaygroundOpenDialog
    v-if="dialog"
    @close="dialog = false"
  />

  <PlaygroundSaveDialog
    v-model="saveOpen"
    :as-new="saveAs"
  />

  <PlaygroundAuthDialog />
</template>
