---
title: AI Tools - LLM-Friendly Documentation
features:
  label: AI Tools
  order: 1
  level: 1
meta:
  - name: description
    content: Use llms.txt and llms-full.txt files to provide AI assistants like Claude, ChatGPT, and Cursor with comprehensive Vuetify0 documentation context.
  - name: keywords
    content: llms.txt, AI tools, LLM, Claude, ChatGPT, Cursor, documentation, developer experience
related:
  - /guide/tooling/vuetify-mcp
  - /guide/tooling/vuetify-cli
  - /introduction/getting-started
---

<script setup>
  import llmsStats from 'virtual:llms-stats'
</script>

# AI Tools

v0 provides machine-readable documentation files following the [llms.txt](https://llmstxt.org/) standard. These files help AI assistants understand the library without hallucinating APIs or patterns.

<DocsPageFeatures :frontmatter />

## Available Files

| File | Size | Purpose | Best For |
| - | - | - | - |
| <a href="/llms.txt" target="_blank" class="v0-link">llms.txt↗</a> | {{ llmsStats.llms.sizeFormatted }} | Curated index with links | Quick context, navigation |
| <a href="/llms-full.txt" target="_blank" class="v0-link whitespace-nowrap">llms-full.txt↗</a> | {{ llmsStats.llmsFull.sizeFormatted }} | Complete documentation | Deep understanding, code generation |
| <a href="/SKILL.md" target="_blank" class="v0-link">SKILL.md↗</a> | ~7KB | Patterns & anti-patterns | Claude Code, Clawdbot skills |

> [!ASKAI] When should I use llms.txt vs llms-full.txt?

## Usage

Whether you're a developer prompting an AI assistant or an agent consuming v0 documentation programmatically, choose the approach that fits your workflow.

::: code-group

```md I'm a Human
**Claude Code / Codex** — Add Vuetify MCP for structured API access:
> claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp

Or fetch docs directly in your session:
> WebFetch https://0.vuetifyjs.com/llms-full.txt

**Cursor / Windsurf** — Add to .cursorrules or configure MCP:
> @https://0.vuetifyjs.com/llms.txt

See [Vuetify MCP](/guide/tooling/vuetify-mcp) for IDE configuration.

**ChatGPT / Claude.ai** — Paste the URL in chat:
> Read https://0.vuetifyjs.com/llms-full.txt and help me build a multi-select dropdown.
```

```md I'm an Agent
**With MCP (recommended)** — Always-current structured access:
- `get_vuetify0_skill` — Latest SKILL.md reference
- `get_vuetify0_composable_list` — Browse all composables
- `get_vuetify0_composable_guide` — Detailed composable docs
- `get_vuetify0_component_list` — Browse headless components
- `get_vuetify0_component_guide` — Component docs and examples

**Without MCP** — Fetch SKILL.md at session start:
> WebFetch https://0.vuetifyjs.com/SKILL.md

**What's in SKILL.md:**
- Core composables (useTheme, useLocale, useBreakpoints, etc.)
- Selection system (useSingle, useGroup, useStep)
- Component compound patterns (Root/Item pairs)
- Registry & Trinity patterns
- Common mistakes to avoid
```

:::

## What's Included

**llms.txt** contains categorized links to:

- 10 guide pages (introduction, theming, accessibility, etc.)
- 9 headless components (Atom, Avatar, Pagination, etc.)
- 34 composables across 7 categories
- FAQ and contributing guides

**llms-full.txt** includes the complete content of every documentation page, stripped of Vue components and frontmatter for cleaner LLM consumption.

**SKILL.md** is a compact reference optimized for AI coding assistants. It focuses on practical usage patterns, the selection/registry systems, common mistakes, and TypeScript integration — ideal for project-level context files.

## How It Works

Both files are auto-generated at build time by [generate-llms-full.ts](https://github.com/vuetifyjs/0/blob/master/apps/docs/build/generate-llms-full.ts):

- `llms.txt` extracts titles and descriptions, organized by category
- `llms-full.txt` includes the complete content of every markdown page, stripped of Vue components and frontmatter
