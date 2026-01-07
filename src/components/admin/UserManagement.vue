<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">User Management</h1>
      <p class="text-gray-600">Create and manage user accounts</p>
    </div>

    <!-- Create User Card -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Create New User</h2>
        <font-awesome-icon icon="user-plus" class="text-amber-600 text-xl" />
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center gap-3">
          <font-awesome-icon icon="check-circle" class="text-green-500" />
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-3">
          <font-awesome-icon icon="circle-exclamation" class="text-red-500" />
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="createUser" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              v-model="newUser.name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter full name"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              v-model="newUser.email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter email address"
              required
            />
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">
              Role <span class="text-red-500">*</span>
            </label>
            <select
              id="role"
              v-model="newUser.role"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            >
              <option value="">Select role</option>
              <option value="client">Client</option>
              <option value="lawyer">Lawyer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              v-model="newUser.phone"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="+63 912 345 6789"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="newUser.password"
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span class="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              v-model="newUser.confirmPassword"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="address"
            v-model="newUser.address"
            rows="2"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter address"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="creating"
            class="px-6 py-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon v-if="creating" icon="circle-notch" class="animate-spin" />
            <font-awesome-icon v-else icon="user-plus" />
            {{ creating ? 'Creating...' : 'Create User' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Users List -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Registered Users</h2>
        <span class="text-sm text-gray-500">{{ users.length }} users</span>
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <span class="text-amber-700 font-semibold text-sm">{{ getUserInitials(user.name) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">{{ user.phone || 'No phone' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span
                  :class="{
                    'bg-blue-100 text-blue-700': user.role === 'client',
                    'bg-purple-100 text-purple-700': user.role === 'lawyer',
                    'bg-red-100 text-red-700': user.role === 'admin'
                  }"
                  class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(user.createdAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button
                    @click="editUser(user)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="users.length === 0" class="text-center py-12">
          <font-awesome-icon icon="users" class="text-6xl text-gray-300 mb-4" />
          <p class="text-gray-500">No users registered yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const creating = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showPassword = ref(false)

const newUser = reactive({
  name: '',
  email: '',
  role: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: ''
})

const users = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'client@demo.com',
    role: 'client',
    phone: '+63 912 345 6789',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Attorney Jane Smith',
    email: 'lawyer@demo.com',
    role: 'lawyer',
    phone: '+63 923 456 7890',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 3,
    name: 'Administrator',
    email: 'admin@demo.com',
    role: 'admin',
    phone: '+63 934 567 8901',
    createdAt: new Date('2024-01-10')
  }
])

const createUser = async () => {
  try {
    creating.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Validate passwords match
    if (newUser.password !== newUser.confirmPassword) {
      errorMessage.value = 'Passwords do not match'
      return
    }

    // Check if email already exists
    if (users.value.some(u => u.email === newUser.email)) {
      errorMessage.value = 'Email already exists'
      return
    }

    // Create new user object
    const user = {
      id: users.value.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      createdAt: new Date()
    }

    // Add to users list
    users.value.push(user)

    // Save to localStorage
    localStorage.setItem('systemUsers', JSON.stringify(users.value))

    successMessage.value = `User "${newUser.name}" created successfully!`
    
    // Reset form after 2 seconds
    setTimeout(() => {
      resetForm()
      successMessage.value = ''
    }, 2000)

  } catch (error) {
    console.error('Error creating user:', error)
    errorMessage.value = 'Failed to create user. Please try again.'
  } finally {
    creating.value = false
  }
}

const resetForm = () => {
  newUser.name = ''
  newUser.email = ''
  newUser.role = ''
  newUser.phone = ''
  newUser.password = ''
  newUser.confirmPassword = ''
  newUser.address = ''
  errorMessage.value = ''
}

const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const editUser = (user) => {
  // Implement edit functionality
  console.log('Edit user:', user)
}

const deleteUser = (userId) => {
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(u => u.id !== userId)
    localStorage.setItem('systemUsers', JSON.stringify(users.value))
    successMessage.value = 'User deleted successfully'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  }
}

// Load users from localStorage on mount
onMounted(() => {
  const savedUsers = localStorage.getItem('systemUsers')
  if (savedUsers) {
    users.value = JSON.parse(savedUsers)
  }
})
</script>