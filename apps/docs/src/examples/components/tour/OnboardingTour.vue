<script setup lang="ts">
  import { Tour } from '@vuetify/v0'
</script>

<template>
  <Tour.Keyboard />

  <Tour.Highlight blocking />

  <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface border border-divider">
    <Tour.Activator
      class="flex-1 rounded-md data-[state=active]:ring-2 data-[state=active]:ring-primary"
      :scroll="false"
      step="search"
    >
      <input
        class="w-full px-3 py-1.5 rounded-md text-sm bg-surface border border-divider text-on-surface"
        placeholder="Search…"
        type="search"
      >
    </Tour.Activator>

    <Tour.Activator
      class="rounded-md data-[state=active]:ring-2 data-[state=active]:ring-primary"
      :scroll="false"
      step="settings"
    >
      <button
        class="px-3 py-1.5 rounded-md text-sm border border-divider bg-surface text-on-surface hover:bg-surface-tint"
        type="button"
      >
        Settings
      </button>
    </Tour.Activator>

    <Tour.Activator
      class="rounded-full data-[state=active]:ring-2 data-[state=active]:ring-primary"
      :scroll="false"
      step="avatar"
    >
      <button
        class="size-8 rounded-full text-xs font-medium bg-primary text-on-primary"
        type="button"
      >
        AJ
      </button>
    </Tour.Activator>
  </div>

  <Tour.Root step="search">
    <Tour.Content
      class="flex flex-col gap-3 p-4 rounded-xl bg-surface border border-divider shadow-xl max-w-xs"
      placement="bottom"
    >
      <Tour.Title class="text-base font-semibold text-on-surface">
        Search
      </Tour.Title>

      <Tour.Description class="text-sm text-on-surface-variant">
        Find pages, docs, and people from the bar.
      </Tour.Description>

      <Tour.Progress class="text-xs text-on-surface-variant" />

      <div class="flex items-center justify-end gap-2">
        <Tour.Skip class="px-3 py-1.5 text-sm font-medium rounded-md text-on-surface-variant hover:bg-surface-tint">
          Skip
        </Tour.Skip>

        <Tour.Prev class="px-3 py-1.5 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint data-[disabled]:opacity-50">
          Back
        </Tour.Prev>

        <Tour.Next
          v-slot="{ isLast }"
          class="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary data-[disabled]:opacity-50"
        >
          {{ isLast ? 'Done' : 'Next' }}
        </Tour.Next>
      </div>
    </Tour.Content>
  </Tour.Root>

  <Tour.Root step="settings">
    <Tour.Content
      class="flex flex-col gap-3 p-4 rounded-xl bg-surface border border-divider shadow-xl max-w-xs"
      placement="bottom"
    >
      <Tour.Title class="text-base font-semibold text-on-surface">
        Settings
      </Tour.Title>

      <Tour.Description class="text-sm text-on-surface-variant">
        Theme, locale, and account preferences live here.
      </Tour.Description>

      <Tour.Progress class="text-xs text-on-surface-variant" />

      <div class="flex items-center justify-end gap-2">
        <Tour.Skip class="px-3 py-1.5 text-sm font-medium rounded-md text-on-surface-variant hover:bg-surface-tint">
          Skip
        </Tour.Skip>

        <Tour.Prev class="px-3 py-1.5 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint data-[disabled]:opacity-50">
          Back
        </Tour.Prev>

        <Tour.Next
          v-slot="{ isLast }"
          class="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary data-[disabled]:opacity-50"
        >
          {{ isLast ? 'Done' : 'Next' }}
        </Tour.Next>
      </div>
    </Tour.Content>
  </Tour.Root>

  <Tour.Root step="avatar">
    <Tour.Content
      class="flex flex-col gap-3 p-4 rounded-xl bg-surface border border-divider shadow-xl max-w-xs"
      placement="bottom"
    >
      <Tour.Title class="text-base font-semibold text-on-surface">
        Account
      </Tour.Title>

      <Tour.Description class="text-sm text-on-surface-variant">
        Open your profile and sign out from the avatar.
      </Tour.Description>

      <Tour.Progress class="text-xs text-on-surface-variant" />

      <div class="flex items-center justify-end gap-2">
        <Tour.Skip class="px-3 py-1.5 text-sm font-medium rounded-md text-on-surface-variant hover:bg-surface-tint">
          Skip
        </Tour.Skip>

        <Tour.Prev class="px-3 py-1.5 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint data-[disabled]:opacity-50">
          Back
        </Tour.Prev>

        <Tour.Next
          v-slot="{ isLast }"
          class="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary data-[disabled]:opacity-50"
        >
          {{ isLast ? 'Done' : 'Next' }}
        </Tour.Next>
      </div>
    </Tour.Content>
  </Tour.Root>
</template>
