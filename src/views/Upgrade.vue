<template>
  <div class="upgrade-wrapper">
    <div class="upgrade-container">
      <!-- Header -->
      <div class="upgrade-header">
        <button class="back-btn" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <h1 class="upgrade-title">Upgrade Package</h1>
      </div>

      <!-- Progress Steps -->
      <div class="progress-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-item"
          :class="{ 'active': currentStep === index + 1, 'completed': currentStep > index + 1 }"
        >
          <div class="step-circle">
            <i v-if="currentStep > index + 1" class="bi bi-check"></i>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="step-label">{{ stepTitles[index] }}</span>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleNext" class="upgrade-form">
        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-circle me-2"></i>{{ error }}
        </div>

        <!-- Step 1: Select New Package -->
        <div v-show="currentStep === 1" class="form-step">
          <h2 class="step-title">{{ stepTitles[0] }}</h2>
          <p class="step-subtitle">{{ stepSubtitles[0] }}</p>

          <div class="current-package-info">
            <h3>Текущий пакет</h3>
            <div class="package-card current">
              <i class="bi bi-box-seam"></i>
              <span>{{ currentPackage?.name }}</span>
              <span class="price">${{ currentPackage?.price }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-box me-2"></i>Выберите новый пакет
            </label>
            <div class="pakets-grid">
              <div 
                v-for="paket in availablePakets" 
                :key="paket.id"
                class="paket-card"
                :class="{ 'selected': formData.new_paket_id === paket.id }"
                @click="selectPaket(paket.id)"
              >
                <div class="paket-header">
                  <h3>{{ paket.name }}</h3>
                  <div class="paket-price">${{ paket.price }}</div>
                </div>
                <p class="paket-description">{{ paket.description }}</p>
                <i class="bi bi-check-circle-fill check-icon"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Select Products -->
        <div v-show="currentStep === 2" class="form-step">
          <h2 class="step-title">{{ stepTitles[1] }}</h2>
          <p class="step-subtitle">{{ stepSubtitles[1] }}</p>

          <div class="budget-info">
            <div class="budget-label">Минимальная сумма для выбора товаров:</div>
            <div class="budget-amount">${{ availableBudget.toFixed(2) }}</div>
            <div class="budget-used">Выбрано: ${{ selectedProductsTotal.toFixed(2) }}</div>
            <div class="budget-status" :class="{ 'under-budget': selectedProductsTotal < availableBudget, 'ok-budget': selectedProductsTotal >= availableBudget }">
              <i class="bi" :class="selectedProductsTotal >= availableBudget ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'"></i>
              <span v-if="selectedProductsTotal < availableBudget">
                Нужно выбрать еще на ${{ (availableBudget - selectedProductsTotal).toFixed(2) }}
              </span>
              <span v-else>
                Минимум выполнен
              </span>
            </div>
          </div>

          <div class="products-list">
            <div v-for="product in products" :key="product.id" class="product-item">
              <div class="product-image">
                <img 
                  v-if="product.images && product.images.length > 0" 
                  :src="product.images[0].src" 
                  :alt="product.name"
                />
                <div v-else class="no-image">
                  <i class="bi bi-image"></i>
                </div>
              </div>
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <div class="product-price">${{ getProductPrice(product) }}</div>
              </div>
              <div class="product-controls">
                <button 
                  type="button" 
                  class="btn-quantity" 
                  @click="decrementProduct(product.id)"
                  :disabled="getProductQuantity(product.id) === 0"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <span class="quantity">{{ getProductQuantity(product.id) }}</span>
                <button 
                  type="button" 
                  class="btn-quantity" 
                  @click="incrementProduct(product.id)"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>Итого:</span>
              <span class="total-amount">${{ selectedProductsTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Step 3: Payment Method -->
        <div v-show="currentStep === 3" class="form-step">
          <h2 class="step-title">{{ stepTitles[2] }}</h2>
          <p class="step-subtitle">{{ stepSubtitles[2] }}</p>

          <!-- Payment Method Selection -->
          <div v-if="!showPhoneVerification && !showCodeVerification && !showSummary" class="payment-method-section">
            <label class="form-label">
              <i class="bi bi-credit-card me-2"></i>Способ оплаты
            </label>
            <div class="payment-methods-list">
              <div 
                v-for="method in paymentMethods" 
                :key="method.id"
                class="payment-method-item"
                :class="{ 'selected': formData.order.payment_method_id === method.id }"
                @click="selectPaymentMethod(method.id)"
              >
                <input
                  type="radio"
                  :id="`payment_${method.id}`"
                  :value="method.id"
                  v-model.number="formData.order.payment_method_id"
                  class="payment-radio"
                />
                <label :for="`payment_${method.id}`" class="payment-label">
                  <i class="bi bi-circle payment-icon-unchecked"></i>
                  <i class="bi bi-check-circle-fill payment-icon-checked"></i>
                  <span class="payment-name">{{ method.name }}</span>
                  <span v-if="method.description" class="payment-description">{{ method.description }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Phone Verification for Mbank -->
          <div v-if="showPhoneVerification && !showCodeVerification && !showSummary" class="verification-section">
            <div class="selected-payment-info">
              <span class="info-label">Способ оплаты:</span>
              <span class="info-value">{{ getSelectedPaymentMethodName() }}</span>
              <button 
                type="button" 
                class="btn-change"
                @click="changePaymentMethod"
                title="Изменить способ оплаты"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </div>
            
            <h5 class="verification-title">Введите номер телефона</h5>
            <p class="verification-subtitle">Мы отправим на номер СМС c кодом подтверждения</p>
            <div class="form-group">
              <input
                type="tel"
                class="form-control"
                v-model="verificationPhone"
                placeholder="+996 Номер телефона"
                inputmode="numeric"
              />
            </div>
          </div>

          <!-- Code Verification for Mbank -->
          <div v-if="showCodeVerification && !showSummary" class="verification-section">
            <div class="selected-payment-info">
              <span class="info-label">Способ оплаты:</span>
              <span class="info-value">{{ getSelectedPaymentMethodName() }}</span>
              <button 
                type="button" 
                class="btn-change"
                @click="changePaymentMethod"
                title="Изменить способ оплаты"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </div>

            <div class="selected-payment-info">
              <span class="info-label">Номер телефона:</span>
              <span class="info-value">{{ verificationPhone }}</span>
              <button 
                type="button" 
                class="btn-change"
                @click="changePhoneNumber"
                title="Изменить номер телефона"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </div>

            <h5 class="verification-title">Введите код</h5>
            <p class="verification-subtitle">
              Мы отправили код подтверждения на номер {{ verificationPhone }}
            </p>
            <div class="form-group">
              <input
                type="text"
                class="form-control code-input"
                v-model="verificationCode"
                placeholder="____"
                maxlength="4"
                inputmode="numeric"
              />
            </div>
            <p class="timer-text" v-if="verificationTimer > 0">
              Отправить новый код можно будет через {{ formatTimer(verificationTimer) }}
            </p>
            <button 
              v-else
              type="button"
              class="btn btn-link"
              @click="resendCode"
            >
              Отправить новый код
            </button>
          </div>

          <!-- Summary View -->
          <div v-if="showSummary" class="summary-view">
            <h5 class="summary-title">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              Проверьте данные апгрейда
            </h5>

            <!-- Package Upgrade Info -->
            <div class="summary-section">
              <h6 class="summary-section-title">
                <i class="bi bi-arrow-up-circle me-2"></i>Апгрейд пакета
              </h6>
              <div class="summary-item">
                <span class="summary-label">Текущий пакет:</span>
                <span class="summary-value">{{ currentPackage?.name }} (${{ currentPackage?.price }})</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Новый пакет:</span>
                <span class="summary-value">{{ selectedNewPackage?.name }} (${{ selectedNewPackage?.price }})</span>
              </div>
            </div>

            <!-- Selected Products -->
            <div class="summary-section">
              <h6 class="summary-section-title">
                <i class="bi bi-cart me-2"></i>Выбранные товары
              </h6>
              <div v-for="item in selectedProducts" :key="item.id" class="summary-product">
                <div class="product-summary-info">
                  <span class="product-summary-name">{{ getProductById(item.id)?.name }}</span>
                  <span class="product-summary-qty">× {{ item.quantity }}</span>
                </div>
                <span class="product-summary-price">${{ (getProductPrice(getProductById(item.id)) * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="summary-section">
              <h6 class="summary-section-title">
                <i class="bi bi-credit-card me-2"></i>Оплата
              </h6>
              <div class="summary-item">
                <span class="summary-label">Способ оплаты:</span>
                <span class="summary-value">{{ getSelectedPaymentMethodName() }}</span>
              </div>
              <div class="summary-item total-item">
                <span class="summary-label">Итого (USD):</span>
                <span class="summary-value total-value">${{ selectedProductsTotal.toFixed(2) }}</span>
              </div>
              <div class="summary-item total-item">
                <span class="summary-label">Итого (сом):</span>
                <span class="summary-value total-value">{{ (selectedProductsTotal * 85).toFixed(2) }} сом</span>
              </div>
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
            v-if="currentStep < 3"
            type="submit"
            class="btn btn-primary"
          >
            Далее<i class="bi bi-arrow-right ms-2"></i>
          </button>

          <!-- Step 3: Payment Method Selection - Show Далее -->
          <button
            v-if="currentStep === 3 && !showPhoneVerification && !showCodeVerification && !showSummary"
            type="button"
            class="btn btn-primary"
            @click="proceedToNextStep"
            :disabled="!formData.order.payment_method_id"
          >
            Далее<i class="bi bi-arrow-right ms-2"></i>
          </button>

          <!-- Step 3: Phone Verification - Send Code -->
          <button
            v-if="currentStep === 3 && showPhoneVerification && !showCodeVerification && !showSummary"
            type="button"
            class="btn btn-primary"
            @click="sendVerificationCode"
            :disabled="!verificationPhone || verificationPhone.length < 10"
          >
            Далее<i class="bi bi-arrow-right ms-2"></i>
          </button>

          <!-- Step 3: Code Verification - Show Summary -->
          <button
            v-if="currentStep === 3 && showCodeVerification && !showSummary"
            type="button"
            class="btn btn-primary"
            @click="proceedToSummary"
            :disabled="verificationCode.length !== 4"
          >
            Далее<i class="bi bi-arrow-right ms-2"></i>
          </button>

          <!-- Step 3: Summary View - Complete Upgrade -->
          <button
            v-if="currentStep === 3 && showSummary"
            type="submit"
            class="btn btn-success"
            :disabled="loading"
            @click.prevent="handleSubmit"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-check-circle me-2"></i>
            {{ loading ? 'Обработка...' : 'Завершить апгрейд' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BACKEND_API_URL } from '../config'

const router = useRouter()

// Steps
const steps = [1, 2, 3]
const stepTitles = ['Выбор пакета', 'Выбор товаров', 'Оплата']
const stepSubtitles = [
  'Выберите новый пакет для апгрейда',
  'Выберите товары для заказа',
  'Выберите способ оплаты'
]
const currentStep = ref(1)

// Loading and error states
const loading = ref(false)
const error = ref('')

// Current cabinet and package data
const cabinetData = ref(null)
const currentPackage = ref(null)

// Pakets
const pakets = ref([])
const availablePakets = computed(() => {
  if (!currentPackage.value) return []
  return pakets.value.filter(p => p.price > currentPackage.value.price)
})

// Products
const products = ref([])
const selectedProducts = ref([])

// Payment methods
const paymentMethods = ref([])

// Payment verification (for Mbank)
const verificationPhone = ref('')
const verificationCode = ref('')
const showPhoneVerification = ref(false)
const showCodeVerification = ref(false)
const verificationTimer = ref(0)
let verificationInterval = null

// Summary view
const showSummary = ref(false)

const formData = ref({
  cabinet_id: '',
  old_paket_id: null,
  new_paket_id: null,
  order: {
    items: [],
    payment_method_id: null,
    shipping_address: '',
    notes: ''
  }
})

// Computed
const selectedProductsTotal = computed(() => {
  return selectedProducts.value.reduce((total, item) => {
    const product = products.value.find(p => p.id === item.id)
    if (product) {
      return total + (getProductPrice(product) * item.quantity)
    }
    return total
  }, 0)
})

const selectedNewPackage = computed(() => {
  return pakets.value.find(p => p.id === formData.value.new_paket_id)
})

const availableBudget = computed(() => {
  if (!currentPackage.value || !selectedNewPackage.value) return 0
  return selectedNewPackage.value.price - currentPackage.value.price
})

// Functions
const goBack = () => {
  router.push('/')
}

const selectPaket = (paketId) => {
  formData.value.new_paket_id = paketId
}

const getProductPrice = (product) => {
  if (!product) return 0
  const paket = pakets.value.find(p => p.id === formData.value.new_paket_id)
  if (!paket) return 0
  
  const productPrice = product.paket_prices?.find(pp => pp.paket_id === paket.id)
  return productPrice ? parseFloat(productPrice.price) : 0
}

const getProductQuantity = (productId) => {
  const item = selectedProducts.value.find(p => p.id === productId)
  return item ? item.quantity : 0
}

const incrementProduct = (productId) => {
  const existingItem = selectedProducts.value.find(p => p.id === productId)
  if (existingItem) {
    existingItem.quantity++
  } else {
    selectedProducts.value.push({ id: productId, quantity: 1 })
  }
}

const decrementProduct = (productId) => {
  const existingItem = selectedProducts.value.find(p => p.id === productId)
  if (existingItem && existingItem.quantity > 0) {
    existingItem.quantity--
    if (existingItem.quantity === 0) {
      selectedProducts.value = selectedProducts.value.filter(p => p.id !== productId)
    }
  }
}

const getProductById = (productId) => {
  return products.value.find(p => p.id === productId)
}

// Payment methods
const selectPaymentMethod = (methodId) => {
  formData.value.order.payment_method_id = methodId
  const selectedMethod = paymentMethods.value.find(m => m.id === methodId)
  
  if (selectedMethod && selectedMethod.name === 'Мбанк') {
    showPhoneVerification.value = true
    verificationPhone.value = '+996'
  } else {
    showPhoneVerification.value = false
    showCodeVerification.value = false
  }
}

const getSelectedPaymentMethodName = () => {
  const method = paymentMethods.value.find(m => m.id === formData.value.order.payment_method_id)
  return method ? method.name : ''
}

const changePaymentMethod = () => {
  showPhoneVerification.value = false
  showCodeVerification.value = false
  verificationPhone.value = ''
  verificationCode.value = ''
  if (verificationInterval) {
    clearInterval(verificationInterval)
  }
  verificationTimer.value = 0
}

const changePhoneNumber = () => {
  showCodeVerification.value = false
  showPhoneVerification.value = true
  verificationCode.value = ''
  if (verificationInterval) {
    clearInterval(verificationInterval)
  }
  verificationTimer.value = 0
}

const proceedToNextStep = () => {
  const selectedMethod = paymentMethods.value.find(m => m.id === formData.value.order.payment_method_id)
  
  if (selectedMethod && selectedMethod.name === 'Наличные') {
    showSummary.value = true
  }
}

const proceedToSummary = () => {
  showSummary.value = true
}

const sendVerificationCode = () => {
  console.log('Sending verification code to:', verificationPhone.value)
  showCodeVerification.value = true
  showPhoneVerification.value = false
  startVerificationTimer()
}

const resendCode = () => {
  console.log('Resending code')
  verificationTimer.value = 0
  startVerificationTimer()
}

const startVerificationTimer = () => {
  verificationTimer.value = 31
  verificationInterval = setInterval(() => {
    verificationTimer.value--
    if (verificationTimer.value <= 0) {
      clearInterval(verificationInterval)
    }
  }, 1000)
}

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Navigation
const previousStep = () => {
  if (currentStep.value === 3 && showSummary.value) {
    showSummary.value = false
    
    const selectedMethod = paymentMethods.value.find(m => m.id === formData.value.order.payment_method_id)
    if (selectedMethod && selectedMethod.name === 'Мбанк') {
      showPhoneVerification.value = false
      showCodeVerification.value = false
      verificationPhone.value = ''
      verificationCode.value = ''
      if (verificationInterval) {
        clearInterval(verificationInterval)
      }
      verificationTimer.value = 0
    }
    return
  }
  
  if (currentStep.value === 3 && showCodeVerification.value) {
    showCodeVerification.value = false
    showPhoneVerification.value = true
    verificationCode.value = ''
    if (verificationInterval) {
      clearInterval(verificationInterval)
    }
    verificationTimer.value = 0
    return
  }
  
  if (currentStep.value === 3 && showPhoneVerification.value) {
    showPhoneVerification.value = false
    verificationPhone.value = ''
    return
  }
  
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = ''
  }
}

const validateCurrentStep = () => {
  error.value = ''
  
  if (currentStep.value === 1) {
    if (!formData.value.new_paket_id) {
      error.value = 'Пожалуйста, выберите новый пакет'
      return false
    }
  }
  
  if (currentStep.value === 2) {
    if (selectedProducts.value.length === 0) {
      error.value = 'Пожалуйста, выберите хотя бы один товар'
      return false
    }
    
    if (selectedProductsTotal.value < availableBudget.value) {
      error.value = `Необходимо выбрать товаров минимум на $${availableBudget.value.toFixed(2)}`
      return false
    }
  }
  
  if (currentStep.value === 3) {
    if (!formData.value.order.payment_method_id) {
      error.value = 'Пожалуйста, выберите способ оплаты'
      return false
    }
  }
  
  return true
}

const handleNext = () => {
  if (!validateCurrentStep()) {
    return
  }
  
  if (currentStep.value === 1) {
    fetchProducts()
  }
  
  if (currentStep.value === 2) {
    fetchPaymentMethods()
  }
  
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const handleSubmit = async () => {
  if (!validateCurrentStep()) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('Не авторизован')
    }
    
    // Prepare order items
    const orderItems = selectedProducts.value.map(item => {
      const product = getProductById(item.id)
      return {
        product_id: item.id,
        quantity: item.quantity,
        unit_price: getProductPrice(product)
      }
    })
    
    const payload = {
      cabinet_id: formData.value.cabinet_id,
      old_paket_id: formData.value.old_paket_id,
      new_paket_id: formData.value.new_paket_id,
      order: {
        items: orderItems,
        payment_method_id: formData.value.order.payment_method_id,
        shipping_address: formData.value.order.shipping_address || '',
        notes: formData.value.order.notes || ''
      }
    }
    
    const response = await fetch(`${BACKEND_API_URL}/api/orders/upgrade-package`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (response.status === 201 || response.ok) {
      router.push({
        path: '/',
        query: { upgraded: 'true' }
      })
    } else {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Ошибка апгрейда')
    }
  } catch (e) {
    console.error('Upgrade error:', e)
    error.value = e.message || 'Ошибка апгрейда. Пожалуйста, попробуйте снова.'
  } finally {
    loading.value = false
  }
}

// API calls
const fetchCabinetData = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return
    
    const cabinetsResponse = await fetch(
      `${BACKEND_API_URL}/api/cabinets/?page=1&page_size=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )
    
    if (cabinetsResponse.ok) {
      const cabinetsData = await cabinetsResponse.json()
      if (cabinetsData.cabinets && cabinetsData.cabinets.length > 0) {
        const cabinet = cabinetsData.cabinets[0]
        cabinetData.value = cabinet
        formData.value.cabinet_id = cabinet.id
        formData.value.old_paket_id = cabinet.paket_id
        
        // Fetch current package details
        const paketResponse = await fetch(
          `${BACKEND_API_URL}/api/pakets/${cabinet.paket_id}`,
          {
            headers: {
              'accept': 'application/json'
            }
          }
        )
        
        if (paketResponse.ok) {
          currentPackage.value = await paketResponse.json()
        }
      }
    }
  } catch (err) {
    console.error('Error fetching cabinet data:', err)
  }
}

const fetchPakets = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/pakets/`, {
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

const fetchProducts = async () => {
  try {
    if (!formData.value.new_paket_id) {
      console.error('No paket selected')
      return
    }
    
    const response = await fetch(`${BACKEND_API_URL}/api/products/?paket_id=${formData.value.new_paket_id}`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      products.value = await response.json()
      // Show all products, even those without paket_prices
      // Price will be 0 for products without paket_prices
    }
  } catch (err) {
    console.error('Error fetching products:', err)
  }
}

const fetchPaymentMethods = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/orders/payment-methods`, {
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (response.ok) {
      paymentMethods.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching payment methods:', err)
  }
}

onMounted(async () => {
  await fetchCabinetData()
  await fetchPakets()
})
</script>

<style scoped>
/* Import similar styles from Register.vue - keeping it concise */
.upgrade-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.upgrade-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.upgrade-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: #f8f9fa;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e9ecef;
  transform: translateX(-4px);
}

.upgrade-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

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

.current-package-info {
  margin-bottom: 2rem;
}

.current-package-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 1rem;
}

.package-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.package-card.current {
  background: #fff3cd;
  border-color: #ffc107;
}

.package-card i {
  font-size: 24px;
  color: #667eea;
}

.package-card .price {
  margin-left: auto;
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.pakets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.paket-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.paket-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.paket-card.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.paket-header {
  margin-bottom: 0.75rem;
}

.paket-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.paket-price {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.paket-description {
  font-size: 13px;
  color: #6c757d;
  margin: 0;
}

.check-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 24px;
  color: #667eea;
  display: none;
}

.paket-card.selected .check-icon {
  display: block;
}

.budget-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.budget-label {
  grid-column: 1 / -1;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
}

.budget-amount {
  font-size: 32px;
  font-weight: 700;
  grid-column: 1 / -1;
}

.budget-used,
.budget-status {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.budget-status.under-budget {
  color: #ffc107;
}

.budget-status.under-budget i {
  color: #ffc107;
}

.budget-status.ok-budget {
  color: #28a745;
}

.budget-status.ok-budget i {
  color: #28a745;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
  align-items: start;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-row: 1 / 3;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #6c757d;
  font-size: 32px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.product-description {
  font-size: 13px;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.product-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-quantity {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-quantity:hover:not(:disabled) {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.btn-quantity:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 16px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.total-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #e9ecef;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
}

.total-amount {
  color: #667eea;
}

/* Payment styles - reuse from Register.vue */
.payment-method-section {
  margin-bottom: 1.5rem;
}

.payment-methods-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.payment-method-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.payment-method-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.payment-method-item.selected {
  background: rgba(102, 126, 234, 0.05);
  border-color: #667eea;
}

.payment-radio {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.payment-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  margin: 0;
  width: 100%;
}

.payment-icon-unchecked,
.payment-icon-checked {
  font-size: 20px;
  transition: all 0.3s ease;
}

.payment-icon-unchecked {
  color: #6c757d;
}

.payment-icon-checked {
  color: #667eea;
  display: none;
}

.payment-method-item.selected .payment-icon-unchecked {
  display: none;
}

.payment-method-item.selected .payment-icon-checked {
  display: inline;
}

.payment-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
}

.payment-description {
  font-size: 13px;
  color: #6c757d;
}

/* Summary styles */
.summary-view {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.summary-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.summary-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

.summary-product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-product:last-child {
  border-bottom: none;
}

.product-summary-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.product-summary-name {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.product-summary-qty {
  font-size: 12px;
  color: #6c757d;
}

.product-summary-price {
  font-size: 14px;
  color: #667eea;
  font-weight: 700;
}

.total-item {
  background: rgba(102, 126, 234, 0.05);
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.total-value {
  color: #667eea !important;
  font-size: 16px !important;
  font-weight: 700 !important;
}

.form-navigation {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(67, 233, 123, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.alert-danger {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 13px;
}

.form-control {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  outline: none;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.step-subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 2rem;
}

.form-step {
  animation: fadeIn 0.5s ease-out;
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

/* Verification styles */
.verification-section {
  text-align: center;
}

.selected-payment-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.info-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 600;
  flex: 1;
}

.btn-change {
  background: transparent;
  border: 1px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.btn-change:hover {
  background: #667eea;
  color: white;
}

.verification-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.verification-subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.code-input {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1rem;
  max-width: 200px;
  margin: 0 auto;
}

.timer-text {
  font-size: 14px;
  color: #6c757d;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .upgrade-wrapper {
    padding: 1rem 0.5rem;
  }
  
  .upgrade-container {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }
  
  .upgrade-title {
    font-size: 20px;
  }
  
  .pakets-grid {
    grid-template-columns: 1fr;
  }
  
  .budget-info {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .budget-amount {
    font-size: 24px;
  }
  
  .budget-used,
  .budget-status {
    font-size: 14px;
  }
  
  .product-item {
    grid-template-columns: 60px 1fr;
    padding: 0.75rem;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
  
  .product-info h4 {
    font-size: 14px;
  }
  
  .product-price {
    font-size: 16px;
  }
  
  .product-controls {
    margin-top: 0.25rem;
  }
  
  .btn-quantity {
    width: 28px;
    height: 28px;
  }
  
  .quantity {
    font-size: 14px;
    min-width: 24px;
  }
  
  .form-navigation {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .step-title {
    font-size: 20px;
  }
  
  .step-subtitle {
    font-size: 13px;
  }
}
</style>
