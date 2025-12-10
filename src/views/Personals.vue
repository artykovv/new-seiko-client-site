<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="personals-main">
        <div class="personals-header">
          <h1 class="page-title">Личники</h1>
          <p class="page-subtitle">Личные кабинеты участников</p>
        </div>

        <!-- Filter Section -->
        <div class="selector-section" v-if="selectedCabinetId">
          <div class="filter-toggle">
            <label class="toggle-label">
              <input 
                type="checkbox" 
                v-model="showRegistered" 
                @change="loadPersonalCabinets"
                class="toggle-checkbox"
              />
              <span class="toggle-text">Только зарегистрированные</span>
            </label>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingPersonals" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p>Загрузка личных кабинетов...</p>
        </div>

        <!-- Personal Cabinets List -->
        <div v-else-if="selectedCabinetId && personalCabinets.length > 0" class="personals-content">
          <div class="personals-grid">
            <div v-for="personal in personalCabinets" :key="personal.id" class="personal-card">
              <div class="personal-header" :style="{ background: `linear-gradient(${personal.paket.color})` }">
                <div class="personal-number">{{ personal.personal_number }}</div>
                <div class="personal-status">{{ personal.status.name }}</div>
              </div>

              <div class="personal-body">
                <div class="personal-info-row">
                  <span class="info-label">ФИО:</span>
                  <span class="info-value">
                    {{ personal.participant.lastname }} {{ personal.participant.name }}
                  </span>
                </div>
                <div class="personal-info-row">
                  <span class="info-label">Код:</span>
                  <span class="info-value">{{ personal.code }}</span>
                </div>
                <div class="personal-info-row">
                  <span class="info-label">Пакет:</span>
                  <span class="info-value">{{ personal.paket.name }}</span>
                </div>
                <div class="personal-info-row">
                  <span class="info-label">Филиал:</span>
                  <span class="info-value">{{ personal.branch.name }}</span>
                </div>
                <div class="personal-info-row">
                  <span class="info-label">Регистрация:</span>
                  <span class="info-value">{{ formatDate(personal.register_at) }}</span>
                </div>
                <div class="personal-info-row">
                  <span class="info-label">Статус:</span>
                  <span class="info-value" :class="{ 'registered': personal.registered }">
                    {{ personal.registered ? 'Зарегистрирован' : 'Не зарегистрирован' }}
                  </span>
                </div>
              </div>

              <div class="personal-footer">
                <span class="sequence-badge">№{{ personal.sequence_number }}</span>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="changePage(page - 1)" 
              :disabled="page === 1"
              class="pagination-btn"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            
            <div class="pagination-info">
              Страница {{ page }} из {{ totalPages }}
            </div>
            
            <button 
              @click="changePage(page + 1)" 
              :disabled="page === totalPages"
              class="pagination-btn"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>

          <!-- Total Count -->
          <div class="total-count">
            Всего личных кабинетов: {{ totalCabinets }}
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="selectedCabinetId && !loadingPersonals" class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>Нет личных кабинетов для выбранного спонсора</p>
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
const loadingCabinets = ref(false)
const loadingPersonals = ref(false)
const cabinets = ref([])
const selectedCabinetId = ref(null)
const personalCabinets = ref([])
const showRegistered = ref(true)
const page = ref(1)
const pageSize = ref(20)
const totalPages = ref(0)
const totalCabinets = ref(0)

const fetchCabinets = async () => {
  loadingCabinets.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/cabinets/?page=1&page_size=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      cabinets.value = data.cabinets || []
      
      // Auto-select first cabinet if available
      if (cabinets.value.length > 0) {
        selectedCabinetId.value = cabinets.value[0].id
        await loadPersonalCabinets()
      }
    }
  } catch (err) {
    console.error('Error fetching cabinets:', err)
  } finally {
    loadingCabinets.value = false
  }
}

const loadPersonalCabinets = async (pageNum = 1) => {
  if (!selectedCabinetId.value) return
  
  loadingPersonals.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const params = new URLSearchParams({
      sponsor_id: selectedCabinetId.value,
      registered: showRegistered.value.toString(),
      page: pageNum.toString(),
      page_size: pageSize.value.toString()
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
      personalCabinets.value = data.cabinets || []
      totalCabinets.value = data.total_cabinets || 0
      page.value = data.page || 1
      totalPages.value = data.total_pages || 0
    }
  } catch (err) {
    console.error('Error fetching personal cabinets:', err)
  } finally {
    loadingPersonals.value = false
  }
}


const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    loadPersonalCabinets(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
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
  fetchCabinets()
})
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

.personals-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.personals-header {
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

/* Selector Section */
.selector-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.selector-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
}

.cabinet-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #495057;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cabinet-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Filter Toggle */
.filter-toggle {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.toggle-text {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

/* Loading State */
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

/* Personals Content */
.personals-content {
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

.personals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.personal-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.personal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.personal-header {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.personal-number {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.personal-status {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.personal-body {
  padding: 1.5rem;
}

.personal-info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.personal-info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

.info-value.registered {
  color: #28a745;
}

.personal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
}

.sequence-badge {
  padding: 0.25rem 0.75rem;
  background: white;
  color: #495057;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pagination-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  color: #495057;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.total-count {
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .personals-main {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .selector-section {
    padding: 1rem;
  }

  .personals-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .personal-card {
    margin-bottom: 0;
  }

  .personal-number {
    font-size: 16px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .personals-main {
    padding: 3rem 2rem;
  }

  .personals-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .personals-main {
    padding: 3rem;
  }

  .personals-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
