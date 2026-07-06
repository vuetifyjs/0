---
'@vuetify/v0': patch
---

fix(useRules): accept spec-compliant Standard Schema issue paths

Widens the vendored `StandardSchemaV1` issue `path` typing to `ReadonlyArray<PropertyKey | PathSegment>` per the Standard Schema v1 spec, so schemas typed with `@standard-schema/spec` (Valibot, Zod, ArkType) are assignable to `rules` again.
