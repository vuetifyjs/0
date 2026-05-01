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
| [AspectRatio](/components/primitives/aspect-ratio) | Fixed width-to-height ratio container via CSS `aspect-ratio` |
| [Atom](/components/primitives/atom) | Polymorphic element with dynamic `as` prop and renderless mode |
| [Portal](/components/primitives/portal) | Teleport wrapper with automatic z-index stacking via useStack |
| [Presence](/components/primitives/presence) | Renderless mount lifecycle with lazy mounting and exit animation delay |

## Providers

Pure context providers for state management. Always renderless—they provide logic without rendering DOM elements.

| Name | Description |
| - | - |
| [Selection](/components/providers/selection) | Multi-selection state with v-model binding |
| [Single](/components/providers/single) | Single-selection with automatic deselection |
| [Group](/components/providers/group) | Multi-selection with tri-state support |
| [Step](/components/providers/step) | Sequential navigation (first, last, next, prev) |
| [Locale](/components/providers/locale) | Locale context provider for internationalization |
| [Scrim](/components/providers/scrim) | Overlay backdrop with click-to-dismiss and z-index management |
| [Theme](/components/providers/theme) | Theme context provider with CSS variable injection |

## Actions

Interactive controls for user-initiated actions.

| Name | Description |
| - | - |
| [Button](/components/actions/button) | Button with loading grace period, toggle groups, and icon accessibility |
| [Toggle](/components/actions/toggle) | Pressable on/off button with standalone and group modes |

## Forms

Form control components with accessibility and validation support.

| Name | Description |
| - | - |
| [Checkbox](/components/forms/checkbox) | Checkbox controls with dual-mode (standalone/group) and tri-state support |
| [Combobox](/components/forms/combobox) | Filterable selection with autocomplete, virtual focus, and custom input |
| [Form](/components/forms/form) | Form validation coordinator with submit handling and error aggregation |
| [Input](/components/forms/input) | Text input with label, description, error messages, and character counting |
| [NumberField](/components/forms/number-field) | Numeric input with increment/decrement, formatting, and scrub |
| [Radio](/components/forms/radio) | Radio group with single-selection and keyboard navigation |
| [Select](/components/forms/select) | Dropdown selection with virtual focus and multi-select support |
| [Rating](/components/forms/rating) | Star/icon rating with hover preview, half-stars, and keyboard navigation |
| [Slider](/components/forms/slider) | Range input with snapping, range mode, and custom tracks |
| [Switch](/components/forms/switch) | Toggle switch with on/off states and label association |

## Semantic

Components with meaningful HTML defaults. Render semantic elements by default but support the `as` prop for customization.

| Name | Description |
| - | - |
| [Avatar](/components/semantic/avatar) | Image/fallback avatar with priority loading |
| [Breadcrumbs](/components/semantic/breadcrumbs) | Navigation breadcrumbs with overflow detection and truncation |
| [Carousel](/components/semantic/carousel) | Scroll-snap slide navigation with multi-slide display and drag/swipe |
| [Image](/components/semantic/image) | Image with placeholder, error fallback, and lazy loading |
| [Overflow](/components/semantic/overflow) | Responsive truncation primitive |
| [Pagination](/components/semantic/pagination) | Page navigation with semantic `<nav>` wrapper |
| [Progress](/components/semantic/progress/) | Headless progress bar with multi-segment and buffer support |
| [Snackbar](/components/semantic/snackbar) | Toast notification with queue, positioning, and auto-dismiss |
| [Splitter](/components/semantic/splitter) | Resizable panel layout with drag handles |

## Disclosure

Components for showing/hiding content.

| Name | Description |
| - | - |
| [AlertDialog](/components/disclosure/alert-dialog) | Confirmation dialog with deferred close for async actions |
| [Collapsible](/components/disclosure/collapsible) | Single-item disclosure toggle for showing and hiding content |
| [Dialog](/components/disclosure/dialog) | Modal dialog with focus management |
| [ExpansionPanel](/components/disclosure/expansion-panel) | Accordion-style collapsible panels |
| [Popover](/components/disclosure/popover) | CSS anchor-positioned popup content |
| [Tabs](/components/disclosure/tabs) | Tab panel navigation with keyboard support and lazy content rendering |
| [Tooltip](/components/disclosure/tooltip) | Description tooltip with hover/focus triggers and shared delay coordination |
| [Treeview](/components/disclosure/treeview) | Hierarchical tree with nested selection and expand/collapse |

