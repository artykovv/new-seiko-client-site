<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="structure-main">
        <div class="structure-header">
          <h1 class="page-title">Организация</h1>
          <!-- Back Button -->
          <button 
            v-if="canGoBack" 
            @click="goBack"
            class="btn-back"
          >
            <i class="bi bi-arrow-left"></i>
            <span>Назад</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loadingStructure" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p>Загрузка структуры...</p>
        </div>

        <!-- Binary Tree Structure -->
        <div v-else-if="structureData && selectedCabinetId" class="binary-tree">
          <!-- Root Node -->
          <div class="tree-level">
            <div class="tree-node-wrapper">
              <div 
                class="tree-node root"
                :style="{ background: `linear-gradient(135deg, ${structureData.paket_color})` }"
              >
                <div 
                  class="node-avatar"
                  @click="loadStructure(structureData.cabinet_id)"
                >
                  <i class="bi bi-person-circle"></i>
                </div>
                <div class="node-name">
                  {{ structureData.participant_name }} {{ structureData.participant_lastname }}
                </div>
                <button 
                  class="node-id-btn"
                  @click="showCabinetDetails(structureData.cabinet_id)"
                >
                  {{ structureData.cabinet_personal_number }}
                  <i class="bi bi-info-circle"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Level 1 -->
          <div class="tree-level" v-if="structureData.left_child || structureData.right_child">
            <div class="tree-row">
              <!-- Left Child -->
              <div class="tree-node-wrapper">
                <div 
                  v-if="structureData.left_child"
                  class="tree-node"
                  :style="{ background: `linear-gradient(135deg, ${structureData.left_child.paket_color})` }"
                >
                  <div 
                    class="node-avatar"
                    @click="loadStructure(structureData.left_child.cabinet_id)"
                  >
                    <i class="bi bi-person-circle"></i>
                  </div>
                  <div class="node-name">
                    {{ structureData.left_child.participant_name }} {{ structureData.left_child.participant_lastname }}
                  </div>
                  <button 
                    class="node-id-btn"
                    @click="showCabinetDetails(structureData.left_child.cabinet_id)"
                  >
                    {{ structureData.left_child.cabinet_personal_number }}
                    <i class="bi bi-info-circle"></i>
                  </button>
                </div>
                <div v-else class="tree-node empty">
                  <i class="bi bi-plus-circle"></i>
                  <span>Свободно</span>
                </div>
              </div>

              <!-- Right Child -->
              <div class="tree-node-wrapper">
                <div 
                  v-if="structureData.right_child"
                  class="tree-node"
                  :style="{ background: `linear-gradient(135deg, ${structureData.right_child.paket_color})` }"
                >
                  <div 
                    class="node-avatar"
                    @click="loadStructure(structureData.right_child.cabinet_id)"
                  >
                    <i class="bi bi-person-circle"></i>
                  </div>
                  <div class="node-name">
                    {{ structureData.right_child.participant_name }} {{ structureData.right_child.participant_lastname }}
                  </div>
                  <button 
                    class="node-id-btn"
                    @click="showCabinetDetails(structureData.right_child.cabinet_id)"
                  >
                    {{ structureData.right_child.cabinet_personal_number }}
                    <i class="bi bi-info-circle"></i>
                  </button>
                </div>
                <div v-else class="tree-node empty">
                  <i class="bi bi-plus-circle"></i>
                  <span>Свободно</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Level 2 -->
          <div class="tree-level" v-if="hasLevel2Children">
            <div class="tree-row level-2">
              <!-- Left-Left -->
              <div class="tree-node-wrapper">
                <div 
                  v-if="structureData.left_child?.left_child"
                  class="tree-node small"
                  :style="{ background: `linear-gradient(135deg, ${structureData.left_child.left_child.paket_color})` }"
                  @click="loadStructure(structureData.left_child.left_child.cabinet_id)"
                >
                  <div class="small-id">{{ structureData.left_child.left_child.cabinet_personal_number }}</div>
                </div>
                <div v-else class="tree-node small empty">
                  <i class="bi bi-dash-circle"></i>
                </div>
              </div>

              <!-- Left-Right -->
              <div class="tree-node-wrapper">
                <div 
                  v-if="structureData.left_child?.right_child"
                  class="tree-node small"
                  :style="{ background: `linear-gradient(135deg, ${structureData.left_child.right_child.paket_color})` }"
                  @click="loadStructure(structureData.left_child.right_child.cabinet_id)"
                >
                  <div class="small-id">{{ structureData.left_child.right_child.cabinet_personal_number }}</div>
                </div>
                <div v-else class="tree-node small empty">
                  <i class="bi bi-dash-circle"></i>
                </div>
              </div>

              <!-- Right-Left -->
              <div class="tree-node-wrapper">
                <div 
                  v-if="structureData.right_child?.left_child"
                  class="tree-node small"
                  :style="{ background: `linear-gradient(135deg, ${structureData.right_child.left_child.paket_color})` }"
                  @click="loadStructure(structureData.right_child.left_child.cabinet_id)"
                >
                  <div class="small-id">{{ structureData.right_child.left_child.cabinet_personal_number }}</div>
                </div>
                <div v-else class="tree-node small empty">
                  <i class="bi bi-dash-circle"></i>
                </div>
              </div>

              <!-- Right-Right -->
              <div class="tree-node-wrapper">
                <div 
                  v-if="structureData.right_child?.right_child"
                  class="tree-node small"
                  :style="{ background: `linear-gradient(135deg, ${structureData.right_child.right_child.paket_color})` }"
                  @click="loadStructure(structureData.right_child.right_child.cabinet_id)"
                >
                  <div class="small-id">{{ structureData.right_child.right_child.cabinet_personal_number }}</div>
                </div>
                <div v-else class="tree-node small empty">
                  <i class="bi bi-dash-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />

    <!-- Cabinet Details Modal -->
    <Transition name="modal">
      <div v-if="selectedCabinet" class="modal-overlay" @click="closeCabinetModal">
        <div class="modal-content" @click.stop>
          <button @click="closeCabinetModal" class="btn-close-modal">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="modal-body">
            <div class="modal-header-section">
              <h2 class="modal-title">{{ selectedCabinet.personal_number }}</h2>
              <p class="modal-subtitle">{{ selectedCabinet.paket_name }}</p>
            </div>

            <div class="modal-details">
              <div class="detail-section">
                <h3 class="section-title">Основная информация</h3>
                <div class="detail-row">
                  <span class="detail-label">Код:</span>
                  <span class="detail-value">{{ selectedCabinet.code }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Статус:</span>
                  <span class="detail-value status">{{ selectedCabinet.status_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Филиал:</span>
                  <span class="detail-value">{{ selectedCabinet.branch_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Дата регистрации:</span>
                  <span class="detail-value">{{ formatDate(selectedCabinet.register_at) }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">Оборот за все время</h3>
                <div class="detail-row">
                  <span class="detail-label">Левый:</span>
                  <span class="detail-value turnover">${{ selectedCabinet.left_turnover_all_time }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Правый:</span>
                  <span class="detail-value turnover">${{ selectedCabinet.right_turnover_all_time }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">Оборот за текущий месяц</h3>
                <div class="detail-row">
                  <span class="detail-label">Левый:</span>
                  <span class="detail-value turnover">${{ selectedCabinet.left_turnover_current_month }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Правый:</span>
                  <span class="detail-value turnover">${{ selectedCabinet.right_turnover_current_month }}</span>
                </div>
                <div class="detail-row binary-bonus-row">
                  <span class="detail-label">Бинар:</span>
                  <span v-if="loadingBinaryBonus" class="detail-value">
                    <span class="spinner-border spinner-border-sm" role="status"></span>
                  </span>
                  <span v-else-if="binaryBonus !== null" class="detail-value binary-bonus">
                    {{ binaryBonus }}
                  </span>
                  <span v-else class="detail-value">-</span>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">Команда</h3>
                <div class="detail-row">
                  <span class="detail-label">Прямые рефералы:</span>
                  <span class="detail-value">{{ selectedCabinet.direct_referrals_count }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Левая команда:</span>
                  <span class="detail-value">{{ selectedCabinet.left_team_count }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Правая команда:</span>
                  <span class="detail-value">{{ selectedCabinet.right_team_count }}</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button 
                @click="switchToCabinet(selectedCabinet.id)"
                class="btn-switch"
              >
                <i class="bi bi-diagram-3"></i>
                Перейти к структуре
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'
import { BACKEND_API_URL } from '../config'

const router = useRouter()
const route = useRoute()
const showMenu = ref(false)
const loadingCabinets = ref(false)
const loadingStructure = ref(false)
const cabinets = ref([])
const selectedCabinetId = ref(null)
const structureData = ref(null)
const selectedCabinet = ref(null)
const ownCabinetId = ref(null)
const navigationHistory = ref([])
const loadingBinaryBonus = ref(false)
const binaryBonus = ref(null)

const canGoBack = computed(() => {
  return navigationHistory.value.length > 0 && 
         selectedCabinetId.value !== ownCabinetId.value
})

const hasLevel2Children = computed(() => {
  return structureData.value?.left_child?.left_child ||
         structureData.value?.left_child?.right_child ||
         structureData.value?.right_child?.left_child ||
         structureData.value?.right_child?.right_child
})

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
      
      if (cabinets.value.length > 0) {
        ownCabinetId.value = cabinets.value[0].id
      }
      
      const cabinetIdFromUrl = route.query.cabinet
      
      if (cabinetIdFromUrl) {
        selectedCabinetId.value = cabinetIdFromUrl
        await loadStructure(cabinetIdFromUrl, false)
      } else if (cabinets.value.length > 0) {
        selectedCabinetId.value = cabinets.value[0].id
        await loadStructure(cabinets.value[0].id, false)
      }
    }
  } catch (err) {
    console.error('Error fetching cabinets:', err)
  } finally {
    loadingCabinets.value = false
  }
}

const loadStructure = async (cabinetId, addToHistory = true) => {
  if (!cabinetId) return
  
  loadingStructure.value = true
  
  if (addToHistory && selectedCabinetId.value && selectedCabinetId.value !== cabinetId) {
    navigationHistory.value.push(selectedCabinetId.value)
  }
  
  selectedCabinetId.value = cabinetId
  
  router.push({ 
    path: '/structure', 
    query: { cabinet: cabinetId } 
  })
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      return
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/structure/${cabinetId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      structureData.value = await response.json()
    }
  } catch (err) {
    console.error('Error fetching structure:', err)
  } finally {
    loadingStructure.value = false
  }
}

const showCabinetDetails = async (cabinetId) => {
  if (!cabinetId) return
  
  // Open modal immediately
  selectedCabinet.value = { id: cabinetId } // Temporary data
  loadingBinaryBonus.value = true
  binaryBonus.value = null
  document.body.style.overflow = 'hidden'
  
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('Token not found')
      closeCabinetModal()
      return
    }

    // Fetch cabinet details
    const response = await fetch(
      `${BACKEND_API_URL}/api/cabinets/${cabinetId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      selectedCabinet.value = await response.json()
      
      // Fetch binary bonus asynchronously
      fetchBinaryBonus(cabinetId, token)
    } else {
      closeCabinetModal()
    }
  } catch (err) {
    console.error('Error fetching cabinet details:', err)
    closeCabinetModal()
  }
}

const fetchBinaryBonus = async (cabinetId, token) => {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/bonuses/binary/calculate/${cabinetId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      binaryBonus.value = data.total_bonus_to_pay || '0.00'
    } else {
      binaryBonus.value = null
    }
  } catch (err) {
    console.error('Error fetching binary bonus:', err)
    binaryBonus.value = null
  } finally {
    loadingBinaryBonus.value = false
  }
}

const closeCabinetModal = () => {
  selectedCabinet.value = null
  binaryBonus.value = null
  loadingBinaryBonus.value = false
  document.body.style.overflow = ''
}

const switchToCabinet = async (cabinetId) => {
  closeCabinetModal()
  await loadStructure(cabinetId)
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

const goBack = async () => {
  if (navigationHistory.value.length > 0) {
    const previousCabinetId = navigationHistory.value.pop()
    await loadStructure(previousCabinetId, false)
  }
}

watch(() => route.query.cabinet, (newCabinetId) => {
  if (newCabinetId && newCabinetId !== selectedCabinetId.value) {
    loadStructure(newCabinetId, false)
  }
})

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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.structure-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.structure-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 0;
}

.btn-back {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: 2px solid white;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-back:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-back i {
  font-size: 18px;
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

/* Binary Tree Styles */
.binary-tree {
  padding: 2rem 0;
  overflow-x: auto;
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

.tree-level {
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
  position: relative;
}

.tree-row {
  display: flex;
  gap: 3rem;
  justify-content: center;
  position: relative;
}

.tree-row.level-2 {
  gap: 1.5rem;
}

/* Connecting Lines */
.tree-level:not(:first-child) .tree-node-wrapper::before {
  content: '';
  position: absolute;
  top: -4rem;
  left: 50%;
  width: 2px;
  height: 4rem;
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%);
}

/* Horizontal line for level 1 */
.tree-row:not(.level-2)::before {
  content: '';
  position: absolute;
  top: -4rem;
  left: 25%;
  right: 25%;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

/* Horizontal lines for level 2 */
.tree-row.level-2 .tree-node-wrapper:nth-child(1)::after,
.tree-row.level-2 .tree-node-wrapper:nth-child(2)::after {
  content: '';
  position: absolute;
  top: -4rem;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  width: calc(50% + 0.75rem);
}

.tree-row.level-2 .tree-node-wrapper:nth-child(1)::after {
  left: 50%;
}

.tree-row.level-2 .tree-node-wrapper:nth-child(2)::after {
  right: 50%;
}

.tree-row.level-2 .tree-node-wrapper:nth-child(3)::after,
.tree-row.level-2 .tree-node-wrapper:nth-child(4)::after {
  content: '';
  position: absolute;
  top: -4rem;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  width: calc(50% + 0.75rem);
}

.tree-row.level-2 .tree-node-wrapper:nth-child(3)::after {
  left: 50%;
}

.tree-row.level-2 .tree-node-wrapper:nth-child(4)::after {
  right: 50%;
}

/* Tree Nodes */
.tree-node-wrapper {
  position: relative;
}

.tree-node {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 180px;
  max-width: 180px;
  height: 200px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
}

.tree-node:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.tree-node.root {
  width: 220px;
  max-width: 220px;
  height: 220px;
  padding: 2rem;
}

.tree-node.small {
  width: 90px;
  max-width: 90px;
  height: 90px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Small card personal number */
.small-id {
  font-size: 12px;
  font-weight: 700;
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.3px;
}

/* Empty Nodes */
.tree-node.empty {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.6);
  cursor: default;
}

.tree-node.empty:hover {
  transform: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.tree-node.empty i {
  font-size: 32px;
}

.tree-node.empty span {
  font-size: 12px;
  font-weight: 600;
}

.tree-node.small.empty {
  width: 90px;
  max-width: 90px;
  height: 90px;
}

.tree-node.small.empty i {
  font-size: 24px;
}

/* Node Content */
.node-avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.node-avatar:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.tree-node.root .node-avatar {
  width: 70px;
  height: 70px;
  font-size: 42px;
}

.node-name {
  font-size: 13px;
  font-weight: 700;
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.tree-node.root .node-name {
  font-size: 14px;
}

/* Personal Number Button */
.node-id-btn {
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: rgba(255, 255, 255, 0.25);
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.node-id-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.node-id-btn:active {
  transform: translateY(0);
}

.node-id-btn i {
  font-size: 12px;
  opacity: 0.9;
}

/* Modal Styles */
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 600px;
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

.modal-header-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  font-size: 16px;
  color: #667eea;
  font-weight: 600;
  margin: 0;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 1rem;
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
  text-align: right;
}

.detail-value.turnover {
  color: #28a745;
}

.detail-value.binary-bonus {
  color: #667eea;
  font-weight: 700;
}

.binary-bonus-row .spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
  color: #667eea;
}

.modal-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.btn-switch {
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

.btn-switch:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .structure-main {
    padding: 1.5rem 0.5rem;
  }

  .structure-header {
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  .page-title {
    font-size: 24px;
  }

  .btn-back {
    padding: 0.5rem 1rem;
    font-size: 14px;
  }

  .btn-back span {
    display: none;
  }

  /* Binary Tree Mobile Adjustments */
  .binary-tree {
    padding: 1rem 0;
    min-width: 100%;
  }

  .tree-level {
    margin-bottom: 3rem;
  }

  .tree-row {
    gap: 1.5rem;
  }

  .tree-row.level-2 {
    gap: 0.75rem;
  }

  /* Adjust connecting lines for mobile */
  .tree-level:not(:first-child) .tree-node-wrapper::before {
    top: -3rem;
    height: 3rem;
  }

  .tree-row:not(.level-2)::before {
    top: -3rem;
  }

  .tree-row.level-2 .tree-node-wrapper::after {
    top: -3rem !important;
  }

  /* Smaller nodes on mobile */
  .tree-node {
    width: 140px;
    max-width: 140px;
    height: 170px;
    padding: 1rem;
  }

  .tree-node.root {
    width: 160px;
    max-width: 160px;
    height: 190px;
    padding: 1.5rem;
  }

  .tree-node.small {
    width: 70px;
    max-width: 70px;
    height: 70px;
    padding: 0.4rem;
  }

  .small-id {
    font-size: 10px;
  }

  .node-avatar {
    width: 45px;
    height: 45px;
    font-size: 26px;
  }

  .tree-node.root .node-avatar {
    width: 55px;
    height: 55px;
    font-size: 32px;
  }

  .node-name {
    font-size: 11px;
    line-height: 1.1;
  }

  .tree-node.root .node-name {
    font-size: 12px;
  }

  .node-id-btn {
    font-size: 10px;
    padding: 0.3rem 0.5rem;
  }

  .node-id-btn i {
    font-size: 9px;
  }

  .tree-node.empty i {
    font-size: 24px;
  }

  .tree-node.empty span {
    font-size: 11px;
  }

  .tree-node.small.empty {
    width: 70px;
    max-width: 70px;
    height: 70px;
  }

  .tree-node.small.empty i {
    font-size: 20px;
  }

  /* Modal adjustments */
  .modal-content {
    margin: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 22px;
  }

  .detail-section {
    padding: 1rem;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .tree-row {
    gap: 0.6rem;
  }

  .tree-row.level-2 {
    gap: 0.3rem;
  }

  .tree-node {
    width: 110px;
    max-width: 110px;
    height: 140px;
    padding: 0.75rem;
  }

  .tree-node.root {
    width: 130px;
    max-width: 130px;
    height: 160px;
    padding: 1rem;
  }

  .tree-node.small {
    width: 60px;
    max-width: 60px;
    height: 60px;
    padding: 0.3rem;
  }

  .small-id {
    font-size: 9px;
  }

  .node-name {
    font-size: 10px;
  }

  .tree-node.root .node-name {
    font-size: 11px;
  }

  .node-id-btn {
    font-size: 9px;
    padding: 0.25rem 0.4rem;
  }

  .node-id-btn i {
    font-size: 8px;
  }

  .tree-node.small.empty {
    width: 60px;
    max-width: 60px;
    height: 60px;
  }

  .tree-node.small.empty i {
    font-size: 18px;
  }
}
</style>
