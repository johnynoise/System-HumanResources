<template>
  <div class="chart-bar-list">
    <div v-if="!entries.length" class="label-md" style="padding:0.5rem 0">
      Sem dados
    </div>
    <div v-for="[label, val] in entries" :key="label" class="chart-bar-row">
      <div class="chart-bar-label" :title="label">{{ label }}</div>
      <div class="chart-bar-track">
        <div
          class="chart-bar-fill"
          :style="{ width: pct(val) + '%', background: color }"
        />
      </div>
      <div class="chart-bar-val">{{ val }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, number>; color: string }>()

const entries = computed(() =>
  Object.entries(props.data).sort((a, b) => b[1] - a[1]).slice(0, 6)
)
const max = computed(() => entries.value[0]?.[1] || 1)
function pct(val: number) { return Math.round((val / max.value) * 100) }
</script>