<template>
  <div class="auth-layout">
    <slot />
    <AppToast />
  </div>
</template>

<script setup lang="ts">
defineRouteMiddleware('auth')
</script>

<style scoped>
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}
</style>
