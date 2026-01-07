    // src/stores/appointment.js
    import { defineStore } from 'pinia'
    import { ref, computed } from 'vue'
    import { useAuthStore } from './auth'
    import { api } from '@/services/api'

    export const useAppointmentStore = defineStore('appointment', () => {
    const authStore = useAuthStore()

    // State
    const appointments = ref([])
    const lawyers = ref([]) // Will be populated from API
    const bookingForm = ref({
        lawyer_id: null,
        schedule_date: '',
        notes: '',
    })
    const showBookingModal = ref(false)
    const loading = ref(false)
    const error = ref(null)
    const lawyersLoading = ref(false)

    // Getters
    const upcomingAppointments = computed(() =>
        appointments.value.filter(
        a => a.status === 'pending' || a.status === 'accepted' || a.status === 'Pending' || a.status === 'Accepted'
        )
    )

    const pastAppointments = computed(() =>
        appointments.value.filter(
        a => a.status === 'completed' || a.status === 'cancelled' || a.status === 'Completed' || a.status === 'Cancelled'
        )
    )

    const pendingCount = computed(
        () => appointments.value.filter(a => a.status === 'pending' || a.status === 'Pending').length
    )

    const appointmentsByStatus = computed(() => ({
        all: appointments.value.length,
        pending: appointments.value.filter(a => a.status === 'pending' || a.status === 'Pending').length,
        accepted: appointments.value.filter(a => a.status === 'accepted' || a.status === 'Accepted').length,
        rejected: appointments.value.filter(a => a.status === 'rejected' || a.status === 'Rejected').length,
    }))

    // Get lawyers by category
    const getLawyersByCategory = (category) => {
        if (!category) return lawyers.value
        
        return lawyers.value.filter(lawyer => {
        // Check if lawyer has specializations field
        if (lawyer.specializations) {
            return lawyer.specializations.includes(category)
        }
        // Check if lawyer has categories field
        if (lawyer.categories) {
            return lawyer.categories.includes(category)
        }
        // If no filtering available, return all lawyers
        return true
        })
    }

    // Fetch lawyers from API
    const fetchLawyers = async () => {
        lawyersLoading.value = true
        try {
        // Try to fetch from your API endpoint for lawyers
        const data = await api.get('/lawyers') // or '/users?role=lawyer' depending on your API
        lawyers.value = data.map(lawyer => ({
            id: lawyer.id,
            name: lawyer.name || `${lawyer.first_name} ${lawyer.last_name}`,
            email: lawyer.email,
            specializations: lawyer.specializations || [],
            categories: lawyer.categories || [],
            available: lawyer.available !== false, // default to true if not specified
            rating: lawyer.rating || 0,
            // Include any other fields your API returns
            ...lawyer
        }))
        console.log('Loaded lawyers:', lawyers.value)
        } catch (e) {
        console.error('Failed to load lawyers:', e)
        // Keep lawyers array empty if API fails
        lawyers.value = []
        } finally {
        lawyersLoading.value = false
        }
    }

    // Actions: load appointments for logged-in client
    const fetchClientAppointments = async () => {
        loading.value = true
        error.value = null
        try {
        const data = await api.get('/appointments/client')
        appointments.value = data
        } catch (e) {
        console.error('Failed to load appointments:', e)
        error.value = e.message || 'Failed to load appointments'
        throw e
        } finally {
        loading.value = false
        }
    } 

    // Lawyer appointments
    const fetchLawyerAppointments = async () => {
        loading.value = true
        error.value = null
        try {
        const data = await api.get('/appointments/lawyer')
        appointments.value = data
        } catch (e) {
        console.error('Failed to load lawyer appointments:', e)
        error.value = e.message || 'Failed to load lawyer appointments'
        throw e
        } finally {
        loading.value = false
        }
    }

    // Initialize appointments - used by lawyer store
    const initializeAppointments = async () => {
        const authStore = useAuthStore()
        if (authStore.user?.role === 'client') {
        await fetchClientAppointments()
        } else if (authStore.user?.role === 'lawyer') {
        await fetchLawyerAppointments()
        }
    }

    // Book appointment
    const bookAppointment = async (data) => {
        loading.value = true
        error.value = null
        try {
        const payload = {
            lawyer_id: data.lawyer_id || data.lawyerId,
            schedule_date: data.schedule_date || `${data.date} ${data.time}`,
            notes: data.notes || data.description || '',
        }

        const created = await api.post('/appointments', payload)
        
        // Fetch the lawyer details to include in appointment
        const lawyer = lawyers.value.find(l => l.id === payload.lawyer_id)
        
        const appointmentWithDetails = {
            ...created,
            lawyer: lawyer?.name || 'Unknown Lawyer',
            date: data.date,
            time: data.time,
            category: data.category,
            consultationType: data.consultationType
        }
        
        appointments.value.unshift(appointmentWithDetails)
        return appointmentWithDetails
        } catch (e) {
        console.error('Failed to book appointment:', e)
        error.value = e.message || 'Failed to book appointment'
        throw e
        } finally {
        loading.value = false
        }
    }

    // Update appointment - used by lawyer store
    const updateAppointment = (appointmentId, updates) => {
        const index = appointments.value.findIndex(apt => apt.id === appointmentId)
        if (index !== -1) {
        appointments.value[index] = {
            ...appointments.value[index],
            ...updates
        }
        }
    }

    // Reschedule appointment - used by lawyer store
    const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
        loading.value = true
        error.value = null
        try {
        // Combine date and time
        const schedule_date = `${newDate} ${newTime}`
        
        // Update via API if needed
        const updated = await api.put(`/appointments/${appointmentId}`, {
            schedule_date
        })
        
        // Update local state
        updateAppointment(appointmentId, {
            schedule_date,
            date: newDate,
            time: newTime,
            status: 'Rescheduled'
        })
        
        return updated
        } catch (e) {
        console.error('Failed to reschedule appointment:', e)
        error.value = e.message || 'Failed to reschedule appointment'
        throw e
        } finally {
        loading.value = false
        }
    }

    // Cancel appointment
    const cancelAppointment = async (appointmentId) => {
        loading.value = true
        error.value = null
        try {
        await api.patch(`/appointments/${appointmentId}`, { status: 'cancelled' })
        const appointment = appointments.value.find(a => a.id === appointmentId)
        if (appointment) {
            appointment.status = 'cancelled'
        }
        } catch (e) {
        console.error('Failed to cancel appointment:', e)
        error.value = e.message || 'Failed to cancel appointment'
        throw e
        } finally {
        loading.value = false
        }
    }

    // UI helpers
    const openBookingModal = () => {
        showBookingModal.value = true
    }

    const closeBookingModal = () => {
        showBookingModal.value = false
        resetBookingForm()
    }

    const resetBookingForm = () => {
        bookingForm.value = {
        lawyer_id: null,
        schedule_date: '',
        notes: '',
        }
    }

    const getAppointment = (id) => {
        return appointments.value.find(a => a.id === id)
    }

    return {
        // state
        appointments,
        lawyers,
        bookingForm,
        showBookingModal,
        loading,
        error,
        lawyersLoading,
        // getters
        upcomingAppointments,
        pastAppointments,
        pendingCount,
        appointmentsByStatus,
        // actions
        fetchClientAppointments,
        fetchLawyerAppointments,
        initializeAppointments, // ✓ Added
        fetchLawyers,
        bookAppointment,
        updateAppointment, // ✓ Added
        rescheduleAppointment, // ✓ Added
        cancelAppointment,
        getLawyersByCategory,
        openBookingModal,
        closeBookingModal,
        resetBookingForm,
        getAppointment,
    }
    })