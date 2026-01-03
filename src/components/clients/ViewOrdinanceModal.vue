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

      <!-- ... rest of the component remains the same ... -->

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
          class="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Edit Ordinance
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()

// Computed property for current ordinance
const ordinance = computed(() => modalStore.modalData.ordinance)

// ... rest of the component logic remains the same

const editOrdinance = () => {
  modalStore.openOrdinanceModal(ordinance.value)
}
</script>