// apps/builder/src/plugins/rules/defaults.ts

export interface RuleAliasDef {
  name: string
  // For v1, store predicate as a placeholder text description.
  // Actual predicate functions are code-only — written by consumer.
  description: string
}

export interface RulesConfig {
  aliases: RuleAliasDef[]
  customSchemaJson?: string // optional JSON blob describing standard-schema rules
}

export const defaultConfig: RulesConfig = {
  aliases: [],
  customSchemaJson: undefined,
}

export const SAMPLE_SCHEMA_JSON = `{
  "email": {
    "type": "string",
    "format": "email"
  },
  "age": {
    "type": "number",
    "minimum": 0,
    "maximum": 150
  }
}`
