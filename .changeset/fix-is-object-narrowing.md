---
"@vuetify/v0": patch
---

fix(utilities): `isObject` narrows to `Record<string, any>` so interfaces and negative branches work (#723)

`isObject` previously narrowed to `Record<string, unknown>`. That destroyed known property types on interface-typed values (TypeScript never grants interfaces an implicit index signature) and left `Record<string, any>` members alive in the `else` branch of a union. Both are incorrect narrowing, not a strictness win.

The predicate is now `Record<string, any>`. Runtime is unchanged. Not breaking — the widened predicate is assignable from the old one for any program that already typechecked.
