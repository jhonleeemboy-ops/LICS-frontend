import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export const useLawyerStore = defineStore('lawyer', () => {
  // State
  const appointments = ref([
    {
      id: 1,
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      clientPhone: '+63 912 345 6789',
      date: '2024-01-20',
      time: '10:00 AM',
      category: 'Business Law',
      status: 'Pending',
      notes: 'Need consultation for business registration',
      location: 'Butuan City Legal Office, Room 101',
      contact: '085-342-1234'
    },
    {
      id: 2,
      clientName: 'Maria Santos',
      clientEmail: 'maria@example.com',
      clientPhone: '+63 912 345 6789',
      date: '2024-01-22',
      time: '2:00 PM',
      category: 'Family Law',
      status: 'Accepted',
      notes: 'Divorce proceedings consultation',
      location: 'Butuan City Hall, Legal Department',
      contact: '085-342-5678'
    },
    {
      id: 3,
      clientName: 'Carlos Lim',
      clientEmail: 'carlos@example.com',
      clientPhone: '+63 912 345 6789',
      date: '2024-01-18',
      time: '11:00 AM',
      category: 'Property Law',
      status: 'Rejected',
      notes: 'Property dispute case'
    },
    {
      id: 4,
      clientName: 'Anna Reyes',
      clientEmail: 'anna@example.com',
      clientPhone: '+63 912 345 6789',
      date: '2024-01-25',
      time: '3:00 PM',
      category: 'Criminal Law',
      status: 'Pending',
      notes: 'Traffic violation defense'
    },
    {
      id: 5,
      clientName: 'Robert Tan',
      clientEmail: 'robert@example.com',
      clientPhone: '+63 912 345 6789',
      date: '2024-01-19',
      time: '9:00 AM',
      category: 'Employment Law',
      status: 'Accepted',
      notes: 'Wrongful termination case'
    }
  ])

  const activeFilter = ref('all')
  const selectedAppointment = ref(null)
  const isLoading = ref(false)

  // Lawyer Profile
  const lawyerProfile = ref({
    name: 'Attorney Jane Smith',
    email: 'lawyer@demo.com',
    barNumber: 'PH-2024-00123',
    specialization: 'Business & Family Law',
    yearsOfPractice: 8,
    rating: 4.8,
    consultationFee: '₱2,500/hour',
    availableSlots: ['Mon-Fri: 9AM-5PM'],
    bio: 'Specialized in business registration and family law matters with 8 years of experience.'
  })

  // Stats
  const stats = computed(() => {
    const total = appointments.value.length
    const pending = appointments.value.filter(a => a.status === 'Pending').length
    const accepted = appointments.value.filter(a => a.status === 'Accepted').length
    const rejected = appointments.value.filter(a => a.status === 'Rejected').length
    
    return {
      total,
      pending,
      accepted,
      rejected
    }
  })

  // Filters
  const filters = computed(() => [
    { key: 'all', label: 'All Appointments', icon: 'list-check', count: stats.value.total },
    { key: 'pending', label: 'Pending', icon: 'clock', count: stats.value.pending },
    { key: 'accepted', label: 'Accepted', icon: 'circle-check', count: stats.value.accepted },
    { key: 'rejected', label: 'Rejected', icon: 'circle-xmark', count: stats.value.rejected }
  ])

  // Filtered Appointments
  const filteredAppointments = computed(() => {
    if (activeFilter.value === 'all') {
      return appointments.value
    }
    return appointments.value.filter(
      apt => apt.status.toLowerCase() === activeFilter.value
    )
  })

  // Getters for Status Classes
  const getStatusClass = (status) => {
    const classes = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'clock',
      'Accepted': 'check',
      'Rejected': 'xmark',
      'Completed': 'circle-check',
      'Cancelled': 'ban'
    }
    return icons[status] || 'question'
  }

  // Actions
  const fetchAppointments = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      // In real app, you would fetch from API:
      // const response = await fetch('/api/lawyer/appointments')
      // appointments.value = await response.json()
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      isLoading.value = false
    }
  }

  const acceptAppointment = async (appointmentId) => {
    try {
      const appointment = appointments.value.find(a => a.id === appointmentId)
      if (appointment) {
        appointment.status = 'Accepted'
        
        // Simulate API call
        // await fetch(`/api/appointments/${appointmentId}/accept`, { method: 'PUT' })
        
        return { success: true, message: 'Appointment accepted successfully!' }
      }
    } catch (error) {
      console.error('Error accepting appointment:', error)
      return { success: false, message: 'Failed to accept appointment' }
    }
  }

  const rejectAppointment = async (appointmentId) => {
    try {
      const appointment = appointments.value.find(a => a.id === appointmentId)
      if (appointment) {
        appointment.status = 'Rejected'
        
        // Simulate API call
        // await fetch(`/api/appointments/${appointmentId}/reject`, { method: 'PUT' })
        
        return { success: true, message: 'Appointment rejected.' }
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error)
      return { success: false, message: 'Failed to reject appointment' }
    }
  }

  const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
    try {
      const appointment = appointments.value.find(a => a.id === appointmentId)
      if (appointment) {
        appointment.date = newDate
        appointment.time = newTime
        appointment.status = 'Rescheduled'
        
        // Simulate API call
        // await fetch(`/api/appointments/${appointmentId}/reschedule`, {
        //   method: 'PUT',
        //   body: JSON.stringify({ date: newDate, time: newTime })
        // })
        
        return { success: true, message: 'Appointment rescheduled!' }
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
      return { success: false, message: 'Failed to reschedule appointment' }
    }
  }

  const addNoteToAppointment = (appointmentId, note) => {
    const appointment = appointments.value.find(a => a.id === appointmentId)
    if (appointment) {
      appointment.notes = appointment.notes 
        ? `${appointment.notes}\n\n[Lawyer Note - ${new Date().toLocaleDateString()}]: ${note}`
        : `[Lawyer Note - ${new Date().toLocaleDateString()}]: ${note}`
    }
  }

  const selectAppointment = (appointment) => {
    selectedAppointment.value = appointment
  }

  const clearSelectedAppointment = () => {
    selectedAppointment.value = null
  }

  const setActiveFilter = (filter) => {
    activeFilter.value = filter
  }

  const updateProfile = (profileData) => {
    lawyerProfile.value = { ...lawyerProfile.value, ...profileData }
    // Save to localStorage
    localStorage.setItem('lawyerProfile', JSON.stringify(lawyerProfile.value))
  }

  const loadProfileFromStorage = () => {
    const savedProfile = localStorage.getItem('lawyerProfile')
    if (savedProfile) {
      lawyerProfile.value = JSON.parse(savedProfile)
    }
  }

  const getAppointment = (appointmentId) => {
    return appointments.value.find(apt => apt.id === appointmentId)
  }

  const getAppointmentsByDate = (date) => {
    return appointments.value.filter(apt => apt.date === date)
  }

  const getUpcomingAppointments = (limit = 5) => {
    const upcoming = appointments.value
      .filter(apt => apt.status === 'Accepted')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    
    return upcoming.slice(0, limit)
  }

  const getClientHistory = (clientEmail) => {
    return appointments.value.filter(apt => apt.clientEmail === clientEmail)
  }

  return {
    // State
    appointments,
    activeFilter,
    selectedAppointment,
    isLoading,
    lawyerProfile,
    
    // Getters
    stats,
    filters,
    filteredAppointments,
    getStatusClass,
    getStatusIcon,
    
    // Actions
    fetchAppointments,
    acceptAppointment,
    rejectAppointment,
    rescheduleAppointment,
    addNoteToAppointment,
    selectAppointment,
    clearSelectedAppointment,
    setActiveFilter,
    updateProfile,
    loadProfileFromStorage,
    getAppointment,
    getAppointmentsByDate,
    getUpcomingAppointments,
    getClientHistory
  }
})