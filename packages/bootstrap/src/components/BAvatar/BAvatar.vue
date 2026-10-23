<script lang="ts">
  // Framework
  import { isString, isUndefined, useLocale } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export type BAvatarStatus = 'online' | 'away' | 'busy' | 'offline'

  export type BAvatarSize = 'xs' | 'sm' | 'lg' | 'xl'

  export interface BAvatarProps {
    src?: string
    alt?: string
    size?: BAvatarSize
    /** Adds `span.avatar-status` plus `status-online|away|busy|offline`. */
    status?: BAvatarStatus
    /** Adds `.avatar-subtle`. */
    subtle?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BAvatar' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    src,
    alt = '',
    size,
    status,
    subtle = false,
  } = defineProps<BAvatarProps>()

  const locale = useLocale()

  const hasSrc = toRef(() => isString(src) && src.length > 0)

  const known = toRef((): BAvatarStatus | undefined => {
    if (!isString(status)) return undefined
    if (status === 'online' || status === 'away' || status === 'busy' || status === 'offline') return status
    return undefined
  })

  function statusText (value: BAvatarStatus): string {
    if (value === 'online') return locale.ti('Avatar.status.online') ?? 'Online'
    if (value === 'away') return locale.ti('Avatar.status.away') ?? 'Away'
    if (value === 'busy') return locale.ti('Avatar.status.busy') ?? 'Busy'
    return locale.ti('Avatar.status.offline') ?? 'Offline'
  }

  const classes = toRef(() => {
    const list = ['avatar']

    if (subtle) list.push('avatar-subtle')
    if (size === 'xs') list.push('avatar-xs')
    if (size === 'sm') list.push('avatar-sm')
    if (size === 'lg') list.push('avatar-lg')
    if (size === 'xl') list.push('avatar-xl')

    return list
  })

  const label = toRef(() => isUndefined(known.value) ? undefined : statusText(known.value))

  const shown = toRef(() => !isUndefined(known.value))

  const statusClass = toRef(() => isUndefined(known.value) ? undefined : `status-${known.value}`)
</script>

<template>
  <span :class="classes">
    <img
      v-if="hasSrc"
      :alt
      class="avatar-img"
      :src
    >

    <slot v-else />

    <span
      v-if="shown"
      :aria-label="label"
      class="avatar-status"
      :class="statusClass"
      role="img"
    />
  </span>
</template>
