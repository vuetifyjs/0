---
title: Vuetify0 Guide - Build Your Own UI Library
meta:
  - name: description
    content: Comprehensive guide to building UI libraries with Vuetify0. Learn composables, components, theming, plugins, and accessibility patterns for Vue 3.
  - name: keywords
    content: vuetify0, guide, Vue 3, ui library, composables, theming, accessibility, design system
related:
  - /composables
  - /components
  - /introduction/getting-started
---

# Guide

Learn v0's patterns and build headless UI systems. Start with [Getting Started](/introduction/getting-started) if you haven't installed v0 yet.

<DocsPageFeatures :frontmatter />

## Prerequisites

Before diving into the guides, ensure you're familiar with:

- **Required**: Vue 3 basics (ref, computed, provide/inject)
- **Helpful**: Composables pattern, TypeScript generics

## What's Different About v0

| Traditional Component Libraries | v0 Approach |
| - | - |
| Pre-styled, override with CSS | Zero styles - you own all styling |
| Props configure behavior | Composables expose reactive state |
| Component = black box | Component = transparent composition |
| Fight the framework | Build with the framework |

**The v0 Mental Model:**

- Components are **delivery mechanisms**, not behavior containers
- Logic lives in **composables** you can use independently
- **Trinity pattern**: `[use, provide, context]` - predictable, debuggable
- **Registry/Context pattern**: Parent-child coordination without prop drilling

## Learning Paths

### Track A: Core Concepts

For understanding the system architecture.

| Guide | What You'll Learn |
| - | - |
| [Structure](/guide/structure) | Package organization, imports, file conventions |
| [Framework Core](/guide/framework-core) | Trinity, Context, Registry patterns |
| [Components](/guide/components) | Component categories, Atom primitive, slot props |
| [Plugins](/guide/plugins) | Using and creating Vue plugins |

### Track B: Features & Polish

For building production UIs.

| Guide | What You'll Learn |
| - | - |
| [Theming](/guide/theming) | CSS variables, design tokens, dark mode |
| [Accessibility](/guide/accessibility) | ARIA patterns, keyboard nav, testing |
| [Utilities](/guide/utilities) | Helper functions, type guards |

**Recommendation**: New to v0? Start with Track A. Already building? Jump to Track B as needed.

## Quick Reference

| Pattern | Use Case | Guide |
| - | - | - |
| `createContext` | Share state across component tree | [Framework Core](/guide/framework-core) |
| `useSelection` | Multi-select, toggles, radio groups | [Composables](/composables/selection/use-selection) |
| `useRegistry` | Dynamic child registration | [Framework Core](/guide/framework-core) |
| `Atom` component | Polymorphic base element | [Components](/guide/components) |
| `useTheme` | Theme switching, CSS variables | [Theming](/guide/theming) |

