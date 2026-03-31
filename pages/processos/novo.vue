<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Novo Processo</div>
        <div class="page-sub">Cadastro de Processo Trabalhista</div>
      </div>
    </div>
    <ProcessosForm @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
const { toast } = useToast()

function onSaved() {
  toast('Processo cadastrado com sucesso')
  navigateTo('/processos/lista')
}
</script>