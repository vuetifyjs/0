// `index.ts` side-effect-imports the utilities stylesheet; `@vue/tsconfig`
// enables `noUncheckedSideEffectImports`, so the import needs a resolvable
// module. tsdown bundles the CSS into `dist/style.css` and emits no JS for it.
export {}
