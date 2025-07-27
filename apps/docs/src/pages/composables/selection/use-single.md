<script setup>
  import Mermaid from '@/components/Mermaid.vue'
</script>

# useSingle

A wrapper around `useGroup` that provides a simplified API for single-selection scenarios with singular selection properties and streamlined selection methods.

<Mermaid code="
flowchart TD
createContext --> useRegistrar
useRegistrar --> useGroup
useGroup --> useSingle
" />
