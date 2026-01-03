<template>
  <div v-if="modalStore.showOrdinanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto" @click.self="modalStore.closeOrdinanceModal">
    <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Ordinance' : 'Add New Ordinance' }}
        </h3>
        <button @click="modalStore.closeOrdinanceModal" class="text-gray-500 hover:text-gray-700">
          <font-awesome-icon icon="xmark" class="text-2xl" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ordinance Title *
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            placeholder="e.g., Anti-Smoking Ordinance"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <!-- Ordinance Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ordinance Number *
          </label>
          <input
            v-model="formData.ordinanceNumber"
            type="text"
            required
            placeholder="e.g., Ordinance No. 2024-01"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            v-model="formData.category"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Select a category</option>
            <option v-for="category in ordinanceStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <textarea
            v-model="formData.description"
            required
            rows="2"
            placeholder="Brief description of the ordinance"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          ></textarea>
        </div>

        <!-- Full Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Full Content *
          </label>
          <textarea
            v-model="formData.content"
            required
            rows="10"
            placeholder="Enter the full text of the ordinance..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Tip: Use line breaks and formatting to make the content easy to read
          </p>
        </div>

        <!-- Effective Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Effective Date *
          </label>
          <input
            v-model="formData.effectiveDate"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            v-model="tagsInput"
            type="text"
            placeholder="e.g., business, permit, registration"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
            <span 
              v-for="(tag, index) in formData.tags" 
              :key="index"
              class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-2"
            >
              {{ tag }}
              <button 
                type="button"
                @click="removeTag(index)"
                class="hover:text-amber-900"
              >
                <font-awesome-icon icon="xmark" class="text-xs" />
              </button>
            </span>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            v-model="formData.status"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            Select "Active" to publish immediately or "Draft" to save for later
          </p>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button 
            type="button"
            @click="modalStore.closeOrdinanceModal"
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            <font-awesome-icon icon="save" />
            <span>{{ isEditMode ? 'Update Ordinance' : 'Create Ordinance' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useOrdinanceStore } from '@/stores/ordinance'

const modalStore = useModalStore()
const ordinanceStore = useOrdinanceStore()

// Computed properties
const isEditMode = computed(() => modalStore.modalData.mode === 'edit')
const currentOrdinance = computed(() => modalStore.modalData.ordinance)

const formData = ref({
  title: '',
  ordinanceNumber: '',
  category: '',
  description: '',
  content: '',
  effectiveDate: '',
  status: 'draft',
  tags: []
})

const tagsInput = ref('')

// Watch for tags input changes
watch(tagsInput, (newValue) => {
  if (newValue) {
    // Split by comma and clean up
    formData.value.tags = newValue
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  } else {
    formData.value.tags = []
  }
})

// Watch for modal opening with data
watch(() => modalStore.showOrdinanceModal, (isOpen) => {
  if (isOpen && currentOrdinance.value && isEditMode.value) {
    // Load existing ordinance data
    formData.value = {
      title: currentOrdinance.value.title || '',
      ordinanceNumber: currentOrdinance.value.ordinanceNumber || '',
      category: currentOrdinance.value.category || '',
      description: currentOrdinance.value.description || '',
      content: currentOrdinance.value.content || '',
      effectiveDate: currentOrdinance.value.effectiveDate || '',
      status: currentOrdinance.value.status || 'draft',
      tags: currentOrdinance.value.tags || []
    }
    tagsInput.value = formData.value.tags.join(', ')
  } else if (isOpen && !isEditMode.value) {
    // Reset form for new ordinance
    formData.value = {
      title: '',
      ordinanceNumber: '',
      category: '',
      description: '',
      content: '',
      effectiveDate: '',
      status: 'draft',
      tags: []
    }
    tagsInput.value = ''
  }
})

const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
  tagsInput.value = formData.value.tags.join(', ')
}

const submitForm = () => {
  // Validate form
  if (!formData.value.title.trim()) {
    alert('Please enter a title for the ordinance')
    return
  }
  
  if (!formData.value.ordinanceNumber.trim()) {
    alert('Please enter an ordinance number')
    return
  }
  
  if (!formData.value.category) {
    alert('Please select a category')
    return
  }
  
  if (!formData.value.description.trim()) {
    alert('Please enter a description')
    return
  }
  
  if (!formData.value.content.trim()) {
    alert('Please enter the ordinance content')
    return
  }
  
  if (!formData.value.effectiveDate) {
    alert('Please select an effective date')
    return
  }
  
  // Prepare data
  const ordinanceData = {
    ...formData.value,
    tags: [...new Set(formData.value.tags)],
    lastUpdated: new Date().toISOString().split('T')[0]
  }
  
  // Save ordinance using ordinance store
  if (isEditMode.value && currentOrdinance.value) {
    ordinanceStore.updateOrdinance(currentOrdinance.value.id, ordinanceData)
    alert('Ordinance updated successfully!')
  } else {
    ordinanceStore.addOrdinance(ordinanceData)
    alert('Ordinance created successfully!')
  }
  
  // Close modal
  modalStore.closeOrdinanceModal()
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

textarea {
  resize: vertical;
}
</style>