<template>
  <div class="page-wrapper">
    <div class="page-container">
      <PageHeader @toggle-menu="showMenu = !showMenu" />
      
      <main class="sanctions-main">
        <div class="sanctions-header">
          <h1 class="page-title">Санкции</h1>
          <p class="page-subtitle">Положение о санкциях</p>
        </div>

        <div class="pdf-container">
          <div class="pdf-toolbar">
            <a 
              :href="pdfUrl" 
              download="sanctions.pdf"
              class="btn-download"
            >
              <i class="bi bi-download me-2"></i>Скачать PDF
            </a>
            <a 
              :href="pdfUrl" 
              target="_blank"
              class="btn-open"
            >
              <i class="bi bi-box-arrow-up-right me-2"></i>Открыть в новой вкладке
            </a>
          </div>

          <!-- Mobile hint -->
          <div class="mobile-hint">
            <i class="bi bi-info-circle me-2"></i>
            <span>Для удобного просмотра рекомендуем скачать файл или открыть в новой вкладке</span>
          </div>

          <div class="pdf-viewer">
            <iframe 
              :src="pdfUrl" 
              type="application/pdf"
              class="pdf-frame"
              title="Положение о санкциях"
            >
              <p class="pdf-fallback">
                Ваш браузер не поддерживает просмотр PDF. 
                <a :href="pdfUrl" download>Скачайте файл</a> для просмотра.
              </p>
            </iframe>
          </div>
        </div>
      </main>
    </div>

    <MenuModal :is-open="showMenu" @close="showMenu = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MenuModal from '../components/MenuModal.vue'

const showMenu = ref(false)
const pdfUrl = '/sanctions.pdf'
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

.sanctions-main {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 72px);
}

.sanctions-header {
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

/* PDF Container */
.pdf-container {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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

/* PDF Toolbar */
.pdf-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.btn-download,
.btn-open {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-download {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-open {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-open:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Mobile Hint */
.mobile-hint {
  display: none;
  padding: 1rem 1.5rem;
  background: #fff3cd;
  border-bottom: 2px solid #ffc107;
  color: #856404;
  font-size: 13px;
  line-height: 1.5;
  align-items: flex-start;
}

.mobile-hint i {
  flex-shrink: 0;
  margin-top: 2px;
}

/* PDF Viewer */
.pdf-viewer {
  position: relative;
  width: 100%;
  height: calc(100vh - 280px);
  min-height: 600px;
}

.pdf-frame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.pdf-fallback {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
  font-size: 16px;
}

.pdf-fallback a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}

.pdf-fallback a:hover {
  text-decoration: underline;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .sanctions-main {
    padding: 1rem;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .sanctions-header {
    margin-bottom: 1.5rem;
  }

  .pdf-container {
    border-radius: 16px;
  }

  .pdf-toolbar {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  .btn-download,
  .btn-open {
    width: 100%;
    justify-content: center;
    padding: 1rem 1.5rem;
    font-size: 15px;
  }

  /* Show mobile hint */
  .mobile-hint {
    display: flex;
  }

  .pdf-viewer {
    height: 400px;
    min-height: 300px;
  }
}

/* Small phones */
@media (max-width: 480px) {
  .sanctions-main {
    padding: 0.75rem;
  }

  .page-title {
    font-size: 20px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .pdf-container {
    border-radius: 12px;
  }

  .pdf-toolbar {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .btn-download,
  .btn-open {
    padding: 0.875rem 1rem;
    font-size: 14px;
  }

  .mobile-hint {
    padding: 0.875rem 1rem;
    font-size: 12px;
  }

  .pdf-viewer {
    height: 350px;
    min-height: 250px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .sanctions-main {
    padding: 3rem 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .sanctions-main {
    padding: 3rem;
  }

  .pdf-viewer {
    height: calc(100vh - 260px);
  }
}
</style>
