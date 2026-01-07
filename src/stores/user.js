    import { defineStore } from 'pinia'
    import { ref, computed } from 'vue'

    export const useUserStore = defineStore('user', () => {
    // State
    const user = ref({
        id: 1,
        name: 'John Doe',
        email: 'client@demo.com',
        role: 'client',
        phone: '+63 912 345 6789',
        address: 'Butuan City, Agusan del Norte',
        profileImage: null,
        lastLogin: new Date().toISOString()
    })

    const isAuthenticated = ref(true)

    // Getters
    const userInitials = computed(() => {
        if (!user.value.name) return 'U'
        return user.value.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })

    const isAdmin = computed(() => {
        return user.value.role === 'admin'
    })

    const isLawyer = computed(() => {
        return user.value.role === 'lawyer'
    })

    const isClient = computed(() => {
        return user.value.role === 'client'
    })

    // Actions
    const updateProfile = (profileData) => {
        user.value = { ...user.value, ...profileData }
        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(user.value))
    }

    const loadProfileFromStorage = () => {
        const savedProfile = localStorage.getItem('userProfile')
        if (savedProfile) {
        user.value = JSON.parse(savedProfile)
        }
    }

    const clearProfile = () => {
        user.value = null
        localStorage.removeItem('userProfile')
        isAuthenticated.value = false
    }

    const setUser = (userData) => {
        user.value = userData
        isAuthenticated.value = true
        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(user.value))
    }

    const logout = () => {
        clearProfile()
    }

    return {
        // State
        user,
        isAuthenticated,
        
        // Getters
        userInitials,
        isAdmin,
        isLawyer,
        isClient,
        
        // Actions
        updateProfile,
        loadProfileFromStorage,
        clearProfile,
        setUser,
        logout
    }
    })