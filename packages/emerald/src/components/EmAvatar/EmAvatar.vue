<script lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'

  // Types
  import type { AvatarRootProps } from '@vuetify/v0'

  export type EmAvatarSize = 'sm' | 'md' | 'lg'

  export interface EmAvatarProps extends Pick<AvatarRootProps, 'value' | 'namespace'> {
    size?: EmAvatarSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatar' })

  const { size = 'md', value, namespace } = defineProps<EmAvatarProps>()
</script>

<template>
  <Avatar.Root class="emerald-avatar" :data-size="size" :namespace :value>
    <slot />
  </Avatar.Root>
</template>

<style>
  .emerald-avatar {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--emerald-radius-full, 999px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.2));
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-neutral-800, #636a70);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    user-select: none;
    flex-shrink: 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .emerald-avatar[data-size='sm'] {
    width: var(--emerald-control-avatar-sm, 32px);
    height: var(--emerald-control-avatar-sm, 32px);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: var(--emerald-text-b3-weight, 400);
  }

  .emerald-avatar[data-size='md'] {
    width: var(--emerald-control-avatar-md, 40px);
    height: var(--emerald-control-avatar-md, 40px);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-weight, 400);
  }

  .emerald-avatar[data-size='lg'] {
    width: var(--emerald-control-avatar-lg, 48px);
    height: var(--emerald-control-avatar-lg, 48px);
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: var(--emerald-text-b1-weight, 400);
  }

  .emerald-avatar__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }

  .emerald-avatar__fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    line-height: 1;
  }
</style>
