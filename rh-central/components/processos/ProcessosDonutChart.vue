<template>
  <div class="donut-wrap">
    <canvas ref="canvasRef" width="120" height="120" />
    <div class="donut-legend">
      <div v-if="!total" style="color:var(--text3);font-size:11px;font-family:'DM Mono'">Sem dados</div>
      <div v-for="s in segments" :key="s.label" class="donut-leg-item">
        <div class="donut-dot" :style="{ background: s.color }" />
        <span>{{ s.label }}: <strong style="color:var(--text)">{{ s.val }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  procedentes: number
  improcedentes: number
  parciais: number
  total: number
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const segments = computed(() => {
  const pend = props.total - props.procedentes - props.improcedentes - props.parciais
  return [
    { val: props.procedentes,   color: '#ff4d4d', label: 'Procedente' },
    { val: props.improcedentes, color: '#4dff91', label: 'Improcedente' },
    { val: props.parciais,      color: '#ffb84d', label: 'Parcial' },
    { val: pend,                color: '#333',    label: 'Pendente' },
  ].filter(s => s.val > 0)
})

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, 120, 120)

  if (!props.total) {
    ctx.beginPath()
    ctx.arc(60, 60, 44, 0, Math.PI * 2)
    ctx.strokeStyle = '#2a2a2a'
    ctx.lineWidth = 14
    ctx.stroke()
    return
  }

  let angle = -Math.PI / 2
  segments.value.forEach(s => {
    const slice = (s.val / props.total) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(60, 60, 44, angle, angle + slice)
    ctx.strokeStyle = s.color
    ctx.lineWidth = 14
    ctx.stroke()
    angle += slice
  })

  ctx.fillStyle = '#e8e8e8'
  ctx.font = 'bold 20px Syne, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(props.total), 60, 60)
}

onMounted(draw)
watch(() => [props.total, props.procedentes, props.improcedentes, props.parciais], draw)
</script>

<style scoped>
.donut-wrap { display: flex; align-items: center; gap: 24px; }
.donut-legend { display: flex; flex-direction: column; gap: 8px; }
.donut-leg-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text2); }
.donut-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
</style>
