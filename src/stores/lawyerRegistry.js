// stores/lawyerRegistry.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLawyerRegistryStore = defineStore('lawyerRegistry', () => {
  // State - All registered lawyers (for appointment booking)
  const registeredLawyers = ref([])
  
  // Initialize from localStorage
  const initializeLawyers = () => {
    const savedLawyers = localStorage.getItem('registeredLawyers')
    if (savedLawyers) {
      try {
        registeredLawyers.value = JSON.parse(savedLawyers)
      } catch (error) {
        console.error('Error loading registered lawyers:', error)
        registeredLawyers.value = []
        localStorage.setItem('registeredLawyers', JSON.stringify([]))
      }
    } else {
      registeredLawyers.value = []
      localStorage.setItem('registeredLawyers', JSON.stringify([]))
    }
  }

  // Get all available lawyers (for dropdown selection)
  const availableLawyers = computed(() => {
    return registeredLawyers.value.filter(lawyer => 
      lawyer.isActive && lawyer.isAvailable && lawyer.isVerified
    )
  })

  // Get lawyers by category/specialization
  const getLawyersByCategory = (category) => {
    if (!category) return []
    
    // Map appointment categories to lawyer specializations
    const categoryToSpecialization = {
      'Public Health & Safety': ['Health Law', 'Public Safety', 'Medical Law'],
      'Business & Commerce': ['Business Law', 'Corporate Law', 'Commercial Law'],
      'Land Use & Zoning': ['Property Law', 'Real Estate', 'Zoning Law'],
      'Environment & Natural Resources': ['Environmental Law', 'Natural Resources'],
      'Traffic & Transportation': ['Traffic Law', 'Transportation Law'],
      'Community & Social Services': ['Social Law', 'Community Law', 'Civil Rights'],
      'Family Law': ['Family Law', 'Divorce Law', 'Child Custody'],
      'Criminal Law': ['Criminal Law', 'Criminal Defense'],
      'Labor & Employment': ['Labor Law', 'Employment Law']
    }
    
    const specializations = categoryToSpecialization[category] || []
    
    return availableLawyers.value.filter(lawyer => {
      if (!lawyer.specializations || lawyer.specializations.length === 0) return false
      
      // Check if any of the lawyer's specializations match the category
      return lawyer.specializations.some(lawyerSpec => 
        specializations.some(catSpec => 
          lawyerSpec.toLowerCase().includes(catSpec.toLowerCase().split(' ')[0])
        )
      )
    })
  }

  // Register a new lawyer (from registration form)
  const registerLawyer = (lawyerData) => {
    const newLawyer = {
      id: Date.now().toString(),
      name: lawyerData.name,
      email: lawyerData.email,
      phone: lawyerData.phone || '',
      barNumber: lawyerData.barNumber || '',
      specializations: lawyerData.specializations || [],
      experience: lawyerData.experience || 0,
      rating: 0,
      ratingCount: 0,
      isAvailable: true,
      isActive: true,
      isVerified: false, // Needs admin verification
      officeLocation: lawyerData.officeLocation || '',
      consultationFee: lawyerData.consultationFee || 0,
      description: lawyerData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lawFirm: lawyerData.lawFirm || 'Independent Practice'
    }
    
    registeredLawyers.value.push(newLawyer)
    saveLawyersToStorage()
    
    return newLawyer
  }

  // Update lawyer profile
  const updateLawyer = (lawyerId, updates) => {
    const index = registeredLawyers.value.findIndex(l => l.id === lawyerId)
    if (index !== -1) {
      registeredLawyers.value[index] = { 
        ...registeredLawyers.value[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveLawyersToStorage()
    }
  }

  // Toggle availability
  const toggleAvailability = (lawyerId) => {
    const lawyer = registeredLawyers.value.find(l => l.id === lawyerId)
    if (lawyer) {
      lawyer.isAvailable = !lawyer.isAvailable
      saveLawyersToStorage()
    }
  }

  // Verify lawyer (admin function)
  const verifyLawyer = (lawyerId) => {
    const lawyer = registeredLawyers.value.find(l => l.id === lawyerId)
    if (lawyer) {
      lawyer.isVerified = true
      saveLawyersToStorage()
    }
  }

  // Get lawyer by ID
  const getLawyerById = (lawyerId) => {
    return registeredLawyers.value.find(l => l.id === lawyerId)
  }

  // Get lawyer by email
  const getLawyerByEmail = (email) => {
    return registeredLawyers.value.find(l => l.email === email)
  }

  // Get lawyer by name
  const getLawyerByName = (name) => {
    return registeredLawyers.value.find(l => l.name === name)
  }

  // Save to localStorage
  const saveLawyersToStorage = () => {
    localStorage.setItem('registeredLawyers', JSON.stringify(registeredLawyers.value))
  }

  // Sync with auth store users (run this when needed)
  const syncWithAuthStore = () => {
    // Get all users from auth store
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const lawyerUsers = registeredUsers.filter(user => user.role === 'lawyer')
    
    lawyerUsers.forEach(user => {
      // Check if lawyer already exists in registry
      const existingLawyer = getLawyerByEmail(user.email)
      
      if (!existingLawyer) {
        // Add to registry
        registerLawyer({
          name: user.name,
          email: user.email,
          barNumber: user.barNumber || '',
          specializations: [user.specialization || 'General Practice'],
          experience: user.yearsOfPractice || 0,
          lawFirm: user.lawFirm || 'Independent Practice'
        })
      }
    })
  }

  // Initialize on store creation
  initializeLawyers()

  return {
    // State
    registeredLawyers,
    
    // Getters
    availableLawyers,
    
    // Actions
    getLawyersByCategory,
    registerLawyer,
    updateLawyer,
    toggleAvailability,
    verifyLawyer,
    getLawyerById,
    getLawyerByEmail,
    getLawyerByName,
    syncWithAuthStore,
    initializeLawyers
  }
})