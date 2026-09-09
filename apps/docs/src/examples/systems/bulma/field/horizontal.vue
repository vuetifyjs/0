<script setup lang="ts">
  import {
    BuControl,
    BuField,
    BuHelp,
    BuInput,
    BuLabel,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const subject = shallowRef('')
</script>

<template>
  <BuField horizontal>
    <BuField.Label size="normal">
      <BuLabel>Subject</BuLabel>
    </BuField.Label>

    <BuField.Body>
      <BuField>
        <BuControl>
          <BuInput
            v-model="subject"
            placeholder="e.g. Partnership opportunity"
          />
        </BuControl>

        <BuHelp color="danger">This field is required</BuHelp>
      </BuField>
    </BuField.Body>
  </BuField>
</template>
