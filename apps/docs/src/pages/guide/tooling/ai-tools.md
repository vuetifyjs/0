---
title: AI Tools - LLM-Friendly Documentation
features:
  label: AI Tools
  order: 1
  level: 1
meta:
  - name: description
    content: Use llms.txt and llms-full.txt files to provide AI assistants like Claude, ChatGPT, Grok, and Cursor with comprehensive Vuetify0 documentation context.
  - name: keywords
    content: llms.txt, AI tools, LLM, Claude, ChatGPT, Grok, Cursor, documentation, developer experience
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
| <a href="/SKILL.md" target="_blank" class="v0-link">SKILL.md↗</a> | ~5KB | Patterns & anti-patterns | Claude Code, Grok Build, Cursor, Windsurf |

> [!ASKAI] How do I configure my AI agent to consume llms-full.txt?

## Usage

Install SKILL.md via [skills.sh](https://www.skills.sh) — works with Claude Code, Grok Build, Cursor, Windsurf, Codex, and [35+ agents](https://github.com/vercel-labs/skills#supported-agents):

```bash
npx skills add vuetifyjs/0
```

### For Humans

**Claude Code / Codex** — Add Vuetify MCP for structured API access:

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

Or fetch docs directly in your session:

```text
WebFetch https://0.vuetifyjs.com/llms-full.txt
```

**Grok Build** — Add Vuetify MCP for structured API access:

```bash
grok mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

Or fetch docs directly in your session:

```text
WebFetch https://0.vuetifyjs.com/llms-full.txt
```

Grok also loads SKILL.md (via `npx skills add vuetifyjs/0` or `.grok/skills/`) and project rules from `AGENTS.md` / `CLAUDE.md`.

**Cursor / Windsurf** — Add to .cursorrules or configure MCP:

```text
@https://0.vuetifyjs.com/llms.txt
```

See [Vuetify MCP](/guide/tooling/vuetify-mcp) for IDE configuration.

**ChatGPT / Claude.ai** — Paste the URL in chat:

```text
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

```text
WebFetch https://0.vuetifyjs.com/SKILL.md
```

**What's in SKILL.md:**

- Decision tree mapping needs to composables
- Code style conventions (shallowRef, function declarations)
- Anti-patterns to avoid
- Composition hierarchy
- Summary lookup table
- Links to [REFERENCE.md](/references/REFERENCE.md) for detailed API examples

## Making Agents Actually Use v0

Docs access alone isn't enough. An agent only looks things up when it feels uncertain — and a model trained before v0 existed doesn't feel uncertain writing generic Vue. It will fluently hand-roll selection state, focus traps, or virtual scrolling without ever checking whether v0 provides them. The fix is to move v0 knowledge from on-demand recall to ambient context, plus a deterministic trigger.

> [!ASKAI] Set up my agent harness so it always uses v0 primitives instead of hand-rolling Vue logic.

### 1. Put a surface map in always-loaded context

Add an inventory of v0 exports — every name with a one-line purpose — to a file your agent loads on every session (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`). An agent can't reach for `createSelection` if it doesn't know the name exists; once the name is in context, fetching the full guide via MCP or SKILL.md follows naturally.

Generate it from the MCP server (`get_vuetify0_exports_list`) or copy the lookup table from [SKILL.md](/SKILL.md), then keep a section like:

```markdown
## v0 Surface Map
If a name below covers the need, use it — never hand-roll an equivalent.
- createSelection — multi/single selection with mandatory guards
- createForm — form state + field coordination
- useHotkey — keyboard shortcuts
- createVirtual — virtual scrolling for large lists
<!-- ...full export list... -->
```

### 2. Add a deterministic reminder hook

Context-file instructions degrade over long sessions; hooks don't. In Claude Code, a `PreToolUse` hook fires every time the agent edits a file — including edits made by subagents — and can't be rationalized away. In `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": ".claude/hooks/v0-reminder.sh", "timeout": 5 }]
    }]
  }
}
```

And `.claude/hooks/v0-reminder.sh` (injects once per session, only for Vue/TS files):

```bash
#!/usr/bin/env bash
input=$(cat)
file=$(jq -r '.tool_input.file_path // empty' <<< "$input")
case "$file" in
  *.vue|*.ts|*.tsx)
    mark="${TMPDIR:-/tmp}/v0-reminder-$(jq -r '.session_id' <<< "$input")"
    if [ ! -e "$mark" ]; then
      touch "$mark"
      printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"Check the v0 surface map in CLAUDE.md before writing Vue logic — never hand-roll a primitive @vuetify/v0 already provides."}}'
    fi
    ;;
esac
exit 0
```

### 3. Let the type checker catch what slips through

Hallucinated v0 APIs fail to compile. Run `vue-tsc --noEmit` (or `tsc --noEmit`) as a verification step before accepting agent-written code — it converts "plausible but wrong" into a hard error the agent can fix itself.

## What's Included

**llms.txt** contains categorized links to:

- Guide pages (fundamentals, features, tooling, integration, and more)
- <DocsCount type="component" /> headless components (Atom, Avatar, Pagination, etc.)
- <DocsCount type="composable" /> composables across categories
- FAQ and contributing guides

**llms-full.txt** includes the complete content of every documentation page, stripped of Vue components and frontmatter for cleaner LLM consumption.

**SKILL.md** is a compact reference optimized for AI coding assistants. It focuses on decision trees, code conventions, anti-patterns, and the composition hierarchy. Detailed API examples live in a separate [REFERENCE.md](/references/REFERENCE.md) that agents load on demand. Install via [skills.sh](https://www.skills.sh) (`npx skills add vuetifyjs/0`) to make it available across Claude Code, Grok Build, Cursor, Windsurf, and 35+ other agents.

## How It Works

Both files are auto-generated at build time by [generate-llms-full.ts](https://github.com/vuetifyjs/0/blob/master/apps/docs/build/generate-llms-full.ts):

- `llms.txt` extracts titles and descriptions, organized by category
- `llms-full.txt` includes the complete content of every markdown page, stripped of Vue components and frontmatter
