<template>
  <Teleport to="body">
    <div class="toast" :class="{ show: visible }">
      {{ message }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { message, visible } = useToast()
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--accent);
  color: #000;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 12px 18px;
  border-radius: var(--radius);
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.25s;
  pointer-events: none;
  z-index: 9999;
}
.toast.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
