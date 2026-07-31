<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardSubtitle,
    EmCardTitle,
    EmTabs,
    EmTabsItem,
    EmTabsList,
    EmTabsPanel,
    EmTextField,
    EmTextarea,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const tab = shallowRef('profile')
  const first = shallowRef('Jordan')
  const last = shallowRef('Lee')
  const email = shallowRef('jordan@emerald.dev')
  const bio = shallowRef('Design systems engineer building Emerald on v0.')
</script>

<template>
  <EmeraldShell>
    <header class="eset-head">
      <h1 class="eset-title">Settings</h1>
      <p class="eset-sub">Manage your account, preferences, and workspace.</p>
    </header>

    <EmTabs v-model="tab" class="eset-tabs">
      <EmTabsList>
        <EmTabsItem value="profile">Profile</EmTabsItem>
        <EmTabsItem value="account">Account</EmTabsItem>
        <EmTabsItem value="notifications">Notifications</EmTabsItem>
        <EmTabsItem value="billing">Billing</EmTabsItem>
        <EmTabsItem value="security">Security</EmTabsItem>
      </EmTabsList>

      <EmTabsPanel value="profile">
        <EmCard class="eset-card" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="eset-card__title">Profile</EmCardTitle>
            <EmCardSubtitle>This information will appear on your public profile.</EmCardSubtitle>
          </EmCardHeader>

          <EmCardBody class="eset-form">
            <div class="eset-avatar-row">
              <EmAvatar size="lg">
                <EmAvatarFallback>JL</EmAvatarFallback>
              </EmAvatar>

              <div class="eset-avatar-actions">
                <EmButton size="sm">Upload</EmButton>
                <EmButton size="sm" variant="tertiary">Remove</EmButton>
              </div>
            </div>

            <div class="eset-row2">
              <EmTextField v-model="first" label="First name" />
              <EmTextField v-model="last" label="Last name" />
            </div>

            <EmTextField v-model="email" label="Email" type="email" />
            <EmTextarea v-model="bio" label="Bio" :rows="4" />

            <div class="eset-actions">
              <EmButton variant="tertiary">Cancel</EmButton>
              <EmButton>Save changes</EmButton>
            </div>
          </EmCardBody>
        </EmCard>
      </EmTabsPanel>

      <EmTabsPanel value="account">
        <EmCard class="eset-card" variant="simple">
          <EmCardBody>
            <p class="eset-placeholder">Account panel — workspace name, timezone, locale (demo).</p>
          </EmCardBody>
        </EmCard>
      </EmTabsPanel>

      <EmTabsPanel value="notifications">
        <EmCard class="eset-card" variant="simple">
          <EmCardBody>
            <p class="eset-placeholder">Notification preferences panel (demo).</p>
          </EmCardBody>
        </EmCard>
      </EmTabsPanel>

      <EmTabsPanel value="billing">
        <EmCard class="eset-card" variant="simple">
          <EmCardBody>
            <p class="eset-placeholder">Billing panel — see <a href="/emerald/pricing">Pricing</a>.</p>
          </EmCardBody>
        </EmCard>
      </EmTabsPanel>

      <EmTabsPanel value="security">
        <EmCard class="eset-card" variant="simple">
          <EmCardBody>
            <p class="eset-placeholder">Security panel — password, 2FA, sessions (demo).</p>
          </EmCardBody>
        </EmCard>
      </EmTabsPanel>
    </EmTabs>
  </EmeraldShell>
</template>

<style>
  .eset-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .eset-title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .eset-sub {
    margin: 0;
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
  }

  .eset-tabs {
    width: 100%;
    max-width: min(960px, 100%);
    min-width: 0;
  }

  .eset-card.emerald-card {
    margin-top: 16px;
    background: var(--ed-surface, #fefefe);
    border: 1px solid var(--ed-border, #ccd6e7);
    border-radius: 12px;
    padding: 20px 24px;
    max-width: 100%;
    min-width: 0;
    overflow-x: clip;
  }

  .eset-card__title {
    font-size: 16px !important;
    font-weight: 700 !important;
  }

  .eset-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .eset-avatar-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .eset-avatar-actions {
    display: flex;
    gap: 8px;
  }

  .eset-row2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    min-width: 0;
  }

  .eset-row2 > * {
    min-width: 0;
  }

  .eset-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 8px;
  }

  .eset-placeholder {
    margin: 0;
    color: var(--ed-muted, #757e85);
  }

  @media (max-width: 720px) {
    .eset-row2 {
      grid-template-columns: 1fr;
    }
  }
</style>
