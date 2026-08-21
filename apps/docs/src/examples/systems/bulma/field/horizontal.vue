<script setup lang="ts">
  import {
    BuControl,
    BuField,
    BuFieldBody,
    BuFieldLabel,
    BuHelp,
    BuInput,
    BuLabel,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const subject = shallowRef('')
</script>

<template>
  <BuField horizontal>
    <BuFieldLabel size="normal">
      <BuLabel>Subject</BuLabel>
    </BuFieldLabel>

    <BuFieldBody>
      <BuField>
        <BuControl>
          <BuInput
            v-model="subject"
            placeholder="e.g. Partnership opportunity"
          />
        </BuControl>

        <BuHelp color="danger">This field is required</BuHelp>
      </BuField>
    </BuFieldBody>
  </BuField>
</template>
