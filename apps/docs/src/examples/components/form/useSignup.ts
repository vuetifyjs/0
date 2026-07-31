import { ref, shallowRef } from 'vue'

export interface SignupData {
  name: string
  email: string
}

export function useSignup () {
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirm = ref('')
  const submitted = shallowRef<SignupData>()
  const serverError = shallowRef<string>()

  function onSubmit (valid: boolean) {
    serverError.value = undefined

    if (!valid) return

    // Simulate a server-side duplicate-account check
    if (email.value === 'taken@example.com') {
      serverError.value = 'An account with this email already exists'
      return
    }

    submitted.value = {
      name: name.value,
      email: email.value,
    }
  }

  function reset () {
    name.value = ''
    email.value = ''
    password.value = ''
    confirm.value = ''
    submitted.value = undefined
    serverError.value = undefined
  }

  return { name, email, password, confirm, submitted, serverError, onSubmit, reset }
}
