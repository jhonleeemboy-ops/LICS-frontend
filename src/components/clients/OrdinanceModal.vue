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
        <!-- Form fields remain the same... -->
        
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
            class="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            {{ isEditMode ? 'Update Ordinance' : 'Create Ordinance' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

// ... rest of the component logic remains the same

const submitForm = () => {
  // Validate form
  if (!formData.value.title.trim()) {
    alert('Please enter a title for the ordinance')
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
  } else {
    ordinanceStore.addOrdinance(ordinanceData)
  }
  
  // Close modal
  modalStore.closeOrdinanceModal()
}
</script>