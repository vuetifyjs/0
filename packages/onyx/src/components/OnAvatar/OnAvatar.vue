<script lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'

  export type OnAvatarSize = 'sm' | 'md' | 'lg'

  export interface OnAvatarProps {
    alt?: string
    size?: OnAvatarSize
    src?: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'OnAvatar' })

  const { alt, size = 'md', src } = defineProps<OnAvatarProps>()

  // Initials from `alt`: first letter of each of the first two words, plain string logic.
  const initials = toRef(() => {
    if (!alt) return ''
    const words = alt.trim().split(/\s+/).filter(Boolean)
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')
  })
</script>

<template>
  <Avatar.Root as="span" class="onyx-avatar" :data-size="size">
    <Avatar.Image :alt class="onyx-avatar__image" :src />

    <Avatar.Fallback class="onyx-avatar__fallback">
      {{ initials }}
    </Avatar.Fallback>
  </Avatar.Root>
</template>

<!-- Unscoped: Avatar.Image/Avatar.Fallback are compound children from v0's own file
     scope, rendered inside Avatar.Root; scoped data-v never reaches their roots
     (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-avatar {
    align-items: center;
    background: var(--onyx-muted, #211c19);
    border-radius: 9999px;
    color: var(--onyx-muted-foreground, #bab3ab);
    display: inline-flex;
    flex-shrink: 0;
    font-weight: 550;
    justify-content: center;
    overflow: hidden;
  }

  .onyx-avatar[data-size='sm'] {
    font-size: var(--onyx-text-xs-size, 12px);
    height: 24px;
    width: 24px;
  }

  .onyx-avatar[data-size='md'] {
    font-size: var(--onyx-text-sm-size, 13.5px);
    height: 32px;
    width: 32px;
  }

  .onyx-avatar[data-size='lg'] {
    font-size: var(--onyx-text-base-size, 15px);
    height: 40px;
    width: 40px;
  }

  .onyx-avatar__image {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .onyx-avatar__fallback {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
</style>
