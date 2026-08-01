<script setup lang="ts">
  defineOptions({ name: 'OnyxTabs' })

  const activeTab = shallowRef('account')
  const activeFullWidth = shallowRef('account')
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Tabs default to hugging their content — a full-width variant is layout only, no separate
    component or prop.
  </p>

  <OnAlert class="mt-6" variant="info">
    <template #icon>i</template>
    <OnAlertTitle>Keyboard</OnAlertTitle>

    <OnAlertDescription>
      Arrow keys move selection between tabs (Left/Right, or Up/Down for a vertical list);
      Home/End jump to the first or last tab; Enter activates the focused tab in
      manual-activation mode. Tab itself moves focus into and out of the tablist as a single
      stop — it never cycles through individual tabs.
    </OnAlertDescription>
  </OnAlert>

  <h2 class="onyx-tabs-page__heading mt-8">Default</h2>

  <OnTabs v-model="activeTab" class="mt-3" style="max-width: 420px;">
    <OnTabsList>
      <OnTabsItem value="account">Account</OnTabsItem>
      <OnTabsItem value="password">Password</OnTabsItem>
      <OnTabsItem value="team">Team</OnTabsItem>
    </OnTabsList>

    <OnTabsPanel value="account">Manage your account details here.</OnTabsPanel>
    <OnTabsPanel value="password">Update your password here.</OnTabsPanel>
    <OnTabsPanel value="team">Manage your team members here.</OnTabsPanel>
  </OnTabs>

  <h2 class="onyx-tabs-page__heading mt-8">Full-width</h2>

  <OnTabs v-model="activeFullWidth" class="onyx-tabs-page__full-width mt-3" style="max-width: 420px;">
    <OnTabsList>
      <OnTabsItem value="account">Account</OnTabsItem>
      <OnTabsItem value="password">Password</OnTabsItem>
      <OnTabsItem value="team">Team</OnTabsItem>
    </OnTabsList>

    <OnTabsPanel value="account">Manage your account details here.</OnTabsPanel>
    <OnTabsPanel value="password">Update your password here.</OnTabsPanel>
    <OnTabsPanel value="team">Manage your team members here.</OnTabsPanel>
  </OnTabs>
</template>

<!-- Unscoped: page-local heading + full-width layout override, layout scaffolding only. -->
<style>
  .onyx-tabs-page__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }

  .onyx-tabs-page__full-width .onyx-tabs__list {
    display: flex;
    width: 100%;
  }

  .onyx-tabs-page__full-width .onyx-tabs__item {
    flex: 1 1 0;
  }
</style>
