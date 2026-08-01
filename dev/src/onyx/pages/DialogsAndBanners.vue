<script setup lang="ts">
  defineOptions({ name: 'OnyxDialogsAndBanners' })

  const dialogOpen = shallowRef(false)
  const sheetOpen = shallowRef(false)

  const bannerDismissed = shallowRef(false)

  function onRestore () {
    bannerDismissed.value = false
  }
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Dialogs render on the native <code>&lt;dialog&gt;</code> element — focus trap, backdrop,
    and Esc-to-close come from the browser, not from hand-rolled logic.
  </p>

  <h2 class="onyx-dab__heading mt-8">Dialog</h2>

  <div class="flex items-center gap-3 mt-3">
    <OnDialog v-model="dialogOpen">
      <OnDialogActivator v-slot="{ attrs }" renderless>
        <OnButton v-bind="attrs">Delete project</OnButton>
      </OnDialogActivator>

      <OnDialogContent>
        <OnDialogClose />
        <OnDialogTitle>Delete project</OnDialogTitle>

        <OnDialogDescription>
          This action cannot be undone. This will permanently delete the project and remove
          its data from our servers.
        </OnDialogDescription>

        <OnDialogFooter>
          <OnButton variant="outline" @click="dialogOpen = false">Cancel</OnButton>
          <OnButton variant="destructive" @click="dialogOpen = false">Delete</OnButton>
        </OnDialogFooter>
      </OnDialogContent>
    </OnDialog>

    <span style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px;">
      Esc closes it — that's the native <code>&lt;dialog&gt;</code>'s own cancel event, not a
      keydown handler this package wrote.
    </span>
  </div>

  <h2 class="onyx-dab__heading mt-8">Sheet</h2>

  <div class="flex items-center gap-3 mt-3">
    <OnDialog v-model="sheetOpen">
      <OnDialogActivator v-slot="{ attrs }" renderless>
        <OnButton v-bind="attrs" variant="outline">Notification settings</OnButton>
      </OnDialogActivator>

      <OnDialogContent mode="sheet">
        <OnDialogClose />
        <OnDialogTitle>Notification settings</OnDialogTitle>
        <OnDialogDescription>Choose how you want to be notified about activity.</OnDialogDescription>

        <OnDialogFooter>
          <OnButton @click="sheetOpen = false">Done</OnButton>
        </OnDialogFooter>
      </OnDialogContent>
    </OnDialog>

    <span style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px;">
      Same component, <code>mode="sheet"</code> — below 768px it docks to the bottom edge
      instead of centering.
    </span>
  </div>

  <h2 class="onyx-dab__heading mt-8">Banners</h2>

  <div class="flex flex-col gap-3 mt-3">
    <OnBanner>
      A new version of Onyx is available.
    </OnBanner>

    <OnBanner v-if="!bannerDismissed" dismissible @dismiss="bannerDismissed = true">
      This banner can be dismissed — try it.
    </OnBanner>

    <OnButton v-else size="sm" variant="outline" @click="onRestore">Restore banner</OnButton>

    <OnBanner>
      A new version of Onyx is available.

      <template #actions>
        <OnButton size="sm" variant="outline">Refresh</OnButton>
      </template>
    </OnBanner>
  </div>
</template>

<!-- Unscoped: page-local heading, layout scaffolding only. -->
<style>
  .onyx-dab__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
