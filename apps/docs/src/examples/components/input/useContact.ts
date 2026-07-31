import { ref, shallowRef } from 'vue'

export interface ContactData {
  name: string
  email: string
  message: string
}

export function useContact () {
  const name = ref('')
  const email = ref('')
  const message = ref('')
  const submitted = shallowRef<ContactData>()
  const serverError = shallowRef<string>()

  function onSubmit (valid: boolean) {
    serverError.value = undefined

    if (!valid) return

    // Simulate server-side duplicate check
    if (email.value === 'taken@example.com') {
      serverError.value = 'This email is already registered'
      return
    }

    submitted.value = {
      name: name.value,
      email: email.value,
      message: message.value,
    }
  }

  function reset () {
    name.value = ''
    email.value = ''
    message.value = ''
    submitted.value = undefined
    serverError.value = undefined
  }

  return { name, email, message, submitted, serverError, onSubmit, reset }
}
