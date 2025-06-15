<script setup lang="ts">
  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarInstance, V0AvatarProps, V0AvatarProvide } from './types'

  defineOptions({ name: 'V0AvatarRoot' })

  const {
    borderRadius = '50%',
    src,
    icon,
    loading,
    text,
    ...props
  } = defineProps<V0AvatarProps>()

  const status = shallowRef<V0AvatarInstance['status']>('loading')

  const classes = toRef(() => ({
    'v0-avatar-root': true,
  }))

  const styles = toRef(() => {
    //
  })

  const height = toRef(() => props.height ?? props.size)
  const width = toRef(() => props.width ?? props.size)

  const provides: V0AvatarProvide = toRef(() => ({
    src,
    icon,
    text,
    loading,

    status: status.value,
    setStatus,
  }))

  function setStatus (val: V0AvatarInstance['status']) {
    status.value = val
  }

  provide(V0AvatarKey, provides)
</script>

<template>
  <V0Paper
    v-bind="props"
    :border-radius="borderRadius"
    :class="classes"
    :height="height"
    :style="styles"
    :width="width"
  >
    <slot />
  </V0Paper>
</template>

<style lang="scss">
  @use './variables' as *;

  @layer v0-components {
    .v0-avatar-root {
      align-items: center;
      justify-content: center;
      border-radius: #{$v0-avatar-border-radius};
      display: inline-flex;
      vertical-align: middle;
    }
  }
</style>
