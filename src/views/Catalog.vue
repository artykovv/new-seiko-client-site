<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="catalog-main">
        <div class="catalog-header">
          <h1 class="page-title">Каталог товаров</h1>
          <p class="page-subtitle">Японские БАДы премиум качества</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p>Загрузка товаров...</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="products.length > 0" class="products-grid">
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="product-card"
            @click="openProductModal(product)"
          >
            <div class="product-image">
              <div class="product-badge" v-if="product.stock < 20">
                <i class="bi bi-exclamation-circle"></i> Мало
              </div>
              <div class="product-badge success" v-else-if="product.stock > 80">
                <i class="bi bi-check-circle"></i> В наличии
              </div>
              <div class="placeholder-image">
                <i class="bi bi-box-seam"></i>
              </div>
            </div>

            <div class="product-body">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-sku">{{ product.sku }}</p>
              
              <div class="product-footer">
                <div class="product-price">${{ product.price }}</div>
                <div class="product-stock">
                  <i class="bi bi-box"></i> {{ product.stock }} шт
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>Товары не найдены</p>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />

    <!-- Product Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedProduct" class="modal-overlay" @click="closeProductModal">
        <div class="modal-content" @click.stop>
          <button @click="closeProductModal" class="btn-close-modal">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="modal-body">
            <div class="modal-image">
              <div class="placeholder-image-large">
                <i class="bi bi-box-seam"></i>
              </div>
            </div>

            <div class="modal-info">
              <h2 class="modal-title">{{ selectedProduct.name }}</h2>
              <p class="modal-sku">Артикул: {{ selectedProduct.sku }}</p>

              <div class="modal-description">
                <h3 class="section-title">Описание</h3>
                <p>{{ selectedProduct.description }}</p>
              </div>

              <div class="modal-details">
                <div class="detail-row">
                  <span class="detail-label">Цена:</span>
                  <span class="detail-value price">${{ selectedProduct.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'
import { BACKEND_API_URL } from '../config'

const showMenu = ref(false)
const loading = ref(false)
const products = ref([])
const selectedProduct = ref(null)

const fetchProducts = async () => {
  loading.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/admin/products/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      products.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

const openProductModal = (product) => {
  selectedProduct.value = product
  document.body.style.overflow = 'hidden'
}

const closeProductModal = () => {
  selectedProduct.value = null
  document.body.style.overflow = ''
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.catalog-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.catalog-header {
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

/* Loading & Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.loading-state p,
.empty-state p {
  margin-top: 1rem;
  color: #6c757d;
  font-size: 16px;
}

.empty-state i {
  font-size: 64px;
  color: #6c757d;
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

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
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

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.product-image {
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.product-badge.success {
  background: #28a745;
}

.placeholder-image {
  font-size: 64px;
  color: rgba(102, 126, 234, 0.3);
}

.product-body {
  padding: 1.5rem;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-sku {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 1rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.product-price {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.product-stock {
  font-size: 13px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Modal */
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
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 900px;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.modal-image {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.placeholder-image-large {
  font-size: 120px;
  color: rgba(102, 126, 234, 0.3);
}

.modal-info {
  display: flex;
  flex-direction: column;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.modal-sku {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.modal-description {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 0.75rem;
}

.modal-description p {
  font-size: 15px;
  color: #6c757d;
  line-height: 1.6;
}

.modal-details {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.detail-value {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 600;
}

.detail-value.price {
  font-size: 24px;
  color: #667eea;
}

.detail-value.stock {
  color: #28a745;
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

/* Mobile optimizations */
@media (max-width: 768px) {
  .catalog-main {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .modal-body {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .modal-image {
    min-height: 250px;
  }

  .placeholder-image-large {
    font-size: 80px;
  }

  .modal-title {
    font-size: 22px;
  }
}

/* Small phones */
@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 180px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .catalog-main {
    padding: 3rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
</style>
