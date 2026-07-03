<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'
  import TextField from './TextField.vue'
  import { useProfile } from './useProfile'

  const { name, email, saved, nameRules, emailRules, save, clear } = useProfile()

  const nameField = useTemplateRef<InstanceType<typeof TextField>>('nameField')
  const emailField = useTemplateRef<InstanceType<typeof TextField>>('emailField')

  async function onSubmit () {
    const results = await Promise.all([
      nameField.value?.validate(),
      emailField.value?.validate(),
    ])

    if (results.every(Boolean)) save()
  }

  function onReset () {
    nameField.value?.reset()
    emailField.value?.reset()
    clear()
  }
</script>

<template>
  <div class="max-w-sm mx-auto flex flex-col gap-4">
    <TextField
      ref="nameField"
      v-model="name"
      autocomplete="name"
      hint="Your full name"
      label="Name"
      required
      :rules="nameRules"
    />

    <TextField
      ref="emailField"
      v-model="email"
      autocomplete="email"
      hint="We'll never share it"
      label="Email"
      required
      :rules="emailRules"
      type="email"
    />

    <div class="flex gap-2">
      <Button.Root
        class="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium"
        @click="onSubmit"
      >
        Save profile
      </Button.Root>

      <Button.Root
        class="px-4 py-2 rounded-lg border border-divider text-on-surface text-sm"
        @click="onReset"
      >
        Reset
      </Button.Root>
    </div>

    <div v-if="saved" class="flex flex-col gap-1 p-4 rounded-lg bg-surface-variant text-on-surface text-sm">
      <p class="font-medium">Saved profile</p>
      <p>{{ saved.name }}</p>
      <p class="text-on-surface-variant">{{ saved.email }}</p>
    </div>
  </div>
</template>
