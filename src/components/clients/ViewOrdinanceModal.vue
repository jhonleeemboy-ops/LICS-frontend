<template>
  <div v-if="modalStore.showViewOrdinanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto" @click.self="modalStore.closeViewOrdinanceModal">
    <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">{{ ordinance.title }}</h3>
          <p class="text-gray-600 mt-1">{{ ordinance.ordinanceNumber }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="editOrdinance"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <font-awesome-icon icon="pen-to-square" />
            <span>Edit</span>
          </button>
          <button @click="modalStore.closeViewOrdinanceModal" class="text-gray-500 hover:text-gray-700">
            <font-awesome-icon icon="xmark" class="text-2xl" />
          </button>
        </div>
      </div>

      <!-- Status Badge -->
      <div class="mb-6">
        <span :class="getStatusClass(ordinance.status)" class="px-3 py-1 rounded-full text-sm font-medium">
          {{ ordinance.status }}
        </span>
      </div>

      <!-- Ordinance Details -->
      <div class="space-y-6">
        <!-- Category and Effective Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Category</h4>
            <p class="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg inline-block">
              {{ ordinance.category }}
            </p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Effective Date</h4>
            <p class="text-gray-900 font-medium">{{ formatDate(ordinance.effectiveDate) }}</p>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h4 class="text-sm font-medium text-gray-500 mb-2">Description</h4>
          <p class="text-gray-900">{{ ordinance.description }}</p>
        </div>

        <!-- Content -->
        <div>
          <h4 class="text-sm font-medium text-gray-500 mb-2">Full Content</h4>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre class="whitespace-pre-wrap text-gray-900 text-sm font-sans">{{ ordinance.content }}</pre>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="ordinance.tags && ordinance.tags.length > 0">
          <h4 class="text-sm font-medium text-gray-500 mb-2">Tags</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in ordinance.tags" 
              :key="tag"
              class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Views</h4>
            <p class="text-2xl font-bold text-amber-700 flex items-center gap-2">
              <font-awesome-icon icon="eye" class="text-lg" />
              {{ ordinance.views }}
            </p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Last Updated</h4>
            <p class="text-gray-900 font-medium">{{ formatDate(ordinance.lastUpdated) }}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Status</h4>
            <p class="text-gray-900 font-medium capitalize">{{ ordinance.status }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-6 border-t border-gray-200">
        <button 
          @click="modalStore.closeViewOrdinanceModal"
          class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
        <button 
          @click="editOrdinance"
          class="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
        >
          <font-awesome-icon icon="pen-to-square" />
          <span>Edit Ordinance</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()

// Computed property for current ordinance
const ordinance = computed(() => modalStore.modalData.ordinance || {})

const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'draft': 'bg-yellow-100 text-yellow-800',
    'archived': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const editOrdinance = () => {
  modalStore.closeViewOrdinanceModal()
  modalStore.openOrdinanceModal(ordinance.value)
}
</script>

<style scoped>
/* Custom scrollbar for modal */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b45309;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>