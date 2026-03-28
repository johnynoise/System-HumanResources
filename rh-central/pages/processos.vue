<template>
  <div>
    <!-- ── SUB-NAV ──────────────────────────── -->
    <div class="sub-nav">
      <NuxtLink to="/processos" class="sub-nav-btn" exact-active-class="active">
        Dashboard
      </NuxtLink>
      <NuxtLink to="/processos/lista" class="sub-nav-btn" active-class="active">
        Processos
      </NuxtLink>
      <NuxtLink to="/processos/novo" class="sub-nav-btn" active-class="active">
        + Novo Processo
      </NuxtLink>
    </div>

    <!-- ── PAGE ─────────────────────────────── -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const store = useProcessosStore()
onMounted(() => store.load())
</script>

<style scoped>
.sub-nav {
  display: flex;
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius2);
  padding: 6px;
  margin-bottom: 28px;
  width: fit-content;
}

.sub-nav-btn {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 8px 18px;
  border-radius: calc(var(--radius2) - 4px);
  color: var(--text3);
  text-decoration: none;
  transition: all 0.15s;
}

.sub-nav-btn:hover { color: var(--text2); }
.sub-nav-btn.active {
  background: var(--accent);
  color: #000;
  font-weight: 700;
}
</style>
