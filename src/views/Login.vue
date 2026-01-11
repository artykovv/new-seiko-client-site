<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-card">
        <!-- Logo Section -->
        <div class="logo-section">
          <img src="/logo.svg" alt="Seiko Logo" class="logo">
        </div>

        <!-- Title -->
        <h1 class="login-title">Добро пожаловать</h1>
        <p class="login-subtitle">Войдите в свой аккаунт</p>

        <!-- Success Alert for Registration -->
        <div v-if="registrationSuccess" class="alert alert-success" role="alert">
          <i class="bi bi-check-circle me-2"></i>
          Регистрация успешна! Теперь вы можете войти.
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email Input -->
          <div class="form-group">
            <label for="email" class="form-label">
              <i class="bi bi-envelope me-2"></i>Email
            </label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              required
              placeholder="name@example.com"
              autocomplete="email"
            />
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label for="password" class="form-label">
              <i class="bi bi-lock me-2"></i>Пароль
            </label>
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                id="password"
                v-model="password"
                required
                placeholder="Введите пароль"
                autocomplete="current-password"
              />
              <button
                class="password-toggle"
                type="button"
                @click="togglePasswordVisibility"
                aria-label="Показать пароль"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="form-check-wrapper">
            <input
              type="checkbox"
              class="form-check-input"
              id="rememberMe"
              v-model="rememberMe"
            />
            <label class="form-check-label" for="rememberMe">
              Запомнить меня
            </label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary btn-login" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <span v-if="!loading"><i class="bi bi-box-arrow-in-right me-2"></i>Войти</span>
            <span v-else>Вход...</span>
          </button>
        </form>

        <!-- Footer Links -->
        <div class="login-footer">
          <a href="#" class="footer-link">Забыли пароль?</a>
          <span class="footer-separator">•</span>
          <router-link to="/register" class="footer-link">Регистрация</router-link>
          <span class="footer-separator">•</span>
          <a href="https://admins.seiko-global.com/" target="_blank" rel="noopener noreferrer" class="footer-link admin-link">
            <i class="bi bi-shield-lock me-1"></i>Войти как администратор
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { BACKEND_API_URL } from '../config'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const registrationSuccess = ref(false)

onMounted(() => {
  if (route.query.registered === 'true') {
    registrationSuccess.value = true
    // Clear query param after showing message
    setTimeout(() => {
      registrationSuccess.value = false
    }, 5000)
  }
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const formData = new URLSearchParams()
    formData.append('username', email.value)
    formData.append('password', password.value)
    formData.append('client_id', '')
    formData.append('client_secret', '')

    const response = await fetch(`${BACKEND_API_URL}/api/auth/jwt/login`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Invalid credentials')
    }

    const data = await response.json()
    
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token)
      router.push('/')
    } else {
      throw new Error('No access token received')
    }
  } catch (e) {
    console.error('Login error:', e)
    error.value = 'Ошибка входа. Пожалуйста, проверьте ваши данные.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  height: 80px;
  width: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 15px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 2rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 14px;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.875rem 1rem;
  font-size: 16px;
  transition: all 0.3s ease;
  width: 100%;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-control {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: transparent;
  border: none;
  padding: 0 1rem;
  color: #6c757d;
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #667eea;
}

.password-toggle i {
  font-size: 18px;
}

.form-check-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-check-input {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  cursor: pointer;
  border: 2px solid #e9ecef;
  border-radius: 6px;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.form-check-label {
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  user-select: none;
}

.btn-login {
  width: 100%;
  padding: 1rem;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.footer-separator {
  margin: 0 0.5rem;
  color: #dee2e6;
}

.alert {
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.alert-success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .login-card {
    padding: 1.5rem;
    border-radius: 20px;
  }

  .logo {
    height: 60px;
  }

  .login-title {
    font-size: 24px;
  }

  .login-subtitle {
    font-size: 14px;
  }

  .form-control {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Landscape mobile */
@media (max-width: 896px) and (orientation: landscape) {
  .login-wrapper {
    padding: 1rem 0;
  }

  .login-card {
    padding: 1.5rem;
  }

  .logo-section {
    margin-bottom: 1rem;
  }

  .logo {
    height: 50px;
  }

  .login-title {
    font-size: 22px;
    margin-bottom: 0.25rem;
  }

  .login-subtitle {
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }
}
</style>
