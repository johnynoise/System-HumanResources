<template>
  <div>
    <div class="page-header">
      <div>
        <div style="margin-bottom:8px">
          <NuxtLink :to="`/processos/${id}`" class="back-link">← Voltar para detalhes</NuxtLink>
        </div>
        <div class="page-title">Editar Processo</div>
        <div class="page-sub" style="color:var(--accent)">{{ processo?.numero }}</div>
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
  toast('PROCESSO ATUALIZADO')
  navigateTo(`/processos/${id}`)
}
</script>

<style scoped>
.back-link {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--text3);
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: color 0.15s;
}
.back-link:hover { color: var(--text2); }
</style>
