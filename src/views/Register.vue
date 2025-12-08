<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-card">
        <!-- Logo Section -->
        <div class="logo-section">
          <img src="/logo.svg" alt="Seiko Logo" class="logo">
        </div>

        <!-- Progress Steps -->
        <div class="progress-steps">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-item"
            :class="{ 
              'active': currentStep === index + 1, 
              'completed': currentStep > index + 1 
            }"
          >
            <div class="step-circle">
              <i v-if="currentStep > index + 1" class="bi bi-check-lg"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ step }}</span>
          </div>
        </div>

        <!-- Title -->
        <h1 class="register-title">{{ stepTitles[currentStep - 1] }}</h1>
        <p class="register-subtitle">{{ stepSubtitles[currentStep - 1] }}</p>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="handleNext" class="register-form" novalidate>
          <!-- Step 1: Personal Info -->
          <div v-show="currentStep === 1" class="form-step">
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="bi bi-envelope me-2"></i>Email
              </label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="formData.email"
                placeholder="name@example.com"
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <i class="bi bi-lock me-2"></i>Пароль
              </label>
              <div class="password-input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  id="password"
                  v-model="formData.password"
                  placeholder="Минимум 6 символов"
                  autocomplete="new-password"
                />
                <button
                  class="password-toggle"
                  type="button"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="name" class="form-label">
                <i class="bi bi-person me-2"></i>Имя
              </label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="formData.name"
                placeholder="Иван"
              />
            </div>

            <div class="form-group">
              <label for="lastname" class="form-label">
                <i class="bi bi-person me-2"></i>Фамилия
              </label>
              <input
                type="text"
                class="form-control"
                id="lastname"
                v-model="formData.lastname"
                placeholder="Иванов"
              />
            </div>

            <div class="form-group">
              <label for="patronymic" class="form-label">
                <i class="bi bi-person me-2"></i>Отчество
              </label>
              <input
                type="text"
                class="form-control"
                id="patronymic"
                v-model="formData.patronymic"
                placeholder="Иванович (необязательно)"
              />
            </div>
          </div>

          <!-- Step 2: Passport Info -->
          <div v-show="currentStep === 2" class="form-step">
            <div class="form-group">
              <label for="pin" class="form-label">
                <i class="bi bi-credit-card me-2"></i>ПИН
              </label>
              <input
                type="text"
                class="form-control"
                id="pin"
                v-model="formData.passport_info.pin"
                placeholder="1234567890123"
              />
            </div>

            <div class="form-group">
              <label for="passport_id" class="form-label">
                <i class="bi bi-card-text me-2"></i>Номер паспорта
              </label>
              <input
                type="text"
                class="form-control"
                id="passport_id"
                v-model="formData.passport_info.passport_id"
                placeholder="AN1234567"
              />
            </div>

            <div class="form-group">
              <label for="passport_issuer" class="form-label">
                <i class="bi bi-building me-2"></i>Кем выдан
              </label>
              <input
                type="text"
                class="form-control"
                id="passport_issuer"
                v-model="formData.passport_info.passport_issuer"
                placeholder="МВД КР"
              />
            </div>

            <div class="form-group">
              <label for="passport_issue_date" class="form-label">
                <i class="bi bi-calendar me-2"></i>Дата выдачи паспорта
              </label>
              <input
                type="date"
                class="form-control"
                id="passport_issue_date"
                v-model="formData.passport_info.passport_issue_date"
              />
            </div>

            <div class="form-group">
              <label for="date_birth" class="form-label">
                <i class="bi bi-calendar-heart me-2"></i>Дата рождения
              </label>
              <input
                type="date"
                class="form-control"
                id="date_birth"
                v-model="formData.passport_info.date_birth"
              />
            </div>

            <div class="form-group">
              <label for="phone_number" class="form-label">
                <i class="bi bi-phone me-2"></i>Номер телефона
              </label>
              <input
                type="tel"
                class="form-control"
                id="phone_number"
                v-model="formData.passport_info.phone_number"
                placeholder="+996 XXX XXX XXX"
              />
            </div>
          </div>

          <!-- Step 3: Additional Passport Info -->
          <div v-show="currentStep === 3" class="form-step">
            <div class="form-group">
              <label for="bank" class="form-label">
                <i class="bi bi-bank me-2"></i>Банк
              </label>
              <input
                type="text"
                class="form-control"
                id="bank"
                v-model="formData.passport_info.bank"
                placeholder="Название банка"
              />
            </div>

            <div class="form-check-group">
              <div class="form-check-item">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="ip_inn"
                  v-model="formData.passport_info.ip_inn"
                />
                <label class="form-check-label" for="ip_inn">
                  <i class="bi bi-briefcase me-2"></i>ИП/ИНН
                </label>
              </div>

              <div class="form-check-item">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="pensioner"
                  v-model="formData.passport_info.pensioner"
                />
                <label class="form-check-label" for="pensioner">
                  <i class="bi bi-person-badge me-2"></i>Пенсионер
                </label>
              </div>
            </div>
          </div>

          <!-- Step 4: Cabinet Info -->
          <div v-show="currentStep === 4" class="form-step">
            <div class="form-group">
              <label for="code" class="form-label">
                <i class="bi bi-key me-2"></i>Код кабинета
              </label>
              <div class="input-with-button">
                <input
                  type="text"
                  class="form-control"
                  id="code"
                  v-model="formData.cabinet.code"
                  placeholder="AB123"
                  readonly
                />
                <button
                  type="button"
                  class="btn-generate"
                  @click="generateCabinetCode"
                  title="Сгенерировать код"
                >
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
              </div>
              <small class="form-text">Автоматически сгенерированный код</small>
            </div>

            <div class="form-group">
              <label for="paket_id" class="form-label">
                <i class="bi bi-box me-2"></i>Пакет
              </label>
              <select
                class="form-select"
                id="paket_id"
                v-model.number="formData.cabinet.paket_id"
                @change="onPackageChange"
              >
                <option :value="null">Выберите пакет</option>
                <option v-for="paket in pakets" :key="paket.id" :value="paket.id">
                  {{ paket.name }} - ${{ paket.price }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="branch_id" class="form-label">
                <i class="bi bi-geo-alt me-2"></i>Филиал
              </label>
              <select
                class="form-select"
                id="branch_id"
                v-model.number="formData.cabinet.branch_id"
              >
                <option :value="null">Выберите филиал</option>
                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="sponsor_search" class="form-label">
                <i class="bi bi-person-plus me-2"></i>Спонсор
              </label>
              <div class="position-relative">
                <input
                  type="text"
                  class="form-control"
                  id="sponsor_search"
                  v-model="sponsorSearchQuery"
                  @input="handleSponsorSearch"
                  placeholder="Поиск спонсора по ФИО или номеру..."
                  autocomplete="off"
                />
                
                <div 
                  v-if="showSponsorDropdown && (sponsorSearchResults.length > 0 || sponsorSearchLoading)"
                  class="search-dropdown"
                >
                  <div v-if="sponsorSearchLoading" class="dropdown-item text-center py-2">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                      <span class="visually-hidden">Загрузка...</span>
                    </div>
                  </div>
                  <div 
                    v-else
                    v-for="cabinet in sponsorSearchResults" 
                    :key="cabinet.id"
                    class="dropdown-item sponsor-item"
                    @click="selectSponsor(cabinet)"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <div class="fw-semibold">{{ formatCabinetName(cabinet) }}</div>
                        <small class="text-muted">{{ cabinet.personal_number }}</small>
                      </div>
                      <i class="bi bi-chevron-right text-muted"></i>
                    </div>
                  </div>
                  <div v-if="sponsorSearchResults.length === 0 && sponsorSearchQuery.trim()" class="dropdown-item text-muted text-center py-2">
                    Спонсоры не найдены
                  </div>
                </div>
              </div>
              <small class="form-text">Необязательно</small>
            </div>
          </div>

          <!-- Step 5: Product Selection -->
          <div v-show="currentStep === 5" class="form-step">
            <div class="package-info-header">
              <div class="package-selected">
                <span class="text-muted">Выбранный пакет:</span>
                <span class="fw-bold">{{ selectedPackage?.name || '-' }} - ${{ selectedPackage?.price || 0 }}</span>
              </div>
              <div class="package-remaining">
                <span class="text-muted">Остаток:</span>
                <span class="fw-bold" :class="remainingAmount >= 0 ? 'text-success' : 'text-danger'">
                  ${{ remainingAmount.toFixed(2) }}
                </span>
              </div>
            </div>

            <div v-if="loadingProducts" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
              </div>
            </div>

            <div v-else class="products-list">
              <div 
                v-for="product in products" 
                :key="product.id"
                class="product-card"
                :class="{ 'selected': isProductSelected(product.id) }"
              >
                <div class="product-info">
                  <h6 class="product-name">{{ product.name }}</h6>
                  <p class="product-description">{{ product.description || product.sku || '-' }}</p>
                  <div class="product-price">${{ product.price }}</div>
                </div>
                <div class="product-actions">
                  <div v-if="isProductSelected(product.id)" class="quantity-controls">
                    <button 
                      class="quantity-btn minus"
                      type="button"
                      @click="decreaseQuantity(product.id)"
                      :disabled="getProductQuantity(product.id) <= 1"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <span class="quantity-value">{{ getProductQuantity(product.id) }}</span>
                    <button 
                      class="quantity-btn plus"
                      type="button"
                      @click="increaseQuantity(product.id)"
                      :disabled="!canAddProduct(product.id)"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <button 
                    v-else
                    class="add-product-btn"
                    type="button"
                    @click="toggleProduct(product.id)"
                    :disabled="!canAddProduct(product.id)"
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>
                  <button 
                    v-if="isProductSelected(product.id)"
                    class="remove-product-btn"
                    type="button"
                    @click="removeProductFromSelection(product.id)"
                    title="Удалить"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="order-summary">
              <div class="summary-row">
                <span class="summary-label">Выбрано товаров:</span>
                <span class="summary-value">{{ selectedProducts.reduce((sum, item) => sum + item.quantity, 0) }} шт.</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Сумма товаров:</span>
                <span class="summary-value">${{ selectedProductsTotal.toFixed(2) }}</span>
              </div>
              <div v-if="remainingAmount < 0" class="summary-row error-row">
                <span class="summary-label text-danger">Превышение лимита:</span>
                <span class="summary-value text-danger">${{ Math.abs(remainingAmount).toFixed(2) }}</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-label">Остаток по пакету:</span>
                <span class="summary-value" :class="remainingAmount >= 0 ? 'text-success' : 'text-danger'">
                  ${{ remainingAmount.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-navigation">
            <button
              v-if="currentStep > 1"
              type="button"
              class="btn btn-secondary"
              @click="previousStep"
            >
              <i class="bi bi-arrow-left me-2"></i>Назад
            </button>

            <button
              v-if="currentStep < 5"
              type="submit"
              class="btn btn-primary"
            >
              Далее<i class="bi bi-arrow-right ms-2"></i>
            </button>

            <button
              v-if="currentStep === 5"
              type="submit"
              class="btn btn-success"
              :disabled="loading || selectedProducts.length === 0 || remainingAmount < 0"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-circle me-2"></i>
              {{ loading ? 'Регистрация...' : 'Завершить регистрацию' }}
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="register-footer">
          <p>Уже есть аккаунт? <router-link to="/login" class="footer-link">Войти</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BACKEND_API_URL } from '../config'

const router = useRouter()

const steps = ['Личные данные', 'Паспорт', 'Доп. инфо', 'Кабинет', 'Товары']
const stepTitles = [
  'Личная информация',
  'Паспортные данные',
  'Дополнительная информация',
  'Настройка кабинета',
  'Выбор товаров'
]
const stepSubtitles = [
  'Введите ваши основные данные',
  'Заполните паспортную информацию',
  'Укажите банковские данные',
  'Настройте ваш кабинет',
  'Выберите товары на сумму пакета'
]

const currentStep = ref(1)
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

// Data for selects
const pakets = ref([])
const branches = ref([])
const products = ref([])
const loadingProducts = ref(false)

// Selected products for order
const selectedProducts = ref([])
const selectedPackage = ref(null)

// Sponsor search
const sponsorSearchQuery = ref('')
const sponsorSearchResults = ref([])
const sponsorSearchLoading = ref(false)
const showSponsorDropdown = ref(false)
const selectedSponsor = ref(null)
let sponsorSearchTimeout = null

const formData = ref({
  email: '',
  password: '',
  name: '',
  lastname: '',
  patronymic: '',
  passport_info: {
    pin: '',
    passport_id: '',
    passport_issuer: '',
    passport_issue_date: '',
    bank: '',
    ip_inn: false,
    pensioner: false,
    phone_number: '',
    date_birth: ''
  },
  cabinet: {
    code: '',
    paket_id: null,
    branch_id: null,
    sponsor_id: null
  },
  order: {
    items: [],
    status_id: 1,
    delivery_method_id: 1,
    shipping_address: '',
    notes: ''
  }
})

// Computed properties for product selection
const selectedProductsTotal = computed(() => {
  return selectedProducts.value.reduce((sum, item) => {
    const product = products.value.find(p => p.id === item.id)
    if (!product) return sum
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    return sum + (price || 0) * (item.quantity || 1)
  }, 0)
})

const remainingAmount = computed(() => {
  if (!selectedPackage.value) return 0
  const packagePrice = typeof selectedPackage.value.price === 'string' 
    ? parseFloat(selectedPackage.value.price) 
    : selectedPackage.value.price
  return packagePrice - selectedProductsTotal.value
})

const isProductSelected = (productId) => {
  return selectedProducts.value.some(item => item.id === productId)
}

const getProductQuantity = (productId) => {
  const item = selectedProducts.value.find(item => item.id === productId)
  return item ? item.quantity : 0
}

const canAddProduct = (productId) => {
  if (!selectedPackage.value) return false
  const product = products.value.find(p => p.id === productId)
  if (!product) return false
  
  const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  return (selectedProductsTotal.value + productPrice) <= (selectedPackage.value.price || 0)
}

const toggleProduct = (productId) => {
  if (!canAddProduct(productId)) return
  
  const index = selectedProducts.value.findIndex(item => item.id === productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push({ id: productId, quantity: 1 })
  }
}

const increaseQuantity = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (!product) return
  
  const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  
  if ((selectedProductsTotal.value + productPrice) <= (selectedPackage.value?.price || 0)) {
    const index = selectedProducts.value.findIndex(item => item.id === productId)
    if (index > -1) {
      selectedProducts.value[index].quantity++
    } else {
      selectedProducts.value.push({ id: productId, quantity: 1 })
    }
  }
}

const decreaseQuantity = (productId) => {
  const index = selectedProducts.value.findIndex(item => item.id === productId)
  if (index > -1) {
    if (selectedProducts.value[index].quantity > 1) {
      selectedProducts.value[index].quantity--
    } else {
      selectedProducts.value.splice(index, 1)
    }
  }
}

const removeProductFromSelection = (productId) => {
  const index = selectedProducts.value.findIndex(item => item.id === productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  }
}

// Generate cabinet code: 2 letters + 3 digits
const generateCabinetCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const code = 
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  formData.value.cabinet.code = code
}

// Fetch pakets
const fetchPakets = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/admin/pakets/`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      pakets.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching pakets:', err)
  }
}

// Fetch branches
const fetchBranches = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/admin/branches/`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      branches.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching branches:', err)
  }
}

// Fetch products
const fetchProducts = async () => {
  loadingProducts.value = true
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/admin/products/`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      products.value = data.map(product => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
      }))
    }
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    loadingProducts.value = false
  }
}

// Handle package change
const onPackageChange = () => {
  const paket = pakets.value.find(p => p.id === formData.value.cabinet.paket_id)
  selectedPackage.value = paket
  selectedProducts.value = [] // Reset selected products when package changes
}

// Sponsor search
const handleSponsorSearch = () => {
  clearTimeout(sponsorSearchTimeout)
  
  if (!sponsorSearchQuery.value.trim()) {
    sponsorSearchResults.value = []
    showSponsorDropdown.value = false
    return
  }
  
  sponsorSearchTimeout = setTimeout(async () => {
    await searchSponsors()
  }, 500)
}

const searchSponsors = async () => {
  if (!sponsorSearchQuery.value.trim()) {
    sponsorSearchResults.value = []
    return
  }
  
  sponsorSearchLoading.value = true
  try {
    const params = new URLSearchParams({
      search: sponsorSearchQuery.value.trim(),
      page: '1',
      page_size: '20'
    })
    
    const response = await fetch(`${BACKEND_API_URL}/api/admin/cabinets/?${params.toString()}`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      sponsorSearchResults.value = data.cabinets || []
      showSponsorDropdown.value = true
    }
  } catch (err) {
    console.error('Error searching sponsors:', err)
    sponsorSearchResults.value = []
  } finally {
    sponsorSearchLoading.value = false
  }
}

const selectSponsor = (cabinet) => {
  selectedSponsor.value = cabinet
  formData.value.cabinet.sponsor_id = cabinet.id
  sponsorSearchQuery.value = formatCabinetName(cabinet)
  showSponsorDropdown.value = false
}

const formatCabinetName = (cabinet) => {
  if (!cabinet || !cabinet.participant) return '-'
  const parts = []
  if (cabinet.participant.lastname) parts.push(cabinet.participant.lastname)
  if (cabinet.participant.name) parts.push(cabinet.participant.name)
  if (cabinet.participant.patronymic) parts.push(cabinet.participant.patronymic)
  const name = parts.length > 0 ? parts.join(' ') : cabinet.participant.email || '-'
  const personalNumber = cabinet.personal_number || '-'
  const sequenceNumber = cabinet.sequence_number || '-'
  return `${name} (${personalNumber}) - Кабинет №${sequenceNumber}`
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = ''
  }
}

const validateCurrentStep = () => {
  error.value = ''
  
  // Step 1: Personal Info
  if (currentStep.value === 1) {
    if (!formData.value.email || !formData.value.email.includes('@')) {
      error.value = 'Пожалуйста, введите корректный email'
      return false
    }
    if (!formData.value.password || formData.value.password.length < 6) {
      error.value = 'Пароль должен содержать минимум 6 символов'
      return false
    }
    if (!formData.value.name || !formData.value.name.trim()) {
      error.value = 'Пожалуйста, введите имя'
      return false
    }
    if (!formData.value.lastname || !formData.value.lastname.trim()) {
      error.value = 'Пожалуйста, введите фамилию'
      return false
    }
  }
  
  // Step 2: Passport Info
  if (currentStep.value === 2) {
    if (!formData.value.passport_info.pin || !formData.value.passport_info.pin.trim()) {
      error.value = 'Пожалуйста, введите ПИН'
      return false
    }
    if (!formData.value.passport_info.passport_id || !formData.value.passport_info.passport_id.trim()) {
      error.value = 'Пожалуйста, введите номер паспорта'
      return false
    }
    if (!formData.value.passport_info.passport_issuer || !formData.value.passport_info.passport_issuer.trim()) {
      error.value = 'Пожалуйста, укажите кем выдан паспорт'
      return false
    }
    if (!formData.value.passport_info.passport_issue_date) {
      error.value = 'Пожалуйста, укажите дату выдачи паспорта'
      return false
    }
    if (!formData.value.passport_info.date_birth) {
      error.value = 'Пожалуйста, укажите дату рождения'
      return false
    }
    if (!formData.value.passport_info.phone_number || !formData.value.passport_info.phone_number.trim()) {
      error.value = 'Пожалуйста, введите номер телефона'
      return false
    }
  }
  
  // Step 3: Additional Info
  if (currentStep.value === 3) {
    if (!formData.value.passport_info.bank || !formData.value.passport_info.bank.trim()) {
      error.value = 'Пожалуйста, введите название банка'
      return false
    }
  }
  
  // Step 4: Cabinet Info
  if (currentStep.value === 4) {
    if (!formData.value.cabinet.code || !formData.value.cabinet.code.trim()) {
      error.value = 'Пожалуйста, сгенерируйте код кабинета'
      return false
    }
    if (!formData.value.cabinet.paket_id) {
      error.value = 'Пожалуйста, выберите пакет'
      return false
    }
    if (!formData.value.cabinet.branch_id) {
      error.value = 'Пожалуйста, выберите филиал'
      return false
    }
  }
  
  // Step 5: Product Selection
  if (currentStep.value === 5) {
    if (selectedProducts.value.length === 0) {
      error.value = 'Пожалуйста, выберите хотя бы один товар'
      return false
    }
    if (remainingAmount.value < 0) {
      error.value = 'Сумма товаров превышает стоимость пакета'
      return false
    }
  }
  
  return true
}

const handleNext = async () => {
  if (!validateCurrentStep()) {
    return
  }
  
  if (currentStep.value < 5) {
    currentStep.value++
    error.value = ''
    
    // Load products when entering step 5
    if (currentStep.value === 5 && products.value.length === 0) {
      await fetchProducts()
    }
  } else {
    await handleSubmit()
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Build order items from selected products
    const orderItems = selectedProducts.value.map(item => {
      const product = products.value.find(p => p.id === item.id)
      return {
        product_id: item.id,
        quantity: item.quantity,
        unit_price: product ? product.price : 0
      }
    })

    // Set default shipping address if empty
    if (!formData.value.order.shipping_address) {
      formData.value.order.shipping_address = 'Адрес не указан'
    }

    const payload = {
      ...formData.value,
      order: {
        ...formData.value.order,
        items: orderItems
      }
    }

    const response = await fetch(`${BACKEND_API_URL}/api/client/participants/register`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.status === 201) {
      // Success - redirect to login
      router.push({
        path: '/login',
        query: { registered: 'true' }
      })
    } else {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Ошибка регистрации')
    }
  } catch (e) {
    console.error('Registration error:', e)
    error.value = e.message || 'Ошибка регистрации. Пожалуйста, проверьте данные.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPakets()
  fetchBranches()
  generateCabinetCode()
})
</script>

<style scoped>
/* All previous styles remain... */
.register-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.register-container {
  width: 100%;
  max-width: 600px;
}

.register-card {
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
  margin-bottom: 1.5rem;
}

.logo {
  height: 60px;
  width: auto;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e9ecef;
  z-index: 0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.step-item.active .step-circle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.step-item.completed .step-circle {
  background: #28a745;
  color: white;
}

.step-label {
  font-size: 11px;
  color: #6c757d;
  text-align: center;
  font-weight: 500;
}

.step-item.active .step-label {
  color: #667eea;
  font-weight: 600;
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 0.5rem;
}

.register-subtitle {
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 1.5rem;
}

.register-form {
  margin-bottom: 1.5rem;
}

.form-step {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 13px;
}

.form-control,
textarea.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 15px;
  transition: all 0.3s ease;
  width: 100%;
}

.form-control:focus,
textarea.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  outline: none;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
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
}

.password-toggle:hover {
  color: #667eea;
}

.form-check-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.form-check-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.form-check-item:hover {
  background: #e9ecef;
}

.form-check-input {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  cursor: pointer;
  border: 2px solid #dee2e6;
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
  display: flex;
  align-items: center;
  font-weight: 500;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button .form-control {
  flex: 1;
}

.btn-generate {
  background: #667eea;
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
}

.btn-generate:hover {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-generate i {
  font-size: 18px;
}

.form-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 12px;
  color: #6c757d;
}

.position-relative {
  position: relative;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.sponsor-item:hover {
  background-color: #f8f9fa;
}

.sponsor-item .fw-semibold {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.sponsor-item small {
  font-size: 0.85rem;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.text-center {
  text-center: center;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.text-muted {
  color: #6c757d;
}

.fw-semibold {
  font-weight: 600;
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

/* Product Selection Styles */
.package-info-header {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.package-selected,
.package-remaining {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.package-selected .text-muted,
.package-remaining .text-muted {
  font-size: 12px;
}

.package-selected .fw-bold,
.package-remaining .fw-bold {
  font-size: 16px;
}

.products-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.product-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.product-card.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.product-description {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border-radius: 8px;
  padding: 0.25rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #764ba2;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.add-product-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #667eea;
  background: transparent;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.add-product-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.add-product-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-product-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-product-btn:hover {
  background: #c82333;
}

.order-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 14px;
  color: #495057;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
}

.total-row {
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 2px solid #dee2e6;
}

.total-row .summary-label,
.total-row .summary-value {
  font-size: 16px;
  font-weight: 700;
}

.error-row {
  background: #f8d7da;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 0.5rem 0;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

/* Navigation Buttons */
.form-navigation {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.form-navigation .btn {
  flex: 1;
  padding: 0.875rem;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.4);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.register-footer p {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.alert {
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 0.75rem 1rem;
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .register-wrapper {
    padding: 1rem;
  }

  .register-card {
    padding: 1.5rem;
    border-radius: 20px;
  }

  .logo {
    height: 50px;
  }

  .progress-steps {
    margin-bottom: 1.5rem;
  }

  .step-circle {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .step-label {
    font-size: 9px;
  }

  .register-title {
    font-size: 20px;
  }

  .register-subtitle {
    font-size: 13px;
  }

  .form-navigation {
    flex-direction: column-reverse;
  }

  .package-info-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .product-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
