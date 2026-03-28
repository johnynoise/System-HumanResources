<template>
  <div class="app-shell">
    <!-- ── HEADER ─────────────────────────── -->
    <header class="app-header">
      <div class="logo">
        <NuxtLink to="/" class="logo-link">
          RH<span class="logo-accent">Central</span>
        </NuxtLink>
        <span class="logo-badge">BETA</span>
      </div>

      <div class="header-right">
        <span class="header-date">{{ headerDate }}</span>
      </div>
    </header>

    <!-- ── SIDEBAR ────────────────────────── -->
    <aside class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-label">MÓDULOS</div>

        <!-- Módulo: Processos Trabalhistas -->
        <NuxtLink to="/processos" class="sidebar-item" active-class="active">
          <span class="sidebar-icon">⚖️</span>
          <span>Processos Trabalhistas</span>
        </NuxtLink>

        <!--
          PLACEHOLDER — Futuros módulos de RH:
          Descomente e crie as páginas conforme for desenvolvendo.

        <NuxtLink to="/recrutamento" class="sidebar-item" active-class="active">
          <span class="sidebar-icon">🎯</span>
          <span>Recrutamento & Seleção</span>
        </NuxtLink>

        <NuxtLink to="/folha" class="sidebar-item" active-class="active">
          <span class="sidebar-icon">💰</span>
          <span>Folha de Pagamento</span>
        </NuxtLink>

        <NuxtLink to="/treinamentos" class="sidebar-item" active-class="active">
          <span class="sidebar-icon">📚</span>
          <span>Treinamentos</span>
        </NuxtLink>

        <NuxtLink to="/beneficios" class="sidebar-item" active-class="active">
          <span class="sidebar-icon">🏥</span>
          <span>Benefícios</span>
        </NuxtLink>

        <NuxtLink to="/ponto" class="sidebar-item" active-class="active">
          <span class="sidebar-icon">🕐</span>
          <span>Controle de Ponto</span>
        </NuxtLink>
        -->
      </div>

      <div class="sidebar-section sidebar-bottom">
        <div class="sidebar-label">EM BREVE</div>
        <div class="sidebar-item disabled">
          <span class="sidebar-icon">🎯</span>
          <span>Recrutamento</span>
          <span class="soon-badge">SOON</span>
        </div>
        <div class="sidebar-item disabled">
          <span class="sidebar-icon">💰</span>
          <span>Folha de Pagamento</span>
          <span class="soon-badge">SOON</span>
        </div>
        <div class="sidebar-item disabled">
          <span class="sidebar-icon">📚</span>
          <span>Treinamentos</span>
          <span class="soon-badge">SOON</span>
        </div>
      </div>
    </aside>

    <!-- ── MAIN CONTENT ───────────────────── -->
    <main class="app-main">
      <slot />
    </main>

    <!-- ── TOAST ──────────────────────────── -->
    <AppToast />
  </div>
</template>

<script setup lang="ts">
const { getHeaderDate } = useHelpers()
const headerDate = getHeaderDate()
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
  grid-template-columns: 220px 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}

/* ── HEADER ── */
.app-header {
  grid-area: header;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-link {
  text-decoration: none;
  color: var(--text);
}

.logo-accent { color: var(--accent); }

.logo-badge {
  background: var(--accent);
  color: #000;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  font-family: 'DM Mono', monospace;
  letter-spacing: 1px;
}

.header-right { display: flex; align-items: center; gap: 16px; }

.header-date {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--text3);
  letter-spacing: 0.5px;
}

/* ── SIDEBAR ── */
.sidebar {
  grid-area: sidebar;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.sidebar-section {
  padding: 0 12px;
  margin-bottom: 24px;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.sidebar-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: var(--text3);
  letter-spacing: 1.5px;
  padding: 0 8px;
  margin-bottom: 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--radius);
  color: var(--text3);
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s;
  cursor: pointer;
  margin-bottom: 2px;
}

.sidebar-item:hover:not(.disabled) {
  background: var(--surface2);
  color: var(--text2);
}

.sidebar-item.active {
  background: rgba(200, 240, 74, 0.08);
  color: var(--accent);
}

.sidebar-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sidebar-icon { font-size: 15px; flex-shrink: 0; }

.soon-badge {
  margin-left: auto;
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  background: var(--surface3);
  color: var(--text3);
  padding: 2px 5px;
  border-radius: 3px;
  letter-spacing: 0.5px;
}

/* ── MAIN ── */
.app-main {
  grid-area: main;
  padding: 32px;
  max-width: 1300px;
  width: 100%;
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .app-shell {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
  }
  .sidebar { display: none; }
  .app-main { padding: 16px; }
}
</style>
