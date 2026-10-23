<script lang="ts">
  // Framework
  import { isString, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Card } from './Md1Card.vue'

  // Utilities
  import { onBeforeUnmount, toRef, watch } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'

  export interface Md1CardHeaderProps {
    /** Avatar image URL, drawn at 40 dp. The selected check mark takes its place. */
    avatar?: string
    /** The 14 sp title line. */
    title?: string
    /** The 14 sp subtitle line, at the secondary ink. */
    subtitle?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1CardHeader' })

  defineSlots<{
    /** Trailing content at the end of the row: the overflow menu's icon button. */
    default?: () => any
  }>()

  const { avatar, title, subtitle } = defineProps<Md1CardHeaderProps>()

  const context = useMd1Card()

  orphan('Md1CardHeader', context)

  const locale = useLocale()

  const selected = toRef(() => context?.selected.value ?? false)

  // One predicate for the registration and the template, so an empty `avatar`
  // neither draws an avatar nor takes the check mark away from the root.
  const drawn = toRef(() => isString(avatar) && avatar.length > 0)

  // The avatar is registered with the card so the root leaves the check mark
  // to this header while one is drawn.
  let release: (() => void) | undefined

  watch(drawn, has => {
    release?.()
    release = has ? context?.avatar() : undefined
  }, { immediate: true })

  onBeforeUnmount(() => release?.())
</script>

<template>
  <div class="md1-card__header">
    <span
      v-if="drawn && selected"
      class="md1-card__avatar"
      :data-check="true"
    >
      <Md1Icon
        :label="locale.ti('Md1.selected') ?? 'Selected'"
        name="check"
      />
    </span>

    <img
      v-else-if="drawn"
      alt=""
      class="md1-card__avatar"
      :src="avatar"
    >

    <div
      v-if="title || subtitle"
      class="md1-card__header-text"
    >
      <div
        v-if="title"
        class="md1-card__header-title"
      >{{ title }}</div>

      <div
        v-if="subtitle"
        class="md1-card__header-subtitle"
      >{{ subtitle }}</div>
    </div>

    <slot />
  </div>
</template>
