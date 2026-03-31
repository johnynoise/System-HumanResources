<template>
  <div>
    <!-- ── SUB-NAV — Filter Header ──────── -->
    <div class="sub-nav-wrap">
      <nav class="sub-nav">
        <NuxtLink to="/processos" class="sub-nav-btn" exact-active-class="active">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/processos/lista" class="sub-nav-btn" active-class="active">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Processos
        </NuxtLink>
        <NuxtLink to="/processos/novo" class="sub-nav-btn sub-nav-btn--action" active-class="active">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Processo
        </NuxtLink>
      </nav>
    </div>

    <!-- ── PAGE ─────────────────────────── -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const store = useProcessosStore()
onMounted(() => store.load())
</script>

<style scoped>
.sub-nav-wrap {
  margin-bottom: 2rem;
}

.sub-nav {
  display: inline-flex;
  gap: 0.25rem;
  background: var(--surface-container-lowest);
  border-radius: var(--radius-xl);
  padding: 0.3125rem;
  box-shadow: var(--shadow-card);
}

.sub-nav-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 0.5rem 1rem;
  border-radius: 0.5625rem;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
}

.sub-nav-btn:hover:not(.active) {
  color: var(--on-surface);
  background: var(--surface-container-low);
}

.sub-nav-btn.active {
  background: var(--primary-container);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(26, 43, 72, 0.2);
}

.sub-nav-btn--action {
  color: var(--primary-container);
  font-weight: 600;
}

.sub-nav-btn--action.active {
  background: var(--primary-container);
  color: #FFFFFF;
}
</style>