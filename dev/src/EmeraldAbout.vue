<script setup lang="ts">
  import { EmDivider } from '@paper/emerald'

  import { installEmeraldTheme } from './emerald-theme'

  installEmeraldTheme()
</script>

<template>
  <div class="ea" data-theme="emerald">
    <article class="ea-doc">
      <header class="ea-header">
        <span aria-hidden="true" class="ea-logo" />
        <h1 class="ea-title">About Emerald</h1>
        <EmDivider />
      </header>

      <section>
        <h2>Welcome</h2>

        <p>
          Emerald is the first commercial design system built on
          <strong>@vuetify/v0</strong> — a thin, Figma-tokened skin that showcases
          how easy and capable headless Vue primitives can be.
        </p>
      </section>

      <section>
        <h2>Mission</h2>

        <p>
          Sell v0 by making adoption trivial: two CSS imports, one plugin, and Em*
          components that compose real accessibility, forms, and dialogs without a
          named-slot tax or a Paper middle layer.
        </p>
      </section>

      <section>
        <h2>Principles</h2>
        <p>Emerald follows a short, non-negotiable contract:</p>

        <ul>
          <li><strong>Compose v0</strong> — behavior stays headless; Emerald paints.</li>
          <li><strong>No named slots</strong> — shells and compounds with a single default slot.</li>
          <li><strong>Token fallbacks</strong> — every <code>var(--emerald-*)</code> has a literal.</li>
          <li><strong>Unscoped CSS</strong> — multi-root v0 primitives keep class hooks reliable.</li>
          <li><strong>Kit interop</strong> — <code>--v0-*</code> aliases for Genesis chrome.</li>
        </ul>
      </section>

      <p class="ea-foot">
        <a href="/emerald">← Dashboard showcase</a>
        ·
        <a href="/emerald/sink">Component sink</a>
      </p>
    </article>
  </div>
</template>

<style>
  .ea {
    min-height: 100vh;
    min-height: 100dvh;
    padding: clamp(1.5rem, 4vw, 3rem);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .ea-doc {
    max-width: 52rem;
    margin: 0 auto;
    padding: clamp(1.5rem, 3vw, 2.5rem);
    background: var(--emerald-background, #fefefe);
    border-radius: 12px;
    border: 1px solid var(--emerald-neutral-300, #ccd6e7);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .ea-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 1.5rem;
  }

  .ea-logo {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--emerald-primary-600, #1fae60), var(--emerald-primary-300, #baedd0));
  }

  .ea-title {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .ea section {
    margin-bottom: 1.5rem;
  }

  .ea h2 {
    margin: 0 0 8px;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .ea p,
  .ea li {
    margin: 0 0 8px;
    line-height: 1.55;
    color: var(--emerald-on-surface-variant, #494a4c);
  }

  .ea ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  .ea code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9em;
    background: var(--emerald-neutral-200, #f6f8fa);
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }

  .ea-foot {
    margin-top: 2rem !important;
    font-size: 14px;
  }

  .ea-foot a {
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 600;
    text-decoration: none;
  }

  .ea-foot a:hover {
    text-decoration: underline;
  }
</style>
