<script setup lang="ts">
  defineOptions({ name: 'OnyxFormElements' })

  const textEmpty = shallowRef('')
  const textFilled = shallowRef('Jane Doe')
  const textError = shallowRef('')

  const passwordEmpty = shallowRef('')
  const passwordFilled = shallowRef('supersecret')
  const passwordError = shallowRef('abc')

  const emailEmpty = shallowRef('')
  const emailFilled = shallowRef('jane@example.com')
  const emailError = shallowRef('not-an-email')

  const withDescription = shallowRef('')
  const disabledValue = shallowRef('Locked value')

  const sizeSm = shallowRef('')
  const sizeMd = shallowRef('')
  const sizeLg = shallowRef('')
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    <code>OnInput</code> covers text, password, and email — password fields ship a built-in
    reveal toggle, no extra markup needed.
  </p>

  <OnAlert class="mt-6" variant="info">
    <template #icon>i</template>
    <OnAlertTitle>DatePicker isn't here yet</OnAlertTitle>

    <OnAlertDescription>
      Deferred until v0's draft <code>DatePicker</code> primitive graduates past draft
      maturity — see <code>SPEC.md</code>'s non-goals for wave 1.
    </OnAlertDescription>
  </OnAlert>

  <h2 class="onyx-form__heading mt-8">Text, password, email</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">Empty · filled · error</p>

    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
      <div class="flex flex-col gap-4">
        <p class="onyx-hallmark" style="opacity: 0.7;">Text</p>
        <OnInput v-model="textEmpty" label="Full name" placeholder="Jane Doe" />
        <OnInput v-model="textFilled" description="As it appears on your ID." label="Full name" placeholder="Jane Doe" />
        <OnInput v-model="textError" error="This field is required." label="Full name" placeholder="Jane Doe" />
      </div>

      <div class="flex flex-col gap-4">
        <p class="onyx-hallmark" style="opacity: 0.7;">Password</p>
        <OnInput v-model="passwordEmpty" label="Password" placeholder="••••••••" type="password" />
        <OnInput v-model="passwordFilled" description="Click the eye to reveal it." label="Password" type="password" />
        <OnInput v-model="passwordError" error="Password is too short." label="Password" type="password" />
      </div>

      <div class="flex flex-col gap-4">
        <p class="onyx-hallmark" style="opacity: 0.7;">Email</p>
        <OnInput v-model="emailEmpty" label="Email" placeholder="you@example.com" type="email" />
        <OnInput v-model="emailFilled" description="We'll never share it." label="Email" type="email" />
        <OnInput v-model="emailError" error="Enter a valid email address." label="Email" type="email" />
      </div>
    </div>
  </div>

  <h2 class="onyx-form__heading mt-8">Description &amp; disabled</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">Description · locked</p>

    <div class="flex flex-col gap-4" style="max-width: 320px;">
      <OnInput v-model="withDescription" description="Shown below the field, not as a tooltip." label="Team name" placeholder="Acme Inc." />
      <OnInput v-model="disabledValue" disabled label="Locked field" />
    </div>
  </div>

  <h2 class="onyx-form__heading mt-8">Sizes</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">sm · md · lg</p>

    <div class="flex flex-wrap items-end gap-3">
      <OnInput v-model="sizeSm" label="Small" placeholder="sm" size="sm" />
      <OnInput v-model="sizeMd" label="Medium" placeholder="md" size="md" />
      <OnInput v-model="sizeLg" label="Large" placeholder="lg" size="lg" />
    </div>
  </div>
</template>

<!-- Unscoped: page-local heading, layout scaffolding only. -->
<style>
  .onyx-form__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
