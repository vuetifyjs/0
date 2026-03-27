---
paths: packages/codex/**
---

# Codex Design System Components

Rules for building components in @paper/codex — a documentation-focused design system.

## Architecture

Codex is a Paper design system for building documentation sites. Same layer as Emerald/Onyx.

```
Codex (docs design system — app shell, content, navigation, interactive)
    ↓
Paper (styling primitives — V0Paper, composables)
    ↓
v0 (headless logic & accessibility)
```

## Component Patterns

Same contract as `.claude/rules/paper-components.md` with these codex-specific conventions:

### Naming

- Prefix: `Cx` (e.g., `CxCodeBlock`, `CxAppBar`)
- CSS classes: `codex-{name}` root, `codex-{name}__{sub}` for BEM sub-elements
- Component name in `defineOptions`: `'CxComponentName'`

### Categories

| Category | Components |
|----------|-----------|
| Shell | CxAppBar, CxAppNav, CxAppMain, CxAppFooter, CxAppBanner, CxDocLayout |
| Navigation | CxNavLink, CxNavGroup, CxBreadcrumbs, CxPageNavigator |
| Content | CxCodeBlock, CxCodeGroup, CxCallout, CxApiTable, CxApiCard, CxToc, CxExample, CxExampleCode, CxFaq, CxFaqItem, CxHeaderAnchor, CxCard, CxMermaid, CxCopyCommand |
| Interactive | CxSearch, CxSettings, CxDropdown, CxBackToTop, CxTooltip |
| Utility | CxIcon, CxIconButton, CxButton, CxLink, CxDivider, CxSwitch, CxChip, CxBadge, CxCloseButton, CxKbd, CxSkeleton, CxLoaderIcon, CxProgressBar, CxInput, CxThemeToggle, CxPackageManagerTabs, CxAlert, CxAccordion, CxTabs |

### Composables

| Composable | Purpose |
|-----------|---------|
| useClipboard | Copy to clipboard with timeout |
| useScrollSpy | IntersectionObserver active section tracking |
| useToc | DOM heading scanner + scroll spy |
| useThemeToggle | Light/dark/system mode cycling |
| useSearch | Client-side text search with hotkey |
| useSettings | App settings with storage persistence |
| useScrollPersist | Session scroll position restore |
| useScrollLock | Body overflow lock (ref-counted) |
| useCountUp | Animated number on viewport enter |
| useIdleCallback | requestIdleCallback with fallback |
| useCodeHighlighter | Lazy Shiki wrapper (optional dep) |
| usePopoverPosition | Viewport-aware floating position |
| useAnchorLinks | Deep linking with smooth scroll |
| useReveal | Scroll reveal animation |
| useRouterLinks | SPA link interception |

### Import Conventions

```ts
// v0 composables and components
import { Dialog, useHotkey } from '@vuetify/v0'

// Paper
import { V0Paper } from '@vuetify/paper'
import type { V0PaperProps } from '@vuetify/paper'

// Codex internal
import { useClipboard } from '#codex/composables/useClipboard'
import { CxSwitch } from '#codex/components/CxSwitch'
```

### UnoCSS Preset

Consumers use `presetCodex()` in their UnoCSS config. Components should use the shortcut classes defined in `src/uno-preset.ts` (e.g., `btn-primary`, `border-card`, `list-item`).

### Accessibility

All interactive components must have proper ARIA attributes. v0 compound components (Dialog, Tabs, ExpansionPanel, Popover) handle ARIA internally — don't duplicate their work. Codex is responsible for:
- `aria-label` on buttons with non-text content
- `aria-controls` on disclosure buttons
- `aria-describedby` on tooltip anchors
- `role` on custom interactive containers (menu, dialog)
