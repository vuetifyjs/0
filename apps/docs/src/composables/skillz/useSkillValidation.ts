// Types
import type { Ref } from 'vue'

export interface ValidationResult {
  isValid: boolean
  pattern: string
}

export function useSkillValidation (code: Ref<string>) {
  function validate (pattern: string | RegExp): boolean {
    if (!code.value) return false
    const regex = typeof pattern === 'string' ? new RegExp(pattern, 's') : pattern
    return regex.test(code.value)
  }

  function validateStep (pattern?: string): ValidationResult {
    if (!pattern) {
      return { isValid: true, pattern: '' }
    }
    return {
      isValid: validate(pattern),
      pattern,
    }
  }

  function validateMultiple (patterns: string[]): boolean {
    return patterns.every(p => validate(p))
  }

  return {
    validate,
    validateStep,
    validateMultiple,
  }
}
