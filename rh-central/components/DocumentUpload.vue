<template>
  <div class="document-upload">
    <div class="upload-area" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="handleDrop">
      <input
        ref="fileInput"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        @change="handleFileSelect"
        class="file-input"
      />
      <div class="upload-content" :class="{ dragging: isDragging }">
        <div class="upload-icon">📄</div>
        <p class="upload-title">Arrastar arquivo aqui</p>
        <p class="upload-subtitle">ou</p>
        <button
          type="button"
          class="btn-upload"
          @click="$refs.fileInput.click()"
        >
          Selecionar Arquivo
        </button>
        <p class="upload-hint">
          Tipos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (máx 10MB)
        </p>
      </div>
    </div>

    <div v-if="files.length > 0" class="files-list">
      <h4>Arquivos Selecionados</h4>
      <div class="file-item" v-for="(file, index) in files" :key="index">
        <span class="file-name">{{ file.name }}</span>
        <span class="file-size">{{ formatFileSize(file.size) }}</span>
        <button
          type="button"
          class="btn-remove"
          @click="removeFile(index)"
          title="Remover"
        >
          ✕
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="error-box">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  filesSelected: [files: File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const files = ref<File[]>([])
const errorMessage = ref('')

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
]

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes, k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    processFiles(Array.from(input.files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

const processFiles = (newFiles: File[]) => {
  errorMessage.value = ''

  for (const file of newFiles) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      errorMessage.value = `Tipo de arquivo não permitido: ${file.name}`
      continue
    }

    if (file.size > MAX_FILE_SIZE) {
      errorMessage.value = `Arquivo muito grande: ${file.name} (máx 10MB)`
      continue
    }

    if (!files.value.find((f) => f.name === file.name)) {
      files.value.push(file)
    }
  }

  emit('filesSelected', files.value)
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  emit('filesSelected', files.value)
}
</script>

<style scoped>
.document-upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-area {
  position: relative;
  border: 2px dashed var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.file-input {
  display: none;
}

.upload-content {
  padding: 32px;
  text-align: center;
  background: var(--surface2);
  transition: all 0.2s;
  cursor: pointer;
}

.upload-content.dragging {
  background: rgba(74, 124, 89, 0.1);
  border-color: #4a7c59;
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.upload-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px 0;
}

.upload-subtitle {
  font-size: 12px;
  color: var(--text3);
  margin: 0 0 12px 0;
}

.btn-upload {
  padding: 8px 16px;
  background: linear-gradient(135deg, #4a7c59 0%, #3a6b4a 100%);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-upload:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 124, 89, 0.2);
}

.upload-hint {
  font-size: 11px;
  color: var(--text3);
  margin: 12px 0 0 0;
}

.files-list {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  background: var(--surface2);
}

.files-list h4 {
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: var(--surface);
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 13px;
}

.file-item:last-child {
  margin-bottom: 0;
}

.file-name {
  flex: 1;
  color: var(--text);
  word-break: break-word;
}

.file-size {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--text3);
  min-width: 50px;
  text-align: right;
}

.btn-remove {
  background: none;
  border: none;
  color: var(--text3);
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  transition: color 0.2s;
}

.btn-remove:hover {
  color: #ff6b6b;
}

.error-box {
  padding: 12px;
  background: #2a1a1a;
  border: 1px solid #5a3030;
  border-radius: 6px;
  color: #ff6b6b;
  font-size: 12px;
}
</style>
