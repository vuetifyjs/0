// apps/builder/src/plugins/rules/defaults.ts

// RulesOptions in packages/0/src/composables/useRules is { aliases?: Partial<RuleAliases> },
// where each alias maps a name to a predicate function. Predicates can't be authored in a
// form, so the builder stores names only and the code generator emits implementations for
// the names it knows, stubs for the rest.
export interface RulesConfig {
  aliases: string[]
}

// Names the generator can emit a working predicate for. Anything else becomes a stub.
export const KNOWN_ALIASES = ['required', 'email', 'min', 'max', 'pattern', 'url', 'numeric']

export const defaultConfig: RulesConfig = {
  aliases: [],
}
