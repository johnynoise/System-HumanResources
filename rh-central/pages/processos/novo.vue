<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Novo Processo</div>
        <div class="page-sub">CADASTRO DE PROCESSO TRABALHISTA</div>
      </div>
    </div>

    <ProcessosForm @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
const { toast } = useToast()

function onSaved() {
  toast('PROCESSO CADASTRADO')
  navigateTo('/processos/lista')
}
</script>
