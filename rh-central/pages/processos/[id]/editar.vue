<template>
  <div>
    <div class="page-header">
      <div>
        <NuxtLink :to="`/processos/${id}`" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar para detalhes
        </NuxtLink>
        <div class="page-title" style="margin-top:0.5rem">Editar Processo</div>
        <div class="page-sub" style="color:var(--primary-container)">{{ processo?.numero }}</div>
      </div>
    </div>

    <ProcessosForm v-if="processo" :initial="processo" @saved="onSaved" />
    <div v-else class="empty">
      <div class="empty-icon">🔍</div>
      <div class="empty-text">Processo não encontrado</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const store = useProcessosStore()
const { toast } = useToast()

const id = route.params.id as string
const processo = computed(() => store.getById(id))

function onSaved() {
  toast('Processo atualizado')
  navigateTo(`/processos/${id}`)
}
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: color 0.15s;
  margin-bottom: 0.5rem;
}
.back-link:hover { color: var(--primary-container); }
</style>