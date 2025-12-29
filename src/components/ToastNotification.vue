<template>
  <Transition name="toast">
    <div v-if="show" class="toast-notification" :class="type">
      <div class="toast-content">
        <div class="toast-icon">
          <i :class="iconClass"></i>
        </div>
        <div class="toast-message">
          {{ message }}
        </div>
      </div>
      <button class="toast-close" @click="close">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

let timeout = null

const iconClass = computed(() => {
  const icons = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-x-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return icons[props.type] || icons.success
})

const close = () => {
  emit('close')
  if (timeout) {
    clearTimeout(timeout)
  }
}

watch(() => props.show, (newVal) => {
  if (newVal && props.duration > 0) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  min-width: 320px;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  gap: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex: 1;
}

.toast-icon {
  font-size: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-message {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: #2c3e50;
}

.toast-close {
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 20px;
  flex-shrink: 0;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #495057;
}

/* Type-specific styles */
.toast-notification.success {
  border-left: 4px solid #28a745;
}

.toast-notification.success .toast-icon {
  color: #28a745;
}

.toast-notification.error {
  border-left: 4px solid #dc3545;
}

.toast-notification.error .toast-icon {
  color: #dc3545;
}

.toast-notification.warning {
  border-left: 4px solid #ffc107;
}

.toast-notification.warning .toast-icon {
  color: #ffc107;
}

.toast-notification.info {
  border-left: 4px solid #17a2b8;
}

.toast-notification.info .toast-icon {
  color: #17a2b8;
}

/* Animations */
.toast-enter-active {
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Mobile responsive */
@media (max-width: 576px) {
  .toast-notification {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
    max-width: none;
  }

  .toast-message {
    font-size: 14px;
  }

  .toast-icon {
    font-size: 20px;
  }
}
</style>
