import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // Modal States
  const showOrdinanceModal = ref(false)
  const showAddCategoryModal = ref(false)
  const showViewOrdinanceModal = ref(false)
  
  // Modal Data
  const modalData = reactive({
    ordinance: null, // For edit/view
    category: null,  // For category operations
    mode: 'add'      // 'add' or 'edit'
  })

  // Actions for Ordinance Modal
  const openOrdinanceModal = (ordinance = null) => {
    showOrdinanceModal.value = true
    modalData.ordinance = ordinance
    modalData.mode = ordinance ? 'edit' : 'add'
  }

  const closeOrdinanceModal = () => {
    showOrdinanceModal.value = false
    modalData.ordinance = null
    modalData.mode = 'add'
  }

  // Actions for Add Category Modal
  const openAddCategoryModal = () => {
    showAddCategoryModal.value = true
  }

  const closeAddCategoryModal = () => {
    showAddCategoryModal.value = false
  }

  // Actions for View Ordinance Modal
  const openViewOrdinanceModal = (ordinance) => {
    showViewOrdinanceModal.value = true
    modalData.ordinance = ordinance
  }

  const closeViewOrdinanceModal = () => {
    showViewOrdinanceModal.value = false
    modalData.ordinance = null
  }

  // Close all modals
  const closeAllModals = () => {
    showOrdinanceModal.value = false
    showAddCategoryModal.value = false
    showViewOrdinanceModal.value = false
    modalData.ordinance = null
    modalData.category = null
    modalData.mode = 'add'
  }

  return {
    // Modal States
    showOrdinanceModal,
    showAddCategoryModal,
    showViewOrdinanceModal,
    
    // Modal Data
    modalData,
    
    // Actions
    openOrdinanceModal,
    closeOrdinanceModal,
    openAddCategoryModal,
    closeAddCategoryModal,
    openViewOrdinanceModal,
    closeViewOrdinanceModal,
    closeAllModals
  }
})