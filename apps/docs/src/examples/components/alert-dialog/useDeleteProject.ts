import { ref } from 'vue'

export interface Project {
  id: number
  name: string
  environment: string
}

export function useDeleteProject () {
  const projects = ref<Project[]>([
    { id: 1, name: 'marketing-site', environment: 'Production' },
    { id: 2, name: 'api-gateway', environment: 'Production' },
    { id: 3, name: 'design-tokens', environment: 'Preview' },
    { id: 4, name: 'legacy-dashboard', environment: 'Archived' },
  ])

  // Mocked async delete — resolves after a short delay, then drops the project
  function remove (id: number) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        projects.value = projects.value.filter(project => project.id !== id)
        resolve()
      }, 1200)
    })
  }

  return { projects, remove }
}
