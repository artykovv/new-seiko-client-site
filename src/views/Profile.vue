<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="profile-main">
        <div class="profile-header">
          <h1 class="page-title">Профиль</h1>
          <p class="page-subtitle">Управление личными данными</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p>Загрузка профиля...</p>
        </div>

        <!-- Profile Form -->
        <div v-else class="profile-content">
          <div class="profile-card">
            <div class="card-header">
              <h2 class="card-title">Личная информация</h2>
              <p class="card-subtitle">Обновите свои данные</p>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="alert alert-success">
              <i class="bi bi-check-circle"></i>
              {{ successMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="alert alert-error">
              <i class="bi bi-exclamation-circle"></i>
              {{ errorMessage }}
            </div>

            <form @submit.prevent="updateProfile" class="profile-form">
              <!-- Name Fields -->
              <div class="form-section">
                <h3 class="section-title">ФИО</h3>
                <p class="section-hint">Данные ФИО нельзя изменить</p>
                
                <div class="form-group">
                  <label class="form-label">Фамилия</label>
                  <input 
                    type="text" 
                    v-model="formData.lastname"
                    class="form-input readonly-input"
                    placeholder="Введите фамилию"
                    readonly
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Имя</label>
                  <input 
                    type="text" 
                    v-model="formData.name"
                    class="form-input readonly-input"
                    placeholder="Введите имя"
                    readonly
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Отчество</label>
                  <input 
                    type="text" 
                    v-model="formData.patronymic"
                    class="form-input readonly-input"
                    placeholder="Введите отчество"
                    readonly
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="form-section">
                <h3 class="section-title">Email</h3>
                
                <div class="form-group">
                  <label class="form-label">Электронная почта</label>
                  <input 
                    type="email" 
                    v-model="formData.email"
                    class="form-input"
                    placeholder="example@mail.com"
                    required
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="form-section">
                <h3 class="section-title">Изменить пароль</h3>
                <p class="section-hint">Оставьте поле пустым, если не хотите менять пароль</p>
                
                <div class="form-group">
                  <label class="form-label">Новый пароль</label>
                  <div class="password-input-wrapper">
                    <input 
                      :type="showPassword ? 'text' : 'password'"
                      v-model="formData.password"
                      class="form-input"
                      placeholder="Введите новый пароль"
                      minlength="6"
                    />
                    <button 
                      type="button"
                      @click="showPassword = !showPassword"
                      class="btn-toggle-password"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <small class="form-hint">Минимум 6 символов</small>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn-submit"
                  :disabled="saving"
                >
                  <span v-if="!saving">
                    <i class="bi bi-check-circle"></i>
                    Сохранить изменения
                  </span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Сохранение...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'
import { BACKEND_API_URL } from '../config'

const showMenu = ref(false)
const loading = ref(false)
const saving = ref(false)
const showPassword = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const userData = ref({
  id: '',
  email: '',
  name: '',
  lastname: '',
  patronymic: '',
  is_active: false,
  created_at: ''
})

const formData = ref({
  name: '',
  lastname: '',
  patronymic: '',
  email: '',
  password: ''
})

const fetchProfile = async () => {
  loading.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      errorMessage.value = 'Токен авторизации не найден'
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/participants/me`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      userData.value = data
      
      // Fill form with current data
      formData.value = {
        name: data.name || '',
        lastname: data.lastname || '',
        patronymic: data.patronymic || '',
        email: data.email || '',
        password: ''
      }
    } else {
      errorMessage.value = 'Ошибка загрузки профиля'
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    errorMessage.value = 'Ошибка загрузки данных'
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      errorMessage.value = 'Токен авторизации не найден'
      return
    }

    // Prepare data - only send password if it's filled
    // Note: name fields are readonly and won't be updated
    const updateData = {
      email: formData.value.email
    }

    if (formData.value.password && formData.value.password.trim()) {
      updateData.password = formData.value.password
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/participants/me`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      }
    )

    if (response.ok) {
      successMessage.value = 'Профиль успешно обновлен!'
      formData.value.password = '' // Clear password field
      
      // Refresh profile data
      await fetchProfile()
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      const error = await response.json()
      errorMessage.value = error.detail || 'Ошибка при обновлении профиля'
    }
  } catch (err) {
    console.error('Error updating profile:', err)
    errorMessage.value = 'Ошибка при сохранении данных'
  } finally {
    saving.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
}

.profile-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.loading-state p {
  margin-top: 1rem;
  color: #6c757d;
  font-size: 16px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Profile Content */
.profile-content {
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

.profile-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  margin-bottom: 2rem;
  text-align: center;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  font-size: 14px;
  color: #6c757d;
}

/* Alerts */
.alert {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 14px;
  font-weight: 500;
}

.alert i {
  font-size: 20px;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Form */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.section-hint {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 15px;
  color: #495057;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input.readonly-input {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
  border-color: #dee2e6;
}

.form-input.readonly-input:focus {
  border-color: #dee2e6;
  box-shadow: none;
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 12px;
  color: #6c757d;
}

/* Password Input */
.password-input-wrapper {
  position: relative;
}

.btn-toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 18px;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.btn-toggle-password:hover {
  color: #667eea;
}

/* Info Section */
.info-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
  border: none;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.info-value.active {
  color: #28a745;
}

/* Form Actions */
.form-actions {
  padding-top: 1rem;
}

.btn-submit {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .profile-main {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 16px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .profile-main {
    padding: 3rem 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .profile-main {
    padding: 3rem;
  }
}
</style>
