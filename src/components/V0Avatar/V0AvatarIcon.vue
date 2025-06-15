<script lang="ts" setup>
  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarIconProps, V0AvatarProvide } from './types'

  defineOptions({ name: 'V0AvatarIcon' })

  const props = defineProps<V0AvatarIconProps>()

  const injected = inject<V0AvatarProvide>(V0AvatarKey)

  const icon = toRef(() => props.icon || toValue(injected)?.icon)
  const src = toRef(() => toValue(injected)?.src)

</script>

<template>
  <V0Icon
    v-if="!src && icon"
    class="v0-avatar-icon"
    :icon
  />
</template>
