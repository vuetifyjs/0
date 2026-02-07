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
| <a href="/SKILL.md" target="_blank" class="v0-link">SKILL.md↗</a> | ~5KB | Patterns & anti-patterns | Claude Code, Cursor, Windsurf |

> [!ASKAI] When should I use llms.txt vs llms-full.txt?

## Usage

Install SKILL.md via [skills.sh](https://skills.sh) — works with Claude Code, Cursor, Windsurf, Codex, and [35+ agents](https://github.com/vercel-labs/skills#supported-agents):

```bash
npx skills add vuetifyjs/0
```

### For Humans

**Claude Code / Codex** — Add Vuetify MCP for structured API access:

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

Or fetch docs directly in your session:

```txt
WebFetch https://0.vuetifyjs.com/llms-full.txt
```

**Cursor / Windsurf** — Add to .cursorrules or configure MCP:

```txt
@https://0.vuetifyjs.com/llms.txt
```

See [Vuetify MCP](/guide/tooling/vuetify-mcp) for IDE configuration.

**ChatGPT / Claude.ai** — Paste the URL in chat:

```txt
Read https://0.vuetifyjs.com/llms-full.txt and help me build a multi-select dropdown.
```

### For Agents

**With MCP** — Always-current structured access:

- `get_vuetify0_skill` — Latest SKILL.md reference
- `get_vuetify0_composable_list` — Browse all composables
- `get_vuetify0_composable_guide` — Detailed composable docs
- `get_vuetify0_component_list` — Browse headless components
- `get_vuetify0_component_guide` — Component docs and examples

**Without MCP** — Fetch SKILL.md at session start:

```txt
WebFetch https://0.vuetifyjs.com/SKILL.md
```

**What's in SKILL.md:**

- Decision tree mapping needs to composables
- Code style conventions (shallowRef, function declarations)
- Anti-patterns to avoid
- Composition hierarchy
- Summary lookup table
- Links to [REFERENCE.md](/references/REFERENCE.md) for detailed API examples

## What's Included

**llms.txt** contains categorized links to:

- 10 guide pages (introduction, theming, accessibility, etc.)
- 9 headless components (Atom, Avatar, Pagination, etc.)
- 34 composables across 7 categories
- FAQ and contributing guides

**llms-full.txt** includes the complete content of every documentation page, stripped of Vue components and frontmatter for cleaner LLM consumption.

**SKILL.md** is a compact reference optimized for AI coding assistants. It focuses on decision trees, code conventions, anti-patterns, and the composition hierarchy. Detailed API examples live in a separate [REFERENCE.md](/references/REFERENCE.md) that agents load on demand. Install via [skills.sh](https://skills.sh) (`npx skills add vuetifyjs/0`) to make it available across Claude Code, Cursor, Windsurf, and 35+ other agents.

## How It Works

Both files are auto-generated at build time by [generate-llms-full.ts](https://github.com/vuetifyjs/0/blob/master/apps/docs/build/generate-llms-full.ts):

- `llms.txt` extracts titles and descriptions, organized by category
- `llms-full.txt` includes the complete content of every markdown page, stripped of Vue components and frontmatter
