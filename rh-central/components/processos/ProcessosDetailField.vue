<template>
  <div class="detail-field">
    <div class="detail-field-label">{{ label }}</div>
    <div class="detail-field-value">{{ value || '—' }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string | number
}>()
</script>

<style scoped>
.detail-field { display: flex; flex-direction: column; gap: 4px; }
.detail-field-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: var(--text3);
  letter-spacing: 1px;
  text-transform: uppercase;
}
.detail-field-value { font-size: 13px; color: var(--text); }
</style>
