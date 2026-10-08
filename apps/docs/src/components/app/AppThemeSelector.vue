<script setup lang="ts">
  // Framework
  import { Button, Popover } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useCustomThemes } from '@/composables/useCustomThemes'
  import { useSettings } from '@/composables/useSettings'
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Themes
  import { exportThemeAsVuetifyConfig, themes, type ThemeId } from '@/themes'

  // Utilities
  import { shallowRef, toRef, useId } from 'vue'
  import { useRouter } from 'vue-router'

  const { example = false } = defineProps<{
    /**
     * Corner chip on an example preview. Same menu as the app bar.
     * Site actions (create, browse, edit, close) stay on the app bar;
     * an overridden preview shows Follow page instead.
     */
    example?: boolean
  }>()

  const router = useRouter()

  const toggle = useThemeToggleController()
  const { customThemes, editor } = useCustomThemes()
  const clipboard = useClipboard()
  const settings = useSettings()

  const isOpen = shallowRef(false)
  const uid = useId()
  const id = toRef(() => (example ? uid : 'theme-selector'))

  const activator = toRef(() => (
    example
      ? 'bg-surface-tint text-on-surface-tint hover:bg-surface-tint pa-1 inline-flex rounded-none rounded-bl-[0.375rem] cursor-pointer data-[state=open]:bg-surface-tint'
      : 'bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant data-[state=open]:bg-surface-variant transition-all cursor-pointer'
  ))

  function onCopy () {
    // This menu follows the nearest toggle: the page one in the app bar,
    // the preview's own one inside an example.
    const themeId = String(toggle.currentThemeId.value)
    const preset = Object.hasOwn(themes, themeId) ? themes[themeId as ThemeId] : undefined
    const custom = customThemes.value.find(item => item.id === themeId)
    const colors = toggle.theme.colors.value[themeId] ?? custom?.colors ?? preset?.colors ?? themes.light.colors

    clipboard.copy(exportThemeAsVuetifyConfig({
      dark: toggle.theme.get(themeId)?.dark ?? custom?.dark ?? preset?.dark ?? false,
      colors,
    }))
  }

  function onBrowse () {
    isOpen.value = false
    router.push('/guide/features/palettes')
  }

  function onCreate () {
    isOpen.value = false
    settings.open()
    editor.open()
  }

  function onEdit (themeId: string) {
    isOpen.value = false
    settings.open()
    editor.edit(themeId)
  }
</script>

<template>
  <Popover.Root :id v-model="isOpen">
    <AppTooltip
      as="span"
      :class="example ? 'mt-[8px] me-[8px] inline-flex' : 'inline-flex'"
      position-area="bottom"
      :text="toggle.title.value"
    >
      <Popover.Activator
        :aria-label="example ? 'Example theme' : 'Select theme'"
        :class="activator"
        :data-state="isOpen ? 'open' : undefined"
      >
        <AppIcon :icon="toggle.icon.value" />
      </Popover.Activator>
    </AppTooltip>

    <Popover.Content
      :id
      :class="example
        ? 'p-3 rounded-lg bg-surface border border-divider shadow-xl min-w-56 justify-self-end self-start'
        : 'p-3 rounded-lg bg-surface border border-divider shadow-xl min-w-56 !mt-1'"
      position-area="bottom span-left"
      :position-try="example
        ? 'bottom span-left, top span-left, bottom span-right, top span-right'
        : 'bottom span-left, bottom span-right, top span-left, top span-right'"
    >
      <div class="flex items-center justify-between mb-3 ps-1">
        <span class="text-xs font-semibold text-on-surface">Theme</span>

        <div class="flex items-center" :class="example ? 'gap-2' : 'gap-0.5'">
          <Button.Root
            v-if="example && toggle.isOverridden.value"
            class="text-xs font-medium text-primary cursor-pointer"
            @click="toggle.reset()"
          >
            Follow page
          </Button.Root>

          <AppTooltip
            aria-label="Copy theme as Vuetify0 config"
            class="p-1 rounded hover:bg-surface-tint transition-colors inline-flex items-center justify-center text-on-surface-variant"
            text="Copy theme as Vuetify0 config"
            @click="onCopy"
          >
            <AppIcon :icon="clipboard.copied.value ? 'check-circle' : 'copy'" size="14" />
          </AppTooltip>

          <AppCloseButton v-if="!example" size="sm" @click="isOpen = false" />
        </div>
      </div>

      <AppThemeMenu :editable="!example" @edit="onEdit">
        <template v-if="!example" #palettes-footer>
          <Button.Root
            class="w-full text-xs text-primary border border-primary rounded py-1.5 transition-colors hover:bg-primary/15 text-center mt-2"
            @click="onBrowse"
          >
            Browse Palettes
          </Button.Root>
        </template>
      </AppThemeMenu>

      <Button.Root
        v-if="!example"
        class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-divider text-sm text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-colors mt-3"
        @click="onCreate"
      >
        <AppIcon icon="plus" size="16" />
        <span>Create Theme</span>
      </Button.Root>
    </Popover.Content>
  </Popover.Root>
</template>
