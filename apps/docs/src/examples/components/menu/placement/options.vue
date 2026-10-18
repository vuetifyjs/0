<script setup lang="ts">
  import ActionsMenu from '../ActionsMenu.vue'
  import PlacementControls from '../PlacementControls.vue'
  import { subs, tries, usePlacement } from '../usePlacement'

  const {
    area,
    fallback,
    subArea,
    hover,
    openDelay,
    closeDelay,
    disabled,
    open,
    delay,
    pick,
  } = usePlacement()
</script>

<template>
  <div class="flex flex-col gap-6">
    <PlacementControls
      v-model:area="area"
      v-model:close-delay="closeDelay"
      v-model:disabled="disabled"
      v-model:fallback="fallback"
      v-model:hover="hover"
      v-model:open-delay="openDelay"
      v-model:sub-area="subArea"
      :pick
      :subs
      :tries
    />

    <p class="font-mono text-xs text-on-surface-variant">
      position-area: {{ area }}
      <br>
      position-try: {{ fallback }}
    </p>

    <ActionsMenu
      v-model:open="open"
      :area
      :close-delay="delay(closeDelay)"
      :disabled
      :fallback
      :hover
      :open-delay="delay(openDelay)"
      :sub-area
    />
  </div>
</template>
