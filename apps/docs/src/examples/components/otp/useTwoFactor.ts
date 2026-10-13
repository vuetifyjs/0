import { shallowRef } from 'vue'

export function useTwoFactor () {
  const code = shallowRef('')
  const payload = shallowRef<string>()

  function onSubmit (form: HTMLFormElement) {
    // Read what the browser would post — the code arrives via Otp's hidden input
    payload.value = JSON.stringify(Object.fromEntries(new FormData(form)))
  }

  function reset () {
    code.value = ''
    payload.value = undefined
  }

  return { code, payload, onSubmit, reset }
}
