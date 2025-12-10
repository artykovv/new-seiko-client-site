<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
      <div class="modal-menu" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Меню</h3>
          <button @click="$emit('close')" class="btn-close-modal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <nav class="menu-nav">
          <router-link 
            to="/" 
            class="menu-item"
            :class="{ 'active': $route.path === '/' }"
            @click="$emit('close')"
          >
            <i class="bi bi-house"></i>
            <span>Главная</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>

          <router-link 
            to="/structure" 
            class="menu-item"
            :class="{ 'active': $route.path === '/structure' }"
            @click="$emit('close')"
          >
            <i class="bi bi-diagram-3"></i>
            <span>Структура</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>

          <router-link 
            to="/rewards" 
            class="menu-item"
            :class="{ 'active': $route.path === '/rewards' }"
            @click="$emit('close')"
          >
            <i class="bi bi-wallet2"></i>
            <span>Вознаграждения</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>

          <router-link 
            to="/profile" 
            class="menu-item"
            :class="{ 'active': $route.path === '/profile' }"
            @click="$emit('close')"
          >
            <i class="bi bi-person-circle"></i>
            <span>Личный кабинет</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>

          <router-link 
            to="/personals" 
            class="menu-item"
            :class="{ 'active': $route.path === '/personals' }"
            @click="$emit('close')"
          >
            <i class="bi bi-people"></i>
            <span>Личники</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>

          <router-link 
            to="/catalog" 
            class="menu-item"
            :class="{ 'active': $route.path === '/catalog' }"
            @click="$emit('close')"
          >
            <i class="bi bi-cart"></i>
            <span>Каталог</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>

          <router-link 
            to="/orders" 
            class="menu-item"
            :class="{ 'active': $route.path === '/orders' }"
            @click="$emit('close')"
          >
            <i class="bi bi-bag-check"></i>
            <span>Заказы</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>

          <router-link 
            to="/sanctions" 
            class="menu-item"
            :class="{ 'active': $route.path === '/sanctions' }"
            @click="$emit('close')"
          >
            <i class="bi bi-exclamation-triangle"></i>
            <span>Санкции</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>

          <a 
            href="#" 
            class="menu-item logout"
            @click.prevent="handleLogout"
          >
            <i class="bi bi-box-arrow-right"></i>
            <span>Выйти</span>
            <i class="bi bi-chevron-right"></i>
          </a>
        </nav>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('access_token')
  emit('close')
  router.push('/login')
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-menu {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 24px 24px 0 0;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.btn-close-modal {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: none;
  border-radius: 10px;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close-modal:hover {
  background: #e9ecef;
  color: #1a1a1a;
}

/* Menu Navigation */
.menu-nav {
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin: 0 1rem 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 16px;
  text-decoration: none;
  color: #495057;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #667eea;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.menu-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.menu-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  font-weight: 600;
}

.menu-item.active::before {
  transform: scaleY(1);
}

.menu-item i:first-child {
  font-size: 24px;
  width: 24px;
  text-align: center;
}

.menu-item span {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.menu-item i:last-child {
  font-size: 16px;
  color: #adb5bd;
}

.menu-item.logout {
  background: #fff5f5;
  color: #dc3545;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #f8d7da;
}

.menu-item.logout:hover {
  background: #ffe5e5;
  border-color: #dc3545;
}

.menu-item.logout i {
  color: #dc3545;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-menu,
.modal-leave-to .modal-menu {
  transform: translateY(100%);
}

.modal-enter-active .modal-menu,
.modal-leave-active .modal-menu {
  transition: transform 0.3s ease;
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .modal-menu {
    max-height: 85vh;
  }

  .modal-header {
    padding: 1.25rem;
  }

  .modal-title {
    font-size: 18px;
  }

  .menu-item {
    padding: 0.875rem 1rem;
  }

  .menu-item i:first-child {
    font-size: 20px;
  }

  .menu-item span {
    font-size: 15px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
  }

  .modal-menu {
    border-radius: 24px;
    max-height: 90vh;
  }
}
</style>
