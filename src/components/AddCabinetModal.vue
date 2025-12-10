<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <button @click="$emit('close')" class="btn-close-modal">
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="modal-body">
          <h2 class="modal-title">Добавить кабинет</h2>
          <p class="modal-subtitle">Шаг {{ currentStep }} из 2</p>

          <!-- Error Alert -->
          <div v-if="error" class="alert alert-error">
            <i class="bi bi-exclamation-circle"></i>
            {{ error }}
          </div>

          <form @submit.prevent="handleNext">
            <!-- Step 1: Cabinet Info -->
            <div v-show="currentStep === 1" class="form-step">
              <div class="form-group">
                <label class="form-label">
                  <i class="bi bi-key"></i> Код кабинета
                </label>
                <div class="input-with-button">
                  <input
                    type="text"
                    class="form-input"
                    v-model="formData.cabinet.code"
                    placeholder="AB123"
                    readonly
                  />
                  <button
                    type="button"
                    class="btn-generate"
                    @click="generateCabinetCode"
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
                <small class="form-hint">Автоматически сгенерированный код</small>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="bi bi-box"></i> Пакет
                </label>
                <select
                  class="form-select"
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
                <label class="form-label">
                  <i class="bi bi-geo-alt"></i> Филиал
                </label>
                <select
                  class="form-select"
                  v-model.number="formData.cabinet.branch_id"
                >
                  <option :value="null">Выберите филиал</option>
                  <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                    {{ branch.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="bi bi-person-plus"></i> Спонсор
                </label>
                <div class="position-relative">
                  <input
                    type="text"
                    class="form-input"
                    v-model="sponsorSearchQuery"
                    @input="handleSponsorSearch"
                    placeholder="Поиск спонсора по ФИО или номеру..."
                    autocomplete="off"
                  />
                  
                  <div 
                    v-if="showSponsorDropdown && (sponsorSearchResults.length > 0 || sponsorSearchLoading)"
                    class="search-dropdown"
                  >
                    <div v-if="sponsorSearchLoading" class="dropdown-item text-center">
                      <div class="spinner-border spinner-border-sm"></div>
                    </div>
                    <div 
                      v-else
                      v-for="cabinet in sponsorSearchResults" 
                      :key="cabinet.id"
                      class="dropdown-item"
                      @click="selectSponsor(cabinet)"
                    >
                      <div class="sponsor-info">
                        <div class="fw-semibold">{{ formatCabinetName(cabinet) }}</div>
                        <small class="text-muted">{{ cabinet.personal_number }}</small>
                      </div>
                      <i class="bi bi-chevron-right"></i>
                    </div>
                    <div v-if="sponsorSearchResults.length === 0 && sponsorSearchQuery.trim()" class="dropdown-item text-muted text-center">
                      Спонсоры не найдены
                    </div>
                  </div>
                </div>
                <small class="form-hint">Необязательно</small>
              </div>
            </div>

            <!-- Step 2: Product Selection -->
            <div v-show="currentStep === 2" class="form-step">
              <div class="package-info">
                <div class="info-row">
                  <span class="text-muted">Выбранный пакет:</span>
                  <span class="fw-bold">{{ selectedPackage?.name || '-' }} - ${{ selectedPackage?.price || 0 }}</span>
                </div>
                <div class="info-row">
                  <span class="text-muted">Остаток:</span>
                  <span class="fw-bold" :class="remainingAmount >= 0 ? 'text-success' : 'text-danger'">
                    ${{ remainingAmount.toFixed(2) }}
                  </span>
                </div>
              </div>

              <div v-if="loadingProducts" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
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
                        class="quantity-btn"
                        type="button"
                        @click="decreaseQuantity(product.id)"
                        :disabled="getProductQuantity(product.id) <= 1"
                      >
                        <i class="bi bi-dash"></i>
                      </button>
                      <span class="quantity-value">{{ getProductQuantity(product.id) }}</span>
                      <button 
                        class="quantity-btn"
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
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="order-summary">
                <div class="summary-row">
                  <span>Выбрано товаров:</span>
                  <span>{{ selectedProducts.reduce((sum, item) => sum + item.quantity, 0) }} шт.</span>
                </div>
                <div class="summary-row">
                  <span>Сумма товаров:</span>
                  <span>${{ selectedProductsTotal.toFixed(2) }}</span>
                </div>
                <div class="summary-row total-row">
                  <span>Остаток по пакету:</span>
                  <span :class="remainingAmount >= 0 ? 'text-success' : 'text-danger'">
                    ${{ remainingAmount.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="modal-actions">
              <button
                v-if="currentStep > 1"
                type="button"
                class="btn-secondary"
                @click="previousStep"
              >
                <i class="bi bi-arrow-left"></i>
                Назад
              </button>

              <button
                v-if="currentStep < 2"
                type="submit"
                class="btn-primary"
              >
                Далее
                <i class="bi bi-arrow-right"></i>
              </button>

              <button
                v-if="currentStep === 2"
                type="submit"
                class="btn-success"
                :disabled="loading || selectedProducts.length === 0 || remainingAmount < 0"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi bi-check-circle"></i>
                {{ loading ? 'Создание...' : 'Создать кабинет' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { BACKEND_API_URL } from '../config'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'created'])

const currentStep = ref(1)
const error = ref('')
const loading = ref(false)
const loadingProducts = ref(false)

const pakets = ref([])
const branches = ref([])
const products = ref([])
const selectedProducts = ref([])
const selectedPackage = ref(null)

const sponsorSearchQuery = ref('')
const sponsorSearchResults = ref([])
const sponsorSearchLoading = ref(false)
const showSponsorDropdown = ref(false)
const selectedSponsor = ref(null)
let sponsorSearchTimeout = null

const formData = ref({
  cabinet: {
    code: '',
    paket_id: null,
    branch_id: null,
    sponsor_id: null
  }
})

// Computed
const selectedProductsTotal = computed(() => {
  return selectedProducts.value.reduce((sum, item) => {
    const product = products.value.find(p => p.id === item.product_id)
    return sum + (product ? parseFloat(product.price) * item.quantity : 0)
  }, 0)
})

const remainingAmount = computed(() => {
  const packagePrice = selectedPackage.value?.price || 0
  return packagePrice - selectedProductsTotal.value
})

// Methods
const generateCabinetCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const code = 
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  formData.value.cabinet.code = code
}

const fetchPakets = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/admin/pakets/`, {
      headers: { 'accept': 'application/json' }
    })
    if (response.ok) {
      pakets.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching pakets:', err)
  }
}

const fetchBranches = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/admin/branches/`, {
      headers: { 'accept': 'application/json' }
    })
    if (response.ok) {
      branches.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching branches:', err)
  }
}

const fetchProducts = async () => {
  loadingProducts.value = true
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/admin/products/`, {
      headers: { 'accept': 'application/json' }
    })
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    loadingProducts.value = false
  }
}

const onPackageChange = () => {
  const paket = pakets.value.find(p => p.id === formData.value.cabinet.paket_id)
  selectedPackage.value = paket
  selectedProducts.value = []
}

const handleSponsorSearch = () => {
  clearTimeout(sponsorSearchTimeout)
  
  if (sponsorSearchQuery.value.trim().length < 2) {
    showSponsorDropdown.value = false
    return
  }
  
  sponsorSearchTimeout = setTimeout(async () => {
    await searchSponsors()
  }, 300)
}

const searchSponsors = async () => {
  sponsorSearchLoading.value = true
  showSponsorDropdown.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    const params = new URLSearchParams({
      search: sponsorSearchQuery.value,
      registered: 'true'
    })
    
    const response = await fetch(
      `${BACKEND_API_URL}/api/admin/cabinets/?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      sponsorSearchResults.value = data.cabinets || []
    }
  } catch (err) {
    console.error('Error searching sponsors:', err)
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
  if (!cabinet || !cabinet.participant) return ''
  const { participant } = cabinet
  return `${participant.lastname || ''} ${participant.name || ''} ${participant.patronymic || ''}`.trim()
}

// Product methods
const isProductSelected = (productId) => {
  return selectedProducts.value.some(item => item.product_id === productId)
}

const getProductQuantity = (productId) => {
  const item = selectedProducts.value.find(item => item.product_id === productId)
  return item ? item.quantity : 0
}

const canAddProduct = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (!product) return false
  
  const currentItem = selectedProducts.value.find(item => item.product_id === productId)
  const currentQuantity = currentItem ? currentItem.quantity : 0
  const newTotal = selectedProductsTotal.value + (currentQuantity === 0 ? parseFloat(product.price) : 0)
  
  return newTotal <= (selectedPackage.value?.price || 0)
}

const toggleProduct = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (!product || !canAddProduct(productId)) return
  
  selectedProducts.value.push({
    product_id: productId,
    quantity: 1,
    unit_price: parseFloat(product.price)
  })
}

const increaseQuantity = (productId) => {
  const item = selectedProducts.value.find(item => item.product_id === productId)
  if (item && canAddProduct(productId)) {
    item.quantity++
  }
}

const decreaseQuantity = (productId) => {
  const item = selectedProducts.value.find(item => item.product_id === productId)
  if (item && item.quantity > 1) {
    item.quantity--
  }
}

const removeProductFromSelection = (productId) => {
  const index = selectedProducts.value.findIndex(item => item.product_id === productId)
  if (index !== -1) {
    selectedProducts.value.splice(index, 1)
  }
}

const validateStep = () => {
  error.value = ''
  
  if (currentStep.value === 1) {
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
  
  if (currentStep.value === 2) {
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
  if (!validateStep()) return
  
  if (currentStep.value < 2) {
    currentStep.value++
    if (currentStep.value === 2 && products.value.length === 0) {
      await fetchProducts()
    }
  } else {
    await createCabinet()
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = ''
  }
}

const createCabinet = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('access_token')
    
    const requestData = {
      cabinet: {
        code: formData.value.cabinet.code,
        paket_id: formData.value.cabinet.paket_id,
        branch_id: formData.value.cabinet.branch_id,
        sponsor_id: formData.value.cabinet.sponsor_id || null
      },
      order: {
        items: selectedProducts.value,
        status_id: 1,
        delivery_method_id: 1,
        shipping_address: '',
        notes: ''
      }
    }
    
    const response = await fetch(`${BACKEND_API_URL}/api/cabinets/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    
    if (response.ok) {
      emit('created')
      resetForm()
      emit('close')
    } else {
      const errorData = await response.json()
      error.value = errorData.detail || 'Ошибка при создании кабинета'
    }
  } catch (err) {
    console.error('Error creating cabinet:', err)
    error.value = 'Ошибка при создании кабинета'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  currentStep.value = 1
  error.value = ''
  formData.value = {
    cabinet: {
      code: '',
      paket_id: null,
      branch_id: null,
      sponsor_id: null
    }
  }
  selectedProducts.value = []
  selectedPackage.value = null
  sponsorSearchQuery.value = ''
  selectedSponsor.value = null
}

// Watch for modal open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    generateCabinetCode()
    fetchPakets()
    fetchBranches()
  } else {
    resetForm()
  }
})
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 700px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.btn-close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-close-modal:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

/* Alert */
.alert-error {
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Form */
.form-step {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 15px;
  color: #495057;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #6c757d;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.btn-generate {
  padding: 0.875rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-generate:hover {
  background: #5568d3;
}

/* Sponsor Search */
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
  margin-top: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.sponsor-info {
  flex: 1;
}

/* Package Info */
.package-info {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

/* Products */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.product-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
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
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.product-description {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #5568d3;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.add-product-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-product-btn:hover:not(:disabled) {
  background: #218838;
}

.add-product-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-product-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-product-btn:hover {
  background: #c82333;
}

/* Order Summary */
.order-summary {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-child {
  border-bottom: none;
}

.total-row {
  font-weight: 700;
  font-size: 16px;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.text-muted {
  color: #6c757d;
}

.fw-bold {
  font-weight: 700;
}

.fw-semibold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.btn-secondary,
.btn-primary,
.btn-success {
  flex: 1;
  padding: 1rem 2rem;
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

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Mobile */
@media (max-width: 600px) {
  .modal-content {
    margin: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 22px;
  }

  .products-list {
    max-height: 300px;
  }
}
</style>
