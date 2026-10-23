<script lang="ts">
  // Framework
  import { isString } from '@vuetify/v0'

  import { orphan, useQuNavigationDrawer } from './context'

  export interface QuNavigationDrawerHeaderProps {
    /** The account name: Roboto Medium 14 sp, white. */
    name?: string
    /** The account email address: Roboto Regular 14 sp, white. */
    email?: string
    /** The account avatar's image URL, drawn as a 64 dp circle on the 16 dp keyline. */
    avatar?: string
    /** A background image URL covering the 16:9 block in place of the primary fill. */
    image?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuNavigationDrawerHeader' })

  defineSlots<{
    /** Trailing content of the account row, such as an account switcher. */
    default?: () => any
  }>()

  const { name, email, avatar, image } = defineProps<QuNavigationDrawerHeaderProps>()

  const context = useQuNavigationDrawer()

  orphan('QuNavigationDrawerHeader', context)
</script>

<!-- Styled by QuNavigationDrawer.vue: the root's sheet carries every part rule. -->
<template>
  <div class="quantum-navigation-drawer__header" :data-image="isString(image) || undefined">
    <img
      v-if="isString(image)"
      alt=""
      class="quantum-navigation-drawer__image"
      :src="image"
    >

    <!-- The name beside it already identifies the account, so the picture is decorative. -->
    <img
      v-if="isString(avatar)"
      alt=""
      class="quantum-navigation-drawer__avatar"
      :src="avatar"
    >

    <div class="quantum-navigation-drawer__account">
      <div class="quantum-navigation-drawer__identity">
        <span v-if="isString(name)" class="quantum-navigation-drawer__name">{{ name }}</span>

        <span v-if="isString(email)" class="quantum-navigation-drawer__email">{{ email }}</span>
      </div>

      <slot />
    </div>
  </div>
</template>
