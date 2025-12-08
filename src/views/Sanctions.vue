<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="page-main">
        <div class="under-construction">
          <div class="construction-icon"><i class="bi bi-exclamation-triangle"></i></div>
          <h1 class="construction-title">Санкции</h1>
          <p class="construction-text">Страница находится в разработке</p>
          <router-link to="/" class="btn-back">
            <i class="bi bi-arrow-left me-2"></i>Вернуться на главную
          </router-link>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'

const showMenu = ref(false)
</script>

<style scoped>
@import '../assets/common-page.css';
</style>
