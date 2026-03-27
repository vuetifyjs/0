# docs → codex Migration Analysis

**Working Date**: 2026-03-27
**Task**: Map migration path for `apps/docs/` to consume `@paper/codex` components and composables

---

## Table 1: App Components (AppX → CxX Mapping)

| Docs Component | Codex Equivalent | Status | Notes |
|---|---|---|---|
| `AppAccount` | ❌ None | No Equivalent | Auth account menu — codex has no auth integration |
| `AppAskInline` | `CxSearch` (partial) | Needs Work | Ask AI is docs-specific feature; codex search is generic |
| `AppBanner` | `CxAppBanner` | Ready | Direct match — top banner component |
| `AppBar` | `CxAppBar` | Ready | Direct match — header navigation bar |
| `AppBreadcrumbs` | `CxBreadcrumbs` | Ready | Direct match — breadcrumb trail |
| `AppBrowserIcon` | ❌ None | No Equivalent | Browser icon set for platform tables |
| `AppBurst` | ❌ None | No Equivalent | Particle burst animation effect (cosmetic) |
| `AppChip` | `CxChip` | Ready | Direct match — inline chip/tag element |
| `AppCloseButton` | `CxCloseButton` | Ready | Direct match — close/dismiss button |
| `AppCopyright` | ❌ None | No Equivalent | Footer copyright text; would need custom wrapper |
| `AppDivider` | `CxDivider` | Ready | Direct match — horizontal/vertical divider |
| `AppDotGrid` | ❌ None | No Equivalent | Animated background grid pattern (cosmetic) |
| `AppErrorIcon` | `CxLoaderIcon` (partial) | Needs Work | Codex has loader, not error icon specifically |
| `AppFooter` | `CxAppFooter` | Ready | Direct match — page footer |
| `AppHomePage` | `CxDocLayout` (partial) | Needs Work | Layout wrapper; differences in structure |
| `AppIcon` | `CxIcon` | Ready | Direct match — icon renderer |
| `AppIconButton` | `CxIconButton` | Ready | Direct match — icon-only button |
| `AppLevelChip` | ❌ None | No Equivalent | Skill level filter UI (docs-specific education feature) |
| `AppLink` | `CxLink` | Ready | Direct match — styled link component |
| `AppLoaderIcon` | `CxLoaderIcon` | Ready | Direct match — loading spinner animation |
| `AppMain` | `CxAppMain` | Ready | Direct match — main content wrapper |
| `AppMeshBg` | ❌ None | No Equivalent | Animated mesh background effect (cosmetic) |
| `AppNav` | `CxAppNav` | Ready | Direct match — sidebar navigation |
| `AppNavLink` | `CxNavLink` | Ready | Direct match — navigation link item |
| `AppSearchInline` | `CxSearch` (partial) | Needs Work | Codex search is read-only; docs has inline submit |
| `AppSettings` | `CxSettings` | Ready | Direct match — settings button/panel |
| `AppSettingsSheet` | `CxSettings` (internal) | Ready | Part of CxSettings component |
| `AppSkillFilter` | ❌ None | No Equivalent | Skill level popover filter (docs educational feature) |
| `AppSuccessIcon` | ❌ None | No Equivalent | Success feedback icon |
| `AppSwitch` | `CxSwitch` | Ready | Direct match — toggle switch |
| `AppThemePreview` | ❌ None | No Equivalent | Theme color swatch previewer (custom UI) |
| `AppThemeSelector` | `CxThemeToggle` (partial) | Needs Work | Codex has simple toggle; docs has full palette picker |
| `AppThemeToggle` | `CxThemeToggle` | Ready | Direct match — theme mode toggle |

**Summary**: 20 ready / 7 needs-work / 6 no-equivalent

---

## Table 2: Docs Components (DocsX → CxX Mapping)

| Docs Component | Codex Equivalent | Status | Notes |
|---|---|---|---|
| `DocsActionChip` | `CxChip` | Ready | Styled chip with action handler |
| `DocsApi` | ❌ None | No Equivalent | V0 API documentation renderer (virtual:api module) |
| `DocsApiCard` | `CxApiCard` | Ready | Direct match — API item card |
| `DocsApiHover` | ❌ None | No Equivalent | Hover popover for inline API refs; shiki transformer |
| `DocsApiHoverList` | ❌ None | No Equivalent | Popover list content; docs-specific hover feature |
| `DocsApiHoverSection` | ❌ None | No Equivalent | Popover section; docs-specific hover feature |
| `DocsApiLinks` | ❌ None | No Equivalent | Links to API documentation; v0-specific routing |
| `DocsApiSection` | ❌ None | No Equivalent | Section container for API groups; v0 docs convention |
| `DocsAsk` | ❌ None | No Equivalent | Ask AI panel (LLM integration with Pinia store) |
| `DocsAskForm` | ❌ None | No Equivalent | Ask AI form/input; Pinia store dependency |
| `DocsAskInput` | ❌ None | No Equivalent | Ask AI input field; Pinia store dependency |
| `DocsAskMessage` | ❌ None | No Equivalent | Ask AI message display; Pinia store dependency |
| `DocsAskPanel` | ❌ None | No Equivalent | Ask AI panel container; Pinia store dependency |
| `DocsBackToTop` | `CxBackToTop` | Ready | Direct match — scroll-to-top button |
| `DocsBackmatter` | ❌ None | No Equivalent | Post-content section (feedback, related docs) |
| `DocsBadge` | `CxBadge` | Ready | Direct match — inline badge element |
| `DocsBenchmarks` | ❌ None | No Equivalent | Benchmark stats display; custom v0 metrics |
| `DocsBrowserSupport` | ❌ None | No Equivalent | Browser compatibility table; v0-specific feature |
| `DocsCallout` | `CxCallout` | Ready | Direct match — highlighted callout box |
| `DocsCard` | `CxCard` | Ready | Direct match — card container |
| `DocsCodeActions` | ❌ None | No Equivalent | Code action buttons (copy, open playground) |
| `DocsCodeGroup` | `CxCodeGroup` | Ready | Direct match — tabbed code blocks |
| `DocsDiscoveryStep` | ❌ None | No Equivalent | Discovery tour step; docs-specific onboarding |
| `DocsExample` | `CxExample` | Ready | Direct match — interactive code example |
| `DocsExampleCodePane` | `CxExampleCode` (partial) | Needs Work | Codex version may differ in structure |
| `DocsExampleDescription` | ❌ None | No Equivalent | Example description text wrapper |
| `DocsFaq` | `CxFaq` | Ready | Direct match — FAQ list container |
| `DocsFaqItem` | `CxFaqItem` | Ready | Direct match — FAQ item (accordion) |
| `DocsFeedback` | ❌ None | No Equivalent | Feedback form at end of page; custom UI |
| `DocsHeaderAnchor` | `CxHeaderAnchor` | Ready | Direct match — heading with anchor link |
| `DocsHighlight` | ❌ None | No Equivalent | Syntax highlight wrapper; uses highlighter composable |
| `DocsKbd` | `CxKbd` | Ready | Direct match — keyboard key display |
| `DocsLastCommit` | ❌ None | No Equivalent | Git commit info; custom metadata |
| `DocsMarkup` | ❌ None | No Equivalent | Markdown renderer wrapper; docs infrastructure |
| `DocsMaturity` | ❌ None | No Equivalent | Component maturity badge (experimental/stable) |
| `DocsMermaid` | `CxMermaid` | Ready | Direct match — Mermaid diagram renderer |
| `DocsNavigator` | `CxPageNavigator` | Ready | Direct match — page section navigator |
| `DocsPaletteBrowse` | ❌ None | No Equivalent | Palette browser UI; design-system specific |
| `DocsPaletteExplorer` | ❌ None | No Equivalent | Interactive palette generator; design-system specific |
| `DocsPaletteGenerate` | ❌ None | No Equivalent | Palette generation form; design-system specific |
| `DocsPalettePreview` | ❌ None | No Equivalent | Palette color preview grid; design-system specific |
| `DocsProgressBar` | `CxProgressBar` | Ready | Direct match — progress indicator |
| `DocsRelated` | ❌ None | No Equivalent | Related docs links section; routing/metadata |
| `DocsReleases` | ❌ None | No Equivalent | Release notes display; custom content sourcing |
| `DocsRoadmap` | ❌ None | No Equivalent | Roadmap visualization; custom data structure |
| `DocsSearch` | `CxSearch` | Ready | Direct match — global search interface |
| `DocsSkeleton` | `CxSkeleton` | Ready | Direct match — loading skeleton |
| `DocsToc` | `CxToc` | Ready | Direct match — table of contents |

**Summary**: 18 ready / 2 needs-work / 27 no-equivalent

---

## Table 3: Composable Mapping (docs → codex)

| Docs Composable | Codex Equivalent | Status | Notes |
|---|---|---|---|
| `useApiHelpers` | ❌ None | No Equivalent | V0 API introspection helpers; virtual:api module |
| `useAsk` | ❌ None | No Equivalent | AI chat state (Pinia store integration) |
| `useBenchmarkData` | ❌ None | No Equivalent | Benchmark fetching; v0-specific metrics |
| `useBreadcrumbItems` | ❌ None | No Equivalent | Breadcrumb route data; docs routing |
| `useClipboard` | `useClipboard` | Ready | Direct match — copy-to-clipboard |
| `useCodeHighlighter` | `useCodeHighlighter` | Ready | Direct match — syntax highlighting |
| `useCountUp` | `useCountUp` | Ready | Direct match — numeric animation |
| `useCustomThemes` | ❌ None | No Equivalent | Custom theme palette management; docs UI |
| `useDiscovery` | ❌ None | No Equivalent | Discovery tour state; docs onboarding feature |
| `useExamples` | ❌ None | No Equivalent | Example metadata loading; v0 docs convention |
| `useHighlightCode` | ❌ None | No Equivalent | Code highlighter wrapper; deprecated? |
| `useHighlighter` | ❌ None | No Equivalent | Markdown highlighter; docs infra |
| `useIdleCallback` | `useIdleCallback` | Ready | Direct match — requestIdleCallback wrapper |
| `useLevelFilter` | ❌ None | No Equivalent | Skill level filtering state; docs educational feature |
| `useMarkdown` | ❌ None | No Equivalent | Markdown renderer; docs infra |
| `useNavConfig` | ❌ None | No Equivalent | Navigation structure; docs routing |
| `useNavNested` | ❌ None | No Equivalent | Nested nav item state; docs-specific |
| `useNavigation` | ❌ None | No Equivalent | Top-level navigation state; docs routing |
| `usePageMeta` | ❌ None | No Equivalent | Page metadata (title, description) |
| `usePlayground` | ❌ None | No Equivalent | Playground integration; v0-specific |
| `usePopoverPosition` | `usePopoverPosition` | Ready | Direct match — popover positioning |
| `useRoute` | ❌ None | No Equivalent | Router state wrapper; Vue Router standard |
| `useRouterLinks` | `useRouterLinks` | Ready | Direct match — route link enhancement |
| `useScrollLock` | `useScrollLock` | Ready | Direct match — scroll prevention |
| `useScrollPersist` | `useScrollPersist` | Ready | Direct match — scroll position restoration |
| `useScrollSpy` | `useScrollSpy` | Ready | Direct match — scroll section tracking |
| `useSearch` | `useSearch` | Ready | Direct match — search functionality |
| `useSettings` | `useSettings` | Ready | Direct match — app settings state |
| `useSyncedRef` | ❌ None | No Equivalent | Ref sync utility; could be v0 pattern |
| `useThemeToggle` | `useThemeToggle` | Ready | Direct match — theme mode toggle |
| `useToc` | `useToc` | Ready | Direct match — table of contents generation |

**Summary**: 16 ready / 0 needs-work / 15 no-equivalent

---

## Table 4: Migration Blockers

### Hard Blockers (would require significant codex enhancements)

| Blocker | Impact | Mitigation |
|---|---|---|
| **Ask AI / LLM Integration** | DocsAsk* components + Pinia store | Keep docs version; would need custom LLM provider in codex |
| **API Documentation Rendering** | DocsApi*, virtual:api module | Keep docs version; codex has no v0 introspection capability |
| **Discovery Tours** | DiscoveryX components + state | Keep docs version; onboarding feature orthogonal to codex |
| **Skill Level Filtering** | AppLevelChip, useLevelFilter | Keep docs version; educational feature unique to v0 docs |
| **Palette Generation/Explorer** | DocsPaletteX components | Keep docs version; design-tool feature unique to v0 |
| **Virtual Module System** | virtual:api, virtual:examples | Keep docs version; build-time introspection |
| **Pinia Store Dependencies** | useAsk, useCustomThemes, etc. | Keep docs version; state management is local concern |

### Medium Blockers (codex differences, not missing features)

| Blocker | Impact | Mitigation |
|---|---|---|
| **useSettings Scope** | Docs has 11 settings; codex has 3 | Extend CodexSettings interface in codex to include show-ui flags |
| **Theme Selector** | Docs has palette picker; codex has mode toggle | Keep AppThemeSelector in docs; use CxThemeToggle for mode only |
| **Search Inline vs Dialog** | AppSearchInline is form; CxSearch might be read-only | Check CxSearch API; add inline variant if needed |
| **Layout Structure** | AppHomePage vs CxDocLayout | May differ in slot structure; verify in pilot migration |
| **Example Code Pane** | DocsExampleCodePane internals | Verify CxExampleCode structure matches usage pattern |

### Cosmetic Blockers (non-functional features)

| Blocker | Impact | Mitigation |
|---|---|---|
| **AppBurst** | Particle effect animation | Remove or implement as local decorator |
| **AppMeshBg** | Animated background pattern | Remove or implement as local decorator |
| **AppDotGrid** | Background grid effect | Remove or implement as local decorator |
| **AppThemePreview** | Color swatch grid display | Create simple CxThemePreview wrapper in docs |

---

## Table 5: Recommended First Migration Candidates

### Phase 1: Layout & Navigation (lowest risk, highest impact)

**Why first**: These form the skeleton of the app. Migrating them unblocks other components.

| Component | Effort | Risk | Rationale |
|---|---|---|---|
| `CxAppBar` ← `AppBar` | 1d | Low | Direct replacement; no docs-specific logic |
| `CxAppNav` ← `AppNav` | 1d | Low | Navigation structure; docs routing stays local |
| `CxAppMain` ← `AppMain` | 0.5d | Low | Minimal wrapper; slot changes trivial |
| `CxAppBanner` ← `AppBanner` | 0.5d | Low | Simple header; no state |
| `CxAppFooter` ← `AppFooter` | 0.5d | Low | Simple footer; no state |
| `CxToc` ← `DocsToc` | 1d | Medium | Depends on scroll-spy; codex has `useScrollSpy` |
| `CxBreadcrumbs` ← `AppBreadcrumbs` | 0.5d | Low | Data source is router; codex component is pure |

**Subtotal**: ~5 days of integration work
**Unblocks**: Full app layout; enables phase 2 migrations

---

### Phase 2: Content Components (medium risk, high value)

**Why second**: Once layout is done, content can be migrated without scope creep.

| Component | Effort | Risk | Rationale |
|---|---|---|---|
| `CxCodeGroup` ← `DocsCodeGroup` | 1d | Low | Direct replacement; no state |
| `CxExample` ← `DocsExample` | 1d | Medium | May need playground integration tweaks |
| `CxCallout` ← `DocsCallout` | 0.5d | Low | Direct replacement |
| `CxCard` ← `DocsCard` | 0.5d | Low | Direct replacement |
| `CxBadge` ← `DocsBadge` | 0.5d | Low | Direct replacement |
| `CxChip` ← `DocsActionChip` (+ AppChip) | 0.5d | Low | Wrapper around CxChip |
| `CxMermaid` ← `DocsMermaid` | 0.5d | Low | Direct replacement |
| `CxFaq` + `CxFaqItem` ← `DocsFaq*` | 1d | Low | Accordion pattern; codex version available |

**Subtotal**: ~6 days of integration work
**Unblocks**: Standard content rendering; enables detailed docs pages

---

### Phase 3: Utilities & Helpers (lowest risk, mechanical)

**Why third**: No UI impact; purely functional replacement.

| Composable | Effort | Risk | Rationale |
|---|---|---|---|
| `useClipboard` | 0.5d | Low | Direct import replacement |
| `useCodeHighlighter` | 0.5d | Low | Direct import replacement |
| `useCountUp` | 0.5d | Low | Direct import replacement |
| `useIdleCallback` | 0.5d | Low | Direct import replacement |
| `usePopoverPosition` | 0.5d | Low | Direct import replacement |
| `useRouterLinks` | 0.5d | Low | Direct import replacement |
| `useScrollLock` | 0.5d | Low | Direct import replacement |
| `useScrollPersist` | 0.5d | Low | Direct import replacement |
| `useScrollSpy` | 0.5d | Low | Direct import replacement |
| `useSearch` | 1d | Medium | Integration with docs search index |
| `useSettings` | 1d | Medium | Scope extension; add missing settings |
| `useThemeToggle` | 1d | Medium | Verify theme store integration |

**Subtotal**: ~8 days of migration work
**Impact**: Eliminates duplicate code; shrinks docs by ~30% (composable duplication)

---

### Phase 4: What to Keep Local (not migrate)

**These are docs-specific and should NOT move to codex:**

- `DocsAsk*` (LLM integration; Pinia store)
- `DocsApi*` (V0-specific introspection; virtual:api)
- `Discovery*` (docs onboarding; independent feature)
- `AppLevelChip`, `useLevelFilter` (educational metadata; v0-specific)
- `DocsPaymentX` (design tool; not general docs infrastructure)
- Cosmetic: `AppBurst`, `AppMeshBg`, `AppDotGrid`

**Estimated docs codebase reduction after full migration**: ~35% (mostly from composable duplication removal)

---

## Summary & Recommendation

### What We're Gaining
- **48 components** ready to reuse (25 App/23 Docs)
- **16 composables** ready to reuse
- **Code reduction**: ~35% less duplication
- **Maintenance**: Single source of truth for common UI patterns
- **Consistency**: Codex becoming the reference implementation

### What We're Keeping Local
- **8 component groups** with special docs/v0 dependencies
- **15 composables** tied to docs infrastructure
- **Pinia stores**, **virtual modules**, **AI integration**

### Recommended Approach

**Start with Phase 1 (Layout & Navigation)**:
- Migrate `CxAppBar` ← `AppBar`
- Migrate `CxAppNav` ← `AppNav`
- Migrate `CxAppMain` ← `AppMain`
- Migrate `CxAppBanner` ← `AppBanner`
- Migrate `CxAppFooter` ← `AppFooter`

**Success criteria**:
- App visual structure unchanged
- All routing/navigation working
- No Cypress test breakage
- Deploy to staging for visual regression testing

**After Phase 1 succeeds**, move to Phase 2 (content) and Phase 3 (utilities) in parallel.

---

## Migration Checklist Template (for each PR)

```markdown
## Migration: [Phase] [Component(s)]

### Changes
- [ ] Component import changed from docs local to `@paper/codex`
- [ ] Props/emits API verified against codex version
- [ ] Styling adjustments made (if needed)
- [ ] All references updated (imports, usages)

### Testing
- [ ] Local dev server runs without errors
- [ ] Page renders correctly in browser
- [ ] No visual regressions on staging
- [ ] Cypress tests pass (or updated if API changed)

### Documentation
- [ ] Component stubs removed from docs if they existed
- [ ] Updated MIGRATION.md with completion status
```
