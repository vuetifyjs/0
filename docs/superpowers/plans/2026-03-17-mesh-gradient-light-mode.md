# Mesh Gradient Light Mode Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a theme-aware light mode treatment to the docs mesh gradient background using a blurred conic gradient, while keeping dark mode unchanged.

**Architecture:** Single-file change to `AppMeshBg.vue`. Add `isDark` class toggle to template, scope existing dark CSS under `.mesh-dark`, add new `.mesh-light` CSS with conic gradient + blur + oklch color mixing. No new files, dependencies, or composables.

**Tech Stack:** Vue 3 SFC, CSS `conic-gradient`, `color-mix(in oklch)`, `filter: blur()`

**Spec:** `docs/superpowers/specs/2026-03-17-mesh-gradient-light-mode-design.md`

---

## File Map

- Modify: `apps/docs/src/components/app/AppMeshBg.vue` — template + CSS changes

---

### Task 1: Add isDark class toggle to template

**Files:**
- Modify: `apps/docs/src/components/app/AppMeshBg.vue:1-26` (script + template)

- [ ] **Step 1: Add isDark ref to script**

Destructure `isDark` from `useThemeToggle()` return. The composable already exposes `isDark` (it's `theme.isDark`), so no new imports needed.

```ts
const toggle = useThemeToggle()
const { isDark } = toggle
```

- [ ] **Step 2: Add class binding to template**

Replace both mesh divs to include the dark/light class:

```vue
<template>
  <div v-if="showMesh" aria-hidden="true" class="mesh-bg mesh-bg-top" :class="isDark ? 'mesh-dark' : 'mesh-light'" />
  <div v-if="showMesh" aria-hidden="true" class="mesh-bg mesh-bg-bottom" :class="[isDark ? 'mesh-dark' : 'mesh-light', { visible: showBottomMesh }]" />
</template>
```

- [ ] **Step 3: Verify dev server renders correctly**

Run: `pnpm dev`
Expected: Dark theme should look identical to before (the existing unscoped CSS still applies). No visual change yet.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/components/app/AppMeshBg.vue
git commit -m "docs(AppMeshBg): add isDark class toggle for theme-aware mesh"
```

---

### Task 2: Scope dark mode CSS under .mesh-dark

**Files:**
- Modify: `apps/docs/src/components/app/AppMeshBg.vue:28-59` (style block)

- [ ] **Step 1: Rename selectors**

Change `.mesh-bg-top` to `.mesh-dark.mesh-bg-top` and `.mesh-bg-bottom` to `.mesh-dark.mesh-bg-bottom`. Keep all gradient values identical:

```css
.mesh-dark.mesh-bg-top {
  background:
    radial-gradient(at 40% 20%, color-mix(in srgb, var(--v0-primary) 40%, transparent) 0px, transparent 50%),
    radial-gradient(at 80% 0%, color-mix(in srgb, var(--v0-info) 35%, transparent) 0px, transparent 50%),
    radial-gradient(at 0% 50%, color-mix(in srgb, var(--v0-error) 25%, transparent) 0px, transparent 50%),
    radial-gradient(at 80% 50%, color-mix(in srgb, var(--v0-success) 30%, transparent) 0px, transparent 50%),
    radial-gradient(at 20% 80%, color-mix(in srgb, var(--v0-warning) 20%, transparent) 0px, transparent 50%);
}

.mesh-dark.mesh-bg-bottom {
  opacity: 0;
  transition: opacity 0.5s ease-out;
  background:
    radial-gradient(at 60% 80%, color-mix(in srgb, var(--v0-primary) 40%, transparent) 0px, transparent 50%),
    radial-gradient(at 20% 100%, color-mix(in srgb, var(--v0-info) 35%, transparent) 0px, transparent 50%),
    radial-gradient(at 100% 50%, color-mix(in srgb, var(--v0-error) 25%, transparent) 0px, transparent 50%),
    radial-gradient(at 20% 50%, color-mix(in srgb, var(--v0-success) 30%, transparent) 0px, transparent 50%),
    radial-gradient(at 80% 20%, color-mix(in srgb, var(--v0-warning) 20%, transparent) 0px, transparent 50%);

  &.visible {
    opacity: 1;
  }
}
```

- [ ] **Step 2: Verify dark mode looks identical**

Run: `pnpm dev`
Expected: Dark theme mesh gradient looks exactly the same as before. Switch between dark themes (vuetify0 dark, tailwind, material-3, etc.) — all should render correctly.

- [ ] **Step 3: Verify light mode has no mesh**

Switch to any light theme.
Expected: No mesh gradient visible (the `.mesh-light` class has no CSS yet, and `.mesh-dark` selectors no longer match).

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/components/app/AppMeshBg.vue
git commit -m "docs(AppMeshBg): scope dark mode gradients under .mesh-dark selector"
```

---

### Task 3: Add light mode conic glass CSS

**Files:**
- Modify: `apps/docs/src/components/app/AppMeshBg.vue:28+` (style block, append after dark CSS)

- [ ] **Step 1: Add light mode CSS**

Append after the dark mode CSS blocks:

```css
.mesh-light.mesh-bg-top {
  inset: -40px;
  opacity: 0.4;
  filter: blur(120px);
  background: conic-gradient(
    from 45deg at 50% 40%,
    color-mix(in oklch, var(--v0-primary) 30%, var(--v0-background)),
    color-mix(in oklch, var(--v0-info) 28%, var(--v0-background)),
    color-mix(in oklch, var(--v0-success) 28%, var(--v0-background)),
    color-mix(in oklch, var(--v0-warning) 28%, var(--v0-background)),
    color-mix(in oklch, var(--v0-error) 28%, var(--v0-background)),
    color-mix(in oklch, var(--v0-primary) 30%, var(--v0-background))
  );
}

.mesh-light.mesh-bg-bottom {
  inset: -40px;
  opacity: 0;
  filter: blur(120px);
  transition: opacity 0.5s ease-out;
  background: conic-gradient(
    from 225deg at 60% 60%,
    color-mix(in oklch, var(--v0-primary) 30%, var(--v0-background)),
    color-mix(in oklch, var(--v0-info) 28%, var(--v0-background)),
    color-mix(in oklch, var(--v0-success) 28%, var(--v0-background)),
    color-mix(in oklch, var(--v0-warning) 28%, var(--v0-background)),
    color-mix(in oklch, var(--v0-error) 28%, var(--v0-background)),
    color-mix(in oklch, var(--v0-primary) 30%, var(--v0-background))
  );

  &.visible {
    opacity: 0.4;
  }
}
```

- [ ] **Step 2: Verify light mode rendering**

Run: `pnpm dev`, switch to each light theme:
- `light` (vuetify0) — subtle color wash on white
- `odyssey` — subtle color wash on warm cream
- `tailwind-light` — subtle color wash on white
- `material-3-light` — subtle color wash on cool white
- `ant-design-light` — subtle color wash on white
- `radix-light` — subtle color wash on white

Expected for all: soft, ambient conic gradient visible with all 5 theme colors represented. No single color dominates. No hard edges at viewport boundaries.

- [ ] **Step 3: Verify bottom mesh scroll reveal**

Scroll down past 200px on any light theme.
Expected: Second mesh layer fades in at opacity 0.4 with 0.5s ease-out transition.

- [ ] **Step 4: Verify dark mode is unaffected**

Switch back to any dark theme.
Expected: Radial gradient blobs render exactly as before.

- [ ] **Step 5: Verify high-contrast theme**

Switch to high-contrast theme.
Expected: No mesh gradient visible at all (v-if hides it).

- [ ] **Step 6: Verify theme toggle transition**

Toggle between dark and light mode rapidly.
Expected: Smooth transition, no jarring flash or layout shift.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/src/components/app/AppMeshBg.vue
git commit -m "docs(AppMeshBg): add conic glass mesh gradient for light themes"
```
