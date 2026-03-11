# Maturity Matrix Design

## Overview

A heat-based maturity model for every composable and component in `@vuetify/v0`. Tracks readiness from cold (draft) to blazing (mature), stored in a JSON data file and rendered in docs via `createDataTable`.

## Levels

| Level | Color | MDI Icon | Meaning |
|---|---|---|---|
| `draft` | Cool blue | `mdi-snowflake` | Exists, not ready for external use |
| `preview` | Yellow | `mdi-flash` | Usable, API may change |
| `stable` | Orange | `mdi-fire` | Production-ready, API settled |
| `mature` | Red | `mdi-volcano` | Battle-tested, benchmarked, fully documented |
| `deprecated` | Gray | `mdi-weather-fog` | Superseded, migration path available |

## Graduation Criteria

### Draft → Preview

- Has unit tests
- Has documentation page
- API may still change

### Preview → Stable

- Tests cover edge cases (not just happy path)
- Docs include usage examples
- SSR safe (or explicitly marked browser-only)
- No breaking API changes planned

### Stable → Mature

- Has benchmarks (if performance-critical)
- Accessibility reviewed
- Adapter ecosystem (if applicable)
- Real-world usage in downstream project (e.g., Vuetify 4)
- API frozen — breaking changes require major version

### → Deprecated

- Superseded by another primitive
- Migration path documented

## Data File

**Location:** `packages/0/src/maturity.json`

Single source of truth. Companion `maturity.schema.json` for validation.

```json
{
  "$schema": "./maturity.schema.json",
  "composables": {
    "createSelection": {
      "level": "mature",
      "since": "0.1.0",
      "notes": "Used in Vuetify 4 selection system"
    },
    "createModel": {
      "level": "stable",
      "since": "0.1.5",
      "notes": "Recently redesigned, API settled"
    }
  },
  "components": {
    "Dialog": {
      "level": "stable",
      "since": "0.1.0"
    }
  }
}
```

Each entry has:

- `level` — one of the 5 maturity levels
- `since` — version when the primitive was introduced
- `notes` — optional context (usage, caveats, migration info)

## Docs Page

**Route:** `/maturity` in the docs app

### Implementation

- Uses `createDataTable` from `@vuetify/v0` to render the matrix
- Sortable by name, level, category, since-version
- Filterable by level (with heat-colored chips/badges)
- Each row shows: MDI icon + color badge, primitive name, category, level, since version, notes
- Toggle or tabs to switch between composables and components

### Visual Design

- Level badges use the heat color scheme with corresponding MDI icons
- Table rows subtly tinted by level color
- Filter chips at the top for quick level filtering

## Scope Exclusions (YAGNI)

- No runtime exports — purely informational
- No automated level detection — manually assigned, reviewed at release time
- No per-dimension breakdown in data — level is the roll-up, criteria live in docs prose
- No Storybook integration

## Inventory

### Composables (45)

Based on current codebase analysis (March 2026):

| Composable | Category | Tests | Docs | Benchmarks | SSR | Downstream Use | Proposed Level |
|---|---|---|---|---|---|---|---|
| createContext | Foundation | Yes | Yes | No | Yes | Yes | stable |
| createPlugin | Foundation | Yes | Yes | No | Yes | Yes | stable |
| createTrinity | Foundation | Yes | Yes | No | Yes | Yes | stable |
| createSelection | Selection | Yes | Yes | Yes | Yes | Yes | mature |
| createSingle | Selection | Yes | Yes | No | Yes | Yes | stable |
| createGroup | Selection | Yes | Yes | No | Yes | Yes | stable |
| createStep | Selection | Yes | Yes | No | Yes | Yes | stable |
| createModel | Selection | Yes | Yes | Yes | Yes | No | stable |
| createNested | Selection | Yes | Yes | Yes | Yes | Yes | mature |
| createRegistry | Registration | Yes | Yes | Yes | Yes | Yes | mature |
| createQueue | Registration | Yes | Yes | No | Yes | No | stable |
| createTimeline | Registration | Yes | Yes | No | Yes | No | stable |
| createTokens | Registration | Yes | Yes | Yes | Yes | Yes | mature |
| createForm | Forms | Yes | Yes | No | Yes | No | stable |
| createDataTable | Data | Yes | Yes | Yes | Yes | No | stable |
| createFilter | Data | Yes | Yes | Yes | Yes | No | stable |
| createPagination | Data | Yes | Yes | No | Yes | No | stable |
| createVirtual | Data | Yes | Yes | Yes | Yes | Yes | mature |
| createBreadcrumbs | Utilities | Yes | Yes | No | Yes | No | stable |
| createOverflow | Utilities | Yes | Yes | No | Yes | No | stable |
| createSlider | Forms | Yes | Yes | No | Yes | No | preview |
| createObserver | Internal | No | No | No | Yes | No | draft |
| useBreakpoints | Plugins | Yes | Yes | No | Browser | Yes | stable |
| useDate | Plugins | Yes | Yes | Yes | Yes | Yes | mature |
| useFeatures | Plugins | Yes | Yes | No | Yes | No | stable |
| useHydration | Plugins | Yes | Yes | No | Yes | No | stable |
| useLocale | Plugins | Yes | Yes | No | Yes | Yes | stable |
| useLogger | Plugins | Yes | Yes | No | Yes | No | stable |
| usePermissions | Plugins | Yes | Yes | No | Yes | No | stable |
| useStack | Plugins | Yes | Yes | No | Yes | No | stable |
| useStorage | Plugins | Yes | Yes | No | Browser | No | stable |
| useTheme | Plugins | Yes | Yes | No | Yes | Yes | stable |
| useClickOutside | Events | Yes | Yes | No | Browser | No | stable |
| useEventListener | Events | Yes | Yes | No | Browser | No | stable |
| useHotkey | Events | Yes | Yes | No | Browser | No | stable |
| useIntersectionObserver | Events | Yes | Yes | No | Browser | No | stable |
| useMutationObserver | Events | Yes | Yes | No | Browser | No | stable |
| useResizeObserver | Events | Yes | Yes | No | Browser | No | stable |
| useToggleScope | Events | Yes | Yes | No | Yes | No | stable |
| useMediaQuery | Events | Yes | Yes | No | Browser | No | stable |
| useLazy | Events | Yes | Yes | No | Yes | No | stable |
| useProxyModel | Reactivity | Yes | Yes | No | Yes | No | stable |
| useProxyRegistry | Reactivity | Yes | Yes | Yes | Yes | No | stable |
| toArray | Transformers | Yes | Yes | No | Yes | No | stable |
| toElement | Transformers | Yes | Yes | No | Browser | No | stable |
| toReactive | Transformers | Yes | Yes | No | Yes | No | stable |

### Components (18)

| Component | Category | Tests | Docs | Downstream Use | Proposed Level |
|---|---|---|---|---|---|
| Atom | Primitives | Yes | Yes | No | stable |
| Checkbox | Forms | Yes | Yes | No | stable |
| Radio | Forms | Yes | Yes | No | stable |
| Switch | Forms | Yes | Yes | No | stable |
| Dialog | Disclosure | Yes | Yes | No | stable |
| ExpansionPanel | Disclosure | Yes | Yes | No | stable |
| Popover | Disclosure | Yes | Yes | No | stable |
| Tabs | Disclosure | Yes | Yes | No | stable |
| Avatar | Semantic | Yes | Yes | No | stable |
| Breadcrumbs | Semantic | Yes | Yes | No | stable |
| Pagination | Semantic | Yes | Yes | No | stable |
| Group | Providers | Yes | Yes | No | stable |
| Scrim | Providers | Yes | Yes | No | stable |
| Selection | Providers | Yes | Yes | No | stable |
| Single | Providers | Yes | Yes | No | stable |
| Slider | Forms | Yes | Yes | No | preview |
| Splitter | Semantic | Yes | Yes | No | preview |
| Step | Providers | Yes | Yes | No | stable |
