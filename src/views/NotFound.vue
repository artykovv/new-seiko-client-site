<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="notfound-main">
        <div class="notfound-content">
          <div class="error-animation">
            <div class="error-number">4</div>
            <div class="error-icon">
              <i class="bi bi-emoji-frown"></i>
            </div>
            <div class="error-number">4</div>
          </div>

          <h1 class="error-title">Страница не найдена</h1>
          <p class="error-message">
            К сожалению, запрашиваемая страница не существует или была перемещена
          </p>

          <div class="error-actions">
            <router-link to="/" class="btn-home">
              <i class="bi bi-house-door me-2"></i>На главную
            </router-link>
            <button @click="goBack" class="btn-back">
              <i class="bi bi-arrow-left me-2"></i>Назад
            </button>
          </div>

          <div class="helpful-links">
            <p class="links-title">Полезные ссылки:</p>
            <div class="links-grid">
              <router-link to="/profile" class="link-item">
                <i class="bi bi-person"></i>
                <span>Профиль</span>
              </router-link>
              <router-link to="/catalog" class="link-item">
                <i class="bi bi-box-seam"></i>
                <span>Каталог</span>
              </router-link>
              <router-link to="/structure" class="link-item">
                <i class="bi bi-diagram-3"></i>
                <span>Структура</span>
              </router-link>
              <router-link to="/personals" class="link-item">
                <i class="bi bi-people"></i>
                <span>Личники</span>
              </router-link>
            </div>
          </div>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'

const showMenu = ref(false)
const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.notfound-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notfound-content {
  background: white;
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 600px;
  width: 100%;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Error Animation */
.error-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.error-number {
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  animation: bounce 2s ease-in-out infinite;
}

.error-icon {
  font-size: 80px;
  color: #667eea;
  animation: swing 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes swing {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

/* Error Text */
.error-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 16px;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Action Buttons */
.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-home,
.btn-back {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-home {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-back {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-back:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Helpful Links */
.helpful-links {
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.links-title {
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 1rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  color: #495057;
  transition: all 0.3s ease;
}

.link-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

.link-item i {
  font-size: 24px;
}

.link-item span {
  font-size: 13px;
  font-weight: 600;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .notfound-main {
    padding: 1.5rem 1rem;
  }

  .notfound-content {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }

  .error-number {
    font-size: 80px;
  }

  .error-icon {
    font-size: 60px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-message {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
  }

  .btn-home,
  .btn-back {
    width: 100%;
    justify-content: center;
  }

  .links-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .link-item {
    padding: 0.875rem;
  }

  .link-item i {
    font-size: 20px;
  }

  .link-item span {
    font-size: 12px;
  }
}

/* Small phones */
@media (max-width: 480px) {
  .notfound-content {
    padding: 1.5rem 1rem;
  }

  .error-number {
    font-size: 60px;
  }

  .error-icon {
    font-size: 40px;
  }

  .error-title {
    font-size: 20px;
  }

  .error-animation {
    gap: 0.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .notfound-main {
    padding: 3rem;
  }

  .notfound-content {
    padding: 4rem 3rem;
  }

  .links-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
