# Mesh Gradient Light Mode Design

## Problem

The docs site mesh gradient (`AppMeshBg.vue`) uses layered radial gradients with `color-mix(in srgb, color %, transparent)` to create a rich, ambient background effect. This technique works beautifully on dark themes where semi-transparent color blobs glow against dark surfaces, but produces washed-out, primary-dominated results on light themes. The same CSS serves all themes with no mode awareness beyond hiding on high-contrast.

## Decision

Dark and light modes are fundamentally different problems. Rather than tuning the same radial gradient approach for light, use a completely different visual metaphor that achieves the same emotional goals (richness, subtlety, depth).

- **Dark mode**: Unchanged. Radial gradient blobs with `color-mix(in srgb)`.
- **Light mode**: Conic glass — a blurred conic gradient that sweeps through all 5 theme colors, creating a subtle tinted-glass effect.

## Design

### Switching Mechanism

Bind `isDark` from `useThemeToggle()` as a class on the mesh divs:

```vue
<div
  v-if="showMesh"
  aria-hidden="true"
  class="mesh-bg mesh-bg-top"
  :class="isDark ? 'mesh-dark' : 'mesh-light'"
/>
```

Two CSS blocks target `.mesh-dark` and `.mesh-light` independently. No shared gradient logic.

### Dark Mode CSS (selector refactor, logic unchanged)

The existing `.mesh-bg-top` / `.mesh-bg-bottom` selectors move under `.mesh-dark` to prevent dark gradients from applying in light mode. The gradient values and positions are identical to the current implementation:

```css
.mesh-dark.mesh-bg-top {
  background:
    radial-gradient(at 40% 20%, color-mix(in srgb, var(--v0-primary) 40%, transparent) 0px, transparent 50%),
    radial-gradient(at 80% 0%, color-mix(in srgb, var(--v0-info) 35%, transparent) 0px, transparent 50%),
    radial-gradient(at 0% 50%, color-mix(in srgb, var(--v0-error) 25%, transparent) 0px, transparent 50%),
    radial-gradient(at 80% 50%, color-mix(in srgb, var(--v0-success) 30%, transparent) 0px, transparent 50%),
    radial-gradient(at 20% 80%, color-mix(in srgb, var(--v0-warning) 20%, transparent) 0px, transparent 50%);
}
```

Same pattern for `.mesh-dark.mesh-bg-bottom` with shifted positions.

### Light Mode CSS (new)

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

Key properties:
- **`conic-gradient`**: Sweeps through all 5 theme colors in wedges — no single color dominates.
- **`color-mix(in oklch, ... var(--v0-background))`**: Perceptually uniform blending against the actual background color. Works on pure white, warm cream (odyssey), cool blue-white (material-3-light), etc.
- **`opacity: 0.4`**: Whisper-level presence. Ambient, not attention-grabbing.
- **`filter: blur(120px)`**: Heavy blur dissolves the conic wedges into a smooth color field.
- **`inset: -40px`**: Overrides the base `.mesh-bg { inset: 0 }` to extend beyond viewport, preventing hard edges where the blur fades. Only applied to light mode — dark mode keeps `inset: 0` since it has no blur.
- **Bottom mesh**: Different `from` angle (225deg) and origin (60% 60%) for layered depth on scroll. Reveals at `opacity: 0.4` (not 1.0 like dark mode) since the conic gradient is already intense enough at whisper level.

### Why oklch over srgb

`color-mix(in srgb)` produces perceptually uneven results — yellows and greens appear to vanish against white while blues stay visible. `oklch` is perceptually uniform, ensuring all 5 theme colors contribute equally at the same percentage.

### Why conic over radial

Radial gradients on light backgrounds suffer from a core issue: each blob needs its own space to be visible, but at low opacity they vanish. Conic gradients naturally partition the color wheel into wedges — every color gets dedicated angular space regardless of opacity level.

## Scope

- **File**: `apps/docs/src/components/app/AppMeshBg.vue`
- **No other files touched**
- Docs-only change, not a v0 package concern

## Affected Themes

All 6 light themes get the new treatment:
- `light` (vuetify0)
- `odyssey`
- `tailwind-light`
- `material-3-light`
- `ant-design-light`
- `radix-light`

All 12 dark themes (including accessibility: high-contrast, protanopia, deuteranopia, tritanopia; and named: blackguard, polaris, nebula, tailwind, material-3, ant-design, radix, dark) continue with the existing radial gradient approach unchanged.

## Verification

- [ ] All 6 light themes show visible, balanced color from all 5 theme tokens
- [ ] All dark themes render identically to current behavior
- [ ] High-contrast theme still hides the mesh entirely
- [ ] Bottom mesh scroll reveal works on both dark and light
- [ ] No hard gradient edges visible at viewport boundaries
- [ ] `filter: blur()` does not cause performance issues (GPU-composited, single layer)
- [ ] Transition between dark/light (via theme toggle) is smooth
