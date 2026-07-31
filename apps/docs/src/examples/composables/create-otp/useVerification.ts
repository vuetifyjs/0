import { createOtp } from '@vuetify/v0'
import { shallowRef, toRef } from 'vue'

export type VerificationStatus = 'editing' | 'verifying' | 'verified' | 'rejected'

// The code the mock backend accepts — enter a different one to see the rejection path.
const VALID_CODE = '424242'

export function useVerification () {
  const verified = shallowRef(false)

  const otp = createOtp({
    length: 6,
    pattern: 'numeric',
    onComplete: async value => {
      // Simulate a server round-trip; every mutation helper no-ops while this is in flight.
      await new Promise(resolve => setTimeout(resolve, 900))
      const ok = value === VALID_CODE
      verified.value = ok
      return ok // returning false clears the value and surfaces input.errors
    },
  })

  const status = toRef((): VerificationStatus => {
    if (verified.value) return 'verified'
    if (otp.isValidating.value) return 'verifying'
    if (otp.input.errors.value.length > 0) return 'rejected'
    return 'editing'
  })

  function reset () {
    verified.value = false
    otp.input.reset()
  }

  return { otp, status, verified, reset }
}
