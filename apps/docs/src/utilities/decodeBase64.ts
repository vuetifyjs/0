/**
 * Decodes a Unicode-safe base64 encoded string with error handling.
 * Falls back to returning the original string if decoding fails.
 */
export function decodeBase64 (code: string): string {
  try {
    // Decode Unicode-safe base64 (inverse of btoa(unescape(encodeURIComponent(text))))
    return decodeURIComponent(escape(atob(code)))
  } catch {
    console.error('Failed to decode base64 code')
    return code
  }
}
