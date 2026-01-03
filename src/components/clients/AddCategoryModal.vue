<template>
  <div v-if="modalStore.showAddCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="modalStore.closeAddCategoryModal">
    <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">Add New Category</h3>
        <button @click="modalStore.closeAddCategoryModal" class="text-gray-500 hover:text-gray-700">
          <font-awesome-icon icon="xmark" class="text-2xl" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm">
        <div class="space-y-4">
          <!-- Category Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              v-model="categoryName"
              type="text"
              placeholder="e.g., Public Health & Safety"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <!-- Description (Optional) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              v-model="description"
              rows="3"
              placeholder="Brief description of this category..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            ></textarea>
          </div>

          <!-- Existing Categories -->
          <div v-if="ordinanceStore.categories.length > 0">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Existing Categories
            </label>
            <div class="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="category in ordinanceStore.categories" 
                  :key="category"
                  class="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ category }}
                  <button 
                    type="button"
                    @click="categoryName = category"
                    class="text-blue-600 hover:text-blue-800 text-xs"
                    title="Use this category"
                  >
                    <font-awesome-icon icon="arrow-up" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button 
            type="button"
            @click="modalStore.closeAddCategoryModal"
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useOrdinanceStore } from '@/stores/ordinance'

const modalStore = useModalStore()
const ordinanceStore = useOrdinanceStore()

const categoryName = ref('')
const description = ref('')

const submitForm = () => {
  if (!categoryName.value.trim()) {
    alert('Please enter a category name')
    return
  }

  // Check if category already exists
  if (ordinanceStore.categories.includes(categoryName.value)) {
    alert('This category already exists')
    return
  }

  // Add category via ordinance store
  ordinanceStore.addCategory(categoryName.value)
  
  // Close modal
  modalStore.closeAddCategoryModal()
  
  // Reset form
  categoryName.value = ''
  description.value = ''
}
</script>