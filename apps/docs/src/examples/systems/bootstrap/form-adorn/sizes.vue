<script setup lang="ts">
  import { BFormAdorn } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const small = shallowRef('')
  const medium = shallowRef('')
  const large = shallowRef('')
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <BFormAdorn size="sm">
      <BFormAdorn.Icon>
        <svg
          aria-hidden="true"
          class="bi"
          fill="currentColor"
          height="16"
          viewBox="0 0 16 16"
          width="16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </BFormAdorn.Icon>

      <BFormAdorn.Control v-model="small" placeholder="Small input" />
    </BFormAdorn>

    <BFormAdorn>
      <BFormAdorn.Icon>
        <svg
          aria-hidden="true"
          class="bi"
          fill="currentColor"
          height="16"
          viewBox="0 0 16 16"
          width="16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </BFormAdorn.Icon>

      <BFormAdorn.Control v-model="medium" placeholder="Default input" />
    </BFormAdorn>

    <BFormAdorn size="lg">
      <BFormAdorn.Icon>
        <svg
          aria-hidden="true"
          class="bi"
          fill="currentColor"
          height="16"
          viewBox="0 0 16 16"
          width="16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </BFormAdorn.Icon>

      <BFormAdorn.Control v-model="large" placeholder="Large input" />
    </BFormAdorn>
  </div>
</template>
