<template>
  <Teleport to="body">
    <div class="toast" :class="{ show: visible }">
      <span class="toast-dot"></span>
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
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--primary);
  color: rgba(255, 255, 255, 0.95);
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 0.75rem 1.125rem;
  border-radius: var(--radius-lg);
  opacity: 0;
  transform: translateY(0.5rem);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-float);
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tertiary-fixed-dim);
  flex-shrink: 0;
}
</style>