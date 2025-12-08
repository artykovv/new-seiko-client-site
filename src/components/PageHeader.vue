<template>
  <header class="page-header">
    <div class="header-content">
      <img src="/logo.svg" alt="Seiko Logo" class="header-logo">
      <div class="header-title">SEIKO GLOBAL</div>
      <button @click="$emit('toggle-menu')" class="btn-menu">
        <i class="bi bi-list"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle-menu'])
</script>

<style scoped>
.page-header {
  background: #000080;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem;
}

.header-logo {
  height: 40px;
  width: auto;
  filter: brightness(0) invert(1);
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
}

.btn-menu {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid white;
  color: white;
  border-radius: 12px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-menu:hover {
  background: white;
  color: #000080;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

@media (max-width: 576px) {
  .header-content {
    padding: 1rem;
  }

  .header-logo {
    height: 32px;
  }

  .header-title {
    font-size: 14px;
    letter-spacing: 1px;
  }

  .btn-menu {
    width: 44px;
    height: 44px;
  }
}

@media (min-width: 1024px) {
  .header-content {
    padding: 1.5rem 3rem;
  }

  .header-title {
    font-size: 24px;
  }
}
</style>
