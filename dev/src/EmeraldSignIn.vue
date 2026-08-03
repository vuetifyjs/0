<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmCheckbox,
    EmTextField,
  } from '@paper/emerald'

  // Utilities
  import { shallowRef } from 'vue'
  import { RouterLink } from 'vue-router'

  const email = shallowRef('')
  const password = shallowRef('')
  const remember = shallowRef(true)
</script>

<template>
  <div class="esi" data-theme="emerald">
    <div aria-hidden="true" class="esi-hero" />

    <div class="esi-panel">
      <EmCard class="esi-card" variant="complete">
        <EmCardBody class="esi-form">
          <div class="esi-brand">
            <span aria-hidden="true" class="esi-brand__mark" />
            <span class="esi-brand__name">Emerald</span>
          </div>

          <div class="esi-head">
            <h1 class="esi-title">Welcome back</h1>
            <p class="esi-sub">Sign in to continue to your workspace</p>
          </div>

          <EmTextField
            v-model="email"
            autocomplete="email"
            label="Email"
            placeholder="you@company.com"
            type="email"
          />

          <EmTextField
            v-model="password"
            autocomplete="current-password"
            label="Password"
            placeholder="••••••••"
            type="password"
          />

          <div class="esi-row">
            <EmCheckbox v-model="remember" size="sm">Remember me</EmCheckbox>
            <a class="esi-link" href="#">Forgot password?</a>
          </div>

          <EmButton class="esi-submit">Sign in</EmButton>

          <p class="esi-footer">
            New here?
            <RouterLink class="esi-link" to="/emerald/contact">Contact sales</RouterLink>
          </p>
        </EmCardBody>
      </EmCard>
    </div>
  </div>
</template>

<style>
  .esi {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--emerald-neutral-200, #f6f8fa);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .esi-hero {
    background:
      linear-gradient(145deg, rgba(1, 96, 58, 0.35), rgba(0, 0, 0, 0.15)),
      url('/emerald/signin-hero.jpg') center / cover no-repeat;
  }

  .esi-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1.5rem, 4vw, 3rem);
  }

  .esi-card.emerald-card {
    width: min(100%, 420px);
    border: 0;
    box-shadow: var(--emerald-shadow-l, 0 5px 12px -1px rgba(51, 51, 51, 0.2));
  }

  .esi-form {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
  }

  .esi-brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .esi-brand__mark {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: linear-gradient(135deg, var(--emerald-primary-600, #1fae60), var(--emerald-primary-400, #94caab));
  }

  .esi-brand__name {
    font-weight: 700;
    font-size: 14px;
  }

  .esi-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .esi-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .esi-sub {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 14px;
  }

  .esi-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .esi-link {
    color: var(--emerald-secondary-600, #00b4dc);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
  }

  .esi-link:hover {
    text-decoration: underline;
  }

  .esi-submit {
    width: 100%;
  }

  .esi-footer {
    margin: 0;
    text-align: center;
    font-size: 14px;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  @media (max-width: 800px) {
    .esi {
      grid-template-columns: 1fr;
    }

    .esi-hero {
      min-height: 28vh;
    }
  }
</style>
