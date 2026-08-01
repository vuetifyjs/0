<script setup lang="ts">
  defineOptions({ name: 'OnyxLists' })

  const groupOpen = shallowRef(true)

  const avatarSrc = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%233f3f46\'/%3E%3C/svg%3E'
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    <code>OnList</code> is the shared row container; <code>two</code>, avatars, and
    <code>OnListGroup</code> are all composition, not separate list components.
  </p>

  <div class="grid gap-6 mt-6" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div>
      <h2 class="onyx-lists__heading">Flat</h2>

      <OnList class="mt-3">
        <OnListItem>Inbox</OnListItem>
        <OnListItem active>Sent</OnListItem>
        <OnListItem>Drafts</OnListItem>
      </OnList>
    </div>

    <div>
      <h2 class="onyx-lists__heading">Two-line</h2>

      <OnList class="mt-3">
        <OnListItem two>
          <strong>Payment received</strong>
          <div>Invoice #1042 — $240.00</div>
        </OnListItem>

        <OnListItem two>
          <strong>Subscription renewed</strong>
          <div>Pro plan — monthly</div>
        </OnListItem>
      </OnList>
    </div>

    <div>
      <h2 class="onyx-lists__heading">Grouped / collapsible</h2>

      <OnListGroup v-model="groupOpen" class="mt-3" title="Settings">
        <OnList>
          <OnListItem>Profile</OnListItem>
          <OnListItem>Security</OnListItem>
          <OnListItem>Notifications</OnListItem>
        </OnList>
      </OnListGroup>
    </div>

    <div>
      <h2 class="onyx-lists__heading">Avatar</h2>

      <OnList class="mt-3">
        <OnListItem two>
          <template #leading>
            <OnAvatar alt="Jane Doe" size="sm" :src="avatarSrc" />
          </template>

          <strong>Jane Doe</strong>
          <div>jane@example.com</div>

          <template #trailing>
            <OnBadge variant="secondary">Admin</OnBadge>
          </template>
        </OnListItem>

        <OnListItem two>
          <template #leading>
            <OnAvatar alt="Kelly Wong" size="sm" />
          </template>

          <strong>Kelly Wong</strong>
          <div>kelly@example.com</div>
        </OnListItem>
      </OnList>
    </div>
  </div>
</template>

<!-- Unscoped: page-local heading, layout scaffolding only. -->
<style>
  .onyx-lists__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
