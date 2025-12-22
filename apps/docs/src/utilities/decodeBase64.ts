/**
 * Decodes a base64 encoded string with error handling.
 * Falls back to returning the original string if decoding fails.
 */
export function decodeBase64 (code: string): string {
  try {
    return atob(code)
  } catch {
    console.error('Failed to decode base64 code')
    return code
  }
}
