<template>
  <div class="detail-field">
    <div class="detail-field-label">{{ label }}</div>
    <div class="detail-field-value">{{ value || '—' }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string | number }>()
</script>