<script setup lang="ts">
  // Framework
  import { Avatar, isArray, isString, Popover } from '@vuetify/v0'

  // Context
  import PlaygroundMenuItem from './PlaygroundMenuItem.vue'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const auth = useAuthStore()
  const menu = shallowRef(false)

  const name = toRef(() => {
    const value = auth.user?.name
    return isString(value) && value.length > 0 ? value : 'Signed in'
  })

  const initial = toRef(() => name.value.charAt(0).toUpperCase())

  const picture = toRef(() => {
    const src = auth.user?.picture
    return isString(src) && src.length > 0 ? src : undefined
  })

  const handle = toRef(() => {
    const list = auth.user?.identities
    if (!isArray(list) || list.length === 0) return ''
    const primary = list.find(item => item.primary) ?? list[0]
    const value = primary?.userHandle
    return isString(value) ? value : ''
  })

  async function onLogout () {
    menu.value = false
    await auth.logout()
  }
</script>

<template>
  <div
    v-if="auth.isLoading && !auth.isAuthenticated"
    aria-label="Checking sign-in"
    class="size-6 shrink-0 rounded-full bg-surface-tint animate-pulse"
    role="status"
  />

  <AppTooltip
    v-else-if="!auth.isAuthenticated"
    aria-label="Sign in"
    class="h-8 shrink-0 inline-flex items-center gap-1.5 rounded-full border border-divider bg-surface px-2.5 text-on-surface hover:bg-surface-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    position-area="bottom"
    text="Sign in to Vuetify One"
    @click="auth.dialog = true"
  >
    <AppIcon icon="account" :size="16" />
    <span class="hidden min-[480px]:inline text-xs font-medium">Sign in</span>
  </AppTooltip>

  <Popover.Root v-else v-model="menu">
    <Popover.Activator
      aria-label="Account"
      class="inline-flex shrink-0 items-center justify-center rounded-full cursor-pointer border-0 bg-transparent p-0 hover:ring-2 hover:ring-primary/50 data-[open]:ring-2 data-[open]:ring-primary/50 transition-all"
    >
      <Avatar.Root class="size-6 rounded-full overflow-hidden">
        <Avatar.Image
          v-if="picture"
          alt="User avatar"
          class="size-6 rounded-full object-cover"
          :src="picture"
        />

        <Avatar.Fallback class="size-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-medium">
          {{ initial }}
        </Avatar.Fallback>
      </Avatar.Root>
    </Popover.Activator>

    <Popover.Content
      class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-48"
      position-area="bottom span-left"
    >
      <div class="px-3 py-2 min-w-0">
        <div class="text-sm font-medium text-on-surface truncate">{{ name }}</div>
        <div v-if="handle" class="text-xs text-on-surface-variant truncate">@{{ handle }}</div>
      </div>

      <div class="border-t border-divider my-1" />

      <PlaygroundMenuItem @click="onLogout">
        <AppIcon icon="logout" :size="14" />
        <span class="flex-1">Sign out</span>
      </PlaygroundMenuItem>
    </Popover.Content>
  </Popover.Root>
</template>
