---
title: AI Tools - LLM-Friendly Documentation
features:
  label: AI Tools
  order: 11
meta:
  - name: description
    content: Use llms.txt and llms-full.txt to provide AI assistants with comprehensive v0 documentation context.
  - name: keywords
    content: llms.txt, AI tools, LLM, Claude, ChatGPT, Cursor, documentation, developer experience
related:
  - /guide/vuetify-mcp
  - /introduction/getting-started
---

# AI Tools

v0 provides machine-readable documentation files following the [llms.txt](https://llmstxt.org/) standard. These files help AI assistants understand the library without hallucinating APIs or patterns.

<DocsPageFeatures :frontmatter />

## Available Files

| File | Size | Purpose | Best For |
| - | - | - | - |
| <a href="/llms.txt" target="_blank" class="v0-link">llms.txt↗</a> | ~6 KB | Curated index with links | Quick context, navigation |
| <a href="/llms-full.txt" target="_blank" class="v0-link" style="white-space: nowrap">llms-full.txt↗</a> | ~220 KB | Complete documentation | Deep understanding, code generation |

## Usage Examples

### ChatGPT / Claude.ai

Paste the URL directly in chat:

```txt
Read https://0.vuetifyjs.com/llms-full.txt and help me build a multi-select dropdown using v0 composables.
```

### Cursor / Windsurf

Add to your project's `.cursorrules` or AI context:

```txt
@https://0.vuetifyjs.com/llms.txt
```

### Claude Code

Fetch the documentation in your session:

```txt
WebFetch https://0.vuetifyjs.com/llms-full.txt
```

> [!TIP]
> For the best experience with Claude, use [Vuetify MCP](/guide/vuetify-mcp) instead. It provides structured API access rather than raw text.

## What's Included

**llms.txt** contains categorized links to:

- 10 guide pages (introduction, theming, accessibility, etc.)
- 9 headless components (Atom, Avatar, Pagination, etc.)
- 34 composables across 7 categories
- FAQ and contributing guides

**llms-full.txt** includes the complete content of every documentation page, stripped of Vue components and frontmatter for cleaner LLM consumption.

## How It Works

- `llms.txt` is manually curated in `apps/docs/public/`
- `llms-full.txt` is auto-generated at build time from all markdown pages
- Both are served statically and cached for performance
