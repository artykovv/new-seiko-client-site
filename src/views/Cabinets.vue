<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="cabinets-main">
        <div class="cabinets-header">
          <div class="header-content">
            <div>
              <h1 class="page-title">Мои кабинеты</h1>
              <p class="page-subtitle">Управление вашими кабинетами</p>
            </div>
            <button class="btn-add-cabinet" @click="openAddCabinetModal">
              <i class="bi bi-plus-lg"></i>
              Добавить кабинет
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <div class="filters-row">
            <!-- Filters Button -->
            <button 
              class="btn-filters"
              :class="{ 'active': showFilters }"
              @click="showFilters = !showFilters"
            >
              <i class="bi bi-funnel"></i>
              Фильтры
              <span v-if="hasActiveFilters" class="filter-badge">{{ activeFiltersCount }}</span>
            </button>
          </div>

          <!-- Filters Panel -->
          <div v-if="showFilters" class="filters-panel">
            <div class="filter-group">
              <label class="filter-label">Филиалы</label>
              <div class="filter-chips">
                <span 
                  v-for="branch in branches" 
                  :key="branch.id"
                  class="filter-chip"
                  :class="{ 'active': selectedBranchIds.includes(branch.id) }"
                  @click="toggleBranch(branch.id)"
                >
                  {{ branch.name }}
                </span>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">Пакеты</label>
              <div class="filter-chips">
                <span 
                  v-for="paket in pakets" 
                  :key="paket.id"
                  class="filter-chip"
                  :class="{ 'active': selectedPaketIds.includes(paket.id) }"
                  @click="togglePaket(paket.id)"
                >
                  {{ paket.name }}
                </span>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">Статусы</label>
              <div class="filter-chips">
                <span 
                  v-for="status in statuses" 
                  :key="status.id"
                  class="filter-chip"
                  :class="{ 'active': selectedStatusIds.includes(status.id) }"
                  @click="toggleStatus(status.id)"
                >
                  {{ status.name }}
                </span>
              </div>
            </div>

            <button 
              v-if="hasActiveFilters" 
              class="btn-clear-filters"
              @click="clearFilters"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p>Загрузка кабинетов...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <i class="bi bi-exclamation-circle"></i>
          <p>{{ error }}</p>
          <button @click="fetchCabinets" class="btn-retry">Попробовать снова</button>
        </div>

        <!-- Cabinets List -->
        <div v-else-if="cabinets.length > 0" class="cabinets-content">
          <div class="cabinets-grid">
            <div v-for="cabinet in cabinets" :key="cabinet.id" class="cabinet-card">
              <div class="cabinet-header">
                <div class="cabinet-number">{{ cabinet.personal_number }}</div>
                <div class="cabinet-status" :class="getStatusClass(cabinet.status_name)">
                  {{ cabinet.status_name }}
                </div>
              </div>

              <div class="cabinet-body">
                <div class="cabinet-info-row">
                  <span class="info-label">Код:</span>
                  <span class="info-value">{{ cabinet.code }}</span>
                </div>
                <div class="cabinet-info-row">
                  <span class="info-label">Пакет:</span>
                  <span class="info-value">{{ cabinet.paket_name }}</span>
                </div>
                <div class="cabinet-info-row">
                  <span class="info-label">Филиал:</span>
                  <span class="info-value">{{ cabinet.branch_name }}</span>
                </div>
                
                <!-- Turnover Section -->
                <div class="turnover-section">
                  <div class="turnover-title">Оборот за все время</div>
                  <div class="turnover-grid">
                    <div class="turnover-item">
                      <span class="turnover-label">Общий:</span>
                      <span class="turnover-value total">${{ cabinet.total_turnover_all_time }}</span>
                    </div>
                    <div class="turnover-item">
                      <span class="turnover-label">Левый:</span>
                      <span class="turnover-value left">${{ cabinet.left_turnover_all_time }}</span>
                    </div>
                    <div class="turnover-item">
                      <span class="turnover-label">Правый:</span>
                      <span class="turnover-value right">${{ cabinet.right_turnover_all_time }}</span>
                    </div>
                  </div>
                </div>

                <div class="turnover-section">
                  <div class="turnover-title">Оборот за месяц</div>
                  <div class="turnover-grid">
                    <div class="turnover-item">
                      <span class="turnover-label">Общий:</span>
                      <span class="turnover-value total">${{ cabinet.total_turnover_current_month }}</span>
                    </div>
                    <div class="turnover-item">
                      <span class="turnover-label">Левый:</span>
                      <span class="turnover-value left">${{ cabinet.left_turnover_current_month }}</span>
                    </div>
                    <div class="turnover-item">
                      <span class="turnover-label">Правый:</span>
                      <span class="turnover-value right">${{ cabinet.right_turnover_current_month }}</span>
                    </div>
                  </div>
                </div>

                <div class="cabinet-info-row">
                  <span class="info-label">Регистрация:</span>
                  <span class="info-value">{{ formatDate(cabinet.register_at) }}</span>
                </div>
              </div>

              <div class="cabinet-footer">
                <span class="sequence-badge">№{{ cabinet.sequence_number }}</span>
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
            Всего кабинетов: {{ total }}
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>У вас пока нет кабинетов</p>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />
    <AddCabinetModal :is-open="showAddCabinetModal" @close="closeAddCabinetModal" @created="onCabinetCreated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'
import AddCabinetModal from '../components/AddCabinetModal.vue'
import { BACKEND_API_URL } from '../config'

const showMenu = ref(false)
const showAddCabinetModal = ref(false)
const loading = ref(false)
const error = ref('')
const cabinets = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const totalPages = ref(0)

// Filters
const showFilters = ref(false)
const branches = ref([])
const pakets = ref([])
const statuses = ref([])
const selectedBranchIds = ref([])
const selectedPaketIds = ref([])
const selectedStatusIds = ref([])

const hasActiveFilters = computed(() => {
  return selectedBranchIds.value.length > 0 || 
         selectedPaketIds.value.length > 0 || 
         selectedStatusIds.value.length > 0
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedBranchIds.value.length > 0) count++
  if (selectedPaketIds.value.length > 0) count++
  if (selectedStatusIds.value.length > 0) count++
  return count
})

const toggleBranch = (branchId) => {
  const index = selectedBranchIds.value.indexOf(branchId)
  if (index > -1) {
    selectedBranchIds.value.splice(index, 1)
  } else {
    selectedBranchIds.value.push(branchId)
  }
  applyFilters()
}

const togglePaket = (paketId) => {
  const index = selectedPaketIds.value.indexOf(paketId)
  if (index > -1) {
    selectedPaketIds.value.splice(index, 1)
  } else {
    selectedPaketIds.value.push(paketId)
  }
  applyFilters()
}

const toggleStatus = (statusId) => {
  const index = selectedStatusIds.value.indexOf(statusId)
  if (index > -1) {
    selectedStatusIds.value.splice(index, 1)
  } else {
    selectedStatusIds.value.push(statusId)
  }
  applyFilters()
}

const clearFilters = () => {
  selectedBranchIds.value = []
  selectedPaketIds.value = []
  selectedStatusIds.value = []
  fetchCabinets(1)
}

const applyFilters = () => {
  page.value = 1
  fetchCabinets(1)
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

const fetchStatuses = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/admin/statuses/`, {
      headers: { 'accept': 'application/json' }
    })
    if (response.ok) {
      statuses.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching statuses:', err)
  }
}

const fetchCabinets = async (pageNum = 1) => {
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      error.value = 'Токен авторизации не найден'
      return
    }

    const params = new URLSearchParams({
      page: pageNum.toString(),
      page_size: pageSize.value.toString()
    })

    selectedBranchIds.value.forEach(id => {
      params.append('branch_id', id.toString())
    })

    selectedPaketIds.value.forEach(id => {
      params.append('paket_id', id.toString())
    })

    selectedStatusIds.value.forEach(id => {
      params.append('status_id', id.toString())
    })

    const response = await fetch(
      `${BACKEND_API_URL}/api/cabinets/?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Ошибка загрузки кабинетов')
    }

    const data = await response.json()
    cabinets.value = data.cabinets || []
    total.value = data.total || 0
    page.value = data.page || 1
    totalPages.value = data.total_pages || 0
  } catch (err) {
    console.error('Error fetching cabinets:', err)
    error.value = err.message || 'Ошибка загрузки данных'
  } finally {
    loading.value = false
  }
}

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    fetchCabinets(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getStatusClass = (statusName) => {
  if (statusName === 'LEADER') return 'status-leader'
  if (statusName === 'Без статуса') return 'status-none'
  return 'status-default'
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

const openAddCabinetModal = () => {
  showAddCabinetModal.value = true
}

const closeAddCabinetModal = () => {
  showAddCabinetModal.value = false
}

const onCabinetCreated = () => {
  fetchCabinets()
}

onMounted(async () => {
  await Promise.all([
    fetchBranches(),
    fetchPakets(),
    fetchStatuses()
  ])
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

.cabinets-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.cabinets-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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

.btn-add-cabinet {
  padding: 0.875rem 1.5rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-add-cabinet:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filters-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-filters {
  padding: 0.75rem 1.5rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.btn-filters:hover,
.btn-filters.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.filter-badge {
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.filters-panel {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.filter-chip:hover {
  background: #e9ecef;
}

.filter-chip.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-clear-filters {
  width: 100%;
  padding: 0.75rem;
  background: #fff5f5;
  border: 2px solid #f8d7da;
  color: #dc3545;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-clear-filters:hover {
  background: #ffe5e5;
  border-color: #dc3545;
}

/* Loading, Error, Empty States */
.loading-state,
.error-state,
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
.error-state p,
.empty-state p {
  margin-top: 1rem;
  color: #6c757d;
  font-size: 16px;
}

.error-state i,
.empty-state i {
  font-size: 64px;
  color: #6c757d;
  margin-bottom: 1rem;
}

.error-state i {
  color: #dc3545;
}

.btn-retry {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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

/* Cabinets Grid */
.cabinets-content {
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

.cabinets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.cabinet-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.cabinet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.cabinet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.cabinet-number {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.cabinet-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-leader {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.status-none {
  background: #f8f9fa;
  color: #6c757d;
}

.status-default {
  background: #667eea;
  color: white;
}

.cabinet-body {
  margin-bottom: 1rem;
}

.cabinet-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.cabinet-info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

/* Turnover Section */
.turnover-section {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.turnover-title {
  font-size: 12px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.turnover-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.turnover-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.turnover-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.turnover-value {
  font-size: 14px;
  font-weight: 700;
}

.turnover-value.total {
  color: #667eea;
}

.turnover-value.left {
  color: #28a745;
}

.turnover-value.right {
  color: #dc3545;
}

.cabinet-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.sequence-badge {
  padding: 0.25rem 0.75rem;
  background: #f8f9fa;
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
  .cabinets-main {
    padding: 1.5rem 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .btn-add-cabinet {
    width: 100%;
    justify-content: center;
  }

  .filters-section {
    padding: 1rem;
  }

  .filters-row {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .cabinets-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .cabinet-card {
    padding: 1.25rem;
  }

  .cabinet-number {
    font-size: 16px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .cabinets-main {
    padding: 3rem 2rem;
  }

  .cabinets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .cabinets-main {
    padding: 3rem;
  }

  .cabinets-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
