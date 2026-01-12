---
title: Vuetify0 Components - Headless Vue 3 UI Primitives
meta:
  - name: description
    content: Headless Vue 3 UI components with full accessibility. Selection, pagination, expansion panels, popovers, and more. Unstyled and fully customizable.
  - name: keywords
    content: components, headless ui, Vue 3, accessible, customizable, selection, pagination, expansion panel, popover
features:
  level: 1
related:
  - /guide/fundamentals/components
  - /composables
---

# Components

A collection of foundational components designed to be headless, accessible, and highly customizable.

<DocsPageFeatures :frontmatter />

## Primitives

Foundation components for building higher-level abstractions.

| Name | Description |
| - | - |
| [Atom](/components/primitives/atom) | Polymorphic element with dynamic `as` prop and renderless mode |

## Providers

Pure context providers for state management. Always renderless—they provide logic without rendering DOM elements.

| Name | Description |
| - | - |
| [Checkbox](/components/providers/checkbox) | Checkbox controls with dual-mode (standalone/group) support |
| [Selection](/components/providers/selection) | Multi-selection state with v-model binding |
| [Single](/components/providers/single) | Single-selection with automatic deselection |
| [Group](/components/providers/group) | Multi-selection with tri-state support |
| [Step](/components/providers/step) | Sequential navigation (first, last, next, prev) |

## Semantic

Components with meaningful HTML defaults. Render semantic elements by default but support the `as` prop for customization.

| Name | Description |
| - | - |
| [Avatar](/components/semantic/avatar) | Image/fallback avatar with priority loading |
| [Pagination](/components/semantic/pagination) | Page navigation with semantic `<nav>` wrapper |

## Disclosure

Components for showing/hiding content.

| Name | Description |
| - | - |
| [Dialog](/components/disclosure/dialog) | Modal dialog with focus management |
| [ExpansionPanel](/components/disclosure/expansion-panel) | Accordion-style collapsible panels |
| [Popover](/components/disclosure/popover) | CSS anchor-positioned popup content |

